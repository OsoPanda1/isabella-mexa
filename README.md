# Isabella Villaseñor AI — Genesis

> *"No somos un chatbot. Somos una infraestructura cognitiva territorial con soberanía, identidad, y 12 núcleos operativos que se sostienen entre sí."*

**Isabella Villaseñor AI** es una plataforma de infraestructura cognitiva territorial (TCI) con arquitectura distribuida de 12 módulos nucleares, cadena de procedencia BookPI con verificación de integridad por contenido-hash, mesh de ingreso distribuido con redundancia N+1, circuitos de recuperación automática, y gobernanza de datos con consentimiento explícito. Diseñada desde Real del Monte, Hidalgo, México.

---

## Estado del Proyecto

| Campo | Valor |
|-------|-------|
| **Versión** | Genesis (Agosto 2026) |
| **Stack** | Vite 6 + React 19 + Express 4 + TypeScript 5.8 + Tailwind v4 |
| **Persistencia** | SQLite (better-sqlite3, WAL) + PostgreSQL (Supabase) |
| **Tests** | 94/94 passing |
| **TypeScript** | 0 errors (strict mode) |
| **Build** | Vite (frontend) + esbuild (server) → Vercel |
| **Auth** | JWT HS256 con roles y scopes |
| **Deploy** | Vercel (Edge + Serverless) |

---

## Arquitectura Genesis

### Los 12 Nucleos (Core Modules)

Cada modulo opera independientemente con persistencia propia, auditoria integrada, y emiticion de eventos. Si uno falla, los demas sostienen el sistema.

```
┌─────────────────────────────────────────────────────────────┐
│                    INGRESS DISTRIBUTOR                       │
│          (Distribuye datos a los 12 modulos)                │
├─────┬─────┬──────┬──────┬──────┬──────┬─────┬─────┬───────┤
│ O   │ P   │ Ctx  │ Plan │ Skill│ Prov │ Tool│ Gw  │ ...   │
│ rch │ Prom│ Comp │ ner  │ Reg  │ Reg  │ Dsp │     │       │
├─────┴─────┴──────┴──────┴──────┴──────┴─────┴─────┴───────┤
│                  GOVERNANCE LAYER                            │
│            Consent · Safety · Data Rights · Audit            │
├─────────────────────────────────────────────────────────────┤
│              BOOKPI LEGACY (Append-Only Chain)              │
│                  SQLite + PostgreSQL Mirror                  │
└─────────────────────────────────────────────────────────────┘
```

| # | Modulo | Ubicacion | Funcion |
|---|--------|-----------|---------|
| 1 | **Orchestrator** | `src/core/orchestrator/` | Loop agente: input → context → inferencia → herramientas → respuesta |
| 2 | **Prompt Builder** | `src/core/orchestrator/prompt-builder.ts` | Capas L0-L5: constitucion, politica, personalidad, contexto, memoria, ephemeral |
| 3 | **Context Compressor** | `src/core/context/` | Compresion de ventana de contexto con estimacion de tokens |
| 4 | **Planner** | `src/core/planner/` | Ciclo de vida de planes/pasos con estrategias de recuperacion |
| 5 | **Skill Registry** | `src/core/skills/` | Skills versionados con triggers (manual/cron/evento/webhook) |
| 6 | **Provider Registry** | `src/core/runtime/provider-registry.ts` | Abstraccion de inferencia: Gemini, Sovereign Local, Fallback |
| 7 | **Tool Dispatch** | `src/core/runtime/tool-dispatch.ts` | Ejecucion de herramientas con verificacion de permisos |
| 8 | **Gateway** | `src/core/gateway/` | Framework de adaptadores multi-canal (API/webhook/voz) |
| 9 | **Consent** | `src/governance/consent.ts` | Gestion explicita de consentimiento por ambito |
| 10 | **Safety** | `src/governance/safety.ts` | Clasificador de riesgo: low/medium/high |
| 11 | **Data Rights** | `src/governance/data-rights.ts` | Retencion, exportacion, eliminacion, purga por expiracion |
| 12 | **Audit Receipt** | `src/governance/audit-receipt.ts` | Recibos de acciones encadenados por hash con verificacion |

