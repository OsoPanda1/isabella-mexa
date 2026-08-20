# Catálogo de Scopes — API Isabella Villaseñor AI

> Versión: 1.0.0 · Última actualización: 2026-08-20
> Fuente de verdad: `src/lib/auth.server.ts`, `src/lib/opa.server.ts`, `src/lib/quantum/policy-engine.ts`

Cada petición autenticada transporta un JWT cuyo claim `scopes` es un array de strings.
El middleware `requireScope()` (`src/lib/auth.server.ts:87`) valida que el principal
posea el scope requerido (o `*` wildcard). El motor OPA (`src/lib/opa.server.ts:46`)
realiza la misma verificación en el path de publicación.

Un scope `*` concede acceso total y solo se asigna a principals con rol `admin` o `system`.

---

## 1. Memory Scopes

Controlan acceso al almacenamiento jerárquico de memoria de Isabella
(5 niveles: immediate, session, project, territorial, historical).

| Scope | Descripción | Riesgo | Nivel de garantía | Ejemplo de uso |
|---|---|---|---|---|
| `memory:read` | Leer ítems de memoria dentro del tenant | **low** | `local` | Recuperar contexto de sesión activa |
| `memory:write` | Crear o actualizar ítems de memoria dentro del tenant | **medium** | `local` | Almacenar resultado de inferencia o percepción |
| `memory:admin` | Borrar o purgar scopes de memoria completos | **high** | `mtls` | Limpiar datos territoriales al expirar TTL |

**Reglas:**
- Las operaciones están aisladas por `tenantId`. Un principal nunca accede a memoria de otro tenant.
- `memory:admin` invoca `clearMemoryScope()` (`src/domains/ai/infrastructure/memory-store.ts:226`) que elimina todas las entradas de un scope dado.
- Cada escritura genera un `checksum` SHA-256 del contenido para integridad.

---

## 2. Audit Scopes

Controlan acceso al registro de eventos de auditoría encadenados (Section 14 del blueprint).

| Scope | Descripción | Riesgo | Nivel de garantía | Ejemplo de uso |
|---|---|---|---|---|
| `audit:read` | Leer logs de auditoría dentro del tenant | **low** | `local` | Consultar historial de inferencias |
| `audit:write` | Crear entradas de auditoría | **medium** | `local` | Registrar evento de inferencia completada |

**Reglas:**
- Cada `AuditEvent` incluye `previousEventDigest` para encadenamiento criptográfico.
- Los eventos se publican via EventBus (`src/lib/eventbus.server.ts`) con `traceId` y `correlationId`.
- `audit:write` es requerido por todos los handlers de eventos del sistema; no debe asignarse a usuarios finales.

---

## 3. Tool Scopes

Controlan el registro y ejecución de herramientas dentro del sandbox gobernado.

| Scope | Descripción | Riesgo | Nivel de garantía | Ejemplo de uso |
|---|---|---|---|---|
| `tools:execute` | Ejecutar herramientas registradas en el catálogo | **medium** | `local` | Llamar a una herramienta de síntesis o territorio |
| `tools:admin` | Registrar, modificar o eliminar capacidades de herramientas | **critical** | `hardware-backed` | Alta de nueva herramienta al catálogo `ToolCapability` |

**Reglas:**
- Cada herramienta tiene un `ToolCapability` con `network.mode`, `filesystem` y `maxRuntimeMs` (`src/lib/claim-radar/contracts.ts:207`).
- Herramientas con `requiresHumanApproval: true` requieren aprobación explícita antes de ejecutar.
- El policy engine evalúa `riskLevel` y `requiresApproval` en tiempo de ejecución.

---

## 4. Quantum Scopes

Controlan acceso a la Quantum Mesh gobernada (ARGUS Núcleo 03).

| Scope | Descripción | Riesgo | Nivel de garantía | Ejemplo de uso |
|---|---|---|---|---|
| `quantum:submit` | Enviar trabajos cuánticos al scheduler | **medium** | `mtls` | Enviar circuito de optimización |
| `quantum:status` | Consultar estado de trabajos cuánticos | **low** | `local` | Verificar si un job completó |
| `quantum:admin` | Gestionar providers, pools de workers y configuración | **critical** | `hardware-backed` | Agregar nuevo provider remoto (Braket, Rigetti) |

**Scopes adicionales por provider** (verificados en `policy-engine.ts:92`):

| Scope | Provider |
|---|---|
| `quantum:qiskit` | IBM Qiskit Aer / hardware |
| `quantum:lightning` | Pennylane Lightning GPU |
| `quantum:braket` | AWS Braket |
| `quantum:rigetti` | Rigetti QCS |

**Reglas:**
- Requiere scope base `quantum:execute` (o `*`) — verificado en `policy-engine.ts:82`.
- Providers remotos requieren WebAuthn step-up (`WEBAUTHN_STEP_UP_REQUIRED`).
- Límites por rol: user (12 wires, 10K shots), agent (16/20K), operator (24/100K).
- Secretos de provider validados en tiempo de evaluación (`REMOTE_SECRET_MISSING`).

---

## 5. Kill-Switch Scopes

Controlan la cadena de contención de emergencia (Section 18.3).

