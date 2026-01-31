-- Create contacts table for portfolio inquiries
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new'
);

-- Enable Row Level Security (RLS)
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Policy: Allow any anonymous user to insert a contact message (Public form submission)
CREATE POLICY "Allow public insert" ON contacts
  FOR INSERT
  WITH CHECK (true);

-- Policy: Only authenticated admins can view the contact messages
CREATE POLICY "Allow authenticated select" ON contacts
  FOR SELECT
  TO authenticated
  USING (true);

-- Optional: Policy to allow authenticated admins to update/delete if needed
CREATE POLICY "Allow authenticated update" ON contacts
  FOR UPDATE
  TO authenticated
  USING (true);

-- ============================================
-- EXPERIENCE TABLE - Work History Timeline
-- ============================================

CREATE TABLE IF NOT EXISTS experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  description TEXT,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  location TEXT,
  skills TEXT[],
  is_current BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0
);

-- Enable Row Level Security (RLS)
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access (for displaying on portfolio)
CREATE POLICY "Allow public read experiences" ON experiences
  FOR SELECT
  USING (true);

-- Policy: Only authenticated admins can modify experiences
CREATE POLICY "Allow authenticated insert experiences" ON experiences
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update experiences" ON experiences
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated delete experiences" ON experiences
  FOR DELETE
  TO authenticated
  USING (true);

-- Insert hardcoded experience data
INSERT INTO experiences (company, position, description, start_date, end_date, location, skills, is_current, order_index) VALUES
  ('Berger Paints Bangladesh Limited', 'Project Support Engineer', 'Contractual Job. Project Documentation and IT Infrastructure.', 'August 2015', 'December 2015', 'Bangladesh', ARRAY['Project Documentation', 'IT Infrastructure'], false, 1),
  ('Cityscape International Limited', 'IT Associate Engineer', 'Network Administration', 'January 2016', 'December 2016', 'Bangladesh', ARRAY['Network Administration', 'IT Support'], false, 2),
  ('Power Sonic Transformar and Switchgear Co. Ltd.', 'Assistant Engineer', 'Project Survey, Layout design of substation following DESCO and DPDC rules, LT HT meter cable Measurement, Consult with clients about everything before and after getting any substation project.', 'January 2017', 'May 2018', 'Bangladesh', ARRAY['Project Survey', 'Layout Design', 'Client Consultation'], false, 3),
  ('Tritech Building Services Ltd.', 'Client Relationship Manager', 'Project Survey and Reports', 'May 2018', 'January 2020', 'Bangladesh', ARRAY['Project Survey', 'Client Relations', 'Reports'], false, 4),
  ('HJ Visualization', 'Virtual Assistant', 'Remote and Part time Job', 'January 2019', 'December 2023', 'Remote', ARRAY['Virtual Assistance', 'Remote Work'], false, 5),
  ('Tritech Building Services Ltd.', 'Team Leader - Brand & Communication', 'Brand Promotion', 'January 2020', 'October 2022', 'Bangladesh', ARRAY['Brand Promotion', 'Team Leadership', 'Communication'], false, 6),
  ('The Global Council for Anthropological Linguistics - GLOCAL', 'Media and Web Design Coordinator', 'Remote and Full time job. Web development and design for GLOCAL website and three other websites like CALA, COMELA, AFALA, JALA, JOMELA. Skill: Responsive Web Design - Excel - Graphic Design - Problem Solving - WordPress - WordPress Design', 'January 2021', 'December 2022', 'Remote', ARRAY['Responsive Web Design', 'Excel', 'Graphic Design', 'Problem Solving', 'WordPress', 'WordPress Design'], false, 7);

-- ============================================
-- SERVICES TABLE - Service Categories
-- ============================================

CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  cover_image TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read services" ON services
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated manage services" ON services
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Insert default services
INSERT INTO services (title, slug, description, icon, order_index) VALUES
  ('Virtual Assistant', 'virtual-assistant', 'High-level administrative support, including email filtering, scheduling, and custom business workflows.', 'Briefcase', 1),
  ('Data & CRM Mastery', 'data-crm', 'Expert data mining, cleaning, and management across HubSpot, Salesforce, and Zoho.', 'Database', 2),
  ('Lead Generation', 'lead-generation', 'B2B prospect research with verified contact details to fuel your sales pipeline.', 'Target', 3),
  ('Web & Tech Support', 'web-tech-support', 'WordPress customization, Wix site management, and technical troubleshooting.', 'Layout', 4),
  ('Video Production', 'video-production', 'Professional video editing, YouTube management, and content creation.', 'Video', 5),
  ('Market Research', 'market-research', 'In-depth market analysis, competitor research, and industry insights.', 'Search', 6);

-- ============================================
-- PORTFOLIO ITEMS TABLE - Work Samples
-- ============================================

CREATE TABLE IF NOT EXISTS portfolio_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  project_url TEXT,
  client_name TEXT,
  completion_date TEXT,
  tags TEXT[],
  is_featured BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0
);

ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read portfolio" ON portfolio_items
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated manage portfolio" ON portfolio_items
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
