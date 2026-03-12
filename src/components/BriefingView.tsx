import type { BriefingResponse } from "@/lib/types/briefing";
import { BanRecommendationCard } from "./BanRecommendationCard";
import { Step0LogView } from "./Step0LogView";
import { PlayerCard } from "./PlayerCard";
import { TeamTendencyCard } from "./TeamTendencyCard";
import { PatchImpactCard } from "./PatchImpactCard";
import { OpportunityWarningCard } from "./OpportunityWarningCard";

interface Props {
  data: BriefingResponse;
}

export function BriefingView({ data }: Props) {
  const { briefing, step0Log } = data;
  const { dataOverview } = briefing;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
      {/* Overview Header */}
      <div className="bg-hextech-bg border-b border-hextech-border-gold pb-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-wide">
            Opponent Briefing
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm text-gray-400 font-bold uppercase tracking-wider">
            <span className="text-hextech-blue">Team: {dataOverview.teamLabel || "Anonymous"}</span>
            <span className="hidden md:inline text-hextech-border">|</span>
            <span>Model: {dataOverview.modelUsed}</span>
            <span className="hidden md:inline text-hextech-border">|</span>
            <span>Patch Focus: {dataOverview.patchVersion || "Latest"}</span>
          </div>
        </div>
        <div className="text-right text-xs md:text-sm text-gray-500 bg-hextech-panel px-4 py-2 rounded border border-hextech-border">
          Matches Analyzed: <span className="font-bold text-white">{dataOverview.matchCount}</span>
        </div>
      </div>

      {step0Log && <Step0LogView log={step0Log} />}
      
      <BanRecommendationCard 
        recommendations={briefing.banRecommendations} 
        patchVersion={dataOverview.patchVersion || "14.4.1"} 
      />

      <OpportunityWarningCard 
        opportunities={briefing.opportunities}
        warnings={briefing.warnings}
      />

      <div className="grid lg:grid-cols-3 gap-6 mb-10">
        <div className="lg:col-span-1 h-full">
          <TeamTendencyCard tendency={briefing.teamTendency} />
        </div>
        <div className="lg:col-span-2 h-full">
          <PatchImpactCard impact={briefing.patchImpact} />
        </div>
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-hextech-border-gold opacity-30"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-hextech-bg px-4 text-2xl font-bold text-hextech-gold uppercase tracking-widest">
            Player Profiles
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {briefing.playerAnalysis.map((player) => (
          <PlayerCard 
            key={player.summonerName} 
            player={player} 
            patchVersion={dataOverview.patchVersion || "14.4.1"} 
          />
        ))}
      </div>
    </div>
  );
}
