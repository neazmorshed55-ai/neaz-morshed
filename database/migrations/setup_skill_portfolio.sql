-- ============================================
-- Complete Skill Portfolio Database Setup
-- ============================================

-- Create skill_categories table
CREATE TABLE IF NOT EXISTS skill_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sub_skills table
CREATE TABLE IF NOT EXISTS sub_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES skill_categories(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  long_description TEXT,
  cover_image TEXT,
  tools_used TEXT[],
  experience_years TEXT,
  project_count INTEGER DEFAULT 0,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(category_id, slug)
);

-- Create skill_gallery table (if not exists)
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_skill_categories_slug ON skill_categories(slug);
CREATE INDEX IF NOT EXISTS idx_skill_categories_active ON skill_categories(is_active);
CREATE INDEX IF NOT EXISTS idx_sub_skills_category ON sub_skills(category_id);
CREATE INDEX IF NOT EXISTS idx_sub_skills_slug ON sub_skills(category_id, slug);
CREATE INDEX IF NOT EXISTS idx_sub_skills_active ON sub_skills(is_active);
CREATE INDEX IF NOT EXISTS idx_skill_gallery_sub_skill_id ON skill_gallery(sub_skill_id);
CREATE INDEX IF NOT EXISTS idx_skill_gallery_order ON skill_gallery(sub_skill_id, order_index);

-- Enable RLS
ALTER TABLE skill_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE sub_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_gallery ENABLE ROW LEVEL SECURITY;

-- RLS Policies for skill_categories
CREATE POLICY "Public can view skill categories" ON skill_categories
  FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage skill categories" ON skill_categories
  FOR ALL USING (auth.role() = 'authenticated');

-- RLS Policies for sub_skills
CREATE POLICY "Public can view sub skills" ON sub_skills
  FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage sub skills" ON sub_skills
  FOR ALL USING (auth.role() = 'authenticated');

-- RLS Policies for skill_gallery
CREATE POLICY "Public can view skill gallery" ON skill_gallery
  FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage skill gallery" ON skill_gallery
  FOR ALL USING (auth.role() = 'authenticated');

-- Create update triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER skill_categories_updated_at
  BEFORE UPDATE ON skill_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER sub_skills_updated_at
  BEFORE UPDATE ON sub_skills
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER skill_gallery_updated_at
  BEFORE UPDATE ON skill_gallery
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Insert Sample Data
-- ============================================

-- Insert Skill Categories
INSERT INTO skill_categories (title, slug, description, icon, order_index, is_active) VALUES
('Video Production', 'video-production', 'Professional video editing and production services', 'Video', 1, true),
('Graphic Design', 'graphic-design', 'Creative graphic design solutions', 'Palette', 2, true),
('Content Writing', 'content-writing', 'Engaging content creation', 'PenTool', 3, true),
('eBook Formatting', 'ebook-formatting', 'Professional eBook design', 'BookOpen', 4, true),
('Virtual Assistant Service', 'virtual-assistant-service', 'Comprehensive virtual assistance', 'Briefcase', 5, true),
('Social Media Marketing', 'social-media-marketing', 'Strategic social media management', 'Share2', 6, true),
('WordPress Design', 'wordpress-design', 'Custom WordPress solutions', 'Globe', 7, true)
ON CONFLICT (slug) DO NOTHING;

-- Insert Sub Skills for Video Production
INSERT INTO sub_skills (category_id, title, slug, description, long_description, cover_image, tools_used, experience_years, project_count, order_index, is_active)
SELECT
  id,
  'Podcast Creation',
  'podcast-creation',
  'Professional podcast production including recording, editing, and publishing.',
  'I provide end-to-end podcast production services that help you create engaging audio content. From initial recording setup and guidance to professional editing with intro/outro music, noise reduction, and audio enhancement. I also assist with publishing to major platforms like Spotify, Apple Podcasts, and Google Podcasts.',
  'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&q=80&w=1200',
  ARRAY['Adobe Audition', 'Audacity', 'Descript', 'Anchor', 'Riverside.fm'],
  '4+ Years',
  150,
  1,
  true
FROM skill_categories WHERE slug = 'video-production'
ON CONFLICT (category_id, slug) DO NOTHING;

INSERT INTO sub_skills (category_id, title, slug, description, long_description, cover_image, tools_used, experience_years, project_count, order_index, is_active)
SELECT
  id,
  'Subtitle Adding in a Video',
  'subtitle-adding',
  'Accurate subtitle creation and synchronization for videos in multiple languages.',
  'Professional subtitle and caption services to make your video content accessible to a global audience. I provide accurate transcription and translation services with perfect timing synchronization.',
  'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&q=80&w=1200',
  ARRAY['Premiere Pro', 'DaVinci Resolve', 'Subtitle Edit', 'Aegisub'],
  '4+ Years',
  200,
  2,
  true
FROM skill_categories WHERE slug = 'video-production'
ON CONFLICT (category_id, slug) DO NOTHING;

