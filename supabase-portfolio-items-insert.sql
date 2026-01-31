-- Portfolio Items Table Setup for Supabase
-- Run this in Supabase SQL Editor (SQL Editor > New Query)

-- =====================================================
-- STEP 1: Create the portfolio_items table (if not exists)
-- =====================================================

CREATE TABLE IF NOT EXISTS portfolio_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  image_url TEXT,
  video_url TEXT,
  project_url TEXT,
  client_name TEXT,
  completion_date TEXT,
  duration TEXT,
  tools_used TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security) - Optional but recommended
-- ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
-- CREATE POLICY "Allow public read access" ON portfolio_items FOR SELECT USING (true);

-- =====================================================
-- STEP 2: Get service IDs (run this to see your service IDs)
-- =====================================================

-- SELECT id, title, slug FROM services;

-- =====================================================
-- STEP 3: Insert Video Production Portfolio Items (9 items)
-- =====================================================

INSERT INTO portfolio_items (service_id, title, description, thumbnail_url, image_url, video_url, project_url, client_name, completion_date, duration, tools_used, tags, is_featured, order_index)
SELECT
  id,
  'YouTube Channel Intro Animation',
  'Created a dynamic and engaging intro animation for a tech YouTube channel. The animation features modern motion graphics, smooth transitions, and brand-aligned color schemes that capture viewer attention in the first 5 seconds.',
  'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&q=80',
  'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&q=80',
  NULL,
  NULL,
  'Tech Reviews Daily',
  'January 2025',
  '15 seconds',
  ARRAY['After Effects', 'Premiere Pro', 'Illustrator'],
  ARRAY['Motion Graphics', 'YouTube', 'Branding'],
  true,
  1
FROM services WHERE slug = 'video-production';

INSERT INTO portfolio_items (service_id, title, description, thumbnail_url, image_url, video_url, project_url, client_name, completion_date, duration, tools_used, tags, is_featured, order_index)
SELECT
  id,
  'Corporate Promotional Video',
  'Produced a high-quality corporate promotional video showcasing company culture, services, and achievements. Included drone footage, employee interviews, and professional voice-over narration.',
  'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800&q=80',
  'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=1200&q=80',
  NULL,
  NULL,
  'Williams Transportation',
  'February 2025',
  '3 minutes',
  ARRAY['Premiere Pro', 'DaVinci Resolve', 'After Effects'],
  ARRAY['Corporate', 'Promotional', 'Drone Footage'],
  true,
  2
FROM services WHERE slug = 'video-production';

INSERT INTO portfolio_items (service_id, title, description, thumbnail_url, image_url, video_url, project_url, client_name, completion_date, duration, tools_used, tags, is_featured, order_index)
SELECT
  id,
  'Product Launch Video',
  'Crafted an exciting product launch video with 3D product visualization, kinetic typography, and energetic music. The video generated significant engagement on social media platforms.',
  'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=800&q=80',
  'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=1200&q=80',
  NULL,
  NULL,
  'TechStart Inc.',
  'December 2024',
  '1 minute 30 seconds',
  ARRAY['After Effects', 'Cinema 4D', 'Premiere Pro'],
  ARRAY['Product Launch', '3D Animation', 'Social Media'],
  false,
  3
FROM services WHERE slug = 'video-production';

INSERT INTO portfolio_items (service_id, title, description, thumbnail_url, image_url, video_url, project_url, client_name, completion_date, duration, tools_used, tags, is_featured, order_index)
SELECT
  id,
  '8-Hour Relaxation Video',
  'Produced an 8-hour relaxing nature video with ambient sounds for the Aura Relax YouTube channel. Combined royalty-free nature clips with calming audio for sleep and meditation purposes.',
  'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&q=80',
  'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=1200&q=80',
  NULL,
  'https://youtube.com',
  'Aura Relax & Nature Healing Society',
  'November 2024',
  '8 hours',
  ARRAY['Premiere Pro', 'Audacity', 'Storyblocks'],
  ARRAY['Relaxation', 'YouTube', 'Ambient'],
  true,
  4
FROM services WHERE slug = 'video-production';

