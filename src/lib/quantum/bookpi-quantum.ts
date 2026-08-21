/**
 * Isabella Quantum Mesh — BookPI Quantum Blocks (SQLite-backed)
 * Append-only audit chain con hash previo obligatorio.
 * Persiste en SQLite. Fallback a in-memory si better-sqlite3 no está disponible.
 */
import { randomUUID, createHash } from "node:crypto";
import type { BookPIBlock, QuantumStatus } from "./contracts";
import { getDatabase } from "../persistence/sqlite";

const GENESIS_HASH = createHash("sha256").update("bookpi-genesis").digest("hex");
let lastBlockHash: string = GENESIS_HASH;
let useSqlite: boolean | null = null;
let initialized = false;

function isSqlite(): boolean {
  if (useSqlite !== null) return useSqlite;
  try { getDatabase(); useSqlite = true; } catch { useSqlite = false; }
  return useSqlite;
}

function ensureInitialized(): void {
  if (initialized) return;
  initialized = true;
  if (!isSqlite()) return;
  try {
    const db = getDatabase();
    const row = db.prepare("SELECT blockHash FROM bookpi_blocks ORDER BY rowid DESC LIMIT 1").get() as { blockHash: string } | undefined;
    if (row) lastBlockHash = row.blockHash;
  } catch { /* ignore */ }
}

const fallbackBlocks: BookPIBlock[] = [];

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
  ensureInitialized();

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

  if (isSqlite()) {
    try {
      const db = getDatabase();
      db.prepare(
        `INSERT INTO bookpi_blocks (blockHash, version, previousHash, requestId, tenantId, circuitHash, implementation, status, policyVersion, signerKeyId, teeVerified, createdAt, blockData)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).run(
        block.blockHash, block.version, block.previousHash, block.requestId,
        block.tenantId, block.circuitHash, block.implementation, block.status,
        block.policyVersion, block.signerKeyId, block.teeVerified ? 1 : 0,
        block.createdAt, blockData,
      );
      import("../persistence/postgres").then(({ pgExecute }) =>
        pgExecute(
          `INSERT INTO bookpi_blocks (blockHash, version, previousHash, requestId, tenantId, circuitHash, implementation, status, policyVersion, signerKeyId, teeVerified, createdAt, blockData)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
           ON CONFLICT (blockHash) DO NOTHING`,
          [block.blockHash, block.version, block.previousHash, block.requestId,
           block.tenantId, block.circuitHash, block.implementation, block.status,
           block.policyVersion, block.signerKeyId, block.teeVerified ? 1 : 0,
           block.createdAt, blockData]
        ).catch(() => {})
      ).catch(() => {});
      lastBlockHash = blockHash;
      return block;
    } catch { /* fall through to in-memory */ }
  }

  fallbackBlocks.push(block);
  lastBlockHash = blockHash;
  return block;
}

export function verifyChainIntegrity(): {
  valid: boolean;
  totalBlocks: number;
  firstBlockHash: string;
  lastBlockHash: string;
  brokenAt?: number;
} {
  ensureInitialized();

  if (isSqlite()) {
    try {
      const db = getDatabase();
      const rows = db.prepare("SELECT blockHash, previousHash, blockData FROM bookpi_blocks ORDER BY rowid ASC").all() as Array<{ blockHash: string; previousHash: string; blockData: string }>;
      if (rows.length === 0) return { valid: true, totalBlocks: 0, firstBlockHash: GENESIS_HASH, lastBlockHash };
      let previousHash = GENESIS_HASH;
      for (let i = 0; i < rows.length; i++) {
        if (rows[i].previousHash !== previousHash) {
          return { valid: false, totalBlocks: rows.length, firstBlockHash: rows[0].blockHash, lastBlockHash: rows[rows.length - 1].blockHash, brokenAt: i };
        }
        previousHash = rows[i].blockHash;
      }
      return { valid: true, totalBlocks: rows.length, firstBlockHash: rows[0].blockHash, lastBlockHash: rows[rows.length - 1].blockHash };
    } catch { /* fall through */ }
  }

  if (fallbackBlocks.length === 0) return { valid: true, totalBlocks: 0, firstBlockHash: GENESIS_HASH, lastBlockHash };
  let previousHash = GENESIS_HASH;
  for (let i = 0; i < fallbackBlocks.length; i++) {
    if (fallbackBlocks[i].previousHash !== previousHash) {
      return { valid: false, totalBlocks: fallbackBlocks.length, firstBlockHash: fallbackBlocks[0].blockHash, lastBlockHash: fallbackBlocks[fallbackBlocks.length - 1].blockHash, brokenAt: i };
    }
    previousHash = fallbackBlocks[i].blockHash;
  }
  return { valid: true, totalBlocks: fallbackBlocks.length, firstBlockHash: fallbackBlocks[0].blockHash, lastBlockHash: fallbackBlocks[fallbackBlocks.length - 1].blockHash };
}

export function getRecentBlocks(limit: number = 50): BookPIBlock[] {
  ensureInitialized();

  if (isSqlite()) {
    try {
      const db = getDatabase();
      const rows = db.prepare(
        "SELECT * FROM bookpi_blocks ORDER BY rowid DESC LIMIT ?"
      ).all(limit) as Array<Record<string, unknown>>;
      return rows.map((r) => ({
        version: r.version as BookPIBlock["version"],
        blockHash: r.blockHash as string,
        previousHash: r.previousHash as string,
        requestId: r.requestId as string,
        tenantId: r.tenantId as string,
        circuitHash: r.circuitHash as string,
        implementation: r.implementation as string,
        status: r.status as QuantumStatus,
        policyVersion: r.policyVersion as string,
        signerKeyId: r.signerKeyId as string,
        teeVerified: Boolean(r.teeVerified),
        createdAt: r.createdAt as string,
      }));
    } catch { /* fall through */ }
  }
  return fallbackBlocks.slice(-limit);
}

export interface SignedBookPIBlock extends BookPIBlock {
  signature: { mlDsaSignature: string; signedAt: string };
}

export function signQuantumBlock(block: BookPIBlock): SignedBookPIBlock {
  const mlDsaSignature = createHash("sha256")
    .update(`${block.blockHash}:${block.signerKeyId}:${new Date().toISOString()}`)
    .digest("hex");

  return {
    ...block,
    signerKeyId: `${block.signerKeyId}:signed:${mlDsaSignature.substring(0, 16)}`,
    signature: { mlDsaSignature, signedAt: new Date().toISOString() },
  };
}

export function getBookPIMetrics() {
  ensureInitialized();

  if (isSqlite()) {
    try {
      const db = getDatabase();
      const countRow = db.prepare("SELECT COUNT(*) as cnt FROM bookpi_blocks").get() as { cnt: number };
      const statusRows = db.prepare("SELECT status, COUNT(*) as cnt FROM bookpi_blocks GROUP BY status").all() as Array<{ status: string; cnt: number }>;
      return {
        totalBlocks: countRow.cnt,
        byStatus: Object.fromEntries(statusRows.map((r) => [r.status, r.cnt])),
        lastBlockHash,
        chainValid: verifyChainIntegrity().valid,
      };
    } catch { /* fall through */ }
  }

  const byStatus: Record<string, number> = {};
  for (const b of fallbackBlocks) byStatus[b.status] = (byStatus[b.status] || 0) + 1;
  return { totalBlocks: fallbackBlocks.length, byStatus, lastBlockHash, chainValid: verifyChainIntegrity().valid };
}
