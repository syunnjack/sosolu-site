# ドメイン割り当て方針

保有ドメイン（お名前.com、2027/06/02更新）:

- sosolu系12件: site, link, blog, online, life, space, email, pro, xyz, tokyo, shop, help
- sosoru系8件: site, me, link, life, pro, email, tokyo, shop

## 重要: sosolu.siteは対象外

`sosolu.site` はカラフルBOX（アダルト対応レンタルサーバ）で運用中の別サイト「AVデビュー速報」が
既に稼働している。**このドメインには絶対に触れない・NS変更しない・Vercelに追加しない。**
（2026-08-07、誤ってVercelプロジェクトに追加しかけたが削除済み）

## 方針

- **本番: `sosolu.tokyo` 一本化。** コンテンツ・レビューデータはここに集約する。
- **残り18ドメインは全て `sosolu.tokyo` への301リダイレクトにする。** 複数ドメインにコンテンツを分散させると重複コンテンツ扱いされSEO評価が割れるため、防衛目的（表記ゆれ・タイポ・競合登録防止）に徹する。
- 将来的に別ジャンル特化サイトとして独立させたい場合のみ、個別ドメインにコンテンツを持たせる（未確定・要判断）。

## 実施手順（ユーザー側の作業が必要）

リダイレクトの実装はコード側で完了している。お名前.com / Vercelダッシュボードの操作はユーザー側での作業が必要。

1. Vercelプロジェクト（sosolu-site）に `sosolu.tokyo` をカスタムドメインとして追加し、DNSを設定する
2. 残り18ドメインをVercelプロジェクトに追加する（DNSはVercelを向ける）
   - リダイレクト自体は `src/middleware.ts` が実装済み。`src/lib/site.ts` の `REDIRECT_HOSTS` に
     載っているホストで来たリクエストは、パスとクエリを保ったまま `https://sosolu.tokyo` へ301で寄せる。
   - そのためレジストラ側のURL転送は不要。ドメインをVercelに追加するだけで301が効く。
   - レジストラのURL転送を使う手もあるが、パスを保てない転送設定が多く、深いURLの被リンクを
     落とすことがあるためmiddlewareで寄せている。
3. Search Consoleに `sosolu.tokyo` を登録する
