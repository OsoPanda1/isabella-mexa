import React from "react";
import { useCrown } from "../../context/CrownContext";
import { NeuralWaveform } from "./NeuralWaveform";
import { MessageStream } from "./MessageStream";
import { TerminalCommandLine } from "./TerminalCommandLine";
import {
  Terminal as TerminalIcon,
  Trash2,
  Volume2,
  VolumeX,
  Shield,
  Activity,
  Cpu,
  RefreshCw,
  Sparkles,
  Keyboard,
} from "lucide-react";
import { soundManager } from "../../utils/soundEffects";

export const IsabellaTerminal: React.FC = () => {
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
  } = useCrown();

  const handleClear = () => {
    soundManager.playBeep(450, 0.04);
    clearMessages();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-145px)] min-h-[580px] max-h-[900px] rounded-3xl border border-slate-800/90 bg-[#050A14]/90 shadow-2xl backdrop-blur-2xl overflow-hidden transition-all">
      {/* Terminal HUD Title Bar - Enterprise Petrol & Platinum */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-b border-slate-800/80 bg-[#081324]/90">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 border border-red-400/40" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 border border-amber-400/40" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 border border-emerald-400/40" />
          </div>

          <div className="h-4 w-px bg-slate-800" />

          <div className="flex items-center gap-2">
            <TerminalIcon className="w-4 h-4 text-sky-400" />
            <span className="font-mono text-xs font-bold text-[#F8FAFC] tracking-wider">
              TERMINAL COGNITIVA :: ISABELLA VILLASEÑOR
            </span>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/30 font-semibold">
              CROWN v4.2
            </span>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              soundManager.playBeep(800, 0.04);
              openWelcomeModal();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold border border-amber-400 text-xs font-mono transition-all active:scale-95 shadow-md shadow-amber-950/40 cursor-pointer"
            title="Abrir guía amigable de bienvenida"
          >
            <Sparkles className="w-3.5 h-3.5 text-slate-950" />
            <span>Guía de Inicio</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundManager.playBeep(850, 0.03);
              openShortcutsModal();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#0B1A2E] hover:bg-blue-950/60 text-sky-300 hover:text-white border border-blue-500/30 text-xs font-mono transition-all active:scale-95 cursor-pointer font-bold"
            title="Atajos de teclado rápidos (Ctrl+/ o ?)"
          >
            <Keyboard className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Atajos</span>
            <kbd className="hidden md:inline px-1 py-0.2 rounded bg-slate-900 text-[10px] text-slate-300 border border-slate-700">?</kbd>
          </button>

          <button
            type="button"
            onClick={triggerManualDiagnostic}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#081324] hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-mono transition-all active:scale-95"
            title="Ejecutar diagnóstico de subsistemas (Ctrl+Shift+D)"
          >
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">Diagnóstico</span>
          </button>

          <button
            type="button"
            onClick={toggleSpeechSynthesis}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-all active:scale-95 ${
              state.speechSynthesisEnabled
                ? "bg-amber-950/40 border-amber-500/40 text-amber-300"
                : "bg-[#081324] border-slate-800 text-slate-400 hover:text-slate-200"
            }`}
            title="Activar/Silenciar narración por voz (Ctrl+Shift+V)"
          >
            <Volume2 className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">
              {state.speechSynthesisEnabled ? "Voz Activa" : "Voz Mute"}
            </span>
          </button>

          <button
            type="button"
            onClick={toggleSound}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-all active:scale-95 ${
              state.soundEnabled
                ? "bg-blue-950/40 border-blue-500/40 text-sky-300"
                : "bg-[#081324] border-slate-800 text-slate-400 hover:text-slate-200"
            }`}
            title="Activar/Desactivar efectos sintéticos (Ctrl+Shift+F)"
          >
            {state.soundEnabled ? (
              <span className="text-sky-300">FX ON</span>
            ) : (
              <span className="text-slate-400">FX OFF</span>
            )}
          </button>

          <button
            type="button"
            onClick={handleClear}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#081324] hover:bg-red-950/40 text-slate-400 hover:text-red-300 border border-slate-800 hover:border-red-500/30 text-xs font-mono transition-all active:scale-95"
            title="Limpiar pantalla y reiniciar terminal (Ctrl+K o ⌘+K)"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden lg:inline text-[11px]">Limpiar</span>
            <kbd className="hidden lg:inline px-1 py-0.2 rounded bg-slate-900 text-[10px] text-slate-400 border border-slate-700">^K</kbd>
          </button>
        </div>
      </div>

      {/* Real-time Waveform Carrier Header */}
      <div className="px-5 pt-3 pb-2 bg-[#060C17]/80 border-b border-slate-800/40">
        <NeuralWaveform height={42} showLabels />
      </div>

      {/* Main Terminal Message Stream */}
      <div className="flex-1 overflow-hidden p-5 flex flex-col bg-transparent">
        <MessageStream messages={messages} />
      </div>

      {/* Bottom Command Prompt Shell */}
      <div className="p-4 pt-1 bg-[#060C17]/95 border-t border-slate-800/80">
        <TerminalCommandLine />
      </div>
    </div>
  );
};
