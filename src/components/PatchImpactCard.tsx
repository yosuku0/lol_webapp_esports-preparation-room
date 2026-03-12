import { ArrowUpRight, ArrowDownRight, Wind } from "lucide-react";
import type { Briefing } from "@/lib/types/briefing";
import { t, type Lang } from "@/lib/i18n";

interface Props {
  impact: Briefing["patchImpact"];
  lang: Lang;
}

export function PatchImpactCard({ impact, lang }: Props) {
  if (!impact) return null;

  return (
    <div className="bg-hextech-panel border border-hextech-border rounded-lg p-6 shadow-md h-full">
      <h2 className="text-lg font-bold text-hextech-gold mb-5 flex items-center gap-2">
        <Wind className="w-5 h-5" />
        {t[lang].patchImpact}
      </h2>
      
      <div className="space-y-4">
        <div className="bg-win/10 border border-win/30 rounded-md p-4">
          <h3 className="text-win font-bold flex items-center gap-2 mb-2 text-sm uppercase tracking-wider">
            <ArrowUpRight className="w-4 h-4" />
            {t[lang].tailwinds}
          </h3>
          {impact.tailwinds.length > 0 ? (
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-200">
              {impact.tailwinds.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400 italic">No significant positive impact detected.</p>
          )}
        </div>

        <div className="bg-loss/10 border border-loss/30 rounded-md p-4">
          <h3 className="text-loss font-bold flex items-center gap-2 mb-2 text-sm uppercase tracking-wider">
            <ArrowDownRight className="w-4 h-4" />
            {t[lang].headwinds}
          </h3>
          {impact.headwinds.length > 0 ? (
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-200">
              {impact.headwinds.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400 italic">No significant negative impact detected.</p>
          )}
        </div>
      </div>
    </div>
  );
}
