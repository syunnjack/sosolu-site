CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  target_slug TEXT NOT NULL,
  rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  author_name TEXT NOT NULL,
  comment TEXT NOT NULL,
  -- 掲載状態。方針に反する投稿は行を消さずに hidden にして履歴を残す。
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'hidden')),
  -- 連投・スパム対策用。IPそのものではなくソルト付きハッシュを保存する。
  ip_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 既存テーブルへの追加（初回作成時は NOT EXISTS で素通りする）。
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'published';
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS ip_hash TEXT;

-- ジャンルページは「掲載中のものを新しい順」でしか引かないので複合indexにする。
CREATE INDEX IF NOT EXISTS reviews_target_status_created_idx
  ON reviews (target_slug, status, created_at DESC);

-- 連投チェックは ip_hash と時刻で引く。
CREATE INDEX IF NOT EXISTS reviews_ip_hash_created_idx
  ON reviews (ip_hash, created_at DESC);
