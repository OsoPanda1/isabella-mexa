export * from "./contracts/isabella";

export type CognitiveModuleId = "ISA" | "SOPHIA" | "CROWN_GATEWAY" | "ORION" | "ARGUS";

export interface ModuleMetrics {
  activation: number; // 0 to 100
  latencyMs: number;
  confidence: number; // 0 to 100
  throughput: string;
  temperature: number; // 0.0 to 1.0
  activeThreads: number;
  status: "OPTIMAL" | "ENGAGED" | "ROUTING" | "STANDBY" | "ANALYZING";
}

export interface CognitiveModule {
  id: CognitiveModuleId;
  name: string;
  acronym: string;
  fullName: string;
  role: string;
  description: string;
  corePillars: string[];
  themeColor: {
    primary: string;
    border: string;
    glow: string;
    badge: string;
    text: string;
    lightBg: string;
  };
  metrics: ModuleMetrics;
  parameters: {
    weight: number; // 0.0 to 1.0
    sensitivity: number; // 0.0 to 1.0
    depthLimit: number;
    enabled: boolean;
  };
}

export interface RoutingDecision {
  primaryModule: CognitiveModuleId;
  moduleWeights: {
    isa: number;
    sophia: number;
    orion: number;
    argus: number;
    crown: number;
  };
  routingRationale: string;
}

export interface CognitiveTelemetry {
  argusSafety: {
    status: "CLEAR" | "FLAGGED" | "ELEVATED";
    integrityScore: number;
    guardrailCheck: string;
  };
  isaResonance: {
    emotionalTone: string;
    empathyValence: number;
    coreFocus: string;
  };
  sophiaReasoning: {
    logicDepth: string;
    epistemicCertainty: number;
    heuristicInsight: string;
  };
  orionExecution: {
    actionType: string;
    executionSteps: string[];
    resourceUtilization: string;
  };
}

export interface IsabellaState {
  mood: string;
  emotionalArchetype: "Serena" | "Visionaria" | "Poética" | "Lúcida" | "Protectora" | "Radiante";
  cognitiveLoad: number; // 0 to 1
  presenceIndex: number; // 0 to 1
  feminineEleganceIndex: number; // 0 to 1
}

export interface GeneratedImageItem {
  id: string;
  url: string;
  prompt: string;
  style: string;
  aspectRatio: string;
  timestamp: string;
  author: "Isabella Villaseñor" | "User";
  source: "gemini" | "neural_canvas" | "orion_flux" | "orion_art";
}

export interface VoiceSettings {
  pitch: number; // 0.8 to 1.4
  rate: number; // 0.7 to 1.5
  volume: number; // 0 to 1
  timbrePreset: "cristalina" | "calida" | "poetica" | "filosofica" | "holografica" | "natural_fluida";
  preferredVoiceName?: string;
  autoSpeak: boolean;
  language: "es-ES" | "es-MX" | "en-US";
}

export interface TerminalMessage {
  id: string;
  role: "user" | "isabella" | "system" | "argus_alert";
  content: string;
  timestamp: string;
  routingDecision?: RoutingDecision;
  cognitiveTelemetry?: CognitiveTelemetry;
  isabellaState?: IsabellaState;
  generatedImage?: GeneratedImageItem;
  audioClipUrl?: string;
  latencyMs?: number;
  engine?: string;
  isStreaming?: boolean;
}

export type PresetProfileId = "prime" | "empathic" | "strategic" | "sentinel" | "executor" | "synergistic";

export interface PresetProfile {
  id: PresetProfileId;
  name: string;
  tagline: string;
  description: string;
  weights: {
    isa: number;
    sophia: number;
    orion: number;
    argus: number;
    crown: number;
  };
}

export type ActiveViewId =
  | "terminal"
  | "presence"
  | "image_studio"
  | "voice_studio"
  | "architecture"
  | "synapse"
  | "telemetry"
  | "presentation"
  | "hub"
  | "traceability"
  | "codex";

export type InferenceMode = "cloud_federated" | "local_sovereign";

export interface SecurityGovernanceLevel {
  levelNumber: number; // 4
  levelName: string; // "L4: Soberanía Zero-Trust Verificada"
  integrityPercent: number; // 99.8%
  argusSentinelActive: boolean;
  cryptographicEnclave: "verified" | "audited" | "degraded";
  dataBoundary: "strict_territorial" | "federated_monitored";
  sha256LedgerDigest: string;
}

export interface InferenceTransitionEvent {
  fromMode: InferenceMode;
  toMode: InferenceMode;
  reason: string;
  timestamp: string;
  sovereigntyPreserved: boolean;
  latencyDeltaMs: number;
}

export interface PresentationChapter {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  category: "Fundamento" | "Arquitectura" | "Territorio" | "Gobernanza" | "Soberanía" | "Memoria & Seguridad" | "Evaluación" | "Visión Global";
  summary: string;
  content: string[];
  keyQuote?: string;
  diagramAscii?: string;
  highlights: string[];
}

export interface EvaluatorDeclaration {
  evaluator: string;
  model: string;
  sha256: string;
  evaluationState: string;
  dossierSummary: string;
  timestamp: string;
}

export interface CrownSystemState {
  isProcessing: boolean;
  activePreset: PresetProfileId;
  modules: Record<CognitiveModuleId, CognitiveModule>;
  activePulse: number; // 0 to 1 for waveform
  soundEnabled: boolean;
  autoScroll: boolean;
  speechSynthesisEnabled: boolean;
  isSpeaking: boolean;
  isListening: boolean;
  activeView: ActiveViewId;
  totalTokensProcessed: number;
  systemUptime: number;
  lastRoutingEvent: RoutingDecision | null;
  voiceSettings: VoiceSettings;
  isabellaMood: IsabellaState;
  activeHead: "Alpha" | "Beta";
  inferenceMode: InferenceMode;
  securityGovernance: SecurityGovernanceLevel;
  lastInferenceTransition: InferenceTransitionEvent | null;
}