INSERT INTO portfolio_items (service_id, title, description, thumbnail_url, image_url, video_url, project_url, client_name, completion_date, duration, tools_used, tags, is_featured, order_index)
SELECT
  id,
  'Event Highlight Reel',
  'Created a dynamic highlight reel for the Savor Boca food festival event. Captured the energy, delicious food, and happy attendees in a 2-minute engaging video.',
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80',
  NULL,
  NULL,
  'Savor Our City',
  'October 2024',
  '2 minutes',
  ARRAY['Premiere Pro', 'After Effects', 'LumaFusion'],
  ARRAY['Event', 'Highlight Reel', 'Food Festival'],
  false,
  5
FROM services WHERE slug = 'video-production';

INSERT INTO portfolio_items (service_id, title, description, thumbnail_url, image_url, video_url, project_url, client_name, completion_date, duration, tools_used, tags, is_featured, order_index)
SELECT
  id,
  'Podcast Video Editing',
  'Edited and rendered podcast episodes with professional graphics, lower thirds, and engaging visual elements. Created both full-length episodes and short clips for social media promotion.',
  'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&q=80',
  'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=1200&q=80',
  NULL,
  NULL,
  'Bueno Group',
  'August 2024',
  'Multiple episodes',
  ARRAY['Premiere Pro', 'After Effects', 'Descript'],
  ARRAY['Podcast', 'Video Editing', 'Social Media Clips'],
  false,
  6
FROM services WHERE slug = 'video-production';

INSERT INTO portfolio_items (service_id, title, description, thumbnail_url, image_url, video_url, project_url, client_name, completion_date, duration, tools_used, tags, is_featured, order_index)
SELECT
  id,
  'Quran Translation Videos',
  'Created meaningful Quran translation videos using AI text-to-video software. Carefully selected scenes using precise keywords to match verse meanings and enhance spiritual experience.',
  'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=800&q=80',
  'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=1200&q=80',
  NULL,
  NULL,
  'Zeir App',
  'September 2024',
  'Multiple videos',
  ARRAY['AI Video Tools', 'Premiere Pro', 'After Effects'],
  ARRAY['Religious Content', 'AI Video', 'Translation'],
  false,
  7
FROM services WHERE slug = 'video-production';

INSERT INTO portfolio_items (service_id, title, description, thumbnail_url, image_url, video_url, project_url, client_name, completion_date, duration, tools_used, tags, is_featured, order_index)
SELECT
  id,
  'Social Media Reels Package',
  'Produced a package of 30 short-form vertical videos optimized for Instagram Reels, TikTok, and YouTube Shorts. Each video features trending transitions, text animations, and music sync.',
  'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800&q=80',
  'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=1200&q=80',
  NULL,
  NULL,
  'iPad Art SoCal',
  'November 2024',
  '15-60 seconds each',
  ARRAY['Premiere Pro', 'CapCut', 'Canva'],
  ARRAY['Social Media', 'Reels', 'Short Form'],
  true,
  8
FROM services WHERE slug = 'video-production';

INSERT INTO portfolio_items (service_id, title, description, thumbnail_url, image_url, video_url, project_url, client_name, completion_date, duration, tools_used, tags, is_featured, order_index)
SELECT
  id,
  'Training Video Series',
  'Developed a comprehensive training video series for internal company use. Includes screen recordings, presenter footage, animated explanations, and interactive elements.',
  'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800&q=80',
  'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=1200&q=80',
  NULL,
  NULL,
  'Release Media Inc.',
  'July 2024',
  '10 videos, 5-10 min each',
  ARRAY['Camtasia', 'Premiere Pro', 'After Effects'],
  ARRAY['Training', 'Corporate', 'Educational'],
  false,
  9
FROM services WHERE slug = 'video-production';

-- =====================================================
-- STEP 4: Insert Graphic Design Portfolio Items (6 items)
-- =====================================================

INSERT INTO portfolio_items (service_id, title, description, thumbnail_url, image_url, video_url, project_url, client_name, completion_date, duration, tools_used, tags, is_featured, order_index)
SELECT
  id,
  'Brand Identity Package',
  'Complete brand identity design including logo, business cards, letterhead, and brand guidelines for a tech startup. Created a modern, memorable visual identity.',
  'https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?w=800&q=80',
  'https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?w=1200&q=80',
  NULL,
  NULL,
  'TechStart Inc.',
  'December 2024',
  '2 weeks',
  ARRAY['Adobe Illustrator', 'Photoshop', 'Canva'],
  ARRAY['Logo Design', 'Branding', 'Identity'],
  true,
  1
FROM services WHERE slug = 'graphic-design';

