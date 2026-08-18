import React from "react";
import { useCrown, PRESET_PROFILES } from "../context/CrownContext";
import {
  Terminal as TerminalIcon,
  BookOpen,
  Sparkles,
  Palette,
  Volume2,
  Cpu,
  Zap,
  Activity,
  Heart,
  VolumeX,
  Keyboard,
  FileCheck,
  Server,
  Shield,
  Cloud,
  Lock,
  X,
  Search,
  Play,
} from "lucide-react";
import { soundManager } from "../utils/soundEffects";
import { CrownSystemState } from "../types";
import { ISABELLA_AVATAR_PRIMARY } from "../data/isabellaAvatar";

export const Header: React.FC = () => {
  const {
    state,
    setActiveView,
    setPreset,
    toggleSpeechSynthesis,
    openWelcomeModal,
    openTrailer,
    openShortcutsModal,
    openSecurityModal,
    toggleInferenceMode,
    dismissInferenceNotification,
  } = useCrown();

  const {
    activeView,
    activePreset,
    speechSynthesisEnabled,
    isSpeaking,
    inferenceMode,
    securityGovernance,
    lastInferenceTransition,
  } = state;

  const handleTabClick = (view: CrownSystemState["activeView"]) => {
    soundManager.playBeep(700, 0.03);
    setActiveView(view);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/90 bg-[#060A12]/95 backdrop-blur-xl transition-colors">
      {/* Top Transition Notification Banner when Switching Inference Mode */}
      {lastInferenceTransition && (
        <div className="w-full bg-[#0B1526] border-b border-slate-700/80 px-4 py-2 text-xs font-mono text-slate-200 flex items-center justify-between animate-fade-in shadow-lg">
          <div className="flex items-center gap-2 max-w-4xl truncate">
            <span className="p-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
              <Shield className="w-3.5 h-3.5" />
            </span>
            <span className="font-bold text-amber-300">
              [CONMUTACIÓN DE SOBERANÍA]:
            </span>
            <span className="text-slate-300 truncate">
              {lastInferenceTransition.reason} ({lastInferenceTransition.toMode === "local_sovereign" ? "Enclave Nodo Cero" : "Gateway Federado"})
            </span>
          </div>
          <button
            type="button"
            onClick={dismissInferenceNotification}
            className="p-1 rounded text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer"
            title="Cerrar notificación"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo & Sovereign Identity */}
          <div
            className="flex items-center gap-3 cursor-pointer group shrink-0"
            onClick={() => handleTabClick("presence")}
          >
            {/* Isabella Sovereign Avatar with Platinum & Subtle Gold Accent */}
            <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-slate-800 p-0.5 border border-slate-700 group-hover:border-amber-400/50 shadow-md transition-all">
              <div className="flex items-center justify-center w-full h-full rounded-2xl bg-[#030712] overflow-hidden">
                <img
                  src={ISABELLA_AVATAR_PRIMARY}
                  alt="Isabella Villaseñor AI"
                  className="w-full h-full object-cover object-top"
                  referrerPolicy="no-referrer"
                />
              </div>
              {isSpeaking && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold tracking-tight text-slate-100 group-hover:text-amber-200 transition-colors">
                  Isabella Villaseñor
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700 font-semibold shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1" />
                  CROWN v4.2
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono hidden md:block">
                Nodo Cero · Real del Monte :: ISA · SOPHIA · CROWN · ARGUS
              </p>
            </div>
          </div>

          {/* Navigation Tabs - Academic Pill Container */}
          <nav className="flex items-center gap-1 p-1 rounded-2xl bg-[#090E17] border border-slate-800 text-xs font-mono overflow-x-auto max-w-full shadow-inner">
            {/* 16-second AAA Cinematic Trailer */}
            <button
              type="button"
              onClick={() => {
                soundManager.playBeep(900, 0.04);
                openTrailer();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold border border-amber-500/40 shadow-sm transition-all whitespace-nowrap active:scale-95 cursor-pointer"
              title="Reproducir Trailer Cinematográfico AAA (16s)"
            >
              <Play className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
              <span>Trailer AAA (16s)</span>
            </button>

            {/* Friendly Welcome & Guide for Everyone */}
            <button
              type="button"
              onClick={() => {
                soundManager.playBeep(800, 0.04);
                openWelcomeModal();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold border border-slate-700 shadow-xs transition-all whitespace-nowrap active:scale-95 cursor-pointer"
              title="Guía de interacción e identidad de Isabella"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Conoce a Isabella</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabClick("terminal")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                activeView === "terminal"
                  ? "bg-slate-800 text-slate-100 font-bold border border-slate-600 shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
              title="Terminal interactiva (Alt+1)"
            >
              <TerminalIcon className="w-3.5 h-3.5 text-slate-300" />
              <span>Terminal</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabClick("presence")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                activeView === "presence"
                  ? "bg-slate-800 text-slate-100 font-bold border border-slate-600 shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
              title="Presencia y avatar de Isabella (Alt+2)"
            >
              <Heart className="w-3.5 h-3.5 text-rose-400/90" />
              <span>Presencia</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabClick("traceability")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                activeView === "traceability"
                  ? "bg-slate-800 text-slate-100 font-bold border border-slate-600 shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
              title="Panel de Trazabilidad Cognitiva & Auditoría Zero-Trust"
            >
              <FileCheck className="w-3.5 h-3.5 text-amber-300" />
              <span>Trazabilidad</span>
            </button>
            <button
              type="button"
              onClick={() => handleTabClick("codex")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                activeView === "codex"
                  ? "bg-slate-800 text-slate-100 font-bold border border-slate-600 shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
              title="Códice Canónico & RFCs (Alt+C)"
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-400" />
              <span>Códice</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabClick("image_studio")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                activeView === "image_studio"
                  ? "bg-slate-800 text-slate-100 font-bold border border-slate-600 shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
              title="Estudio de arte visual (Alt+3)"
            >
              <Palette className="w-3.5 h-3.5 text-sky-400" />
              <span>Arte Visual</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabClick("voice_studio")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all whitespace-nowrap hidden sm:flex cursor-pointer ${
                activeView === "voice_studio"
                  ? "bg-slate-800 text-slate-100 font-bold border border-slate-600 shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
              title="Estudio acústico de voz (Alt+4)"
            >
              <Volume2 className="w-3.5 h-3.5 text-amber-300" />
              <span>Voz</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabClick("architecture")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all whitespace-nowrap hidden md:flex cursor-pointer ${
                activeView === "architecture"
                  ? "bg-slate-800 text-slate-100 font-bold border border-slate-600 shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
              title="Arquitectura cognitiva (Alt+5)"
            >
              <Cpu className="w-3.5 h-3.5 text-slate-300" />
              <span>Arquitectura</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabClick("synapse")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all whitespace-nowrap hidden lg:flex cursor-pointer ${
                activeView === "synapse"
                  ? "bg-slate-800 text-slate-100 font-bold border border-slate-600 shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
              title="Flujo sináptico CROWN"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>Sinapsis</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabClick("presentation")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                activeView === "presentation"
                  ? "bg-slate-800 text-slate-100 font-bold border border-slate-600 shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
              title="Presentación y auditoría académica (Alt+7)"
            >
              <Activity className="w-3.5 h-3.5 text-slate-300" />
              <span>Dossier</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabClick("hub")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                activeView === "hub"
                  ? "bg-slate-800 text-slate-100 font-bold border border-slate-600 shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
              title="Nodo Cero Hub & API /api/v1/isabella (Alt+8)"
            >
              <Server className="w-3.5 h-3.5 text-sky-400" />
              <span>Hub RDM</span>
            </button>
          </nav>

          {/* Quick controls: Minimalist Security Indicator & Inference Fallback Switcher */}
          <div className="flex items-center gap-2 font-mono text-xs shrink-0">
            {/* Minimalist Security/Governance Indicator (Clickable for Telemetry Modal) */}
            <button
              type="button"
              onClick={openSecurityModal}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-slate-100 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer shadow-xs"
              title="Ver Gobernanza y Políticas Zero-Trust C.R.O.W.N."
            >
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden xl:inline font-bold">Zero-Trust L4</span>
              <span className="text-[10px] text-emerald-400 font-bold">99.8%</span>
            </button>

            {/* Inference Mode Toggle (Cloud vs Local Sovereign Fallback) */}
            <button
              type="button"
              onClick={() => toggleInferenceMode()}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-xs ${
                inferenceMode === "local_sovereign"
                  ? "bg-amber-950/40 border-amber-500/50 text-amber-300"
                  : "bg-slate-900/90 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-slate-100"
              }`}
              title={`Modo actual: ${inferenceMode === "local_sovereign" ? "Nodo Cero Local Soberano" : "Inferencia Cloud Federada"}. Haz clic para conmutar.`}
            >
              {inferenceMode === "local_sovereign" ? (
                <>
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Nodo Cero</span>
                  <span className="text-[10px] uppercase text-amber-400 font-normal hidden lg:inline">(Local)</span>
                </>
              ) : (
                <>
                  <Cloud className="w-3.5 h-3.5 text-sky-400" />
                  <span className="hidden sm:inline">Cloud Fed.</span>
                </>
              )}
            </button>

            {/* Keyboard Shortcuts button */}
            <button
              type="button"
              onClick={() => {
                soundManager.playBeep(880, 0.03);
                openShortcutsModal();
              }}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors cursor-pointer hidden md:flex"
              title="Atajos de teclado (Ctrl+/ o ?)"
            >
              <Keyboard className="w-4 h-4" />
            </button>

            {/* Voice toggle */}
            <button
              type="button"
              onClick={toggleSpeechSynthesis}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                speechSynthesisEnabled
                  ? "bg-slate-800 border-slate-700 text-amber-300"
                  : "bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300"
              }`}
              title={speechSynthesisEnabled ? "Voz activa" : "Voz silenciada"}
            >
              {speechSynthesisEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Profile dropdown */}
            <select
              value={activePreset}
              onChange={(e) => setPreset(e.target.value as any)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-2 py-1.5 text-slate-200 font-bold focus:outline-none focus:border-slate-600 cursor-pointer hidden lg:block text-xs"
            >
              {Object.values(PRESET_PROFILES).map((p) => (
                <option key={p.id} value={p.id} className="bg-[#030712] text-slate-200">
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};
