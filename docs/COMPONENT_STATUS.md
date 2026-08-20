# Component Status Matrix — Isabella Villaseñor AI

**Fecha:** 20 agosto 2026 · **Metodología:** Auditoría de código estático + evidencia de implementación.

## Leyenda

| Estado | Significado |
|---|---|
| **IMPLEMENTED** | Código funcional, integrado, con contrato verificable |
| **PROTOTYPE** | Lógica modelada/simulada; no apta para producción |
| **PLANNED** | Diseñado en contratos o docs; sin implementación |
| **EXTERNAL** | Dependiente de servicio hardware/software externo |

---

## 1. Identidad y Seguridad

| Componente | Estado | Archivo | Notas |
|---|---|---|---|
| JWT HS256 Auth | **IMPLEMENTED** | `src/lib/auth.server.ts` | Token verification, roles, scopes. Requiere issuer/audience para producción. |
| CORS Whitelist | **IMPLEMENTED** | `api/[...path].ts` | Configurable via CANONICAL_ORIGINS env var. |
| Rate Limiting | **IMPLEMENTED** | `server.ts` | In-memory sliding window. Requiere Redis en producción. |
| Dev Auth Fallback | **IMPLEMENTED** | `auth.server.ts` | Requiere ALLOW_DEV_AUTH_FALLBACK=true explícito. |
| WebAuthn | **PLANNED** | — | Mencionado en roadmap; sin implementación. |
| mTLS | **PLANNED** | — | Diseñado en arquitectura; sin implementación. |

## 2. Criptografía

| Componente | Estado | Archivo | Notas |
|---|---|---|---|
| ML-KEM-768 (Kyber) | **PROTOTYPE** | `src/lib/postQuantumCrypto.ts` | Deterministic hash-based mock. Requiere `FEATURE_LAB_MODE=true`. |
| ML-DSA-87 (Dilithium) | **PROTOTYPE** | `src/lib/postQuantumCrypto.ts` | `hash(secret ‖ message)` — NO es firma válida. Requiere `FEATURE_LAB_MODE=true`. |
| SLH-DSA-128s (SPHINCS+) | **PROTOTYPE** | `src/lib/postQuantumCrypto.ts` | Deterministic hash. Requiere `FEATURE_LAB_MODE=true`. |
| LITLE-32 Gates | **PROTOTYPE** | `src/lib/postQuantumCrypto.ts` | 32 compuertas deterministas. Requiere `FEATURE_LAB_MODE=true`. |

**⚠ PROHIBIDO activar sin FEATURE_LAB_MODE=true. Producción requiere librería PQC auditada (liboqs, pqcrypto).**

## 3. Hardware Security

| Componente | Estado | Archivo | Notas |
|---|---|---|---|
| HSM Client (Node.js) | **PROTOTYPE** | `src/lib/quantum/hsm-client.ts` | SHA-256 simulated signing. Requiere `FEATURE_LAB_MODE=true`. |
| HSM Client (Browser) | **PROTOTYPE** | `src/lib/hsmClient.ts` | Dual YubiHSM simulator con `Math.random()`. No es HSM real. |
| HSM Failover Monitor | **PROTOTYPE** | `src/lib/hsmFailoverMonitor.ts` | Monitoreo del HSM simulator. |
| TEE Attestation | **PROTOTYPE** | `src/lib/quantum/tee-attestation.ts` | SHA-256 chain mock. Requiere `FEATURE_LAB_MODE=true`. |

**⚠ HSM y TEE son simuladores. Ningún claim de "HSM-backed" es válido sin hardware real.**

## 4. Quantum Mesh

| Componente | Estado | Archivo | Notas |
|---|---|---|---|
| Device Registry | **IMPLEMENTED** | `quantum/device-registry.ts` | 7 proveedores registrados. Smoke test verifica imports. |
| Orchestrator | **IMPLEMENTED** | `quantum/orchestrator.ts` | Pipeline de 13 pasos. Fallbacks para providers no disponibles. |
| Scheduler | **IMPLEMENTED** | `quantum/scheduler.ts` | Cola FIFO, backoff, max 3 reintentos. |
| Worker Manager | **IMPLEMENTED** | `quantum/worker-manager.ts` | 6 pools, heartbeat, auto-reemplazo. |
| Event Bus | **IMPLEMENTED** | `quantum/event-bus.ts` | 13 tipos, hash-chain. In-memory. |
| Telemetry | **IMPLEMENTED** | `quantum/telemetry.ts` | Counters, histograms, spans. In-memory. |
| Recovery | **IMPLEMENTED** | `quantum/recovery.ts` | 7 tipos de incidentes. Actions son strings descriptivos. |
| Policy Engine | **IMPLEMENTED** | `quantum/policy-engine.ts` | 10 reglas de evaluación. |
| BookPI Chain | **PROTOTYPE** | `quantum/bookpi-quantum.ts` | Append-only en memoria. Sin persistencia durable. |
| Federation | **PROTOTYPE** | — | Quórum 5/7 diseñado. Consenso real no implementado. |
| PennyLane Bridge | **EXTERNAL** | `quantum-bridge.server.ts` | Requiere Python + PennyLane instalado. |
| Qiskit | **EXTERNAL** | — | Requiere IBM_Q_CREDENTIALS. |
| Braket | **EXTERNAL** | — | Requiere AWS_BRAKET_CREDENTIALS. |
| Rigetti | **EXTERNAL** | — | Requiere RIGETTI_CREDENTIALS. |
| Catalyst | **EXTERNAL** | — | Requiere Catalyst instalado. |
| Lightning HPC | **EXTERNAL** | — | Requiere Lightning instalado. |

