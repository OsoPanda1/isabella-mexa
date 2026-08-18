import React, { useEffect, useState } from "react";
import { Crown, Sparkles, ShieldCheck, Zap } from "lucide-react";

interface PlanDto {
  id: string;
  name: string;
  monthlyUsd: number | null;
  dailyMessages: number;
  dailyImages: number;
  dailyVoiceSeconds: number;
  maxAgentSessions: number;
  features: string[];
  checkoutUrl: string | null;
}

interface BillingDto {
  ok: boolean;
  positioning: string;
  plans: PlanDto[];
  current: {
    plan: PlanDto;
    usage: { messages: number; images: number; voiceSeconds: number; agentSessions: number };
    remaining: { messages: number; images: number; voiceSeconds: number; agentSessions: number };
    resetAt: string;
  };
}

const formatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export const SubscriptionPlans: React.FC = () => {
  const [billing, setBilling] = useState<BillingDto | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/v1/billing/plans", { signal: controller.signal })
      .then((res) => res.json())
      .then(setBilling)
      .catch(() => undefined);
    return () => controller.abort();
  }, []);

  if (!billing) return null;

  const visiblePlans = billing.plans.filter((plan) => ["free", "plus", "premium", "vip", "enterprise"].includes(plan.id));

  return (
    <section className="mb-4 rounded-3xl border border-slate-800/80 bg-gradient-to-br from-[#081324]/95 via-[#06101E]/95 to-[#030712]/95 p-4 shadow-2xl shadow-black/30">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-bold text-slate-100">
            <Crown className="h-4 w-4 text-amber-300" /> Planes operativos Isabella AI
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono text-emerald-300">
              Cuota diaria activa
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">{billing.positioning}</p>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-300 sm:grid-cols-4">
          <span className="rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2">Mensajes restantes: <b className="text-sky-300">{billing.current.remaining.messages}</b></span>
          <span className="rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2">Imágenes: <b className="text-amber-300">{billing.current.remaining.images}</b></span>
          <span className="rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2">Voz seg.: <b className="text-pink-300">{billing.current.remaining.voiceSeconds}</b></span>
          <span className="rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2">Plan: <b className="text-emerald-300">{billing.current.plan.name}</b></span>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {visiblePlans.map((plan) => (
          <article key={plan.id} className={`rounded-2xl border p-3 ${plan.id === "plus" ? "border-amber-500/50 bg-amber-500/10" : "border-slate-800 bg-slate-950/50"}`}>
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-slate-100">{plan.name}</h3>
              {plan.id === "plus" && <Sparkles className="h-4 w-4 text-amber-300" />}
              {plan.id === "enterprise" && <ShieldCheck className="h-4 w-4 text-emerald-300" />}
            </div>
            <p className="mt-2 text-2xl font-black text-white">{plan.monthlyUsd === null ? "Custom" : formatter.format(plan.monthlyUsd)}<span className="text-xs font-medium text-slate-400">/mes</span></p>
            <p className="mt-1 text-[11px] font-mono text-slate-400">{plan.dailyMessages.toLocaleString()} mensajes · {plan.dailyImages.toLocaleString()} imágenes/día</p>
            <ul className="mt-3 space-y-1.5 text-[11px] text-slate-300">
              {plan.features.slice(0, 3).map((feature) => (
                <li key={feature} className="flex gap-1.5"><Zap className="mt-0.5 h-3 w-3 shrink-0 text-sky-300" />{feature}</li>
              ))}
            </ul>
            {plan.checkoutUrl && (
              <a href={plan.checkoutUrl} className="mt-3 block rounded-xl border border-amber-400/40 bg-amber-400 px-3 py-2 text-center text-xs font-black text-slate-950 transition hover:bg-amber-300">
                Activar plan
              </a>
            )}
          </article>
        ))}
      </div>
    </section>
  );
};