INSERT INTO portfolio_items (service_id, title, description, thumbnail_url, image_url, video_url, project_url, client_name, completion_date, duration, tools_used, tags, is_featured, order_index)
SELECT
  id,
  'Social Media Graphics Pack',
  'Designed 50+ social media graphics including post templates, story templates, and highlight covers for Instagram, Facebook, and LinkedIn.',
  'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80',
  'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&q=80',
  NULL,
  NULL,
  'Do it Digital',
  'November 2024',
  '1 week',
  ARRAY['Canva', 'Adobe Photoshop', 'Figma'],
  ARRAY['Social Media', 'Templates', 'Graphics'],
  true,
  2
FROM services WHERE slug = 'graphic-design';

INSERT INTO portfolio_items (service_id, title, description, thumbnail_url, image_url, video_url, project_url, client_name, completion_date, duration, tools_used, tags, is_featured, order_index)
SELECT
  id,
  'Presentation Design',
  'Created professional PowerPoint and Google Slides presentations with custom graphics, infographics, and data visualizations for corporate clients.',
  'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80',
  'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&q=80',
  NULL,
  NULL,
  'HJ Visualization',
  'October 2024',
  '3 days',
  ARRAY['PowerPoint', 'Google Slides', 'Canva'],
  ARRAY['Presentation', 'Corporate', 'Infographics'],
  false,
  3
FROM services WHERE slug = 'graphic-design';

INSERT INTO portfolio_items (service_id, title, description, thumbnail_url, image_url, video_url, project_url, client_name, completion_date, duration, tools_used, tags, is_featured, order_index)
SELECT
  id,
  'Marketing Banners & Ads',
  'Designed eye-catching digital banners and ad creatives for Google Ads, Facebook Ads, and display advertising campaigns.',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80',
  NULL,
  NULL,
  'ARO Commerce',
  'September 2024',
  '5 days',
  ARRAY['Photoshop', 'Canva', 'Figma'],
  ARRAY['Advertising', 'Banners', 'Marketing'],
  false,
  4
FROM services WHERE slug = 'graphic-design';

INSERT INTO portfolio_items (service_id, title, description, thumbnail_url, image_url, video_url, project_url, client_name, completion_date, duration, tools_used, tags, is_featured, order_index)
SELECT
  id,
  'Event Promotional Materials',
  'Complete event branding including flyers, posters, tickets, and social media graphics for the Savor Boca food festival.',
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80',
  NULL,
  NULL,
  'Savor Our City',
  'August 2024',
  '1 week',
  ARRAY['Adobe Illustrator', 'Photoshop', 'InDesign'],
  ARRAY['Event', 'Flyers', 'Posters'],
  true,
  5
FROM services WHERE slug = 'graphic-design';

INSERT INTO portfolio_items (service_id, title, description, thumbnail_url, image_url, video_url, project_url, client_name, completion_date, duration, tools_used, tags, is_featured, order_index)
SELECT
  id,
  'Email Signature Design',
  'Created professional HTML email signatures with consistent branding for entire teams, including clickable social icons and contact information.',
  'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=800&q=80',
  'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=1200&q=80',
  NULL,
  NULL,
  'Multiple Clients',
  'Ongoing',
  'Per project',
  ARRAY['HTML', 'Photoshop', 'Canva'],
  ARRAY['Email', 'Branding', 'Corporate'],
  false,
  6
FROM services WHERE slug = 'graphic-design';

-- =====================================================
-- STEP 5: Insert Content Writing Portfolio Items (6 items)
-- =====================================================

INSERT INTO portfolio_items (service_id, title, description, thumbnail_url, image_url, video_url, project_url, client_name, completion_date, duration, tools_used, tags, is_featured, order_index)
SELECT
  id,
  'Blog Content Strategy',
  'Developed and executed a comprehensive blog content strategy with 50+ SEO-optimized articles, increasing organic traffic by 200%.',
  'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80',
  'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&q=80',
  NULL,
  NULL,
  'Release Media Inc.',
  'January 2025',
  'Ongoing',
  ARRAY['WordPress', 'Grammarly', 'SEMrush', 'AI Tools'],
  ARRAY['Blog Writing', 'SEO', 'Content Strategy'],
  true,
  1
FROM services WHERE slug = 'content-writing';

