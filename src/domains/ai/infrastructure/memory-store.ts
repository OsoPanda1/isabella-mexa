/**
 * HIERARCHICAL MEMORY STORE - ISABELLA COGNITIVE ARCHITECTURE
 * Nodo Cero :: RDM Digital
 * Scopes: immediate | session | project | territorial | historical
 */

import { IsabellaMemoryItem, IsabellaMemoryScope } from "../../../contracts/isabella";

// In-memory persistent cache for hierarchical items
const memoryStore: IsabellaMemoryItem[] = [
  {
    memoryId: "mem-territorial-001",
    tenantId: "nodo-cero-rdm",
    scope: "territorial",
    content: "Real del Monte (Mineral del Monte), Hidalgo: Pueblo Mágico minero, cuna del paste y del fútbol en México. Altitud 2,700 msnm.",
    sourceType: "system",
    relevance: 1.0,
    checksum: "sha256_rdm_territory_core",
    createdAt: new Date(Date.now() - 3600000 * 24 * 7).toISOString(),
  },
  {
    memoryId: "mem-historical-002",
    tenantId: "nodo-cero-rdm",
    scope: "historical",
    content: "Nodo Cero: Primer nodo de soberanía tecnológica e inteligencia contextualizada en Latinoamérica fundado por RDM Digital.",
    sourceType: "system",
    relevance: 0.98,
    checksum: "sha256_nodo_cero_genesis",
    createdAt: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
  },
  {
    memoryId: "mem-project-003",
    tenantId: "nodo-cero-rdm",
    scope: "project",
    content: "Isabella Villaseñor AI: Arquitectura cognitiva híbrida estructurada en 5 pilares (ISA, SOPHIA, ORION, ARGUS, CROWN Gateway).",
    sourceType: "system",
    relevance: 0.99,
    checksum: "sha256_isabella_architecture",
    createdAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
  },
];

export async function addMemoryItem(item: Omit<IsabellaMemoryItem, "memoryId" | "checksum" | "createdAt" | "updatedAt">): Promise<IsabellaMemoryItem> {
  const memoryId = `mem-${item.scope}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();

  // Compute checksum
  const str = item.content + (item.scope || "");
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const checksum = `sha256_${Math.abs(hash).toString(16).padStart(8, "0")}`;

  const newItem: IsabellaMemoryItem = {
    ...item,
    memoryId,
    checksum,
    createdAt: now,
    updatedAt: now,
  };

  memoryStore.unshift(newItem);
  return newItem;
}

export function queryMemory(filter?: {
  scope?: IsabellaMemoryScope;
  minRelevance?: number;
  searchQuery?: string;
}): IsabellaMemoryItem[] {
  let results = [...memoryStore];

  if (filter?.scope) {
    results = results.filter((m) => m.scope === filter.scope);
  }

  if (typeof filter?.minRelevance === "number") {
    results = results.filter((m) => m.relevance >= (filter.minRelevance || 0));
  }

  if (filter?.searchQuery) {
    const q = filter.searchQuery.toLowerCase();
    results = results.filter((m) => m.content.toLowerCase().includes(q));
  }

  return results;
}

export function getAllMemories(): IsabellaMemoryItem[] {
  return [...memoryStore];
}

export function clearMemoryScope(scope: IsabellaMemoryScope): void {
  for (let i = memoryStore.length - 1; i >= 0; i--) {
    if (memoryStore[i].scope === scope) {
      memoryStore.splice(i, 1);
    }
  }
}
