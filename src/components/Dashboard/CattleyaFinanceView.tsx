import React from "react";
import { CreditCard, ShieldCheck, Activity, Lock, Wallet, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useCrown } from "../../context/CrownContext";
import { soundManager } from "../../utils/soundEffects";

export const CattleyaFinanceView: React.FC = () => {
  const { state } = useCrown();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-fade-in text-slate-200">
      <header className="flex flex-col items-center text-center space-y-4">
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
          <Wallet className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-light text-slate-100 tracking-wide">CATTLEYA™ Finance Hub</h2>
          <p className="text-sm font-mono text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Módulo Financiero Simbiótico integrado con TAMV DM-X4™. Gestión de valor, tarjetas virtuales y trazabilidad ética.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Virtual Card Showcase */}
        <div className="lg:col-span-1 bg-gradient-to-br from-slate-900 to-[#0A101F] border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-500/20 blur-3xl rounded-full" />
          <h3 className="text-xs font-mono tracking-widest text-slate-400 mb-6 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-400" />
            TARJETA VIRTUAL
          </h3>
          
          <div className="bg-gradient-to-br from-emerald-600 to-teal-900 rounded-xl p-5 text-white shadow-xl relative overflow-hidden aspect-[1.58/1]">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30 mix-blend-overlay" />
            <div className="flex justify-between items-start mb-8 relative z-10">
              <div className="w-10 h-6 bg-white/20 rounded backdrop-blur-sm" />
              <span className="text-[10px] font-mono bg-emerald-400/20 text-emerald-100 px-2 py-0.5 rounded-full border border-emerald-400/30">ACTIVA</span>
            </div>
            <div className="text-xl font-mono tracking-[0.2em] mb-4 relative z-10 shadow-black/50 drop-shadow-md">
              •••• •••• •••• 4096
            </div>
            <div className="flex justify-between items-end relative z-10 text-emerald-50">
              <div>
                <p className="text-[9px] opacity-70 mb-0.5">TITULAR SIMBIÓTICO</p>
                <p className="text-xs font-bold uppercase tracking-wider">Investigador RDM</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] opacity-70 mb-0.5">VENCE</p>
                <p className="text-xs font-mono">12/28</p>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex justify-between text-xs font-mono bg-[#030712] p-3 rounded-lg border border-slate-800/80">
              <span className="text-slate-400">Límite Diario:</span>
              <span className="text-emerald-400 font-bold">$5,000 MXN</span>
            </div>
            <div className="flex justify-between text-xs font-mono bg-[#030712] p-3 rounded-lg border border-slate-800/80">
              <span className="text-slate-400">Límite Mensual:</span>
              <span className="text-emerald-400 font-bold">$20,000 MXN</span>
            </div>
          </div>
        </div>

        {/* Dashboard & Metrics */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#070F1E] border border-slate-800 rounded-2xl p-5 flex flex-col justify-center">
              <span className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1.5 mb-2">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                Estado KYC/AML (ARGUS)
              </span>
              <div className="text-xl font-light text-slate-200">Verificación Premium</div>
              <div className="text-xs text-emerald-400 mt-1 font-mono">Validación criptográfica: OK</div>
            </div>
            <div className="bg-[#070F1E] border border-slate-800 rounded-2xl p-5 flex flex-col justify-center">
              <span className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1.5 mb-2">
                <Activity className="w-3 h-3 text-sky-400" />
                TAMV Créditos™
              </span>
              <div className="text-2xl font-mono font-bold text-sky-300">14,204.50</div>
              <div className="text-xs text-slate-400 mt-1">Recompensas éticas acumuladas</div>
            </div>
          </div>

          <div className="bg-[#070F1E] border border-slate-800 rounded-2xl p-6">
            <h3 className="text-sm font-bold font-mono tracking-widest text-slate-300 mb-6">HISTORIAL TRANSACCIONAL (MEA)</h3>
            <div className="space-y-3">
              {[
                { type: "pago", desc: "Suscripción API Isabella", amt: "-$499.00", status: "Aprobado", icon: ArrowUpRight, color: "text-rose-400" },
                { type: "ingreso", desc: "Recarga Nodo Cero", amt: "+$2,000.00", status: "Aprobado", icon: ArrowDownRight, color: "text-emerald-400" },
                { type: "pago", desc: "Instancia GPU A100", amt: "-$1,250.00", status: "Validado SPV", icon: ArrowUpRight, color: "text-rose-400" }
              ].map((tx, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-[#030712] border border-slate-800/80 rounded-xl hover:border-slate-700 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-slate-900 border border-slate-800 ${tx.color}`}>
                      <tx.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-200">{tx.desc}</p>
                      <p className="text-[10px] font-mono text-slate-500 mt-0.5 flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" />
                        {tx.status}
                      </p>
                    </div>
                  </div>
                  <div className={`text-sm font-mono font-bold ${tx.color}`}>
                    {tx.amt}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
