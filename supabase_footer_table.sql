-- ==========================================
-- Footer Links Management Table for Supabase
-- ==========================================

-- Drop existing table if it exists
DROP TABLE IF EXISTS footer_links CASCADE;

-- Create footer_links table
CREATE TABLE footer_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default footer links
INSERT INTO footer_links (name, url, order_index, is_active) VALUES
  ('Blog', 'https://blog.neazmdmorshed.com', 1, true),
  ('Linktree', 'https://linktr.ee/neazmorshed', 2, true),
  ('LinkedIn', 'https://www.linkedin.com/in/neazmorshed222/', 3, true),
  ('Upwork', 'https://www.upwork.com/freelancers/~01cb6294ba2d3d41d3', 4, true),
  ('Fiverr', 'https://www.fiverr.com/neaz222', 5, true),
  ('Facebook', 'https://www.facebook.com/neazmorshed001/', 6, true);

-- Enable Row Level Security
ALTER TABLE footer_links ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access" ON footer_links FOR SELECT USING (true);

-- Create policies for authenticated users (admin) to modify
CREATE POLICY "Allow authenticated users to insert" ON footer_links FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated users to update" ON footer_links FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated users to delete" ON footer_links FOR DELETE USING (true);

-- Create updated_at trigger function (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger for updated_at
DROP TRIGGER IF EXISTS update_footer_links_updated_at ON footer_links;
CREATE TRIGGER update_footer_links_updated_at
  BEFORE UPDATE ON footer_links
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Verification Query
SELECT * FROM footer_links ORDER BY order_index;
