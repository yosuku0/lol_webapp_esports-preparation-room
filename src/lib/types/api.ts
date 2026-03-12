import type { RoutingCluster } from "../riot/types";

export interface AnalyzeRequest {
  players: Array<{
    gameName: string;
    tagLine: string;
    role: "top" | "jungle" | "mid" | "adc" | "support";
  }>;
  routingCluster: RoutingCluster;
  patchVersion?: string; // 省略時は最新パッチを自動取得
}

export type ProgressStep = "players" | "patch" | "briefing";

export interface ProgressEvent {
  step: ProgressStep;
  message: string;
  current?: number;
  total?: number;
}

export interface CompleteEvent {
  totalTimeMs: number;
  model: string;
  parseStatus?: string;
}

export interface ErrorEvent {
  message: string;
  type: "riot_api" | "llm" | "patch" | "unknown";
}
