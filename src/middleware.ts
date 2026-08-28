import { defineMiddleware } from 'astro/middleware';
import { CANONICAL_HOST, REDIRECT_HOSTS, SITE_URL } from './lib/site';

/**
 * 保有ドメイン（sosolu.email など）を本番の sosolu.tokyo へ301で寄せる。
 *
 * これまでは「レジストラ側でURL転送を設定する」手作業前提だったため、
 * Vercelに向いているドメインは同じ内容をそのまま配信していた。
 * 同一コンテンツが複数ドメインで見えると重複コンテンツとして評価が割れるので、
 * アプリ側で確実に寄せる。docs/DOMAINS.md の方針をコードにしたもの。
 *
 * 許可リスト方式にしている理由と sosolu.site を含めない理由は
 * src/lib/site.ts のコメントを参照。
 */
const redirectHosts = new Set(REDIRECT_HOSTS);

export const onRequest = defineMiddleware(async (context, next) => {
  // Host ヘッダは Astro.url の host に入る。プロキシ経由では
  // x-forwarded-host が実際のリクエスト先なので、あればそちらを優先する。
  const rawHost = context.request.headers.get('x-forwarded-host') ?? context.url.host;
  const bare = rawHost.toLowerCase().split(':')[0];
  const hasWww = bare.startsWith('www.');
  const host = hasWww ? bare.slice(4) : bare;

  // 保有ドメイン、または www 付きの本番ドメインなら寄せる。
  if (redirectHosts.has(host) || (hasWww && host === CANONICAL_HOST)) {
    // パスとクエリは保ったまま移す。深いURLで来た被リンクを落とさないため。
    const target = new URL(context.url.pathname + context.url.search, SITE_URL);
    return new Response(null, {
      status: 301,
      headers: {
        Location: target.toString(),
        // ドメイン方針が変わったときに巻き戻せるよう、永久キャッシュにはしない。
        'Cache-Control': 'public, max-age=3600',
      },
    });
  }

  return next();
});
