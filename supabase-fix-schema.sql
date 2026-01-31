-- FIX: Add image_url to portfolio_items if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'portfolio_items' AND column_name = 'image_url') THEN
        ALTER TABLE portfolio_items ADD COLUMN image_url TEXT;
    END IF;
END $$;

-- FIX: Create portfolio_gallery table if it doesn't exist
CREATE TABLE IF NOT EXISTS portfolio_gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  portfolio_item_id UUID REFERENCES portfolio_items(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  type TEXT CHECK (type IN ('image', 'video')) DEFAULT 'image',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- FIX: Enable RLS for portfolio_gallery
ALTER TABLE portfolio_gallery ENABLE ROW LEVEL SECURITY;

-- FIX: Drop and Re-create RLS policies for portfolio_gallery to ensure they exist
DROP POLICY IF EXISTS "Public read access for portfolio_gallery" ON portfolio_gallery;
DROP POLICY IF EXISTS "Allow insert for portfolio_gallery" ON portfolio_gallery;
DROP POLICY IF EXISTS "Allow delete for portfolio_gallery" ON portfolio_gallery;

CREATE POLICY "Public read access for portfolio_gallery" ON portfolio_gallery FOR SELECT USING (true);
CREATE POLICY "Allow insert for portfolio_gallery" ON portfolio_gallery FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow delete for portfolio_gallery" ON portfolio_gallery FOR DELETE USING (true);
