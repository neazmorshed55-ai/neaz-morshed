-- ==========================================
-- Create Site Settings Table with Resume PDF Link
-- ==========================================

-- Create site_settings table if not exists
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  primary_color TEXT DEFAULT '#2ecc71',
  secondary_color TEXT DEFAULT '#3498db',
  background_color TEXT DEFAULT '#0b0f1a',
  text_color TEXT DEFAULT '#ffffff',
  font_family TEXT DEFAULT 'Inter',
  heading_font TEXT DEFAULT 'Inter',
  border_radius TEXT DEFAULT '1rem',
  resume_pdf_link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access" ON site_settings;
DROP POLICY IF EXISTS "Allow authenticated users to insert" ON site_settings;
DROP POLICY IF EXISTS "Allow authenticated users to update" ON site_settings;
DROP POLICY IF EXISTS "Allow authenticated users to delete" ON site_settings;

-- Create policies
CREATE POLICY "Allow public read access" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to insert" ON site_settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated users to update" ON site_settings FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated users to delete" ON site_settings FOR DELETE USING (true);

-- Insert default settings with resume PDF link
INSERT INTO site_settings (
  primary_color,
  secondary_color,
  background_color,
  text_color,
  font_family,
  heading_font,
  border_radius,
  resume_pdf_link,
  created_at,
  updated_at
)
SELECT
  '#2ecc71',
  '#3498db',
  '#0b0f1a',
  '#ffffff',
  'Inter',
  'Inter',
  '1rem',
  'https://drive.google.com/file/d/your-file-id/view',
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM site_settings LIMIT 1);

-- Create updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger for updated_at
DROP TRIGGER IF EXISTS update_site_settings_updated_at ON site_settings;
CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Verification query
SELECT id, resume_pdf_link, primary_color, created_at FROM site_settings;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Site settings table created successfully with resume_pdf_link column!';
END $$;
