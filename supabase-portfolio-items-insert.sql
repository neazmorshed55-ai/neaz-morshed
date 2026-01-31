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
-- STEP 3: Insert Video Production Portfolio Items
-- Replace 'YOUR_VIDEO_PRODUCTION_SERVICE_ID' with actual UUID from services table
-- =====================================================

-- First, let's create a variable for the service ID
-- You'll need to replace the slug-based lookup with your actual service

-- Video Production Portfolio (9 items)
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
-- STEP 4: Verify the data
-- =====================================================

SELECT
  pi.title,
  pi.client_name,
  pi.is_featured,
  s.title as service_name
FROM portfolio_items pi
JOIN services s ON pi.service_id = s.id
ORDER BY s.title, pi.order_index;

-- =====================================================
-- USEFUL QUERIES
-- =====================================================

-- Count portfolio items per service
-- SELECT s.title, COUNT(pi.id) as item_count
-- FROM services s
-- LEFT JOIN portfolio_items pi ON s.id = pi.service_id
-- GROUP BY s.id, s.title;

-- Get all video production portfolios
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
