-- Alt Text Migration for SEO Optimization
-- Run this in Supabase SQL Editor (SQL Editor > New Query)
-- This adds alt_text columns to all image-related tables

-- =====================================================
-- STEP 1: Add alt_text to portfolio_items table
-- =====================================================

-- Alt text for thumbnail image
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'portfolio_items' AND column_name = 'thumbnail_alt_text') THEN
        ALTER TABLE portfolio_items ADD COLUMN thumbnail_alt_text TEXT;
    END IF;
END $$;

-- Alt text for main image
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'portfolio_items' AND column_name = 'image_alt_text') THEN
        ALTER TABLE portfolio_items ADD COLUMN image_alt_text TEXT;
    END IF;
END $$;

-- =====================================================
-- STEP 2: Add alt_text to portfolio_gallery table
-- =====================================================

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'portfolio_gallery' AND column_name = 'alt_text') THEN
        ALTER TABLE portfolio_gallery ADD COLUMN alt_text TEXT;
    END IF;
END $$;

-- =====================================================
-- STEP 3: Add alt_text to reviews table
-- =====================================================

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reviews' AND column_name = 'client_image_alt_text') THEN
        ALTER TABLE reviews ADD COLUMN client_image_alt_text TEXT;
    END IF;
END $$;

-- =====================================================
-- STEP 4: Add alt_text to blogs table
-- =====================================================

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blogs' AND column_name = 'cover_image_alt_text') THEN
        ALTER TABLE blogs ADD COLUMN cover_image_alt_text TEXT;
    END IF;
END $$;

-- =====================================================
-- STEP 5: Add alt_text to services table
-- =====================================================

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'services' AND column_name = 'cover_image_alt_text') THEN
        ALTER TABLE services ADD COLUMN cover_image_alt_text TEXT;
    END IF;
END $$;

-- =====================================================
-- VERIFICATION: Check if columns were added
-- =====================================================

SELECT 'portfolio_items' as table_name, column_name
FROM information_schema.columns
WHERE table_name = 'portfolio_items' AND column_name LIKE '%alt_text%'
UNION ALL
SELECT 'portfolio_gallery' as table_name, column_name
FROM information_schema.columns
WHERE table_name = 'portfolio_gallery' AND column_name LIKE '%alt_text%'
UNION ALL
SELECT 'reviews' as table_name, column_name
FROM information_schema.columns
WHERE table_name = 'reviews' AND column_name LIKE '%alt_text%'
UNION ALL
SELECT 'blogs' as table_name, column_name
FROM information_schema.columns
WHERE table_name = 'blogs' AND column_name LIKE '%alt_text%'
UNION ALL
SELECT 'services' as table_name, column_name
FROM information_schema.columns
WHERE table_name = 'services' AND column_name LIKE '%alt_text%';
