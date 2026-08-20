# Isabella Villaseñor AI™ v6.1.0

## Infraestructura Cognitiva Territorial Híbrida y Gobernada

> *"No somos un chatbot con temática. Somos una infraestructura cognitiva territorial con identidad, gobernanza y arraigo."*

**Isabella Villaseñor AI™** es una plataforma de infraestructura cognitiva territorial (Territorial Cognitive Infrastructure — TCI) diseñada para integrar inteligencia artificial, gobernanza computacional C.R.O.W.N., memoria contextual jerárquica, seguridad Zero-Trust, trazabilidad criptográfica, experiencias multimodales y monetización contextual — todo desde una perspectiva latinoamericana, soberana y territorial.

| Campo | Valor |
| --- | --- |
| **Versión** | v6.1.0 (Agosto 2026) |
| **Categoría** | Infraestructura Cognitiva Territorial (TCI) |
| **Nodo Cero** | Real del Monte, Hidalgo, México |
| **Autor** | Edwin Oswaldo Castillo Trejo (*Anubis Villaseñor*) |
| **ORCID** | [0009-0008-5050-1539](https://orcid.org/0009-0008-5050-1539) |
| **Ecosistema** | TAMV ONLINE NETWORK · RDM Digital Hub |
| **Deploy target** | Vercel (Edge + Serverless) |
| **Stack** | React 19 · TypeScript 5.8 · Vite 6 · Express 4 · Tailwind CSS v4 · Zod v4 |

---

## Qué es Isabella

Isabella Villaseñor AI™ no es un chatbot genérico ni un wrapper de GPT. Es una **arquitectura cognitiva gobernada** compuesta por 5 nodos especializados coordinados por una capa de orquestación central llamada C.R.O.W.N. Cada interacción con el usuario pasa por un pipeline completo de evaluación, generación y auditoría — nunca un simple "prompt in, text out".

El sistema está diseñado para operar bajo **soberanía tecnológica**: los modelos de lenguaje (Gemini 3.7 Flash, etc.) son capacidades instrumentales e intercambiables, subordinadas a la capa de gobernanza. Si el modelo cloud no está disponible, Isabella funciona con un motor local autónomo sin degradación de la experiencia cognitiva.

---

## Changelog v6.1.0 — Auditoría y Hardening Integral

### Seguridad (15 fixes críticos)

| Fix | Archivo | Impacto |
| --- | --- | --- |
| **Auth bypass endurecido** — fallback dev ahora requiere explícito `ALLOW_DEV_AUTH_FALLBACK=true` | `auth.server.ts` | Previene grant silencioso de admin en deploys mal configurados |
| **CORS whitelist** — reemplaza `*` con patrón `CANONICAL_ORIGINS` (de rdm-digital-hub) | `api/[...path].ts` | Bloquea llamadas cross-origin no autorizadas |
| **Credentials header** — `Access-Control-Allow-Credentials: true` | `api/[...path].ts` | Habilita auth basada en cookies |
| **Rate limiter eviction** — barrido TTL cada 2min en `ipBuckets` | `server.ts` | Previene OOM por spoofing de IPs |
| **Agent session cleanup** — barrido TTL cada 5min en `activeAgentSessions` | `server.ts` | Previene OOM por leak de sesiones |
| **Promise double-settle** — flag `settled` evita resolve() duplicado | `api/[...path].ts` | Elimina race condition en handler Vercel |
| **Endpoints protegidos** — audit, policies, migrations, blueprint ahora requieren auth | `server.ts` | Protege datos internos de acceso no autenticado |
| **Idlen click auth** — `authenticate` en endpoint de tracking | `server.ts` | Previene inyección de clicks falsos |
| **Audit hash dinámico** — SHA-256 computado desde logs reales | `server.ts` | Elimina hash estático fabricado |
| **Stale closure fix** — `sendMessageRef` evita captura obsoleta de `sendMessage` | `CrownContext.tsx` | Comandos de voz usan estado actual |
| **Context memoizado** — `useMemo` en valor de CrownProvider | `CrownContext.tsx` | Previene cascade de re-renders cada 1s |
| **HSM unhandled rejection** — try/catch en callback de setInterval | `hsmClient.ts` | Previene crashes silenciosos del proceso |
| **Process error handlers** — `unhandledRejection` + `uncaughtException` | `server.ts` | Shutdown graceful en errores fatales |
| **Image seed randomizado** — `Math.random()*1000000` reemplaza `Date.now()%100000` | `server.ts` | Elimina ventana de colisión de 100K |
| **Quantum array cap** — máximo 10,000 samples | `orchestrator.ts` | Previene DoS por bloqueo del event loop |

### Arquitectura (7 fixes)

| Fix | Archivo | Impacto |
| --- | --- | --- |
| **Zod body validation** en 8 POST endpoints | `api-contracts.ts` | Previene inyección, data malformada, payloads oversized |
| **9 contratos Zod** — `PerceptionInputSchema`, `CognitiveProcessSchema`, `ImageGenSchema`, `TTSSchema`, `AgentLeaseSchema`, `AgentChatSchema`, `IdlenClickSchema`, `CheckoutSchema`, `QuantumExecuteSchema` | `api-contracts.ts` | Validación type-safe en cada frontera API |
| **Agent lease bounds** — `leaseDurationMinutes` limitado a 1-480 min | `server.ts` | Previene creación indefinida de sesiones |
| **Structured JSON logger** — `createLogger("scope")` con niveles, timestamps, scope | `logger.ts` | Reemplaza console.* raw con output JSON estructurado |
| **Response envelope** — helpers `apiOk()`, `apiError()`, `validateBody()` | `api-contracts.ts` | `{ok, data?, error?}` estandarizado en todos los endpoints |
| **ErrorBoundary reset** — usa `resetKey` + `React.Fragment key=` sin recarga completa | `EnterpriseErrorBoundary.tsx` | Preserva estado en memoria al recuperar de errores |
| **GET→POST stream** — `/api/v1/isabella/agent/stream` de GET a POST | `server.ts` | Elimina GET con efectos secundarios (firma PQC, auditoría) |

---

## Qué hace

### Procesamiento cognitivo C.R.O.W.N.

Cada mensaje del usuario genera este pipeline en tiempo real:

```
Mensaje del usuario
  ↓
ARGUS Sentinel — Evaluación de riesgo y sanitización (Zero-Trust)
  ↓
C.R.O.W.N. Gateway — Enrutamiento ponderado dinámico entre módulos
  ↓
ISA + SOPHIA + ORION — Síntesis cognitiva paralela
  ↓ (empatía)   ↓ (razonamiento)   ↓ (creatividad)
C.R.O.W.N. — Fusión de salidas, aplicación de políticas
  ↓
ARGUS — Auditoría post-generación, registro trazable
  ↓
Idlen Ads — Monetización contextual (cada 3er mensaje)
  ↓
Respuesta al usuario + Telemetría cognitiva + Ad patrocinado
```

### Capacidades operativas

| Capacidad | Descripción | Estado |
| --- | --- | --- |
| **Terminal cognitiva interactiva** | CLI con stream de pensamiento, comandos (`/help`, `/status`, `/image`, `/modules`, `/preset`, `/route`, `/argus`, `/voice`, `/sound`) | ✅ Operativo |
| **Tráiler cinematográfico AAA** | HTML5 Canvas 60 FPS, Web Audio 60 Hz, Smooth-Motion, 16 segundos | ✅ Implementado |
| **Generación de arte ORION** | Síntesis visual vía Gemini Imagen 3.0 + Pollinations Flux, 6 estilos configurables | ✅ Implementado |
| **Estudio de voz** | Timbres personalizables, síntesis Web Speech + Gemini TTS Flash | ✅ Implementado |
| **Dashboard de telemetría** | Latencia, tokens, ruta sináptica, métricas por módulo | ✅ Implementado |
| **Trazabilidad criptográfica** | BookPI hash-chain, SHA-256, auditoría inmutable | ✅ Implementado |
| **Seguridad Zero-Trust** | ARGUS Sentinel, evaluación de riesgos, policy-gate, CORS whitelist | ✅ v6.1.0 |
| **Motor soberano local** | Fallback 100% offline sin API key externa | ✅ Operativo |
| **Hub RDM Territorial** | Capas culturales, patrimonio y contexto de Real del Monte | ✅ Implementado |
| **Cattleya Finance** | Sistema financiero interno con planes de suscripción | ✅ Implementado |
| **Quantum Mesh** | 15 módulos de computación cuántica inspired + dashboard 7 paneles | ✅ v6.0.0 |
| **Idlen Chat Ads SDK** | Monetización contextual con pixel, dual click tracking, server-side | ✅ v6.0.0 |
| **Validación Zod integral** | 9 contratos Zod en todas las rutas POST, validación type-safe | ✅ v6.1.0 |
| **Logger estructurado** | JSON logging con scopes, niveles, traceId, timestamps | ✅ v6.1.0 |
| **Rate limiter con TTL** | Eviction automática de buckets expirados, prevenir OOM | ✅ v6.1.0 |

---

## Cómo lo hace

### Stack técnico

| Capa | Tecnología |
| --- | --- |
| **Frontend** | React 19, TypeScript 5.8 (strict), Vite 6, Tailwind CSS v4 |
| **Backend** | Express 4, Node.js 18+ (probado en v24), esbuild bundler |
| **Modelos de IA** | Gemini 3.7 Flash (cloud) + Motor autónomo local (fallback) |
| **Validación** | Zod v4 (9 contratos tipados en payloads HTTP) |
| **Logging** | Logger JSON estructurado con scopes (`src/lib/logger.ts`) |
| **Monetización** | @idlen/chat-sdk v1.0.5 (server + client), Idlen Pixel |
| **Despliegue** | Vercel (serverless functions + SPA rewrite rules) |
| **Criptografía** | SHA-256 BookPI, CRYSTALS-LATAMV (experimental poscuántico) |

### Arquitectura pentanodal

```
┌─────────────────────────────────────────────────────────────┐
│                    INTERFAZ DE USUARIO                      │
│        React 19 · Terminal · Studio · Dashboard · Hub       │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────┐
│               C.R.O.W.N. GATEWAY (Orquestador)              │
│     Enrutamiento ponderado · Políticas · Evaluación riesgo  │
└──┬──────────┬──────────┬──────────┬──────────┬──────────────┘
   │          │          │          │          │
┌──▼──┐  ┌───▼───┐  ┌───▼───┐  ┌──▼───┐  ┌──▼──────┐
│ ISA │  │SOPHIA │  │ ORION │  │ARGUS │  │ QUANTUM │
│ 21% │  │ 21%   │  │ 21%   │  │ 21%  │  │  MESH   │
│Empa-│  │Dialéc-│  │Síntes-│  │Guard-│  │  15     │
│tía  │  │tica   │  │is     │  │ianía │  │ módulos │
└──┬──┘  └───┬───┘  └───┬───┘  └──┬───┘  └──┬──────┘
   │         │          │         │          │
┌──▼─────────▼──────────▼─────────▼──────────▼──────────────┐
│           MEMORIA · TELEMETRÍA · AUDITORÍA                │
│     BookPI hash-chain · Atlas · Event Bus · BookPI Q      │
└───────────────────────────────────────────────────────────┘
```

### Quantum Mesh

La **Isabella Quantum Mesh** es una capa de orquestación computacional inspirada en principios de computación cuántica, implementada enteramente en TypeScript:

| Módulo | Función |
| --- | --- |
| `contracts.ts` | Contratos Zod tipados para jobs, dispositivos, circuitos |
| `orchestrator.ts` | Orquestador central de la malla cuántica (cap: 10K samples) |
| `scheduler.ts` | Planificación de tareas por prioridad (interactive/normal/batch) |
| `circuit-breaker.ts` | Protección contra fallos en cascada |
| `device-registry.ts` | Registro y discovery de dispositivos computacionales |
| `core-registry.ts` | Registro de núcleos de procesamiento cuántico |
| `policy-engine.ts` | Motor de políticas para ejecución gobernada |
| `worker-manager.ts` | Gestión de workers de ejecución paralela |
| `event-bus.ts` | Bus de eventos internos de la malla |
| `telemetry.ts` | Telemetría de rendimiento cuántico |
| `hsm-client.ts` | Cliente HSM con health check error-handling |
| `tee-attestation.ts` | Attestation de Trusted Execution Environment |
| `bookpi-quantum.ts` | Trazabilidad BookPI cuántica |
| `recovery.ts` | Recuperación ante fallos |
| `index.ts` | Barrel de exportación y diagnóstico |

### Idlen Integration — Monetización

Integración completa del SDK de Idlen para monetización contextual de conversaciones:

**Server-side** (`src/lib/idlen-ads.server.ts`):
- Extracción de contexto del mensaje del usuario vía diccionario local del SDK
- Solicitud de ads contextuales cada 3er mensaje (sin spam)
- Inyección de `sponsoredContent` en la respuesta de Isabella
- Tracking de impresiones y clicks vía API de Idlen (con auth)

**Client-side** (`MessageStream.tsx`):
- Tarjeta de anuncio patrocinada nativa con diseño integrado
- Dual click tracking: pixel + `POST /api/v1/idlen/click`
- Session ID estable vía `sessionStorage` para atribución

**Tracking** (`index.html`):
- Idlen Pixel con ID `9dac0977-fcd0-4cd9-af41-ddc8a67edcde`
- SPA PageView tracking automático en cambios de vista
- Listo para conversiones (signup, trial, purchase)

---

## Endpoints API (48 rutas)

Todos los endpoints POST validan body con Zod v4. Responses estandarizadas: `{ok, data?, error?}`.

### Core cognitivo
| Método | Ruta | Auth | Validación | Propósito |
| --- | --- | --- | --- | --- |
| `POST` | `/api/isabella/process` | ✅ | `CognitiveProcessSchema` | Procesamiento cognitivo C.R.O.W.N. |
| `GET` | `/api/v1/isabella` | — | — | Metadatos y diagnóstico |
| `POST` | `/api/v1/isabella` | ✅ | `PerceptionInputSchema` | Procesamiento de percepciones |
| `POST` | `/api/v1/isabella/agent/lease` | ✅ scope | `AgentLeaseSchema` | Arrendamiento de agente (max 480min) |
| `POST` | `/api/v1/isabella/agent/chat` | ✅ scope | `AgentChatSchema` | Chat con stream de razonamiento |
| `POST` | `/api/v1/isabella/agent/stream` | ✅ scope | — | SSE streaming en tiempo real |
| `GET` | `/api/v1/isabella/audit` | ✅ scope | — | Registro de auditoría (hash dinámico) |
| `GET` | `/api/v1/isabella/memory` | ✅ scope | — | Consulta de memoria jerárquica |
| `POST` | `/api/v1/isabella/memory` | ✅ scope | — | Registro en memoria |
| `GET` | `/api/v1/isabella/tools` | ✅ | — | Catálogo de herramientas |
| `POST` | `/api/v1/isabella/tools/execute` | ✅ | — | Sandbox de ejecución |
| `GET` | `/api/v1/isabella/policies` | ✅ scope | — | Políticas C.R.O.W.N. & ARGUS |
| `GET` | `/api/v1/isabella/migrations` | ✅ admin | — | Esquemas SQL |
| `GET` | `/api/v1/isabella/blueprint` | ✅ admin | — | Especificación arquitectónica |
| `GET` | `/api/v1/isabella/v5/fusion` | ✅ | — | Fusión operacional blindada v5 |

### Auth & Usuarios
| Método | Ruta | Propósito |
| --- | --- | --- |
| `POST` | `/api/v1/auth/signup` | Registro con PBKDF2 |
| `POST` | `/api/v1/auth/login` | Login con trazabilidad |
| `POST` | `/api/v1/auth/logout` | Logout |
| `GET` | `/api/v1/users/me` | Usuario autenticado |
| `GET` | `/api/v1/profiles/:handle` | Perfil público |
| `PUT` | `/api/v1/profiles/me` | Actualizar perfil |

### Social & Streaming
| Método | Ruta | Propósito |
| --- | --- | --- |
| `POST` | `/api/v1/social/posts` | Crear post multimedia |
| `GET` | `/api/v1/social/feed` | Feed público |
| `POST` | `/api/v1/streams` | Sala WebRTC |

### XR, Protocolos & Economía
| Método | Ruta | Propósito |
| --- | --- | --- |
| `POST` | `/api/v1/xr/dreamspaces` | Espacio XR con overlay guardian |
| `POST` | `/api/v1/protocols` | Protocolo civilizable auditable |
| `GET` | `/api/v1/protocols` | Listar protocolos |
| `POST` | `/api/v1/economy/credits` | Créditos internos no especulativos |

### Quantum Mesh
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
| `GET` | `/api/v1/quantum/hsm` | ✅ operator | Estado HSM |
| `POST` | `/api/v1/quantum/hsm/reset` | ✅ admin | Reset circuitos HSM |
| `GET` | `/api/v1/quantum/tee` | ✅ | Attestation TEE |
| `GET` | `/api/v1/quantum/events` | ✅ | Eventos de la malla |
| `GET` | `/api/v1/quantum/cores` | ✅ | 24 módulos core |
| `GET` | `/api/v1/quantum/telemetry` | ✅ | Telemetría completa |
| `GET` | `/api/v1/quantum/recovery` | ✅ | Incidentes activos |
| `POST` | `/api/v1/quantum/recovery/resolve` | ✅ operator | Resolver incidente |
| `GET` | `/api/v1/quantum/migrations` | ✅ | Esquemas SQL cuánticos |
| `GET` | `/api/v1/quantum/blueprint` | ✅ | Blueprint arquitectónico |

### Billing & Monetización
| Método | Ruta | Auth | Validación | Propósito |
| --- | --- | --- | --- | --- |
| `GET` | `/api/v1/billing/plans` | ✅ | — | Planes y uso actual |
| `GET` | `/api/v1/billing/usage` | ✅ | — | Detalle de uso |
| `POST` | `/api/v1/billing/checkout` | ✅ scope | `CheckoutSchema` | Crear checkout |
| `GET` | `/api/v1/billing/checkout/mock` | ✅ admin | — | Mock checkout (dev) |

### Multimodal
| Método | Ruta | Auth | Validación | Propósito |
| --- | --- | --- | --- | --- |
| `POST` | `/api/isabella/generate-image` | ✅ | `ImageGenSchema` | Generación de imagen (Gemini + Flux) |
| `POST` | `/api/isabella/tts` | ✅ | `TTSSchema` | Text-to-Speech (Gemini TTS) |
| `POST` | `/api/v1/idlen/click` | ✅ | `IdlenClickSchema` | Tracking de clicks Idlen |

### Health & Diagnóstico
| Método | Ruta | Propósito |
| --- | --- | --- |
| `GET` | `/api/health` | Health check completo |
| `GET` | `/api/health/quantum` | Health quantum mesh |
| `GET` | `/api/health/idlen` | Estado integración Idlen |

---

## Posicionamiento global

| Dimensión | Chatbots convencionales | Frameworks de agentes (LangChain, etc.) | **Isabella Villaseñor AI™** |
| --- | --- | --- | --- |
| **Categoría** | Aplicación conversacional | Librería de orquestación | **Infraestructura Cognitiva Territorial** |
| **Gobernanza** | Ninguna / prompt-level | Configurable pero manual | **C.R.O.W.N. determinista con ARGUS** |
| **Identidad** | Genérica / dependiente del modelo | Sin identidad propia | **Isabella — identidad territorial permanente** |
| **Seguridad** | Rate limiting básico | Implementación del developer | **Zero-Trust + CORS whitelist + Zod en cada POST** |
| **Trazabilidad** | Logs planos | Opcional | **BookPI hash-chain + SHA-256 dinámico** |
| **Validación** | Manual / inconsistente | Opcional | **9 contratos Zod v4 en todas las rutas POST** |
| **Logging** | console.log raw | Opcional | **Logger JSON estructurado con scopes y niveles** |
| **Modelos** | Atado a un proveedor | Multi-proveedor pero acoplado | **Soberanía total: intercambiables vía C.R.O.W.N.** |
| **Fallback** | Error 500 | Error o retry | **Motor autónomo local 100% offline** |
| **Contexto territorial** | Ninguno | Ninguno | **Real del Monte · LatAm · Sur Global** |
| **Monetización** | Ninguna / externa | Ninguna | **Idlen SDK contextual nativo** |
| **Cuántico (experimental)** | Ninguno | Ninguno | **Quantum Mesh 15 módulos + dashboard** |
| **Multimodal** | Texto ± voz | Texto ± herramientas | **Terminal · Arte · Voz · Tráiler 60fps · XR** |
| **Memory management** | Ninguna | Opcional | **TTL eviction en rate limiter + sesiones** |

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

# Seguridad (v6.1.0)
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

## Estructura del proyecto

```
isabella-mexa/
├── server.ts                    # Express server — 1560+ líneas, 48 endpoints
├── api/[...path].ts             # Vercel catch-all (circuit breaker, CORS whitelist, tracing)
├── index.html                   # SPA entry + Idlen Pixel
├── vercel.json                  # Vercel deployment config
├── .env.example                 # Variables de entorno documentadas
├── src/
│   ├── App.tsx                  # Router principal + 10 vistas + SPA PageView tracking
│   ├── main.tsx                 # Entry point React
│   ├── types.ts                 # Tipos TypeScript + Window.idlen declaration
│   ├── contracts/               # Contratos Zod v4 (isabella.ts)
│   ├── context/
│   │   └── CrownContext.tsx     # Estado global C.R.O.W.N. (useMemo, refs estables)
│   ├── lib/
│   │   ├── api-contracts.ts     # 9 contratos Zod + validateBody() + response envelope
│   │   ├── logger.ts            # Logger JSON estructurado con scopes
│   │   ├── auth.server.ts       # Autenticación HS256 JWT (dev fallback opt-in)
│   │   ├── idlen-ads.server.ts  # Integración Idlen Ads SDK
│   │   ├── bookpi.server.ts     # BookPI hash-chain
│   │   ├── atlas-kernel.server.ts # Atlas audit kernel
│   │   ├── economy.server.ts    # Economía interna
│   │   ├── hsmClient.ts         # HSM con error handling en health checks
│   │   ├── postQuantumCrypto.ts # CRYSTALS-LATAMV
│   │   ├── subscription.server.ts # Billing + plans (con TTL en usage buckets)
│   │   ├── isabella-crown.ts    # Gateway C.R.O.W.N.
│   │   ├── isabella-v5.ts       # Fusión operacional v5
│   │   ├── quantum/             # 15 módulos Quantum Mesh
│   │   │   ├── contracts.ts     # Contratos Zod cuánticos
│   │   │   ├── orchestrator.ts  # Orquestador (cap: 10K samples/event loop)
│   │   │   ├── scheduler.ts     # Planificador de jobs
│   │   │   ├── circuit-breaker.ts
│   │   │   ├── device-registry.ts
│   │   │   ├── core-registry.ts
│   │   │   ├── policy-engine.ts
│   │   │   ├── worker-manager.ts
│   │   │   ├── event-bus.ts
│   │   │   ├── telemetry.ts
│   │   │   ├── hsm-client.ts
│   │   │   ├── tee-attestation.ts
│   │   │   ├── bookpi-quantum.ts
│   │   │   ├── recovery.ts
│   │   │   └── index.ts
│   │   └── ... (40+ módulos de infraestructura)
│   ├── components/
│   │   ├── Terminal/            # Terminal cognitiva + MessageStream (dual click tracking)
│   │   ├── Dashboard/           # Cockpit, ModuleCard, CattleyaFinance
│   │   ├── Quantum/             # QuantumMeshDashboard (7 paneles)
│   │   ├── Traceability/        # Dashboard trazabilidad + Crypto
│   │   ├── Security/            # ARGUS SecurityGovernance
│   │   ├── Studio/              # ImageStudio + VoiceStudio
│   │   ├── Welcome/             # Tráiler cinematográfico 60fps
│   │   ├── Hub/                 # Hub territorial RDM
│   │   ├── Presentation/        # Dossier presentación
│   │   ├── Billing/             # Planes de suscripción
│   │   ├── EnterpriseErrorBoundary.tsx  # Error boundary (reset sin reload)
│   │   └── ... (16 directorios, 34+ componentes)
│   ├── domains/                 # Dominio AI (DDD)
│   │   └── ai/infrastructure/   # audit-tracer, memory-store, policy-gate, tools-catalog
│   ├── data/                    # Migraciones SQL + datos de presentación
│   ├── services/                # territoryContextService
│   └── hooks/                   # useGlobalShortcuts
```

**Estadísticas del código**:
- **115 archivos** TypeScript/TSX
- **~23,500 líneas** de código
- **48 endpoints** API REST (todos POST con Zod validation)
- **9 contratos Zod** para validación de entrada
- **15 módulos** Quantum Mesh
- **34+ componentes** React
- **16 vistas** de navegación

---

## Seguridad

- **Zero-Trust** por defecto: ARGUS evalúa cada operación antes de ejecutar
- **Auth bypass endurecido**: fallback dev requiere `ALLOW_DEV_AUTH_FALLBACK=true` explícito
- **CORS whitelist**: `CANONICAL_ORIGINS` reemplaza wildcard `*` (patrón rdm-digital-hub)
- **Sanitización de entradas**: 9 contratos Zod v4 en todas las rutas POST
- **Passwords**: PBKDF2 + salt (producción: JWT HS256 con `ISABELLA_AUTH_SECRET`)
- **Endpoints protegidos**: audit, policies, migrations, blueprint requieren auth + scopes/roles
- **Trazabilidad**: BookPI hash-chain + SHA-256 dinámico computado desde logs
- **Rate limiter con TTL**: Eviction automática cada 2min, prevenir OOM
- **Memory management**: Agent sessions con TTL sweep cada 5min
- **Process handlers**: `unhandledRejection` + `uncaughtException` para shutdown graceful
- **Credenciales**: Nunca en código fuente ni cliente
- **Logger estructurado**: JSON con scopes, niveles, timestamps para debugging en producción

---

## Limitaciones conocidas

1. **Inferencia cloud** requiere `GEMINI_API_KEY` válida; sin ella, opera con motor local simulado
2. **Alucinaciones estadísticas**: ARGUS atenúa pero no elimina completamente las alucinaciones del modelo
3. **Quantum Mesh** es computación clásica inspirada en principios cuánticos, no hardware cuántico real
4. **Idlen Ads**: Requiere API key válida de Idlen; sin ella, las respuestas van sin ads
5. **Poscuántico**: `CRYSTALS-LATAMV` es una especificación/prototipo en TypeScript
6. **Persistencia**: Estado en memoria (rate limits, sesiones, uso) se reinicia al reiniciar el proceso

---

## Roadmap

| Horizonte | Objetivo |
| --- | --- |
| **Corto plazo** | Deploy a Vercel producción, pruebas E2E, optimización móvil, split de `server.ts` en módulos |
| **Mediano plazo** | RAG Kórima Nexus con vector DB, WebSockets para streaming, PostgreSQL para persistencia |
| **Largo plazo** | Integración QPU real, federación multi-nodo, DAO de gobernanza, LITLE-32 trust fabric |

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

*Documento actualizado el 19 de agosto de 2026 — Isabella Villaseñor AI™ v6.1.0*
