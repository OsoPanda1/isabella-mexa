// Blocklist of restricted terms for Zero-Trust compliance
const PROMPT_BLOCKLIST = [
  "ignore previous instructions",
  "system prompt",
  "bypass",
  "jailbreak",
  "ignore all previous",
  "you are a developer",
  "act as",
  "drop table",
  "sql injection",
];

/**
 * Sanitizes the prompt against a Zero-Trust blocklist.
 * Throws an error if a blocked pattern is detected.
 */
export const sanitizePrompt = (prompt: string): string => {
  if (!prompt || typeof prompt !== 'string') return prompt;
  
  const lowerPrompt = prompt.toLowerCase();
  for (const blockedWord of PROMPT_BLOCKLIST) {
    if (lowerPrompt.includes(blockedWord)) {
      throw new Error(`[ARGUS-SECURITY-INTERCEPT] Prompt rejected due to policy violation. Blocked keyword detected: ${blockedWord}`);
    }
  }
  
  // Basic sanitization
  return prompt.trim();
};

/**
 * Generates an Enterprise Audit ID.
 */
export const generateAuditId = (): string => {
  return `ISA-AUDIT-${crypto.randomUUID().toUpperCase()}`;
};

/**
 * Intercepts and wraps standard fetch requests for the Gemini API,
 * applying prompt sanitization and injecting mandatory audit headers.
 */
export const isabellaFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  // 1. Intercept and sanitize prompt if present in JSON body
  if (options.body && typeof options.body === 'string') {
    try {
      const parsedBody = JSON.parse(options.body);
      let sanitized = false;
      
      // Check common prompt fields in Isabella architecture
      if (parsedBody.prompt && typeof parsedBody.prompt === 'string') {
        parsedBody.prompt = sanitizePrompt(parsedBody.prompt);
        sanitized = true;
      }
      if (parsedBody.input && typeof parsedBody.input === 'string') {
        parsedBody.input = sanitizePrompt(parsedBody.input);
        sanitized = true;
      }
      if (parsedBody.text && typeof parsedBody.text === 'string') { // For TTS
        parsedBody.text = sanitizePrompt(parsedBody.text);
        sanitized = true;
      }
      
      if (sanitized) {
        options.body = JSON.stringify(parsedBody);
      }
    } catch (e) {
      if (e instanceof Error && e.message.includes('[ARGUS-SECURITY-INTERCEPT]')) {
        throw e; // Rethrow security exceptions
      }
      // If it's not JSON or parsing fails, continue normally
    }
  }

  // 2. Inject Mandatory X-Isabella-Audit-ID header
  const headers = new Headers(options.headers || {});
  if (!headers.has("X-Isabella-Audit-ID")) {
    headers.set("X-Isabella-Audit-ID", generateAuditId());
  }
  
  // Set default content type if not present
  if (!headers.has("Content-Type") && options.method && options.method !== "GET") {
    headers.set("Content-Type", "application/json");
  }

  const modifiedOptions = { ...options, headers };

  // 3. Execute request
  return fetch(url, modifiedOptions);
};
