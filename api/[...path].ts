// api/[...path].ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { app } from "../server";
import { randomUUID } from "crypto";

// VercelRequest is compatible at runtime with Express Request but not in types
const appHandler = app as unknown as (req: unknown, res: unknown, next: (err?: unknown) => void) => void;

// ─────────────────────────────────────────────────────────────
// CONFIGURACIÓN CENTRALIZADA
// ─────────────────────────────────────────────────────────────
const CONFIG = {
  API_TIMEOUT_SECONDS: parseInt(process.env.API_TIMEOUT_SECONDS || "60", 10),
  KERNEL_VERSION: "Isabella-Kernel/5.0.0",
  CIRCUIT_BREAKER_THRESHOLD: 5,
  CIRCUIT_BREAKER_RESET_TIMEOUT_MS: 30000,
  
  SECURITY_HEADERS: {
    "X-DNS-Prefetch-Control": "off",
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  },
};

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
  maxDuration: CONFIG.API_TIMEOUT_SECONDS,
};

// ─────────────────────────────────────────────────────────────
// CIRCUIT BREAKER STATE (En producción usar Redis/DynamoDB)
// ─────────────────────────────────────────────────────────────
const circuitBreakerState = {
  failures: 0,
  lastFailureTime: 0,
  state: "CLOSED" as "CLOSED" | "OPEN" | "HALF_OPEN",
};

// ─────────────────────────────────────────────────────────────
// LOGGER ESTRUCTURADO
// ─────────────────────────────────────────────────────────────
interface LogEntry {
  level: "INFO" | "WARN" | "ERROR";
  event: string;
  timestamp: string;
  [key: string]: any;
}

function logStructured(event: string, data: Record<string, any>): void {
  const entry: LogEntry = {
    level: event.includes("ERROR") || event.includes("FAILED") || event.includes("CRITICAL") ? "ERROR" : "INFO",
    event,
    timestamp: new Date().toISOString(),
    ...data,
  };

  if (entry.level === "ERROR") {
    console.error(JSON.stringify(entry));
  } else {
    console.log(JSON.stringify(entry));
  }
}

// ─────────────────────────────────────────────────────────────
// MIDDLEWARE: SEGURIDAD ZERO-TRUST
// ─────────────────────────────────────────────────────────────
function applySecurityHeaders(res: VercelResponse): void {
  Object.entries(CONFIG.SECURITY_HEADERS).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
  res.setHeader("X-Powered-By", CONFIG.KERNEL_VERSION);
}

// ─────────────────────────────────────────────────────────────
// MIDDLEWARE: CORS PREFLIGHT
// ─────────────────────────────────────────────────────────────
function applyCORSMiddleware(req: VercelRequest, res: VercelResponse): boolean {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-Trace-ID, X-LITLE-Signature, X-PQC-Token"
    );
    res.setHeader("Access-Control-Max-Age", "86400");
    res.status(204).end();
    return true;
  }

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Trace-ID");
  return false;
}

// ─────────────────────────────────────────────────────────────
// MIDDLEWARE: TRAZABILIDAD DISTRIBUIDA
// ─────────────────────────────────────────────────────────────
function applyTracingMiddleware(
  req: VercelRequest,
  res: VercelResponse,
  context: { traceId: string }
): void {
  const traceId = (req.headers["x-trace-id"] as string) || `isabella-${randomUUID()}`;
  req.headers["x-trace-id"] = traceId;
  res.setHeader("X-Trace-ID", traceId);
  context.traceId = traceId;
}

// ─────────────────────────────────────────────────────────────
// MIDDLEWARE: RESILIENCIA (CIRCUIT BREAKER + TIMEOUT)
// ─────────────────────────────────────────────────────────────
function checkCircuitBreaker(context: { traceId: string }): void {
  if (circuitBreakerState.state === "OPEN") {
    const timeSinceLastFailure = Date.now() - circuitBreakerState.lastFailureTime;
    if (timeSinceLastFailure > CONFIG.CIRCUIT_BREAKER_RESET_TIMEOUT_MS) {
      circuitBreakerState.state = "HALF_OPEN";
      logStructured("CIRCUIT_BREAKER_HALF_OPEN", { traceId: context.traceId });
    } else {
      throw new Error("CIRCUIT_BREAKER_OPEN");
    }
  }
}

function startTimeoutRace(res: VercelResponse, context: { traceId: string }): NodeJS.Timeout {
  return setTimeout(() => {
    if (!res.headersSent) {
      res.status(504).json({
        error: { code: "TIMEOUT", message: `Request timeout after ${CONFIG.API_TIMEOUT_SECONDS}s`, trace_id: context.traceId },
      });
    }
  }, CONFIG.API_TIMEOUT_SECONDS * 1000);
}

function recordSuccess(): void {
  circuitBreakerState.failures = 0;
  circuitBreakerState.state = "CLOSED";
}

