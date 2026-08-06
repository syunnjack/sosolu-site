# sosolu-site

sosolu.site — 既存の41ジャンル別ランキングサイト（`syunnjack/*-ranking`）を横断して比較する、
ユーザーレビュー（UGC）主体のメタ比較ハブ。

設計方針: [docs/DOMAINS.md](./docs/DOMAINS.md)（ドメイン割り当て）。
`rakuten02` リポジトリの `docs/SEO-AIO-LLMO.md` / `docs/RANKING-SITES.md` も参照。

## セットアップ

```bash
npm install
npm run dev
```

## デプロイ

Vercelに接続すると `@astrojs/vercel` アダプタでそのままデプロイ可能。

`src/pages/api/reviews.ts` はVercel Postgresに接続する。`POSTGRES_URL` 等の環境変数が未設定の場合、
レビューAPIは503を返し、フロント側は「準備中」表示にフォールバックする（サイト自体は落ちない）。

DB接続後は `db/schema.sql` を実行してテーブルを作成すること。

## 現状

- [x] Astroプロジェクト初期構成（sitemap統合済み）
- [x] `llms.txt` / `robots.txt`（AIO/LLMO・SEO基礎）
- [x] 41ジャンルの一覧ページ（`/`）+ ジャンル別ページ（`/c/{slug}/`）
- [x] FAQ / BreadcrumbList / Product+AggregateRating 構造化データ（JSON-LD）
- [x] UGCレビュー投稿・表示UI（`src/components/ReviewWidget.astro`）
- [x] レビューAPI実装（`src/pages/api/reviews.ts`、バリデーション込み）
- [x] DBスキーマ定義（`db/schema.sql`）
- [ ] 各ジャンルランキングサイトの実デプロイ・URL紐付け（`src/data/categories.ts` の `externalUrl`、現状すべて未公開のため `null`）
- [ ] Vercel Postgresの実プロビジョニング（ユーザー側のVercelアカウント作業）
- [ ] `sosolu.site` のVercelカスタムドメイン設定
- [ ] 残り19ドメインのリダイレクト設定（[docs/DOMAINS.md](./docs/DOMAINS.md)）
