/**
 * Isabella Villaseñor AI — Idlen Chat Ads Integration (Server-Side)
 * Monetización contextual de conversaciones con ads nativos gobernados por ARGUS.
 */
import { IdlenChatAds } from "@idlen/chat-sdk/server";
import { extractContextFromText } from "@idlen/chat-sdk";
import type { ChatAd, ChatAdRequest, ChatContext, ChatAdFormat } from "@idlen/chat-sdk";

const IDLEN_API_KEY = process.env.IDLEN_API_KEY || "";
const IDLEN_ENABLED = IDLEN_API_KEY.startsWith("idl_pk_");

let adsClient: IdlenChatAds | null = null;

function getClient(): IdlenChatAds | null {
  if (!IDLEN_ENABLED) return null;
  if (!adsClient) {
    adsClient = new IdlenChatAds({ apiKey: IDLEN_API_KEY });
  }
  return adsClient;
}

export interface IsabellaAdResult {
  hasAd: boolean;
  ad?: {
    adId: string;
    title: string;
    body: string;
    ctaText: string;
    ctaUrl: string;
    format: string;
    imageUrl?: string;
    advertiserName: string;
    advertiserLogo?: string;
    markdown: string;
    html: string;
    plainText: string;
    impressionToken: string;
    requestId: string;
  };
  context?: ChatContext;
  error?: string;
}

/**
 * Obtiene un ad contextual para una conversación de Isabella.
 * Extrae contexto del mensaje del usuario usando el diccionario local del SDK.
 */
export async function getIsabellaAd(params: {
  sessionId: string;
  userMessage: string;
  conversationHistory?: Array<{ role: string; content: string }>;
  format?: ChatAdFormat;
}): Promise<IsabellaAdResult> {
  const client = getClient();
  if (!client) {
    return { hasAd: false, error: "IDLEN_NOT_CONFIGURED" };
  }

  try {
    // Extract context from user message
    const context = client.extractContext(params.userMessage);

    const request: ChatAdRequest = {
      sessionId: params.sessionId,
      rawText: params.userMessage,
      context: {
        topics: context.topics,
        intent: context.intent,
        category: context.category,
      },
      format: params.format || "chat_sponsored_recommendation",
      maxAds: 1,
    };

    const ad = await client.getAd(request);

    if (!ad) {
      return { hasAd: false, context };
    }

    return {
      hasAd: true,
      ad: {
        adId: ad.adId,
        title: ad.title,
        body: ad.body,
        ctaText: ad.ctaText,
        ctaUrl: ad.ctaUrl,
        format: ad.format,
        imageUrl: ad.imageUrl,
        advertiserName: ad.advertiserName,
        advertiserLogo: ad.advertiserLogo,
        markdown: ad.renderMarkdown(),
        html: ad.renderHTML(),
        plainText: ad.renderPlainText(),
        impressionToken: ad.impressionToken,
        requestId: ad.requestId,
      },
      context,
    };
  } catch (err: any) {
    return { hasAd: false, error: err?.message || String(err) };
  }
}

/**
 * Obtiene un ad para el endpoint de procesamiento cognitivo de Isabella.
 * Solo se inserta un ad cada ~3 interacciones para no degradar la experiencia.
 */
export async function maybeAppendAd(
  responseText: string,
  params: {
    sessionId: string;
    userMessage: string;
    messageCount: number;
  },
): Promise<{ text: string; ad?: IsabellaAdResult["ad"] }> {
  // Ad frequency: every 3rd user message (no spam)
  if (params.messageCount % 3 !== 0 || params.messageCount === 0) {
    return { text: responseText };
  }

  const adResult = await getIsabellaAd({
    sessionId: params.sessionId,
    userMessage: params.userMessage,
    format: "chat_sponsored_recommendation",
  });

  if (!adResult.hasAd || !adResult.ad) {
    return { text: responseText };
  }

  // Append ad as a subtle sponsored recommendation
  const adBlock = `\n\n---\n${adResult.ad.markdown}`;
  return { text: responseText + adBlock, ad: adResult.ad };
}

/**
 * Estado del módulo Idlen.
 */
export function getIdlenStatus() {
  return {
    configured: IDLEN_ENABLED,
    apiKeyPrefix: IDLEN_API_KEY ? IDLEN_API_KEY.slice(0, 12) + "..." : "NOT_SET",
    clientReady: adsClient !== null,
  };
}
