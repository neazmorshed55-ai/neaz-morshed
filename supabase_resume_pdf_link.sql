-- ==========================================
-- Resume PDF Link Settings
-- ==========================================

-- Add resume_pdf_link column to settings table if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'settings' AND column_name = 'resume_pdf_link'
    ) THEN
        ALTER TABLE settings ADD COLUMN resume_pdf_link TEXT;
    END IF;
END $$;

-- Insert or update the resume PDF link setting
INSERT INTO settings (key, value, resume_pdf_link, updated_at)
VALUES (
    'resume_pdf_link',
    'https://drive.google.com/file/d/your-file-id/view',
    'https://drive.google.com/file/d/your-file-id/view',
    NOW()
)
ON CONFLICT (key)
DO UPDATE SET
    value = EXCLUDED.value,
    resume_pdf_link = EXCLUDED.resume_pdf_link,
    updated_at = NOW();

-- Verification query
SELECT key, value, resume_pdf_link FROM settings WHERE key = 'resume_pdf_link';

-- Note: Update the URL with your actual Google Drive or hosted PDF link
