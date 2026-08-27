import type { APIRoute } from 'astro';
import { categories } from '../../data/categories';
import {
  aggregateReviews,
  countRecentByIpHash,
  dbConfigured,
  hasDuplicateComment,
  insertReview,
  listReviews,
} from '../../lib/reviews';

const validSlugs = new Set(categories.map((c) => c.slug));

const MAX_NAME_LEN = 40;
const MAX_COMMENT_LEN = 1000;
const MIN_COMMENT_LEN = 10;

/** 連投の判定。この分数のあいだに この件数 を超えたら断る。 */
const RATE_WINDOW_MINUTES = 10;
const RATE_MAX_POSTS = 3;

/** コメント中に許すリンクの数。宣伝目的の投稿は大抵ここで引っかかる。 */
const MAX_LINKS = 0;
const linkPattern = /(https?:\/\/|www\.|[a-z0-9-]+\.(?:com|net|org|jp|xyz|top|shop|info)\b)/gi;

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      // レビューは投稿直後に反映されてほしいのでキャッシュしない。
      'Cache-Control': 'no-store',
    },
  });
}

const notConfigured = () => json({ error: 'database not configured' }, 503);

/**
 * 接続元IPをソルト付きでハッシュ化する。
 *
 * 生のIPは保存しない（プライバシーポリシーに書いたとおり）。ソルトが未設定でも
 * 動作は止めず、その場合はハッシュを付けない＝連投チェックだけ効かなくなる。
 */
async function hashIp(request: Request): Promise<string | null> {
  const salt = process.env.REVIEW_IP_SALT;
  if (!salt) return null;

  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim();
  if (!ip) return null;

  const data = new TextEncoder().encode(`${salt}:${ip}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export const GET: APIRoute = async ({ url }) => {
  if (!dbConfigured()) return notConfigured();

  const target = url.searchParams.get('target');
  if (!target || !validSlugs.has(target)) {
    return json({ error: 'invalid target' }, 400);
  }

  const [reviews, aggregate] = await Promise.all([listReviews(target), aggregateReviews(target)]);
  return json({ reviews, aggregate });
};

export const POST: APIRoute = async ({ request }) => {
  if (!dbConfigured()) return notConfigured();

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== 'object') {
    return json({ error: 'invalid body' }, 400);
  }

  const { target_slug, rating, author_name, comment, website } = body as Record<string, unknown>;

  // ハニーポット。画面には出ない入力欄で、埋まっていれば自動投稿とみなす。
  // ボットに学習されないよう、断ったことは知らせず成功したように見せる。
  if (typeof website === 'string' && website.trim() !== '') {
    return json({ ok: true }, 201);
  }

  if (typeof target_slug !== 'string' || !validSlugs.has(target_slug)) {
    return json({ error: 'invalid target_slug' }, 400);
  }
  if (typeof rating !== 'number' || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    return json({ error: 'rating must be an integer 1-5' }, 400);
  }

  if (typeof author_name !== 'string') {
    return json({ error: 'invalid author_name' }, 400);
  }
  const name = author_name.trim();
  if (name.length === 0 || name.length > MAX_NAME_LEN) {
    return json({ error: 'ニックネームを1〜40文字で入力してください。' }, 400);
  }

  if (typeof comment !== 'string') {
    return json({ error: 'invalid comment' }, 400);
  }
  const text = comment.trim();
  if (text.length < MIN_COMMENT_LEN || text.length > MAX_COMMENT_LEN) {
    return json(
      { error: `レビュー内容を${MIN_COMMENT_LEN}〜${MAX_COMMENT_LEN}文字で入力してください。` },
      400,
    );
  }
  if ((text.match(linkPattern) ?? []).length > MAX_LINKS) {
    return json({ error: 'レビュー内容にURLを含めることはできません。' }, 400);
  }

  const ipHash = await hashIp(request);

  if (ipHash) {
    const recent = await countRecentByIpHash(ipHash, RATE_WINDOW_MINUTES);
    if (recent >= RATE_MAX_POSTS) {
      return json(
        { error: '短時間に多くの投稿が行われています。しばらく時間をおいてからお試しください。' },
        429,
      );
    }
  }

  if (await hasDuplicateComment(target_slug, text)) {
    return json({ error: '同じ内容のレビューがすでに投稿されています。' }, 409);
  }

  const review = await insertReview({
    target_slug,
    rating,
    author_name: name,
    comment: text,
    ip_hash: ipHash,
  });

  return json({ review }, 201);
};