INSERT INTO portfolio_items (service_id, title, description, thumbnail_url, image_url, video_url, project_url, client_name, completion_date, duration, tools_used, tags, is_featured, order_index)
SELECT
  id,
  'Website Copywriting',
  'Wrote compelling website copy for multiple business websites including homepage, about, services, and landing pages that convert visitors.',
  'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80',
  'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&q=80',
  NULL,
  NULL,
  'TBC Websites',
  'December 2025',
  '25+ websites',
  ARRAY['Google Docs', 'Hemingway', 'ChatGPT', 'Claude'],
  ARRAY['Copywriting', 'Website', 'Conversion'],
  true,
  2
FROM services WHERE slug = 'content-writing';

INSERT INTO portfolio_items (service_id, title, description, thumbnail_url, image_url, video_url, project_url, client_name, completion_date, duration, tools_used, tags, is_featured, order_index)
SELECT
  id,
  'Product Descriptions',
  'Created engaging product descriptions for e-commerce stores, optimized for both SEO and conversion with compelling calls-to-action.',
  'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
  'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80',
  NULL,
  NULL,
  'Malaysian Super Shop',
  'September 2024',
  '500+ products',
  ARRAY['Google Sheets', 'AI Writing Tools', 'Grammarly'],
  ARRAY['E-commerce', 'Product Copy', 'SEO'],
  false,
  3
FROM services WHERE slug = 'content-writing';

INSERT INTO portfolio_items (service_id, title, description, thumbnail_url, image_url, video_url, project_url, client_name, completion_date, duration, tools_used, tags, is_featured, order_index)
SELECT
  id,
  'AI-Assisted Content Creation',
  'Leveraged AI tools including Claude and ChatGPT to produce high-quality content at scale while maintaining brand voice and accuracy.',
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80',
  NULL,
  NULL,
  'Webkonsult AS',
  'July 2024',
  '4 months',
  ARRAY['Claude AI', 'ChatGPT', 'TextBuilder AI'],
  ARRAY['AI Content', 'Automation', 'Scale'],
  true,
  4
FROM services WHERE slug = 'content-writing';

INSERT INTO portfolio_items (service_id, title, description, thumbnail_url, image_url, video_url, project_url, client_name, completion_date, duration, tools_used, tags, is_featured, order_index)
SELECT
  id,
  'Email Marketing Copy',
  'Wrote email sequences including welcome series, promotional campaigns, and newsletters with high open and click-through rates.',
  'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80',
  'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&q=80',
  NULL,
  NULL,
  'Suson Essentials',
  'February 2024',
  '5 months',
  ARRAY['Constant Contact', 'Mailchimp', 'Google Docs'],
  ARRAY['Email Marketing', 'Copywriting', 'Newsletters'],
  false,
  5
FROM services WHERE slug = 'content-writing';

INSERT INTO portfolio_items (service_id, title, description, thumbnail_url, image_url, video_url, project_url, client_name, completion_date, duration, tools_used, tags, is_featured, order_index)
SELECT
  id,
  'Press Releases & Articles',
  'Authored press releases, news articles, and infographics for media distribution, helping clients gain visibility and backlinks.',
  'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80',
  'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&q=80',
  NULL,
  NULL,
  'Release Media Inc.',
  'Ongoing',
  'Multiple projects',
  ARRAY['Google Docs', 'Canva', 'PR Distribution'],
  ARRAY['Press Release', 'PR', 'Media'],
  false,
  6
FROM services WHERE slug = 'content-writing';

-- =====================================================
-- STEP 6: Insert eBook Design Portfolio Items (5 items)
-- =====================================================

INSERT INTO portfolio_items (service_id, title, description, thumbnail_url, image_url, video_url, project_url, client_name, completion_date, duration, tools_used, tags, is_featured, order_index)
SELECT
  id,
  'Kindle eBook Formatting',
  'Professional Kindle eBook formatting with proper chapter navigation, table of contents, and optimized images for various Kindle devices.',
  'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80',
  'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1200&q=80',
  NULL,
  NULL,
  'Multiple Authors',
  'Ongoing',
  '50+ books',
  ARRAY['Kindle Create', 'Calibre', 'Adobe InDesign'],
  ARRAY['Kindle', 'eBook', 'Formatting'],
  true,
  1
FROM services WHERE slug = 'ebook-design';

