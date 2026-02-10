-- ==========================================
-- Add All Work Experiences to Supabase
-- This will add all your experiences from the resume page
-- ==========================================

-- First, delete the default 2 experiences (Upwork and Fiverr from the simple version)
DELETE FROM resume_experiences;

-- Now insert ALL experiences (13 Full-Time + 12 Part-Time + 4 Project-Based = 29 total)

-- ==========================================
-- FULL-TIME EXPERIENCES (13)
-- ==========================================

INSERT INTO resume_experiences (company, position, location, start_date, end_date, description, type, order_index) VALUES
  ('Fiverr', 'Freelance Consultant - Virtual Assistant', 'Remote', 'November 2013', 'Present',
   ARRAY[
     'Developing scalable digital solutions including AI-driven content and web applications.',
     'Video editing, rendering, graphic design, eBook formatting, WordPress management.',
     'Virtual assistance, administrative tasks, lead generation.',
     'Content writing – AI based, organic digital marketing.'
   ], 'full-time', 1),

  ('TBC Websites, United Kingdom', 'Freelance Digital Consultant', 'Remote', 'December 2025', 'Present',
   ARRAY[
     'Developed 25+ websites leveraging GenSpark AI to ensure rapid deployment and modern design standards.',
     'Continuously managing and updating digital assets to align with evolving AI capabilities.'
   ], 'full-time', 2),

  ('Williams Transportation, Illinois, USA', 'Digital Strategist & Web Developer', 'Remote', 'January 2025', 'Present',
   ARRAY[
     'Developed the corporate website (wtransportsolution.com) and spearheading ongoing Social Media Marketing campaigns.'
   ], 'full-time', 3),

  ('The Sole Ingredient Catering LLC, Illinois, USA', 'Digital Strategist & Web Developer', 'Remote', 'January 2025', 'Present',
   ARRAY[
     'Developed the official website (thesoleingredientcatering.com) and managing full-scale digital branding and marketing.'
   ], 'full-time', 4),

  ('Zeir App, Saudi Arabia', 'Freelance Consultant - Virtual Assistant', 'Remote', 'March 2024', 'Present',
   ARRAY[
     'Muslim Hunt Platform Development: Engineered and deployed the "Muslim Hunt" website using Next.js, Supabase, and GitHub, hosted on Vercel.',
     'AI Implementation: Integrated Claude, Gemini (AI Studio), and AntiGravity to build intelligent features and automate digital workflows.',
     'Created Quran translation videos using AI text-to-video software.',
     'Conducted research and selected scenes using precise keywords to match verse meanings.'
   ], 'full-time', 5),

  ('Suson Essentials, Georgia, USA', 'Freelance Consultant - Virtual Assistant', 'Remote', 'October 2023', 'February 2024',
   ARRAY[
     'StreamYard video management, Constant Contact management, YouTube video, reels, and shorts creation.'
   ], 'full-time', 6),

  ('Joey Guillory, San Jose, USA', 'Freelance Consultant - Personal Virtual Assistant', 'Remote', 'December 2022', 'October 2023',
   ARRAY[
     'Managed applications via Lazy App, LinkedIn, Indeed, and Google Jobs, securing two hotel jobs (including Hilton).',
     'Conducted online research, data entry, and vendor sourcing.',
     'Managed email inboxes, spreadsheets, travel arrangements, and event planning.'
   ], 'full-time', 7),

  ('The SOAS Global Council for Anthropological Linguistics (GLOCAL), University of London, UK', 'Freelance Consultant - Media and Web Design Coordinator', 'Remote', 'January 2021', 'December 2022',
   ARRAY[
     'Developed and maintained the GLOCAL website and other related sites (CALA, COMELA, AFALA, JALA, JOMELA).',
     'Managed content creation, video editing, and social media integration.'
   ], 'full-time', 8),

  ('Tritech Building Services Ltd., Dhaka, Bangladesh', 'Assistant Manager, Brand & Communication', 'Bangladesh', 'January 2020', 'December 2020',
   ARRAY[
     'Created marketing plans, advertising, and digital campaigns, Arranged Annual Event for Tritech.',
     'Produced creative marketing content, including videos and blog posts.',
     'Developed relationships with internal and external stakeholders.'
   ], 'full-time', 9),

  ('Tritech Building Services Ltd., Dhaka, Bangladesh', 'Sr. Executive, Engineering Sales - Client Relationship Manager', 'Bangladesh', 'May 2018', 'January 2020',
   ARRAY[
     'Maintained client relationships, collected leads, and nurtured client connections.',
     'Conducted meetings, site visits, and client consultations to understand and fulfill requirements.'
   ], 'full-time', 10),

  ('Power-Sonic Transformers & Switchgears Ltd., Dhaka, Bangladesh', 'Assistant Engineer', 'Bangladesh', 'January 2017', 'May 2018',
   ARRAY[
     'Conducted site surveys and designed substation layouts as per DESCO and DPDC rules.',
     'Consulted clients on project details before and after substation project completion.'
   ], 'full-time', 11),

  ('Cityscape International Limited, Dhaka, Bangladesh', 'IT Associate Engineer', 'Bangladesh', 'January 2016', 'December 2016',
   ARRAY[
     'Managed IT support, inventory, and office-wide laptop and desktop maintenance.'
   ], 'full-time', 12),

  ('Berger Paints Bangladesh Ltd., Dhaka, Bangladesh', 'Internee', 'Bangladesh', 'August 2015', 'December 2015',
   ARRAY[
     'Assisted in IT project documentation and infrastructure management.'
   ], 'full-time', 13);

-- ==========================================
-- PART-TIME EXPERIENCES (12)
-- ==========================================

