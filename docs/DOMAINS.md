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

## 実施手順（ダッシュボード操作が必要）

リダイレクトの実装はコード側で完了している。残っているのはVercelとお名前.comの操作で、
これはダッシュボードからしか行えない。

### 1. sosolu.tokyo を本番ドメインにする

1. Vercelプロジェクト `sosolu-site` の Settings → Domains で `sosolu.tokyo` を追加する
2. Vercelが表示するDNSレコードを、お名前.comのDNS設定に登録する
   （通常は apex が A レコード、`www` が CNAME。**表示された値をそのまま使うこと**。
   ここに固定値を書くとVercel側の変更に追従できないため、あえて書いていない）
3. Vercelのドメイン一覧で `Valid Configuration` になるまで待つ（DNS反映に時間がかかる）

### 2. 残り18ドメインを追加する

#### 一括で追加する（推奨）

19件を手で追加すると途中で飛ばしても気付きにくいので、
GitHub Actions から一括登録できるようにしてある。

1. Settings → Secrets and variables → Actions に登録する
   （**トークンはここに入れる。チャットに貼らないこと**）
   - `VERCEL_TOKEN` … https://vercel.com/account/tokens で発行
   - `VERCEL_PROJECT_ID` … プロジェクトの Settings → General
   - `VERCEL_TEAM_ID` … 個人アカウントなら不要
2. Actions → **Add domains to Vercel** → Run workflow
   - まず `apply` を **false** のまま実行する。何も変更せず、
     これから追加する分だけ出る
   - 内容を確認したら `apply` を **true** にして再実行する
3. 追加済みのドメインは飛ばすので、途中で失敗しても再実行してよい

登録対象は `src/lib/site.ts` を読むため、コードと設定はずれない。
`sosolu.site` が混ざっていた場合はAPIを1回も呼ばずに中止する。

手元から直接動かすこともできる:

```bash
VERCEL_TOKEN=... VERCEL_PROJECT_ID=... npm run vercel-domains          # 下見
VERCEL_TOKEN=... VERCEL_PROJECT_ID=... npm run vercel-domains -- --apply
```

#### 手で追加する場合

下記をVercelプロジェクトに追加し、それぞれDNSをVercelへ向ける。
**追加するだけでよい。** Vercel側でリダイレクト設定をする必要はなく、
`src/middleware.ts` が301で `sosolu.tokyo` へ寄せる。

```
sosolu.link
sosolu.blog
sosolu.online
sosolu.life
sosolu.space
sosolu.email
sosolu.pro
sosolu.xyz
sosolu.shop
sosolu.help
sosoru.site
sosoru.me
sosoru.link
sosoru.life
sosoru.pro
sosoru.email
sosoru.tokyo
sosoru.shop
```

この一覧は `src/lib/site.ts` の `REDIRECT_HOSTS` と一致している必要がある。
どちらかだけを変えると、追加したのに寄らないドメインが出る。

**`sosolu.site` はこの一覧に無い。** 上の「重要」の項のとおり別サイトが稼働しているため、
Vercelにも `REDIRECT_HOSTS` にも入れない。

レジストラ側のURL転送は使わない。パスを保てない転送設定が多く、
深いURLで来た被リンクを落とすため。

### 3. 設定を検証する

18件を手で追加すると1件くらい漏れる。漏れても、そのドメインで開くと
普通にサイトが見えてしまい気付きにくいので、設定後に必ず流すこと。

手元にリポジトリを clone していなくてよい方法（推奨）:

**Actions → Check redirects → Run workflow**（入力は空欄のまま）

clone してある場合はこちらでもよい:

```bash
npm run check-redirects
```

どちらも全ドメインについて、ルートと深いURL（クエリ付き）が
`https://sosolu.tokyo` へ301で寄るかを確認し、NGを一覧で出す。

DNSを切り替える前に middleware の挙動だけ先に確かめたい場合は、
デプロイ先へ直接投げる。Actions なら `via` 入力にデプロイ先URLを入れる。
手元からはこう:

```bash
npm run check-redirects -- --via https://sosolu-site-one.vercel.app
```

### 4. Search Console に登録する

1. `sosolu.tokyo` をプロパティとして登録する
2. サイトマップに `https://sosolu.tokyo/sitemap.xml` を送信する
3. 寄せた18ドメインは登録しなくてよい（301先が評価される）

## レビュー機能を有効にする（任意）

ドメイン設定とは独立している。未設定でもサイトは動き、レビュー欄は「準備中」と表示される。

1. Vercel Postgres をプロビジョニングする（`POSTGRES_URL` 等が自動で入る）
2. `db/schema.sql` を実行してテーブルを作る
3. 環境変数 `REVIEW_IP_SALT` に任意のランダム文字列を設定する
   - 投稿元IPをハッシュ化するためのソルト。未設定だと連投チェックが効かない
   - 後から変えると過去のハッシュと突き合わせられなくなるので、決めたら変えない
