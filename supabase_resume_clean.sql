-- ==========================================
-- Resume Management Tables - Clean Install
-- Run this script in Supabase SQL Editor
-- ==========================================

-- First, drop all existing tables if they exist
DROP TABLE IF EXISTS resume_capstone CASCADE;
DROP TABLE IF EXISTS resume_certifications CASCADE;
DROP TABLE IF EXISTS resume_education CASCADE;
DROP TABLE IF EXISTS resume_experiences CASCADE;
DROP TABLE IF EXISTS resume_skills CASCADE;
DROP TABLE IF EXISTS resume_stats CASCADE;
DROP TABLE IF EXISTS resume_settings CASCADE;

-- Drop the trigger function if it exists
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- ==========================================
-- Create Tables
-- ==========================================

-- 1. Resume Personal Info & Settings Table
CREATE TABLE resume_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT 'NEAZ MD. MORSHED',
  title TEXT NOT NULL DEFAULT 'Digital Asset Builder | AI Implementation Engineer',
  email TEXT NOT NULL DEFAULT 'contact@neazmdmorshed.com',
  phone TEXT NOT NULL DEFAULT '+8801775939996',
  location TEXT NOT NULL DEFAULT 'Bashundhara R/A, Dhaka, Bangladesh',
  linkedin_url TEXT DEFAULT 'linkedin.com/in/neazmorshed222',
  upwork_url TEXT DEFAULT 'https://www.upwork.com/freelancers/~01cb6294ba2d3d41d3',
  fiverr_url TEXT DEFAULT 'https://www.fiverr.com/neaz222',
  portfolio_url TEXT DEFAULT 'neaz.pro',
  pdf_download_url TEXT DEFAULT 'https://drive.google.com/uc?export=download&id=1rouYADSZdqaNf74U341XElF_0H57tqtu',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Resume Achievement Stats Table
CREATE TABLE resume_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'Sparkles',
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Resume Skills Table
CREATE TABLE resume_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  skills TEXT[] NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Resume Experiences Table
CREATE TABLE resume_experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  location TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  description TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  type TEXT NOT NULL DEFAULT 'full-time' CHECK (type IN ('full-time', 'part-time', 'project')),
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Resume Education Table
CREATE TABLE resume_education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  field TEXT NOT NULL,
  location TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Resume Certifications Table
CREATE TABLE resume_certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  date TEXT NOT NULL,
  expiry TEXT,
  credential_url TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Resume Capstone Project Table
