/**
 * AUDIT TRACER - ISABELLA INFRASTRUCTURE LAYER
 * Nodo Cero :: RDM Digital
 * Registers structured audit events, trace IDs, and cryptographic verification logs.
 */

import { createHash } from "node:crypto";
import { IsabellaAuditLog } from "../../../contracts/isabella";

// In-memory persistent buffer for high-speed audit tracing & export
const auditBuffer: IsabellaAuditLog[] = [];
const MAX_BUFFER_SIZE = 1000;

export interface AuditTraceParams {
  tenantId?: string;
  sessionId?: string;
  actorId?: string;
  eventType: string;
  data: Record<string, unknown>;
  traceId?: string;
}

export async function auditTrace(payload: AuditTraceParams): Promise<{
  auditId: string;
  traceId: string;
  timestamp: string;
}> {
  const traceId = payload.traceId || `trace-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const auditId = `audit-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  const now = new Date().toISOString();

  const checksum = `sha256_${createHash("sha256").update(JSON.stringify(payload.data || {})).digest("hex")}`;

  const entry: IsabellaAuditLog = {
    id: auditId,
    tenantId: payload.tenantId || "nodo-cero-rdm",
    sessionId: payload.sessionId,
    actorId: payload.actorId || "usr-system",
    eventType: payload.eventType,
    payload: payload.data,
    traceId,
    checksum,
    createdAt: now,
  };

  auditBuffer.unshift(entry);
  if (auditBuffer.length > MAX_BUFFER_SIZE) {
    auditBuffer.pop();
  }

  // Console output structured for telemetry observers
  if (typeof console !== "undefined") {
    console.log(`[Isabella.Audit::${entry.eventType}]`, {
      auditId,
      traceId,
      actor: entry.actorId,
      summary: (payload.data as any)?.summary || (payload.data as any)?.inputType || "Event",
    });
  }

  return { auditId, traceId, timestamp: now };
}

export function getRecentAuditLogs(limit = 50): IsabellaAuditLog[] {
  return [...auditBuffer.slice(0, limit)];
}

export function clearAuditLogs(): void {
  auditBuffer.length = 0;
}
