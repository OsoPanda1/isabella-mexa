import React, { useEffect, useState } from "react";
import { Activity, ShieldAlert, BookOpen, Database, BrainCircuit, Globe, Landmark, Coins } from "lucide-react";
import { useServerFn } from "../../lib/tanstack-polyfill";
import { getCockpitSnapshot } from "../../lib/atlas.functions";
import { RScoreGauge } from "./RScoreGauge";
import { Litle32Gates } from "./Litle32Gates";
import { QuantumReflectionCard } from "./QuantumReflectionCard";
import { CrownGovernanceCard } from "./CrownGovernanceCard";

export const Cockpit: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchSnapshot = useServerFn(getCockpitSnapshot);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await fetchSnapshot();
        if (mounted) setData(res);
      } catch (e: any) {
        if (mounted) setError(e.message);
      }
    };
    load();
    const t = setInterval(load, 3000);
    return () => {
      mounted = false;
      clearInterval(t);
    };
  }, []);

  if (error) {
    return <div className="p-4 bg-red-900/20 text-red-400 border border-red-500/30 rounded-xl">Error: {error}</div>;
  }

  if (!data) {
    return <div className="p-8 text-center text-slate-400 animate-pulse">Establishing connection to TAMV Kernel...</div>;
  }

  const { metrics, auditLogs, bookpi, anubis, isabella, eoct, economy, dao } = data;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Globe className="w-6 h-6 text-blue-400" />
            Atlas Cockpit
          </h1>
          <p className="text-sm text-slate-400">Live civilizational infrastructure telemetry.</p>
        </div>
        <div className="text-xs font-mono text-slate-500 bg-[#0B1221] px-3 py-1.5 rounded-full border border-slate-800">
          T: {new Date(data.now).toLocaleTimeString()}
        </div>
      </div>

      {/* Security & Core State */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <RScoreGauge />
        <Litle32Gates />
        <QuantumReflectionCard />
        <CrownGovernanceCard />
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* BookPI */}
        <div className="bg-[#0B1221] border border-slate-800 p-5 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-400 font-medium text-sm flex items-center gap-1.5">
              <Database className="w-4 h-4 text-emerald-400" /> BookPI Ledger
            </h3>
          </div>
          <div>
            <div className="text-3xl font-bold text-white">{bookpi.stats.total}</div>
            <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">Mined Blocks</p>
          </div>
          <div className="mt-3 text-[10px] text-slate-500 font-mono truncate">
            HEAD: {bookpi.stats.latestHash?.slice(0, 16)}...
          </div>
        </div>

        {/* Anubis */}
        <div className="bg-[#0B1221] border border-slate-800 p-5 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-400 font-medium text-sm flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-500" /> Anubis Sentinel
            </h3>
            {anubis.stats.criticals > 0 && (
              <span className="flex w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            )}
          </div>
          <div>
            <div className="text-3xl font-bold text-white">{anubis.stats.total}</div>
            <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">Evaluated Policies</p>
          </div>
          <div className="mt-3 flex justify-between text-xs text-slate-400">
            <span>Criticals: <span className={anubis.stats.criticals > 0 ? "text-rose-400" : ""}>{anubis.stats.criticals}</span></span>
            <span>Avg Risk: {(anubis.stats.avgAnomalyScore * 100).toFixed(1)}%</span>
          </div>
        </div>

        {/* Isabella */}
        <div className="bg-[#0B1221] border border-slate-800 p-5 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-400 font-medium text-sm flex items-center gap-1.5">
              <BrainCircuit className="w-4 h-4 text-purple-400" /> Isabella Cognitive
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
              {isabella.stats.emotionalState.dominant}
            </span>
          </div>
          <div>
            <div className="text-3xl font-bold text-white">{isabella.stats.episodesRecorded}</div>
            <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">Memory Episodes</p>
          </div>
          <div className="mt-3 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-purple-500 h-full" 
              style={{ width: `${Math.max(10, isabella.stats.emotionalState.valence * 100)}%` }}
            />
          </div>
        </div>

        {/* Economy */}
        <div className="bg-[#0B1221] border border-slate-800 p-5 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-400 font-medium text-sm flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-amber-400" /> Lucrum Prime
            </h3>
          </div>
          <div>
            <div className="text-3xl font-bold text-white">${economy.stats.paidRevenue.toFixed(2)}</div>
            <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">USD Volume</p>
          </div>
          <div className="mt-3 flex justify-between text-xs text-slate-400">
            <span>Orders: {economy.stats.totalOrders}</span>
            <span>Products: {economy.stats.totalProducts}</span>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Audit Log / EOCT Events */}
        <div className="bg-[#0B1221] border border-slate-800 p-5 rounded-xl">
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-800">
            <BookOpen className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-medium text-white">Live Event Trace (EOCT & Kernel)</h3>
          </div>
          <div className="space-y-3 h-[240px] overflow-y-auto pr-2 custom-scrollbar">
            {eoct.events.length === 0 && auditLogs.length === 0 && (
              <div className="text-sm text-slate-500 italic text-center py-8">Waiting for events...</div>
            )}
            {/* Merge and sort events */}
            {[
              ...eoct.events.map((e: any) => ({ ...e, _source: 'EOCT' })),
              ...auditLogs.map((a: any) => ({ ...a, _source: 'KERNEL', ts: a.ts }))
            ]
              .sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime())
              .slice(0, 8)
              .map((item, idx) => (
                <div key={idx} className="flex gap-3 text-sm p-2 rounded bg-slate-800/30 hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-700/50">
                  <div className="w-1.5 rounded-full bg-blue-500/50 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-mono text-xs text-blue-300 font-medium">
                        {item._source === 'EOCT' ? item.type : item.action}
                      </span>
                      <span className="text-[10px] text-slate-500">{new Date(item.ts).toLocaleTimeString()}</span>
                    </div>
                    <div className="text-slate-400 text-xs truncate">
                      {item._source === 'EOCT' ? `Actor: ${item.source} → Target: ${item.target || 'none'}` : `Actor: ${item.actor}`}
                    </div>
                  </div>
                </div>
            ))}
          </div>
        </div>

        {/* DAO / Governance */}
        <div className="bg-[#0B1221] border border-slate-800 p-5 rounded-xl">
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-800">
            <Landmark className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-medium text-white">KORIMA DAO Governance</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-800/30 p-3 rounded-lg border border-slate-700/30">
              <div className="text-slate-400 text-xs uppercase mb-1">Active Proposals</div>
              <div className="text-xl text-white font-medium">{dao.stats.activeProposals}</div>
            </div>
            <div className="bg-slate-800/30 p-3 rounded-lg border border-slate-700/30">
              <div className="text-slate-400 text-xs uppercase mb-1">Total Votes Cast</div>
              <div className="text-xl text-white font-medium">{dao.stats.totalVotes}</div>
            </div>
          </div>
          
          <div className="space-y-3">
             <div className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-2">Metrics Snapshot</div>
             {metrics.map((m: any, i: number) => (
                <div key={i} className="flex justify-between text-xs font-mono p-1.5 bg-slate-900/50 rounded">
                  <span className="text-slate-400 truncate w-2/3">{m.name}{m.labels ? ` {${m.labels}}` : ""}</span>
                  <span className="text-blue-300">{m.value}</span>
                </div>
             )).slice(0, 8)}
          </div>
        </div>
      </div>
    </div>
  );
};
