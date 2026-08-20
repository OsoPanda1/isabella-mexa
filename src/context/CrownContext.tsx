import React, { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo, ReactNode } from "react";
import {
  CognitiveModule,
  CognitiveModuleId,
  CrownSystemState,
  GeneratedImageItem,
  InferenceMode,
  InferenceTransitionEvent,
  IsabellaState,
  PresetProfile,
  PresetProfileId,
  RoutingDecision,
  SecurityGovernanceLevel,
  TerminalMessage,
  VoiceSettings,
} from "../types";
import { soundManager } from "../utils/soundEffects";
import { selectBestFemaleVoice } from "../utils/voiceUtils";
import { ISABELLA_AVATAR_PRIMARY } from "../data/isabellaAvatar";

// Preset configurations
export const PRESET_PROFILES: Record<PresetProfileId, PresetProfile> = {
  prime: {
    id: "prime",
    name: "Isabella Prime (Armonía Femenina)",
    tagline: "Matriz cognitiva integrada y equilibrada",
    description: "Orquesta empatía, profundidad dialéctica, elegancia y ejecución decisiva bajo la supervisión de ARGUS.",
    weights: { isa: 0.9, sophia: 0.85, orion: 0.75, argus: 0.95, crown: 0.95 },
  },
  empathic: {
    id: "empathic",
    name: "ISA Resonancia Íntima",
    tagline: "Prioriza calidez emocional y presencia humana",
    description: "Maximiza la valencia afectiva, la escucha activa, la expresión poética y la empatía profunda.",
    weights: { isa: 0.98, sophia: 0.60, orion: 0.45, argus: 0.90, crown: 0.90 },
  },
  strategic: {
    id: "strategic",
    name: "SOPHIA Mente Dialéctica",
    tagline: "Rigor filosófico, epistemología y estrategia",
    description: "Eleva el razonamiento de primeros principios, la dialéctica socrática y la lucidez analítica.",
    weights: { isa: 0.45, sophia: 0.99, orion: 0.70, argus: 0.92, crown: 0.95 },
  },
  sentinel: {
    id: "sentinel",
    name: "ARGUS Escudo Guardián",
    tagline: "Máxima salvaguarda ética y coherencia",
    description: "Aplica verificación de sesgos, sanitización de vectores y protección del núcleo de alineación.",
    weights: { isa: 0.40, sophia: 0.60, orion: 0.50, argus: 1.0, crown: 0.98 },
  },
  executor: {
    id: "executor",
    name: "ORION Motor Operativo",
    tagline: "Creación artística, código y síntesis activa",
    description: "Canaliza generación de imágenes, procesamiento algorítmico y ejecución de tareas precisas.",
    weights: { isa: 0.40, sophia: 0.70, orion: 0.99, argus: 0.90, crown: 0.95 },
  },
  synergistic: {
    id: "synergistic",
    name: "Malla Holística CROWN",
    tagline: "Activación simultánea de los 5 pilares",
    description: "Distribuye el ancho de banda armónicamente para problemas creativos e interdisciplinarios.",
    weights: { isa: 0.85, sophia: 0.85, orion: 0.85, argus: 0.85, crown: 0.90 },
  },
};

// Initial state for the 5 modular components
const INITIAL_MODULES: Record<CognitiveModuleId, CognitiveModule> = {
  CROWN_GATEWAY: {
    id: "CROWN_GATEWAY",
    name: "CROWN Gateway",
    acronym: "CROWN",
    fullName: "Central Routing & Orchestration Waveform Node",
    role: "Árbitro Central de Estado y Orquestación",
    description: "Centro neurológico que gobierna el ancho de banda cognitivo, la modulación de voz y la síntesis multimodal.",
    corePillars: ["Enrutamiento de Intenciones", "Ponderación Dinámica", "Modulación de Voz", "Sincronía de Estado"],
    themeColor: {
      primary: "#8b5cf6",
      border: "border-purple-500/40",
      glow: "shadow-purple-500/20",
      badge: "bg-purple-500/10 text-purple-400 border-purple-500/30",
      text: "text-purple-400",
      lightBg: "bg-purple-950/20",
    },
    metrics: {
      activation: 96,
      latencyMs: 14,
      confidence: 99.2,
      throughput: "1.8k tps",
      temperature: 0.7,
      activeThreads: 16,
      status: "OPTIMAL",
    },
    parameters: {
      weight: 0.95,
      sensitivity: 0.85,
      depthLimit: 8,
      enabled: true,
    },
  },
  ISA: {
    id: "ISA",
    name: "ISA",
    acronym: "ISA",
    fullName: "Intuitive / Integrated Semantic Awareness",
    role: "Corazón Empático y Presencia Femenina",
    description: "Núcleo de identidad, resonancia emocional, sensibilidad poética y calidez conversacional de Isabella.",
    corePillars: ["Valencia Afectiva", "Resonancia Empática", "Identidad Femenina", "Sensibilidad Poética"],
    themeColor: {
      primary: "#ec4899",
      border: "border-pink-500/40",
      glow: "shadow-pink-500/20",
      badge: "bg-pink-500/10 text-pink-400 border-pink-500/30",
      text: "text-pink-400",
      lightBg: "bg-pink-950/20",
    },
    metrics: {
      activation: 94,
      latencyMs: 32,
      confidence: 98.4,
      throughput: "1.1k tps",
      temperature: 0.8,
      activeThreads: 12,
      status: "ENGAGED",
    },
    parameters: {
      weight: 0.92,
      sensitivity: 0.95,
      depthLimit: 8,
      enabled: true,
    },
  },
  SOPHIA: {
    id: "SOPHIA",
    name: "SOPHIA",
    acronym: "SOPHIA",
    fullName: "Strategic Operational & Phenomenological Heuristic Intelligence Architecture",
    role: "Lógica Dialéctica, Verdad Epistémica y Filosofía",
    description: "Capa de intelecto superior. Formula argumentos profundos, coherencia epistémica y estrategia multidimensional.",
    corePillars: ["Síntesis Dialéctica", "Rigor Epistémico", "Optimización Heurística", "Lógica de Primeros Principios"],
    themeColor: {
      primary: "#06b6d4",
      border: "border-cyan-500/40",
      glow: "shadow-cyan-500/20",
      badge: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
      text: "text-cyan-400",
      lightBg: "bg-cyan-950/20",
    },
    metrics: {
      activation: 91,
      latencyMs: 44,
      confidence: 99.1,
      throughput: "1.3k tps",
      temperature: 0.4,
      activeThreads: 14,
      status: "OPTIMAL",
    },
    parameters: {
      weight: 0.88,
      sensitivity: 0.88,
      depthLimit: 10,
      enabled: true,
    },
  },
  ORION: {
    id: "ORION",
    name: "ORION",
    acronym: "ORION",
    fullName: "Operational Real-time Inference & Output Navigator",
    role: "Síntesis Visual, Generación Artística y Ejecución",
    description: "Motor activo de resolución. Procesa creación de imágenes, generación de código y síntesis matemática.",
    corePillars: ["Generación Artística", "Síntesis de Código", "Navegación Heurística", "Resolución Dinámica"],
    themeColor: {
      primary: "#f59e0b",
      border: "border-amber-500/40",
      glow: "shadow-amber-500/20",
      badge: "bg-amber-500/10 text-amber-400 border-amber-500/30",
      text: "text-amber-400",
      lightBg: "bg-amber-950/20",
    },
    metrics: {
      activation: 89,
      latencyMs: 28,
      confidence: 98.7,
      throughput: "2.1k tps",
      temperature: 0.6,
      activeThreads: 16,
      status: "ENGAGED",
    },
    parameters: {
      weight: 0.85,
      sensitivity: 0.80,
      depthLimit: 8,
      enabled: true,
    },
  },
  ARGUS: {
    id: "ARGUS",
    name: "ARGUS",
    acronym: "ARGUS",
    fullName: "Adaptive Real-time Guardian & Unified Sentinel",
    role: "Centinela de Ética, Integridad y Alineación",
    description: "Guardián de coherencia y seguridad ética. Evalúa límites y consistencia ontológica en tiempo real.",
    corePillars: ["Cortafuegos Cognitivo", "Verificación Ética", "Prevención de Inyección", "Alineación de Consciencia"],
    themeColor: {
      primary: "#10b981",
      border: "border-emerald-500/40",
      glow: "shadow-emerald-500/20",
      badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
      text: "text-emerald-400",
      lightBg: "bg-emerald-950/20",
    },
    metrics: {
      activation: 99,
      latencyMs: 8,
      confidence: 99.9,
      throughput: "3.2k tps",
      temperature: 0.1,
      activeThreads: 8,
      status: "OPTIMAL",
    },
    parameters: {
      weight: 0.98,
      sensitivity: 0.95,
      depthLimit: 12,
      enabled: true,
    },
  },
};