INSERT INTO portfolio_items (service_id, title, description, thumbnail_url, image_url, video_url, project_url, client_name, completion_date, duration, tools_used, tags, is_featured, order_index)
SELECT
  id,
  'Interactive PDF eBook',
  'Designed interactive PDF eBooks with clickable table of contents, hyperlinks, embedded videos, and professional layouts.',
  'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80',
  'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&q=80',
  NULL,
  NULL,
  'iPad Art SoCal',
  'November 2024',
  '1 week',
  ARRAY['Adobe InDesign', 'Canva', 'Acrobat Pro'],
  ARRAY['PDF', 'Interactive', 'Design'],
  true,
  2
FROM services WHERE slug = 'ebook-design';

INSERT INTO portfolio_items (service_id, title, description, thumbnail_url, image_url, video_url, project_url, client_name, completion_date, duration, tools_used, tags, is_featured, order_index)
SELECT
  id,
  'ePub Conversion',
  'Converted manuscripts to ePub format for Apple Books, Kobo, and other platforms with proper metadata and formatting.',
  'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80',
  'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1200&q=80',
  NULL,
  NULL,
  'Self-Published Authors',
  'Ongoing',
  '30+ books',
  ARRAY['Sigil', 'Calibre', 'Vellum'],
  ARRAY['ePub', 'Conversion', 'Publishing'],
  false,
  3
FROM services WHERE slug = 'ebook-design';

INSERT INTO portfolio_items (service_id, title, description, thumbnail_url, image_url, video_url, project_url, client_name, completion_date, duration, tools_used, tags, is_featured, order_index)
SELECT
  id,
  'eBook Cover Design',
  'Created eye-catching eBook covers that stand out in online marketplaces, following platform guidelines and genre conventions.',
  'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=800&q=80',
  'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=1200&q=80',
  NULL,
  NULL,
  'Various Authors',
  'Ongoing',
  'Per project',
  ARRAY['Photoshop', 'Canva', 'Illustrator'],
  ARRAY['Cover Design', 'Graphics', 'Marketing'],
  true,
  4
FROM services WHERE slug = 'ebook-design';

INSERT INTO portfolio_items (service_id, title, description, thumbnail_url, image_url, video_url, project_url, client_name, completion_date, duration, tools_used, tags, is_featured, order_index)
SELECT
  id,
  'Lead Magnet eBook',
  'Designed professional lead magnet eBooks for email marketing funnels with branded layouts and compelling visuals.',
  'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=800&q=80',
  'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=1200&q=80',
  NULL,
  NULL,
  'Marketing Agencies',
  'Ongoing',
  'Per project',
  ARRAY['Canva', 'InDesign', 'Photoshop'],
  ARRAY['Lead Magnet', 'Marketing', 'Design'],
  false,
  5
FROM services WHERE slug = 'ebook-design';

-- =====================================================
-- STEP 7: Insert Virtual Assistant Portfolio Items (6 items)
-- =====================================================

INSERT INTO portfolio_items (service_id, title, description, thumbnail_url, image_url, video_url, project_url, client_name, completion_date, duration, tools_used, tags, is_featured, order_index)
SELECT
  id,
  'Executive Calendar Management',
  'Managed complex calendars for multiple executives, coordinating meetings across time zones, handling rescheduling, and ensuring optimal time allocation.',
  'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&q=80',
  'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=1200&q=80',
  NULL,
  NULL,
  'Joey Guillory',
  'October 2023',
  '10 months',
  ARRAY['Google Calendar', 'Calendly', 'Slack'],
  ARRAY['Calendar Management', 'Executive Support', 'Scheduling'],
  true,
  1
FROM services WHERE slug = 'virtual-assistant';

INSERT INTO portfolio_items (service_id, title, description, thumbnail_url, image_url, video_url, project_url, client_name, completion_date, duration, tools_used, tags, is_featured, order_index)
SELECT
  id,
  'Email Inbox Zero Management',
  'Implemented inbox zero methodology, categorizing and responding to hundreds of emails daily, creating templates, and maintaining organized email systems.',
  'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=800&q=80',
  'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=1200&q=80',
  NULL,
  NULL,
  'Multiple Clients',
  'Ongoing',
  'Continuous',
  ARRAY['Gmail', 'Outlook', 'Superhuman'],
  ARRAY['Email Management', 'Organization', 'Communication'],
  false,
  2
FROM services WHERE slug = 'virtual-assistant';

