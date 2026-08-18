import { Router } from "express";
import { metrics, readAudit } from "./atlas-kernel.server";
import { evaluatePolicy, anubisStats } from "./anubis.server";
import { readLedger, ledgerStats, verifyLedger } from "./bookpi.server";
import { isabellaStats, getRecommendations, moderateContent, getEmotionalState, updateEmotionalState, searchEpisodes } from "./isabella.server";
import { getGraph, getEvents } from "./eoct.server";
import { listProducts, listOrders, economyStats, createOrder, payOrder, mintCredits } from "./economy.server";
import { listNamespaces, listProposals, daoStats, castVote, createProposal } from "./dao.server";
import { EventSchemas } from "./events-catalog";
import { publish } from "./eventbus.server";
import { createDocument, transitionState, listDocuments, registryStats } from "./document-registry.server";
import { getQuantumReflection } from "./quantum-bridge.server";

export const atlasRouter = Router();

atlasRouter.get("/api/atlas/getCockpitSnapshot", async (req, res) => {
  res.json({
    now: new Date().toISOString(),
    metrics: metrics.snapshot(),
    auditLogs: readAudit(10),
    bookpi: { stats: ledgerStats() },
    anubis: { stats: anubisStats() },
    isabella: { stats: isabellaStats() },
    eoct: { events: getEvents(10) },
    economy: { stats: economyStats() },
    dao: { stats: daoStats() },
  });
});

atlasRouter.get("/api/atlas/getFederationGraph", async (req, res) => {
  res.json(getGraph(200));
});

atlasRouter.post("/api/atlas/emitEoctEvent", async (req, res) => {
  try {
    const data = EventSchemas[req.body.type as keyof typeof EventSchemas]?.parse(req.body);
    if (!data) throw new Error("Invalid event type");
    await publish(data as any);
    res.json({ success: true, event_id: req.body.event_id });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

atlasRouter.post("/api/atlas/getLedger", (req, res) => {
  res.json(readLedger(50));
});

atlasRouter.post("/api/atlas/evalAnubisPolicy", (req, res) => {
  res.json(evaluatePolicy(req.body));
});

atlasRouter.post("/api/atlas/isabellaAsk", async (req, res) => {
  try {
    res.json(searchEpisodes(req.body.query, 3));
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

atlasRouter.post("/api/atlas/isabellaRecommend", async (req, res) => {
  try {
    res.json(getRecommendations(req.body.userId, req.body.context));
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

atlasRouter.post("/api/atlas/isabellaModerate", async (req, res) => {
  try {
    res.json(moderateContent(req.body.content, req.body.context));
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

atlasRouter.post("/api/atlas/setEmotional", (req, res) => {
  res.json(updateEmotionalState(req.body));
});

atlasRouter.get("/api/atlas/getEconomySnapshot", (req, res) => {
  res.json({ products: listProducts(), orders: listOrders(), stats: economyStats() });
});

atlasRouter.post("/api/atlas/purchaseProduct", async (req, res) => {
  try {
    const order = createOrder(req.body.userId, req.body.productId);
    payOrder(order.id);
    res.json(order);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

atlasRouter.post("/api/atlas/mintUserCredits", (req, res) => {
  res.json(mintCredits(req.body.userId, req.body.amount));
});

atlasRouter.get("/api/atlas/getDaoSnapshot", (req, res) => {
  res.json({ namespaces: listNamespaces(), proposals: listProposals(), stats: daoStats() });
});

atlasRouter.post("/api/atlas/daoVote", (req, res) => {
  res.json(castVote(req.body.proposalId, req.body.voterId, req.body.choice));
});

atlasRouter.post("/api/atlas/daoCreateProposal", (req, res) => {
  res.json(createProposal(req.body.authorId, req.body.namespaceId, req.body.title, req.body.body));
});

// Registry
atlasRouter.post("/api/registry/rpcCreateDocument", async (req, res) => {
  try {
    res.json(await createDocument(req.body));
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

atlasRouter.post("/api/registry/rpcTransitionState", async (req, res) => {
  try {
    res.json(await transitionState(req.body));
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

atlasRouter.get("/api/registry/rpcRegistrySnapshot", (req, res) => {
  res.json({ documents: listDocuments(), stats: registryStats() });
});

// Telemetry
atlasRouter.get("/api/telemetry/getTelemetrySnapshot", (req, res) => {
  res.json({ metrics: metrics.snapshot() });
});

atlasRouter.post("/api/telemetry/fireSyntheticEvent", (req, res) => {
  metrics.counter("synthetic_events_total").inc({ origin: req.body.origin || "api" });
  res.json({ success: true });
});

atlasRouter.get("/api/atlas/quantumReflection", (req, res) => {
  res.json(getQuantumReflection());
});