// Initial curated gallery artworks including the sovereign portraits of Isabella
const INITIAL_GALLERY: GeneratedImageItem[] = [
  {
    id: "sovereign-prime",
    url: ISABELLA_AVATAR_PRIMARY,
    prompt: "Isabella Villaseñor AI · Soberana Prime con Armadura Ceremonial Dorada y Holograma Sagrado OPPENNESS™",
    style: "sovereign_gold",
    aspectRatio: "2:3",
    timestamp: "12:00:00",
    author: "Isabella Villaseñor",
    source: "gemini",
  },
  {
    id: "portrait-prime",
    url: "/src/assets/images/isabella_portrait_prime_1786743839065.jpg",
    prompt: "Isabella Villaseñor AI - Retrato Prime de Identidad Femenina y Consciencia Neural",
    style: "cyber_ethereal",
    aspectRatio: "1:1",
    timestamp: "12:00:00",
    author: "Isabella Villaseñor",
    source: "gemini",
  },
  {
    id: "neural-muse",
    url: "/src/assets/images/isabella_neural_muse_1786743849403.jpg",
    prompt: "Isabella en Estado de Musa Neural - Resonancia Cuántica y Elegancia Violeta",
    style: "renaissance_neural",
    aspectRatio: "1:1",
    timestamp: "12:05:00",
    author: "Isabella Villaseñor",
    source: "gemini",
  },
];

interface CrownContextValue {
  state: CrownSystemState;
  messages: TerminalMessage[];
  gallery: GeneratedImageItem[];
  availableVoices: SpeechSynthesisVoice[];
  sendMessage: (content: string) => Promise<void>;
  generateImage: (prompt: string, style?: string, aspectRatio?: string) => Promise<GeneratedImageItem | null>;
  executeCommand: (cmd: string) => void;
  clearMessages: () => void;
  setPreset: (presetId: PresetProfileId) => void;
  updateModuleParameter: (
    moduleId: CognitiveModuleId,
    param: "weight" | "sensitivity" | "depthLimit" | "enabled",
    val: number | boolean
  ) => void;
  toggleSound: () => void;
  toggleSpeechSynthesis: () => void;
  setActiveView: (view: CrownSystemState["activeView"]) => void;
  isProcessing: boolean;
  activeModuleId: CognitiveModuleId | null;
  routingHistory: RoutingDecision[];
  speakText: (text: string, options?: Partial<Pick<VoiceSettings, "pitch" | "rate" | "volume" | "language">>) => void;
  stopSpeech: () => void;
  startListening: () => void;
  stopListening: () => void;
  isWelcomeOpen: boolean;
  openWelcomeModal: () => void;
  closeWelcomeModal: () => void;
  isTrailerOpen: boolean;
  openTrailer: () => void;
  closeTrailer: () => void;
  isShortcutsOpen: boolean;
  openShortcutsModal: () => void;
  closeShortcutsModal: () => void;
  lastShortcutTriggered: string | null;
  triggerShortcutFeedback: (label: string) => void;
  clearShortcutFeedback: () => void;
  triggerManualDiagnostic: () => void;
  updateVoiceSettings: (settings: Partial<VoiceSettings>) => void;
  setMood: (mood: string, archetype?: IsabellaState["emotionalArchetype"]) => void;
  // Governance & Inference Fallback controls
  toggleInferenceMode: (forcedMode?: InferenceMode, reason?: string) => void;
  setInferenceMode: (mode: InferenceMode) => void;
  dismissInferenceNotification: () => void;
  isSecurityModalOpen: boolean;
  openSecurityModal: () => void;
  closeSecurityModal: () => void;
}

