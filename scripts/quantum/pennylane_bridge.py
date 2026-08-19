#!/usr/bin/env python3
"""Isabella Quantum Bridge v3.

Governed multi-backend PennyLane runtime.

Supported adapters are discovered at runtime and never claimed unless the
corresponding plugin/device is actually available and execution succeeds:

- PennyLane default.qubit
- PennyLane Lightning variants
- PennyLane-Qiskit devices
- PennyLane-Rigetti devices, when the installed plugin supports them
- Amazon Braket devices, when the plugin and credentials are available

The process accepts one JSON request from stdin and emits one JSON response.
Run it behind an authenticated, policy-enforcing server. This worker does not
replace WebAuthn, ARGUS, HSM or TEE verification.
"""
from __future__ import annotations

import argparse
import hashlib
import hmac
import importlib
import importlib.util
import json
import math
import os
import platform
import sys
import time
import traceback
from dataclasses import dataclass
from typing import Any, Dict, List, Optional, Tuple

BRIDGE_VERSION = "quantum-bridge-v3"
SCHEMA_VERSION = "pennylane-request-v3"
MAX_INPUT_BYTES = int(os.getenv("QUANTUM_MAX_INPUT_BYTES", "65536"))
MAX_OUTPUT_BYTES = int(os.getenv("QUANTUM_MAX_OUTPUT_BYTES", "2097152"))
MAX_WIRES = int(os.getenv("QUANTUM_MAX_WIRES", "24"))
MAX_FEATURES = int(os.getenv("QUANTUM_MAX_FEATURES", "32"))
MAX_GATES = int(os.getenv("QUANTUM_MAX_GATES", "256"))
MAX_SHOTS = int(os.getenv("QUANTUM_MAX_SHOTS", "100000"))

REPOS = {
    "PennyLaneAI/pennylane": "https://github.com/PennyLaneAI/pennylane",
    "PennyLaneAI/pennylane-lightning": "https://github.com/PennyLaneAI/pennylane-lightning",
    "PennyLaneAI/pennylane-qiskit": "https://github.com/PennyLaneAI/pennylane-qiskit",
    "PennyLaneAI/catalyst": "https://github.com/PennyLaneAI/catalyst",
    "PennyLaneAI/pennylane-rigetti": "https://github.com/PennyLaneAI/pennylane-rigetti",
    "amazon-braket/amazon-braket-pennylane-plugin-python": "https://github.com/amazon-braket/amazon-braket-pennylane-plugin-python",
}

@dataclass(frozen=True)
class DeviceSpec:
    name: str
    implementation: str
    package_modules: Tuple[str, ...]
    scopes: Tuple[str, ...]
    remote: bool
    requires_credentials: Tuple[str, ...]
    repository: str
    experimental: bool = False