### Mesh de Ingreso Distribuido

El sistema anterior dependia de un punto unico de entrada (BookPI). Ahora el **IngressDistributor** distribuye datos a traves de todos los modulos simultaneamente:

- **13 rutas de ingreso** (12 modulos + BookPI legacy)
- **Clasificacion de prioridad**: critical/high/medium/low
- **20 tipos de datos** con rutas optimizadas
- **Cola de escritura asincrona**: batches de 20, flush cada 50ms
- **Redundancia N+1**: si fallan N modulos, el sistema continua

### Resiliencia y Monitoreo

- **Health Monitor**: heartbeat por modulo, 5 niveles de alerta (green → critical)
- **Circuit Breakers**: 5 fallos consecutivos → circuito abierto, auto-recuperacion en 60s
- **Fallback Chains**: cada modulo tiene cadena de respaldo
- **Degradation Modes**: full → reduced → minimal → degraded
- **Alertas internas**: el usuario nunca se entera, los protocolos trabajan en segundo plano

### BookPI — Cadena de Procedencia

- **Content-hash verification**: cubre TODOS los campos del bloque
- **O(1) incremental integrity**: checkpoint cacheado, solo verifica bloques nuevos
- **Async batch writer**: transacciones SQLite agrupadas de 20 en 20
- **Mirror PG fire-and-forget**: replicacion asincrona a PostgreSQL

---

## Seguridad

### Autenticacion y Autorizacion

- JWT HS256 con `sub`, `tenantId`, `roles`, `scopes`
- Roles jerarquicos: `viewer < citizen < operator < admin < system`
- Rate limiting por IP (X-Forwarded-For)
- 5 endpoints autenticados en el nucleo principal

### Controles Implementados

- **Cross-tenant IDOR**: tenantId/userId derivados del principal autenticado
- **Kill-switch**: requiere rol `admin` para activar/paso/resolver
- **Scope escalation**: tokens emitidos con scopes limitados (no wildcard)
- **Consentimiento**: datos de usuario requieren consentimiento explicito por ambito

### Amenazas Mitigadas

| Amenaza | Estado |
|---------|--------|
| Auth bypass | Mitigado |
| CORS wildcard | Mitigado |
| Credentials header | Mitigado |
| Agent unbounded | Mitigado |
| Promise settle | Mitigado |
| Cross-tenant IDOR | Mitigado |
| Kill-switch unprivileged | Mitigado |
| Stale closure | Mitigado |
| HSM silent rejection | Mitigado |

---

## Persistencia

### SQLite (Principal)

```
lib/persistence/sqlite.ts
├── bookpi_blocks (blockHash PRIMARY KEY)
├── quantum_events (eventId PRIMARY KEY)
├── audit_logs (id PRIMARY KEY)
├── memories (id PRIMARY KEY)
├── telemetry_counters (id, UNIQUE(name, labels))
├── telemetry_histograms (id)
└── telemetry_spans (spanId PRIMARY KEY)
```

### PostgreSQL (Mirror)

Conectado via Supabase pooler. Fire-and-forget con `ON CONFLICT DO NOTHING`.

### Dual-Write Pattern

Cada operacion critica escribe en SQLite (sincrono, WAL) + PostgreSQL (asincrono, mirror). Si SQLite falla, fallback a memoria. Si PG falla, el dato se pierde silenciosamente (documentado como aceptable para mirror).

---

## API — Endpoints Principales

### Core (12 modulos)

