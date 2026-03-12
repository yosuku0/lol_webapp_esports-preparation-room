import { cn } from "@/lib/utils";

interface ChampionIconProps {
  championName: string;
  patchVersion: string;
  className?: string;
}

export function ChampionIcon({ championName, patchVersion, className }: ChampionIconProps) {
  // Clean champion name for Data Dragon URL (e.g., "Lee Sin" -> "LeeSin", "Kai'Sa" -> "Kaisa")
  // Note: Some exceptions exist (like Wukong -> MonkeyKing), but this covers most standard cases.
  const cleanName = championName.replace(/['\s.]/g, "");
  // Using 14.4.1 format directly, though DD often needs just major.minor.patch (e.g. 14.4.1)
  const url = `https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/champion/${cleanName}.png`;

  return (
    <img
      src={url}
      alt={championName}
      className={cn("rounded border border-hextech-border object-cover bg-hextech-bg", className)}
      onError={(e) => {
        // Fallback behavior if image is missing
        e.currentTarget.style.display = "none";
      }}
    />
  );
}
