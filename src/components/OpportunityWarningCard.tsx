import { Lightbulb, AlertTriangle } from "lucide-react";
import type { Briefing } from "@/lib/types/briefing";

interface Props {
  opportunities: Briefing["opportunities"];
  warnings: Briefing["warnings"];
}

export function OpportunityWarningCard({ opportunities, warnings }: Props) {
  return (
    <div className="grid md:grid-cols-2 gap-6 mb-6">
      {/* Opportunities */}
      <div className="bg-hextech-panel border border-hextech-border rounded-lg p-6 shadow-md shadow-hextech-blue/10">
        <h2 className="text-lg font-bold text-hextech-blue mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5" />
          Strategic Opportunities
        </h2>
        {opportunities?.length > 0 ? (
          <ul className="space-y-3">
            {opportunities.map((opp, i) => (
              <li key={i} className={`flex gap-3 text-sm text-gray-300 bg-hextech-bg p-4 rounded-md ${opp.actionable ? 'border border-hextech-blue/30' : ''}`}>
                <span className="text-hextech-blue font-bold opacity-70">{i + 1}.</span>
                <div>
                  <div className="font-bold text-white mb-1">{opp.title}</div>
                  <div className="leading-relaxed text-gray-400">{opp.description}</div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500 italic">No clear opportunities identified.</p>
        )}
      </div>

      {/* Warnings */}
      <div className="bg-hextech-panel border border-loss/20 rounded-lg p-6 shadow-md shadow-loss/5">
        <h2 className="text-lg font-bold text-loss mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Critical Warnings
        </h2>
        {warnings?.length > 0 ? (
          <ul className="space-y-3">
            {warnings.map((warn, i) => (
              <li key={i} className="flex gap-3 text-sm text-gray-300 bg-hextech-bg/50 p-4 rounded-md border border-loss/10">
                <span className="text-loss font-bold opacity-70">!</span>
                <div>
                  <div className={`font-bold mb-1 ${warn.severity === 'high' ? 'text-loss' : warn.severity === 'medium' ? 'text-yellow-500' : 'text-gray-300'}`}>
                    {warn.title} <span className="opacity-50 text-xs tracking-wider">[{warn.severity.toUpperCase()}]</span>
                  </div>
                  <div className="leading-relaxed text-gray-400">{warn.description}</div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500 italic">No critical warnings identified.</p>
        )}
      </div>
    </div>
  );
}
