import { NextRequest } from "next/server";
import { RiotApiClient } from "@/lib/riot/riot-api";
import { initializeDataDragonCache } from "@/lib/riot/data-dragon";
import { fetchPlayerProfile } from "@/lib/riot/profile-service";
import { processTeamProfile } from "@/lib/riot/data-processor";
import { fetchPatchHtml } from "@/lib/patch/patch-fetcher";
import { parsePatch } from "@/lib/patch/patch-parser";
import { generateBriefing } from "@/lib/llm/briefing-generator";
import type { AnalyzeRequest, ErrorEvent } from "@/lib/types/api";

export const runtime = "nodejs"; // cheerioとNode.js API使用のため必須

export async function POST(req: NextRequest) {
  let body: AnalyzeRequest;
  try {
    body = await req.json();
  } catch {
    return Response.json({ message: "Invalid JSON", type: "unknown" }, { status: 400 });
  }
  const { players, routingCluster, patchVersion } = body;

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const emit = (event: string, data: unknown) => {
        try {
          controller.enqueue(
            encoder.encode(
              `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`
            )
          );
        } catch {
          // ストリームが既に閉じている場合は無視
        }
      };

      const startTime = Date.now();

      try {
        // ===== Phase 1: プレイヤーデータ取得 =====
        const riotClient = new RiotApiClient();
        await initializeDataDragonCache();

        const playerProfiles = [];
        const playerRoles: Record<string, string> = {};

        for (let i = 0; i < players.length; i++) {
          const player = players[i];
          emit("progress", {
            step: "players",
            message: `${player.gameName} のデータ取得中...`,
            current: i + 1,
            total: players.length,
          });

          const profile = await fetchPlayerProfile(riotClient, {
            gameName: player.gameName,
            tagLine: player.tagLine,
            routingCluster,
          });

          if ("error" in profile) {
            emit("error", {
              message: `プレイヤー ${player.gameName}#${player.tagLine} が見つかりません: ${profile.error}`,
              type: "riot_api",
            } satisfies ErrorEvent);
            controller.close();
            return;
          }

          playerProfiles.push(profile);
          playerRoles[profile.gameName] = player.role;
        }

        // チームプロファイル構築
        const teamProfile = processTeamProfile(playerProfiles);

        // ===== Phase 2: パッチデータ取得 =====
        emit("progress", {
          step: "patch",
          message: patchVersion
            ? `パッチ ${patchVersion} を取得・解析中...`
            : "最新パッチを取得・解析中...",
        });

        const patchFetchResult = await fetchPatchHtml(patchVersion);
        const patchData = parsePatch(patchFetchResult.html, patchFetchResult.requestedVersion);

        // ===== Phase 3: LLMブリーフィング生成 =====
        emit("progress", {
          step: "briefing",
          message: "AIがブリーフィングを生成中...",
        });

        const briefingResponse = await generateBriefing(
          teamProfile,
          patchData,
          playerRoles
        );

        // Step 0 ログを送信
        emit("step0", briefingResponse.step0Log);

        // ブリーフィング本体を送信
        emit("briefing", briefingResponse.briefing);

        // 完了通知
        emit("complete", {
          totalTimeMs: Date.now() - startTime,
          model: process.env.LLM_MODEL || "gemini-2.0-flash",
          parseStatus: patchData.parseStatus,
        });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : String(error);

        let type: ErrorEvent["type"] = "unknown";
        if (message.includes("401") || message.includes("RIOT") || message.includes("NOT_FOUND")) {
          type = "riot_api";
        } else if (message.includes("GEMINI") || message.includes("API key") || message.includes("GenerativeAI")) {
          type = "llm";
        } else if (message.includes("patch") || message.includes("Patch")) {
          type = "patch";
        }

        emit("error", { message, type } satisfies ErrorEvent);
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no", // Vercel/Nginx のバッファリング無効化
    },
  });
}

