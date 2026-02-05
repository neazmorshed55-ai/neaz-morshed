-- Add slug field to portfolio_items table
-- Run this in Supabase SQL Editor

-- Step 1: Add slug column
ALTER TABLE portfolio_items
ADD COLUMN IF NOT EXISTS slug TEXT;

-- Step 2: Create unique index on slug within each service
CREATE UNIQUE INDEX IF NOT EXISTS idx_portfolio_items_service_slug
ON portfolio_items(service_id, slug);

-- Step 3: Generate slugs for existing items (optional - run if you have existing data)
-- This creates slugs from titles (lowercase, spaces replaced with hyphens)
UPDATE portfolio_items
SET slug = LOWER(REGEXP_REPLACE(REGEXP_REPLACE(title, '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'))
WHERE slug IS NULL;

-- Step 4: Make slug NOT NULL after populating existing data
-- ALTER TABLE portfolio_items ALTER COLUMN slug SET NOT NULL;

-- Verification: Check the slugs
SELECT id, title, slug FROM portfolio_items ORDER BY created_at DESC;
