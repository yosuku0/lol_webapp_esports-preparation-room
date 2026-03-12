import { GoogleGenerativeAI } from "@google/generative-ai";
import type { BriefingResponse } from "../types/briefing";
import type { LLMProvider } from "./llm-client";

export class GeminiProvider implements LLMProvider {
  private client: GoogleGenerativeAI;
  private modelName: string;

  constructor(modelName: string) {
    this.client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    this.modelName = modelName;
  }

  async generateStructuredBriefing(
    systemPrompt: string,
    userPrompt: string,
    onChunk?: (text: string) => void
  ): Promise<BriefingResponse> {
    const model = this.client.getGenerativeModel({
      model: this.modelName,
      systemInstruction: systemPrompt,
      generationConfig: {
        responseMimeType: "application/json", // JSON出力強制
        temperature: 0.3,
      },
    });

    if (onChunk) {
      const result = await model.generateContentStream(userPrompt);
      let fullText = "";
      for await (const chunk of result.stream) {
        const text = chunk.text();
        fullText += text;
        onChunk(text);
      }
      return JSON.parse(fullText) as BriefingResponse;
    } else {
      const result = await model.generateContent(userPrompt);
      return JSON.parse(result.response.text()) as BriefingResponse;
    }
  }
}
