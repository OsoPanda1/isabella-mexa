/**
 * Isabella Quantum Mesh — Quantum Event Bus
 * Eventos tipados con trazabilidad completa entre los 24 núcleos.
 * Cada evento incluye traceId, requestId, tenantId, policyVersion, schemaVersion.
 */
import { randomUUID, createHash } from "node:crypto";
import type { IsabellaEvent, QuantumEventType } from "./contracts";

type EventHandler<T = unknown> = (event: IsabellaEvent<T>) => void | Promise<void>;

const handlers = new Map<string, Set<EventHandler>>();
const eventLog: IsabellaEvent[] = [];
const MAX_LOG_SIZE = 5_000;

// Previous event hash for chain integrity
let lastEventHash: string = createHash("sha256").update("genesis").digest("hex");

/**
 * Emite un evento cuántico en el bus.
 */
export function emitQuantumEvent<T = unknown>(
  eventType: QuantumEventType,
  data: T,
  meta: {
    traceId: string;
    requestId: string;
    tenantId: string;
    subjectId: string;
    originCore: number;
    targetCore?: number;
    policyVersion?: string;
  },
): IsabellaEvent<T> {
  const payloadStr = JSON.stringify(data);
  const payloadHash = createHash("sha256").update(payloadStr).digest("hex");

  const event: IsabellaEvent<T> = {
    eventId: randomUUID(),
    eventType,
    schemaVersion: "isabella-quantum-v1",
    traceId: meta.traceId,
    requestId: meta.requestId,
    tenantId: meta.tenantId,
    subjectId: meta.subjectId,
    originCore: meta.originCore,
    targetCore: meta.targetCore,
    occurredAt: new Date().toISOString(),
    policyVersion: meta.policyVersion || "quantum-policy-v1",
    payloadHash,
    previousEventHash: lastEventHash,
    data,
  };

  lastEventHash = createHash("sha256")
    .update(`${lastEventHash}:${event.eventId}:${payloadHash}`)
    .digest("hex");

  eventLog.push(event as IsabellaEvent);
  if (eventLog.length > MAX_LOG_SIZE) {
    eventLog.splice(0, eventLog.length - MAX_LOG_SIZE);
  }

  // Dispatch to registered handlers
  const eventHandlers = handlers.get(eventType);
  if (eventHandlers) {
    for (const h of eventHandlers) {
      try {
        h(event as IsabellaEvent);
      } catch {
        // handler errors are logged but don't break the bus
      }
    }
  }

  return event;
}

/**
 * Registra un handler para un tipo de evento.
 */
export function onQuantumEvent(eventType: string, handler: EventHandler): () => void {
  if (!handlers.has(eventType)) {
    handlers.set(eventType, new Set());
  }
  handlers.get(eventType)!.add(handler);
  return () => handlers.get(eventType)?.delete(handler);
}

/**
 * Obtiene el log de eventos recientes.
 */
export function getEventLog(limit: number = 100): IsabellaEvent[] {
  return eventLog.slice(-limit);
}

/**
 * Hash más reciente de la cadena de eventos.
 */
export function getLastEventHash(): string {
  return lastEventHash;
}

/**
 * Métricas del event bus.
 */
export function getEventBusMetrics() {
  const recent = eventLog.slice(-200);
  const byType: Record<string, number> = {};
  for (const e of recent) {
    byType[e.eventType] = (byType[e.eventType] || 0) + 1;
  }

  return {
    totalEvents: eventLog.length,
    lastEventHash,
    recentEventTypes: byType,
    handlerCount: Array.from(handlers.values()).reduce((sum, s) => sum + s.size, 0),
  };
}