DEVICE_SPECS = {
    "default.qubit": DeviceSpec(
        "default.qubit", "PENNYLANE_SIMULATOR", ("pennylane",), (), False, (), "PennyLaneAI/pennylane"
    ),
    "lightning.qubit": DeviceSpec(
        "lightning.qubit", "PENNYLANE_LIGHTNING", ("pennylane", "pennylane_lightning"), ("quantum:lightning",), False, (), "PennyLaneAI/pennylane-lightning"
    ),
    "lightning.gpu": DeviceSpec(
        "lightning.gpu", "PENNYLANE_LIGHTNING_GPU", ("pennylane", "pennylane_lightning"), ("quantum:lightning", "quantum:gpu"), False, (), "PennyLaneAI/pennylane-lightning"
    ),
    "lightning.kokkos": DeviceSpec(
        "lightning.kokkos", "PENNYLANE_LIGHTNING_KOKKOS", ("pennylane", "pennylane_lightning"), ("quantum:lightning", "quantum:kokkos"), False, (), "PennyLaneAI/pennylane-lightning"
    ),
    "lightning.tensor": DeviceSpec(
        "lightning.tensor", "PENNYLANE_LIGHTNING_TENSOR", ("pennylane", "pennylane_lightning"), ("quantum:lightning", "quantum:tensor"), False, (), "PennyLaneAI/pennylane-lightning"
    ),
    "qiskit.aer": DeviceSpec(
        "qiskit.aer", "PENNYLANE_QISKIT", ("pennylane", "pennylane_qiskit"), ("quantum:qiskit",), False, (), "PennyLaneAI/pennylane-qiskit"
    ),
    "qiskit.basicsim": DeviceSpec(
        "qiskit.basicsim", "PENNYLANE_QISKIT", ("pennylane", "pennylane_qiskit"), ("quantum:qiskit",), False, (), "PennyLaneAI/pennylane-qiskit"
    ),
    "qiskit.remote": DeviceSpec(
        "qiskit.remote", "PENNYLANE_QISKIT_REMOTE", ("pennylane", "pennylane_qiskit"), ("quantum:qiskit", "quantum:remote"), True, ("QISKIT_IBM_TOKEN",), "PennyLaneAI/pennylane-qiskit"
    ),
    "rigetti.numpy_wavefunction": DeviceSpec(
        "rigetti.numpy_wavefunction", "PENNYLANE_RIGETTI_SIMULATOR", ("pennylane", "pennylane_rigetti"), ("quantum:rigetti",), False, (), "PennyLaneAI/pennylane-rigetti", True
    ),
    "rigetti.wavefunction": DeviceSpec(
        "rigetti.wavefunction", "PENNYLANE_RIGETTI_SIMULATOR", ("pennylane", "pennylane_rigetti"), ("quantum:rigetti",), False, (), "PennyLaneAI/pennylane-rigetti", True
    ),
    "rigetti.qvm": DeviceSpec(
        "rigetti.qvm", "PENNYLANE_RIGETTI_QVM", ("pennylane", "pennylane_rigetti"), ("quantum:rigetti", "quantum:remote"), True, ("RIGETTI_URL",), "PennyLaneAI/pennylane-rigetti", True
    ),
    "rigetti.qpu": DeviceSpec(
        "rigetti.qpu", "PENNYLANE_RIGETTI_QPU", ("pennylane", "pennylane_rigetti"), ("quantum:rigetti", "quantum:hardware"), True, ("RIGETTI_URL", "RIGETTI_API_KEY"), "PennyLaneAI/pennylane-rigetti", True
    ),
    "braket.aws.qubit": DeviceSpec(
        "braket.aws.qubit", "PENNYLANE_BRAKET", ("pennylane", "braket"), ("quantum:braket", "quantum:remote"), True, ("AWS_REGION",), "amazon-braket/amazon-braket-pennylane-plugin-python"
    ),
}

class BridgeError(Exception):
    def __init__(self, code: str, message: str, retryable: bool = False):
        super().__init__(message)
        self.code = code
        self.message = message
        self.retryable = retryable

@dataclass(frozen=True)
class Request:
    request_id: str
    tenant_id: str
    task: str
    device: str
    repository: str
    wires: int
    shots: Optional[int]
    features: Tuple[float, ...]
    weights: Tuple[float, ...]
    scopes: Tuple[str, ...]
    metadata: Dict[str, str]
    policy_version: str
    circuit_hash: str
    request_hash: str


def canonical(value: Any) -> bytes:
    return json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False, allow_nan=False).encode("utf-8")


def digest(value: Any, algorithm: str = "sha3_512") -> str:
    factory = getattr(hashlib, algorithm)
    return factory(canonical(value)).hexdigest()


def safe_string(value: Any, name: str, limit: int) -> str:
    if not isinstance(value, str) or not value.strip():
        raise BridgeError("INVALID_STRING", f"{name} must be non-empty")
    value = value.strip()
    if len(value) > limit:
        raise BridgeError("FIELD_TOO_LARGE", f"{name} exceeds its limit")
    return value


def finite(value: Any, name: str) -> float:
    if isinstance(value, bool):
        raise BridgeError("INVALID_NUMBER", f"{name} must be numeric")
    try:
        result = float(value)
    except (TypeError, ValueError) as exc:
        raise BridgeError("INVALID_NUMBER", f"{name} must be numeric") from exc
    if not math.isfinite(result):
        raise BridgeError("NON_FINITE_NUMBER", f"{name} must be finite")
    return result


def number_list(value: Any, name: str, maximum: int) -> Tuple[float, ...]:
    if value is None:
        return tuple()
    if not isinstance(value, list) or len(value) > maximum:
        raise BridgeError("INVALID_ARRAY", f"{name} exceeds its limit")
    return tuple(finite(item, name) for item in value)


