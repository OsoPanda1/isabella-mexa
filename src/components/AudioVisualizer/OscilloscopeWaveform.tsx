import React, { useEffect, useRef, useState } from "react";
import { useCrown } from "../../context/CrownContext";
import { Activity, Radio, Sparkles, Volume2, Waves } from "lucide-react";

export type OscilloscopeMode = "beam" | "spectrum" | "harmonic" | "particles";

interface OscilloscopeWaveformProps {
  height?: number;
  className?: string;
  showControls?: boolean;
  compact?: boolean;
  variant?: "terminal" | "footer" | "standalone";
}

export const OscilloscopeWaveform: React.FC<OscilloscopeWaveformProps> = ({
  height = 54,
  className = "",
  showControls = true,
  compact = false,
  variant = "terminal",
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { state, activeModuleId } = useCrown();
  const { isProcessing, isSpeaking, isListening, speechSynthesisEnabled } = state;
  const [visualMode, setVisualMode] = useState<OscilloscopeMode>("harmonic");

  const isActive = isProcessing || isSpeaking || isListening;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let phase = 0;
    let pulseAngle = 0;

    // Simulated FFT frequency bins for audio animation
    const numBars = 48;
    const spectrumBars: number[] = Array(numBars).fill(0.1);
    const particles: Array<{ x: number; y: number; vx: number; vy: number; size: number; alpha: number; hue: number }> = [];

    // Initialize decorative particles
    for (let i = 0; i < 28; i++) {
      particles.push({
        x: Math.random() * 800,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 0.8,
        size: Math.random() * 2.5 + 1,
        alpha: Math.random() * 0.7 + 0.3,
        hue: 280 + Math.random() * 60,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const h = canvas.height;
      const centerY = h / 2;

      // Dynamic Color Scheme based on active state and cognitive module - Enterprise Palette
      let primaryHue = 215; // Electric Blue
      let secondaryHue = 45; // Champagne Gold
      let stateLabel = "RESONANCIA EN REPOSO";

      if (isSpeaking) {
        primaryHue = 42; // Champagne Gold for voice synthesis
        secondaryHue = 210; // Electric Blue
        stateLabel = "SÍNTESIS DE AUDIO VOCAL ACTIVA";
      } else if (isProcessing) {
        if (activeModuleId === "ISA") {
          primaryHue = 345;
          secondaryHue = 40;
        } else if (activeModuleId === "SOPHIA") {
          primaryHue = 195;
          secondaryHue = 215;
        } else if (activeModuleId === "ORION") {
          primaryHue = 42;
          secondaryHue = 35;
        } else if (activeModuleId === "ARGUS") {
          primaryHue = 155;
          secondaryHue = 175;
        } else {
          primaryHue = 215;
          secondaryHue = 45;
        }
        stateLabel = `PROCESAMIENTO COGNITIVO :: [${activeModuleId || "CROWN"}]`;
      } else if (isListening) {
        primaryHue = 0; // Red/Amber for mic
        secondaryHue = 35;
        stateLabel = "RECEPTOR ACÚSTICO ACTIVO";
      }

      // Energy & Frequency parameters
      const energy = isSpeaking ? 1.8 : isProcessing ? 1.5 : isListening ? 1.3 : 0.4;
      const speed = isSpeaking ? 0.11 : isProcessing ? 0.09 : isListening ? 0.07 : 0.025;
      phase += speed;
      pulseAngle += 0.05;

      // 1. Background Grid & Oscilloscope Reticle
      ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
      ctx.lineWidth = 1;
      const gridStep = 32;
      for (let x = 0; x < width; x += gridStep) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 16) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. Render according to selected Visual Mode
      if (visualMode === "spectrum") {
        // --- SPECTRUM ANALYZER BARS MODE ---
        const barWidth = width / numBars - 2;
        for (let i = 0; i < numBars; i++) {
          const target = isActive
            ? Math.abs(Math.sin(phase * 2 + i * 0.4) * Math.cos(phase * 0.8 + i * 0.2)) * (0.85 + Math.random() * 0.25)
            : 0.12 + Math.sin(phase + i * 0.2) * 0.08;

          // Smooth interpolation
          spectrumBars[i] += (target - spectrumBars[i]) * 0.25;

          const barHeight = Math.max(4, spectrumBars[i] * (h * 0.8) * energy);
          const x = i * (barWidth + 2) + 1;
          const y = centerY - barHeight / 2;

          const barHue = primaryHue + (i / numBars) * 40;
          const grad = ctx.createLinearGradient(0, y, 0, y + barHeight);
          grad.addColorStop(0, `hsla(${barHue}, 90%, 65%, ${isActive ? 0.9 : 0.4})`);
          grad.addColorStop(0.5, `hsla(${secondaryHue}, 80%, 55%, ${isActive ? 0.7 : 0.3})`);
          grad.addColorStop(1, `hsla(${barHue}, 90%, 65%, ${isActive ? 0.9 : 0.4})`);

          ctx.fillStyle = grad;
          ctx.fillRect(x, y, barWidth, barHeight);

          // Top peak led
          if (isActive) {
            ctx.fillStyle = `hsla(${barHue}, 100%, 80%, 0.95)`;
            ctx.fillRect(x, y - 2, barWidth, 1.5);
            ctx.fillRect(x, y + barHeight + 0.5, barWidth, 1.5);
          }
        }
      } else if (visualMode === "beam") {
        // --- HIGH RESOLUTION OSCILLOSCOPE BEAM MODE ---
        ctx.save();
        ctx.shadowColor = `hsla(${primaryHue}, 90%, 60%, 0.8)`;
        ctx.shadowBlur = isActive ? 16 : 6;

        // Trace multi-pass beam for analog phosphor look
        const passes = [
          { alpha: 0.3, width: 6, blur: 14 },
          { alpha: 0.7, width: 2.5, blur: 6 },
          { alpha: 1.0, width: 1.2, blur: 2 },
        ];

        for (const pass of passes) {
          ctx.beginPath();
          ctx.strokeStyle = `hsla(${primaryHue}, 95%, 70%, ${pass.alpha * (isActive ? 1 : 0.5)})`;
          ctx.lineWidth = pass.width;

          for (let x = 0; x < width; x += 2) {
            const normX = x / width;
            const envelope = Math.sin(normX * Math.PI); // Window function
            
            // Audio wave equations
            const f1 = Math.sin(normX * 24 + phase * 2.2);
            const f2 = Math.sin(normX * 48 - phase * 3.1) * 0.4;
            const f3 = isSpeaking ? Math.sin(normX * 96 + phase * 4.5) * 0.2 : 0;
            const noise = (Math.random() - 0.5) * (isActive ? 4 : 0.8);

            const y = centerY + (f1 + f2 + f3) * (h * 0.38) * energy * envelope + noise;

            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
        ctx.restore();
      } else if (visualMode === "particles") {
        // --- RESONANCE PARTICLES / QUANTUM FIELD MODE ---
        // Center wave line
        ctx.beginPath();
        ctx.strokeStyle = `hsla(${primaryHue}, 80%, 60%, ${isActive ? 0.6 : 0.2})`;
        ctx.lineWidth = 1.5;
        for (let x = 0; x < width; x += 4) {
          const normX = x / width;
          const envelope = Math.sin(normX * Math.PI);
          const y = centerY + Math.sin(normX * 16 + phase * 1.5) * (h * 0.3) * energy * envelope;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Particles
        for (const p of particles) {
          p.x += p.vx * (isActive ? 2.5 : 1);
          p.y += p.vy * (isActive ? 2.5 : 1);

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = h;
          if (p.y > h) p.y = 0;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * (isActive ? 1.4 : 1), 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${primaryHue + Math.sin(phase + p.x) * 30}, 90%, 70%, ${p.alpha * (isActive ? 0.9 : 0.4)})`;
          ctx.shadowColor = `hsla(${primaryHue}, 90%, 60%, 0.6)`;
          ctx.shadowBlur = 8;
          ctx.fill();
        }
      } else {
        // --- DEFAULT: DUAL HARMONIC SINE OSCILLOSCOPE ---
        // Secondary harmonic wave
        ctx.beginPath();
        ctx.strokeStyle = `hsla(${secondaryHue}, 85%, 65%, ${isActive ? 0.65 : 0.25})`;
        ctx.lineWidth = 1.6;
        for (let x = 0; x < width; x += 2) {
          const normX = x / width;
          const envelope = Math.sin(normX * Math.PI);
          const wave = Math.sin(normX * 14 + phase * 1.0) * Math.cos(normX * 8 - phase * 0.6);
          const y = centerY + wave * (h * 0.32) * energy * envelope;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Tertiary harmonic counter-wave
        ctx.beginPath();
        ctx.strokeStyle = `hsla(${primaryHue + 40}, 80%, 75%, ${isActive ? 0.45 : 0.15})`;
        ctx.lineWidth = 1.2;
        for (let x = 0; x < width; x += 3) {
          const normX = x / width;
          const envelope = Math.sin(normX * Math.PI);
          const wave = Math.cos(normX * 20 - phase * 1.4) * Math.sin(normX * 6 + phase * 0.4);
          const y = centerY + wave * (h * 0.25) * energy * envelope;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Primary resonant carrier wave with glow
        ctx.save();
        ctx.shadowColor = `hsla(${primaryHue}, 95%, 65%, ${isActive ? 0.9 : 0.3})`;
        ctx.shadowBlur = isActive ? 14 : 5;
        ctx.beginPath();
        ctx.strokeStyle = `hsla(${primaryHue}, 95%, 70%, ${isActive ? 0.95 : 0.5})`;
        ctx.lineWidth = isActive ? 2.5 : 1.8;

        for (let x = 0; x < width; x += 2) {
          const normX = x / width;
          const envelope = Math.sin(normX * Math.PI);
          const w1 = Math.sin(normX * 18 + phase * 1.6);
          const w2 = Math.sin(normX * 36 - phase * 2.4) * (isSpeaking ? 0.45 : 0.3);
          const w3 = isSpeaking ? Math.sin(normX * 72 + phase * 3.8) * 0.2 : 0;
          const noise = (Math.random() - 0.5) * (isActive ? 3.5 : 0.6);

          const y = centerY + (w1 + w2 + w3) * (h * 0.36) * energy * envelope + noise;

          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.restore();
      }

      // Center Reference Baseline
      ctx.beginPath();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      ctx.setLineDash([4, 4]);
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.stroke();
      ctx.setLineDash([]);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isActive, isProcessing, isSpeaking, isListening, activeModuleId, visualMode, height]);

  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl border transition-all duration-300 backdrop-blur-xl ${
        isActive
          ? isSpeaking
            ? "border-pink-500/50 bg-slate-950/90 shadow-lg shadow-pink-500/10 ring-1 ring-pink-500/30"
            : "border-purple-500/50 bg-slate-950/90 shadow-lg shadow-purple-500/10 ring-1 ring-purple-500/30"
          : "border-slate-800/80 bg-slate-950/60"
      } ${className}`}
    >
      {/* Top HUD Telemetry Banner */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-900 text-[11px] font-mono">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span
              className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${
                isSpeaking
                  ? "bg-pink-400"
                  : isProcessing
                  ? "bg-purple-400"
                  : isListening
                  ? "bg-amber-400"
                  : "bg-emerald-400"
              }`}
            />
            <span
              className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                isSpeaking
                  ? "bg-pink-500"
                  : isProcessing
                  ? "bg-purple-500"
                  : isListening
                  ? "bg-amber-500"
                  : "bg-emerald-500"
              }`}
            />
          </span>

          <span
            className={`font-semibold tracking-wider uppercase transition-colors text-[10px] sm:text-xs ${
              isSpeaking
                ? "text-pink-300 animate-pulse"
                : isProcessing
                ? "text-purple-300"
                : isListening
                ? "text-amber-300"
                : "text-slate-300"
            }`}
          >
            {isSpeaking
              ? "🔊 SALIDA DE AUDIO :: SINTETIZANDO VOZ DE ISABELLA"
              : isProcessing
              ? `⚡ PROCESANDO COGNICIÓN :: [${activeModuleId || "CROWN"}]`
              : isListening
              ? "🎙️ MICRÓFONO ACTIVO :: ESCUCHANDO..."
              : "OSCILOSCOPIO CROWN :: CARRIER WAVE EN FASE"}
          </span>
        </div>

        {/* Right Mode Switchers & Sampling Info */}
        <div className="flex items-center gap-2">
          {!compact && (
            <div className="hidden sm:flex items-center gap-2 text-[10px] text-slate-400 font-mono">
              <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                {isSpeaking ? "TTS: 48kHz" : isProcessing ? "NEURAL: 120Hz" : "STANDBY"}
              </span>
            </div>
          )}

          {showControls && (
            <div className="flex items-center gap-1 bg-[#081220] p-0.5 rounded-lg border border-slate-800 text-[10px]">
              <button
                type="button"
                onClick={() => setVisualMode("harmonic")}
                className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                  visualMode === "harmonic"
                    ? "bg-blue-600 text-white font-bold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
                title="Modo Ondas Armónicas"
              >
                <Waves className="w-3 h-3 inline" />
              </button>
              <button
                type="button"
                onClick={() => setVisualMode("beam")}
                className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                  visualMode === "beam"
                    ? "bg-blue-600 text-white font-bold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
                title="Modo Haz Láser de Osciloscopio"
              >
                <Activity className="w-3 h-3 inline" />
              </button>
              <button
                type="button"
                onClick={() => setVisualMode("spectrum")}
                className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                  visualMode === "spectrum"
                    ? "bg-blue-600 text-white font-bold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
                title="Modo Espectro FFT"
              >
                <Radio className="w-3 h-3 inline" />
              </button>
              <button
                type="button"
                onClick={() => setVisualMode("particles")}
                className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                  visualMode === "particles"
                    ? "bg-blue-600 text-white font-bold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
                title="Modo Campo Cuántico"
              >
                <Sparkles className="w-3 h-3 inline" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Canvas Waveform */}
      <div className="relative p-1">
        <canvas
          ref={canvasRef}
          width={800}
          height={height}
          className="w-full block rounded-xl"
          style={{ height: `${height}px` }}
        />

        {/* Ambient Overlay Glint on Active Audio Output */}
        {isSpeaking && (
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-pink-500/10 to-transparent animate-pulse" />
        )}
      </div>
    </div>
  );
};