| Metodo | Ruta | Auth | Funcion |
|--------|------|------|---------|
| POST | `/api/v1/core/agent/run` | JWT | Ejecutar agente |
| GET | `/api/v1/core/sessions` | JWT | Listar sesiones |
| POST | `/api/v1/core/plans` | JWT | Crear plan |
| GET | `/api/v1/core/skills` | JWT | Listar skills |
| POST | `/api/v1/core/classify-risk` | JWT | Clasificar riesgo |
| POST | `/api/v1/core/consent/grant` | JWT | Otorgar consentimiento |
| GET | `/api/v1/core/audit` | JWT | Obtener recibos |
| POST | `/api/v1/core/gateway/message` | JWT | Procesar mensaje |

### Ingress Mesh (12 modulos)

| Metodo | Ruta | Auth | Funcion |
|--------|------|------|---------|
| POST | `/api/v1/ingress/deliver` | JWT | Entregar paquete |
| GET | `/api/v1/ingress/metrics` | JWT | Metricas de ingreso |
| GET | `/api/v1/ingress/health` | JWT | Estado del mesh |
| GET | `/api/v1/ingress/alerts` | JWT | Log de alertas |
| GET | `/api/v1/ingress/routing-table` | JWT | Tabla de rutas |
| GET | `/api/v1/ingress/load` | JWT | Carga por modulo |
| GET | `/api/v1/ingress/degradation` | JWT | Modo de degradacion |
| GET | `/api/v1/ingress/circuit-breakers` | JWT | Estado de circuitos |

### Infraestructura

| Metodo | Ruta | Auth | Funcion |
|--------|------|------|---------|
| GET | `/api/health` | Public | Health check |
| GET | `/api/v1/quantum/bookpi` | JWT | Metricas BookPI |
| POST | `/api/v1/kill-switch/activate` | Admin | Activar kill-switch |
| POST | `/api/v1/auth/login` | Public | Login JWT |

---

## Verificacion Obligatoria

```bash
npx tsc --noEmit        # TypeScript (0 errores)
npm run lint            # ESLint
npm test                # Vitest (94 tests)
npm run build           # Produccion
```

---

## Estructura del Repositorio

```
isabella-mexa/
├── server.ts                    # Express server (~2000 lineas)
├── src/
│   ├── core/                    # 12 modulos nucleares
│   │   ├── orchestrator/        # Modulo 1-2: agente + prompt
│   │   ├── context/             # Modulo 3: compresion
│   │   ├── planner/             # Modulo 4: planes
│   │   ├── skills/              # Modulo 5: skills
│   │   ├── runtime/             # Modulo 6-7: providers + tools
│   │   ├── gateway/             # Modulo 8: canales
│   │   ├── ingress/             # Mesh distribuido
│   │   └── index.ts             # Barrel export
│   ├── governance/              # Modulo 9-12: consent/safety/rights/audit
│   ├── domains/ai/              # Dominio IA (memory, audit, tools)
│   ├── lib/
│   │   ├── persistence/         # SQLite + PostgreSQL
│   │   ├── quantum/             # BookPI, event-bus, telemetry
│   │   └── auth.server.ts       # JWT + roles + scopes
│   └── App.tsx                  # Frontend React
├── tests/                       # 11 archivos, 94 tests
├── dist/                        # Build de produccion
├── supabase/migrations/         # SQL schema
└── .github/workflows/ci.yml     # CI (pendiente setup manual)
```

---

## Version

**Genesis** — La primera版本 completamente funcional con:
- 12 modulos operativos con logica real
- Mesh de ingreso distribuido con redundancia N+1
- Monitoreo de salud con auto-recuperacion
- BookPI con verificacion de contenido y batch asincrono
- Seguridad hardening: IDOR fix, role gates, consentimiento
- 94 tests passing, 0 errores TypeScript

---

**Autor**: Edwin Oswaldo Castillo Trejo (*Anubis Villaseñor*)
**ORCID**: [0009-0008-5050-1539](https://orcid.org/0009-0008-5050-1539)
**Ecosistema**: TAMV ONLINE NETWORK · RDM Digital Hub · LITLE Trust Fabric
**Nodo Cero**: Real del Monte, Hidalgo, México