CREATE TABLE resume_capstone (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL DEFAULT 'Microcontroller Based Home Automation System Using Bluetooth, GSM, Wi-Fi and DTMF',
  description TEXT NOT NULL DEFAULT 'Neaz Md. Morshed, G M Muid Ur Rahman, Md. Rezaul Karim and Hasan U. Zaman, Proc. 3rd Intl. Conference on Advances in Electrical Engineering (ICAEE''15), pp. 101-104, Dhaka, Bangladesh, December 17-19, 2015',
  year TEXT DEFAULT '2015',
  doi TEXT DEFAULT '10.1109/ICAEE.2015.7506806',
  publication_url TEXT DEFAULT 'https://doi.org/10.1109/ICAEE.2015.7506806',
  badges TEXT[] DEFAULT ARRAY['IEEE Published'],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- Insert Default Data
-- ==========================================

-- Insert default resume settings
INSERT INTO resume_settings (name, title, email, phone, location, linkedin_url, upwork_url, fiverr_url, portfolio_url, pdf_download_url)
VALUES (
  'NEAZ MD. MORSHED',
  'Digital Asset Builder | AI Implementation Engineer',
  'contact@neazmdmorshed.com',
  '+8801775939996',
  'Bashundhara R/A, Dhaka, Bangladesh',
  'linkedin.com/in/neazmorshed222',
  'https://www.upwork.com/freelancers/~01cb6294ba2d3d41d3',
  'https://www.fiverr.com/neaz222',
  'neaz.pro',
  'https://drive.google.com/uc?export=download&id=1rouYADSZdqaNf74U341XElF_0H57tqtu'
);

-- Insert default achievement stats
INSERT INTO resume_stats (label, value, icon, order_index) VALUES
  ('Job Success', '100%', 'Zap', 1),
  ('Hours Completed', '5,000+', 'Sparkles', 2),
  ('Global Clients', '180+', 'Globe', 3),
  ('Years Experience', '12+', 'Briefcase', 4);

-- Insert default skills
INSERT INTO resume_skills (category, skills, order_index) VALUES
  ('Modern Web Stack', ARRAY['Next.js', 'Node.js', 'Supabase (Database & Auth)', 'Vercel (Deployment)', 'React'], 1),
  ('Full-Stack Workflow', ARRAY['Building scalable web applications', 'API integration', 'Cloud databases'], 2),
  ('Administrative & VA', ARRAY['Administrative Support', 'Task Management', 'Email & Calendar Management', 'Database Management'], 3),
  ('Media & Content', ARRAY['Video Production (Premiere Pro, Filmora)', 'Canva', 'Photoshop', 'Social Media Management', 'Content Writing'], 4),
  ('Web & CMS', ARRAY['WordPress', 'Squarespace', 'Wix', 'IONOS', 'HypnoBiz-in-a-Box'], 5),
  ('Sales & Marketing', ARRAY['Technical Sales', 'Lead Generation', 'Marketing Strategy', 'Email Marketing'], 6),
  ('AI & Automation', ARRAY['GenSpark AI', 'ChatGPT', 'DALL-E', 'Eleven Labs', 'Midjourney', 'RunwayML', 'Pictory AI', 'Vizard.ai'], 7);

-- Insert default experiences
INSERT INTO resume_experiences (company, position, location, start_date, end_date, description, type, order_index) VALUES
  ('Upwork', 'Top Rated Plus Freelancer', 'Remote', 'Sep 2021', 'Present',
   ARRAY['Maintained 100% Job Success Score across 180+ client projects', 'Delivered web design, video editing, and virtual assistance services', 'Built long-term client relationships with exceptional service quality'],
   'full-time', 1),
  ('Fiverr', 'Level 2 Seller', 'Remote', 'Jan 2020', 'Present',
   ARRAY['Provided administrative support and content creation services', 'Specialized in video production and social media management', 'Achieved Level 2 status through consistent quality delivery'],
   'part-time', 2);

-- Insert default education
INSERT INTO resume_education (institution, degree, field, location, start_date, end_date, order_index) VALUES
  ('American International University-Bangladesh (AIUB)', 'EMBA', 'Management Information Systems (MIS)', 'Dhaka, Bangladesh', 'September 2020', 'December 2021', 1),
  ('North South University', 'B.Sc.', 'Electrical & Electronic Engineering', 'Dhaka, Bangladesh', 'September 2009', 'December 2015', 2),
  ('Dr. Abdur Razzak Municipal College', 'H.S.C', 'Science', 'Jessore Board, Bangladesh', 'September 2007', 'September 2009', 3),
  ('Daud Public School, Jessore Cantonment', 'S.S.C', 'Science', 'Jessore Board, Bangladesh', 'January 1997', 'May 2007', 4);

-- Insert default certifications
INSERT INTO resume_certifications (title, issuer, date, expiry, credential_url, order_index) VALUES
  ('Builders Guide to the AI SDK', 'Vercel', 'January 2026', NULL, NULL, 1),
  ('Next.js App Router Fundamentals', 'Vercel', 'January 2026', NULL, NULL, 2),
  ('Government Certified Freelancer', 'ICT Division Bangladesh Government', 'May 2024', 'May 2025', NULL, 3),
  ('ITES Foundation Skills Training', 'Ernst & Young LLP, India (Certified by George Washington University, USA)', 'May 2024', 'May 2025', NULL, 4),
  ('Social Media Marketing', 'HubSpot Academy', 'February 2024', 'March 2026', NULL, 5);

-- Insert default capstone project
INSERT INTO resume_capstone (title, description, year, doi, publication_url, badges) VALUES (
  'Microcontroller Based Home Automation System Using Bluetooth, GSM, Wi-Fi and DTMF',
  'Neaz Md. Morshed, G M Muid Ur Rahman, Md. Rezaul Karim and Hasan U. Zaman, Proc. 3rd Intl. Conference on Advances in Electrical Engineering (ICAEE''15), pp. 101-104, Dhaka, Bangladesh, December 17-19, 2015',
  '2015',
  '10.1109/ICAEE.2015.7506806',
  'https://doi.org/10.1109/ICAEE.2015.7506806',
  ARRAY['IEEE Published']
);

-- ==========================================
-- Enable Row Level Security (RLS)
-- ==========================================

ALTER TABLE resume_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_education ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_capstone ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access" ON resume_settings FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON resume_stats FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON resume_skills FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON resume_experiences FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON resume_education FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON resume_certifications FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON resume_capstone FOR SELECT USING (true);

-- Create policies for authenticated users (admin) to modify
CREATE POLICY "Allow authenticated users to insert" ON resume_settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated users to update" ON resume_settings FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated users to delete" ON resume_settings FOR DELETE USING (true);

CREATE POLICY "Allow authenticated users to insert" ON resume_stats FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated users to update" ON resume_stats FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated users to delete" ON resume_stats FOR DELETE USING (true);

CREATE POLICY "Allow authenticated users to insert" ON resume_skills FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated users to update" ON resume_skills FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated users to delete" ON resume_skills FOR DELETE USING (true);

CREATE POLICY "Allow authenticated users to insert" ON resume_experiences FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated users to update" ON resume_experiences FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated users to delete" ON resume_experiences FOR DELETE USING (true);

CREATE POLICY "Allow authenticated users to insert" ON resume_education FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated users to update" ON resume_education FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated users to delete" ON resume_education FOR DELETE USING (true);

CREATE POLICY "Allow authenticated users to insert" ON resume_certifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated users to update" ON resume_certifications FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated users to delete" ON resume_certifications FOR DELETE USING (true);

CREATE POLICY "Allow authenticated users to insert" ON resume_capstone FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated users to update" ON resume_capstone FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated users to delete" ON resume_capstone FOR DELETE USING (true);

-- ==========================================
-- Create updated_at trigger function
-- ==========================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_resume_settings_updated_at BEFORE UPDATE ON resume_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_resume_stats_updated_at BEFORE UPDATE ON resume_stats FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_resume_skills_updated_at BEFORE UPDATE ON resume_skills FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_resume_experiences_updated_at BEFORE UPDATE ON resume_experiences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_resume_education_updated_at BEFORE UPDATE ON resume_education FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_resume_certifications_updated_at BEFORE UPDATE ON resume_certifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_resume_capstone_updated_at BEFORE UPDATE ON resume_capstone FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- Verification Query
-- ==========================================

-- Run this after to verify everything worked
SELECT
  'resume_settings' as table_name, COUNT(*) as row_count FROM resume_settings
UNION ALL
SELECT 'resume_stats', COUNT(*) FROM resume_stats
UNION ALL
SELECT 'resume_skills', COUNT(*) FROM resume_skills
UNION ALL
SELECT 'resume_experiences', COUNT(*) FROM resume_experiences
UNION ALL
SELECT 'resume_education', COUNT(*) FROM resume_education
UNION ALL
SELECT 'resume_certifications', COUNT(*) FROM resume_certifications
UNION ALL
SELECT 'resume_capstone', COUNT(*) FROM resume_capstone
ORDER BY table_name;
