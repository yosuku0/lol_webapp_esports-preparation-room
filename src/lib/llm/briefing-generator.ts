import type { TeamProfile } from "../riot/types";
import type { PatchData } from "../patch/types";
import type { BriefingResponse } from "../types/briefing";
import { createLLMProvider } from "./llm-client";
import { LOL_ANALYST_RULES } from "./prompts/system-rules";
import { OPPONENT_ANALYSIS_WORKFLOW } from "./prompts/workflow";

// BriefingResponse型定義をLLMに伝えるための文字列（スキーマ情報）
const BRIEFING_SCHEMA = `
出力はJSON形式で、以下のTypeScript型に厳密に従ってください：

{
  "step0Log": {
    "patchVersion": "string",
    "patchConfidence": { "overall": "high|medium|low", "date": "high|medium|low", "sample": "high|medium|low", "parse": "high|medium|low" },
    "analysisDate": "string (ISO 8601)",
    "candidatesBefore": "number",
    "candidatesAfter": "number",
    "playerReliability": [{ "name": "string", "role": "string", "overall": "high|medium|low", "roleConsistency": "high|medium|low", "championConcentration": "high|medium|low", "soloqRelevance": "high|medium|low" }],
    "adoptedPatchChanges": [{ "championName": "string", "changeType": "string", "impactMagnitude": "high|medium|low", "meaningTags": ["string"], "summary": "string" }],
    "ignoredPatchChanges": "number",
    "offmetaPicks": [{ "player": "string", "champion": "string", "reason": "string" }],
    "droppedCandidates": [{ "champion": "string", "reason": "string" }],
    "warnings": ["string"]
  },
  "briefing": {
    "dataOverview": { "teamLabel": "string", "matchCount": "number", "patchVersion": "string", "confidenceNote": "string", "modelUsed": "string" },
    "playerAnalysis": [{ "summonerName": "string", "role": "top|jungle|mid|adc|support", "reliability": "high|medium|low", "championPool": [{ "champion": "string", "games": "number", "winRate": "number (0.0-1.0)", "dangerLevel": "high|medium|low", "isPocketPick": "boolean" }], "recentChange": "string|null", "patchImpact": "string|null", "summary": "string" }],
    "teamTendency": { "avgGameDurationMin": "number", "bestPhase": "early|mid|late", "winRateByDuration": { "under25": { "games": "number", "winRate": "number" }, "mid25to35": { "games": "number", "winRate": "number" }, "over35": { "games": "number", "winRate": "number" } }, "winPattern": "string", "losePattern": "string", "compositionStyle": "string" },
    "patchImpact": { "tailwinds": ["string"], "headwinds": ["string"] },
    "banRecommendations": [{ "champion": "string", "priority": "1|2|3", "reason": "string", "meaningTags": ["string"], "confidence": "high|medium|low" }],
    "warnings": [{ "title": "string", "description": "string", "severity": "high|medium|low" }],
    "opportunities": [{ "title": "string", "description": "string", "actionable": "boolean" }]
  }
}
`;

export function buildSystemPrompt(): string {
  return `あなたはLoLの対戦準備アナリストです。
以下のルールとワークフローに従って分析してください。

=== 分析ルール ===
${LOL_ANALYST_RULES}

=== ワークフロー ===
${OPPONENT_ANALYSIS_WORKFLOW}

=== 出力形式 ===
${BRIEFING_SCHEMA}`;
}

export function buildUserPrompt(
  teamProfile: TeamProfile,
  patchData: PatchData,
  playerRoles: Record<string, string>
): string {
  return `以下のデータを分析し、ブリーフィングを生成してください。

=== チームプロファイル ===
${JSON.stringify(teamProfile, null, 2)}

=== プレイヤーロール情報 ===
${JSON.stringify(playerRoles, null, 2)}

=== パッチデータ ===
${JSON.stringify(patchData, null, 2)}`;
}

export async function generateBriefing(
  teamProfile: TeamProfile,
  patchData: PatchData,
  playerRoles: Record<string, string>,
  onChunk?: (text: string) => void
): Promise<BriefingResponse> {
  const llm = createLLMProvider();
  const systemPrompt = buildSystemPrompt();
  const userPrompt = buildUserPrompt(teamProfile, patchData, playerRoles);
  return llm.generateStructuredBriefing(systemPrompt, userPrompt, onChunk);
}
