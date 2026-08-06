import type { APIRoute } from 'astro';

// TODO: 永続化先（Vercel Postgres 等）を決定して実装する。
// 現状はUGC機能のエンドポイント配置のみ。

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({ reviews: [] }), {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json().catch(() => null);
  if (!body) {
    return new Response(JSON.stringify({ error: 'invalid body' }), { status: 400 });
  }
  // TODO: バリデーション + DB保存
  return new Response(JSON.stringify({ error: 'not implemented' }), { status: 501 });
};
