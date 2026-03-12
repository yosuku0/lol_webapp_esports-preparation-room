// ブリーフィング出力JSON型定義
// LLMへのJSON出力要求と、フロントエンドの描画コンポーネントの両方で使用する

export interface BriefingResponse {
  step0Log: Step0Log;
  briefing: Briefing;
  dataDragonVersion?: string; // Data Dragon CDN version (e.g. "15.6.1"), received from complete event
}

export interface Step0Log {
  patchVersion: string;
  patchConfidence: {
    overall: "high" | "medium" | "low";
    date: "high" | "medium" | "low";
    sample: "high" | "medium" | "low";
    parse: "high" | "medium" | "low";
  };
  analysisDate: string;
  candidatesBefore: number;
  candidatesAfter: number;

  playerReliability: Array<{
    name: string;
    role: string;
    overall: "high" | "medium" | "low";
    roleConsistency: "high" | "medium" | "low";
    championConcentration: "high" | "medium" | "low";
    soloqRelevance: "high" | "medium" | "low";
  }>;

  adoptedPatchChanges: Array<{
    championName: string;
    changeType: string;
    impactMagnitude: "high" | "medium" | "low";
    meaningTags: string[];
    summary: string;
  }>;

  ignoredPatchChanges: number;

  offmetaPicks: Array<{
    player: string;
    champion: string;
    reason: string;
  }>;

  droppedCandidates: Array<{
    champion: string;
    reason: string;
  }>;

  warnings: string[];
}

export interface Briefing {
  dataOverview: {
    teamLabel: string;
    matchCount: number;
    patchVersion: string;
    confidenceNote: string;
    modelUsed: string;
  };

  playerAnalysis: Array<{
    summonerName: string;
    role: "top" | "jungle" | "mid" | "adc" | "support";
    reliability: "high" | "medium" | "low";

    championPool: Array<{
      champion: string;
      games: number;
      winRate: number;
      dangerLevel: "high" | "medium" | "low";
      isPocketPick: boolean;
    }>;

    recentChange: string | null;
    patchImpact: string | null;
    summary: string;
  }>;

  teamTendency: {
    avgGameDurationMin: number;
    bestPhase: "early" | "mid" | "late";
    winRateByDuration: {
      under25: { games: number; winRate: number };
      mid25to35: { games: number; winRate: number };
      over35: { games: number; winRate: number };
    };
    winPattern: string;
    losePattern: string;
    compositionStyle: string;
  };

  patchImpact: {
    tailwinds: string[];
    headwinds: string[];
  };

  banRecommendations: Array<{
    champion: string;
    priority: 1 | 2 | 3;
    reason: string;
    meaningTags: string[];
    confidence: "high" | "medium" | "low";
  }>;

  warnings: Array<{
    title: string;
    description: string;
    severity: "high" | "medium" | "low";
  }>;

  opportunities: Array<{
    title: string;
    description: string;
    actionable: boolean;
  }>;
}