-- Insert Sub Skills for Graphic Design
INSERT INTO sub_skills (category_id, title, slug, description, long_description, cover_image, tools_used, experience_years, project_count, order_index, is_active)
SELECT
  id,
  'Brochure Design',
  'brochure-design',
  'Eye-catching brochure designs for marketing and promotional materials.',
  'Create stunning brochures that captivate your audience and effectively communicate your message. I design professional brochures for various purposes including corporate presentations, product catalogs, and event promotions.',
  'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&q=80&w=1200',
  ARRAY['Adobe InDesign', 'Illustrator', 'Canva', 'Photoshop'],
  '5+ Years',
  300,
  1,
  true
FROM skill_categories WHERE slug = 'graphic-design'
ON CONFLICT (category_id, slug) DO NOTHING;

INSERT INTO sub_skills (category_id, title, slug, description, long_description, cover_image, tools_used, experience_years, project_count, order_index, is_active)
SELECT
  id,
  'YouTube Thumbnail Design',
  'youtube-thumbnail-design',
  'Click-worthy YouTube thumbnails that increase video engagement.',
  'Eye-catching YouTube thumbnails that boost your click-through rate and help your videos stand out. I create thumbnails that are optimized for YouTube algorithm while maintaining your brand consistency.',
  'https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&q=80&w=1200',
  ARRAY['Photoshop', 'Canva', 'Figma'],
  '4+ Years',
  500,
  2,
  true
FROM skill_categories WHERE slug = 'graphic-design'
ON CONFLICT (category_id, slug) DO NOTHING;

INSERT INTO sub_skills (category_id, title, slug, description, long_description, cover_image, tools_used, experience_years, project_count, order_index, is_active)
SELECT
  id,
  'Canva Design',
  'canva-design',
  'Professional designs using Canva for social media, presentations, and more.',
  'Leverage the power of Canva to create stunning visuals for all your needs. From social media posts to presentations, I create professional designs that align with your brand.',
  'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=1200',
  ARRAY['Canva Pro', 'Photoshop'],
  '5+ Years',
  400,
  3,
  true
FROM skill_categories WHERE slug = 'graphic-design'
ON CONFLICT (category_id, slug) DO NOTHING;

INSERT INTO sub_skills (category_id, title, slug, description, long_description, cover_image, tools_used, experience_years, project_count, order_index, is_active)
SELECT
  id,
  'T-shirt and Cup Design',
  'tshirt-cup-design',
  'Creative merchandise designs for t-shirts, mugs, and promotional items.',
  'Unique merchandise designs that make your brand memorable. I create print-ready designs for t-shirts, mugs, and other promotional items.',
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=1200',
  ARRAY['Illustrator', 'Photoshop', 'Printful'],
  '3+ Years',
  200,
  4,
  true
FROM skill_categories WHERE slug = 'graphic-design'
ON CONFLICT (category_id, slug) DO NOTHING;

-- Insert Sub Skills for Content Writing
INSERT INTO sub_skills (category_id, title, slug, description, long_description, cover_image, tools_used, experience_years, project_count, order_index, is_active)
SELECT
  id,
  'Article, Blog, SMM Post Writing',
  'article-blog-writing',
  'Engaging articles, blog posts, and social media content that drives traffic.',
  'Compelling content that engages readers and drives conversions. I write SEO-optimized articles, blog posts, and social media content that resonates with your target audience.',
  'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=1200',
  ARRAY['Grammarly', 'Hemingway', 'Google Docs', 'WordPress'],
  '10+ Years',
  1000,
  1,
  true
FROM skill_categories WHERE slug = 'content-writing'
ON CONFLICT (category_id, slug) DO NOTHING;

INSERT INTO sub_skills (category_id, title, slug, description, long_description, cover_image, tools_used, experience_years, project_count, order_index, is_active)
SELECT
  id,
  'eBook Writing',
  'ebook-writing',
  'Comprehensive eBook writing services from concept to completion.',
  'Transform your ideas into professionally written eBooks. I handle everything from research and outline to writing and editing.',
  'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=1200',
  ARRAY['Google Docs', 'Scrivener', 'Calibre'],
  '5+ Years',
  50,
  2,
  true
FROM skill_categories WHERE slug = 'content-writing'
ON CONFLICT (category_id, slug) DO NOTHING;

-- Insert Sub Skills for eBook Formatting
INSERT INTO sub_skills (category_id, title, slug, description, long_description, cover_image, tools_used, experience_years, project_count, order_index, is_active)
SELECT
  id,
  'eBook Design',
  'ebook-design',
  'Professional eBook formatting and design for Kindle, ePub, and PDF.',
  'Get your eBook ready for publishing with professional formatting that looks great on all devices.',
  'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=1200',
  ARRAY['Calibre', 'Kindle Create', 'InDesign', 'Vellum'],
  '5+ Years',
  100,
  1,
  true
FROM skill_categories WHERE slug = 'ebook-formatting'
ON CONFLICT (category_id, slug) DO NOTHING;

