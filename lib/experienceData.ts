export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  start_date: string;
  end_date: string;
  description: string[];
  type: 'full-time' | 'part-time' | 'project';
  skills?: string[];
  order_index: number;
}

// All 29 experiences from CV
export const defaultExperiences: Experience[] = [
  // Full-time experiences (13)
  {
    id: '1',
    company: 'Fiverr',
    position: 'Freelance Consultant - Virtual Assistant',
    location: 'Remote',
    start_date: 'November 2013',
    end_date: 'Present',
    description: [
      'Developing scalable digital solutions including AI-driven content and web applications.',
      'Video editing, rendering, graphic design, eBook formatting, WordPress management.',
      'Virtual assistance, administrative tasks, lead generation.',
      'Content writing – AI based, organic digital marketing.'
    ],
    type: 'full-time',
    skills: ['Virtual Assistance', 'Web Development', 'AI Tools', 'Digital Marketing'],
    order_index: 1
  },
  {
    id: '2',
    company: 'TBC Websites, United Kingdom',
    position: 'Freelance Digital Consultant',
    location: 'Remote',
    start_date: 'December 2025',
    end_date: 'Present',
    description: [
      'Developed 25+ websites leveraging GenSpark AI to ensure rapid deployment and modern design standards.',
      'Continuously managing and updating digital assets to align with evolving AI capabilities.'
    ],
    type: 'full-time',
    skills: ['GenSpark AI', 'Web Development', 'Digital Assets'],
    order_index: 2
  },
  {
    id: '3',
    company: 'Williams Transportation, Illinois, USA',
    position: 'Digital Strategist & Web Developer',
    location: 'Remote',
    start_date: 'January 2025',
    end_date: 'Present',
    description: [
      'Developed the corporate website (wtransportsolution.com) and spearheading ongoing Social Media Marketing campaigns.'
    ],
    type: 'full-time',
    skills: ['Web Development', 'Social Media Marketing', 'Digital Strategy'],
    order_index: 3
  },
  {
    id: '4',
    company: 'The Sole Ingredient Catering LLC, Illinois, USA',
    position: 'Digital Strategist & Web Developer',
    location: 'Remote',
    start_date: 'January 2025',
    end_date: 'Present',
    description: [
      'Developed the official website (thesoleingredientcatering.com) and managing full-scale digital branding and marketing.'
    ],
    type: 'full-time',
    skills: ['Web Development', 'Branding', 'Digital Marketing'],
    order_index: 4
  },
  {
    id: '5',
    company: 'Zeir App, Saudi Arabia',
    position: 'Freelance Consultant - Virtual Assistant',
    location: 'Remote',
    start_date: 'March 2024',
    end_date: 'Present',
    description: [
      'Muslim Hunt Platform Development: Engineered and deployed the "Muslim Hunt" website using Next.js, Supabase, and GitHub, hosted on Vercel.',
      'AI Implementation: Integrated Claude, Gemini (AI Studio), and AntiGravity to build intelligent features and automate digital workflows.',
      'Created Quran translation videos using AI text-to-video software.',
      'Conducted research and selected scenes using precise keywords to match verse meanings.'
    ],
    type: 'full-time',
    skills: ['Next.js', 'Supabase', 'AI Integration', 'Video Production'],
    order_index: 5
  },
  {
    id: '6',
    company: 'Suson Essentials, Georgia, USA',
    position: 'Freelance Consultant - Virtual Assistant',
    location: 'Remote',
    start_date: 'October 2023',
    end_date: 'February 2024',
    description: [
      'StreamYard video management, Constant Contact management, YouTube video, reels, and shorts creation.'
    ],
    type: 'full-time',
    skills: ['StreamYard', 'Email Marketing', 'YouTube Management'],
    order_index: 6
  },
  {
    id: '7',
    company: 'Joey Guillory, San Jose, USA',
    position: 'Freelance Consultant - Personal Virtual Assistant',
    location: 'Remote',
    start_date: 'December 2022',
    end_date: 'October 2023',
    description: [
      'Managed applications via Lazy App, LinkedIn, Indeed, and Google Jobs, securing two hotel jobs (including Hilton).',
      'Conducted online research, data entry, and vendor sourcing.',
      'Managed email inboxes, spreadsheets, travel arrangements, and event planning.'
    ],
    type: 'full-time',
    skills: ['Job Search', 'Admin Support', 'Data Entry', 'Travel Arrangements'],
    order_index: 7
  },
  {
    id: '8',
    company: 'The SOAS Global Council for Anthropological Linguistics (GLOCAL), University of London, UK',
    position: 'Freelance Consultant - Media and Web Design Coordinator',
    location: 'Remote',
    start_date: 'January 2021',
    end_date: 'December 2022',
    description: [
      'Developed and maintained the GLOCAL website and other related sites (CALA, COMELA, AFALA, JALA, JOMELA).',
      'Managed content creation, video editing, and social media integration.'
    ],
    type: 'full-time',
    skills: ['WordPress', 'Web Design', 'Content Creation', 'Video Editing'],
    order_index: 8
  },
  {
    id: '9',
    company: 'Tritech Building Services Ltd., Dhaka, Bangladesh',
    position: 'Assistant Manager, Brand & Communication',
    location: 'Bangladesh',
    start_date: 'January 2020',
    end_date: 'December 2020',
    description: [
      'Created marketing plans, advertising, and digital campaigns, Arranged Annual Event for Tritech.',
      'Produced creative marketing content, including videos and blog posts.',
      'Developed relationships with internal and external stakeholders.'
    ],
    type: 'full-time',
    skills: ['Marketing', 'Brand Management', 'Event Planning', 'Content Production'],
    order_index: 9
  },
  {
    id: '10',
    company: 'Tritech Building Services Ltd., Dhaka, Bangladesh',
    position: 'Sr. Executive, Engineering Sales - Client Relationship Manager',
    location: 'Bangladesh',
    start_date: 'May 2018',
    end_date: 'January 2020',
    description: [
      'Maintained client relationships, collected leads, and nurtured client connections.',
      'Conducted meetings, site visits, and client consultations to understand and fulfill requirements.'
    ],
    type: 'full-time',
    skills: ['Sales', 'Client Relations', 'Lead Generation', 'Site Visits'],
    order_index: 10
  },
  {
    id: '11',
    company: 'Power-Sonic Transformers & Switchgears Ltd., Dhaka, Bangladesh',
    position: 'Assistant Engineer',
    location: 'Bangladesh',
    start_date: 'January 2017',
    end_date: 'May 2018',
    description: [
      'Conducted site surveys and designed substation layouts as per DESCO and DPDC rules.',
      'Consulted clients on project details before and after substation project completion.'
    ],
    type: 'full-time',
    skills: ['Project Survey', 'Layout Design', 'Client Consultation', 'Engineering'],
    order_index: 11
  },
  {
    id: '12',
    company: 'Cityscape International Limited, Dhaka, Bangladesh',
    position: 'IT Associate Engineer',
    location: 'Bangladesh',
    start_date: 'January 2016',
    end_date: 'December 2016',
    description: [
      'Managed IT support, inventory, and office-wide laptop and desktop maintenance.'
    ],
    type: 'full-time',
    skills: ['IT Support', 'Network Administration', 'Hardware Maintenance'],
    order_index: 12
  },
  {
    id: '13',
    company: 'Berger Paints Bangladesh Ltd., Dhaka, Bangladesh',
    position: 'Internee',
    location: 'Bangladesh',
    start_date: 'August 2015',
    end_date: 'December 2015',
    description: [
      'Assisted in IT project documentation and infrastructure management.'
    ],
    type: 'full-time',
    skills: ['Project Documentation', 'IT Infrastructure'],
    order_index: 13
  },
  // Part-time experiences (12)
  {
    id: 'pt1',
    company: 'Aura Relax & Nature Healing Society, Norway',
    position: 'Freelance Consultant - YouTube Manager',
    location: 'Remote',
    start_date: 'January 2021',
    end_date: 'Present',
    description: [
      'Collect Royalty free Clips through Storyblocks, then Produced 8-hour relaxing videos, uploaded to YouTube, and managed channel comments.'
    ],
    type: 'part-time',
    skills: ['YouTube Management', 'Video Production', 'Content Curation'],
    order_index: 1
  },
  {
    id: 'pt2',
    company: 'Release Media Inc., USA',
    position: 'Freelance Consultant - Virtual Assistant',
    location: 'Remote',
    start_date: 'February 2022',
    end_date: 'Present',
    description: [
      'Execute scripts, manage orders, create PDFs, videos, podcasts, blogs, infographics and google stacking.'
    ],
    type: 'part-time',
    skills: ['Content Creation', 'Video Production', 'Podcast Production', 'SEO'],
    order_index: 2
  },
  {
    id: 'pt3',
    company: 'Do it Digital, Australia',
    position: 'Freelance Consultant - General Virtual Assistant',
    location: 'Remote',
    start_date: 'April 2023',
    end_date: 'Present',
    description: [
      'Set up and manage social media accounts, worked for organic reach.',
      'Assist with design, layout, images, and banner placement.',
      'Conduct research, compile data, create reports, and perform data entry tasks.'
    ],
    type: 'part-time',
    skills: ['Social Media', 'Graphic Design', 'Research', 'Data Entry'],
    order_index: 3
  },
  {
    id: 'pt4',
    company: 'Savor Our City, Florida, USA',
    position: 'Freelance Consultant - Virtual Assistant',
    location: 'Remote',
    start_date: 'April 2024',
    end_date: 'Present',
    description: [
      'Served as Event Coordinator for the Savor Boca event.',
      'Managed comprehensive digital quality assurance including Website Testing and Email Marketing Testing.',
      'Executed marketing workflows and data management to ensure seamless event promotion.',
      'Video Production and Editing, Email Signature Design, Logo Animation, VPN Research, Content Creation.'
    ],
    type: 'part-time',
    skills: ['Event Coordination', 'QA Testing', 'Video Production', 'Email Marketing'],
    order_index: 4
  },
  {
    id: 'pt5',
    company: 'White Serpent Wisdom, Florida, USA',
    position: 'Freelance Consultant - Tech Help with Social Media',
    location: 'Remote',
    start_date: 'March 2024',
    end_date: 'Present',
    description: [
      'Made Full website (www.white-serpent-tradition.com) using Hypnobiz, giving training in Canva, and manage social media.',
      'Video editing.'
    ],
    type: 'part-time',
    skills: ['Website Development', 'Canva Training', 'Social Media', 'Video Editing'],
    order_index: 5
  },
  {
    id: 'pt6',
    company: 'iPad Art SoCal, USA',
    position: 'Freelance Consultant - Tech help with social media',
    location: 'Remote',
    start_date: 'November 2024',
    end_date: 'Present',
    description: [
      'Created videos, designed Squarespace websites, and developed branded PDFs.'
    ],
    type: 'part-time',
    skills: ['Video Creation', 'Squarespace', 'Branding', 'PDF Design'],
    order_index: 6
  },
  {
    id: 'pt7',
    company: 'Malaysian Super Shop, Malaysia',
    position: 'Freelance Consultant - Virtual Assistant for Database Management',
    location: 'Remote',
    start_date: 'April 2024',
    end_date: 'September 2024',
    description: [
      'Managed sales, inventory databases, and performed Google Sheets updates.'
    ],
    type: 'part-time',
    skills: ['Database Management', 'Google Sheets', 'Inventory Management'],
    order_index: 7
  },
  {
    id: 'pt8',
    company: 'Christopher Simpson, Florida, USA',
    position: 'Freelance Consultant – Virtual Assistant',
    location: 'Remote',
    start_date: 'March 2024',
    end_date: 'May 2024',
    description: [
      'Business research via Google Maps and compiled relevant business data.'
    ],
    type: 'part-time',
    skills: ['Business Research', 'Data Compilation', 'Google Maps'],
    order_index: 8
  },
  {
    id: 'pt9',
    company: 'Webkonsult AS, Norway',
    position: 'Freelance Consultant - Virtual Assistant for Startup Company',
    location: 'Remote',
    start_date: 'March 2024',
    end_date: 'July 2024',
    description: [
      'Created content using TextBuilder AI and supported administrative tasks.'
    ],
    type: 'part-time',
    skills: ['AI Content Creation', 'Admin Support', 'Startup Operations'],
    order_index: 9
  },
  {
    id: 'pt10',
    company: 'Alise Spiritual Healing & Wellness Center, USA',
    position: 'Freelance Consultant - VA for Websites',
    location: 'Remote',
    start_date: 'October 2023',
    end_date: 'January 2024',
    description: [
      'SSL certifications add, WordPress Website Management, Banner fixing, and other WordPress related task.'
    ],
    type: 'part-time',
    skills: ['WordPress', 'SSL Certificates', 'Website Maintenance'],
    order_index: 10
  },
  {
    id: 'pt11',
    company: 'HJ Visualization, Germany',
    position: 'Freelance Consultant - Virtual Assistant',
    location: 'Remote',
    start_date: 'January 2021',
    end_date: 'December 2023',
    description: [
      'Responsibilities depend on clients\' need.',
      'Sometimes he needs data entry, sometime design work, sometime PowerPoint slide and WordPress website entry.'
    ],
    type: 'part-time',
    skills: ['Data Entry', 'Graphic Design', 'PowerPoint', 'WordPress'],
    order_index: 11
  },
  {
    id: 'pt12',
    company: 'ARO Commerce, UK',
    position: 'Freelance Consultant - Part-Time Virtual Assistant',
    location: 'Remote',
    start_date: 'June 2022',
    end_date: 'June 2023',
    description: [
      'Google Ads Management: Conducted research, evaluated performance, and provided actionable feedback.',
      'Email Campaign Management: Drafted personalized email campaigns, ensured formatting accuracy.',
      'Data Management & Professional Development: Gathered company data, maintained accurate spreadsheets.'
    ],
    type: 'part-time',
    skills: ['Google Ads', 'Email Marketing', 'Data Management', 'Spreadsheets'],
    order_index: 12
  },
  // Project-based experiences (4)
  {
    id: 'proj1',
    company: 'Arron Lee, UK',
    position: 'Freelance Consultant – Personal Virtual Assistant',
    location: 'Remote',
    start_date: 'April 2024',
    end_date: 'June 2024',
    description: [
      'Job search within Arron\'s Field.'
    ],
    type: 'project',
    skills: ['Job Search', 'Research', 'Application Management'],
    order_index: 1
  },
  {
    id: 'proj2',
    company: 'Bueno Group, New York, USA',
    position: 'Freelance Consultant - Podcast Production Coordinator',
    location: 'Remote',
    start_date: 'June 2024',
    end_date: 'August 2024',
    description: [
      'Video Editing/Rendering with AI tool, Short term project.'
    ],
    type: 'project',
    skills: ['Podcast Production', 'Video Editing', 'AI Tools'],
    order_index: 2
  },
  {
    id: 'proj3',
    company: 'New Tab Theme Builder, USA',
    position: 'Freelance Consultant - Virtual Assistant',
    location: 'Remote',
    start_date: 'May 2023',
    end_date: 'June 2024',
    description: [
      'Download, organize, edit, and upload wallpapers, themes, and icons using provided tools and scripts.',
      'Build apps using NewTabThemeBuilder, manage extension publishing, handle reviews.',
      'Test features, fix bugs.'
    ],
    type: 'project',
    skills: ['App Development', 'Extension Publishing', 'QA Testing', 'Content Management'],
    order_index: 3
  },
  {
    id: 'proj4',
    company: 'GDA Green Source LLC, USA',
    position: 'Freelance Consultant - Technical Sales Representative',
    location: 'Remote',
    start_date: 'August 2021',
    end_date: 'December 2021',
    description: [
      'Freelance and contractual sales job.'
    ],
    type: 'project',
    skills: ['Technical Sales', 'B2B Sales', 'Lead Generation'],
    order_index: 4
  }
];