def metadata(value: Any) -> Dict[str, str]:
    if value is None:
        return {}
    if not isinstance(value, dict) or len(value) > 32:
        raise BridgeError("INVALID_METADATA", "metadata is invalid")
    return {safe_string(k, "metadata key", 64): safe_string(str(v), "metadata value", 256) for k, v in value.items()}


def env_available(name: str) -> bool:
    value = os.getenv(name)
    if name == "AWS_REGION":
        return bool(value or os.getenv("AWS_DEFAULT_REGION"))
    return bool(value)


def validate_scopes(device: DeviceSpec, scopes: Tuple[str, ...]) -> None:
    required = {"quantum:execute", *device.scopes}
    missing = sorted(required.difference(scopes))
    if missing:
        raise BridgeError("MISSING_SCOPE", f"missing scopes: {','.join(missing)}")


def normalize(raw: Dict[str, Any]) -> Request:
    if not isinstance(raw, dict):
        raise BridgeError("INVALID_REQUEST", "request must be an object")
    if raw.get("schema", SCHEMA_VERSION) != SCHEMA_VERSION:
        raise BridgeError("UNSUPPORTED_SCHEMA", "unsupported schema")

    request_id = safe_string(raw.get("requestId"), "requestId", 128)
    tenant_id = safe_string(raw.get("tenantId", "default"), "tenantId", 128)
    task = safe_string(raw.get("task", "execute"), "task", 32)
    device_name = safe_string(raw.get("provider", raw.get("device", "default.qubit")), "provider", 96)
    repository = safe_string(raw.get("repository", DEVICE_SPECS.get(device_name, DEVICE_SPECS["default.qubit"]).repository), "repository", 160)

    if task not in {"execute", "diagnose"}:
        raise BridgeError("UNSUPPORTED_TASK", "task must be execute or diagnose")
    if device_name not in DEVICE_SPECS:
        raise BridgeError("UNSUPPORTED_DEVICE", "device is not registered")
    if repository not in REPOS:
        raise BridgeError("UNSUPPORTED_REPOSITORY", "repository is not registered")

    device = DEVICE_SPECS[device_name]
    if task == "execute" and repository != device.repository:
        raise BridgeError("REPOSITORY_DEVICE_MISMATCH", "repository does not own the device")

    raw_scopes = raw.get("scopes", [])
    if not isinstance(raw_scopes, list):
        raise BridgeError("INVALID_SCOPES", "scopes must be an array")
    scopes = tuple(safe_string(item, "scope", 128) for item in raw_scopes)
    validate_scopes(device, scopes)

    try:
        wires = int(raw.get("wires", 4))
    except (TypeError, ValueError) as exc:
        raise BridgeError("INVALID_WIRES", "wires must be integer") from exc
    if not 1 <= wires <= MAX_WIRES:
        raise BridgeError("WIRES_LIMIT_EXCEEDED", "wires exceed configured limits")

    try:
        raw_shots = int(raw.get("shots", 0) or 0)
    except (TypeError, ValueError) as exc:
        raise BridgeError("INVALID_SHOTS", "shots must be integer") from exc
    if not 0 <= raw_shots <= MAX_SHOTS:
        raise BridgeError("SHOTS_LIMIT_EXCEEDED", "shots exceed configured limits")
    shots = raw_shots or None

    features = number_list(raw.get("features", []), "features", MAX_FEATURES)
    weights = number_list(raw.get("weights", []), "weights", MAX_FEATURES)
    meta = metadata(raw.get("metadata", {}))
    policy_version = safe_string(raw.get("policyVersion", "quantum-policy-v1"), "policyVersion", 128)

    circuit = {
        "device": device_name,
        "wires": wires,
        "features": list(features[:wires]),
        "weights": list(weights[:wires]),
        "ansatz": "RY-RZ-chain-CNOT-expval-PauliZ-0",
    }
    request_definition = {
        "schema": SCHEMA_VERSION,
        "requestId": request_id,
        "tenantId": tenant_id,
        "task": task,
        "device": device_name,
        "repository": repository,
        "wires": wires,
        "shots": shots,
        "features": list(features),
        "weights": list(weights),
        "scopes": list(scopes),
        "metadata": meta,
        "policyVersion": policy_version,
    }

    return Request(
        request_id=request_id,
        tenant_id=tenant_id,
        task=task,
        device=device_name,
        repository=repository,
        wires=wires,
        shots=shots,
        features=features,
        weights=weights,
        scopes=scopes,
        metadata=meta,
        policy_version=policy_version,
        circuit_hash=digest(circuit, "sha3_512"),
        request_hash=digest(request_definition, "sha256"),
    )


