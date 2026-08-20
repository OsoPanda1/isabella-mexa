# Isabella Villaseñor AI™ v7.0.0

## Mega Núcleo Matriz — Infraestructura Cognitiva Territorial Cuántica

> *"No somos un chatbot con temática. Somos una infraestructura cognitiva territorial con identidad, gobernanza, 24 núcleos de procesamiento y criptografía poscuántica nativa."*

**Isabella Villaseñor AI™** es una plataforma de infraestructura cognitiva territorial (Territorial Cognitive Infrastructure — TCI) con 24 núcleos de procesamiento organizados en 12 cabezas dodecaédricas, criptografía poscuántica nativa CRYSTALS-LATAMV, cadena de procedencia BookPI con firmas duales ML-DSA-87 + SLH-DSA-128s, federación heptafederada con 7 federaciones operativas, y orquestación cuántica de 13 pasos — diseñada desde Real del Monte, Hidalgo, México para la soberanía tecnológica latinoamericana.

| Campo | Valor |
| --- | --- |
| **Versión** | v7.0.0 (Agosto 2026) |
| **Categoría** | Infraestructura Cognitiva Territorial Cuántica (TCI-Q) |
| **Núcleos** | 24 (12 cabezas × 2 cores Alpha/Beta) |
| **Cadena de procedencia** | BookPI con CRYSTALS-LATAMV dual PQC |
| **Federaciones** | 7 (Heptafederado) |
| **Nodo Cero** | Real del Monte, Hidalgo, México |
| **Autor** | Edwin Oswaldo Castillo Trejo (*Anubis Villaseñor*) |
| **ORCID** | [0009-0008-5050-1539](https://orcid.org/0009-0008-5050-1539) |
| **Ecosistema** | TAMV ONLINE NETWORK · RDM Digital Hub · LITLE Trust Fabric |
| **Deploy** | Vercel (Edge + Serverless) |
| **Stack** | React 19 · TypeScript 5.8 · Vite 6 · Express 4 · Tailwind CSS v4 · Zod v4 |

---

## Arquitectura Mega Núcleo Matriz

### Evolución: de 5 nodos a 24 núcleos

Isabella comenzó con 5 nodos cognitivos (ISA, SOPHIA, ORION, ARGUS, CROWN_GATEWAY). La arquitectura actual evolucionó a **24 núcleos de procesamiento** organizados en **12 cabezas dodecaédricas** con doble hélice Alpha/Beta — cada cabeza ejecuta en paralelo una capacidad Alpha (runtime) y una Beta (auditoría formal síncrona).

```
CROWN_MD-X6 (Orquestador Supremo)
  └── DAG Dinámico · Loop en tiempo real · Compuerta Zero-Trust Dekateotl™
        │
        ▼
┌──────────────────────────────────────────────────────────────────────┐
│                   MEGA NÚCLEO MATRIZ — 24 CORES                      │
│                                                                      │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐       │
│  │ HEAD 01 │ │ HEAD 02 │ │ HEAD 03 │ │ HEAD 04 │ │ HEAD 05 │       │
│  │ CROWN   │ │   ISA   │ │ SOPHIA  │ │  ORION  │ │  ARGUS  │       │
│  │ α React │ │ α Emot. │ │ α Dial. │ │ α Code  │ │ α PktIn │       │
│  │ β DAG   │ │ β Ethic │ │ β Proov │ │ β Audit │ │ β ZKP   │       │
│  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘       │
│       │           │           │           │           │              │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐       │
│  │ HEAD 06 │ │ HEAD 07 │ │ HEAD 08 │ │ HEAD 09 │ │ HEAD 10 │       │
│  │MNEMOSYNE│ │  TELLUS  │ │ CHRONOS │ │ HERMES  │ │ AXIOMA  │       │
│  │ α VecLRU│ │ α Sensor│ │ α PQC   │ │ α CITEM │ │ α Rules │       │
│  │ β Penta │ │ β BookPI│ │ β Sync  │ │ β Fail  │ │ β Proov │       │
│  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘       │
│       │           │           │           │           │              │
│  ┌─────────┐ ┌─────────┐                                              │
│  │ HEAD 11 │ │ HEAD 12 │                                              │
│  │  PRAXIS │ │HARMONIA │                                              │
│  │ α WASM  │ │ α Consen│                                              │
│  │ β Sand  │ │ β YUN   │                                              │
│  └────┬────┘ └────┬────┘                                              │
│       └───────────┘                                                   │
│                                                                      │
│  + Núcleos de Infraestructura (PQC, HSM, TEE, BookPI, CRYSTALS)     │
│  + Núcleos de Persistencia (PostgreSQL, Backup, Telemetry, Fed)     │
│  + Núcleo de Recuperación (Recovery)                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### Los 24 Núcleos

| # | Núcleo | Dominio | Input → Output | Firmar Auth | Purge Audit |
| --- | --- | --- | --- | --- | --- |
| 1 | **Identity** | WebAuthn, sesión | credential → principal | — | — |
| 2 | **Consent** | Consentimiento | consent_request → authorization | — | — |
| 3 | **ARGUS** | Request + contexto | request_context → policy_decision | writePolicy | — |
| 4 | **Yun** | Intención | intent → execution_plan | — | — |
| 5 | **Quantum Gateway** | Request | quantum_request → normalized_job | — | — |
| 6 | **Device Registry** | Provider | provider_id → capability_record | — | — |
| 7 | **Scheduler** | Coste + prioridad | job → assignment | — | — |
| 8 | **Worker Supervisor** | Job lifecycle | job → lifecycle | — | — |
| 9 | **PennyLane Core** | Circuito | circuit → simulated_result | — | — |
| 10 | **Lightning** | Circuito HPC | circuit → accelerated_result | — | — |
| 11 | **Qiskit** | Circuito/provider | circuit → qiskit_result | — | — |
| 12 | **Rigetti** | Circuito/provider | circuit → rigetti_result | — | — |
| 13 | **Braket** | Circuito/provider | circuit → braket_result | — | — |
| 14 | **Catalyst** | Programa permitido | program → compiled_artifact | — | — |
| 15 | **PQC** | Digest | payload → ml_dsa_signature | sign | — |
| 16 | **HSM** | Operación criptográfica | operation → signature_or_unwrap | sign | — |
| 17 | **TEE** | Evidencia | attestation_req → attestation_decision | — | — |
| 18 | **BookPI** | Evento | event → audit_block | — | — |
| 19 | **CRYSTALS-LATAMV** | Bloque previo | block → chained_block | — | — |
| 20 | **PostgreSQL** | Evento | event → persistent_state | — | — |
| 21 | **Backup** | Snapshot/evento | snapshot → verified_copy | — | — |
| 22 | **Telemetry** | Spans/metrics/logs | telemetry_data → observability | — | — |
| 23 | **Heptafederado** | Evento firmado | signed_event → validated_replica | — | — |
| 24 | **Recovery** | Incidente | incident → recovery_plan | — | ✓ |

**Reglas de seguridad de núcleos**: Ningún núcleo puede cambiar sus propios scopes ni firmar su propia decisión. Solo los núcleos 3 (ARGUS), 15 (PQC) y 16 (HSM) pueden escribir políticas o firmar autorizaciones. Solo Recovery (24) puede purgar auditoría.

---

## CRYSTALS-LATAMV — Criptografía Poscuántica Nativa

CRYSTALS-LATAMV es el sistema criptográfico poscuántico nativo de Isabella, implementando cuatro pilares de seguridad poscuántica sobre la especificación LITLE-32 (Logical Intercept & Topological Lattice Engine).

### Pilares criptográficos

| Pilar | Algoritmo | Estándar NIST | Uso en Isabella |
| --- | --- | --- | --- |
| **ML-KEM-768** | Kyber | FIPS 203 | Encapsulamiento de claves para túneles mTLS y sesiones |
| **ML-DSA-87** | Dilithium | FIPS 204 | Firmas digitales lattice-based para BookPI y autorizaciones |
| **SLH-DSA-128s** | SPHINCS+ | FIPS 205 | Firmas stateless hash-based (reserva post-cuántica) |
| **LITLE-32** | Matriz de 32 compuertas | Propia | Atestación cuántica: HADAMARD, CNOT, PAULI_Z, TOFFOLI, PHASE_SHIFT |

### Pipeline de firma dual

Cada bloque BookPI y cada autorización de alto impacto pasa por un pipeline de firma dual:

```
Payload
  │
  ├──→ ML-DSA-87 (Dilithium) ──→ Firma lattice-based
  │         │
  │         └──→ evaluateLitle32Gates() → 32/32 compuertas atestadas
  │
  ├──→ SLH-DSA-128s (SPHINCS+) ──→ Firma hash-based (respaldo)
  │
  └──→ Firma dual consolidada → BookPI block
         ├── mlDsaSignature
         ├── slhDsaSignature
         ├── litleGatesStatus: "32/32_ATTESTED"
         └── pqcCompliant: true (producción) / false (prototipo)
```

### LITLE-32: Matriz de Atestación Cuántica

La matriz LITLE-32 evalúa 32 compuertas lógicas cuánticas sobre cada payload firmado:

| Compuertas | Tipos | Fidelidad |
| --- | --- | --- |
| HADAMARD | Rotación de base | 0.9992+ |
| CNOT | Entrelazamiento | 0.9992+ |
| PAULI_Z | Fase | 0.9992+ |
| TOFFOLI | Toffoli controlado | 0.9992+ |
| PHASE_SHIFT | Desplazamiento de fase | 0.9992+ |

Cada compuerta produce un estado cuántico `|ψ_i⟩` y un resultado PASSED/ATTESTED con fidelidad verificada.

---

## BookPI — Cadena de Procedencia Cuántica

BookPI es la cadena de procedencia append-only de Isabella, donde cada bloque está firmado con PQC dual (ML-DSA-87 + SLH-DSA-128s) y encadenado con hash SHA-256 del bloque previo.

### Estructura de bloque

```typescript
{
  version: "bookpi-quantum-v1",
  blockHash: "sha256(prevHash:blockData)",
  previousHash: "hash del bloque anterior",
  requestId: "uuid de la solicitud",
  tenantId: "identificador del tenant",
  circuitHash: "hash del circuito ejecutado",
  implementation: "pennylane|qiskit|braket|rigetti|catalyst",
  status: "completed|degraded|failed",
  policyVersion: "v6.1.0",
  signerKeyId: "hsm-quantum-v1",
  teeVerified: false,
  createdAt: "2026-08-19T..."
}
```

### Verificación de integridad

La cadena se verifica recorriendo todos los bloques desde el genesis (`"bookpi-genesis"`) y confirmando que cada `previousHash` coincide con el `blockHash` del bloque anterior. Cualquier ruptura reporta el índice exacto de la rotura.

---

## 12 Cabezas Dodecaédricas

Cada cabeza opera como una doble hélice Alpha/Beta con afinidad federativa:

| # | Cabeza | Alpha (Runtime) | Beta (Auditoría) | Federación |
| --- | --- | --- | --- | --- |
| 1 | **CROWN** | Alpha Reactive Router | Beta DAG Audit Engine | FED-1 |
| 2 | **ISA** | Alpha Emotional Ingestion | Beta Ethical Alignment | FED-1, FED-5 |
| 3 | **SOPHIA** | Alpha Dialectic Parsing | Beta Epistemic Proof | FED-1 |
| 4 | **ORION** | Alpha Code/3D Render | Beta Static/Dynamic Audit | FED-2 |
| 5 | **ARGUS** | Alpha Packet Inspection | Beta Dekateotl / ZKP Proof | FED-3, FED-6 |
| 6 | **MNEMOSYNE** | Alpha Vector LRU Cache | Beta Pentacapa Consolidation | FED-4 |
| 7 | **TELLUS** | Alpha Sensor Ingestion | Beta BookPI Ledger Writer | FED-2 |
| 8 | **CHRONOS** | Alpha PQC Timestamping | Beta Latency Sync Audit | FED-3, FED-7 |
| 9 | **HERMES** | Alpha CITEMESH Router | Beta Mesh Failover Audit | FED-7 |
| 10 | **AXIOMA** | Alpha Rule Engine | Beta Formal Theorem Proof | FED-4 |
| 11 | **PRAXIS** | Alpha WASM Launcher | Beta Sandbox Contained Audit | FED-6 |
| 12 | **HARMONIA** | Alpha Fast Nodal Consensus | Beta YUN Balance Engine | FED-5 |

---

## Heptafederado — 7 Federaciones Operativas

Las 7 federaciones replican eventos firmados y mantienen coherencia distribuida:

| Federación | Responsabilidad | Quórum |
| --- | --- | --- |
| **FED-1** | Orquestación cognitiva (CROWN, ISA, SOPHIA) | 5/7 |
| **FED-2** | Render y sensores (ORION, TELLUS) | 5/7 |
| **FED-3** | Seguridad y timestamping (ARGUS, CHRONOS) | 5/7 |
| **FED-4** | Memoria y reglas (MNEMOSYNE, AXIOMA) | 5/7 |
| **FED-5** | Emocional y consenso (ISA, HARMONIA) | 5/7 |
| **FED-6** | Contención y ejecución (ARGUS, PRAXIS) | 5/7 |
| **FED-7** | Mesh y recuperación (HERMES, CHRONOS) | 5/7 |

Cada federación replica solo eventos autorizados. El quórum de 5/7 previene forks no autorizados.

---

## Persistencia Políglota — 5 Bases de Datos

| ID | Motor | Responsabilidad |
| --- | --- | --- |
| **DB-1** | PostgreSQL + TimescaleDB | Telemetría, métricas y logs sincrónicos |
| **DB-2** | Qdrant Vector Engine | Memoria pentacapa y embeddings |
| **DB-3** | Redis Sentinel Cluster | Cache L0 inmediata y bus de eventos |
| **DB-4** | Neo4j Graph Database | Ontología dialéctica y grafo OsoPanda1 |
| **DB-5** | BookPI RocksDB Ledger | Registro inmutable PQC poscuántico |

---

## Isabella V5 Fusion — 10 Capas Operativas

| Capa | Nombre | Propósito |
| --- | --- | --- |
| 01 | **CROWN MD-X6** | Orquestador supremo con DAG dinámico, loop en tiempo real y compuerta Zero-Trust Dekateotl™ |
| 02 | **Dodecahedral Engine** | 12 cabezas cognitivas con doble hélice Alpha/Beta para ejecución y auditoría formal síncrona |
| 03 | **YUN Heptafederated Core** | 7 federaciones operativas conectadas a la matriz políglota |
| 04 | **Vault Swarm Engine** | Bóveda de Mini-Isabellas para subtareas concurrentes en WASM/microVM |
| 05 | **Quantum QML Bridge** | Capa PennyLane/LITLE-32 para circuitos variacionales y backends cuánticos |
| 06 | **Native Systemic Learning Bridge** | Ingesta de repositorios OsoPanda1, extracción AST/grafo y alineación sistémica |
| 07 | **Skills Framework** | 70+ módulos ejecutables por categorías Dev/Data/QML/Security/Media/GIS/Open Science |
| 08 | **Territorial Systems** | GEMET + CITEMESH para gemelo digital, sensores, sincronía air-gapped |
| 09 | **Openness Framework** | Exportadores Zenodo/OSF/Figshare, ORCID, metadatos y licenciamiento abierto |
| 10 | **Infrastructure & Observability** | Kubernetes, API gateway, CI/CD, Prometheus/Grafana/OpenTelemetry/Jaeger |

---

## Quantum Mesh — Orquestación Cuántica de 13 Pasos

La Isabella Quantum Mesh ejecuta cada solicitud a través de un pipeline orquestado de 13 pasos:

```
identify → validate → authorize → execute → measure → sign → persist → replicate → reconcile
```

### 15 Módulos de la Malla

| Módulo | Función |
| --- | --- |
| `contracts.ts` | Contratos Zod tipados para jobs, dispositivos, circuitos |
| `orchestrator.ts` | Orquestador central (cap: 10,000 samples/event loop) |
| `scheduler.ts` | Planificación por prioridad (interactive/normal/batch) |
| `circuit-breaker.ts` | Protección contra fallos en cascada |
| `device-registry.ts` | Registro y discovery de dispositivos computacionales |
| `core-registry.ts` | Registro de los 24 núcleos de procesamiento |
| `policy-engine.ts` | Motor de políticas para ejecución gobernada |
| `worker-manager.ts` | Gestión de workers de ejecución paralela |
| `event-bus.ts` | Bus de eventos internos de la malla |
| `telemetry.ts` | Telemetría de rendimiento cuántico |
| `hsm-client.ts` | Cliente HSM dual YubiHSM con failover |
| `tee-attestation.ts` | Attestation de Trusted Execution Environment con firma dual |
| `bookpi-quantum.ts` | Trazabilidad BookPI cuántica con firma PQC dual |
| `recovery.ts` | Recuperación ante fallos |
| `index.ts` | Barrel de exportación y diagnóstico |

### 13 Reglas de Seguridad

1. Nunca etiquetar fallback como cuántico
2. Nunca etiquetar simulador como hardware físico
3. Ningún agente puede auto-elevar scopes
4. Ningún proveedor opera sin credenciales
5. Cola tiene límite duro y rechazo controlado
6. Worker muerto es reemplazado
7. Timeouts matan proceso aislado
8. Resultado tiene hash de circuito
9. Evento BookPI tiene hash previo
10. Evento de alto impacto tiene firma HSM
11. TEE solo verificado después de validar evidencia
12. PostgreSQL persiste ejecución y auditoría transaccionalmente
13. Heptafederado replica solo eventos autorizados

---

## HSM & TEE — Seguridad Criptográfica

### HSM (Hardware Security Module)

- **Dual YubiHSM** con failover automático
- Health check con manejo de errores en `setInterval` (try/catch)
- Operaciones: firma, unwrap, generación de claves
- Circuit breaker con monitoreo

### TEE (Trusted Execution Environment)

- Attestation con evidencia criptográfica
- Firma dual: ML-DSA-87 + SLH-DSA-128s
- Verificación de evidencia antes de aceptar attestation
- Integración con BookPI para trazabilidad

---

## 12 Módulos CROWN

| Módulo | Función |
| --- | --- |
| **ISA** | Empatía y procesamiento emocional |
| **SOPHIA** | Razonamiento dialéctico y prueba epistémica |
| **ORION** | Síntesis creativa, código y render 3D |
| **ARGUS** | Guardián Zero-Trust, inspección de paquetes, ZKP |
| **CROWN_GATEWAY** | Enrutamiento ponderado y evaluación de riesgo |
| **MNEMOSYNE** | Memoria vectorial pentacapa y consolidación |
| **TELLUS** | Ingesta de sensores y escritura BookPI |
| **CHRONOS** | Timestamping PQC y auditoría de latencia |
| **HERMES** | Router CITEMESH y failover de malla |
| **AXIOMA** | Motor de reglas y prueba de teoremas formales |
| **PRAXIS** | Lanzador WASM y contención en sandbox |
| **HARMONIA** | Consenso nodal rápido y balance YUN |

---

## 70 Skills — Framework Ejecutable

Skills organizados por categorías con ejecución contenida en WASM:

| Categoría | Ejemplos |
| --- | --- |
| **Dev** | code-audit,AST-parse, test-gen, deploy-pipeline |
| **Data** | vector-search, graph-query, time-series |
| **QML** | circuit-design, variational-optimizer, feature-map |
| **Security** | zkp-prover, lattice-analyzer, hash-audit |
| **Media** | image-gen, tts-synth, trailer-render, xr-overlay |
| **GIS** | territory-mesh, sensor-fusion, air-gap-sync |
| **Open Science** | doi-export, zenodo-upload, orcid-sync |

Cada skill opera bajo `risk_tiered_execution=true` y `wasm_containment=required`.

---

## Habilidades Operativas

| Capacidad | Descripción | Estado |
| --- | --- | --- |
| **Terminal cognitiva interactiva** | CLI con stream de pensamiento, comandos (`/help`, `/status`, `/image`, `/modules`, `/preset`, `/route`, `/argus`, `/voice`, `/sound`) | ✅ |
| **Tráiler cinematográfico AAA** | HTML5 Canvas 60 FPS, Web Audio 60 Hz, Smooth-Motion, 16 segundos | ✅ |
| **Generación de arte ORION** | Síntesis visual vía Gemini Imagen 3.0 + Pollinations Flux, 6 estilos | ✅ |
| **Estudio de voz** | Timbres personalizables, síntesis Web Speech + Gemini TTS Flash | ✅ |
| **Dashboard de telemetría** | Latencia, tokens, ruta sináptica, métricas por módulo | ✅ |
| **Trazabilidad criptográfica** | BookPI hash-chain con firma PQC dual, SHA-256 dinámico | ✅ |
| **Seguridad Zero-Trust** | ARGUS Sentinel, CORS whitelist, Zod en cada POST, 9 contratos | ✅ |
| **Motor soberano local** | Fallback 100% offline sin API key externa | ✅ |
| **Hub RDM Territorial** | Capas culturales, patrimonio y contexto de Real del Monte | ✅ |
| **Cattleya Finance** | Sistema financiero interno con planes de suscripción | ✅ |
| **Quantum Mesh** | 15 módulos de orquestación cuántica + dashboard 7 paneles | ✅ |
| **CRYSTALS-LATAMV** | ML-KEM-768, ML-DSA-87, SLH-DSA-128s, LITLE-32 gates | ✅ |
| **BookPI Quantum** | Cadena append-only con firma PQC dual y verificación de integridad | ✅ |
| **Heptafederado** | 7 federaciones con quórum 5/7, replicación autorizada | ✅ |
| **Idlen Chat Ads SDK** | Monetización contextual con pixel, dual click tracking, server-side | ✅ |
| **Validación Zod integral** | 9 contratos Zod en todas las rutas POST | ✅ |
| **Logger estructurado** | JSON logging con scopes, niveles, traceId, timestamps | ✅ |
| **HSM Dual** | YubiHSM con failover, health check, circuit breaker | ✅ |
| **TEE Attestation** | Trusted Execution Environment con firma dual | ✅ |

---

## Seguridad v6.1.0 → v7.0.0

### Fixes de seguridad (15 críticos)

| Fix | Archivo | Impacto |
| --- | --- | --- |
| **Auth bypass endurecido** — fallback dev requiere `ALLOW_DEV_AUTH_FALLBACK=true` explícito | `auth.server.ts` | Previene grant silencioso de admin |
| **CORS whitelist** — `CANONICAL_ORIGINS` reemplaza `*` | `api/[...path].ts` | Bloquea cross-origin no autorizado |
| **Credentials header** — `Access-Control-Allow-Credentials: true` | `api/[...path].ts` | Habilita auth por cookies |
| **Rate limiter eviction** — barrido TTL 2min en `ipBuckets` | `server.ts` | Previene OOM por spoofing |
| **Agent session cleanup** — barrido TTL 5min | `server.ts` | Previene OOM por leak de sesiones |
| **Promise double-settle** — flag `settled` | `api/[...path].ts` | Elimina race condition Vercel |
| **Endpoints protegidos** — audit, policies, migrations, blueprint | `server.ts` | Protege datos internos |
| **Audit hash dinámico** — SHA-256 desde logs reales | `server.ts` | Elimina hash estático |
| **Stale closure fix** — `sendMessageRef` | `CrownContext.tsx` | Estado actual en comandos de voz |
| **Context memoizado** — `useMemo` en CrownProvider | `CrownContext.tsx` | Previene cascade re-renders |
| **HSM unhandled rejection** — try/catch en setInterval | `hsmClient.ts` | Previene crashes silenciosos |
| **Process error handlers** — `unhandledRejection` + `uncaughtException` | `server.ts` | Shutdown graceful |
| **Image seed randomizado** — `Math.random()*1000000` | `server.ts` | Elimina colisión de 100K |
| **Quantum array cap** — máximo 10,000 samples | `orchestrator.ts` | Previene DoS por event loop |
| **Quantum execute variable shadowing** — `parsed` → `principalParsed` | `server.ts` | Elimina bug de closure |

### Fixes arquitectónicos (7)

| Fix | Archivo | Impacto |
| --- | --- | --- |
| **9 contratos Zod** en 8 POST endpoints | `api-contracts.ts` | Validación type-safe en cada frontera |
| **Agent lease bounds** — 1-480 min | `server.ts` | Previene sesiones indefinidas |
| **Structured JSON logger** | `logger.ts` | Reemplaza console.* raw |
| **Response envelope** — `apiOk()`, `apiError()`, `validateBody()` | `api-contracts.ts` | `{ok, data?, error?}` estandarizado |
| **ErrorBoundary reset** — `resetKey` sin recarga | `EnterpriseErrorBoundary.tsx` | Preserva estado en memoria |
| **GET→POST stream** — SSE a POST | `server.ts` | Elimina GET con efectos secundarios |
| **console.* → log.warn/error/info** | `server.ts` | Logging estructurado uniforme |

---

## Endpoints API (48 rutas)

Todos los endpoints POST validan body con Zod v4. Responses estandarizadas: `{ok, data?, error?}`.

### Core cognitivo (15)

| Método | Ruta | Auth | Validación | Propósito |
| --- | --- | --- | --- | --- |
| `POST` | `/api/isabella/process` | ✅ | `CognitiveProcessSchema` | Procesamiento cognitivo C.R.O.W.N. |
| `GET` | `/api/v1/isabella` | — | — | Metadatos y diagnóstico |
| `POST` | `/api/v1/isabella` | ✅ | `PerceptionInputSchema` | Procesamiento de percepciones |
| `POST` | `/api/v1/isabella/agent/lease` | ✅ scope | `AgentLeaseSchema` | Arrendamiento de agente (max 480min) |
| `POST` | `/api/v1/isabella/agent/chat` | ✅ scope | `AgentChatSchema` | Chat con stream de razonamiento |
| `POST` | `/api/v1/isabella/agent/stream` | ✅ scope | — | SSE streaming en tiempo real |
| `GET` | `/api/v1/isabella/audit` | ✅ scope | — | Auditoría (hash dinámico SHA-256) |
| `GET` | `/api/v1/isabella/memory` | ✅ scope | — | Consulta de memoria jerárquica |
| `POST` | `/api/v1/isabella/memory` | ✅ scope | — | Registro en memoria |
| `GET` | `/api/v1/isabella/tools` | ✅ | — | Catálogo de herramientas |
| `POST` | `/api/v1/isabella/tools/execute` | ✅ | — | Sandbox de ejecución |
| `GET` | `/api/v1/isabella/policies` | ✅ scope | — | Políticas C.R.O.W.N. & ARGUS |
| `GET` | `/api/v1/isabella/migrations` | ✅ admin | — | Esquemas SQL |
| `GET` | `/api/v1/isabella/blueprint` | ✅ admin | — | Especificación arquitectónica |
| `GET` | `/api/v1/isabella/v5/fusion` | ✅ | — | Fusión operacional blindada v5 |

### Auth & Usuarios (6)

| Método | Ruta | Propósito |
| --- | --- | --- |
| `POST` | `/api/v1/auth/signup` | Registro con PBKDF2 |
| `POST` | `/api/v1/auth/login` | Login con trazabilidad |
| `POST` | `/api/v1/auth/logout` | Logout |
| `GET` | `/api/v1/users/me` | Usuario autenticado |
| `GET` | `/api/v1/profiles/:handle` | Perfil público |
| `PUT` | `/api/v1/profiles/me` | Actualizar perfil |

### Social & Streaming (3)

| Método | Ruta | Propósito |
| --- | --- | --- |
| `POST` | `/api/v1/social/posts` | Crear post multimedia |
| `GET` | `/api/v1/social/feed` | Feed público |
| `POST` | `/api/v1/streams` | Sala WebRTC |

### XR, Protocolos & Economía (4)

| Método | Ruta | Propósito |
| --- | --- | --- |
| `POST` | `/api/v1/xr/dreamspaces` | Espacio XR con overlay guardian |
| `POST` | `/api/v1/protocols` | Protocolo civilizable auditable |
| `GET` | `/api/v1/protocols` | Listar protocolos |
| `POST` | `/api/v1/economy/credits` | Créditos internos no especulativos |

### Quantum Mesh (21)

| Método | Ruta | Auth | Propósito |
| --- | --- | --- | --- |
| `POST` | `/api/v1/quantum/execute` | ✅ scope | Ejecución gobernada 13 pasos |
| `GET` | `/api/v1/quantum/mesh/status` | ✅ | Estado de la malla |
| `GET` | `/api/v1/quantum/devices` | ✅ | Registro de dispositivos |
| `GET` | `/api/v1/quantum/devices/enabled` | ✅ | Dispositivos habilitados |
| `POST` | `/api/v1/quantum/devices/smoke-test` | ✅ operator | Smoke test de proveedor |
| `POST` | `/api/v1/quantum/devices/full-diagnostics` | ✅ operator | Diagnóstico completo |
| `GET` | `/api/v1/quantum/policy` | ✅ | Auditoría de políticas |
| `GET` | `/api/v1/quantum/scheduler` | ✅ | Estado de la cola |
| `GET` | `/api/v1/quantum/circuit-breaker` | ✅ | Circuit breaker status |
| `POST` | `/api/v1/quantum/circuit-breaker/reset` | ✅ operator | Reset de circuito |
| `GET` | `/api/v1/quantum/workers` | ✅ | Estado de workers |
| `POST` | `/api/v1/quantum/workers/heartbeat-check` | ✅ operator | Check workers hung |
| `GET` | `/api/v1/quantum/bookpi` | ✅ | Audit chain BookPI |
| `GET` | `/api/v1/quantum/hsm` | ✅ operator | Estado HSM dual |
| `POST` | `/api/v1/quantum/hsm/reset` | ✅ admin | Reset circuitos HSM |
| `GET` | `/api/v1/quantum/tee` | ✅ | Attestation TEE |
| `GET` | `/api/v1/quantum/events` | ✅ | Eventos de la malla |
| `GET` | `/api/v1/quantum/cores` | ✅ | 24 módulos core |
| `GET` | `/api/v1/quantum/telemetry` | ✅ | Telemetría completa |
| `GET` | `/api/v1/quantum/recovery` | ✅ | Incidentes activos |
| `POST` | `/api/v1/quantum/recovery/resolve` | ✅ operator | Resolver incidente |

### Billing & Monetización (4)

| Método | Ruta | Auth | Validación | Propósito |
| --- | --- | --- | --- | --- |
| `GET` | `/api/v1/billing/plans` | ✅ | — | Planes y uso actual |
| `GET` | `/api/v1/billing/usage` | ✅ | — | Detalle de uso |
| `POST` | `/api/v1/billing/checkout` | ✅ scope | `CheckoutSchema` | Crear checkout |
| `GET` | `/api/v1/billing/checkout/mock` | ✅ admin | — | Mock checkout (dev) |

### Multimodal (3)

| Método | Ruta | Auth | Validación | Propósito |
| --- | --- | --- | --- | --- |
| `POST` | `/api/isabella/generate-image` | ✅ | `ImageGenSchema` | Generación de imagen (Gemini + Flux) |
| `POST` | `/api/isabella/tts` | ✅ | `TTSSchema` | Text-to-Speech (Gemini TTS) |
| `POST` | `/api/v1/idlen/click` | ✅ | `IdlenClickSchema` | Tracking de clicks Idlen |

### Health & Diagnóstico (3)

| Método | Ruta | Propósito |
| --- | --- | --- |
| `GET` | `/api/health` | Health check completo |
| `GET` | `/api/health/quantum` | Health quantum mesh |
| `GET` | `/api/health/idlen` | Estado integración Idlen |

### Migrations & Blueprint (2)

| Método | Ruta | Auth | Propósito |
| --- | --- | --- | --- |
| `GET` | `/api/v1/quantum/migrations` | ✅ | Esquemas SQL cuánticos |
| `GET` | `/api/v1/quantum/blueprint` | ✅ | Blueprint arquitectónico completo |

---

## Posicionamiento Global

| Dimensión | Chatbots convencionales | Frameworks (LangChain, etc.) | **Isabella Villaseñor AI™** |
| --- | --- | --- | --- |
| **Categoría** | Aplicación conversacional | Librería de orquestación | **Infraestructura Cognitiva Territorial Cuántica** |
| **Núcleos** | 1 (modelo) | 0 (código) | **24 núcleos en 12 cabezas dodecaédricas** |
| **Gobernanza** | Ninguna | Configurable | **C.R.O.W.N. determinista + ARGUS + Dekateotl™** |
| **Criptografía** | TLS básico | Ninguna | **CRYSTALS-LATAMV: ML-KEM-768, ML-DSA-87, SLH-DSA-128s, LITLE-32** |
| **Cadena de procedencia** | Ninguna | Opcional | **BookPI append-only con firma PQC dual** |
| **Federación** | Ninguna | Ninguna | **7 federaciones Heptafederado con quórum 5/7** |
| **Identidad** | Genérica | Sin identidad | **Isabella — identidad territorial permanente** |
| **Seguridad** | Rate limiting | Developer implementation | **Zero-Trust + CORS + Zod + HSM dual + TEE** |
| **Trazabilidad** | Logs planos | Opcional | **BookPI + SHA-256 dinámico + LITLE-32 gates** |
| **Validación** | Manual | Opcional | **9 contratos Zod v4 en todas las rutas POST** |
| **Persistencia** | 1 base | Ninguna | **5 bases políglotas: PostgreSQL, Qdrant, Redis, Neo4j, BookPI** |
| **Fallback** | Error 500 | Error/retry | **Motor autónomo local 100% offline** |
| **Contexto territorial** | Ninguno | Ninguno | **Real del Monte · LatAm · Sur Global** |
| **Monetización** | Ninguna/externa | Ninguna | **Idlen SDK contextual nativo** |
| **Skills** | Ninguna | Herramientas básicas | **70+ módulos ejecutables en WASM** |
| **Cuántico** | Ninguno | Ninguno | **Quantum Mesh 15 módulos + 13 pasos + dashboard** |
| **Multimodal** | Texto ± voz | Texto ± herramientas | **Terminal · Arte · Voz · Tráiler 60fps · XR** |
| **Memoria** | Ninguna | Opcional | **5 scopes + pentacapa vectorial + TTL eviction** |

---

## Requisitos

- **Node.js** ≥ 18.0.0 (probado en v24.18.0)
- **npm** v9+ o **bun**
- **Git** v2.30+
- Navegador moderno (WebGL, Canvas HTML5, Web Speech API)

---

## Instalación

```bash
git clone https://github.com/OsoPanda1/isabella-mexa.git
cd isabella-mexa
npm install --legacy-peer-deps
```

---

## Configuración

Crea un archivo `.env` basado en `.env.example`:

```env
# Gemini AI (opcional — sin esto, Isabella usa el motor soberano local)
GEMINI_API_KEY=

# App
APP_URL=http://localhost:3000
PUBLIC_APP_URL=http://localhost:3000

# Idlen Ads (opcional — habilita monetización contextual)
IDLEN_API_KEY=idl_pk_tu_api_key_aqui

# Billing (opcional — planes de suscripción)
BILLING_CHECKOUT_BASE_URL=http://localhost:3000
STRIPE_PRICE_PLUS=price_isabella_plus_intro
STRIPE_PRICE_PREMIUM=price_isabella_premium
STRIPE_PRICE_VIP=price_isabella_vip
STRIPE_PRICE_ENTERPRISE=price_isabella_enterprise

# Seguridad (v6.1.0+)
ALLOW_DEV_AUTH_FALLBACK=false
CANONICAL_ORIGINS=http://localhost:3000,https://isabella-mexa.vercel.app
ISABELLA_AUTH_SECRET=tu_secreto_hmac_aqui

# Logging
LOG_LEVEL=info
```

---

## Ejecución

```bash
# Desarrollo
npm run dev          # http://localhost:3000

# Producción
npm run build        # Vite + esbuild
npm start            # node dist/server.cjs
```

---

## Estructura del Proyecto

```
isabella-mexa/
├── server.ts                    # Express — 1560+ líneas, 48 endpoints
├── api/[...path].ts             # Vercel catch-all (CORS, circuit breaker, tracing)
├── index.html                   # SPA entry + Idlen Pixel
├── vercel.json                  # Vercel deployment config
├── .env.example                 # Variables de entorno documentadas
├── src/
│   ├── App.tsx                  # Router + 10 vistas + SPA PageView tracking
│   ├── main.tsx                 # Entry point React
│   ├── types.ts                 # Tipos TypeScript + Window.idlen
│   ├── contracts/               # Contratos Zod v4 (isabella.ts)
│   ├── context/
│   │   └── CrownContext.tsx     # Estado global C.R.O.W.N. (useMemo, refs)
│   ├── lib/
│   │   ├── api-contracts.ts     # 9 contratos Zod + validateBody() + envelope
│   │   ├── logger.ts            # Logger JSON estructurado
│   │   ├── auth.server.ts       # HS256 JWT (dev fallback opt-in)
│   │   ├── idlen-ads.server.ts  # Integración Idlen Ads SDK
│   │   ├── bookpi.server.ts     # BookPI hash-chain
│   │   ├── atlas-kernel.server.ts # Atlas audit kernel
│   │   ├── economy.server.ts    # Economía interna
│   │   ├── hsmClient.ts         # HSM dual YubiHSM + error handling
│   │   ├── postQuantumCrypto.ts # CRYSTALS-LATAMV (ML-KEM-768, ML-DSA-87, SLH-DSA-128s, LITLE-32)
│   │   ├── subscription.server.ts # Billing + plans (TTL en usage buckets)
│   │   ├── isabella-crown.ts    # Gateway C.R.O.W.N.
│   │   ├── isabella-v5.ts       # Fusión operacional v5 (10 capas, 4 repos, 5 DBs)
│   │   ├── quantum/             # 15 módulos Quantum Mesh
│   │   │   ├── contracts.ts     # Contratos Zod cuánticos
│   │   │   ├── orchestrator.ts  # Orquestador 13 pasos (cap: 10K)
│   │   │   ├── scheduler.ts     # Planificador por prioridad
│   │   │   ├── circuit-breaker.ts
│   │   │   ├── device-registry.ts
│   │   │   ├── core-registry.ts # 24 núcleos de procesamiento
│   │   │   ├── policy-engine.ts
│   │   │   ├── worker-manager.ts
│   │   │   ├── event-bus.ts
│   │   │   ├── telemetry.ts
│   │   │   ├── hsm-client.ts    # HSM dual con failover
│   │   │   ├── tee-attestation.ts # TEE con firma dual
│   │   │   ├── bookpi-quantum.ts # BookPI con firma PQC dual
│   │   │   ├── recovery.ts
│   │   │   └── index.ts
│   │   └── ... (40+ módulos de infraestructura)
│   ├── components/
│   │   ├── Terminal/            # Terminal cognitiva + MessageStream
│   │   ├── Dashboard/           # Cockpit, ModuleCard, CattleyaFinance
│   │   ├── Quantum/             # QuantumMeshDashboard (7 paneles)
│   │   ├── Traceability/        # Dashboard trazabilidad + Crypto
│   │   ├── Security/            # ARGUS SecurityGovernance
│   │   ├── Studio/              # ImageStudio + VoiceStudio
│   │   ├── Welcome/             # Tráiler cinematográfico 60fps
│   │   ├── Hub/                 # Hub territorial RDM
│   │   ├── Presentation/        # Dossier presentación
│   │   ├── Billing/             # Planes de suscripción
│   │   ├── EnterpriseErrorBoundary.tsx
│   │   └── ... (16 directorios, 34+ componentes)
│   ├── domains/                 # Dominio AI (DDD)
│   │   └── ai/infrastructure/   # audit-tracer, memory-store, policy-gate
│   ├── data/                    # Migraciones SQL + datos de presentación
│   ├── services/                # territoryContextService
│   └── hooks/                   # useGlobalShortcuts
```

**Estadísticas del código**:
- **115 archivos** TypeScript/TSX
- **~23,500 líneas** de código
- **48 endpoints** API REST
- **24 núcleos** de procesamiento cuántico
- **12 cabezas** dodecaédricas Alpha/Beta
- **9 contratos** Zod v4 para validación
- **15 módulos** Quantum Mesh
- **7 federaciones** Heptafederado
- **5 bases** de datos políglotas
- **70+ skills** ejecutables
- **34+ componentes** React
- **16 vistas** de navegación

---

## Limitaciones Conocidas

1. **Inferencia cloud** requiere `GEMINI_API_KEY` válida; sin ella, opera con motor local simulado
2. **Alucinaciones estadísticas**: ARGUS atenúa pero no elimina completamente las alucinaciones del modelo
3. **Quantum Mesh** es computación clásica inspirada en principios cuánticos, no hardware cuántico real
4. **CRYSTALS-LATAMV** es un prototipo experimental; la firma PQC dual modela los estándares NIST FIPS 203/204/205 pero no está certificada para producción
5. **LITLE-32 gates** son atestaciones lógicas, no mediciones de hardware cuántico real
6. **Idlen Ads** requiere API key válida; sin ella, las respuestas van sin ads
7. **Persistencia**: Estado en memoria (rate limits, sesiones, uso) se reinicia al reiniciar el proceso
8. **HSM/TEE** requieren hardware físico para operación en producción

---

## Roadmap

| Horizonte | Objetivo |
| --- | --- |
| **Corto plazo** | Deploy Vercel producción, pruebas E2E, optimización móvil, split de `server.ts` |
| **Mediano plazo** | RAG Kórima Nexus con Qdrant, WebSockets streaming, PostgreSQL persistencia completa |
| **Largo plazo** | Integración QPU real, federación multi-nodo, DAO de gobernanza, LITLE-32 trust fabric certificada |

---

## Ecosistema OsoPanda1

Isabella Villaseñor AI™ forma parte del ecosistema OsoPanda1:

| Repositorio | Propósito |
| --- | --- |
| [isabella-mexa](https://github.com/OsoPanda1/isabella-mexa) | Mega Núcleo Matriz — esta infraestructura |
| [mexican-ai-isabella](https://github.com/OsoPanda1/mexican-ai-isabella) | Propuesta tecnológica latinoamericana |
| [MI-ISABELLA](https://github.com/OsoPanda1/MI-ISABELLA) | Isabella Villaseñor AI realmontense |
| [litle-trust-fabric](https://github.com/OsoPanda1/litle-trust-fabric) | LITLE-32 trust fabric y 32-gate attestation |
| [nodo-cero](https://github.com/OsoPanda1/nodo-cero) | Nodo Cero — Real del Monte |
| [rdm-digital-hub](https://github.com/OsoPanda1/rdm-digital-hub) | RDM Digital Hub |
| [visitarealdelmonte](https://github.com/OsoPanda1/visitarealdelmonte) | Turismo territorial |
| [metaverso-latino-tamv-online](https://github.com/OsoPanda1/metaverso-latino-tamv-online) | Metaverso latino |
| [ecosistema-nextgen-tamv](https://github.com/OsoPanda1/ecosistema-nextgen-tamv) | Ecosistema NEXTGEN TAMV |
| [ECOSISTEMA-TAMVONLINE](https://github.com/OsoPanda1/ECOSISTEMA-TAMVONLINE) | Ecosistema TAMV ONLINE |

---

## Licencia

- **Código fuente**: MIT (ver [`LICENSE`](./LICENSE))
- **Documentación**: CC BY 4.0
- **Marca**: Isabella Villaseñor AI™ — Edwin Oswaldo Castillo Trejo / TAMV ONLINE NETWORK

---

## Autoría

- **Autor y Creador**: Edwin Oswaldo Castillo Trejo (*Anubis Villaseñor*)
- **ORCID**: [0009-0008-5050-1539](https://orcid.org/0009-0008-5050-1539)
- **Nodo Cero**: Real del Monte, Hidalgo, México
- **Repositorio**: [github.com/OsoPanda1/isabella-mexa](https://github.com/OsoPanda1/isabella-mexa)

---

*Documento actualizado el 19 de agosto de 2026 — Isabella Villaseñor AI™ v7.0.0 — Mega Núcleo Matriz con CRYSTALS-LATAMV*
