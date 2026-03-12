import { ShieldAlert } from "lucide-react";
import type { Briefing } from "@/lib/types/briefing";
import { ChampionIcon } from "./ChampionIcon";
import { t, type Lang } from "@/lib/i18n";

interface Props {
  recommendations: Briefing["banRecommendations"];
  patchVersion: string;
  lang: Lang;
}

export function BanRecommendationCard({ recommendations, patchVersion, lang }: Props) {
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div className="bg-hextech-panel border border-hextech-border-gold rounded-lg p-6 mb-6 shadow-lg shadow-black/50">

      <h2 className="text-xl font-bold text-hextech-gold mb-5 flex items-center gap-2">
        <ShieldAlert className="w-6 h-6" />
        {t[lang].banTitle}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {recommendations.map((rec, i) => (
          <div key={i} className="bg-hextech-card border border-hextech-border p-5 rounded-md flex flex-col h-full relative overflow-hidden">
            {/* Priority Indicator */}
            <div className={`absolute top-0 right-0 px-3 py-1 rounded-bl-lg font-bold text-xs ${
              rec.priority === 1 ? 'bg-loss text-white' : 
              rec.priority === 2 ? 'bg-orange-600 text-white' : 
              'bg-hextech-border text-gray-300'
            }`}>
              {t[lang].priority} {rec.priority}
            </div>

            <div className="flex items-center gap-4 mb-3">
              <ChampionIcon championName={rec.champion} patchVersion={patchVersion} className="w-14 h-14 rounded-full" />
              <div>
                <h3 className="font-bold text-lg text-white">{rec.champion}</h3>
                <div className="text-xs text-hextech-blue-dark uppercase tracking-wider font-bold">
                  {t[lang].confidence}: <span className={rec.confidence === 'high' ? 'text-win' : 'text-gray-400'}>{rec.confidence}</span>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-gray-300 mb-4 grow leading-relaxed">
              {rec.reason}
            </p>
            
            <div className="flex flex-wrap gap-2 mt-auto pt-3 border-t border-hextech-border/50">
              {rec.meaningTags.map(tag => (
                <span key={tag} className="text-[10px] px-2 py-1 bg-hextech-bg text-hextech-blue rounded border border-hextech-blue/20">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
