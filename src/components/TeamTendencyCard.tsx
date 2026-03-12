import { Target, Clock, BarChart3 } from "lucide-react";
import type { Briefing } from "@/lib/types/briefing";

interface Props {
  tendency: Briefing["teamTendency"];
}

export function TeamTendencyCard({ tendency }: Props) {
  if (!tendency) return null;

  const WinRateBar = ({ label, rate }: { label: string, rate: number }) => (
    <div className="mb-2">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-300 capitalize">{label}</span>
        <span className="font-bold text-white">{(rate * 100).toFixed(1)}%</span>
      </div>
      <div className="h-2 w-full bg-hextech-bg rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full ${rate >= 0.5 ? 'bg-win' : rate >= 0.4 ? 'bg-yellow-500' : 'bg-loss'}`}
          style={{ width: `${Math.min(100, Math.max(0, rate * 100))}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="bg-hextech-panel border border-hextech-border rounded-lg p-6 shadow-md h-full">
      <h2 className="text-lg font-bold text-hextech-gold mb-5 flex items-center gap-2">
        <Target className="w-5 h-5" />
        Team Tendencies
      </h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-hextech-card border border-hextech-border p-3 rounded">
          <div className="text-xs text-gray-400 flex items-center gap-1 mb-1">
            <Clock className="w-3 h-3" />
            Avg. Duration
          </div>
          <div className="font-bold text-lg text-white capitalize">{tendency.avgGameDurationMin}m</div>
        </div>
        <div className="bg-hextech-card border border-hextech-border p-3 rounded">
          <div className="text-xs text-gray-400 flex items-center gap-1 mb-1">
            <BarChart3 className="w-3 h-3" />
            Best Phase
          </div>
          <div className="font-bold text-lg text-white capitalize">{tendency.bestPhase}</div>
        </div>
      </div>

      <div className="mb-5">
        <h3 className="text-sm font-bold text-hextech-blue mb-3">Win Rate by Game Duration</h3>
        <WinRateBar label="0 - 25 min (Short)" rate={tendency.winRateByDuration.under25.winRate} />
        <WinRateBar label="25 - 35 min (Medium)" rate={tendency.winRateByDuration.mid25to35.winRate} />
        <WinRateBar label="35+ min (Long)" rate={tendency.winRateByDuration.over35.winRate} />
      </div>

      <div className="space-y-3 pt-4 border-t border-hextech-border/50 text-sm">
        <div>
          <span className="text-hextech-gold font-bold block mb-1">Win Pattern:</span>
          <p className="text-gray-300 leading-relaxed">{tendency.winPattern}</p>
        </div>
        <div>
          <span className="text-loss font-bold block mb-1">Lose Pattern:</span>
          <p className="text-gray-300 leading-relaxed">{tendency.losePattern}</p>
        </div>
      </div>
    </div>
  );
}
