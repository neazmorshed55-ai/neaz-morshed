-- Add country and city fields to reviews table
-- Run this in Supabase SQL Editor

-- Add country_code column (ISO 2-letter code for flag emoji)
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS country_code TEXT;

-- Add country_name column (full country name for display)
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS country_name TEXT;

-- Add city column (optional city name)
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS city TEXT;

-- Verify the columns were added
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'reviews'
AND column_name IN ('country_code', 'country_name', 'city');
