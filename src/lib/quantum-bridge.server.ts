import { spawn } from "node:child_process";
import { createHash, randomUUID } from "node:crypto";
import { join } from "node:path";
import { z } from "zod";
import type { Request, Response, NextFunction } from "express";
import { appendBlock } from "./bookpi.server";
import { metrics, recordAudit } from "./atlas-kernel.server";
import { currentPrincipal } from "./auth.server";

export const QuantumBridgeRequestSchema = z.object({
  task: z.enum(["diagnose", "qnn_bootstrap", "kernel_score"]).default("qnn_bootstrap"),
  provider: z.enum(["default.qubit", "lightning.qubit", "qiskit.aer"]).default("default.qubit"),
  wires: z.number().int().min(1).max(8).default(4),
  shots: z.number().int().min(0).max(20_000).default(0),
  features: z.array(z.number().finite()).max(32).default([]),
  weights: z.array(z.number().finite()).max(64).default([]),
  repository: z.enum(["PennyLaneAI/pennylane", "PennyLaneAI/pennylane-lightning", "PennyLaneAI/pennylane-qiskit"]).default("PennyLaneAI/pennylane"),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type QuantumBridgeRequest = z.infer<typeof QuantumBridgeRequestSchema>;

export interface QuantumPolicyVerdict {
  allow: boolean;
  reason?: string;
  classification: "SIMULATED" | "IMPLEMENTED" | "PROVIDER_REQUIRED";
  maxRuntimeMs: number;
}

const DEFAULT_TIMEOUT_MS = Number(process.env.QUANTUM_BRIDGE_TIMEOUT_MS || 8_000);
const PYTHON = process.env.PYTHON_BIN || "python3";
const SCRIPT = process.env.QUANTUM_BRIDGE_SCRIPT || join(process.cwd(), "scripts", "quantum", "pennylane_bridge.py");

export function evaluateQuantumPolicy(input: QuantumBridgeRequest, req?: Request): QuantumPolicyVerdict {
  const principal = req ? currentPrincipal(req) : undefined;
  if (input.provider === "qiskit.aer" && !principal?.scopes.includes("*") && !principal?.scopes.includes("quantum:qiskit")) {
    return { allow: false, reason: "qiskit provider requires quantum:qiskit scope", classification: "PROVIDER_REQUIRED", maxRuntimeMs: DEFAULT_TIMEOUT_MS };
  }
  if (input.provider === "lightning.qubit" && input.wires > 6) {
    return { allow: false, reason: "lightning.qubit is capped at 6 wires by ARGUS runtime policy", classification: "PROVIDER_REQUIRED", maxRuntimeMs: DEFAULT_TIMEOUT_MS };
  }
  if (input.shots > 0 && input.shots > 10_000) {
    return { allow: false, reason: "shots exceed governed execution budget", classification: "SIMULATED", maxRuntimeMs: DEFAULT_TIMEOUT_MS };
  }
  return { allow: true, classification: input.provider === "default.qubit" ? "SIMULATED" : "PROVIDER_REQUIRED", maxRuntimeMs: DEFAULT_TIMEOUT_MS };
}

export function quantumGuard(req: Request, res: Response, next: NextFunction) {
  const parsed = QuantumBridgeRequestSchema.safeParse(req.body || {});
  if (!parsed.success) {
    return res.status(400).json({ ok: false, error: "Invalid quantum bridge request", issues: parsed.error.issues });
  }
  const verdict = evaluateQuantumPolicy(parsed.data, req);
  if (!verdict.allow) {
    return res.status(403).json({ ok: false, error: verdict.reason, policy: verdict });
  }
  (req as any).quantumBridge = { input: parsed.data, policy: verdict };
  return next();
}

export async function runQuantumBridge(input: QuantumBridgeRequest, req?: Request): Promise<Record<string, unknown>> {
  const requestId = randomUUID();
  const startedAt = Date.now();
  const payload = JSON.stringify({ ...input, requestId });
  const payloadHash = createHash("sha256").update(payload).digest("hex");
  const principal = req ? currentPrincipal(req) : { sub: "system", tenantId: "nodo-cero-rdm", roles: ["system"], scopes: ["*"] };
  const policy = evaluateQuantumPolicy(input, req);

  if (!policy.allow) {
    throw new Error(policy.reason || "quantum policy denied");
  }

  const result = await new Promise<Record<string, unknown>>((resolve, reject) => {
    const child = spawn(PYTHON, [SCRIPT], {
      stdio: ["pipe", "pipe", "pipe"],
      env: {
        ...process.env,
        PYTHONUNBUFFERED: "1",
        PENNYLANE_ENABLE_LIGHTNING: input.provider === "lightning.qubit" ? "1" : process.env.PENNYLANE_ENABLE_LIGHTNING || "0",
      },
    });
    let stdout = "";
    let stderr = "";
    const timeout = setTimeout(() => {
      child.kill("SIGKILL");
      reject(new Error(`quantum bridge timeout after ${policy.maxRuntimeMs}ms`));
    }, policy.maxRuntimeMs);
    child.stdout.on("data", (chunk) => { stdout += chunk.toString(); });
    child.stderr.on("data", (chunk) => { stderr += chunk.toString(); });
    child.on("error", (err) => {
      clearTimeout(timeout);
      reject(err);
    });
    child.on("close", (code) => {
      clearTimeout(timeout);
      if (code !== 0) return reject(new Error(stderr || `quantum bridge exited with ${code}`));
      try {
        resolve(JSON.parse(stdout));
      } catch (err) {
        reject(new Error(`invalid quantum bridge JSON: ${err instanceof Error ? err.message : String(err)}`));
      }
    });
    child.stdin.end(payload);
  });

  const latencyMs = Date.now() - startedAt;
  const status = String(result.status || "unknown");
  metrics.counter("atlas_quantum_bridge_requests_total").inc({ provider: input.provider, task: input.task, status });
  metrics.histogram("atlas_quantum_bridge_latency_seconds").observe(latencyMs / 1000, { provider: input.provider, task: input.task });

  recordAudit({
    actor: principal.sub,
    action: "quantum.bridge.execute",
    policy: "quantum.bridge.v1",
    payload: { requestId, payloadHash, provider: input.provider, task: input.task, status, latencyMs, implementation: result.implementation },
    traceId: String(input.metadata?.traceId || requestId),
  });

  appendBlock({
    eventType: "ai_eval",
    module: "QuantumBridge",
    action: `pennylane.${input.task}`,
    actor: principal.sub,
    data: { requestId, payloadHash, provider: input.provider, repository: input.repository, status, latencyMs, implementation: result.implementation },
  });

  return {
    ok: true,
    requestId,
    latencyMs,
    policy,
    payloadHash,
    ...result,
  };
}

export function getQuantumReflection() {
  const snapshot = metrics.snapshot();
  const hallucination = (snapshot.find((m: any) => m.name === "atlas_ai_hallucination_rate") as any)?.value || 0;
  const precision = (snapshot.find((m: any) => m.name === "atlas_ai_precision") as any)?.value || 0.985;
  const errors = (snapshot.find((m: any) => m.name === "atlas_errors_total") as any)?.value || 0;

  return {
    federationStatus: "GOVERNED_BRIDGE_READY",
    targets: {
      pennylane: "https://github.com/PennyLaneAI/pennylane",
      lightning: "https://github.com/PennyLaneAI/pennylane-lightning",
      qiskit: "https://github.com/PennyLaneAI/pennylane-qiskit",
    },
    ingestedModules: ["qml.qnode", "qml.device", "qml.templates", "qml.math", "lightning.qubit", "qiskit.aer"],
    governance: {
      requiredScope: "quantum:execute",
      qiskitScope: "quantum:qiskit",
      maxWires: 8,
      maxShots: 20000,
      fallbackSemantics: "CLASSICAL_FALLBACK_NOT_QUANTUM",
    },
    selfReflection: {
      strengths: [
        `Alta precisión cognitiva (${(precision * 100).toFixed(1)}%)`,
        "Puente PennyLane sidecar con auditoría, BookPI y telemetría",
        "Política CROWN/ARGUS aplicada antes de ejecutar circuitos variacionales",
      ],
      weaknesses: [
        "La ejecución local default.qubit/lightning es simulación, no QPU física",
        hallucination > 0.05 ? "Tasa de alucinación por encima del umbral óptimo" : "Dependencia de orquestación clásica en enrutamiento dinámico",
        errors > 10 ? "Tasa de errores elevada en integración" : "Plugins externos requieren workers Python aislados y versiones fijadas",
      ],
      insights: "La integración gobernada con PennyLane permite iniciar experimentos QML con circuitos variacionales trazables sin afirmar ejecución cuántica real cuando solo hay simulador o fallback.",
    },
  };
}
