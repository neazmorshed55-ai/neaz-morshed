-- Create skill_gallery table
CREATE TABLE IF NOT EXISTS skill_gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sub_skill_id UUID NOT NULL REFERENCES sub_skills(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text TEXT,
  type TEXT NOT NULL CHECK (type IN ('image', 'video', 'link')),
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_skill_gallery_sub_skill_id ON skill_gallery(sub_skill_id);
CREATE INDEX IF NOT EXISTS idx_skill_gallery_order ON skill_gallery(sub_skill_id, order_index);

-- Add RLS policies
ALTER TABLE skill_gallery ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public can view skill gallery" ON skill_gallery
  FOR SELECT USING (true);

-- Allow authenticated users to insert
CREATE POLICY "Authenticated users can insert skill gallery" ON skill_gallery
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to update
CREATE POLICY "Authenticated users can update skill gallery" ON skill_gallery
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Allow authenticated users to delete
CREATE POLICY "Authenticated users can delete skill gallery" ON skill_gallery
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_skill_gallery_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER skill_gallery_updated_at
  BEFORE UPDATE ON skill_gallery
  FOR EACH ROW
  EXECUTE FUNCTION update_skill_gallery_updated_at();
