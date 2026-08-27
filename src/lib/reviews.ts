import { sql } from '@vercel/postgres';

export interface Review {
  id: number;
  target_slug: string;
  rating: number;
  author_name: string;
  comment: string;
  created_at: string;
}

export interface ReviewAggregate {
  count: number;
  average: number | null;
}

export const dbConfigured = () => Boolean(process.env.POSTGRES_URL);

/** 一覧・平均ともに掲載中（status='published'）の行だけを対象にする。 */
export async function listReviews(targetSlug: string): Promise<Review[]> {
  const { rows } = await sql<Review>`
    SELECT id, target_slug, rating, author_name, comment, created_at
    FROM reviews
    WHERE target_slug = ${targetSlug} AND status = 'published'
    ORDER BY created_at DESC
    LIMIT 100
  `;
  return rows;
}

export async function aggregateReviews(targetSlug: string): Promise<ReviewAggregate> {
  const { rows } = await sql<{ count: string; average: string | null }>`
    SELECT COUNT(*)::text AS count, AVG(rating)::text AS average
    FROM reviews
    WHERE target_slug = ${targetSlug} AND status = 'published'
  `;
  const row = rows[0];
  return {
    count: row ? Number(row.count) : 0,
    average: row?.average ? Number(row.average) : null,
  };
}

export interface NewReview {
  target_slug: string;
  rating: number;
  author_name: string;
  comment: string;
  ip_hash: string | null;
}

export async function insertReview(review: NewReview): Promise<Review> {
  const { rows } = await sql<Review>`
    INSERT INTO reviews (target_slug, rating, author_name, comment, ip_hash)
    VALUES (${review.target_slug}, ${review.rating}, ${review.author_name}, ${review.comment}, ${review.ip_hash})
    RETURNING id, target_slug, rating, author_name, comment, created_at
  `;
  return rows[0];
}

/**
 * 直近 windowMinutes 分で同じ接続元から投稿された件数。
 *
 * サーバレスではインスタンスが使い捨てなのでメモリ上のカウンタは当てにならない。
 * DBで数えるのが確実。
 */
export async function countRecentByIpHash(ipHash: string, windowMinutes: number): Promise<number> {
  const { rows } = await sql<{ count: string }>`
    SELECT COUNT(*)::text AS count
    FROM reviews
    WHERE ip_hash = ${ipHash}
      AND created_at > now() - (${windowMinutes} * INTERVAL '1 minute')
  `;
  return rows[0] ? Number(rows[0].count) : 0;
}

/** 同じジャンルに同じ本文が既にあるか。コピペ連投を弾くのに使う。 */
export async function hasDuplicateComment(targetSlug: string, comment: string): Promise<boolean> {
  const { rows } = await sql<{ count: string }>`
    SELECT COUNT(*)::text AS count
    FROM reviews
    WHERE target_slug = ${targetSlug} AND comment = ${comment}
  `;
  return rows[0] ? Number(rows[0].count) > 0 : false;
}
