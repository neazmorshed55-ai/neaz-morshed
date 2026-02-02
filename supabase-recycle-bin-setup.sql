-- Recycle Bin / Soft Delete Setup
-- Run this in Supabase SQL Editor (SQL Editor > New Query)
-- This adds soft delete capability to media_assets table

-- =====================================================
-- STEP 1: Add deleted_at column for soft delete
-- =====================================================

-- Add deleted_at column to media_assets
ALTER TABLE media_assets
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Create index for faster queries on deleted/non-deleted items
CREATE INDEX IF NOT EXISTS idx_media_assets_deleted_at ON media_assets(deleted_at);

-- =====================================================
-- STEP 2: Create helper functions
-- =====================================================

-- Function to soft delete (move to trash)
CREATE OR REPLACE FUNCTION soft_delete_media_asset(asset_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE media_assets
  SET deleted_at = NOW()
  WHERE id = asset_id AND deleted_at IS NULL;
END;
$$ LANGUAGE plpgsql;

-- Function to restore from trash
CREATE OR REPLACE FUNCTION restore_media_asset(asset_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE media_assets
  SET deleted_at = NULL
  WHERE id = asset_id AND deleted_at IS NOT NULL;
END;
$$ LANGUAGE plpgsql;

-- Function to permanently delete (from trash only)
CREATE OR REPLACE FUNCTION permanent_delete_media_asset(asset_id UUID)
RETURNS VOID AS $$
BEGIN
  DELETE FROM media_assets
  WHERE id = asset_id AND deleted_at IS NOT NULL;
END;
$$ LANGUAGE plpgsql;

-- Function to empty trash (delete all items in trash)
CREATE OR REPLACE FUNCTION empty_media_trash()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM media_assets WHERE deleted_at IS NOT NULL;
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Function to auto-delete items older than 30 days in trash (optional)
CREATE OR REPLACE FUNCTION auto_cleanup_media_trash()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM media_assets
  WHERE deleted_at IS NOT NULL
  AND deleted_at < NOW() - INTERVAL '30 days';
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- STEP 3: Create views for easier querying
-- =====================================================

-- View for active (non-deleted) media assets
CREATE OR REPLACE VIEW active_media_assets AS
SELECT * FROM media_assets WHERE deleted_at IS NULL;

-- View for trashed media assets
CREATE OR REPLACE VIEW trashed_media_assets AS
SELECT
  *,
  deleted_at as trashed_at,
  -- Calculate days until permanent deletion (30 day retention)
  30 - EXTRACT(DAY FROM (NOW() - deleted_at))::INTEGER as days_until_deletion
FROM media_assets
WHERE deleted_at IS NOT NULL
ORDER BY deleted_at DESC;

-- =====================================================
-- VERIFICATION: Check if column was added
-- =====================================================

SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'media_assets' AND column_name = 'deleted_at';
