-- Admin Panel Database Setup for Supabase
-- Run this in Supabase SQL Editor (SQL Editor > New Query)

-- =====================================================
-- STEP 1: Create Reviews Table
-- =====================================================

CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  client_title TEXT,
  client_company TEXT,
  client_image TEXT,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  platform TEXT DEFAULT 'Fiverr',
  date TEXT,
  is_featured BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- STEP 2: Create Skills Table
-- =====================================================

CREATE TABLE IF NOT EXISTS skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  proficiency INTEGER DEFAULT 80 CHECK (proficiency >= 0 AND proficiency <= 100),
  icon TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- STEP 3: Create Site Settings Table
-- =====================================================

CREATE TABLE IF NOT EXISTS site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  primary_color TEXT DEFAULT '#2ecc71',
  secondary_color TEXT DEFAULT '#3498db',
  background_color TEXT DEFAULT '#0b0f1a',
  text_color TEXT DEFAULT '#ffffff',
  font_family TEXT DEFAULT 'Inter',
  heading_font TEXT DEFAULT 'Inter',
  border_radius TEXT DEFAULT '1rem',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default settings
INSERT INTO site_settings (primary_color, secondary_color, background_color, text_color, font_family, heading_font, border_radius)
VALUES ('#2ecc71', '#3498db', '#0b0f1a', '#ffffff', 'Inter', 'Inter', '1rem')
ON CONFLICT DO NOTHING;

-- =====================================================
-- STEP 4: Create Admin Users Table (Optional - for future use)
-- =====================================================

CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  username TEXT NOT NULL,
  password_hash TEXT, -- For future secure auth
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- Insert default admin users (emails only, auth handled in app)
INSERT INTO admin_users (email, username)
VALUES
  ('neazmd.tamim@gmail.com', 'Admin'),
  ('neazmorshed55@gmail.com', 'Admin')
ON CONFLICT (email) DO NOTHING;

-- =====================================================
-- STEP 5: Enable Row Level Security (Optional)
-- =====================================================

-- Enable RLS on all tables
-- ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
-- CREATE POLICY "Allow public read" ON reviews FOR SELECT USING (true);
-- CREATE POLICY "Allow public read" ON skills FOR SELECT USING (true);
-- CREATE POLICY "Allow public read" ON site_settings FOR SELECT USING (true);

-- =====================================================
-- STEP 6: Sample Reviews Data
-- =====================================================

INSERT INTO reviews (client_name, client_title, client_company, rating, review_text, platform, date, is_featured, order_index)
VALUES
  ('Sarah Mitchell', 'Marketing Director', 'TechStart Inc.', 5, 'Neaz delivered exceptional work on our promotional video. His attention to detail and creative approach exceeded our expectations. Highly recommend!', 'Fiverr', 'January 2025', true, 1),
  ('Michael Chen', 'CEO', 'Digital Solutions Co.', 5, 'Outstanding virtual assistant services. Neaz is incredibly organized, responsive, and always goes above and beyond. A true professional.', 'Upwork', 'December 2024', true, 2),
  ('Emma Thompson', 'Content Manager', 'Creative Agency', 5, 'The content writing and SEO work Neaz provided significantly improved our online presence. Great communication throughout the project.', 'LinkedIn', 'November 2024', false, 3),
  ('David Rodriguez', 'Founder', 'StartUp Hub', 5, 'Neaz helped us build an amazing website. His technical skills combined with creative vision made our project a success.', 'Direct', 'October 2024', true, 4),
  ('Lisa Anderson', 'Project Manager', 'Media Corp', 5, 'Excellent video editing skills! Neaz transformed our raw footage into a professional, engaging final product. Will definitely work with him again.', 'Fiverr', 'September 2024', false, 5);

-- =====================================================
-- STEP 7: Sample Skills Data
-- =====================================================

INSERT INTO skills (name, category, proficiency, order_index)
VALUES
  ('Video Editing', 'Video Production', 95, 1),
  ('Motion Graphics', 'Video Production', 90, 2),
  ('Premiere Pro', 'Video Production', 95, 3),
  ('After Effects', 'Video Production', 88, 4),
  ('DaVinci Resolve', 'Video Production', 85, 5),

  ('Graphic Design', 'Design', 90, 1),
  ('Adobe Photoshop', 'Design', 92, 2),
  ('Adobe Illustrator', 'Design', 85, 3),
  ('Canva', 'Design', 95, 4),
  ('Figma', 'Design', 80, 5),

  ('WordPress', 'Web Development', 90, 1),
  ('Wix', 'Web Development', 95, 2),
  ('Next.js', 'Web Development', 85, 3),
  ('React', 'Web Development', 80, 4),
  ('Tailwind CSS', 'Web Development', 88, 5),

  ('Email Management', 'Virtual Assistance', 95, 1),
  ('Calendar Management', 'Virtual Assistance', 92, 2),
  ('Data Entry', 'Virtual Assistance', 90, 3),
  ('Research', 'Virtual Assistance', 88, 4),

  ('Content Writing', 'Content Creation', 90, 1),
  ('SEO Writing', 'Content Creation', 85, 2),
  ('Blog Writing', 'Content Creation', 88, 3),
  ('Copywriting', 'Content Creation', 85, 4),

  ('ChatGPT', 'AI & Automation', 95, 1),
  ('Claude AI', 'AI & Automation', 92, 2),
  ('AI Video Tools', 'AI & Automation', 88, 3),
  ('Automation Tools', 'AI & Automation', 85, 4);

-- =====================================================
-- STEP 8: Verify the data
-- =====================================================

-- Check reviews
SELECT 'Reviews' as table_name, COUNT(*) as count FROM reviews
UNION ALL
SELECT 'Skills' as table_name, COUNT(*) as count FROM skills
UNION ALL
SELECT 'Site Settings' as table_name, COUNT(*) as count FROM site_settings
UNION ALL
SELECT 'Admin Users' as table_name, COUNT(*) as count FROM admin_users;

-- =====================================================
-- USEFUL QUERIES
-- =====================================================

-- Get all reviews ordered by date
-- SELECT * FROM reviews ORDER BY order_index;

-- Get skills grouped by category
-- SELECT category, array_agg(name ORDER BY order_index) as skills FROM skills GROUP BY category;

-- Update site settings
-- UPDATE site_settings SET primary_color = '#3498db' WHERE id = (SELECT id FROM site_settings LIMIT 1);

-- Add new admin user
-- INSERT INTO admin_users (email, username) VALUES ('new.admin@email.com', 'NewAdmin');
