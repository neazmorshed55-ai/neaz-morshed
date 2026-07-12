-- Video Reviews Setup
-- Run this in Supabase SQL Editor (SQL Editor > New Query)
--
-- Powers the "Video Testimonials" section on /reviews and the
-- Admin Panel > Video Reviews page. Paste a video link in the admin
-- panel and it plays inline on the reviews page.
--
-- Supported links: YouTube, Vimeo, Loom, Google Drive, Google Photos,
-- and direct .mp4 / .webm / .mov URLs.

-- =====================================================
-- STEP 1: Create the video_reviews table
-- =====================================================

CREATE TABLE IF NOT EXISTS video_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),

  -- Who gave the review
  client_name TEXT NOT NULL,
  client_title TEXT,
  client_company TEXT,

  -- Where they are (country_code is the ISO 2-letter code used for the flag)
  country_code TEXT,
  country_name TEXT,
  city TEXT,

  -- The video itself
  video_url TEXT NOT NULL,      -- the link you paste in the admin panel
  thumbnail_url TEXT,           -- optional custom poster; auto-detected if left null
  headline TEXT,                -- optional caption shown over the thumbnail

  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS video_reviews_order_idx
  ON video_reviews (order_index);

-- =====================================================
-- STEP 2: Row Level Security
-- =====================================================
-- The admin panel authenticates in the browser and talks to Supabase with the
-- anon key, so the anon role needs write access here — same as the existing
-- `reviews` table. Visitors only ever read rows where is_active = true.

ALTER TABLE video_reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read active video reviews" ON video_reviews;
DROP POLICY IF EXISTS "Allow insert video reviews" ON video_reviews;
DROP POLICY IF EXISTS "Allow update video reviews" ON video_reviews;
DROP POLICY IF EXISTS "Allow delete video reviews" ON video_reviews;

CREATE POLICY "Public read active video reviews" ON video_reviews
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Allow insert video reviews" ON video_reviews
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow update video reviews" ON video_reviews
  FOR UPDATE
  USING (true);

CREATE POLICY "Allow delete video reviews" ON video_reviews
  FOR DELETE
  USING (true);

-- =====================================================
-- STEP 3: Seed the first video review
-- =====================================================

INSERT INTO video_reviews (
  client_name,
  client_company,
  country_code,
  country_name,
  city,
  video_url,
  rating,
  is_active,
  order_index
) VALUES (
  'David Raff',
  'Savor Our City',
  'US',
  'United States',
  'Florida',
  'https://photos.app.goo.gl/LSNftwHM5AJopvVH7',
  5,
  true,
  1
);

-- =====================================================
-- VERIFICATION
-- =====================================================
SELECT client_name, client_company, country_name, city, video_url, is_active
FROM video_reviews
ORDER BY order_index;
