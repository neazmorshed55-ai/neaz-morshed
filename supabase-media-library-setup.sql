-- Media Library / Digital Asset Management (DAM) Setup
-- Run this in Supabase SQL Editor (SQL Editor > New Query)
-- This creates a media_assets table for managing uploaded files

-- =====================================================
-- STEP 1: Create media_assets table
-- =====================================================

CREATE TABLE IF NOT EXISTS media_assets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- File information
  file_name TEXT NOT NULL,              -- Original file name
  display_name TEXT,                    -- Custom display name (editable)
  file_path TEXT NOT NULL UNIQUE,       -- Storage path in Supabase (e.g., portfolio/image-123.jpg)
  public_url TEXT NOT NULL,             -- Full public URL

  -- SEO & Accessibility
  alt_text TEXT,                        -- Alt text for SEO
  title TEXT,                           -- Title attribute
  caption TEXT,                         -- Optional caption/description

  -- File metadata
  file_size INTEGER,                    -- Size in bytes
  mime_type TEXT,                       -- e.g., image/jpeg, image/png
  width INTEGER,                        -- Image width in pixels
  height INTEGER,                       -- Image height in pixels

  -- Organization
  folder TEXT DEFAULT 'general',        -- Folder/category (portfolio, reviews, blog, etc.)
  tags TEXT[] DEFAULT '{}',             -- Tags for filtering

  -- Usage tracking
  used_in TEXT[] DEFAULT '{}',          -- Where this asset is used (e.g., ['portfolio:uuid1', 'blog:uuid2'])

  -- Timestamps
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Uploaded by (for future multi-user support)
  uploaded_by TEXT DEFAULT 'admin'
);

-- =====================================================
-- STEP 2: Create indexes for faster queries
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_media_assets_folder ON media_assets(folder);
CREATE INDEX IF NOT EXISTS idx_media_assets_file_path ON media_assets(file_path);
CREATE INDEX IF NOT EXISTS idx_media_assets_uploaded_at ON media_assets(uploaded_at DESC);

-- =====================================================
-- STEP 3: Enable RLS and create policies
-- =====================================================

ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Public read access for media_assets" ON media_assets;
DROP POLICY IF EXISTS "Allow insert for media_assets" ON media_assets;
DROP POLICY IF EXISTS "Allow update for media_assets" ON media_assets;
DROP POLICY IF EXISTS "Allow delete for media_assets" ON media_assets;

-- Create policies
CREATE POLICY "Public read access for media_assets" ON media_assets FOR SELECT USING (true);
CREATE POLICY "Allow insert for media_assets" ON media_assets FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update for media_assets" ON media_assets FOR UPDATE USING (true);
CREATE POLICY "Allow delete for media_assets" ON media_assets FOR DELETE USING (true);

-- =====================================================
-- STEP 4: Create updated_at trigger
-- =====================================================

CREATE OR REPLACE FUNCTION update_media_assets_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_media_assets_updated_at ON media_assets;
CREATE TRIGGER update_media_assets_updated_at
  BEFORE UPDATE ON media_assets
  FOR EACH ROW
  EXECUTE FUNCTION update_media_assets_updated_at();

-- =====================================================
-- STEP 5: Helper function to format file size
-- =====================================================

CREATE OR REPLACE FUNCTION format_file_size(bytes INTEGER)
RETURNS TEXT AS $$
BEGIN
  IF bytes IS NULL THEN
    RETURN 'Unknown';
  ELSIF bytes < 1024 THEN
    RETURN bytes || ' B';
  ELSIF bytes < 1024 * 1024 THEN
    RETURN ROUND(bytes::numeric / 1024, 1) || ' KB';
  ELSE
    RETURN ROUND(bytes::numeric / (1024 * 1024), 2) || ' MB';
  END IF;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- VERIFICATION: Check if table was created
-- =====================================================

SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'media_assets'
ORDER BY ordinal_position;
