# Isabella Villaseñor AI™ v6.0.0

## Infraestructura Cognitiva Territorial Híbrida y Gobernada

> *"No somos un chatbot con temática. Somos una infraestructura cognitiva territorial con identidad, gobernanza y arraigo."*

**Isabella Villaseñor AI™** es una plataforma de infraestructura cognitiva territorial (Territorial Cognitive Infrastructure — TCI) diseñada para integrar inteligencia artificial, gobernanza computacional C.R.O.W.N., memoria contextual jerárquica, seguridad Zero-Trust, trazabilidad criptográfica, experiencias multimodales y monetización contextual — todo desde una perspectiva latinoamericana, soberana y territorial.

| Campo | Valor |
| --- | --- |
| **Versión** | v6.0.0 (Agosto 2026) |
| **Categoría** | Infraestructura Cognitiva Territorial (TCI) |
| **Nodo Cero** | Real del Monte, Hidalgo, México |
| **Autor** | Edwin Oswaldo Castillo Trejo (*Anubis Villaseñor*) |
| **ORCID** | [0009-0008-5050-1539](https://orcid.org/0009-0008-5050-1539) |
| **Ecosistema** | TAMV ONLINE NETWORK · RDM Digital Hub |
| **Deploy target** | Vercel (Edge + Serverless) |
| **Stack** | React 19 · TypeScript · Vite · Express · Tailwind CSS v4 · Zod v4 |

---

## Qué es Isabella

Isabella Villaseñor AI™ no es un chatbot genérico ni una wrappers de GPT. Es una **arquitectura cognitiva gobernada** compuesta por 5 nodos especializados coordinados por una capa de orquestación central llamada C.R.O.W.N. Cada interacción con el usuario pasa por un pipeline completo de evaluación, generación y auditoría — nunca un simple "prompt in, text out".

El sistema está diseñado para operar bajo **soberanía tecnológica**: los modelos de lenguaje (Gemini 3.7 Flash, etc.) son capacidades instrumentales e intercambiables, subordinadas a la capa de gobernanza. Si el modelo cloud no está disponible, Isabella funciona con un motor local autónomo sin degradación de la experiencia cognitiva.

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
| **Generación de arte ORION** | Síntesis visual vía Pollinations/Imagen, estilos configurables | ✅ Implementado |
| **Estudio de voz** | Timbres personalizables, síntesis Web Speech + Gemini TTS | ✅ Implementado |
| **Dashboard de telemetría** | Latencia, tokens, ruta sináptica, métricas por módulo | ✅ Implementado |
| **Trazabilidad criptográfica** | BookPI hash-chain, SHA-256, auditoría inmutable | ✅ Implementado |
| **Seguridad Zero-Trust** | ARGUS Sentinel, evaluación de riesgos, policy-gate | ✅ Implementado |
| **Motor soberano local** | Fallback 100% offline sin API key externa | ✅ Operativo |
| **Hub RDM Territorial** | Capas culturales, patrimonio y contexto de Real del Monte | ✅ Implementado |
| **Cattleya Finance** | Sistema financiero interno con planes de suscripción | ✅ Implementado |
| **Quantum Mesh** | 15 módulos de computación cuántica inspired (scheduler, HSM, TEE, circuit-breaker) | ✅ v6.0.0 |
| **Idlen Chat Ads SDK** | Monetización contextual con pixel de tracking y conversiones | ✅ v6.0.0 |
| **Malla cuántica dashboard** | Panel de visualización de 7 subsistemas cuánticos en tiempo real | ✅ v6.0.0 |

---

## Cómo lo hace

### Stack técnico

| Capa | Tecnología |
| --- | --- |
| **Frontend** | React 19, TypeScript 5.8 (strict), Vite 6, Tailwind CSS v4 |
| **Backend** | Express 4, Node.js 18+ (probado en v24), esbuild bundler |
| **Modelos de IA** | Gemini 3.7 Flash (cloud) + Motor autónomo local (fallback) |
| **Validación** | Zod v4 (contratos tipados en payloads y configuración) |
| **Monetización** | @idlen/chat-sdk v1.0.5 (server + client), Idlen Pixel |
| **Despliegue** | Vercel (serverless functions + SPA rewrite rules) |
| **CRIPTOGRAFÍA** | SHA-256 BookPI, CRYSTALS-LATAMV (experimental poscuántico) |

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

### Quantum Mesh — Nueva capa v6.0.0

La **Isabella Quantum Mesh** es una capa de orquestación computacional inspirada en principios de computación cuántica, implementada enteramente en TypeScript:

| Módulo | Función |
| --- | --- |
| `contracts.ts` | Contratos Zod tipados para jobs, dispositivos, circuitos |
| `orchestrator.ts` | Orquestador central de la malla cuántica |
| `scheduler.ts` | Planificación de tareas por prioridad (interactive/normal/batch) |
| `circuit-breaker.ts` | Protección contra fallos en cascada |
| `device-registry.ts` | Registro y discovery de dispositivos computacionales |
| `core-registry.ts` | Registro de núcleos de procesamiento cuántico |
| `policy-engine.ts` | Motor de políticas para ejecución gobernada |
| `worker-manager.ts` | Gestión de workers de ejecución paralela |
| `event-bus.ts` | Bus de eventos internos de la malla |
| `telemetry.ts` | Telemetría de rendimiento cuántico |
| `hsm-client.ts` | Cliente HSM (Hardware Security Module) |
| `tee-attestation.ts` | Attestation de Trusted Execution Environment |
| `bookpi-quantum.ts` | Trazabilidad BookPI cuántica |
| `recovery.ts` | Recuperación ante fallos |
| `index.ts` | Barrel de exportación y diagnóstico |

**Dashboard Quantum**: 7 paneles en tiempo real — Orchestrator, Scheduler, Circuit Breaker, Device Registry, Policy Engine, Telemetry y Recovery.

### Idlen Integration — Monetización v6.0.0

Integración completa del SDK de Idlen para monetización contextual de conversaciones:

**Server-side** (`src/lib/idlen-ads.server.ts`):
- Extracción de contexto del mensaje del usuario vía diccionario local del SDK
- Solicitud de ads contextuales cada 3er mensaje (sin spam)
- Inyección de `sponsoredContent` en la respuesta de Isabella
- Tracking de impresiones y clicks vía API de Idlen

**Client-side** (`MessageStream.tsx`):
- Tarjeta de anuncio patrocinada nativa con diseño integrado
- Tracking de clicks vía `window.idlen`
- Design coherente con la estética oscura de Isabella

**Tracking** (`index.html`):
- Idlen Pixel con ID `9dac0977-fcd0-4cd9-af41-ddc8a67edcde`
- PageView tracking automático
- Listo para conversiones (signup, trial, purchase)

---

## Endpoints API (48 rutas)

### Core cognitivo
| Método | Ruta | Propósito |
| --- | --- | --- |
| `POST` | `/api/isabella/process` | Procesamiento cognitivo C.R.O.W.N. completo |
| `GET` | `/api/v1/isabella` | Metadatos y diagnóstico |
| `POST` | `/api/v1/isabella` | Procesamiento de percepciones |
| `POST` | `/api/v1/isabella/agent/lease` | Arrendamiento de sesión de agente |
| `POST` | `/api/v1/isabella/agent/chat` | Chat con stream de razonamiento |
| `GET` | `/api/v1/isabella/agent/stream` | SSE streaming en tiempo real |
| `GET` | `/api/v1/isabella/audit` | Registro de auditoría |
| `GET` | `/api/v1/isabella/memory` | Consulta de memoria jerárquica |
| `POST` | `/api/v1/isabella/memory` | Registro en memoria |
| `GET` | `/api/v1/isabella/tools` | Catálogo de herramientas |
| `POST` | `/api/v1/isabella/tools/execute` | Sandbox de ejecución |
| `GET` | `/api/v1/isabella/policies` | Políticas C.R.O.W.N. & ARGUS |
| `GET` | `/api/v1/isabella/migrations` | Esquemas SQL |
| `GET` | `/api/v1/isabella/blueprint` | Especificación arquitectónica |
| `GET` | `/api/v1/isabella/v5/fusion` | Fusión operacional blindada v5 |

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
| Método | Ruta | Propósito |
| --- | --- | --- |
| `GET` | `/api/v1/quantum/status` | Estado de la malla |
| `POST` | `/api/v1/quantum/jobs` | Crear job cuántico |
| `GET` | `/api/v1/quantum/jobs` | Listar jobs |
| `POST` | `/api/v1/quantum/circuits` | Registrar circuito |
| `GET` | `/api/v1/quantum/circuits` | Listar circuitos |
| `POST` | `/api/v1/quantum/devices` | Registrar dispositivo |
| `GET` | `/api/v1/quantum/devices` | Listar dispositivos |
| `GET` | `/api/v1/quantum/telemetry` | Telemetría cuántica |
| `POST` | `/api/v1/quantum/recovery` | Disparar recuperación |
| `POST` | `/api/v1/quantum/policies` | Gestionar políticas |
| `GET` | `/api/v1/quantum/events` | Eventos de la malla |
| `POST` | `/api/v1/quantum/hsm/challenge` | Challenge HSM |
| `POST` | `/api/v1/quantum/tee/attest` | Attestation TEE |

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
| **Seguridad** | Rate limiting básico | Implementación del developer | **Zero-Trust nativo + ARGUS Sentinel** |
| **Trazabilidad** | Logs planos | Opcional | **BookPI hash-chain + SHA-256 inmutable** |
| **Modelos** | Atado a un proveedor | Multi-proveedor pero acoplado | **Soberanía total: intercambiables vía C.R.O.W.N.** |
| **Fallback** | Error 500 | Error o retry | **Motor autónomo local 100% offline** |
| **Contexto territorial** | Ninguno | Ninguno | **Real del Monte · LatAm · Sur Global** |
| **Monetización** | Ninguna / externa | Ninguna | **Idlen SDK contextual nativo** |
| **Cuántico (experimental)** | Ninguno | Ninguno | **Quantum Mesh 15 módulos + dashboard** |
| **Multimodal** | Texto ± voz | Texto ± herramientas | **Terminal · Arte · Voz · Tráiler 60fps · XR** |
| **Stack** | Cualquiera | Python / JS | **React 19 · TS · Vite · Express · Zod v4** |

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
├── server.ts                    # Express server — 1486 líneas, 48 endpoints
├── index.html                   # SPA entry + Idlen Pixel
├── vercel.json                  # Vercel deployment config
├── src/
│   ├── App.tsx                  # Router principal + 10 vistas
│   ├── main.tsx                 # Entry point React
│   ├── types.ts                 # Tipos TypeScript (TerminalMessage, etc.)
│   ├── contracts/               # Contratos Zod v4 (isabella.ts)
│   ├── context/
│   │   └── CrownContext.tsx     # Estado global C.R.O.W.N. — orquestación
│   ├── lib/
│   │   ├── isabella-crown.ts    # Gateway C.R.O.W.N.
│   │   ├── isabella-v5.ts       # Fusión operacional v5
│   │   ├── isabella-agent-sdk.ts# SDK de agente autónomo
│   │   ├── isabella-quantum.ts  # Bridge quantum
│   │   ├── idlen-ads.server.ts  # Integración Idlen Ads
│   │   ├── bookpi.server.ts     # BookPI hash-chain
│   │   ├── atlas-kernel.server.ts # Atlas audit kernel
│   │   ├── auth.server.ts       # Autenticación PBKDF2
│   │   ├── economy.server.ts    # Economía interna
│   │   ├── hsmClient.ts         # Hardware Security Module
│   │   ├── postQuantumCrypto.ts # CRYSTALS-LATAMV
│   │   ├── quantum/             # 15 módulos Quantum Mesh
│   │   │   ├── contracts.ts     # Contratos Zod cuánticos
│   │   │   ├── orchestrator.ts  # Orquestador central
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
│   │   └── ... (16 directorios, 34 componentes)
│   ├── domains/                 # Dominio AI (DDD)
│   │   └── ai/infrastructure/   # audit-tracer, memory-store, policy-gate, tools-catalog
│   ├── data/                    # Migraciones SQL + datos de presentación
│   ├── services/                # territoryContextService
│   └── hooks/                   # useGlobalShortcuts
```

**Estadísticas del código**:
- **113 archivos** TypeScript/TSX
- **~22,900 líneas** de código
- **48 endpoints** API REST
- **15 módulos** Quantum Mesh
- **34 componentes** React
- **16 vistas** de navegación

---

## Seguridad

- **Zero-Trust** por defecto: ARGUS evalúa cada operación antes de ejecutar
- **Sanitización de entradas**: Contratos Zod v4 en todos los payloads HTTP
- **Passwords**: PBKDF2 + salt (producción: JWT externo con `ISABELLA_AUTH_SECRET`)
- **Trazabilidad**: BookPI hash-chain para eventos críticos
- **Credenciales**: Nunca en código fuente ni cliente
- **Vercel headers**: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`

---

## Limitaciones conocidas

1. **Inferencia cloud** requiere `GEMINI_API_KEY` válida; sin ella, opera con motor local simulado
2. **Alucinaciones estadísticas**: ARGUS atenúa pero no elimina completamente las alucinaciones del modelo
3. **Quantum Mesh** es computación clásica inspirada en principios cuánticos, no hardware cuántico real
4. **Idlen Ads**: Requiere API key válida de Idlen; sin ella, las respuestas van sin ads
5. **Poscuántico**: `CRYSTALS-LATAMV` es una especificación/prototipo en TypeScript

---

## Roadmap

| Horizonte | Objetivo |
| --- | --- |
| **Corto plazo** | Deploy a Vercel producción, pruebas E2E, optimización móvil |
| **Mediano plazo** | RAG Kórima Nexus con vector DB, WebSockets para streaming |
| **Largo plazo** | Integración QPU real, federación multi-nodo, DAO de gobernanza |

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

*Documento generado el 19 de agosto de 2026 — Isabella Villaseñor AI™ v6.0.0*