| Scope | Descripción | Riesgo | Nivel de garantía | Ejemplo de uso |
|---|---|---|---|---|
| `kill-switch:activate` | Activar el kill switch (solo SEV-1) | **critical** | `hardware-backed` | Congelar egress tras detección de compromiso |
| `kill-switch:resolve` | Resolver kill switch tras aprobación humana | **critical** | `hardware-backed` | Restaurar tráfico después de health check |

**Reglas:**
- `activateKillSwitch()` (`src/lib/kill-switch/kill-switch.ts:116`) inicia la cadena de 10 pasos.
- Solo los pasos 1-3, 5, 6, 8, 10 son automáticos. Los pasos 4, 7, 9 requieren intervención humana.
- Resolución requiere `approvedBy` con identidad verificada y auditoría de quién aprobó.
- El estado transita: `normal → egress-frozen → quiesced → isolated → restoring → requires-approval → normal`.

---

## 6. Claim Scopes

Controlan el motor de evaluación de claims y evidencia (Claim Radar, Section 11).

| Scope | Descripción | Riesgo | Nivel de garantía | Ejemplo de uso |
|---|---|---|---|---|
| `claim:evaluate` | Evaluar claims contra evidencia de repositorios | **medium** | `local` | Verificar afirmación académica contra Zenodo/OSF |
| `claim:admin` | Gestionar adaptadores MCP del radar | **high** | `mtls` | Registrar nuevo repositorio de evidencia |

**Reglas:**
- Cada adaptador MCP implementa `MCPAdapterV2` (`src/lib/claim-radar/contracts.ts:102`).
- Los resultados incluyen `epistemic.status` (supports/contradicts/contextualizes/insufficient/unavailable).
- Las evidencias preservan `provenance.responseDigest` y `provenance.queryDigest` para verificación.
- El evidenciar fecha y scope es obligatorio — validado por `epistemic-governance.ts:174`.

---

## 7. Automation Scopes

Controlan la malla de automatizaciones auto-gestionadas.

| Scope | Descripción | Riesgo | Nivel de garantía | Ejemplo de uso |
|---|---|---|---|---|
| `automation:read` | Leer estado de la malla de automatizaciones | **low** | `local` | Consultar salud de nodos de la malla |
| `automation:execute` | Ejecutar flujos de automatización | **high** | `mtls` | Disparar cadena de reparación (`RepairChain`) |

**Reglas:**
- La malla tiene ~40 nodos categorizados (identity, consent, quantum, hsm, tee, etc.) — ver `src/lib/automation/registry.ts`.
- Cada nodo tiene `healthCheck`, `repairProcedure` y `humanDescription`.
- `RepairChain` ejecuta pasos secuenciales con estados: pending → executing → success/failed/skipped.
- Inputs en lenguaje natural procesados por `HumanDescription` para inferir intent.

---

## 8. Admin Scopes

Scopes de administración de la plataforma. Requieren rol `admin` o `system`.

| Scope | Descripción | Riesgo | Nivel de garantía | Ejemplo de uso |
|---|---|---|---|---|
| `admin:policy` | Modificar políticas de autorización (OPA/ARGUS) | **critical** | `hardware-backed` | Actualizar reglas de publicación o aislamiento |
| `admin:tenant` | Gestionar configuración de tenants | **high** | `hardware-backed` | Crear tenant, ajustar límites de rate |
| `admin:secrets` | Acceso al gestor de secretos | **critical** | `hardware-backed` | Rotar credenciales de providers remotos |

**Reglas:**
- `admin:policy` solo puede ser ejercido por `governance_admin` o `system`.
- `admin:secrets` está bajo HSM failover monitor (`src/lib/hsmFailoverMonitor.ts`).
- Todos los cambios de política emiten evento `quantum.policy.changed` y se registran en audit.
- El policy engine en `src/lib/opa.server.ts` registra cada decisión con `policy_id` y la publica al EventBus.

---

## Matriz de resumen

| Scope | Riesgo | Garantía mín. | Rol mínimo |
|---|---|---|---|
| `memory:read` | low | local | citizen |
| `memory:write` | medium | local | citizen |
| `memory:admin` | high | mtls | operator |
| `audit:read` | low | local | citizen |
| `audit:write` | medium | local | system |
| `tools:execute` | medium | local | operator |
| `tools:admin` | critical | hardware-backed | admin |
| `quantum:submit` | medium | mtls | operator |
| `quantum:status` | low | local | citizen |
| `quantum:admin` | critical | hardware-backed | admin |
| `kill-switch:activate` | critical | hardware-backed | system |
| `kill-switch:resolve` | critical | hardware-backed | admin |
| `claim:evaluate` | medium | local | operator |
| `claim:admin` | high | mtls | admin |
| `automation:read` | low | local | citizen |
| `automation:execute` | high | mtls | operator |
| `admin:policy` | critical | hardware-backed | admin |
| `admin:tenant` | high | hardware-backed | admin |
| `admin:secrets` | critical | hardware-backed | admin |

---

## Notas de implementación

- **Wildcard `*`**: Solo se asigna en desarrollo (`ALLOW_DEV_AUTH_FALLBACK=true`) o a principals `system`.
- **Scope check se ejecuta en dos capas**: middleware Express (`requireScope`) y policy engine OPA.
- **Nunca elevación de scopes**: El policy engine prohíbe explícitamente que un agente eleve sus propios scopes (`policy-engine.ts:4`).
- **Auditoría**: Cada denegación de scope emite `security.policy_violated` al EventBus y se registra en `DECISIONS`.