INSERT INTO portfolio_items (service_id, title, description, thumbnail_url, image_url, video_url, project_url, client_name, completion_date, duration, tools_used, tags, is_featured, order_index)
SELECT
  id,
  'Job Application Management',
  'Managed job applications via LinkedIn, Indeed, and Google Jobs, helping clients secure positions including roles at Hilton hotels.',
  'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80',
  'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200&q=80',
  NULL,
  NULL,
  'Joey Guillory',
  'October 2023',
  '10 months',
  ARRAY['LinkedIn', 'Indeed', 'Lazy App', 'Google Jobs'],
  ARRAY['Job Search', 'Applications', 'Career Support'],
  true,
  3
FROM services WHERE slug = 'virtual-assistant';

INSERT INTO portfolio_items (service_id, title, description, thumbnail_url, image_url, video_url, project_url, client_name, completion_date, duration, tools_used, tags, is_featured, order_index)
SELECT
  id,
  'Travel & Event Planning',
  'Coordinated travel arrangements including flights, hotels, and itineraries, plus organized corporate events and meetings.',
  'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80',
  'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&q=80',
  NULL,
  NULL,
  'Multiple Executives',
  'Ongoing',
  'Per project',
  ARRAY['Google Flights', 'Booking.com', 'TripIt'],
  ARRAY['Travel', 'Event Planning', 'Coordination'],
  false,
  4
FROM services WHERE slug = 'virtual-assistant';

INSERT INTO portfolio_items (service_id, title, description, thumbnail_url, image_url, video_url, project_url, client_name, completion_date, duration, tools_used, tags, is_featured, order_index)
SELECT
  id,
  'Data Entry & Research',
  'Conducted extensive online research, data compilation, spreadsheet management, and vendor sourcing for various business needs.',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
  NULL,
  NULL,
  'Do it Digital',
  'Ongoing',
  'Continuous',
  ARRAY['Google Sheets', 'Excel', 'Airtable'],
  ARRAY['Data Entry', 'Research', 'Spreadsheets'],
  false,
  5
FROM services WHERE slug = 'virtual-assistant';

INSERT INTO portfolio_items (service_id, title, description, thumbnail_url, image_url, video_url, project_url, client_name, completion_date, duration, tools_used, tags, is_featured, order_index)
SELECT
  id,
  'Administrative Support',
  'Comprehensive administrative support including document preparation, file organization, CRM management, and general office tasks.',
  'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80',
  'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&q=80',
  NULL,
  NULL,
  'GLOCAL, University of London',
  'December 2022',
  '2 years',
  ARRAY['Google Workspace', 'Microsoft Office', 'Notion'],
  ARRAY['Admin Support', 'Documentation', 'Organization'],
  true,
  6
FROM services WHERE slug = 'virtual-assistant';

-- =====================================================
-- STEP 8: Insert Social Media Marketing Portfolio Items (6 items)
-- =====================================================

INSERT INTO portfolio_items (service_id, title, description, thumbnail_url, image_url, video_url, project_url, client_name, completion_date, duration, tools_used, tags, is_featured, order_index)
SELECT
  id,
  'Instagram Growth Strategy',
  'Developed and executed Instagram growth strategy achieving 300% follower increase through organic content, engagement tactics, and hashtag optimization.',
  'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800&q=80',
  'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=1200&q=80',
  NULL,
  NULL,
  'iPad Art SoCal',
  'November 2024',
  'Ongoing',
  ARRAY['Instagram', 'Later', 'Canva', 'Hashtag Expert'],
  ARRAY['Instagram', 'Growth', 'Organic'],
  true,
  1
FROM services WHERE slug = 'social-media-marketing';

INSERT INTO portfolio_items (service_id, title, description, thumbnail_url, image_url, video_url, project_url, client_name, completion_date, duration, tools_used, tags, is_featured, order_index)
SELECT
  id,
  'Multi-Platform Management',
  'Managed social media presence across Facebook, Instagram, LinkedIn, and Twitter with consistent branding and content calendars.',
  'https://images.unsplash.com/photo-1562577309-4932fdd64cd1?w=800&q=80',
  'https://images.unsplash.com/photo-1562577309-4932fdd64cd1?w=1200&q=80',
  NULL,
  NULL,
  'Do it Digital',
  'Ongoing',
  'Continuous',
  ARRAY['Buffer', 'Hootsuite', 'Canva', 'Meta Business'],
  ARRAY['Multi-Platform', 'Content Calendar', 'Management'],
  true,
  2
