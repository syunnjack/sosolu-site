import type { APIRoute } from 'astro';
import { categories } from '../../data/categories';
import { aggregateReviews, dbConfigured, insertReview, listReviews } from '../../lib/reviews';

const validSlugs = new Set(categories.map((c) => c.slug));
const MAX_NAME_LEN = 40;
const MAX_COMMENT_LEN = 1000;

const notConfigured = () =>
  new Response(JSON.stringify({ error: 'database not configured' }), {
    status: 503,
    headers: { 'Content-Type': 'application/json' },
  });

export const GET: APIRoute = async ({ url }) => {
  if (!dbConfigured()) return notConfigured();

  const target = url.searchParams.get('target');
  if (!target || !validSlugs.has(target)) {
    return new Response(JSON.stringify({ error: 'invalid target' }), { status: 400 });
  }

  const [reviews, aggregate] = await Promise.all([listReviews(target), aggregateReviews(target)]);
  return new Response(JSON.stringify({ reviews, aggregate }), {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const POST: APIRoute = async ({ request }) => {
  if (!dbConfigured()) return notConfigured();

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== 'object') {
    return new Response(JSON.stringify({ error: 'invalid body' }), { status: 400 });
  }

  const { target_slug, rating, author_name, comment } = body as Record<string, unknown>;

  if (typeof target_slug !== 'string' || !validSlugs.has(target_slug)) {
    return new Response(JSON.stringify({ error: 'invalid target_slug' }), { status: 400 });
  }
  if (typeof rating !== 'number' || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    return new Response(JSON.stringify({ error: 'rating must be an integer 1-5' }), { status: 400 });
  }
  if (typeof author_name !== 'string' || author_name.trim().length === 0 || author_name.length > MAX_NAME_LEN) {
    return new Response(JSON.stringify({ error: 'invalid author_name' }), { status: 400 });
  }
  if (typeof comment !== 'string' || comment.trim().length === 0 || comment.length > MAX_COMMENT_LEN) {
    return new Response(JSON.stringify({ error: 'invalid comment' }), { status: 400 });
  }

  const review = await insertReview({
    target_slug,
    rating,
    author_name: author_name.trim(),
    comment: comment.trim(),
  });

  return new Response(JSON.stringify({ review }), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
};