INSERT INTO resume_experiences (company, position, location, start_date, end_date, description, type, order_index) VALUES
  ('Aura Relax & Nature Healing Society, Norway', 'Freelance Consultant - YouTube Manager', 'Remote', 'January 2021', 'Present',
   ARRAY[
     'Collect Royalty free Clips through Storyblocks, then Produced 8-hour relaxing videos, uploaded to YouTube, and managed channel comments.'
   ], 'part-time', 1),

  ('Release Media Inc., USA', 'Freelance Consultant - Virtual Assistant', 'Remote', 'February 2022', 'Present',
   ARRAY[
     'Execute scripts, manage orders, create PDFs, videos, podcasts, blogs, infographics and google stacking.'
   ], 'part-time', 2),

  ('Do it Digital, Australia', 'Freelance Consultant - General Virtual Assistant', 'Remote', 'April 2023', 'Present',
   ARRAY[
     'Set up and manage social media accounts, worked for organic reach.',
     'Assist with design, layout, images, and banner placement.',
     'Conduct research, compile data, create reports, and perform data entry tasks.'
   ], 'part-time', 3),

  ('Savor Our City, Florida, USA', 'Freelance Consultant - Virtual Assistant', 'Remote', 'April 2024', 'Present',
   ARRAY[
     'Served as Event Coordinator for the Savor Boca event.',
     'Managed comprehensive digital quality assurance including Website Testing and Email Marketing Testing.',
     'Executed marketing workflows and data management to ensure seamless event promotion.',
     'Video Production and Editing, Email Signature Design, Logo Animation, VPN Research, Content Creation.'
   ], 'part-time', 4),

  ('White Serpent Wisdom, Florida, USA', 'Freelance Consultant - Tech Help with Social Media', 'Remote', 'March 2024', 'Present',
   ARRAY[
     'Made Full website (www.white-serpent-tradition.com) using Hypnobiz, giving training in Canva, and manage social media.',
     'Video editing.'
   ], 'part-time', 5),

  ('iPad Art SoCal, USA', 'Freelance Consultant - Tech help with social media', 'Remote', 'November 2024', 'Present',
   ARRAY[
     'Created videos, designed Squarespace websites, and developed branded PDFs.'
   ], 'part-time', 6),

  ('Malaysian Super Shop, Malaysia', 'Freelance Consultant - Virtual Assistant for Database Management', 'Remote', 'April 2024', 'September 2024',
   ARRAY[
     'Managed sales, inventory databases, and performed Google Sheets updates.'
   ], 'part-time', 7),

  ('Christopher Simpson, Florida, USA', 'Freelance Consultant – Virtual Assistant', 'Remote', 'March 2024', 'May 2024',
   ARRAY[
     'Business research via Google Maps and compiled relevant business data.'
   ], 'part-time', 8),

  ('Webkonsult AS, Norway', 'Freelance Consultant - Virtual Assistant for Startup Company', 'Remote', 'March 2024', 'July 2024',
   ARRAY[
     'Created content using TextBuilder AI and supported administrative tasks.'
   ], 'part-time', 9),

  ('Alise Spiritual Healing & Wellness Center, USA', 'Freelance Consultant - VA for Websites', 'Remote', 'October 2023', 'January 2024',
   ARRAY[
     'SSL certifications add, WordPress Website Management, Banner fixing, and other WordPress related task.'
   ], 'part-time', 10),

  ('HJ Visualization, Germany', 'Freelance Consultant - Virtual Assistant', 'Remote', 'January 2021', 'December 2023',
   ARRAY[
     'Responsibilities depend on clients'' need.',
     'Sometimes he needs data entry, sometime design work, sometime PowerPoint slide and WordPress website entry.'
   ], 'part-time', 11),

  ('ARO Commerce, UK', 'Freelance Consultant - Part-Time Virtual Assistant', 'Remote', 'June 2022', 'June 2023',
   ARRAY[
     'Google Ads Management: Conducted research, evaluated performance, and provided actionable feedback.',
     'Email Campaign Management: Drafted personalized email campaigns, ensured formatting accuracy.',
     'Data Management & Professional Development: Gathered company data, maintained accurate spreadsheets.'
   ], 'part-time', 12);

-- ==========================================
-- PROJECT-BASED EXPERIENCES (4)
-- ==========================================

INSERT INTO resume_experiences (company, position, location, start_date, end_date, description, type, order_index) VALUES
  ('Arron Lee, UK', 'Freelance Consultant – Personal Virtual Assistant', 'Remote', 'April 2024', 'June 2024',
   ARRAY[
     'Job search within Arron''s Field.'
   ], 'project', 1),

  ('Bueno Group, New York, USA', 'Freelance Consultant - Podcast Production Coordinator', 'Remote', 'June 2024', 'August 2024',
   ARRAY[
     'Video Editing/Rendering with AI tool, Short term project.'
   ], 'project', 2),

  ('New Tab Theme Builder, USA', 'Freelance Consultant - Virtual Assistant', 'Remote', 'May 2023', 'June 2024',
   ARRAY[
     'Download, organize, edit, and upload wallpapers, themes, and icons using provided tools and scripts.',
     'Build apps using NewTabThemeBuilder, manage extension publishing, handle reviews.',
     'Test features, fix bugs.'
   ], 'project', 3),

  ('GDA Green Source LLC, USA', 'Freelance Consultant - Technical Sales Representative', 'Remote', 'August 2021', 'December 2021',
   ARRAY[
     'Freelance and contractual sales job.'
   ], 'project', 4);

-- ==========================================
-- Verification Query
-- ==========================================

-- Check the count
SELECT
  type,
  COUNT(*) as count
FROM resume_experiences
GROUP BY type
ORDER BY type;

-- Show all experiences
SELECT company, position, type, start_date FROM resume_experiences ORDER BY type, order_index;
