CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  target_slug TEXT NOT NULL,
  rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  author_name TEXT NOT NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS reviews_target_slug_idx ON reviews (target_slug);
