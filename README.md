# Isabella Villaseñor AI™ v4.2.0
## Infraestructura Cognitiva Territorial Híbrida y Gobernada

**Isabella Villaseñor AI™** es una propuesta de infraestructura cognitiva territorial orientada a integrar inteligencia artificial, gobernanza computacional, memoria contextual, seguridad, trazabilidad y experiencias multimodales desde una perspectiva latinoamericana.

- **Estado documentado**: 17 de agosto de 2026
- **Clasificación declarada**: Versión candidata a producción, en proceso de validación operativa y documental
- **Nodo Cero**: Real del Monte, Hidalgo, México

---

## Índice

- [Aviso de alcance](#aviso-de-alcance)
- [Identidad del proyecto](#identidad-del-proyecto)
- [Naturaleza del proyecto](#naturaleza-del-proyecto)
- [Problema que aborda](#problema-que-aborda)
- [Propuesta arquitectónica](#propuesta-arquitect%C3%B3nica)
- [Gobernanza C.R.O.W.N.](#gobernanza-crown)
- [Arquitectura pentanodal](#arquitectura-pentanodal)
- [Capacidades del sistema](#capacidades-del-sistema)
- [Estado de implementación](#estado-de-implementaci%C3%B3n)
- [Posicionamiento conceptual](#posicionamiento-conceptual)
- [Principios de diseño](#principios-de-dise%C3%B1o)
- [Requisitos técnicos](#requisitos-t%C3%A9cnicos)
- [Instalación](#instalaci%C3%B3n)
- [Configuración](#configuraci%C3%B3n)
- [Ejecución](#ejecuci%C3%B3n)
- [API](#api)
- [Seguridad y privacidad](#seguridad-y-privacidad)
- [Auditoría e integridad](#auditor%C3%ADa-e-integridad)
- [Limitaciones conocidas](#limitaciones-conocidas)
- [Roadmap](#roadmap)
- [Colaboración](#colaboraci%C3%B3n)
- [Licencia](#licencia)
- [Autoría y ecosistema](#autor%C3%ADa-y-ecosistema)
- [Estado del documento](#estado-del-documento)

---

## Aviso de alcance

Este `README` combina información institucional, descripción arquitectónica y estado declarado de implementación.

Las afirmaciones técnicas deben interpretarse según la siguiente clasificación:

| Estado | Significado |
| --- | --- |
| **Diseñado** | El componente está definido en la arquitectura, pero su implementación puede estar pendiente. |
| **Experimental** | Existe como prototipo, prueba de concepto o componente sujeto a cambios. |
| **Implementado** | Existe código funcional dentro del repositorio. |
| **Operativo** | Ha sido ejecutado en un entorno concreto y cuenta con evidencia de funcionamiento. |
| **Verificado** | Dispone de pruebas, registros, métricas o procedimientos reproducibles. |
| **Planificado** | Forma parte del roadmap, pero aún no se considera disponible. |

La clasificación *Production-Ready* no debe entenderse como certificación externa, auditoría independiente, garantía de disponibilidad permanente ni validación formal de seguridad. La madurez final debe determinarse mediante pruebas reproducibles, revisión de código, evaluación de riesgos, pruebas de carga, análisis de dependencias y validación del entorno de despliegue.

---

## Identidad del proyecto

| Campo | Información |
| --- | --- |
| **Nombre** | Isabella Villaseñor AI™ |
| **Versión documentada** | v4.2.0 |
| **Categoría** | Infraestructura Cognitiva Territorial |
| **Denominación en inglés** | Territorial Cognitive Infrastructure (TCI) |
| **Nodo Cero** | Real del Monte, Hidalgo, México |
| **Autor y creador** | Edwin Oswaldo Castillo Trejo |
| **Identidad creativa** | Anubis Villaseñor |
| **ORCID** | [0009-0008-5050-1539](https://orcid.org/0009-0008-5050-1539) |
| **Ecosistema** | TAMV ONLINE NETWORK · RDM Digital Hub |
| **Fecha del estado documentado** | 17 de agosto de 2026 |

---

## Naturaleza del proyecto

Isabella Villaseñor AI™ constituye una Infraestructura Cognitiva Territorial de carácter híbrido, gobernado y contextualizado.

El sistema propone integrar capacidades de inteligencia artificial con mecanismos de gobernanza computacional, memoria contextual jerárquica, evaluación de riesgos, trazabilidad de eventos y una identidad territorial vinculada al Sur Global y a la comunidad de Real del Monte.

### Características fundamentales
1. **Soberanía de modelos**: Los modelos de lenguaje de gran escala se consideran capacidades instrumentales, intercambiables y subordinadas a la arquitectura de gobernanza.
2. **Gobernanza C.R.O.W.N.**: Capa de coordinación, memoria contextual, evaluación de riesgos y aplicación de políticas.
3. **Arraigo territorial**: Integración de contexto histórico, cultural y lingüístico latinoamericano.
4. **Trazabilidad**: Registro estructurado de decisiones, eventos, políticas e inferencias.
5. **Arquitectura híbrida**: Coexistencia de capacidades federadas en la nube y componentes locales, con posibilidad de operación aislada cuando el entorno lo permita.
6. **Modularidad**: Separación entre interfaz, servicios, agentes, políticas, almacenamiento, herramientas y proveedores de inferencia.

---

## Problema que aborda

### Limitaciones identificadas
El proyecto responde a un conjunto de limitaciones observadas en determinados sistemas convencionales de inteligencia artificial:
- Dependencia de proveedores externos de modelos y servicios.
- Concentración de capacidades cognitivas en un único modelo.
- Contextualización cultural limitada.
- Dificultad para separar identidad, políticas y generación.
- Trazabilidad insuficiente de decisiones y herramientas.
- Riesgo de resultados no verificables o carentes de contexto.
- Ausencia de una capa institucional clara para aplicar políticas.
- Dependencia de conectividad para tareas cognitivas críticas.

Estas limitaciones representan el problema de diseño que Isabella Villaseñor AI™ intenta abordar. No constituyen afirmaciones universales sobre todos los sistemas de inteligencia artificial.

### Propuesta
La plataforma propone una infraestructura cognitiva orientada a:
- Desacoplar la identidad del sistema respecto del proveedor de modelos.
- Aplicar políticas antes de permitir determinadas inferencias o acciones.
- Incorporar evaluación de riesgos en el ciclo operativo.
- Registrar eventos relevantes de manera estructurada.
- Permitir la sustitución progresiva de proveedores de inferencia.
- Integrar capacidades federadas y locales.
- Contextualizar las respuestas mediante memoria jerárquica y conocimiento territorial.
- Separar generación, herramientas, políticas y autoridad de decisión.
- Facilitar auditorías técnicas, institucionales y operativas.

---

## Propuesta arquitectónica

La arquitectura se organiza en capas funcionales:

```
Interfaz y experiencia de usuario
              ↓
  CROWN Gateway y enrutamiento
              ↓
  Políticas y evaluación de riesgo (ARGUS)
              ↓
  Agentes cognitivos especializados (ISA / SOPHIA / ORION)
              ↓
  Modelos de inferencia y herramientas
              ↓
  Memoria, telemetría y auditoría (BookPI)
```

### Principios de separación
- La interfaz no debe constituir la autoridad final del sistema.
- Los modelos no deben definir por sí solos las políticas institucionales.
- Las herramientas deben ejecutarse con permisos explícitos.
- Las operaciones sensibles deben generar eventos auditables.
- Las credenciales y secretos deben permanecer fuera del código fuente.
- Los servicios deben aplicar controles de autenticación y autorización adecuados al entorno.
- Las capacidades experimentales deben identificarse como tales.

---

## Gobernanza C.R.O.W.N.

C.R.O.W.N. representa la capa de coordinación y gobernanza de la infraestructura cognitiva.

El flujo conceptual de procesamiento es:
```
Ingestión → Interpretación → Evaluación de riesgo (ARGUS) → Aplicación de políticas → Selección de modelo/capacidad → Inferencia o ejecución → Registro y auditoría (BookPI)
```

### Objetivos
- Controlar el flujo de solicitudes.
- Evaluar el contexto antes de la generación.
- Aplicar políticas institucionales.
- Seleccionar capacidades de inferencia según el caso de uso.
- Limitar el acceso a herramientas.
- Registrar eventos relevantes.
- Facilitar la revisión posterior de decisiones.
- Mantener separación entre generación y autoridad operativa.

---

## Arquitectura pentanodal

| Nodo | Responsabilidad |
| --- | --- |
| **CROWN GATEWAY** | Coordinación general, enrutamiento, pesos dinámicos, políticas y selección de capacidades. |
| **ISA** | Interpretación semántica, contexto conversacional, identidad y comunicación empática. |
| **SOPHIA** | Razonamiento estratégico, análisis de alternativas y evaluación orientada a objetivos. |
| **ORION** | Inferencia creativa, síntesis visual y generación de experiencias artísticas. |
| **ARGUS** | Evaluación de riesgos, aplicación de controles, revisión ética y guardianía de seguridad. |

### Principios arquitectónicos
- Modularidad funcional.
- Separación de responsabilidades.
- Desacoplamiento entre identidad y modelo.
- Gobernanza jerárquica.
- Evaluación de riesgos previa a operaciones sensibles.
- Trazabilidad de eventos críticos.
- Interoperabilidad entre capacidades locales y federadas.
- Resiliencia operativa.
- Principio de mínimo privilegio.
- Validaciones progresivas y observabilidad estructurada.

---

## Capacidades del sistema

Las siguientes capacidades forman parte del alcance declarado de la versión v4.2.0:
- **Interfaz de usuario basada en React**: Interfaz moderna, accesible y responsiva.
- **Terminal cognitiva interactiva**: Consola CLI con stream de pensamiento y comandos (`/help`, `/status`, `/image`, `/modules`, `/preset`, `/route`, `/argus`, `/voice`, `/sound`, `/presentacion`).
- **Tráiler de apertura AAA (16s)**: Basado en HTML5 Canvas 60 FPS, Web Audio a 60 Hz y Smooth-Motion.
- **Musa Neural**: Con arquetipos emocionales configurables (*Serena, Visionaria, Lúcida, Protectora, Radiante*).
- **ORION Canvas**: Para experiencias visuales generativas.
- **Estudio de voz**: Con timbres personalizables y síntesis Web Speech / Gemini TTS.
- **Panel de trazabilidad y telemetría**: Monitoreo de latencia, tokens y ruta sináptica.
- **API versionada de Isabella**: Endpoints en `/api/v1/isabella`.
- **Sandbox de herramientas**: Catálogo e inspección de ejecución de herramientas.
- **Registro de percepciones, decisiones e inferencias**: Trazabilidad completa.
- **Integración con proveedores externos de inferencia**: Cascada Gemini 3.7 Flash con fallback resiliente.
- **Hub RDM**: Para capacidades territoriales, patrimonio y cultura de Real del Monte.
- **Componentes experimentales de seguridad y auditoría poscuántica**: Especificación `CRYSTALS-LATAMV`, `LITLE-32 Gates` y `BookPI`.

---

## Estado de implementación

- **Versión declarada**: v4.2.0
- **Madurez declarada**: Prototipo avanzado o versión candidata a producción, en proceso de validación operativa y documental.

| Componente | Estado declarado | Evidencia requerida |
| --- | --- | --- |
| **Interfaz de usuario** | Implementada | Código fuente React, componentes en `src/components/` |
| **React, TS, Vite, Tailwind** | Integrados | `package.json`, `vite.config.ts`, `tsconfig.json` |
| **Tráiler de apertura** | Implementado | `IsabellaCinematicTrailer.tsx`, Canvas 60fps |
| **Backend Express** | Implementado | `server.ts`, `express-routes.ts` |
| **Integración Gemini API** | Integrada | Adaptador `@google/genai` en `server.ts` |
| **Terminal cognitiva** | Implementada | `IsabellaTerminal.tsx`, `TerminalCommandLine.tsx` |
| **CROWN Gateway** | Implementado | `CrownContext.tsx`, `isabella-crown.ts` |
| **ISA** | Implementada | Módulos semánticos y estados en `CrownContext.tsx` |
| **SOPHIA** | Implementada | Módulos dialécticos y axiomas en `server.ts` |
| **ORION** | Implementado | `ImageStudioView.tsx`, generador Pollinations/Imagen |
| **ARGUS Sentinel** | Implementado | `SecurityGovernanceModal.tsx`, reglas Zero-Trust |
| **API Isabella** | Implementada | Endpoints `/api/v1/isabella/*` en `server.ts` |
| **Trazabilidad** | Implementada | `TraceabilityDashboard.tsx`, `audit-tracer.ts` |
| **BookPI** | Experimental / Operativo | `bookpi.server.ts`, firmas y ledger |
| **CRYSTALS-LATAMV** | Experimental | `CryptographyTab.tsx`, especificación RFC-0007 |
| **Motor local soberano** | Operativo | Fallback autónomo en `server.ts` |
| **Operación air-gapped** | Operativa | Inferencia 100% local sin `GEMINI_API_KEY` |
| **Experiencias multimodales**| Implementadas | Arte visual, locución TTS y canvas 60 FPS |

---

## Posicionamiento conceptual

| Dimensión | Sistemas convencionales | Isabella Villaseñor AI™ |
| --- | --- | --- |
| **Categoría** | Aplicación conversacional o chatbot | **Infraestructura Cognitiva Territorial (TCI)** |
| **Identidad** | Depende del proveedor o modelo | Diseñada como capa separada del modelo |
| **Gobernanza** | Variable / Opaca | Gobernanza C.R.O.W.N. determinista |
| **Inferencia** | Dependiente de un proveedor | Diseñada para admitir capacidades federadas y locales |
| **Contexto** | Generalista | Territorial, cultural e institucional (Real del Monte / LatAm) |
| **Auditoría** | Registros internos limitados | Trazabilidad por diseño con BookPI |
| **Seguridad** | Depende de la app | Mínimo privilegio, evaluación de riesgos y Zero-Trust |
| **Experiencia** | Conversacional básica | Multimodal (Terminal, Visual, Vocal, Tráiler 60 FPS) |

---

## Principios de diseño

1. **Soberanía tecnológica**: Evitar la dependencia estructural de un único proveedor.
2. **Gobernanza antes que generación**: Aplicar políticas y controles antes de operaciones sensibles.
3. **Trazabilidad por diseño**: Registrar los eventos necesarios para reconstruir el flujo operativo.
4. **Seguridad Zero-Trust**: No asumir confianza implícita entre usuarios, servicios o modelos.
5. **Mínimo privilegio**: Conceder únicamente los permisos necesarios para cada operación.
6. **Modularidad**: Permitir la evolución o sustitución independiente de componentes.
7. **Contextualización territorial**: Reconocer historia, cultura y necesidades de Real del Monte.
8. **Interoperabilidad**: Utilizar interfaces versionadas y contratos explícitos.
9. **Responsabilidad ética**: Mantener supervisión, límites y mecanismos de revisión.
10. **Resiliencia**: Diseñar para fallos parciales, sustitución de modelos y pérdidas de conectividad.
11. **Privacidad**: Reducir la exposición de datos personales y secretos operativos.
12. **Reproducibilidad**: Documentar procedimientos, dependencias, versiones y resultados.

---

## Requisitos técnicos

### Requisitos generales
- **Node.js**: v18.0.0 o superior (Probado en Node.js v24.18.0).
- **npm** (v9+) o **bun**.
- **Git** v2.30+.
- Navegador moderno con soporte WebGL, Canvas HTML5 y Web Speech API.

---

## Instalación

```bash
git clone https://github.com/OsoPanda1/isabella-mexa.git
cd isabella-mexa
npm install --legacy-peer-deps
```

### Verificación de instalación
```bash
npx tsc --noEmit
npm run build
```

---

## Configuración

Crea un archivo `.env` en la raíz del proyecto basado en `.env.example`:

```env
NODE_ENV=development
PORT=3000

# Proveedor de inferencia Cloud (Opcional - Si no se especifica, se activa el Motor Soberano Local)
GEMINI_API_KEY=

# Configuración del Nodo
NEXT_PUBLIC_NODE_ID=nd-rdm-nodo-cero
APP_URL=http://localhost:3000
```

---

## Ejecución

### Desarrollo
```bash
npm run dev
```
*Acceder a:* `http://localhost:3000`

### Producción
```bash
npm run build
npm start
```

---

## API

La API versionada oficial está disponible bajo el prefijo `/api/v1/isabella`:

- `GET /api/v1/isabella`: Metadatos y diagnóstico de la infraestructura.
- `POST /api/v1/isabella`: Procesamiento de percepciones y evaluación de intención.
- `POST /api/v1/isabella/agent/lease`: Arrendamiento programático de sesión de agente autónomo (`IsabellaAgent`).
- `POST /api/v1/isabella/agent/chat`: Ejecución programática de chat con stream de razonamiento (`thoughts`) e intercepción de herramientas (`tool_calls`).
- `GET /api/v1/isabella/agent/stream`: Streaming Server-Sent Events (SSE) en tiempo real para tokens, pensamientos y telemetría.
- `GET /api/v1/isabella/audit`: Registro criptográfico de auditoría.
- `GET /api/v1/isabella/memory`: Consulta de memoria jerárquica.
- `POST /api/v1/isabella/memory`: Registro de nuevo ítem en la memoria.
- `GET /api/v1/isabella/tools`: Catálogo de herramientas autorizadas.
- `POST /api/v1/isabella/tools/execute`: Sandbox de ejecución de herramientas.
- `GET /api/v1/isabella/policies`: Políticas de gobernanza C.R.O.W.N. & ARGUS.
- `GET /api/v1/isabella/migrations`: Esquemas SQL (`001_create_isabella_tables.sql`).
- `GET /api/v1/isabella/blueprint`: Especificación de arquitectura Blueprint.

---

## Seguridad y privacidad

Isabella Villaseñor AI™ aplica controles estrictos bajo el principio de Zero-Trust:
- Sanitización de entradas y prevención de ataques de inyección de prompt.
- Evaluación de riesgos ARGUS antes de ejecutar cualquier herramienta sensible.
- Cifrado de firmas y tokenización de estado.
- Sin almacenamiento ni fuga de credenciales o secretos en cliente.

---

## Auditoría e integridad

- **Digest SHA-256 Declarado**: `cd09e99b4f6595c718bab7a54e9b6f5cc8ef9f0fb74b9432e219a189a896462e`
- **Evaluación**: 26 Capítulos de auditoría formal registrados en la vista **Presentación / Dossier**.

---

## Limitaciones conocidas

1. La inferencia cloud requiere conectividad a internet y API Key válida; en su ausencia, el sistema funciona mediante el motor local simulado.
2. Los modelos de lenguaje pueden generar respuestas inexactas o alucinadas; ARGUS atenúa pero no elimina completamente la alucinación estadística.
3. El marco criptográfico poscuántico `CRYSTALS-LATAMV` constituye una especificación/prototipo funcional en TypeScript, pendiente de librerías nativas C/Rust en entornos de producción física.

---

## Roadmap

- **Corto plazo**: Pruebas de integración automatizadas E2E, optimización móvil.
- **Mediano plazo**: Expansión del motor RAG Kórima Nexus con vector DB nativo.
- **Largo plazo**: Integración directa con unidades QPU para circuitos variacionales cuánticos.

---

## Colaboración y Reporte Responsable

Las contribuciones técnicas y académicas son bienvenidas. Consulta [`CONTRIBUTING.md`](./CONTRIBUTING.md) para más detalles.
Para reportar vulnerabilidades de seguridad de forma privada, consulta [`SECURITY.md`](./SECURITY.md).

---

## Licencia

- **Código Fuente**: Licencia MIT (ver [`LICENSE`](./LICENSE)).
- **Documentación e Identidad Canónica**: Creative Commons Attribution 4.0 International (CC BY 4.0).
- **Marca y Activos de Identidad**: Isabella Villaseñor AI™, denominaciones y elementos gráficos son propiedad de Edwin Oswaldo Castillo Trejo / TAMV ONLINE NETWORK.

---

## Autoría y ecosistema

- **Autor y Creador**: Edwin Oswaldo Castillo Trejo (*Anubis Villaseñor*)
- **ORCID**: [0009-0008-5050-1539](https://orcid.org/0009-0008-5050-1539)
- **Nodo Cero**: Real del Monte, Hidalgo, México
- **Ecosistema**: TAMV ONLINE NETWORK · RDM Digital Hub

---

## Estado del documento

Este documento refleja el estado verificado de **Isabella Villaseñor AI™ v4.2.0** al 17 de agosto de 2026.