## 5. AI / Cognitive

| Componente | Estado | Archivo | Notas |
|---|---|---|---|
| Cognitive Pipeline | **IMPLEMENTED** | `processPerception.ts` | 6-step: Perceive → Remember → Decide → Act → Audit |
| Memory Store | **IMPLEMENTED** | `memory-store.ts` | In-memory. No persistencia durable. |
| Audit Tracer | **IMPLEMENTED** | `audit-tracer.ts` | SHA-256 checksums. In-memory, max 1000 entries. |
| Tools Catalog | **IMPLEMENTED** | `tools-catalog.ts` | Tool definitions con scopes. |
| Image Generation | **EXTERNAL** | `server.ts` | Gemini → Imagen 3.0 → Pollinations. |
| Voice/TTS | **EXTERNAL** | `server.ts` | Gemini TTS → Web Speech API. |

## 6. Automation Mesh

| Componente | Estado | Archivo | Notas |
|---|---|---|---|
| Registry (30+ nodes) | **IMPLEMENTED** | `automation/registry.ts` | Atlas completo con dependencias y descripción humana. |
| Self-Healing Engine | **IMPLEMENTED** | `automation/mesh.ts` | Health checks, repair chains, failure detection. |
| Human Interface | **IMPLEMENTED** | `automation/human-interface.ts` | NLP parser, describeProblem, explainToDeveloper. |

## 7. Claim Radar / MCP

| Componente | Estado | Archivo | Notas |
|---|---|---|---|
| MCP Contracts V2 | **IMPLEMENTED** | `claim-radar/contracts.ts` | Zod schemas corregidos. |
| Zenodo Adapter V2 | **IMPLEMENTED** | `mcp-adapters/zenodo-mcp-adapter.ts` | Retrieval ≠ verification enforced. |
| LITLE Adapter V2 | **IMPLEMENTED** | `mcp-adapters/litle-mcp-adapter.ts` | Dense retrieval con validación de modelo. |
| MCP Hub | **IMPLEMENTED** | `mcp-adapters/mcp-hub.ts` | Router con health checks. |
| Claim Radar Engine | **IMPLEMENTED** | `claim-radar/claim-radar.ts` | Evaluación de claims con high-risk rules. |
| Epistemic Governance | **IMPLEMENTED** | `epistemic/epistemic-governance.ts` | Clasificación y reglas de dominio. |
| Kill-Switch | **IMPLEMENTED** | `kill-switch/kill-switch.ts` | 10-step Node Zero recovery. |

## 8. Persistencia

| Componente | Estado | Archivo | Notas |
|---|---|---|---|
| PostgreSQL/TimescaleDB | **PLANNED** | `src/data/` | Schemas definidos. Sin conexión en runtime. |
| Redis Cache | **PLANNED** | — | Mencionado; sin implementación. |

## 9. CI/CD

| Componente | Estado | Archivo | Notas |
|---|---|---|---|
| GitHub Actions CI | **IMPLEMENTED** | `.github/workflows/ci.yml` | Typecheck + tests + build. |
| Vitest Suite | **IMPLEMENTED** | `tests/*.test.ts` | 42 tests: auth, kill-switch, MCP, claim-radar, epistemic, automation, lab-mode. |
| Docker | **PLANNED** | — | Sin Dockerfile en repositorio. |
| Kubernetes | **PLANNED** | — | Sin manifests. |

## 10. Infraestructura

| Componente | Estado | Archivo | Notas |
|---|---|---|---|
| Vercel Deployment | **IMPLEMENTED** | `vercel.json` + `api/[...path].ts` | Serverless API + SPA. |
| Express Server | **IMPLEMENTED** | `server.ts` | Backend monolítico ~1700 líneas. |
| Vite SPA | **IMPLEMENTED** | `src/` | React 19 + Tailwind 4. |
