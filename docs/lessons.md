# Lessons Learned: esports-prep-room-web

## Next.js / TypeScript / 移植に関連する教訓

### 1. ESM における import 拡張子の問題
- **事象**: 既存コードの `.js` 拡張子付き import をそのまま移植したところ、Next.js (Turbopack/bundler) 環境で `module-not-found` が発生した。
- **解決策**: `.ts` ファイルを参照する場合、拡張子を削除（または適切に管理）することで、Next.js のリゾルバが正しくファイルを解決できるようになった。
- **ルール**: Next.js への移植時は、明示的な理由がない限り拡張子なしのスタイルに統一するのが安全。

### 2. サーバーレス環境とファイル読み込み (FS)
- **事象**: Vercel 等のサーバーレス環境では、実行時に `fs.readFileSync` でプロンプトファイルを読み込むのが難しいため、設計判断として TS 定数への埋め込みを採用した。
- **学び**: プロンプトなどの静的データは、ビルド時に定数化することで、デプロイ後の実行安定性とパフォーマンスが向上する。

### 3. Google Fonts のビルド時依存
- **事象**: `next/font/google` はビルド時に Google Fonts API へアクセスを試みる。ネットワーク制限のある環境ではここでビルドが停止する。
- **対策**: インターネット接続が制限されている、または TLS 検証に問題がある環境では、一時的に Google Fonts を無効化し、標準フォントを使用する。

### 4. curl における JSON クォート (Windows)
- **事象**: PowerShell や CMD から `curl -d "{...}"` を実行すると、クォーテーションのパースエラーが発生しやすい。
- **対策**: 複雑な JSON は `test_payload.json` などのファイルに保存し、`curl -d @file` を使用するか、PowerShell の `Invoke-RestMethod` を使用する。

### 5. SSL/TLS 証明書検証エラー
- **事象**: Riot Data Dragon へのアクセス時に `UNABLE_TO_VERIFY_LEAF_SIGNATURE` が発生した。
- **対策**: 開発環境では `process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"` を設定することで暫定回避可能。（本番環境では必ず削除すること）

### 6. React Hydration Mismatch とブラウザ拡張機能
- **事象**: ブラウザテスト時、`html` タグに想定外の属性 (`data-jetski-tab-id` など) が付与され Hydration Error が発生することがある。
- **学び**: これらはブラウザ拡張機能や自動化ツールが DOM を操作したことによる開発環境特有のエラーであり、アプリケーションコア自体のバグではないため、無視してかまわない。

