-- Supabase Analytics & Leads Setup
-- Run this in Supabase SQL Editor

-- =====================================================
-- VISITORS TABLE - Track website visitors
-- =====================================================
CREATE TABLE IF NOT EXISTS visitors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  ip_address TEXT,
  country TEXT,
  country_code TEXT,
  city TEXT,
  region TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  timezone TEXT,
  user_agent TEXT,
  referrer TEXT,
  page_visited TEXT,
  device_type TEXT,
  browser TEXT,
  os TEXT,
  visited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_visitors_visited_at ON visitors(visited_at DESC);
CREATE INDEX IF NOT EXISTS idx_visitors_country ON visitors(country);
CREATE INDEX IF NOT EXISTS idx_visitors_session ON visitors(session_id);

-- =====================================================
-- LEADS TABLE - Store chatbot generated leads
-- =====================================================
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  service_interest TEXT,
  budget TEXT,
  message TEXT,
  source TEXT DEFAULT 'chatbot',
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'lost')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  notes TEXT,
  ip_address TEXT,
  country TEXT,
  city TEXT,
  user_agent TEXT,
  page_url TEXT,
  chat_history JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);

-- =====================================================
-- VISITOR STATS VIEW - Aggregated statistics
-- =====================================================
CREATE OR REPLACE VIEW visitor_stats AS
SELECT
  COUNT(*) as total_visits,
  COUNT(DISTINCT session_id) as unique_visitors,
  COUNT(DISTINCT country) as countries_reached,
  COUNT(*) FILTER (WHERE visited_at > NOW() - INTERVAL '24 hours') as visits_today,
  COUNT(*) FILTER (WHERE visited_at > NOW() - INTERVAL '7 days') as visits_week,
  COUNT(*) FILTER (WHERE visited_at > NOW() - INTERVAL '30 days') as visits_month
FROM visitors;

-- =====================================================
-- COUNTRY STATS VIEW - Visitors by country
-- =====================================================
CREATE OR REPLACE VIEW visitor_countries AS
SELECT
  country,
  country_code,
  COUNT(*) as visit_count,
  COUNT(DISTINCT session_id) as unique_visitors
FROM visitors
WHERE country IS NOT NULL
GROUP BY country, country_code
ORDER BY visit_count DESC;

-- =====================================================
-- DAILY VISITORS VIEW - Daily visitor counts
-- =====================================================
CREATE OR REPLACE VIEW daily_visitors AS
SELECT
  DATE(visited_at) as date,
  COUNT(*) as visits,
  COUNT(DISTINCT session_id) as unique_visitors
FROM visitors
WHERE visited_at > NOW() - INTERVAL '30 days'
GROUP BY DATE(visited_at)
ORDER BY date DESC;

-- =====================================================
-- LEAD STATS VIEW - Lead statistics
-- =====================================================
CREATE OR REPLACE VIEW lead_stats AS
SELECT
  COUNT(*) as total_leads,
  COUNT(*) FILTER (WHERE status = 'new') as new_leads,
  COUNT(*) FILTER (WHERE status = 'contacted') as contacted_leads,
  COUNT(*) FILTER (WHERE status = 'qualified') as qualified_leads,
  COUNT(*) FILTER (WHERE status = 'converted') as converted_leads,
  COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '24 hours') as leads_today,
  COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '7 days') as leads_week
FROM leads;

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Allow public to insert visitors (for tracking)
CREATE POLICY "Allow public insert visitors" ON visitors
  FOR INSERT WITH CHECK (true);

-- Allow authenticated users to view visitors
CREATE POLICY "Allow authenticated view visitors" ON visitors
  FOR SELECT USING (true);

-- Allow public to insert leads (from chatbot)
CREATE POLICY "Allow public insert leads" ON leads
  FOR INSERT WITH CHECK (true);

-- Allow authenticated users full access to leads
CREATE POLICY "Allow authenticated full access leads" ON leads
  FOR ALL USING (true);

-- =====================================================
-- FUNCTION: Update updated_at timestamp
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for leads table
DROP TRIGGER IF EXISTS update_leads_updated_at ON leads;
CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Verify tables
SELECT 'visitors' as table_name, COUNT(*) as row_count FROM visitors
UNION ALL
SELECT 'leads' as table_name, COUNT(*) as row_count FROM leads;
