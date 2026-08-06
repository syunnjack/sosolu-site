# sosolu-site

sosolu.site — ユーザーレビュー（UGC）を核にした比較・ランキングサイト。
既存の41ランキングサイトとの差別化として、UGCとAIO/LLMO最適化を組み込む。

設計方針: `rakuten02` リポジトリの `docs/SOSOLU-PROJECT-PLAN.md` を参照。

## セットアップ

```bash
npm install
npm run dev
```

## デプロイ

Vercelに接続すると `@astrojs/vercel` アダプタでそのままデプロイ可能。

## 現状（スキャフォールドのみ）

- [x] Astroプロジェクト初期構成
- [x] `llms.txt` / `robots.txt`（AIO/LLMO・SEO基礎）
- [x] FAQ構造化データ（JSON-LD）のひな形
- [x] UGCレビューAPIエンドポイントの配置（`src/pages/api/reviews.ts`、未実装）
- [ ] ランキングコンテンツ
- [ ] UGCレビュー投稿・表示UI
- [ ] DB接続（レビュー永続化）
- [ ] Vercelデプロイ + sosolu.jp DNS設定
