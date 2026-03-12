"use client";

import { useState } from "react";
import { BriefingView } from "@/components/BriefingView";
import type { BriefingResponse, Step0Log, Briefing } from "@/lib/types/briefing";
import { Loader2, Zap } from "lucide-react";
import { t, type Lang } from "@/lib/i18n";

export default function Home() {
  const [players, setPlayers] = useState([
    { gameName: "", tagLine: "", role: "top" },
    { gameName: "", tagLine: "", role: "jungle" },
    { gameName: "", tagLine: "", role: "mid" },
    { gameName: "", tagLine: "", role: "adc" },
    { gameName: "", tagLine: "", role: "support" }
  ]);
  const [routingCluster, setRoutingCluster] = useState("asia");
  const [patchVersion, setPatchVersion] = useState("");
  const [lang, setLang] = useState<Lang>("ja");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progressMsg, setProgressMsg] = useState("");
  
  const [briefingData, setBriefingData] = useState<BriefingResponse | null>(null);

  // Language toggle button component
  const LangToggle = () => (
    <button
      onClick={() => setLang(l => l === "en" ? "ja" : "en")}
      className="text-xs font-bold px-3 py-1 border border-hextech-border rounded text-hextech-gold hover:border-hextech-gold transition"
    >
      {lang === "en" ? "🇯🇵 日本語" : "🇬🇧 English"}
    </button>
  );

  const handlePlayerChange = (index: number, field: string, value: string) => {
    const newPlayers = [...players];
    newPlayers[index] = { ...newPlayers[index], [field]: value };
    setPlayers(newPlayers);
  };

  const handleMockData = () => {
    setPlayers([
      { gameName: "SIONJAP", tagLine: "jp 1", role: "top" },
      { gameName: "MARLTNUM", tagLine: "JP1", role: "jungle" },
      { gameName: "χion", tagLine: "JP1", role: "mid" },
      { gameName: "野生のアルファ", tagLine: "アズール", role: "adc" },
      { gameName: "SuzuRi", tagLine: "JP1", role: "support" }
    ]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setProgressMsg("Initializing analysis...");
    setBriefingData(null);

    // At least one player is required
    const validPlayers = players.filter(p => p.gameName.trim() !== "");
    if (validPlayers.length === 0) {
      setError("At least one player must be provided.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ players: validPlayers, routingCluster, patchVersion: patchVersion || undefined, lang }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      let step0Log: Step0Log | undefined;
      let briefing: Briefing | undefined;
      let sseBuffer = "";

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        
        sseBuffer += decoder.decode(value, { stream: true });

        // Only process complete SSE events (terminated by \n\n)
        const events = sseBuffer.split("\n\n");
        sseBuffer = events.pop() ?? ""; // Keep the last incomplete chunk in the buffer

        for (const event of events) {
          if (!event.trim()) continue;
          
          const eventMatch = event.match(/event: (.*)\n/);
          const dataMatch = event.match(/data: (.*)/);
          
          if (eventMatch && dataMatch) {
            const eventType = eventMatch[1].trim();
            try {
              const data = JSON.parse(dataMatch[1].trim());

              switch (eventType) {
                case "progress":
                  setProgressMsg(data.message);
                  break;
                case "step0":
                  step0Log = data;
                  break;
                case "briefing":
                  briefing = data;
                  break;
                case "error":
                  setError(`Analysis failed: ${data.message}`);
                  setIsLoading(false);
                  return;
                case "complete":
                  if (briefing) {
                    setBriefingData({ 
                      step0Log: step0Log || { 
                        patchVersion: "", 
                        patchConfidence: { overall: "low", date: "low", sample: "low", parse: "low" },
                        analysisDate: new Date().toISOString(),
                        candidatesBefore: 0,
                        candidatesAfter: 0,
                        playerReliability: [],
                        adoptedPatchChanges: [],
                        ignoredPatchChanges: 0,
                        offmetaPicks: [],
                        droppedCandidates: [],
                        warnings: []
                      }, 
                      briefing,
                      dataDragonVersion: data.dataDragonVersion,
                    });
                  } else {
                    setError("Completed but no briefing data was received.");
                  }
                  setIsLoading(false);
                  return;
              }
            } catch (err) {
              console.error("Failed to parse SSE JSON:", err);
            }
          }
        }
      }

    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
      setIsLoading(false);
    }
  };

  // If we have data, show the briefing view
  if (briefingData) {
    return (
      <div className="min-h-screen bg-hextech-bg">
        <div className="bg-hextech-panel border-b border-hextech-border p-4 shadow-md sticky top-0 z-50 flex justify-between items-center">
          <div className="flex items-center gap-2 text-hextech-gold font-bold">
            <Zap className="w-5 h-5 text-hextech-blue" />
            eSports Prep Room
          </div>
          <div className="flex items-center gap-3">
            <LangToggle />
            <button 
              onClick={() => setBriefingData(null)}
              className="px-4 py-2 text-sm bg-hextech-border hover:bg-hextech-border/80 text-white rounded transition"
            >
              {t[lang].newAnalysis}
            </button>
          </div>
        </div>
        <BriefingView data={briefingData} lang={lang} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-hextech-bg flex flex-col items-center justify-center p-4">
      <div className="max-w-3xl w-full bg-hextech-panel border border-hextech-border-gold rounded-lg shadow-2xl p-8 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-hextech-blue/10 blur-3xl rounded-full pointer-events-none"></div>
        
        {/* Language toggle - top right */}
        <div className="absolute top-6 right-6 z-10">
          <LangToggle />
        </div>

        <div className="mb-8 text-center relative z-10">
          <h1 className="text-4xl font-bold text-white mb-2 tracking-widest uppercase">{t[lang].title}</h1>
          <p className="text-hextech-gold">{t[lang].subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-xs font-bold text-hextech-blue uppercase mb-2">{t[lang].regionLabel}</label>
              <select 
                value={routingCluster} 
                onChange={e => setRoutingCluster(e.target.value)}
                className="w-full bg-hextech-card border border-hextech-border p-3 rounded text-white focus:border-hextech-blue outline-none transition"
              >
                <option value="asia">Asia (KR, JP, OCE)</option>
                <option value="americas">Americas (NA, BR, LAN, LAS)</option>
                <option value="europe">Europe (EUNE, EUW, TR, RU)</option>
                <option value="sea">SEA (PH, SG, TH, TW, VN)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-hextech-blue uppercase mb-2">{t[lang].patchLabel}</label>
              <input 
                type="text" 
                placeholder={t[lang].patchPlaceholder}
                value={patchVersion}
                onChange={e => setPatchVersion(e.target.value)}
                className="w-full bg-hextech-card border border-hextech-border p-3 rounded text-white focus:border-hextech-blue outline-none transition placeholder-gray-600"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-hextech-blue uppercase">{t[lang].rosterLabel}</label>
              <button 
                type="button" 
                onClick={handleMockData}
                className="text-xs font-bold text-hextech-gold hover:text-white transition"
              >
                {t[lang].autoFill}
              </button>
            </div>
            
            {players.map((player, index) => (
              <div key={index} className="flex gap-3 items-center">
                <div className="w-24 text-center bg-hextech-border text-gray-400 font-bold uppercase text-xs py-3 rounded">
                  {player.role}
                </div>
                <input 
                  type="text" 
                  placeholder="Summoner Name" 
                  value={player.gameName}
                  onChange={e => handlePlayerChange(index, 'gameName', e.target.value)}
                  className="flex-1 bg-hextech-card border border-hextech-border p-3 rounded text-white focus:border-hextech-blue outline-none transition placeholder-gray-600"
                  required={index === 0}
                />
                <div className="text-hextech-border font-bold">#</div>
                <input 
                  type="text" 
                  placeholder="Tagline" 
                  value={player.tagLine}
                  onChange={e => handlePlayerChange(index, 'tagLine', e.target.value)}
                  className="w-24 bg-hextech-card border border-hextech-border p-3 rounded text-white text-center focus:border-hextech-blue outline-none transition placeholder-gray-600"
                  required={index === 0 && player.gameName !== ""}
                />
              </div>
            ))}
          </div>

          {error && (
            <div className="bg-loss/10 border border-loss/50 text-loss px-4 py-3 rounded text-sm font-bold">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-linear-to-r from-hextech-gold-dark to-hextech-gold text-hextech-bg font-bold uppercase tracking-widest py-4 rounded-md shadow-lg hover:shadow-hextech-gold/20 transition-all focus:outline-none flex justify-center items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {progressMsg || t[lang].analyzing}
              </>
            ) : (
              t[lang].generateBtn
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
