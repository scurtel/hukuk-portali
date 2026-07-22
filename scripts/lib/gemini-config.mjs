/**
 * Shared Gemini helpers for hukuk-portali content scripts.
 * Server-side only — never import from client components.
 */

export function isGeminiGoogleSearchEnabled() {
  return (
    process.env.GEMINI_GOOGLE_SEARCH_ENABLED === "true" ||
    process.env.GEMINI_ENABLE_SEARCH_GROUNDING === "true"
  );
}

/**
 * Build @google/genai generateContent config.
 * When Google Search is enabled, prefer grounding over JSON mime type
 * (JSON is parsed from free text by callers).
 */
export function buildGeminiGenerateConfig(options = {}) {
  const { json = false, tools, forceJson = false, ...rest } = options;
  const config = { ...rest };
  const searchEnabled = isGeminiGoogleSearchEnabled() && !forceJson;

  if (searchEnabled) {
    config.tools = tools || [{ googleSearch: {} }];
  } else if (json) {
    config.responseMimeType = "application/json";
  } else if (tools) {
    config.tools = tools;
  }

  return config;
}

export function extractGroundingFromGenaiResponse(response) {
  const candidate = response?.candidates?.[0];
  const gm = candidate?.groundingMetadata;
  if (!gm) return null;

  const sources = (gm.groundingChunks || [])
    .map((chunk) => ({
      title: chunk.web?.title || chunk.retrievedContext?.title || null,
      url: chunk.web?.uri || chunk.retrievedContext?.uri || null
    }))
    .filter((source) => source.url);

  return {
    sources,
    webSearchQueries: gm.webSearchQueries || [],
    groundingSupports: gm.groundingSupports || [],
    searchEntryPoint: gm.searchEntryPoint || null
  };
}

export function appendSourcesMarkdown(text, grounding) {
  if (!grounding?.sources?.length) return text;
  const lines = grounding.sources.map(
    (s, i) => `- [${s.title || `Kaynak ${i + 1}`}](${s.url})`
  );
  return `${String(text).trim()}\n\n## Kaynaklar\n\n${lines.join("\n")}\n`;
}
