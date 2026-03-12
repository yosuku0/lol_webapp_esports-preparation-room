import type { BriefingResponse } from "@/lib/types/briefing";
import { BanRecommendationCard } from "./BanRecommendationCard";
import { Step0LogView } from "./Step0LogView";
import { PlayerCard } from "./PlayerCard";
import { TeamTendencyCard } from "./TeamTendencyCard";
import { PatchImpactCard } from "./PatchImpactCard";
import { OpportunityWarningCard } from "./OpportunityWarningCard";
import { t, type Lang } from "@/lib/i18n";

interface Props {
  data: BriefingResponse;
  lang: Lang;
}

export function BriefingView({ data, lang }: Props) {
  const { briefing, step0Log, dataDragonVersion } = data;
  // Use the Data Dragon version received from the API (e.g. "15.6.1").
  // Fall back to a recent known version only if the field is missing.
  const ddVersion = dataDragonVersion ?? "15.1.1";
  const { dataOverview } = briefing;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
      {/* Overview Header */}
      <div className="bg-hextech-bg border-b border-hextech-border-gold pb-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-wide">
            {t[lang].briefingTitle}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm text-gray-400 font-bold uppercase tracking-wider">
            <span className="text-hextech-blue">{t[lang].team}: {dataOverview.teamLabel || "Anonymous"}</span>
            <span className="hidden md:inline text-hextech-border">|</span>
            <span>{t[lang].model}: {dataOverview.modelUsed}</span>
            <span className="hidden md:inline text-hextech-border">|</span>
            <span>{t[lang].patch}: {dataOverview.patchVersion || "Latest"}</span>
          </div>
        </div>
        <div className="text-right text-xs md:text-sm text-gray-500 bg-hextech-panel px-4 py-2 rounded border border-hextech-border">
          {t[lang].matchCount}: <span className="font-bold text-white">{dataOverview.matchCount}</span>
        </div>
      </div>

      {step0Log && <Step0LogView log={step0Log} lang={lang} />}
      
      <BanRecommendationCard 
        recommendations={briefing.banRecommendations} 
        patchVersion={ddVersion}
        lang={lang}
      />

      <OpportunityWarningCard 
        opportunities={briefing.opportunities}
        warnings={briefing.warnings}
        lang={lang}
      />

      <div className="grid lg:grid-cols-3 gap-6 mb-10">
        <div className="lg:col-span-1 h-full">
          <TeamTendencyCard tendency={briefing.teamTendency} lang={lang} />
        </div>
        <div className="lg:col-span-2 h-full">
          <PatchImpactCard impact={briefing.patchImpact} lang={lang} />
        </div>
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-hextech-border-gold opacity-30"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-hextech-bg px-4 text-2xl font-bold text-hextech-gold uppercase tracking-widest">
            {t[lang].playerProfiles}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {briefing.playerAnalysis.map((player) => (
          <PlayerCard 
            key={player.summonerName} 
            player={player} 
            patchVersion={ddVersion}
            lang={lang}
          />
        ))}
      </div>
    </div>
  );
}
