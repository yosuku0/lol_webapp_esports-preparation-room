import { Activity, Crosshair } from "lucide-react";
import type { Briefing } from "@/lib/types/briefing";
import { ChampionIcon } from "./ChampionIcon";
import { t, type Lang } from "@/lib/i18n";

interface Props {
  player: Briefing["playerAnalysis"][number];
  patchVersion: string;
  lang: Lang;
}

export function PlayerCard({ player, patchVersion, lang }: Props) {
  const getReliabilityColor = (rel: string) => {
    switch (rel) {
      case "high": return "text-win";
      case "medium": return "text-yellow-500";
      case "low": return "text-loss";
      default: return "text-gray-400";
    }
  };

  return (
    <div className="bg-hextech-card border border-hextech-border rounded-lg p-5 flex flex-col h-full hover:border-hextech-blue/50 transition-colors shadow-md">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            {player.summonerName}
          </h3>
          <div className="text-sm text-hextech-gold uppercase tracking-wider font-bold mt-1">
            {player.role}
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-xs text-gray-400 uppercase">{t[lang].reliability}</div>
          <div className={`font-bold capitalize ${getReliabilityColor(player.reliability)}`}>
            {player.reliability}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 mb-5 text-sm bg-hextech-panel p-3 rounded-md border border-hextech-border/50">
        <div className="flex items-start gap-3">
          <Activity className="w-4 h-4 text-gray-400 mt-0.5" />
          <div className="flex-1">
            <span className="text-gray-500 text-[10px] uppercase font-bold block leading-tight">Recent Trend</span>
            <span className="text-gray-200 capitalize">{player.recentChange || "N/A"}</span>
          </div>
        </div>
        <div className="flex items-start gap-3 border-t border-hextech-border/30 pt-3">
          <Crosshair className="w-4 h-4 text-gray-400 mt-0.5" />
          <div className="flex-1">
            <span className="text-gray-500 text-[10px] uppercase font-bold block leading-tight">{t[lang].patchImpact}</span>
            <span className="text-gray-200">{player.patchImpact || "Neutral"}</span>
          </div>
        </div>
      </div>

      <div className="mb-5">
        <div className="text-xs text-gray-400 uppercase font-bold mb-3">Champion Pool</div>
        <div className="flex flex-wrap gap-4">
          {player.championPool.length > 0 ? (
            player.championPool.map(champ => (
              <div key={champ.champion} className="flex flex-col items-center group">
                <div className="relative">
                  <ChampionIcon 
                    championName={champ.champion} 
                    patchVersion={patchVersion} 
                    className={`w-11 h-11 rounded-full border-2 transition-transform group-hover:scale-110 ${champ.dangerLevel === 'high' ? 'border-loss shadow-md shadow-loss/30' : champ.isPocketPick ? 'border-hextech-blue' : 'border-hextech-border'}`} 
                  />
                  {champ.dangerLevel === 'high' && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-loss rounded-full border border-hextech-card"></div>
                  )}
                </div>
                <span className="text-[11px] font-bold text-gray-300 mt-1.5">{Math.round(champ.winRate * 100)}%</span>
                <span className="text-[9px] text-gray-500 uppercase">{champ.games}g</span>
              </div>
            ))
          ) : (
            <span className="text-sm text-gray-500 italic">No recent data available.</span>
          )}
        </div>
      </div>

      <p className="text-sm text-gray-300 mt-auto pt-4 border-t border-hextech-border/50 leading-relaxed">
        {player.summary}
      </p>
    </div>
  );
}
