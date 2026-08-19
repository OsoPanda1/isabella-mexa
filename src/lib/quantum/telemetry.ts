/**
 * Isabella Quantum Mesh — Telemetry & Observability (Núcleo 22)
 * Spans, metrics y observabilidad completa.
 * Nunca incluir: tokens, claves, payloads completos, credenciales, datos biométricos.
 */
import { randomUUID } from "node:crypto";
import type { QuantumSpan } from "./contracts";

// ---- Metrics Store (in-memory, in production use Prometheus/OpenTelemetry) ----

interface MetricValue {
  name: string;
  labels: Record<string, string>;
  value: number;
  timestamp: string;
}

const counters = new Map<string, Map<string, number>>();
const histograms = new Map<string, number[]>();
const spans: QuantumSpan[] = [];
const MAX_SPANS = 5_000;

// ---- Counter Operations ----

export function incCounter(name: string, labels: Record<string, string> = {}, amount: number = 1): void {
  const key = `${name}:${JSON.stringify(labels)}`;
  const current = counters.get(name)?.get(key) || 0;
  if (!counters.has(name)) counters.set(name, new Map());
  counters.get(name)!.set(key, current + amount);
}

// ---- Histogram Operations ----

export function observeHistogram(name: string, value: number): void {
  if (!histograms.has(name)) histograms.set(name, []);
  const arr = histograms.get(name)!;
  arr.push(value);
  if (arr.length > 10_000) arr.splice(0, arr.length - 10_000);
}

// ---- Span Operations ----

export function startSpan(params: {
  traceId: string;
  operation: string;
  parentSpanId?: string;
  attributes?: Record<string, string>;
}): QuantumSpan {
  const span: QuantumSpan = {
    spanId: randomUUID(),
    traceId: params.traceId,
    parentSpanId: params.parentSpanId,
    operation: params.operation,
    startTime: new Date().toISOString(),
    status: "ok",
    attributes: params.attributes || {},
  };
  spans.push(span);
  if (spans.length > MAX_SPANS) spans.splice(0, spans.length - MAX_SPANS);
  return span;
}

export function endSpan(spanId: string, status: "ok" | "error" | "degraded" = "ok"): void {
  const span = spans.find((s) => s.spanId === spanId);
  if (!span) return;
  span.endTime = new Date().toISOString();
  span.durationMs = new Date(span.endTime).getTime() - new Date(span.startTime).getTime();
  span.status = status;
}

// ---- Named Counters for Quantum Mesh ----

export const QUANTUM_COUNTERS = {
  requestsAccepted: (provider: string, tenantClass: string) =>
    incCounter("quantum_requests_total", { provider, status: "accepted", tenant_class: tenantClass }),
  requestsRejected: (provider: string, reason: string) =>
    incCounter("quantum_requests_total", { provider, status: "rejected", tenant_class: reason }),
  jobQueued: (provider: string) =>
    incCounter("quantum_jobs_total", { provider, status: "queued" }),
  jobStarted: (provider: string) =>
    incCounter("quantum_jobs_total", { provider, status: "started" }),
  jobCompleted: (provider: string) =>
    incCounter("quantum_jobs_total", { provider, status: "completed" }),
  jobDegraded: (provider: string) =>
    incCounter("quantum_jobs_total", { provider, status: "degraded" }),
  jobFailed: (provider: string) =>
    incCounter("quantum_jobs_total", { provider, status: "failed" }),
  workerReplaced: (pool: string) =>
    incCounter("quantum_worker_restarts_total", { pool }),
  providerUnavailable: (provider: string) =>
    incCounter("quantum_provider_unavailable_total", { provider }),
  policyDenial: (reason: string) =>
    incCounter("quantum_policy_denials_total", { reason }),
  fallback: (reason: string) =>
    incCounter("quantum_fallback_total", { reason }),
  bookpiCommitFailure: () =>
    incCounter("quantum_bookpi_commit_failures_total"),
  federationReplicationFailure: (node: string) =>
    incCounter("quantum_federation_replication_failures_total", { node }),
  hsmSignLatency: (ms: number) =>
    observeHistogram("quantum_hsm_sign_latency_ms", ms),
  teeAttestationFailure: () =>
    incCounter("quantum_tee_attestation_failures_total"),
};

// ---- Histograms for Latency ----

export const QUANTUM_HISTOGRAMS = {
  requestDuration: (provider: string, ms: number) =>
    observeHistogram(`quantum_request_duration_ms:${provider}`, ms),
  queueWait: (provider: string, ms: number) =>
    observeHistogram(`quantum_queue_wait_ms:${provider}`, ms),
};

// ---- Query Operations ----

export function getCounterValue(name: string, labels?: Record<string, string>): number {
  if (!labels) {
    let total = 0;
    const labelMap = counters.get(name);
    if (labelMap) {
      for (const v of labelMap.values()) total += v;
    }
    return total;
  }
  const key = `${name}:${JSON.stringify(labels)}`;
  return counters.get(name)?.get(key) || 0;
}

export function getHistogramStats(name: string): {
  count: number;
  min: number;
  max: number;
  avg: number;
  p50: number;
  p95: number;
  p99: number;
} {
  const values = histograms.get(name) || [];
  if (values.length === 0) return { count: 0, min: 0, max: 0, avg: 0, p50: 0, p95: 0, p99: 0 };

  const sorted = [...values].sort((a, b) => a - b);
  return {
    count: sorted.length,
    min: sorted[0],
    max: sorted[sorted.length - 1],
    avg: Math.round(sorted.reduce((s, v) => s + v, 0) / sorted.length),
    p50: sorted[Math.floor(sorted.length * 0.5)],
    p95: sorted[Math.floor(sorted.length * 0.95)],
    p99: sorted[Math.floor(sorted.length * 0.99)],
  };
}

export function getSpans(traceId: string): QuantumSpan[] {
  return spans.filter((s) => s.traceId === traceId);
}

/**
 * Snapshot completo de métricas.
 */
export function getTelemetrySnapshot() {
  const allCounters: Record<string, number> = {};
  for (const [name, labelMap] of counters) {
    let total = 0;
    for (const v of labelMap.values()) total += v;
    allCounters[name] = total;
  }

  return {
    counters: allCounters,
    histograms: Object.fromEntries(
      Array.from(histograms.keys()).map((k) => [k, getHistogramStats(k)]),
    ),
    activeSpans: spans.filter((s) => !s.endTime).length,
    totalSpans: spans.length,
  };
}