def module_status(module_name: str) -> Dict[str, Any]:
    try:
        spec = importlib.util.find_spec(module_name)
        if spec is None:
            return {"available": False, "module": module_name}
        module = importlib.import_module(module_name)
        return {"available": True, "module": module_name, "version": getattr(module, "__version__", "unknown")}
    except Exception as exc:
        return {"available": False, "module": module_name, "error": str(exc)[:240]}


def device_capability(spec: DeviceSpec) -> Dict[str, Any]:
    modules = {name: module_status(name) for name in spec.package_modules}
    packages_ok = all(item["available"] for item in modules.values())
    credentials_ok = all(env_available(name) for name in spec.requires_credentials)
    available = packages_ok and credentials_ok
    return {
        "device": spec.name,
        "implementation": spec.implementation,
        "repository": spec.repository,
        "remote": spec.remote,
        "experimental": spec.experimental,
        "available": available,
        "credentialsConfigured": credentials_ok,
        "modules": modules,
        "requiredScopes": list(spec.scopes),
        "requiredCredentials": list(spec.requires_credentials),
    }


def diagnose(req: Request) -> Dict[str, Any]:
    return {
        "status": "ok",
        "implementation": "CAPABILITY_DIAGNOSTICS",
        "requestId": req.request_id,
        "tenantId": req.tenant_id,
        "requestHash": req.request_hash,
        "circuitHash": req.circuit_hash,
        "policyVersion": req.policy_version,
        "pythonVersion": platform.python_version(),
        "devices": {name: device_capability(spec) for name, spec in DEVICE_SPECS.items()},
        "repositories": REPOS,
    }


def _pennylane_device(req: Request):
    import pennylane as qml  # type: ignore
    spec = DEVICE_SPECS[req.device]

    if not device_capability(spec)["available"]:
        raise BridgeError("DEVICE_UNAVAILABLE", "device package or credentials unavailable", True)

    # Device-specific options must be supplied by a server-side profile, never
    # passed as arbitrary user kwargs.
    kwargs: Dict[str, Any] = {"wires": req.wires, "shots": req.shots}
    if req.device == "braket.aws.qubit":
        kwargs["device_arn"] = os.getenv("BRAKET_DEVICE_ARN")
        kwargs["s3_destination_folder"] = (
            os.getenv("BRAKET_S3_BUCKET"),
            os.getenv("BRAKET_S3_PREFIX", "isabella-quantum"),
        )
        if not kwargs["device_arn"] or not kwargs["s3_destination_folder"][0]:
            raise BridgeError("BRAKET_PROFILE_INCOMPLETE", "Braket server profile is incomplete")
    if req.device == "qiskit.remote":
        raise BridgeError("REMOTE_PROFILE_REQUIRED", "Qiskit remote requires a server-side profile", True)
    if req.device in {"rigetti.qvm", "rigetti.qpu"}:
        raise BridgeError("REMOTE_PROFILE_REQUIRED", "Rigetti remote requires a server-side profile", True)

    try:
        return qml, qml.device(req.device, **kwargs)
    except Exception as exc:
        raise BridgeError("DEVICE_INITIALIZATION_FAILED", str(exc)[:500], True) from exc


def run_pennylane(req: Request) -> Dict[str, Any]:
    import numpy as np  # type: ignore
    qml, dev = _pennylane_device(req)

    features = list(req.features[:req.wires])
    while len(features) < req.wires:
        features.append(0.0)
    weights = list(req.weights[:req.wires])
    while len(weights) < req.wires:
        weights.append(0.125 * (len(weights) + 1))

    @qml.qnode(dev)
    def circuit(x: Any, theta: Any):
        for index in range(req.wires):
            qml.RY(x[index], wires=index)
            qml.RZ(theta[index], wires=index)
        for index in range(max(0, req.wires - 1)):
            qml.CNOT(wires=[index, index + 1])
        return qml.expval(qml.PauliZ(0))

    expectation = float(circuit(np.array(features), np.array(weights)))
    return {
        "status": "ok",
        "implementation": DEVICE_SPECS[req.device].implementation,
        "repository": req.repository,
        "repositoryUrl": REPOS[req.repository],
        "pennylaneVersion": getattr(qml, "__version__", "unknown"),
        "provider": req.device,
        "tenantId": req.tenant_id,
        "requestId": req.request_id,
        "requestHash": req.request_hash,
        "circuitHash": req.circuit_hash,
        "policyVersion": req.policy_version,
        "wires": req.wires,
        "shots": req.shots or 0,
        "expectation": round(expectation, 8),
        "weights": [round(item, 8) for item in weights],
        "featuresUsed": len(features),
        "probabilities": [],
        "remote": DEVICE_SPECS[req.device].remote,
    }


