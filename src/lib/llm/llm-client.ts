import type { BriefingResponse } from "../types/briefing";
import { GeminiProvider } from "./gemini-provider";

export interface LLMProvider {
  generateStructuredBriefing(
    systemPrompt: string,
    userPrompt: string,
    onChunk?: (text: string) => void
  ): Promise<BriefingResponse>;
}

export function createLLMProvider(): LLMProvider {
  const provider = process.env.LLM_PROVIDER || "gemini";
  const model = process.env.LLM_MODEL || "gemini-2.0-flash"; // Defaults to flash

  switch (provider) {
    case "gemini":
      return new GeminiProvider(model);
    // 将来の拡張:
    // case "anthropic": return new AnthropicProvider(model);
    // case "openai": return new OpenAIProvider(model);
    default:
      return new GeminiProvider(model);
  }
}
