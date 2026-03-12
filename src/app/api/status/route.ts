import { NextResponse } from "next/server";

export async function GET() {
  const status = {
    ok: true,
    timestamp: new Date().toISOString(),
    env: {
      riotApiKey: !!process.env.RIOT_API_KEY,
      geminiApiKey: !!process.env.GEMINI_API_KEY,
      llmProvider: process.env.LLM_PROVIDER || "gemini",
      llmModel: process.env.LLM_MODEL || "gemini-2.0-flash",
    },
  };

  return NextResponse.json(status);
}

