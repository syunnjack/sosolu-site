# ドメイン割り当て方針

保有ドメイン（お名前.com、2027/06/02更新）:

- sosolu系12件: site, link, blog, online, life, space, email, pro, xyz, tokyo, shop, help
- sosoru系8件: site, me, link, life, pro, email, tokyo, shop

## 方針

- **本番: `sosolu.site` 一本化。** コンテンツ・レビューデータはここに集約する。
- **残り19ドメインは全て `sosolu.site` への301リダイレクトにする。** 複数ドメインにコンテンツを分散させると重複コンテンツ扱いされSEO評価が割れるため、防衛目的（表記ゆれ・タイポ・競合登録防止）に徹する。
- 将来的に別ジャンル特化サイトとして独立させたい場合のみ、個別ドメインにコンテンツを持たせる（未確定・要判断）。

## 実施手順（ユーザー側の作業が必要）

このセッションからはお名前.com / Vercelダッシュボードへの直接操作はできないため、以下はユーザー側での設定が必要です。

1. Vercelプロジェクト（sosolu-site）に `sosolu.site` をカスタムドメインとして追加し、DNSを設定する
2. 残り19ドメインをお名前.comの「ドメイン転送（DNSフォワーディング）」または各レジストラのURL転送機能で `https://sosolu.site/` へリダイレクト設定する
   - Vercel側でリダイレクトを一括管理したい場合は、各ドメインをVercelプロジェクトに追加した上で `vercel.json` の `redirects` で301設定も可能（ドメイン数が多いため、まずはレジストラ側のURL転送が簡便）
3. Search Consoleに `sosolu.site` を登録する
