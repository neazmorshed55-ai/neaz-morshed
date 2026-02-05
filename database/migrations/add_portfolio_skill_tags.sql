-- ============================================
-- Add Skill Tags to Portfolio Gallery
-- ============================================

-- Create junction table for portfolio gallery and skill tags
CREATE TABLE IF NOT EXISTS portfolio_gallery_skill_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  portfolio_gallery_id UUID NOT NULL REFERENCES portfolio_gallery(id) ON DELETE CASCADE,
  sub_skill_id UUID NOT NULL REFERENCES sub_skills(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(portfolio_gallery_id, sub_skill_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_portfolio_gallery_skill_tags_gallery ON portfolio_gallery_skill_tags(portfolio_gallery_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_gallery_skill_tags_skill ON portfolio_gallery_skill_tags(sub_skill_id);

-- Enable RLS
ALTER TABLE portfolio_gallery_skill_tags ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public can view portfolio gallery skill tags" ON portfolio_gallery_skill_tags
  FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage portfolio gallery skill tags" ON portfolio_gallery_skill_tags
  FOR ALL USING (auth.role() = 'authenticated');

-- Function to automatically sync gallery item to skill_gallery when tagged
CREATE OR REPLACE FUNCTION sync_portfolio_to_skill_gallery()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into skill_gallery if not exists
  INSERT INTO skill_gallery (sub_skill_id, url, alt_text, type, order_index)
  SELECT
    NEW.sub_skill_id,
    pg.url,
    pg.alt_text,
    pg.type::TEXT,
    COALESCE((SELECT MAX(order_index) FROM skill_gallery WHERE sub_skill_id = NEW.sub_skill_id), -1) + 1
  FROM portfolio_gallery pg
  WHERE pg.id = NEW.portfolio_gallery_id
  ON CONFLICT DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-sync
DROP TRIGGER IF EXISTS portfolio_gallery_skill_tags_sync ON portfolio_gallery_skill_tags;
CREATE TRIGGER portfolio_gallery_skill_tags_sync
  AFTER INSERT ON portfolio_gallery_skill_tags
  FOR EACH ROW EXECUTE FUNCTION sync_portfolio_to_skill_gallery();
