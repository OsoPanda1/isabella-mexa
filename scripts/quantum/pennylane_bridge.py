#!/usr/bin/env python3
"""Isabella ↔ PennyLane governed quantum bridge.

Reads a JSON request from stdin and returns a single JSON object on stdout.
If PennyLane or a selected plugin is unavailable, it returns a deterministic
classical fallback with status=degraded instead of claiming quantum execution.
"""
from __future__ import annotations

import hashlib
import json
import math
import os
import sys
import time
from typing import Any, Dict, List

REPOS = {
    "PennyLaneAI/pennylane": "https://github.com/PennyLaneAI/pennylane",
    "PennyLaneAI/pennylane-lightning": "https://github.com/PennyLaneAI/pennylane-lightning",
    "PennyLaneAI/pennylane-qiskit": "https://github.com/PennyLaneAI/pennylane-qiskit",
}


def _fallback(req: Dict[str, Any], reason: str) -> Dict[str, Any]:
    features = [float(x) for x in req.get("features", [])[:32]] or [0.0, 0.5, 1.0]
    digest = hashlib.sha256(json.dumps(req, sort_keys=True).encode()).hexdigest()
    score = sum(math.cos(v + (i + 1) * 0.137) for i, v in enumerate(features)) / max(1, len(features))
    return {
        "status": "degraded",
        "implementation": "CLASSICAL_FALLBACK_NOT_QUANTUM",
        "reason": reason,
        "repository": req.get("repository", "PennyLaneAI/pennylane"),
        "repositoryUrl": REPOS.get(req.get("repository", "PennyLaneAI/pennylane"), REPOS["PennyLaneAI/pennylane"]),
        "provider": req.get("provider", "default.qubit"),
        "digest": digest,
        "featuresUsed": len(features),
        "expectation": round(score, 8),
        "weights": [],
        "probabilities": [],
    }


def _run_pennylane(req: Dict[str, Any]) -> Dict[str, Any]:
    import pennylane as qml  # type: ignore
    import numpy as np  # type: ignore

    provider = str(req.get("provider", "default.qubit"))
    wires = int(req.get("wires", 4))
    shots = int(req.get("shots", 0)) or None
    features: List[float] = [float(x) for x in req.get("features", [])[: wires]]
    while len(features) < wires:
        features.append(0.0)
    weights: List[float] = [float(x) for x in req.get("weights", [])[: wires]]
    while len(weights) < wires:
        weights.append(0.125 * (len(weights) + 1))

    dev = qml.device(provider, wires=wires, shots=shots)

    @qml.qnode(dev)
    def circuit(x, theta):
        for idx in range(wires):
            qml.RY(x[idx], wires=idx)
            qml.RZ(theta[idx], wires=idx)
        for idx in range(max(0, wires - 1)):
            qml.CNOT(wires=[idx, idx + 1])
        return qml.expval(qml.PauliZ(0))

    expectation = float(circuit(np.array(features), np.array(weights)))
    repo = req.get("repository", "PennyLaneAI/pennylane")
    return {
        "status": "ok",
        "implementation": "PENNYLANE_QNODE",
        "repository": repo,
        "repositoryUrl": REPOS.get(repo, REPOS["PennyLaneAI/pennylane"]),
        "pennylaneVersion": getattr(qml, "__version__", "unknown"),
        "provider": provider,
        "wires": wires,
        "shots": shots or 0,
        "expectation": round(expectation, 8),
        "weights": [round(w, 8) for w in weights],
        "featuresUsed": len(features),
        "probabilities": [],
    }


def main() -> int:
    started = time.time()
    try:
        req = json.loads(sys.stdin.read() or "{}")
    except Exception as exc:  # noqa: BLE001
        print(json.dumps({"status": "error", "error": f"invalid_json: {exc}"}))
        return 2

    if req.get("task") == "diagnose":
        try:
            import pennylane as qml  # type: ignore
            result = {
                "status": "ok",
                "implementation": "PENNYLANE_AVAILABLE",
                "pennylaneVersion": getattr(qml, "__version__", "unknown"),
                "repositories": REPOS,
            }
        except Exception as exc:  # noqa: BLE001
            result = _fallback(req, f"pennylane_unavailable: {exc}")
            result["repositories"] = REPOS
    else:
        try:
            result = _run_pennylane(req)
        except Exception as exc:  # noqa: BLE001
            result = _fallback(req, f"pennylane_execution_unavailable: {exc}")

    result["runtimeMs"] = int((time.time() - started) * 1000)
    result["bridgeVersion"] = "quantum-bridge-v1"
    print(json.dumps(result, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
