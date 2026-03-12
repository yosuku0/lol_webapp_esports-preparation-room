import { ChevronDown, FileTerminal, AlertTriangle } from "lucide-react";
import type { Step0Log } from "@/lib/types/briefing";
import { t, type Lang } from "@/lib/i18n";

interface Props {
  log: Step0Log;
  lang: Lang;
}

export function Step0LogView({ log, lang }: Props) {
  if (!log) return null;

  return (
    <details className="group bg-hextech-panel border border-hextech-border rounded-lg mb-6 shadow-md">
      <summary className="flex items-center justify-between p-4 cursor-pointer font-bold text-gray-400 hover:text-hextech-gold transition-colors list-none">
        <div className="flex items-center gap-2 text-sm uppercase tracking-widest">
          <FileTerminal className="w-4 h-4" />
          <span>{t[lang].step0Title}</span>
        </div>
        <ChevronDown className="w-5 h-5 transition-transform group-open:rotate-180" />
      </summary>
      
      <div className="p-5 border-t border-hextech-border text-sm text-gray-300 space-y-6 bg-hextech-bg/50 rounded-b-lg">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-hextech-card p-3 rounded border border-hextech-border">
            <div className="text-xs text-gray-500 uppercase">Patch Version</div>
            <div className="font-mono text-hextech-gold">{log.patchVersion}</div>
          </div>
          <div className="bg-hextech-card p-3 rounded border border-hextech-border">
            <div className="text-xs text-gray-500 uppercase">Confidence</div>
            <div className="font-bold">{log.patchConfidence?.overall}</div>
          </div>
          <div className="bg-hextech-card p-3 rounded border border-hextech-border">
            <div className="text-xs text-gray-500 uppercase">Candidates Pruned</div>
            <div>{log.candidatesBefore} → <span className="text-hextech-blue">{log.candidatesAfter}</span></div>
          </div>
        </div>

        {log.warnings?.length > 0 && (
          <div className="bg-loss/10 border border-loss/30 p-4 rounded-md">
            <h4 className="text-loss font-bold mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Data Warnings
            </h4>
            <ul className="list-disc pl-5 space-y-1 text-red-200">
              {log.warnings.map((w, i) => <li key={i}>{w}</li>)}
            </ul>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-hextech-blue font-bold mb-3 border-b border-hextech-border pb-1">Adopted Patch Changes</h4>
            {log.adoptedPatchChanges?.length > 0 ? (
              <ul className="space-y-3">
                {log.adoptedPatchChanges.map((c, i) => (
                  <li key={i} className="text-xs leading-relaxed">
                    <span className="font-bold text-white text-sm">{c.championName}</span> 
                    <span className="text-gray-500 ml-2">[{c.changeType}]</span>
                    <p className="mt-1 text-gray-400">{c.summary}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No significant patch impact adopted.</p>
            )}
          </div>

          <div>
            <h4 className="text-hextech-blue font-bold mb-3 border-b border-hextech-border pb-1">Player Reliability Evaluations</h4>
            <ul className="space-y-2">
              {log.playerReliability?.map((p, i) => (
                <li key={i} className="flex justify-between text-xs items-center bg-hextech-card p-2 rounded">
                  <span className="font-bold text-gray-200">{p.name} <span className="font-normal text-gray-500">({p.role})</span></span>
                  <span className={`px-2 py-0.5 rounded uppercase font-bold text-[10px] ${
                    p.overall === 'high' ? 'bg-win/20 text-win' : 
                    p.overall === 'medium' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-loss/20 text-loss'
                  }`}>{p.overall}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </details>
  );
}
