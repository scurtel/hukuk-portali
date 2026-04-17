import { GoogleGenAI } from "@google/genai";

const DEFAULT_GEMINI_MODEL = "gemini-3.1-flash";

function getGeminiModel(): string {
  const model = process.env.GEMINI_MODEL?.trim();
  return model && model.length > 0 ? model : DEFAULT_GEMINI_MODEL;
}

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY tanımlı değil.");
  }

  return new GoogleGenAI({ apiKey });
}

export async function generateContent(prompt: string): Promise<string> {
  const normalizedPrompt = prompt.trim();

  if (!normalizedPrompt) {
    throw new Error("Geçerli bir prompt giriniz.");
  }

  try {
    const client = getGeminiClient();
    const response = await client.models.generateContent({
      model: getGeminiModel(),
      contents: normalizedPrompt,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });

    const content = response.text?.trim();

    if (!content) {
      throw new Error("Gemini boş içerik döndürdü.");
    }

    return content;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gemini isteği sırasında beklenmeyen hata oluştu.";
    throw new Error(`Gemini içerik üretimi başarısız: ${message}`);
  }
}