def fallback(req: Request, reason: str) -> Dict[str, Any]:
    features = list(req.features[:MAX_FEATURES]) or [0.0, 0.5, 1.0]
    score = sum(math.cos(value + (index + 1) * 0.137) for index, value in enumerate(features)) / max(1, len(features))
    return {
        "status": "degraded",
        "implementation": "CLASSICAL_FALLBACK_NOT_QUANTUM",
        "reason": reason[:500],
        "repository": req.repository,
        "repositoryUrl": REPOS[req.repository],
        "provider": req.device,
        "tenantId": req.tenant_id,
        "requestId": req.request_id,
        "requestHash": req.request_hash,
        "circuitHash": req.circuit_hash,
        "policyVersion": req.policy_version,
        "featuresUsed": len(features),
        "expectation": round(score, 8),
        "weights": [],
        "probabilities": [],
        "remote": DEVICE_SPECS[req.device].remote,
    }


def error_payload(request_id: str, code: str, message: str, retryable: bool = False) -> Dict[str, Any]:
    return {
        "status": "error",
        "implementation": "CLASSICAL_FALLBACK_NOT_QUANTUM",
        "requestId": request_id,
        "error": {"code": code, "message": message[:500], "retryable": retryable},
    }


def finalize(payload: Dict[str, Any], started: float) -> Dict[str, Any]:
    payload["runtimeMs"] = int((time.perf_counter() - started) * 1000)
    payload["bridgeVersion"] = BRIDGE_VERSION
    payload["schemaVersion"] = SCHEMA_VERSION
    payload["workerId"] = os.getenv("ISABELLA_QUANTUM_WORKER_ID", "standalone")
    secret = os.getenv("QUANTUM_RESPONSE_HMAC_SECRET")
    if secret:
        payload["responseMac"] = hmac.new(secret.encode(), canonical(payload), hashlib.sha256).hexdigest()
    if len(canonical(payload)) > MAX_OUTPUT_BYTES:
        return error_payload(str(payload.get("requestId", "unknown")), "OUTPUT_LIMIT_EXCEEDED", "response too large")
    return payload


def process(raw: bytes) -> Dict[str, Any]:
    started = time.perf_counter()
    if len(raw) > MAX_INPUT_BYTES:
        return finalize(error_payload("unknown", "INPUT_LIMIT_EXCEEDED", "request too large"), started)
    try:
        decoded = json.loads(raw.decode("utf-8"))
    except Exception as exc:
        return finalize(error_payload("unknown", "INVALID_JSON", str(exc)), started)
    request_id = str(decoded.get("requestId", "unknown")) if isinstance(decoded, dict) else "unknown"
    try:
        req = normalize(decoded)
        if req.task == "diagnose":
            return finalize(diagnose(req), started)
        try:
            return finalize(run_pennylane(req), started)
        except BridgeError as exc:
            return finalize(fallback(req, f"{exc.code}:{exc.message}"), started)
        except Exception as exc:
            return finalize(fallback(req, f"PENNYLANE_EXECUTION_ERROR:{exc}"), started)
    except BridgeError as exc:
        return finalize(error_payload(request_id, exc.code, exc.message, exc.retryable), started)
    except Exception as exc:
        return finalize(error_payload(request_id, "BRIDGE_INTERNAL_ERROR", str(exc)), started)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--stdio", action="store_true")
    args = parser.parse_args()
    if not args.stdio:
        print("stdio mode required", file=sys.stderr)
        return 2
    raw = sys.stdin.buffer.read(MAX_INPUT_BYTES + 1)
    payload = process(raw)
    sys.stdout.write(json.dumps(payload, sort_keys=True, ensure_ascii=False) + "\n")
    sys.stdout.flush()
    return 0 if payload.get("status") != "error" else 2


if __name__ == "__main__":
    raise SystemExit(main())