function recordFailure(): void {
  circuitBreakerState.failures++;
  circuitBreakerState.lastFailureTime = Date.now();

  if (circuitBreakerState.failures >= CONFIG.CIRCUIT_BREAKER_THRESHOLD) {
    circuitBreakerState.state = "OPEN";
    logStructured("CIRCUIT_BREAKER_OPEN", {
      failures: circuitBreakerState.failures,
      threshold: CONFIG.CIRCUIT_BREAKER_THRESHOLD,
      state: "OPEN",
    });
  }
}

// ─────────────────────────────────────────────────────────────
// HANDLER: PROCESAMIENTO DE REQUEST
// ─────────────────────────────────────────────────────────────
async function handleRequest(
  req: VercelRequest,
  res: VercelResponse,
  context: { traceId: string; startTime: number; method: string; path: string }
): Promise<void> {
  try {
    await new Promise<void>((resolve, reject) => {
      appHandler(req, res, (err: unknown) => {
        if (err) return reject(err);
        resolve();
      });

      res.on("finish", () => {
        if (res.statusCode >= 500) {
          recordFailure();
        } else {
          recordSuccess();
        }
        resolve();
      });

      res.on("error", reject);
    });

    const duration = (performance.now() - context.startTime).toFixed(2);
    logStructured("REQUEST_COMPLETED", {
      traceId: context.traceId,
      method: context.method,
      path: context.path,
      statusCode: res.statusCode,
      latency_ms: parseFloat(duration),
    });

  } catch (error: any) {
    recordFailure();
    logStructured("REQUEST_FAILED", {
      traceId: context.traceId,
      method: context.method,
      path: context.path,
      error: error?.message || "Unknown error",
      stack: error?.stack,
    });
    throw error;
  }
}

// ─────────────────────────────────────────────────────────────
// HANDLER: POST-PROCESAMIENTO DE RESPONSE
// ─────────────────────────────────────────────────────────────
async function handleResponse(
  res: VercelResponse,
  context: { startTime: number }
): Promise<void> {
  const duration = (performance.now() - context.startTime).toFixed(2);
  res.setHeader("X-Response-Time-Ms", duration);
}

// ─────────────────────────────────────────────────────────────
// HANDLER: MANEJO DE ERRORES CRÍTICOS
// ─────────────────────────────────────────────────────────────
async function handleError(
  res: VercelResponse,
  error: any,
  context: { traceId: string; startTime: number; method: string; path: string }
): Promise<void> {
  const durationMs = (performance.now() - context.startTime).toFixed(2);

  logStructured("API_ERROR_CRITICAL", {
    traceId: context.traceId,
    method: context.method,
    path: context.path,
    latency_ms: parseFloat(durationMs),
    error: error?.message || "Unknown error",
    stack: error?.stack,
  });

  if (!res.headersSent) {
    res.status(500).json({
      error: {
        code: "ISABELLA_KERNEL_EXECUTION_FAILURE",
        message: "Error de ejecución crítica en el orquestador de API.",
        trace_id: context.traceId,
        timestamp: new Date().toISOString(),
        latency_ms: parseFloat(durationMs),
        recovery_hint: "Reintentar con backoff exponencial en 30s",
        circuit_breaker_state: circuitBreakerState.state,
      },
    });
  }
}

// ─────────────────────────────────────────────────────────────
// ENTRY POINT PRINCIPAL
// ─────────────────────────────────────────────────────────────
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  const context = {
    startTime: performance.now(),
    traceId: "",
    path: req.url || "unknown",
    method: req.method || "UNKNOWN",
  };

  try {
    // 1. Middlewares de infraestructura (orden crítico)
    applyTracingMiddleware(req, res, context);
    applySecurityHeaders(res);
    
    const isPreflight = applyCORSMiddleware(req, res);
    if (isPreflight) return;

    // 2. Circuit breaker check (synchronous, throws if OPEN)
    checkCircuitBreaker(context);

    // 3. Start timeout race (non-blocking — fires 504 if handler takes too long)
    const timeoutId = startTimeoutRace(res, context);

    // 4. Procesamiento through Express
    await handleRequest(req, res, context);

    // 5. Cancel timeout on success
    clearTimeout(timeoutId);

    // 6. Post-procesamiento de respuesta
    handleResponse(res, context);

  } catch (error: any) {
    if (error?.message === "CIRCUIT_BREAKER_OPEN" && !res.headersSent) {
      const timeSinceLastFailure = Date.now() - circuitBreakerState.lastFailureTime;
      res.status(503).json({
        error: {
          code: "CIRCUIT_BREAKER_OPEN",
          message: "Service temporarily unavailable. Too many failures.",
          trace_id: context.traceId,
          retry_after_ms: CONFIG.CIRCUIT_BREAKER_RESET_TIMEOUT_MS - timeSinceLastFailure,
        },
      });
    } else if (!res.headersSent) {
      await handleError(res, error, context);
    }
  }
}
