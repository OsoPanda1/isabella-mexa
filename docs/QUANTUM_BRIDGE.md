# Isabella Quantum Bridge — PennyLane Integration

This bridge connects Isabella to the PennyLane ecosystem through a governed Python sidecar.

## Supported upstream projects

- `PennyLaneAI/pennylane` — core PennyLane QML API and `default.qubit` simulator.
- `PennyLaneAI/pennylane-lightning` — fast Lightning simulators for local/HPC workers.
- `PennyLaneAI/pennylane-qiskit` — optional Qiskit/IBM integration when the caller has the `quantum:qiskit` scope.

Official PennyLane documentation states that `default.qubit` is included with `pip install pennylane`, and the Qiskit plugin is installed separately with `python -m pip install pennylane-qiskit`.

## Runtime contract

The Node API never imports Python packages directly. It validates request shape, applies ARGUS policy, spawns `scripts/quantum/pennylane_bridge.py`, records telemetry, and appends a BookPI block.

If PennyLane or a plugin is unavailable, the sidecar returns:

```json
{ "status": "degraded", "implementation": "CLASSICAL_FALLBACK_NOT_QUANTUM" }
```

This prevents false claims that a quantum model executed when only a deterministic fallback was available.

## Install for a quantum worker

```bash
python3 -m venv .venv
. .venv/bin/activate
python -m pip install -r scripts/quantum/requirements.txt
# optional qiskit provider
python -m pip install pennylane-qiskit
```

## Auth scopes

- `quantum:execute` — required for `/api/v1/quantum/pennylane/execute`.
- `quantum:qiskit` — additionally required for the `qiskit.aer` provider.

## Production notes

- Run the Python bridge in an isolated worker/container for high-volume quantum ML jobs.
- Keep `wires`, `shots`, timeout and provider scopes conservative by default.
- Treat `default.qubit` and fallback output as simulated or degraded, not hardware quantum execution.
