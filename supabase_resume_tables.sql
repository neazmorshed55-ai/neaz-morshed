-- ==========================================
-- Resume Management Tables for Supabase
-- ==========================================

-- 1. Resume Personal Info & Settings Table
CREATE TABLE IF NOT EXISTS resume_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 2. Resume Achievement Stats Table
CREATE TABLE IF NOT EXISTS resume_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'Sparkles',
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 3. Resume Skills Table (already exists but let's ensure structure)
CREATE TABLE IF NOT EXISTS resume_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT NOT NULL,
  skills TEXT[] NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 4. Resume Experiences Table
CREATE TABLE IF NOT EXISTS resume_experiences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  location TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  description TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  type TEXT NOT NULL DEFAULT 'full-time' CHECK (type IN ('full-time', 'part-time', 'project')),
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 5. Resume Education Table
CREATE TABLE IF NOT EXISTS resume_education (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  field TEXT NOT NULL,
  location TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  gpa TEXT,
  description TEXT[] DEFAULT ARRAY[]::TEXT[],
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 6. Resume Certifications Table
CREATE TABLE IF NOT EXISTS resume_certifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  issue_date TEXT NOT NULL,
  credential_id TEXT,
  credential_url TEXT,
  description TEXT[] DEFAULT ARRAY[]::TEXT[],
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 7. Resume Capstone Project Table
CREATE TABLE IF NOT EXISTS resume_capstone (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL DEFAULT 'Microcontroller Based Home Automation System Using Bluetooth, GSM, Wi-Fi and DTMF',
  description TEXT NOT NULL DEFAULT 'Neaz Md. Morshed, G M Muid Ur Rahman, Md. Rezaul Karim and Hasan U. Zaman, Proc. 3rd Intl. Conference on Advances in Electrical Engineering (ICAEE''15), pp. 101-104, Dhaka, Bangladesh, December 17-19, 2015',
  year TEXT DEFAULT '2015',
  doi TEXT DEFAULT '10.1109/ICAEE.2015.7506806',
  publication_url TEXT DEFAULT 'https://doi.org/10.1109/ICAEE.2015.7506806',
  badges TEXT[] DEFAULT ARRAY['IEEE Published'],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ==========================================
-- Insert Default Data
-- ==========================================

-- Insert default resume settings (only if table is empty)
INSERT INTO resume_settings (name, title, email, phone, location, linkedin_url, upwork_url, fiverr_url, portfolio_url, pdf_download_url)
SELECT
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
WHERE NOT EXISTS (SELECT 1 FROM resume_settings);

-- Insert default achievement stats
INSERT INTO resume_stats (label, value, icon, order_index)
SELECT * FROM (VALUES
  ('Job Success', '100%', 'Zap', 1),
  ('Hours Completed', '5,000+', 'Sparkles', 2),
  ('Global Clients', '180+', 'Globe', 3),
  ('Years Experience', '12+', 'Briefcase', 4)
) AS v(label, value, icon, order_index)
WHERE NOT EXISTS (SELECT 1 FROM resume_stats);

-- Insert default skills
INSERT INTO resume_skills (category, skills, order_index)
SELECT * FROM (VALUES
  ('Modern Web Stack', ARRAY['Next.js', 'Node.js', 'Supabase (Database & Auth)', 'Vercel (Deployment)', 'React'], 1),
  ('Full-Stack Workflow', ARRAY['Building scalable web applications', 'API integration', 'Cloud databases'], 2),
  ('Administrative & VA', ARRAY['Administrative Support', 'Task Management', 'Email & Calendar Management', 'Database Management'], 3),
  ('Media & Content', ARRAY['Video Production (Premiere Pro, Filmora)', 'Canva', 'Photoshop', 'Social Media Management', 'Content Writing'], 4),
  ('Web & CMS', ARRAY['WordPress', 'Squarespace', 'Wix', 'IONOS', 'HypnoBiz-in-a-Box'], 5),
  ('Sales & Marketing', ARRAY['Technical Sales', 'Lead Generation', 'Marketing Strategy', 'Email Marketing'], 6),
  ('AI & Automation', ARRAY['GenSpark AI', 'ChatGPT', 'DALL-E', 'Eleven Labs', 'Midjourney', 'RunwayML', 'Pictory AI', 'Vizard.ai'], 7)
) AS v(category, skills, order_index)
WHERE NOT EXISTS (SELECT 1 FROM resume_skills);

-- Insert default experiences
INSERT INTO resume_experiences (company, position, location, start_date, end_date, description, type, order_index)
SELECT * FROM (VALUES
  ('Upwork', 'Top Rated Plus Freelancer', 'Remote', 'Sep 2021', 'Present', ARRAY['Maintained 100% Job Success Score across 180+ client projects', 'Delivered web design, video editing, and virtual assistance services', 'Built long-term client relationships with exceptional service quality'], 'full-time', 1),
  ('Fiverr', 'Level 2 Seller', 'Remote', 'Jan 2020', 'Present', ARRAY['Provided administrative support and content creation services', 'Specialized in video production and social media management', 'Achieved Level 2 status through consistent quality delivery'], 'part-time', 2)
) AS v(company, position, location, start_date, end_date, description, type, order_index)
WHERE NOT EXISTS (SELECT 1 FROM resume_experiences);

-- Insert default education
INSERT INTO resume_education (institution, degree, field, location, start_date, end_date, gpa, description, order_index)
SELECT * FROM (VALUES
  ('Ahsanullah University of Science and Technology', 'Bachelor of Science', 'Electrical and Electronic Engineering', 'Dhaka, Bangladesh', '2011', '2015', '3.42/4.00', ARRAY['Published IEEE research paper on home automation systems', 'Focus on embedded systems and IoT technologies'], 1)
) AS v(institution, degree, field, location, start_date, end_date, gpa, description, order_index)
WHERE NOT EXISTS (SELECT 1 FROM resume_education);

-- Insert default certifications
INSERT INTO resume_certifications (title, issuer, issue_date, credential_id, credential_url, description, order_index)
SELECT * FROM (VALUES
  ('Top Rated Plus', 'Upwork', '2023', NULL, 'https://www.upwork.com/freelancers/~01cb6294ba2d3d41d3', ARRAY['Elite freelancer status on Upwork platform', 'Requires 100% Job Success Score and exceptional client feedback'], 1),
  ('Level 2 Seller', 'Fiverr', '2022', NULL, 'https://www.fiverr.com/neaz222', ARRAY['Advanced seller tier on Fiverr platform', 'Achieved through consistent quality and positive reviews'], 2)
) AS v(title, issuer, issue_date, credential_id, credential_url, description, order_index)
WHERE NOT EXISTS (SELECT 1 FROM resume_certifications);

-- Insert default capstone project
INSERT INTO resume_capstone (title, description, year, doi, publication_url, badges)
SELECT
  'Microcontroller Based Home Automation System Using Bluetooth, GSM, Wi-Fi and DTMF',
  'Neaz Md. Morshed, G M Muid Ur Rahman, Md. Rezaul Karim and Hasan U. Zaman, Proc. 3rd Intl. Conference on Advances in Electrical Engineering (ICAEE''15), pp. 101-104, Dhaka, Bangladesh, December 17-19, 2015',
  '2015',
  '10.1109/ICAEE.2015.7506806',
  'https://doi.org/10.1109/ICAEE.2015.7506806',
  ARRAY['IEEE Published']
WHERE NOT EXISTS (SELECT 1 FROM resume_capstone);

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
  NEW.updated_at = TIMEZONE('utc', NOW());
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