-- Insert Sub Skills for Virtual Assistant
INSERT INTO sub_skills (category_id, title, slug, description, long_description, cover_image, tools_used, experience_years, project_count, order_index, is_active)
SELECT
  id,
  'Lead Generation VA',
  'lead-generation-va',
  'B2B lead research and generation with verified contact information.',
  'High-quality lead generation services that fuel your sales pipeline. I research and compile verified business contacts tailored to your target market.',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200',
  ARRAY['LinkedIn Sales Navigator', 'Apollo.io', 'Hunter.io', 'ZoomInfo'],
  '10+ Years',
  500,
  1,
  true
FROM skill_categories WHERE slug = 'virtual-assistant-service'
ON CONFLICT (category_id, slug) DO NOTHING;

INSERT INTO sub_skills (category_id, title, slug, description, long_description, cover_image, tools_used, experience_years, project_count, order_index, is_active)
SELECT
  id,
  'Web Research VA',
  'web-research-va',
  'Comprehensive web research and data compilation services.',
  'Thorough research services to gather the information you need. I compile data from various sources and present it in organized, actionable formats.',
  'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?auto=format&fit=crop&q=80&w=1200',
  ARRAY['Google', 'LinkedIn', 'Industry Databases', 'Excel'],
  '10+ Years',
  600,
  2,
  true
FROM skill_categories WHERE slug = 'virtual-assistant-service'
ON CONFLICT (category_id, slug) DO NOTHING;

INSERT INTO sub_skills (category_id, title, slug, description, long_description, cover_image, tools_used, experience_years, project_count, order_index, is_active)
SELECT
  id,
  'Job Search VA',
  'job-search-va',
  'Job search assistance including application tracking and research.',
  'Streamline your job search with professional assistance. I help research opportunities, track applications, and organize your job hunt.',
  'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=1200',
  ARRAY['LinkedIn', 'Indeed', 'Glassdoor', 'Excel'],
  '5+ Years',
  200,
  3,
  true
FROM skill_categories WHERE slug = 'virtual-assistant-service'
ON CONFLICT (category_id, slug) DO NOTHING;

INSERT INTO sub_skills (category_id, title, slug, description, long_description, cover_image, tools_used, experience_years, project_count, order_index, is_active)
SELECT
  id,
  'Data Entry',
  'data-entry',
  'Accurate and efficient data entry services.',
  'Fast and accurate data entry services for all your business needs. I handle large volumes of data with precision and attention to detail.',
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1200',
  ARRAY['Excel', 'Google Sheets', 'Microsoft Office'],
  '10+ Years',
  800,
  4,
  true
FROM skill_categories WHERE slug = 'virtual-assistant-service'
ON CONFLICT (category_id, slug) DO NOTHING;

-- Insert Sub Skills for Social Media Marketing
INSERT INTO sub_skills (category_id, title, slug, description, long_description, cover_image, tools_used, experience_years, project_count, order_index, is_active)
SELECT
  id,
  'Social Media Management',
  'social-media-management',
  'Complete social media management across all major platforms.',
  'Full-service social media management that grows your brand. I handle content creation, scheduling, engagement, and analytics across all platforms.',
  'https://images.unsplash.com/photo-1611926653458-09294b3142bf?auto=format&fit=crop&q=80&w=1200',
  ARRAY['Hootsuite', 'Buffer', 'Canva', 'Meta Business Suite'],
  '5+ Years',
  250,
  1,
  true
FROM skill_categories WHERE slug = 'social-media-marketing'
ON CONFLICT (category_id, slug) DO NOTHING;

INSERT INTO sub_skills (category_id, title, slug, description, long_description, cover_image, tools_used, experience_years, project_count, order_index, is_active)
SELECT
  id,
  'Organic Reach and Daily Post',
  'organic-reach-daily-post',
  'Build genuine engagement with organic growth strategies.',
  'Build genuine engagement with organic growth strategies. I create and post content daily to maximize your reach without paid ads.',
  'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&q=80&w=1200',
  ARRAY['Instagram', 'Facebook', 'Twitter', 'LinkedIn'],
  '5+ Years',
  150,
  2,
  true
FROM skill_categories WHERE slug = 'social-media-marketing'
ON CONFLICT (category_id, slug) DO NOTHING;

-- Insert Sub Skills for WordPress Design
INSERT INTO sub_skills (category_id, title, slug, description, long_description, cover_image, tools_used, experience_years, project_count, order_index, is_active)
SELECT
  id,
  'Web Design',
  'web-design',
  'Custom WordPress website design with responsive layouts and modern aesthetics.',
  'Beautiful, functional WordPress websites tailored to your needs. I design and develop responsive sites that look great on all devices.',
  'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&q=80&w=1200',
  ARRAY['WordPress', 'Elementor', 'Divi', 'WooCommerce', 'CSS/HTML'],
  '5+ Years',
  50,
  1,
  true
FROM skill_categories WHERE slug = 'wordpress-design'
ON CONFLICT (category_id, slug) DO NOTHING;
