import React, { useEffect, useRef, useState } from "react";
import { useCrown } from "../../context/CrownContext";
import { Sparkles, Play, Volume2, VolumeX, X, ChevronRight } from "lucide-react";
import { soundManager } from "../../utils/soundEffects";
import { ISABELLA_MEDALLION_IMAGE } from "../../data/isabellaAvatar";

interface IsabellaCinematicTrailerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IsabellaCinematicTrailer: React.FC<IsabellaCinematicTrailerProps> = ({
  isOpen,
  onClose,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0); // 0 to 16 seconds
  const [audioMuted, setAudioMuted] = useState<boolean>(false);
  const [isTransitioningUI, setIsTransitioningUI] = useState<boolean>(false);
  const { speakText } = useCrown();

  // Audio Context Ref for 60Hz Sub-bass Rumble & Atmospheric Synth
  const audioCtxRef = useRef<AudioContext | null>(null);
  const subBassOscRef = useRef<OscillatorNode | null>(null);
  const subBassGainRef = useRef<GainNode | null>(null);

  // Synchronized voice narration lock
  const hasSpokenRef = useRef<boolean>(false);

  useEffect(() => {
    if (!isOpen) {
      setElapsedTime(0);
      setIsTransitioningUI(false);
      hasSpokenRef.current = false;
      stopSubBassSound();
      return;
    }

    // Start 60Hz Sub-bass Audio Synth
    startSubBassSound();

    // 16-second animation timer tick (60 FPS)
    const startTime = Date.now();
    const interval = setInterval(() => {
      const seconds = (Date.now() - startTime) / 1000;
      setElapsedTime(seconds);

      // Trigger synchronized voice locution at 0:04s (duration ~5s: 17 words, 3.4 words/sec)
      if (seconds >= 3.8 && seconds <= 9.0 && !hasSpokenRef.current) {
        hasSpokenRef.current = true;
        try {
          speakText(
            "Infraestructura cognitiva territorial concebida en Real del Monte. Soberanía, elegancia y tecnología para un futuro humano.",
            { pitch: 1.05, rate: 0.95 }
          );
        } catch {}
      }

      // Block 4 (13s - 16s): Initiate smooth-motion transition to UI
      if (seconds >= 13.0 && !isTransitioningUI) {
        setIsTransitioningUI(true);
      }

      // Auto-complete at 16s
      if (seconds >= 16.0) {
        clearInterval(interval);
        handleComplete();
      }
    }, 1000 / 60);

    // Keyboard ESC shortcut to skip
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleSkip();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearInterval(interval);
      window.removeEventListener("keydown", handleKeyDown);
      stopSubBassSound();
    };
  }, [isOpen]);

  // Canvas 60fps Particle & Fog Engine (Hidalgo Topography + Real del Monte Mist)
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Particle Array
    const particles = Array.from({ length: 60 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.5 + 0.5,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: -Math.random() * 0.5 - 0.2,
      alpha: Math.random() * 0.6 + 0.2,
    }));

    let stepCounter = 0;

    const render = () => {
      stepCounter += 0.015;
      ctx.clearRect(0, 0, width, height);

      // Deep Dark Luxury Gradient background (#030712 to #070F1E)
      const bgGrad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        50,
        width / 2,
        height / 2,
        Math.max(width, height)
      );
      bgGrad.addColorStop(0, "#081326");
      bgGrad.addColorStop(0.5, "#040914");
      bgGrad.addColorStop(1, "#020409");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 1. Topographic Elevation Lines of Hidalgo Mountains (0:00 - 0:08s)
      ctx.lineWidth = 1;
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        const yOffset = height * 0.65 + i * 40;
        ctx.strokeStyle = `rgba(217, 119, 6, ${0.12 - i * 0.02})`;
        for (let x = 0; x <= width; x += 20) {
          const wave =
            Math.sin(x * 0.004 + stepCounter + i) * 25 +
            Math.cos(x * 0.008 - stepCounter * 0.5) * 15;
          if (x === 0) ctx.moveTo(x, yOffset + wave);
          else ctx.lineTo(x, yOffset + wave);
        }
        ctx.stroke();
      }

      // 2. Real del Monte Volumetric Mist (Niebla Mística)
      const fogGrad = ctx.createLinearGradient(0, height, 0, height * 0.4);
      fogGrad.addColorStop(0, "rgba(11, 28, 48, 0.45)");
      fogGrad.addColorStop(0.5, "rgba(7, 17, 32, 0.25)");
      fogGrad.addColorStop(1, "rgba(2, 4, 9, 0)");
      ctx.fillStyle = fogGrad;
      ctx.fillRect(0, height * 0.3, width, height * 0.7);

      // 3. Floating Champagne Gold & Sapphire Stardust Particles
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.y < 0) p.y = height;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(251, 191, 36, ${p.alpha * 0.7})`;
        ctx.shadowColor = "#F59E0B";
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [isOpen]);

  // Web Audio Sub-Bass Sound Generator (60Hz Sub-bass rumble + Sub-synth)
  const startSubBassSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      // 60Hz Sub-bass Sine Oscillator
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(60, ctx.currentTime); // 60 Hz deep sub-bass

      // Gentle gain ramp-in
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 2.0);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      subBassOscRef.current = osc;
      subBassGainRef.current = gain;
    } catch {}
  };

  const stopSubBassSound = () => {
    try {
      if (subBassGainRef.current && audioCtxRef.current) {
        subBassGainRef.current.gain.exponentialRampToValueAtTime(
          0.0001,
          audioCtxRef.current.currentTime + 0.8
        );
      }
      setTimeout(() => {
        subBassOscRef.current?.stop();
        subBassOscRef.current?.disconnect();
        audioCtxRef.current?.close();
        audioCtxRef.current = null;
      }, 900);
    } catch {}
  };

  const handleSkip = () => {
    soundManager.playBeep(900, 0.04);
    stopSubBassSound();
    onClose();
  };

  const handleComplete = () => {
    stopSubBassSound();
    onClose();
  };

  if (!isOpen) return null;

  // Timed visibility states
  const showBlock1 = elapsedTime >= 0; // Topography & Mist
  const showBlock2 = elapsedTime >= 3.5; // Hummingbird Medallion & Voice Locution
  const showTextOrgullosamente = elapsedTime >= 9.0; // 0:09s Text @ 50% opacity
  const showTextInternetEtico = elapsedTime >= 11.0; // 0:11s Text fade-in

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020409] text-white overflow-hidden font-sans select-none animate-fade-in">
      {/* WebGL / HTML5 Canvas Ambient Particle Engine (60 FPS) */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />

      {/* Top Header Controls: Skip Intro & Audio Toggle */}
      <div className="absolute top-6 right-6 z-50 flex items-center gap-3">
        <button
          type="button"
          onClick={() => setAudioMuted(!audioMuted)}
          className="p-2.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700/80 backdrop-blur-md transition-all cursor-pointer shadow-lg"
          title={audioMuted ? "Activar audio" : "Silenciar audio"}
        >
          {audioMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
        </button>

        <button
          type="button"
          onClick={handleSkip}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/80 backdrop-blur-md text-xs font-mono font-bold transition-all active:scale-95 cursor-pointer shadow-xl"
        >
          <span>Saltar Presentación</span>
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-amber-300 border border-slate-700">ESC</kbd>
          <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
        </button>
      </div>

      {/* Main Cinematic Stage Overlay */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center flex flex-col items-center justify-center space-y-8">
        
        {/* Block 1 & 2: Hummingbird Medallion (Colibrí Mecánico de Oro y Platino) */}
        <div
          className={`transition-all duration-1000 ease-out transform ${
            showBlock2
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-90 translate-y-8"
          } ${
            isTransitioningUI
              ? "-translate-y-36 scale-40 opacity-0 transition-all duration-1000 ease-in-out"
              : ""
          }`}
        >
          {/* Gold Glowing Medallion Container */}
          <div className="relative group inline-flex items-center justify-center p-3 rounded-full bg-gradient-to-b from-amber-400/20 via-slate-800/80 to-amber-600/30 border border-amber-400/50 shadow-[0_0_60px_rgba(245,158,11,0.35)] backdrop-blur-2xl">
            <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden border-2 border-amber-300/80 shadow-2xl relative">
              <img
                src={ISABELLA_MEDALLION_IMAGE}
                alt="Isabella AI - Colibrí Mecánico de Oro"
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
              />
              {/* Radial Aura Glow */}
              <div className="absolute inset-0 bg-radial from-amber-400/10 via-transparent to-black/40 pointer-events-none" />
            </div>

            {/* Pulsing Light Ring */}
            <div className="absolute -inset-1.5 rounded-full bg-amber-400/20 blur-md animate-pulse pointer-events-none" />
          </div>
        </div>

        {/* Brand Header: ISABELLA AI */}
        <div
          className={`space-y-2 transition-all duration-700 delay-100 ${
            showBlock2
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6"
          } ${isTransitioningUI ? "opacity-0 transition-opacity duration-500" : ""}`}
        >
          <div className="flex items-center justify-center gap-3">
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-widest text-slate-100 font-sans uppercase">
              ISABELLA <span className="text-amber-400 font-serif italic text-2xl sm:text-4xl">AI</span>
            </h1>
          </div>
          <p className="text-xs sm:text-sm font-mono text-slate-400 tracking-wider uppercase">
            TAMV ONLINE — un futuro más humano y elegante.
          </p>
        </div>

        {/* Block 3 (0:09s): ORGULLOSAMENTE REALMONTENSES @ 50% Opacity */}
        <div
          className={`transition-all duration-700 ease-in-out ${
            showTextOrgullosamente
              ? "opacity-50 translate-y-0"
              : "opacity-0 translate-y-4"
          } ${isTransitioningUI ? "opacity-0" : ""}`}
        >
          <div className="text-xs sm:text-sm font-serif italic tracking-widest text-amber-200 uppercase font-semibold">
            — by TAMV ONLINE —
          </div>
          <div className="text-lg sm:text-2xl font-serif italic tracking-wide text-amber-300 mt-1">
            Orgullosamente Realmontenses
          </div>
        </div>

        {/* Block 3 (0:11s): Fade-in of "Un internet más ético, más seguro y más humano" */}
        <div
          className={`transition-all duration-1000 ease-in-out ${
            showTextInternetEtico
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95"
          } ${isTransitioningUI ? "opacity-0" : ""}`}
        >
          <div className="px-6 py-2.5 rounded-full bg-slate-900/80 border border-amber-500/30 text-xs sm:text-sm font-mono text-amber-200/90 shadow-xl backdrop-blur-xl">
            <Sparkles className="w-4 h-4 text-amber-400 inline mr-2" />
            <span>Un internet más ético, más seguro y más humano</span>
          </div>
        </div>

      </div>

      {/* Bottom Chronometer Bar (0 to 16s Progress) */}
      <div className="absolute bottom-6 left-8 right-8 z-50 flex flex-col gap-1.5 max-w-3xl mx-auto font-mono text-[10px] text-slate-400">
        <div className="flex justify-between items-center px-1">
          <span className="text-amber-400 font-bold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            SECUENCIA CINEMATOGRÁFICA AAA
          </span>
          <span>{elapsedTime.toFixed(1)}s / 16.0s</span>
        </div>
        <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-sky-400 to-amber-300 transition-all duration-75"
            style={{ width: `${Math.min(100, (elapsedTime / 16.0) * 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};
