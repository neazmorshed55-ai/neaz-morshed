-- ==========================================
-- Add resume_pdf_link column to existing site_settings table
-- ==========================================

-- Add the resume_pdf_link column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'site_settings'
    AND column_name = 'resume_pdf_link'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN resume_pdf_link TEXT;
    RAISE NOTICE '✅ Column resume_pdf_link added successfully!';
  ELSE
    RAISE NOTICE 'ℹ️  Column resume_pdf_link already exists.';
  END IF;
END $$;

-- Verify the column exists
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'site_settings'
ORDER BY ordinal_position;

-- Show current settings
SELECT id, resume_pdf_link, primary_color, created_at FROM site_settings;
