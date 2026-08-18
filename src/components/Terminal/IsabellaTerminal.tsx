import React, { useMemo, useState } from "react";
import { useCrown } from "../../context/CrownContext";
import { MessageStream } from "./MessageStream";
import { TerminalCommandLine } from "./TerminalCommandLine";
import {
  Activity,
  Bot,
  ChevronLeft,
  ChevronRight,
  Crown,
  FileCheck,
  Image,
  LayoutDashboard,
  MessageSquareText,
  Mic2,
  Network,
  PanelLeftClose,
  PanelLeftOpen,
  Play,
  Search,
  Settings2,
  Shield,
  Sparkles,
  Trash2,
  Volume2,
  VolumeX,
  Wallet,
} from "lucide-react";
import { soundManager } from "../../utils/soundEffects";
import { ISABELLA_AVATAR_PRIMARY } from "../../data/isabellaAvatar";
import { SubscriptionPlans } from "../Billing/SubscriptionPlans";

export const IsabellaTerminal: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showPlans, setShowPlans] = useState(false);
  const {
    state,
    messages,
    clearMessages,
    toggleSound,
    toggleSpeechSynthesis,
    triggerManualDiagnostic,
    setActiveView,
    openWelcomeModal,
    openShortcutsModal,
    openTrailer,
    openSecurityModal,
  } = useCrown();

  const latestIsabellaMessage = useMemo(
    () => [...messages].reverse().find((message) => message.role === "isabella"),
    [messages]
  );

  const navigationItems = [
    { label: "Chat limpio", icon: MessageSquareText, action: () => undefined, active: true, hint: "Interfaz principal" },
    { label: "Presencia", icon: Bot, action: () => setActiveView("presence"), hint: "Avatar y esencia" },
    { label: "Voz", icon: Mic2, action: () => setActiveView("voice_studio"), hint: "Voice Studio" },
    { label: "Arte visual", icon: Image, action: () => setActiveView("image_studio"), hint: "ORION Flux" },
    { label: "Monitoreo", icon: LayoutDashboard, action: () => setActiveView("architecture"), hint: "Sistemas" },
    { label: "Trazabilidad", icon: FileCheck, action: () => setActiveView("traceability"), hint: "Audit-Tracer" },
    { label: "Hub RDM", icon: Network, action: () => setActiveView("hub"), hint: "APIs" },
    { label: "Planes", icon: Wallet, action: () => setShowPlans((prev) => !prev), hint: "Plus/VIP" },
  ];

  const handleClear = () => {
    soundManager.playBeep(450, 0.04);
    clearMessages();
  };

  return (
    <div className="relative min-h-[calc(100vh-112px)] overflow-hidden rounded-[2rem] border border-white/10 bg-[#020817]/95 shadow-[0_32px_120px_rgba(0,0,0,0.55)] backdrop-blur-2xl">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_32%),radial-gradient(circle_at_80%_0%,rgba(245,158,11,0.13),transparent_30%),linear-gradient(180deg,rgba(15,23,42,0.55),rgba(2,6,23,0.96))]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,.45)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.45)_1px,transparent_1px)] [background-size:48px_48px]" />

      <div className="relative z-10 flex min-h-[calc(100vh-112px)]">
        <aside
          className={`hidden border-r border-white/10 bg-slate-950/55 backdrop-blur-2xl transition-all duration-300 lg:flex lg:flex-col ${
            sidebarCollapsed ? "w-[92px]" : "w-[292px]"
          }`}
        >
          <div className="flex items-center justify-between gap-3 border-b border-white/10 p-4">
            <button
              type="button"
              onClick={openTrailer}
              className="group flex min-w-0 items-center gap-3 text-left"
              title="Reproducir intro épico"
            >
              <span className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-amber-300/40 bg-slate-900 shadow-lg shadow-amber-950/30">
                <img src={ISABELLA_AVATAR_PRIMARY} alt="Isabella" className="h-full w-full object-cover object-top" />
                <span className="absolute inset-0 bg-gradient-to-tr from-sky-400/20 via-transparent to-amber-300/20" />
              </span>
              {!sidebarCollapsed && (
                <span className="min-w-0">
                  <span className="block truncate text-sm font-black text-white">Isabella</span>
                  <span className="block truncate text-[11px] font-mono text-slate-400">Nodo Cero · CROWN v4.2</span>
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setSidebarCollapsed((prev) => !prev)}
              className="rounded-xl border border-slate-800 bg-slate-900/80 p-2 text-slate-400 transition hover:border-sky-500/40 hover:text-sky-300"
              title={sidebarCollapsed ? "Expandir barra lateral" : "Contraer barra lateral"}
            >
              {sidebarCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
            </button>
          </div>

          <div className="flex-1 space-y-5 overflow-y-auto p-4">
            <button
              type="button"
              onClick={openWelcomeModal}
              className={`flex w-full items-center gap-3 rounded-2xl border border-amber-400/30 bg-gradient-to-r from-amber-400/20 to-sky-400/10 p-3 text-left shadow-lg shadow-amber-950/20 transition hover:border-amber-300/60 ${sidebarCollapsed ? "justify-center" : ""}`}
            >
              <Sparkles className="h-5 w-5 shrink-0 text-amber-300" />
              {!sidebarCollapsed && (
                <span>
                  <span className="block text-xs font-black text-amber-100">Nuevo diálogo épico</span>
                  <span className="text-[11px] text-slate-400">Guía + contexto de Isabella</span>
                </span>
              )}
            </button>

            <nav className="space-y-1.5">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      soundManager.playBeep(720, 0.025);
                      item.action();
                    }}
                    className={`group flex w-full items-center gap-3 rounded-2xl border px-3 py-2.5 text-left text-sm transition ${
                      item.active
                        ? "border-sky-400/40 bg-sky-400/10 text-sky-100"
                        : "border-transparent text-slate-400 hover:border-slate-700 hover:bg-slate-900/75 hover:text-white"
                    } ${sidebarCollapsed ? "justify-center" : ""}`}
                    title={`${item.label} · ${item.hint}`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {!sidebarCollapsed && (
                      <>
                        <span className="flex-1 font-semibold">{item.label}</span>
                        <span className="text-[10px] font-mono text-slate-500">{item.hint}</span>
                      </>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="border-t border-white/10 p-4">
            <div className={`rounded-2xl border border-emerald-400/25 bg-emerald-400/10 p-3 ${sidebarCollapsed ? "text-center" : ""}`}>
              <div className={`flex items-center gap-2 ${sidebarCollapsed ? "justify-center" : ""}`}>
                <Shield className="h-4 w-4 text-emerald-300" />
                {!sidebarCollapsed && <span className="text-xs font-black text-emerald-200">ARGUS Zero-Trust</span>}
              </div>
              {!sidebarCollapsed && <p className="mt-1 text-[11px] text-emerald-100/70">Hardening activo · auditoría · cuotas · PQC</p>}
            </div>
          </div>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col">
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-slate-950/30 px-4 py-3 backdrop-blur-2xl sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-sky-400/30 bg-sky-400/10 text-sky-200 shadow-lg shadow-sky-950/30">
                <Crown className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="truncate text-base font-black text-white sm:text-lg">Chat con Isabella Villaseñor</h1>
                  <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-300">
                    Online
                  </span>
                </div>
                <p className="truncate text-xs text-slate-400">Interfaz limpia tipo copiloto: conversar primero, monitorear después.</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button type="button" onClick={openTrailer} className="rounded-xl border border-amber-400/30 bg-amber-400/10 p-2 text-amber-300 transition hover:bg-amber-400/20" title="Intro cinemático">
                <Play className="h-4 w-4" />
              </button>
              <button type="button" onClick={triggerManualDiagnostic} className="rounded-xl border border-slate-700 bg-slate-900/70 p-2 text-slate-300 transition hover:border-sky-400/40 hover:text-sky-300" title="Diagnóstico">
                <Activity className="h-4 w-4" />
              </button>
              <button type="button" onClick={openSecurityModal} className="rounded-xl border border-slate-700 bg-slate-900/70 p-2 text-slate-300 transition hover:border-emerald-400/40 hover:text-emerald-300" title="Gobernanza">
                <Shield className="h-4 w-4" />
              </button>
              <button type="button" onClick={toggleSpeechSynthesis} className={`rounded-xl border p-2 transition ${state.speechSynthesisEnabled ? "border-amber-400/40 bg-amber-400/10 text-amber-300" : "border-slate-700 bg-slate-900/70 text-slate-500"}`} title="Voz de Isabella">
                {state.speechSynthesisEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </button>
              <button type="button" onClick={toggleSound} className="hidden rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-[11px] font-mono font-bold text-slate-300 transition hover:text-sky-300 sm:block" title="FX">
                {state.soundEnabled ? "FX ON" : "FX OFF"}
              </button>
              <button type="button" onClick={openShortcutsModal} className="rounded-xl border border-slate-700 bg-slate-900/70 p-2 text-slate-300 transition hover:text-sky-300" title="Atajos">
                <Settings2 className="h-4 w-4" />
              </button>
              <button type="button" onClick={handleClear} className="rounded-xl border border-slate-700 bg-slate-900/70 p-2 text-slate-400 transition hover:border-red-400/40 hover:text-red-300" title="Limpiar chat">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </header>

          {showPlans && (
            <div className="border-b border-white/10 bg-slate-950/40 px-4 pt-4 sm:px-6">
              <SubscriptionPlans />
            </div>
          )}

          <div className="grid min-h-0 flex-1 grid-cols-1 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div className="flex min-h-0 flex-col">
              <div className="flex-1 overflow-hidden px-3 py-4 sm:px-6">
                <div className="mx-auto flex h-full max-w-4xl flex-col rounded-[1.75rem] border border-white/10 bg-slate-950/35 shadow-2xl shadow-black/25 backdrop-blur-xl">
                  <div className="border-b border-white/10 px-4 py-3">
                    <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/55 px-3 py-2 text-xs text-slate-400">
                      <Search className="h-3.5 w-3.5 text-sky-300" />
                      <span className="truncate">Pregunta, crea, diseña, razona o ejecuta con Isabella. Enter envía · Shift+Enter escribe en varias líneas.</span>
                    </div>
                  </div>
                  <div className="min-h-0 flex-1 p-3 sm:p-5">
                    <MessageStream messages={messages} />
                  </div>
                  <div className="border-t border-white/10 bg-slate-950/60 p-3 sm:p-4">
                    <TerminalCommandLine />
                  </div>
                </div>
              </div>
            </div>

            <aside className="hidden border-l border-white/10 bg-slate-950/35 p-4 backdrop-blur-xl xl:block">
              <div className="sticky top-24 space-y-4">
                <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-4 shadow-xl">
                  <div className="flex items-center gap-3">
                    <img src={ISABELLA_AVATAR_PRIMARY} alt="Isabella" className="h-14 w-14 rounded-2xl object-cover object-top ring-1 ring-amber-300/40" />
                    <div>
                      <h2 className="text-sm font-black text-white">Presencia activa</h2>
                      <p className="text-[11px] font-mono text-slate-400">ISA · SOPHIA · ORION · ARGUS</p>
                    </div>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-slate-300">
                    {latestIsabellaMessage?.isabellaState?.mood || "Serena, lúcida y lista para colaborar"}. La telemetría profunda vive en Monitoreo para mantener este chat limpio.
                  </p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-4 shadow-xl">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Accesos rápidos</h3>
                  <div className="mt-3 grid gap-2">
                    <button onClick={() => setActiveView("architecture")} className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/70 px-3 py-2 text-sm text-slate-200 transition hover:border-sky-400/40">
                      Monitoreo de sistemas <ChevronRight className="h-4 w-4 text-sky-300" />
                    </button>
                    <button onClick={() => setActiveView("voice_studio")} className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/70 px-3 py-2 text-sm text-slate-200 transition hover:border-amber-400/40">
                      Afinar voz <ChevronRight className="h-4 w-4 text-amber-300" />
                    </button>
                    <button onClick={() => setSidebarCollapsed((prev) => !prev)} className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/70 px-3 py-2 text-sm text-slate-200 transition hover:border-emerald-400/40">
                      Barra lateral <ChevronLeft className="h-4 w-4 text-emerald-300" />
                    </button>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </div>
  );
};
