-- ==========================================
-- Create Settings Table with Resume PDF Link (Fixed)
-- ==========================================

-- Create settings table if not exists
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE,
  value TEXT,
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
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access" ON settings;
DROP POLICY IF EXISTS "Allow authenticated users to insert" ON settings;
DROP POLICY IF EXISTS "Allow authenticated users to update" ON settings;
DROP POLICY IF EXISTS "Allow authenticated users to delete" ON settings;

-- Create policies
CREATE POLICY "Allow public read access" ON settings FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to insert" ON settings FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to update" ON settings FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to delete" ON settings FOR DELETE USING (auth.role() = 'authenticated');

-- Insert default settings with resume PDF link
INSERT INTO settings (
  key,
  value,
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
) VALUES (
  'site_settings',
  'Default Site Settings',
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
)
ON CONFLICT (key) DO NOTHING;

-- Create updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger for updated_at
DROP TRIGGER IF EXISTS update_settings_updated_at ON settings;
CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Verification query
SELECT id, key, resume_pdf_link, primary_color, created_at FROM settings;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Settings table created successfully with resume_pdf_link column!';
END $$;
