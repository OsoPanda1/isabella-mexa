/**
 * ================================================================
 * ISABELLA VILLASEÑOR AI — RUNTIME PROVIDER REGISTRY (Module 6)
 * LLM provider abstraction. Resolves which provider/model to use.
 * ================================================================
 */

export interface InferenceRequest {
  readonly systemPrompt: string;
  readonly messages: Array<{ role: string; content: string }>;
  readonly tools?: string[];
  readonly temperature?: number;
  readonly maxTokens?: number;
}

export interface InferenceResult {
  readonly text: string;
  readonly tokensUsed: number;
  readonly model: string;
  readonly provider: string;
  readonly toolCalls?: Array<{
    readonly name: string;
    readonly arguments: Record<string, unknown>;
  }>;
}

export interface RuntimeProvider {
  readonly name: string;
  readonly model: string;
  readonly contextWindowLimit: number;
  readonly supportsTools: boolean;
  readonly requiresApiKey: boolean;
  infer(req: InferenceRequest): Promise<InferenceResult>;
}

/* =========================================================================
   BUILT-IN PROVIDERS
   ========================================================================= */

class GeminiProvider implements RuntimeProvider {
  readonly name = "gemini";
  readonly model = "gemini-3.7-flash";
  readonly contextWindowLimit = 1_000_000;
  readonly supportsTools = true;
  readonly requiresApiKey = true;

  async infer(req: InferenceRequest): Promise<InferenceResult> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return { text: "Proveedor Gemini no disponible (API key no configurada).", tokensUsed: 0, model: this.model, provider: this.name };
    }

    try {
      const { GoogleGenAI } = await import("@google/genai");
      const genai = new GoogleGenAI({ apiKey });
      const contents = req.messages.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

      const response = await genai.models.generateContent({
        model: this.model,
        contents,
        config: { systemInstruction: req.systemPrompt, temperature: req.temperature ?? 0.7, maxOutputTokens: req.maxTokens ?? 4096 },
      });

      const text = response.text || "";
      const estimatedTokens = Math.ceil((req.systemPrompt.length + req.messages.reduce((s, m) => s + m.content.length, 0) + text.length) / 3.5);

      return { text, tokensUsed: Math.ceil(estimatedTokens), model: this.model, provider: this.name };
    } catch {
      return { text: "Error en la inferencia con Gemini. Intenta de nuevo.", tokensUsed: 0, model: this.model, provider: this.name };
    }
  }
}

class SovereignLocalProvider implements RuntimeProvider {
  readonly name = "sovereign-local";
  readonly model = "local-lm";
  readonly contextWindowLimit = 32_000;
  readonly supportsTools = false;
  readonly requiresApiKey = false;

  async infer(req: InferenceRequest): Promise<InferenceResult> {
    return { text: "[Sovereign Local] Proveedor local no configurado. Configura un modelo local para usar este proveedor.", tokensUsed: 0, model: this.model, provider: this.name };
  }
}

class FallbackProvider implements RuntimeProvider {
  readonly name = "fallback";
  readonly model = "canned-responses";
  readonly contextWindowLimit = 0;
  readonly supportsTools = false;
  readonly requiresApiKey = false;

  async infer(req: InferenceRequest): Promise<InferenceResult> {
    const lastUser = req.messages.filter((m) => m.role === "user").pop();
    const input = lastUser?.content?.toLowerCase() || "";
    let text = "Entendido. Isabella está operando en modo degradado sin proveedor de inferencia configurado.";

    if (input.includes("hola") || input.includes("hello")) {
      text = "Hola. Soy Isabella Villaseñor AI, tu asistente de inteligencia personal soberana del Nodo Cero.";
    } else if (input.includes("ayuda") || input.includes("help")) {
      text = "Puedo ayudarte con consultas territoriales, auditoría de seguridad, arbitraje cognitivo, registro en ledger soberano y síntesis de voz.";
    }

    return { text, tokensUsed: 0, model: this.model, provider: this.name };
  }
}

/* =========================================================================
   PROVIDER REGISTRY
   ========================================================================= */

const providers: RuntimeProvider[] = [
  new GeminiProvider(),
  new SovereignLocalProvider(),
  new FallbackProvider(),
];

export function registerProvider(provider: RuntimeProvider): void {
  const idx = providers.findIndex((p) => p.name === provider.name);
  if (idx >= 0) providers[idx] = provider;
  else providers.unshift(provider);
}

export function resolveRuntimeProvider(preferred?: string): RuntimeProvider {
  if (preferred) {
    const match = providers.find((p) => p.name === preferred);
    if (match) return match;
  }

  const gemini = process.env.GEMINI_API_KEY;
  if (gemini) return providers.find((p) => p.name === "gemini")!;

  return providers.find((p) => p.name === "fallback")!;
}

export function listProviders(): Array<{ name: string; model: string; available: boolean }> {
  return providers.map((p) => ({
    name: p.name,
    model: p.model,
    available: p.name === "fallback" || (p.requiresApiKey ? !!process.env.GEMINI_API_KEY : true),
  }));
}
