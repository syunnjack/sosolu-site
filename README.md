# sosolu-site

sosolu.tokyo — 既存のジャンル別ランキングサイト（`syunnjack/*-ranking`）を横断して比較する、
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
`schema.sql` は `ADD COLUMN IF NOT EXISTS` を含むので、既存テーブルにそのまま流しても良い。

### 環境変数

| 変数 | 必須 | 用途 |
| --- | --- | --- |
| `POSTGRES_URL` | レビュー機能に必要 | Vercel Postgres接続。未設定ならレビューAPIは503を返す |
| `REVIEW_IP_SALT` | 任意（推奨） | 投稿元IPをハッシュ化するときのソルト。未設定だと連投チェックが効かない |

## ドメイン

本番は `sosolu.tokyo` の一本。保有している他ドメイン（`sosolu.email` など18件）は
`src/middleware.ts` が301で `sosolu.tokyo` へ寄せる。対象ドメインは `src/lib/site.ts` の
`REDIRECT_HOSTS` に列挙している（許可リスト方式。`sosolu.site` は別サイトなので含めない）。

## サイトマップ

`src/pages/sitemap.xml.ts` が `/sitemap.xml` を動的に生成する。
`@astrojs/sitemap` はSSRのルートを列挙できずトップの1URLしか出せなかったため外した。
`src/data/categories.ts` にジャンルを追加すれば自動で反映される。

## 現状

- [x] Astroプロジェクト初期構成
- [x] `llms.txt` / `robots.txt`（AIO/LLMO・SEO基礎）
- [x] 42ジャンルの一覧ページ（`/`）+ ジャンル別ページ（`/c/{slug}/`）
- [x] 全URLを含む動的サイトマップ（`/sitemap.xml`）
- [x] FAQ / BreadcrumbList / WebSite / ItemList / AggregateRating 構造化データ（JSON-LD）
- [x] 保有ドメインから `sosolu.tokyo` への301（`src/middleware.ts`）
- [x] 共通レイアウト（ヘッダ・フッタ・パンくず）とサイト全体のスタイル
- [x] R18年齢確認（`src/components/AgeGate.astro`）
- [x] 運営者情報 / レビュー掲載方針 / プライバシーポリシー / 404ページ
- [x] UGCレビュー投稿・表示UI（`src/components/ReviewWidget.astro`）
- [x] レビューAPI実装（`src/pages/api/reviews.ts`、ハニーポット・連投制限・URL投稿の拒否込み）
- [x] DBスキーマ定義（`db/schema.sql`、非掲載フラグ付き）
- [ ] 各ジャンルランキングサイトの実デプロイ・URL紐付け（`src/data/categories.ts` の `externalUrl`、現状すべて未公開のため `null`）
- [ ] Vercel Postgresの実プロビジョニング（ユーザー側のVercelアカウント作業）
- [ ] `sosolu.tokyo` のVercelカスタムドメイン設定
- [ ] 保有ドメインをVercelプロジェクトに追加（追加すればmiddlewareの301が効く）
