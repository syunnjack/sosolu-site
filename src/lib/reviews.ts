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

export async function listReviews(targetSlug: string): Promise<Review[]> {
  const { rows } = await sql<Review>`
    SELECT id, target_slug, rating, author_name, comment, created_at
    FROM reviews
    WHERE target_slug = ${targetSlug}
    ORDER BY created_at DESC
    LIMIT 100
  `;
  return rows;
}

export async function aggregateReviews(targetSlug: string): Promise<ReviewAggregate> {
  const { rows } = await sql<{ count: string; average: string | null }>`
    SELECT COUNT(*)::text AS count, AVG(rating)::text AS average
    FROM reviews
    WHERE target_slug = ${targetSlug}
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
}

export async function insertReview(review: NewReview): Promise<Review> {
  const { rows } = await sql<Review>`
    INSERT INTO reviews (target_slug, rating, author_name, comment)
    VALUES (${review.target_slug}, ${review.rating}, ${review.author_name}, ${review.comment})
    RETURNING id, target_slug, rating, author_name, comment, created_at
  `;
  return rows[0];
}