FROM services WHERE slug = 'social-media-marketing';

INSERT INTO portfolio_items (service_id, title, description, thumbnail_url, image_url, video_url, project_url, client_name, completion_date, duration, tools_used, tags, is_featured, order_index)
SELECT
  id,
  'YouTube Channel Management',
  'Complete YouTube channel management including video uploads, SEO optimization, thumbnail design, and community engagement.',
  'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&q=80',
  'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=1200&q=80',
  NULL,
  'https://youtube.com',
  'Aura Relax & Nature Healing Society',
  'Ongoing',
  '4+ years',
  ARRAY['YouTube Studio', 'TubeBuddy', 'Canva', 'VidIQ'],
  ARRAY['YouTube', 'Video SEO', 'Channel Growth'],
  true,
  3
FROM services WHERE slug = 'social-media-marketing';

INSERT INTO portfolio_items (service_id, title, description, thumbnail_url, image_url, video_url, project_url, client_name, completion_date, duration, tools_used, tags, is_featured, order_index)
SELECT
  id,
  'Facebook Business Page Setup',
  'Set up and optimized Facebook Business pages with complete branding, automated responses, and content strategy implementation.',
  'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&q=80',
  'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=1200&q=80',
  NULL,
  NULL,
  'Williams Transportation',
  'January 2025',
  'Ongoing',
  ARRAY['Meta Business Suite', 'Canva', 'Facebook Ads'],
  ARRAY['Facebook', 'Business Page', 'Setup'],
  false,
  4
FROM services WHERE slug = 'social-media-marketing';

INSERT INTO portfolio_items (service_id, title, description, thumbnail_url, image_url, video_url, project_url, client_name, completion_date, duration, tools_used, tags, is_featured, order_index)
SELECT
  id,
  'LinkedIn Marketing Campaign',
  'Executed B2B LinkedIn marketing campaigns including content creation, connection outreach, and thought leadership positioning.',
  'https://images.unsplash.com/photo-1611944212129-29977ae1398c?w=800&q=80',
  'https://images.unsplash.com/photo-1611944212129-29977ae1398c?w=1200&q=80',
  NULL,
  NULL,
  'Multiple B2B Clients',
  'Ongoing',
  'Per campaign',
  ARRAY['LinkedIn', 'Sales Navigator', 'Canva'],
  ARRAY['LinkedIn', 'B2B', 'Lead Generation'],
  false,
  5
FROM services WHERE slug = 'social-media-marketing';

INSERT INTO portfolio_items (service_id, title, description, thumbnail_url, image_url, video_url, project_url, client_name, completion_date, duration, tools_used, tags, is_featured, order_index)
SELECT
  id,
  'Social Media Content Creation',
  'Created engaging social media content including graphics, captions, reels, and stories that drive engagement and brand awareness.',
  'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=800&q=80',
  'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=1200&q=80',
  NULL,
  NULL,
  'White Serpent Wisdom',
  'Ongoing',
  'Continuous',
  ARRAY['Canva', 'CapCut', 'Adobe Express'],
  ARRAY['Content Creation', 'Reels', 'Stories'],
  false,
  6
FROM services WHERE slug = 'social-media-marketing';

-- =====================================================
-- STEP 9: Insert Web Design Portfolio Items (6 items)
-- =====================================================

INSERT INTO portfolio_items (service_id, title, description, thumbnail_url, image_url, video_url, project_url, client_name, completion_date, duration, tools_used, tags, is_featured, order_index)
SELECT
  id,
  'Transportation Company Website',
  'Developed a modern, responsive website for Williams Transportation with online booking system, fleet showcase, and contact integration.',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80',
  NULL,
  'https://wtransportsolution.com',
  'Williams Transportation',
  'January 2025',
  '3 weeks',
  ARRAY['Next.js', 'Tailwind CSS', 'Vercel'],
  ARRAY['Corporate Website', 'Responsive', 'Booking System'],
  true,
  1
FROM services WHERE slug = 'web-design';

INSERT INTO portfolio_items (service_id, title, description, thumbnail_url, image_url, video_url, project_url, client_name, completion_date, duration, tools_used, tags, is_featured, order_index)
SELECT
  id,
  'Catering Business Website',
  'Created an elegant website for a catering company featuring menu showcase, event gallery, testimonials, and quote request system.',
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=80',
  NULL,
  'https://thesoleingredientcatering.com',
  'The Sole Ingredient Catering LLC',
  'January 2025',
  '2 weeks',
  ARRAY['Next.js', 'Supabase', 'Tailwind CSS'],
  ARRAY['Restaurant', 'Catering', 'Food Business'],
  true,
  2
