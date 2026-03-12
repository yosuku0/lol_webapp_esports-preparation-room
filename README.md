# eSports Prep Room Web

League of Legends の対戦相手を AI (Gemini 2.0 Flash) が分析し、戦略的なブリーフィングを生成する準備室ツールです。

## 主な機能
- **自動データ収集**: Riot API を使用し、指定した5名のプレイヤーの直近の試合データを自動取得。
- **最新パッチ対応**: 公式パッチノートをスクレイピングし、現在の環境におけるメタの変化を考慮。
- **AI 解析 (Phase 0 & 1)**:
  - プレイヤーの信頼度診断（サブ垢・不慣れなロールの検出）。
  - 戦略的 BAN 推奨と、その理由の提示。
  - チーム全体の傾向（時間帯別勝率など）とパッチの影響度分析。
- **リアルタイム進捗**: Server-Sent Events (SSE) による解析プロセスの可視化。

## 技術スタック
- **Frontend**: Next.js 14+ (App Router), Tailwind CSS v4, Lucide React
- **Backend**: Next.js API Routes (Node.js runtime)
- **AI**: Google Gemini 2.0 Flash (SDK: `@google/generative-ai`)
- **API**: Riot Games API (Data Dragon, Match-V5)
- **Scraping**: Cheerio (Patch Notes analysis)

## スクリーンショット
![Main Form](./public/screenshots/final_analysis.webp)
*(※解析結果の Hextech デザインテーマ例)*

## セットアップ手順

### 1. 環境変数の設定
`.env.local` ファイルを作成し、以下の項目を設定してください。

```bash
RIOT_API_KEY=RGAPI-XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
LLM_PROVIDER=gemini
LLM_MODEL=gemini-2.0-flash
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. インストールと起動
```bash
npm install
npm run dev
```

## デプロイ (Vercel)
1. Vercel にリポジトリを接続します。
2. 上記の環境変数を Vercel のプロジェクト設定画面で登録します。
3. `NODE_TLS_REJECT_UNAUTHORIZED` は設定**不要**です（Vercel 環境では標準の証明書検証が機能します）。

## ライセンス
MIT License