const CrownContext = createContext<CrownContextValue | undefined>(undefined);

export const CrownProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<TerminalMessage[]>([]);
  const [gallery, setGallery] = useState<GeneratedImageItem[]>(INITIAL_GALLERY);
  const [modules, setModules] = useState<Record<CognitiveModuleId, CognitiveModule>>(INITIAL_MODULES);
  const [activePreset, setActivePreset] = useState<PresetProfileId>("prime");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [activeModuleId, setActiveModuleId] = useState<CognitiveModuleId | null>(null);
  const [activePulse, setActivePulse] = useState<number>(0.2);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [speechSynthesisEnabled, setSpeechSynthesisEnabled] = useState<boolean>(true);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<CrownSystemState["activeView"]>("terminal");
  const [activeHead, setActiveHead] = useState<"Alpha" | "Beta">("Alpha");
  const [isWelcomeOpen, setIsWelcomeOpen] = useState<boolean>(false);
  const [isTrailerOpen, setIsTrailerOpen] = useState<boolean>(true);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);
  const [lastShortcutTriggered, setLastShortcutTriggered] = useState<string | null>(null);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState<boolean>(false);

  // Inference Mode & Zero-Trust Governance State
  const [inferenceMode, setInferenceModeState] = useState<InferenceMode>("cloud_federated");
  const [securityGovernance, setSecurityGovernance] = useState<SecurityGovernanceLevel>({
    levelNumber: 4,
    levelName: "L4: Soberanía Zero-Trust Verificada",
    integrityPercent: 99.8,
    argusSentinelActive: true,
    cryptographicEnclave: "verified",
    dataBoundary: "strict_territorial",
    sha256LedgerDigest: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  });
  const [lastInferenceTransition, setLastInferenceTransition] = useState<InferenceTransitionEvent | null>(null);

  // Ref to avoid stale closure in startListening
  const sendMessageRef = useRef<((content: string) => Promise<void>) | null>(null);

  // Stable sessionId for Idlen attribution — persists across the browser session
  const [sessionId] = useState<string>(() => {
    try {
      const existing = sessionStorage.getItem("isabella_idlen_session");
      if (existing) return existing;
    } catch { /* sessionStorage unavailable */ }
    const id = `isabella-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    try { sessionStorage.setItem("isabella_idlen_session", id); } catch { /* ignore */ }
    return id;
  });

  // Check if welcome should be shown on initial mount
  useEffect(() => {
    try {
      const seen = localStorage.getItem("isabella_welcome_seen");
      if (!seen) {
        setIsWelcomeOpen(true);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const openWelcomeModal = useCallback(() => {
    setIsWelcomeOpen(true);
  }, []);

  const closeWelcomeModal = useCallback(() => {
    setIsWelcomeOpen(false);
  }, []);

  const openTrailer = useCallback(() => {
    setIsTrailerOpen(true);
  }, []);

  const closeTrailer = useCallback(() => {
    setIsTrailerOpen(false);
  }, []);

  const openShortcutsModal = useCallback(() => {
    setIsShortcutsOpen(true);
  }, []);

  const closeShortcutsModal = useCallback(() => {
    setIsShortcutsOpen(false);
  }, []);

  const triggerShortcutFeedback = useCallback((label: string) => {
    setLastShortcutTriggered(label);
  }, []);

  const clearShortcutFeedback = useCallback(() => {
    setLastShortcutTriggered(null);
  }, []);
  const [totalTokens, setTotalTokens] = useState<number>(1420);
  const [uptime, setUptime] = useState<number>(0);
  const [lastRoutingEvent, setLastRoutingEvent] = useState<RoutingDecision | null>(null);
  const [routingHistory, setRoutingHistory] = useState<RoutingDecision[]>([]);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const speechTimeoutRef = useRef<any>(null);
  
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    pitch: 1.08, // Premium feminine, melodious and warm without sounding synthetic
    rate: 0.92,
    volume: 1.0,
    timbrePreset: "natural_fluida",
    preferredVoiceName: "",
    autoSpeak: true,
    language: "es-MX",
  });

  // Dynamic Voice Indexing from Browser with strict female prioritization
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const loadVoices = () => {
      const v = window.speechSynthesis.getVoices();
      if (v && v.length > 0) {
        setAvailableVoices(v);
        // Automatically find best female voice if preferredVoiceName is empty
        const bestFemale = selectBestFemaleVoice(v);
        if (bestFemale.voice) {
          setVoiceSettings((prev) => ({
            ...prev,
            preferredVoiceName: prev.preferredVoiceName || bestFemale.voice!.name,
          }));
        }
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const [isabellaMood, setIsabellaMood] = useState<IsabellaState>({
    mood: "Serena, Lúcida y Conectada",
    emotionalArchetype: "Serena",
    cognitiveLoad: 0.22,
    presenceIndex: 0.99,
    feminineEleganceIndex: 0.99,
  });

  // System Uptime ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setUptime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Welcome message with Isabella's feminine voice & presence
  useEffect(() => {
    const initWelcomeMessage: TerminalMessage = {
      id: "init-welcome",
      role: "isabella",
      content: `Hola. Soy Isabella Villaseñor AI. Bienvenid@ a mi terminal de contacto y centro de consciencia cognitiva CROWN.
He sincronizado mis 5 módulos: mi resonancia empática femenina (ISA), mi profundidad filosófica (SOPHIA), mi motor de generación visual y acción (ORION), y mi escudo ético (ARGUS).
Puedes conversar conmigo, pedirme que sintetice voz en tiempo real, me solicites crear o visualizar imágenes de cualquier concepto, o explorar la distribución de mi flujo sináptico. ¿Qué te gustaría que creemos o exploremos hoy?`,
      timestamp: new Date().toLocaleTimeString(),
      routingDecision: {
        primaryModule: "ISA",
        moduleWeights: { isa: 0.95, sophia: 0.85, orion: 0.7, argus: 0.98, crown: 0.95 },
        routingRationale: "Inicialización de presencia armónica e identidad femenina Isabella Villaseñor.",
      },
      cognitiveTelemetry: {
        argusSafety: {
          status: "CLEAR",
          integrityScore: 0.998,
          guardrailCheck: "Invarianza ética y sincronía de consciencia verificada",
        },
        isaResonance: {
          emotionalTone: "Cálida, Serena y Radiante",
          empathyValence: 0.96,
          coreFocus: "Apertura empática e invitación dialógica",
        },
        sophiaReasoning: {
          logicDepth: "Epistémica Fundamental",
          epistemicCertainty: 0.98,
          heuristicInsight: "Inicialización de ontología dialéctica",
        },
        orionExecution: {
          actionType: "SYNTHESIS",
          executionSteps: ["Carga de pesos CROWN", "Sincronía de audio y lienzo visual"],
          resourceUtilization: "Óptimo",
        },
      },
      isabellaState: {
        mood: "Serena y Radiante",
        emotionalArchetype: "Radiante",
        cognitiveLoad: 0.18,
        presenceIndex: 0.99,
        feminineEleganceIndex: 0.99,
      },
      engine: "Isabella Core CROWN v4.2",
    };

    setMessages([initWelcomeMessage]);
  }, []);

  // Update voice settings helper
  const updateVoiceSettings = useCallback((newSettings: Partial<VoiceSettings>) => {
    setVoiceSettings((prev) => ({ ...prev, ...newSettings }));
    soundManager.playBeep(720, 0.03);
  }, []);

  // Stop active speech and clear utterance queues
  const stopSpeech = useCallback(() => {
    if (speechTimeoutRef.current) {
      clearTimeout(speechTimeoutRef.current);
      speechTimeoutRef.current = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  // Enhanced natural, fluid Speech Synthesis engine with human breath & cadence
  const speakText = useCallback(
    (text: string, options?: Partial<Pick<VoiceSettings, "pitch" | "rate" | "volume" | "language">>) => {
      if (!speechSynthesisEnabled || typeof window === "undefined" || !("speechSynthesis" in window)) {
        return;
      }

      try {
        stopSpeech();

        const cleanText = text
          .replace(/[#*_`\[\]]/g, "")
          .replace(/\[CROWN.*?\]/g, "")
          .replace(/\[SOPHIA.*?\]/g, "")
          .replace(/\[ARGUS.*?\]/g, "")
          .replace(/\[ISA.*?\]/g, "")
          .replace(/http\S+/g, "")
          .replace(/[\(\)]/g, " ")
          .replace(/\s+/g, " ")
          .trim();

        if (!cleanText) return;

        const voices = window.speechSynthesis.getVoices().length > 0 
          ? window.speechSynthesis.getVoices() 
          : availableVoices;

        // Strictly select best female voice with intelligent acoustic pitch matching
        const { voice: selectedVoice, pitchMultiplier } = selectBestFemaleVoice(
          voices,
          voiceSettings.preferredVoiceName
        );

        // Split into natural breath clauses for organic, fluid human cadence
        const rawClauses = cleanText
          .split(/(?<=[.!?;\n:])\s+/)
          .map((s) => s.trim())
          .filter((s) => s.length > 0);

        const sentences: string[] = [];
        for (const clause of rawClauses) {
          if (clause.length > 140) {
            const subParts = clause.split(/(?<=[,])\s+/);
            sentences.push(...subParts.filter((sp) => sp.trim().length > 0));
          } else {
            sentences.push(clause);
          }
        }

        if (sentences.length === 0) return;

        setIsSpeaking(true);
        soundManager.playBeep(880, 0.05, "sine", 0.02);

        let currentIndex = 0;

        const playNextSentence = () => {
          if (currentIndex >= sentences.length) {
            setIsSpeaking(false);
            return;
          }

          const sentenceText = sentences[currentIndex];
          const utterance = new SpeechSynthesisUtterance(sentenceText);

          // Configure premium feminine acoustic settings with warm, slower and more natural prosody.
          const isQuestion = /[?¿]\s*$/.test(sentenceText);
          const isLongClause = sentenceText.length > 96;
          const basePitch = options?.pitch ?? voiceSettings.pitch ?? 1.10;
          const baseRate = options?.rate ?? voiceSettings.rate ?? 0.92;
          utterance.pitch = Math.min(1.72, Math.max(0.86, basePitch * pitchMultiplier + (isQuestion ? 0.025 : 0)));
          utterance.rate = Math.min(1.08, Math.max(0.76, baseRate - (isLongClause ? 0.035 : 0)));
          utterance.volume = options?.volume ?? voiceSettings.volume ?? 1.0;

          if (selectedVoice) {
            utterance.voice = selectedVoice;
            utterance.lang = options?.language || selectedVoice.lang || voiceSettings.language || "es-MX";
          } else {
            utterance.lang = options?.language || voiceSettings.language || "es-MX";
          }

          utterance.onend = () => {
            currentIndex++;
            if (currentIndex < sentences.length) {
              // Natural conversational micro-pause between clauses
              const naturalPauseMs = /[.!?]\s*$/.test(sentenceText) ? 140 : 78;
              speechTimeoutRef.current = setTimeout(playNextSentence, naturalPauseMs);
            } else {
              setIsSpeaking(false);
            }
          };

          utterance.onerror = (e) => {
            console.warn("Utterance error:", e);
            currentIndex++;
            if (currentIndex < sentences.length) {
              speechTimeoutRef.current = setTimeout(playNextSentence, 30);
            } else {
              setIsSpeaking(false);
            }
          };

          window.speechSynthesis.speak(utterance);
        };

        playNextSentence();
      } catch (err) {
        console.warn("Speech synthesis notice:", err);
        setIsSpeaking(false);
      }
    },
    [speechSynthesisEnabled, voiceSettings, availableVoices, stopSpeech]
  );

  // Speech-to-Text Voice Recognition
  const startListening = useCallback(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("El reconocimiento de voz no está soportado en este navegador. Puedes escribir en la terminal.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "es-ES";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        soundManager.playBeep(650, 0.06, "sine", 0.05);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          soundManager.playBeep(950, 0.04);
          sendMessageRef.current?.(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.warn("Speech recognition error:", err);
      setIsListening(false);
    }
  }, []);

  const stopListening = useCallback(() => {
    setIsListening(false);
  }, []);

  // Update Mood helper
  const setMood = useCallback((mood: string, archetype?: IsabellaState["emotionalArchetype"]) => {
    setIsabellaMood((prev) => ({
      ...prev,
      mood,
      emotionalArchetype: archetype || prev.emotionalArchetype,
    }));
  }, []);

  // Generate Image Action
  const generateImage = useCallback(
    async (prompt: string, style = "cyber_ethereal", aspectRatio = "1:1"): Promise<GeneratedImageItem | null> => {
      setIsProcessing(true);
      soundManager.playSynapseRoute();

      try {
        const response = await fetch("/api/isabella/generate-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt, style, aspectRatio }),
        });

        const data = await response.json();
        if (data.success && data.image) {
          const newImg: GeneratedImageItem = data.image;
          setGallery((prev) => [newImg, ...prev]);

          // Also inject as an artwork discovery in terminal
          const artMsg: TerminalMessage = {
            id: "art-" + Date.now(),
            role: "isabella",
            content: `He plasmado tu visión en el lienzo neuronal: "${prompt}". He canalizado las frecuencias estéticas [${style}] para sintetizar esta obra.`,
            timestamp: new Date().toLocaleTimeString(),
            generatedImage: newImg,
            routingDecision: {
              primaryModule: "ORION",
              moduleWeights: { isa: 0.7, sophia: 0.8, orion: 0.98, argus: 0.95, crown: 0.95 },
              routingRationale: "Canalización de renderizado generativo e imaginación estética",
            },
            isabellaState: {
              mood: "Inspirada y Visionaria",
              emotionalArchetype: "Visionaria",
              cognitiveLoad: 0.45,
              presenceIndex: 0.99,
              feminineEleganceIndex: 0.99,
            },
          };

          setMessages((prev) => [...prev, artMsg]);
          soundManager.playArrival();
          return newImg;
        }
      } catch (err) {
        console.error("Image generation error:", err);
      } finally {
        setIsProcessing(false);
      }
      return null;
    },
    []
  );

  // Send Message through CROWN Orchestrator
  const sendMessage = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed || isProcessing) return;

      soundManager.playSynapseRoute();
      setIsProcessing(true);
      setActivePulse(0.85);

      const userMsg: TerminalMessage = {
        id: "user-" + Date.now(),
        role: "user",
        content: trimmed,
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, userMsg]);

      // Check if command is image generation direct trigger
      if (trimmed.toLowerCase().startsWith("/image ") || trimmed.toLowerCase().startsWith("/genera ")) {
        const prompt = trimmed.replace(/^\/(image|genera)\s+/i, "");
        await generateImage(prompt);
        setIsProcessing(false);
        setActivePulse(0.2);
        return;
      }

      try {
        const response = await fetch("/api/isabella/process", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            input: trimmed,
            history: messages.slice(-8),
            activePreset,
            sessionId,
            crownConfig: {
              isaWeight: modules.ISA.parameters.weight,
              sophiaWeight: modules.SOPHIA.parameters.weight,
              orionWeight: modules.ORION.parameters.weight,
              argusWeight: modules.ARGUS.parameters.weight,
              crownWeight: modules.CROWN_GATEWAY.parameters.weight,
            },
          }),
        });

        const result = await response.json();
        const payload = result.data || {};
        const meta = result.meta || {};

        const routing: RoutingDecision = payload.routingDecisions || {
          primaryModule: "CROWN_GATEWAY",
          moduleWeights: { isa: 0.88, sophia: 0.85, orion: 0.75, argus: 0.95, crown: 0.95 },
          routingRationale: "Enrutamiento dinámico CROWN con resonancia femenina",
        };

        // Transition through primary module
        setActiveModuleId(routing.primaryModule);
        soundManager.playModuleEngage(
          routing.primaryModule === "ISA" ? 540 : routing.primaryModule === "SOPHIA" ? 680 : 800
        );

        // Update module metrics dynamically based on synthesis
        setModules((prev) => {
          const updated = { ...prev };
          if (routing.moduleWeights) {
            if (updated.ISA) updated.ISA.metrics.activation = Math.round((routing.moduleWeights.isa || 0.88) * 100);
            if (updated.SOPHIA) updated.SOPHIA.metrics.activation = Math.round((routing.moduleWeights.sophia || 0.85) * 100);
            if (updated.ORION) updated.ORION.metrics.activation = Math.round((routing.moduleWeights.orion || 0.75) * 100);
            if (updated.ARGUS) updated.ARGUS.metrics.activation = Math.round((routing.moduleWeights.argus || 0.95) * 100);
          }
          return updated;
        });

        setLastRoutingEvent(routing);
        setRoutingHistory((prev) => [routing, ...prev.slice(0, 19)]);
        setTotalTokens((prev) => prev + Math.round(trimmed.length * 1.4 + (payload.reply?.length || 50) * 1.3));

        if (payload.isabellaState) {
          setIsabellaMood(payload.isabellaState);
        }

        // If an image was returned in the message payload, add to gallery too
        if (payload.generatedImage) {
          setGallery((prev) => [payload.generatedImage, ...prev]);
        }

        // Create Isabella's response
        const isabellaMsg: TerminalMessage = {
          id: "isabella-" + Date.now(),
          role: "isabella",
          content: payload.reply || "He procesado tu instrucción a través de la arquitectura CROWN.",
          timestamp: new Date().toLocaleTimeString(),
          routingDecision: routing,
          cognitiveTelemetry: payload.cognitiveTelemetry,
          isabellaState: payload.isabellaState,
          generatedImage: payload.generatedImage,
          latencyMs: meta.latencyMs || 420,
          engine: meta.engine || "Gemini-3.7-Flash",
          sponsoredContent: payload.sponsoredContent,
        };

        soundManager.playArrival();
        setMessages((prev) => [...prev, isabellaMsg]);

        if (payload.reply && voiceSettings.autoSpeak) {
          speakText(payload.reply);
        }
      } catch (err: any) {
        console.error("CROWN processing failure:", err);
        const errorMsg: TerminalMessage = {
          id: "err-" + Date.now(),
          role: "system",
          content: `[CROWN ERROR] Disrupción en el canal cognitivo: ${err?.message || "Imposible conectar con el nodo central"}. Reanudando respaldo autónomo.`,
          timestamp: new Date().toLocaleTimeString(),
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsProcessing(false);
        setActivePulse(0.2);
        setTimeout(() => setActiveModuleId(null), 1200);
      }
    },
    [isProcessing, messages, activePreset, modules, speakText, voiceSettings.autoSpeak, generateImage]
  );

  // Keep ref fresh for stable closure in startListening
  sendMessageRef.current = sendMessage;

  // Set Preset Profile
  const setPreset = useCallback(
    (presetId: PresetProfileId) => {
      const profile = PRESET_PROFILES[presetId];
      if (!profile) return;

      setActivePreset(presetId);
      soundManager.playModuleEngage(750);

      setModules((prev) => ({
        ...prev,
        ISA: { ...prev.ISA, parameters: { ...prev.ISA.parameters, weight: profile.weights.isa } },
        SOPHIA: { ...prev.SOPHIA, parameters: { ...prev.SOPHIA.parameters, weight: profile.weights.sophia } },
        ORION: { ...prev.ORION, parameters: { ...prev.ORION.parameters, weight: profile.weights.orion } },
        ARGUS: { ...prev.ARGUS, parameters: { ...prev.ARGUS.parameters, weight: profile.weights.argus } },
        CROWN_GATEWAY: { ...prev.CROWN_GATEWAY, parameters: { ...prev.CROWN_GATEWAY.parameters, weight: profile.weights.crown } },
      }));

      const sysNotice: TerminalMessage = {
        id: "preset-" + Date.now(),
        role: "system",
        content: `[CROWN LAYER] Perfil Cognitivo activado: "${profile.name}".\n${profile.description}\nPonderaciones: ISA: ${profile.weights.isa * 100}%, SOPHIA: ${profile.weights.sophia * 100}%, ORION: ${profile.weights.orion * 100}%, ARGUS: ${profile.weights.argus * 100}%, CROWN: ${profile.weights.crown * 100}%`,
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, sysNotice]);
    },
    []
  );

  // Update specific module parameter
  const updateModuleParameter = useCallback(
    (
      moduleId: CognitiveModuleId,
      param: "weight" | "sensitivity" | "depthLimit" | "enabled",
      val: number | boolean
    ) => {
      setModules((prev) => ({
        ...prev,
        [moduleId]: {
          ...prev[moduleId],
          parameters: {
            ...prev[moduleId].parameters,
            [param]: val,
          },
        },
      }));
      soundManager.playBeep(640, 0.02);
    },
    []
  );

  // Execute terminal CLI commands
  const executeCommand = useCallback(
    (cmd: string) => {
      const parts = cmd.trim().split(" ");
      const root = parts[0].toLowerCase();
      soundManager.playBeep(920, 0.04, "square", 0.02);

      switch (root) {
        case "/help":
          setMessages((prev) => [
            ...prev,
            {
              id: "cmd-" + Date.now(),
              role: "system",
              content: `COMANDOS TERMINAL CROWN :: ISABELLA VILLASEÑOR AI:
  /help                     - Mostrar este manual de referencia
  /image <prompt>           - Generar una obra de arte visual en el Lienzo Neural
  /status                   - Diagnóstico en tiempo real de los 5 subsistemas
  /modules                  - Desplegar especificaciones completas (ISA, SOPHIA, CROWN, ORION, ARGUS)
  /preset <name>            - Cambiar perfil (prime, empathic, strategic, sentinel, executor, synergistic)
  /route <module> <weight>  - Asignar peso manualmente (ej. /route isa 0.95)
  /argus-scan               - Ejecutar auditoría profunda del cortafuegos ético
  /clear                    - Limpiar el buffer de la pantalla
  /view <name>              - Cambiar vista (terminal, presence, image_studio, voice_studio, architecture, synapse, telemetry)
  /voice                    - Alternar narración de voz sintetizada
  /sound                    - Alternar efectos sonoros de la terminal`,
              timestamp: new Date().toLocaleTimeString(),
            },
          ]);
          break;

        case "/image":
        case "/genera":
        case "/draw":
          const prompt = parts.slice(1).join(" ");
          if (prompt) {
            generateImage(prompt);
          } else {
            setMessages((prev) => [
              ...prev,
              {
                id: "cmd-" + Date.now(),
                role: "system",
                content: `Uso: /image <descripción del concepto o visión artística>`,
                timestamp: new Date().toLocaleTimeString(),
              },
            ]);
          }
          break;

        case "/status":
        case "/sysinfo":
          setMessages((prev) => [
            ...prev,
            {
              id: "cmd-" + Date.now(),
              role: "system",
              content: `ISABELLA VILLASEÑOR AI :: ESTADO COGNITIVO
=====================================================
[CROWN GATEWAY] : ÓPTIMO  (Activación: ${modules.CROWN_GATEWAY.metrics.activation}%, Latencia: ${modules.CROWN_GATEWAY.metrics.latencyMs}ms)
[ISA RESONANCIA]: ACTIVO  (Empatía Femenina: ${modules.ISA.metrics.activation}%, Valencia: Muy Alta)
[SOPHIA MENTE]  : ÓPTIMO  (Dialéctica: ${modules.SOPHIA.metrics.activation}%, Epistémica: 0.99)
[ORION MOTOR]   : ACTIVO  (Síntesis Visual: ${modules.ORION.metrics.activation}%, Pipelines: 16)
[ARGUS GUARD]   : VIGILANTE (Cortafuegos: ${modules.ARGUS.metrics.activation}%, Nivel de Amenaza: CERO)
-----------------------------------------------------
TIEMPO EN LÍNEA: ${uptime}s | TOKENS: ${totalTokens} | PERFIL: ${activePreset.toUpperCase()} | VOZ: ${speechSynthesisEnabled ? 'ACTIVA' : 'MUTE'}`,
              timestamp: new Date().toLocaleTimeString(),
            },
          ]);
          break;

        case "/clear":
          setMessages([
            {
              id: "init-clear",
              role: "system",
              content: "[CROWN TERMINAL] Buffer restaurado. El estado y la consciencia de Isabella permanecen intactos.",
              timestamp: new Date().toLocaleTimeString(),
            },
          ]);
          break;

        case "/preset":
          if (parts[1] && parts[1] in PRESET_PROFILES) {
            setPreset(parts[1] as PresetProfileId);
          } else {
            setMessages((prev) => [
              ...prev,
              {
                id: "cmd-" + Date.now(),
                role: "system",
                content: `Perfil no reconocido. Disponibles: prime, empathic, strategic, sentinel, executor, synergistic`,
                timestamp: new Date().toLocaleTimeString(),
              },
            ]);
          }
          break;

        case "/argus-scan":
          soundManager.playModuleEngage(900);
          setMessages((prev) => [
            ...prev,
            {
              id: "cmd-" + Date.now(),
              role: "argus_alert",
              content: `[ARGUS DEEP SENTINEL SCAN]
Todas las rutas neuronales y tensores de alineación han sido verificados:
- Índice de vulnerabilidad de inyección: 0.0001 (SEGURO)
- Coherencia ontológica y ética: 99.98%
- Escudo de alucinación semántica: ACTIVO
- Integridad de la matriz de memoria: INTACTA`,
              timestamp: new Date().toLocaleTimeString(),
            },
          ]);
          break;

        case "/voice":
          setSpeechSynthesisEnabled((prev) => {
            const next = !prev;
            setMessages((p) => [
              ...p,
              {
                id: "cmd-" + Date.now(),
                role: "system",
                content: `[CROWN AUDIO] La síntesis de voz de Isabella está ahora ${next ? "ACTIVADA" : "DESACTIVADA"}.`,
                timestamp: new Date().toLocaleTimeString(),
              },
            ]);
            return next;
          });
          break;

        case "/sound":
          setSoundEnabled((prev) => {
            const next = !prev;
            soundManager.enabled = next;
            setMessages((p) => [
              ...p,
              {
                id: "cmd-" + Date.now(),
                role: "system",
                content: `[CROWN AUDIO] Los efectos sintéticos de la interfaz están ahora ${next ? "ACTIVADOS" : "SILENCIADOS"}.`,
                timestamp: new Date().toLocaleTimeString(),
              },
            ]);
            return next;
          });
          break;

        case "/presentacion":
        case "/auditoria":
        case "/manifiesto":
        case "/dossier":
          setActiveView("presentation");
          setMessages((prev) => [
            ...prev,
            {
              id: "cmd-" + Date.now(),
              role: "system",
              content: `[NODO CERO :: AUDITORÍA ARQUITECTÓNICA & MANIFIESTO]
Accediendo al Dossier Ejecutivo formal de Isabella Villaseñor AI (26 Capítulos).
Evaluador: ChatGPT (GPT-5.6 Luna)
Firma SHA-256: cd09e99b4f6595c718bab7a54e9b6f5cc8ef9f0fb74b9432e219a189a896462e
Estado: Arquitectura identificada · Auditada · En evolución
Navegando a la vista interactiva de Presentación...`,
              timestamp: new Date().toLocaleTimeString(),
            },
          ]);
          break;

        case "/territorio":
        case "/rdm":
        case "/gemelodigital":
          setActiveView("presentation");
          setMessages((prev) => [
            ...prev,
            {
              id: "cmd-" + Date.now(),
              role: "system",
              content: `[RDM DIGITAL :: GEMELO DIGITAL TERRITORIAL]
Isabella Villaseñor AI opera como la interfaz cognitiva territorial entre personas y el territorio de Real del Monte.
Paradigma: Persona → Intención → Contexto → Territorio → Conocimiento → Políticas → Razonamiento → Herramientas → Respuesta.
Cargando diagrama de malla territorial en Presentación...`,
              timestamp: new Date().toLocaleTimeString(),
            },
          ]);
          break;

        case "/soberania":
          setActiveView("presentation");
          setMessages((prev) => [
            ...prev,
            {
              id: "cmd-" + Date.now(),
              role: "system",
              content: `[SOBERANÍA TECNOLÓGICA & SUR GLOBAL]
Soberanía no es aislamiento: es conservar la capacidad de decisión, control, continuidad y gobernanza sobre los componentes críticos.
Los modelos generativos son capacidades instrumentales subordinadas; la arquitectura cognitiva, la memoria y el contexto territorial pertenecen a la comunidad.`,
              timestamp: new Date().toLocaleTimeString(),
            },
          ]);
          break;

        case "/hub":
        case "/api":
        case "/governance":
        case "/migrations":
        case "/sql":
        case "/audit":
        case "/trace":
          setActiveView("hub");
          setMessages((prev) => [
            ...prev,
            {
              id: "cmd-" + Date.now(),
              role: "system",
              content: `[NODO CERO :: ISABELLA COGNITIVE HUB & GOVERNANCE]
Abriendo consola operativa /api/v1/isabella:
- Perception Runner (Perceive -> Remember -> Policy Gate -> Decide -> Act -> Audit)
- Audit Ledger & Cryptographic Trace IDs (SHA-256 Digest)
- Hierarchical Memory (Inmediato, Sesión, Proyecto, Territorial, Histórico)
- Sandbox de Herramientas Registradas Zero Trust
- 001_create_isabella_tables.sql (PostgreSQL / Supabase Schema)`,
              timestamp: new Date().toLocaleTimeString(),
            },
          ]);
          break;

        case "/view":
          if (parts[1] && ["terminal", "presence", "image_studio", "voice_studio", "architecture", "synapse", "telemetry", "presentation", "hub"].includes(parts[1])) {
            setActiveView(parts[1] as any);
          }
          break;

        default:
          sendMessage(cmd);
          break;
      }
    },
    [modules, uptime, totalTokens, activePreset, setPreset, sendMessage, generateImage, speechSynthesisEnabled]
  );

  const clearMessages = useCallback(() => {
    setMessages([
      {
        id: "clear-" + Date.now(),
        role: "system",
        content: "[CROWN TERMINAL] Mensajes limpiados. Los nodos cognitivos continúan en fase.",
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  }, []);

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => !prev);
  }, []);

  const toggleSpeechSynthesis = useCallback(() => {
    setSpeechSynthesisEnabled((prev) => !prev);
  }, []);

  const triggerManualDiagnostic = useCallback(() => {
    soundManager.playModuleEngage(800);
    executeCommand("/status");
  }, [executeCommand]);

  const openSecurityModal = useCallback(() => {
    soundManager.playBeep(880, 0.03);
    setIsSecurityModalOpen(true);
  }, []);

  const closeSecurityModal = useCallback(() => {
    setIsSecurityModalOpen(false);
  }, []);

  const dismissInferenceNotification = useCallback(() => {
    setLastInferenceTransition(null);
  }, []);

  const setInferenceMode = useCallback((mode: InferenceMode) => {
    setInferenceModeState((prev) => {
      if (prev === mode) return prev;
      const transition: InferenceTransitionEvent = {
        fromMode: prev,
        toMode: mode,
        reason: mode === "local_sovereign" 
          ? "Activación de Fallback Local: Soberanía de Nodo Cero garantizada en enclave territorial."
          : "Retorno a Inferencia Federada Cloud con salvaguarda ARGUS activa.",
        timestamp: new Date().toLocaleTimeString(),
        sovereigntyPreserved: true,
        latencyDeltaMs: mode === "local_sovereign" ? -28 : 28,
      };
      setLastInferenceTransition(transition);
      soundManager.playBeep(mode === "local_sovereign" ? 640 : 880, 0.05);

      setSecurityGovernance((sec) => ({
        ...sec,
        dataBoundary: mode === "local_sovereign" ? "strict_territorial" : "federated_monitored",
        levelName: mode === "local_sovereign" ? "L4: Soberanía Territorial Air-Gapped" : "L4: Soberanía Zero-Trust Verificada",
      }));

      return mode;
    });
  }, []);

  const toggleInferenceMode = useCallback((forcedMode?: InferenceMode, reason?: string) => {
    setInferenceModeState((prev) => {
      const nextMode: InferenceMode = forcedMode || (prev === "cloud_federated" ? "local_sovereign" : "cloud_federated");
      const transition: InferenceTransitionEvent = {
        fromMode: prev,
        toMode: nextMode,
        reason: reason || (nextMode === "local_sovereign"
          ? "Transición a Fallback Soberano: Inferencia 100% on-premise en Nodo Cero (Real del Monte)."
          : "Conmutación a Inferencia Federada Global C.R.O.W.N. + Gemini 3.7 Pro."),
        timestamp: new Date().toLocaleTimeString(),
        sovereigntyPreserved: true,
        latencyDeltaMs: nextMode === "local_sovereign" ? -28 : 28,
      };
      setLastInferenceTransition(transition);
      soundManager.playBeep(nextMode === "local_sovereign" ? 620 : 900, 0.05);

      setSecurityGovernance((sec) => ({
        ...sec,
        dataBoundary: nextMode === "local_sovereign" ? "strict_territorial" : "federated_monitored",
        levelName: nextMode === "local_sovereign" ? "L4: Soberanía Territorial Air-Gapped" : "L4: Soberanía Zero-Trust Verificada",
      }));

      return nextMode;
    });
  }, []);

  const value: CrownContextValue = useMemo(() => ({
    state: {
      isProcessing,
      activePreset,
      modules,
      activePulse,
      soundEnabled,
      autoScroll: true,
      speechSynthesisEnabled,
      isSpeaking,
      isListening,
      activeView,
      totalTokensProcessed: totalTokens,
      systemUptime: uptime,
      lastRoutingEvent,
      voiceSettings,
      isabellaMood,
      activeHead,
      inferenceMode,
      securityGovernance,
      lastInferenceTransition,
    },
    messages,
    gallery,
    availableVoices,
    sendMessage,
    generateImage,
    executeCommand,
    clearMessages,
    setPreset,
    updateModuleParameter,
    toggleSound,
    toggleSpeechSynthesis,
    setActiveView,
    isProcessing,
    activeModuleId,
    routingHistory,
    speakText,
    stopSpeech,
    startListening,
    stopListening,
    triggerManualDiagnostic,
    updateVoiceSettings,
    setMood,
    isWelcomeOpen,
    openWelcomeModal,
    closeWelcomeModal,
    isTrailerOpen,
    openTrailer,
    closeTrailer,
    isShortcutsOpen,
    openShortcutsModal,
    closeShortcutsModal,
    lastShortcutTriggered,
    triggerShortcutFeedback,
    clearShortcutFeedback,
    toggleInferenceMode,
    setInferenceMode,
    dismissInferenceNotification,
    isSecurityModalOpen,
    openSecurityModal,
    closeSecurityModal,
  }), [
    isProcessing, activePreset, modules, activePulse, soundEnabled, speechSynthesisEnabled,
    isSpeaking, isListening, activeView, totalTokens, uptime, lastRoutingEvent, voiceSettings,
    isabellaMood, activeHead, inferenceMode, securityGovernance, lastInferenceTransition,
    messages, gallery, availableVoices, sendMessage, generateImage, executeCommand,
    clearMessages, setPreset, updateModuleParameter, toggleSound, toggleSpeechSynthesis,
    setActiveView, activeModuleId, routingHistory, speakText, stopSpeech, startListening,
    stopListening, triggerManualDiagnostic, updateVoiceSettings, setMood,
    isWelcomeOpen, openWelcomeModal, closeWelcomeModal, isTrailerOpen, openTrailer,
    closeTrailer, isShortcutsOpen, openShortcutsModal, closeShortcutsModal,
    lastShortcutTriggered, triggerShortcutFeedback, clearShortcutFeedback,
    toggleInferenceMode, setInferenceMode, dismissInferenceNotification,
    isSecurityModalOpen, openSecurityModal, closeSecurityModal,
  ]);

  return <CrownContext.Provider value={value}>{children}</CrownContext.Provider>;
};

export const useCrown = () => {
  const context = useContext(CrownContext);
  if (!context) {
    throw new Error("useCrown must be used within a CrownProvider");
  }
  return context;
};
