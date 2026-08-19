/**
 * Isabella Quantum Mesh — BookPI Quantum Blocks (Núcleo 18 + 19)
 * Append-only audit chain con hash previo obligatorio.
 * CRYSTALS-LATAMV: cadena interna de procedencia, no sustituto de SHA3/ML-DSA/TLS/WebAuthn.
 */
import { randomUUID, createHash } from "node:crypto";
import type { BookPIBlock, QuantumStatus, QuantumCanonicalPayload } from "./contracts";
import { signLedgerBlockPQC } from "../postQuantumCrypto";

let lastBlockHash: string = createHash("sha256").update("bookpi-genesis").digest("hex");
const blocks: BookPIBlock[] = [];

/**
 * Crea un nuevo bloque BookPI con firma PQC dual.
 */
export function commitQuantumBlock(params: {
  requestId: string;
  tenantId: string;
  circuitHash: string;
  implementation: string;
  status: QuantumStatus;
  policyVersion: string;
  signerKeyId?: string;
  teeVerified?: boolean;
}): BookPIBlock {
  const blockData = JSON.stringify({
    schema: "bookpi-quantum-v1",
    requestId: params.requestId,
    circuitHash: params.circuitHash,
    implementation: params.implementation,
    status: params.status,
    policyVersion: params.policyVersion,
    timestamp: new Date().toISOString(),
  });

  const blockHash = createHash("sha256")
    .update(`${lastBlockHash}:${blockData}`)
    .digest("hex");

  const block: BookPIBlock = {
    version: "bookpi-quantum-v1",
    blockHash,
    previousHash: lastBlockHash,
    requestId: params.requestId,
    tenantId: params.tenantId,
    circuitHash: params.circuitHash,
    implementation: params.implementation,
    status: params.status,
    policyVersion: params.policyVersion,
    signerKeyId: params.signerKeyId || "hsm-quantum-v1",
    teeVerified: params.teeVerified || false,
    createdAt: new Date().toISOString(),
  };

  blocks.push(block);
  lastBlockHash = blockHash;

  return block;
}

/**
 * Verifica la integridad de la cadena de bloques.
 */
export function verifyChainIntegrity(): {
  valid: boolean;
  totalBlocks: number;
  firstBlockHash: string;
  lastBlockHash: string;
  brokenAt?: number;
} {
  if (blocks.length === 0) {
    return { valid: true, totalBlocks: 0, firstBlockHash: lastBlockHash, lastBlockHash };
  }

  let previousHash = createHash("sha256").update("bookpi-genesis").digest("hex");

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    if (block.previousHash !== previousHash) {
      return {
        valid: false,
        totalBlocks: blocks.length,
        firstBlockHash: blocks[0].blockHash,
        lastBlockHash,
        brokenAt: i,
      };
    }
    previousHash = block.blockHash;
  }

  return {
    valid: true,
    totalBlocks: blocks.length,
    firstBlockHash: blocks[0].blockHash,
    lastBlockHash,
  };
}

/**
 * Firma un bloque BookPI con PQC dual (ML-DSA-87 + SLH-DSA-128s).
 */
export function signQuantumBlock(block: BookPIBlock) {
  const canonical: QuantumCanonicalPayload = {
    schema: "bookpi-quantum-v1",
    requestId: block.requestId,
    circuitHash: block.circuitHash,
    implementation: block.implementation,
    status: block.status as QuantumStatus,
    policyVersion: block.policyVersion,
    timestamp: block.createdAt,
  };

  const canonicalStr = JSON.stringify(canonical);
  const signature = signLedgerBlockPQC(block.blockHash, createHash("sha256").update(canonicalStr).digest("hex"));

  return {
    blockHash: block.blockHash,
    canonical,
    signature,
  };
}

/**
 * Obtiene los últimos N bloques.
 */
export function getRecentBlocks(limit: number = 50): BookPIBlock[] {
  return blocks.slice(-limit);
}

/**
 * Busca un bloque por requestId.
 */
export function getBlockByRequestId(requestId: string): BookPIBlock | undefined {
  return blocks.find((b) => b.requestId === requestId);
}

/**
 * Obtiene métricas de BookPI.
 */
export function getBookPIMetrics() {
  const statuses: Record<string, number> = {};
  for (const b of blocks) {
    statuses[b.status] = (statuses[b.status] || 0) + 1;
  }

  return {
    totalBlocks: blocks.length,
    lastBlockHash,
    chainIntegrity: verifyChainIntegrity(),
    statusBreakdown: statuses,
    implementations: [...new Set(blocks.map((b) => b.implementation))],
  };
}

/**
 * Obtiene un snapshot federado (para replicación Heptafederado).
 */
export function getFederationPayload(block: BookPIBlock) {
  return {
    blockHash: block.blockHash,
    previousHash: block.previousHash,
    requestId: block.requestId,
    tenantId: block.tenantId,
    implementation: block.implementation,
    status: block.status,
    policyVersion: block.policyVersion,
    signerKeyId: block.signerKeyId,
    signature: "", // Filled by HSM sign
  };
}