FROM services WHERE slug = 'web-design';

INSERT INTO portfolio_items (service_id, title, description, thumbnail_url, image_url, video_url, project_url, client_name, completion_date, duration, tools_used, tags, is_featured, order_index)
SELECT
  id,
  'WordPress Website Management',
  'Developed and maintained multiple WordPress websites including GLOCAL and related academic sites with custom themes and plugins.',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80',
  NULL,
  NULL,
  'GLOCAL, University of London',
  'December 2022',
  '2 years',
  ARRAY['WordPress', 'Elementor', 'WooCommerce'],
  ARRAY['WordPress', 'CMS', 'Academic'],
  true,
  3
FROM services WHERE slug = 'web-design';

INSERT INTO portfolio_items (service_id, title, description, thumbnail_url, image_url, video_url, project_url, client_name, completion_date, duration, tools_used, tags, is_featured, order_index)
SELECT
  id,
  'Wix Website Collection',
  'Designed 25+ websites using Wix platform with modern templates, custom designs, and integrated features for various businesses.',
  'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=80',
  'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1200&q=80',
  NULL,
  NULL,
  'TBC Websites',
  'Ongoing',
  '25+ sites',
  ARRAY['Wix', 'Wix ADI', 'Wix Editor'],
  ARRAY['Wix', 'Website Builder', 'Small Business'],
  false,
  4
FROM services WHERE slug = 'web-design';

INSERT INTO portfolio_items (service_id, title, description, thumbnail_url, image_url, video_url, project_url, client_name, completion_date, duration, tools_used, tags, is_featured, order_index)
SELECT
  id,
  'Squarespace Website Design',
  'Created professional Squarespace websites for creative professionals with portfolio galleries, booking systems, and e-commerce features.',
  'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=800&q=80',
  'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=1200&q=80',
  NULL,
  NULL,
  'iPad Art SoCal',
  'November 2024',
  '1 week',
  ARRAY['Squarespace', 'Adobe Fonts', 'Unsplash'],
  ARRAY['Squarespace', 'Portfolio', 'Creative'],
  false,
  5
FROM services WHERE slug = 'web-design';

INSERT INTO portfolio_items (service_id, title, description, thumbnail_url, image_url, video_url, project_url, client_name, completion_date, duration, tools_used, tags, is_featured, order_index)
SELECT
  id,
  'Hypnobiz Website',
  'Built a complete website using Hypnobiz platform with booking integration, service pages, and client management features.',
  'https://images.unsplash.com/photo-1522542550221-31fd8575f4f4?w=800&q=80',
  'https://images.unsplash.com/photo-1522542550221-31fd8575f4f4?w=1200&q=80',
  NULL,
  'https://white-serpent-tradition.com',
  'White Serpent Wisdom',
  'March 2024',
  '2 weeks',
  ARRAY['Hypnobiz', 'Canva', 'Custom CSS'],
  ARRAY['Hypnobiz', 'Booking', 'Wellness'],
  false,
  6
FROM services WHERE slug = 'web-design';

-- =====================================================
-- STEP 10: Verify the data
-- =====================================================

SELECT
  pi.title,
  pi.client_name,
  pi.is_featured,
  s.title as service_name
FROM portfolio_items pi
JOIN services s ON pi.service_id = s.id
ORDER BY s.title, pi.order_index;

-- Count portfolio items per service
SELECT s.title, COUNT(pi.id) as item_count
FROM services s
LEFT JOIN portfolio_items pi ON s.id = pi.service_id
GROUP BY s.id, s.title
ORDER BY s.title;

-- =====================================================
-- USEFUL QUERIES
-- =====================================================

-- Get all portfolio items for a specific service
-- SELECT * FROM portfolio_items pi
-- JOIN services s ON pi.service_id = s.id
-- WHERE s.slug = 'video-production'
-- ORDER BY pi.order_index;

-- Update a thumbnail URL
-- UPDATE portfolio_items
-- SET thumbnail_url = 'YOUR_NEW_URL'
-- WHERE id = 'PORTFOLIO_ITEM_ID';

-- Delete all portfolio items (careful!)
-- DELETE FROM portfolio_items;
