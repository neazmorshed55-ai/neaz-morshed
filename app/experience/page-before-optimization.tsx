"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft, ArrowRight, Loader2, Calendar, MapPin, Briefcase,
  ChevronDown, CheckCircle2, Building2, Filter
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Navbar from '../../components/Navbar';
import VideoBackground from '../../components/VideoBackground';
import FooterLinks from '../../components/FooterLinks';

interface Experience {
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
const defaultExperiences: Experience[] = [
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

// Helper function to parse date string and return sortable value
const parseDate = (dateStr: string): number => {
  if (dateStr === 'Present') return Date.now();

  const months: { [key: string]: number } = {
    'January': 0, 'February': 1, 'March': 2, 'April': 3,
    'May': 4, 'June': 5, 'July': 6, 'August': 7,
    'September': 8, 'October': 9, 'November': 10, 'December': 11
  };

  const parts = dateStr.split(' ');
  if (parts.length === 2) {
    const month = months[parts[0]] || 0;
    const year = parseInt(parts[1]) || 2000;
    return new Date(year, month).getTime();
  }
  return 0;
};

// Sort experiences by start date (newest first)
const sortByDate = (exps: Experience[]): Experience[] => {
  return [...exps].sort((a, b) => parseDate(b.start_date) - parseDate(a.start_date));
};

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>(defaultExperiences);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'full-time' | 'part-time' | 'project'>('all');

  useEffect(() => {
    async function fetchData() {
      if (!supabase) {
        // Sort default experiences by date
        const sorted = sortByDate(defaultExperiences);
        setExperiences(sorted);
        setExpandedId(sorted[0]?.id || null);
        setLoading(false);
        return;
      }

      try {
        const { data } = await supabase
          .from('experiences')
          .select('*');

        if (data && data.length > 0) {
          const sorted = sortByDate(data);
          setExperiences(sorted);
          setExpandedId(sorted[0]?.id || null);
        } else {
          // Use default experiences if no data from Supabase
          const sorted = sortByDate(defaultExperiences);
          setExperiences(sorted);
          setExpandedId(sorted[0]?.id || null);
        }
      } catch (error) {
        console.error('Error fetching experiences:', error);
        // On error, use default experiences
        const sorted = sortByDate(defaultExperiences);
        setExperiences(sorted);
        setExpandedId(sorted[0]?.id || null);
      }

      setLoading(false);
    }

    fetchData();
  }, []);

  // Filter and sort experiences
  const filteredExperiences = sortByDate(
    activeTab === 'all'
      ? experiences
      : experiences.filter(exp => exp.type === activeTab)
  );

  const stats = {
    fullTime: experiences.filter(e => e.type === 'full-time').length,
    partTime: experiences.filter(e => e.type === 'part-time').length,
    project: experiences.filter(e => e.type === 'project').length,
    total: experiences.length
  };

  if (loading) {
    return (
      <div className="bg-[#0b0f1a] text-white min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#2ecc71] animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-[#0b0f1a] text-white min-h-screen">
      <Navbar />
      <main className="pb-24">
        {/* Hero Section */}
        <section className="pt-32 pb-16 relative overflow-hidden min-h-[55vh] flex flex-col justify-center">
          <VideoBackground type="experience" opacity={0.8} />

          {/* Additional decorative elements */}
          <div className="absolute top-[20%] left-[10%] w-[400px] h-[400px] bg-[#2ecc71]/5 rounded-full blur-[150px] pointer-events-none"></div>
          <div className="absolute bottom-[20%] right-[10%] w-[300px] h-[300px] bg-[#2ecc71]/5 rounded-full blur-[150px] pointer-events-none"></div>

          <div className="container mx-auto px-6 max-w-7xl relative z-10">
            {/* Back Link */}
            <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-[#2ecc71] transition-all mb-8 group">
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-bold uppercase tracking-wider">Back to Home</span>
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h1 className="text-5xl lg:text-8xl font-black uppercase tracking-tighter leading-none mb-6">
                Work <span className="text-[#2ecc71]">Experience</span>
              </h1>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                A comprehensive journey through my professional career spanning over 12 years of diverse experience in IT, virtual assistance, web development, and creative services.
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
            >
              <div className="p-6 bg-slate-900/50 rounded-2xl border border-white/5 text-center">
                <div className="text-4xl font-black text-[#2ecc71] mb-2">12+</div>
                <div className="text-slate-400 text-xs uppercase tracking-wider">Years Experience</div>
              </div>
              <div className="p-6 bg-slate-900/50 rounded-2xl border border-white/5 text-center">
                <div className="text-4xl font-black text-[#2ecc71] mb-2">{stats.total}</div>
                <div className="text-slate-400 text-xs uppercase tracking-wider">Total Positions</div>
              </div>
              <div className="p-6 bg-slate-900/50 rounded-2xl border border-white/5 text-center">
                <div className="text-4xl font-black text-[#2ecc71] mb-2">1,000+</div>
                <div className="text-slate-400 text-xs uppercase tracking-wider">Global Clients</div>
              </div>
              <div className="p-6 bg-slate-900/50 rounded-2xl border border-white/5 text-center">
                <div className="text-4xl font-black text-[#2ecc71] mb-2">10,000+</div>
                <div className="text-slate-400 text-xs uppercase tracking-wider">Hours Completed</div>
              </div>
            </motion.div>

            {/* Filter Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap justify-center gap-3 mb-12"
            >
              {[
                { key: 'all', label: 'All Experience', count: stats.total },
                { key: 'full-time', label: 'Full-Time', count: stats.fullTime },
                { key: 'part-time', label: 'Part-Time', count: stats.partTime },
                { key: 'project', label: 'Project-Based', count: stats.project }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as typeof activeTab)}
                  className={`px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === tab.key
                    ? 'bg-[#2ecc71] text-slate-900'
                    : 'bg-slate-900/60 border border-white/10 text-slate-400 hover:border-[#2ecc71]/30 hover:text-white'
                    }`}
                >
                  {tab.label}
                  <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === tab.key ? 'bg-slate-900/20' : 'bg-white/10'
                    }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-20 bg-slate-900/20 relative">
          <div className="container mx-auto px-6 max-w-5xl">
            {/* Timeline */}
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#2ecc71] via-[#2ecc71]/50 to-transparent transform md:-translate-x-1/2"></div>

              {filteredExperiences.map((exp, index) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className={`relative flex flex-col md:flex-row gap-8 mb-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                    }`}
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-0 md:left-1/2 w-4 h-4 bg-[#2ecc71] rounded-full transform -translate-x-1/2 border-4 border-[#0b0f1a] shadow-[0_0_20px_rgba(46,204,113,0.5)] z-10"></div>

                  {/* Year Badge - Desktop */}
                  <div className={`hidden md:flex md:w-1/2 items-center ${index % 2 === 0 ? 'justify-end pr-12' : 'justify-start pl-12'
                    }`}>
                    <div className="text-center">
                      <div className="text-5xl font-black text-[#2ecc71]/20">
                        {exp.start_date.split(' ').pop()}
                      </div>
                      <div className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider mt-2 ${exp.type === 'full-time' ? 'bg-[#2ecc71]/20 text-[#2ecc71]' :
                        exp.type === 'part-time' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-purple-500/20 text-purple-400'
                        }`}>
                        {exp.type}
                      </div>
                    </div>
                  </div>

                  {/* Content Card */}
                  <div className={`md:w-1/2 pl-8 md:pl-0 ${index % 2 === 0 ? 'md:pl-12' : 'md:pr-12'}`}>
                    <div
                      className={`p-6 rounded-3xl border transition-all duration-300 cursor-pointer ${expandedId === exp.id
                        ? 'bg-[#1a1f2e] border-[#2ecc71]/30 shadow-lg shadow-[#2ecc71]/10'
                        : 'bg-slate-900/40 border-white/5 hover:border-white/10'
                        }`}
                      onClick={() => setExpandedId(expandedId === exp.id ? null : exp.id)}
                    >
                      {/* Mobile Type Badge & Year */}
                      <div className="md:hidden flex items-center gap-3 mb-3">
                        <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider ${exp.type === 'full-time' ? 'bg-[#2ecc71]/20 text-[#2ecc71]' :
                          exp.type === 'part-time' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-purple-500/20 text-purple-400'
                          }`}>
                          {exp.type}
                        </span>
                        <span className="text-[#2ecc71] text-xs font-bold">
                          {exp.start_date} - {exp.end_date}
                        </span>
                      </div>

                      {/* Header */}
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Building2 size={16} className="text-[#2ecc71]" />
                            <span className="text-slate-400 text-sm font-medium">{exp.company}</span>
                          </div>
                          <h3 className={`text-xl font-black transition-colors ${expandedId === exp.id ? 'text-[#2ecc71]' : 'text-white'
                            }`}>
                            {exp.position}
                          </h3>
                        </div>
                        <ChevronDown
                          size={20}
                          className={`text-slate-500 transition-transform duration-300 flex-shrink-0 ${expandedId === exp.id ? 'rotate-180 text-[#2ecc71]' : ''
                            }`}
                        />
                      </div>

                      {/* Meta Info */}
                      <div className="flex flex-wrap gap-4 text-sm text-slate-400 mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-[#2ecc71]" />
                          <span>{exp.start_date} - {exp.end_date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={14} className="text-[#2ecc71]" />
                          <span>{exp.location}</span>
                        </div>
                      </div>

                      {/* Expandable Content */}
                      <AnimatePresence>
                        {expandedId === exp.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            {/* Description */}
                            <ul className="space-y-2 mb-4">
                              {exp.description.map((desc, i) => (
                                <li key={i} className="text-slate-300 text-sm flex items-start gap-2">
                                  <span className="text-[#2ecc71] mt-1">•</span>
                                  <span>{desc}</span>
                                </li>
                              ))}
                            </ul>

                            {/* Skills */}
                            {exp.skills && exp.skills.length > 0 && (
                              <div className="pt-4 border-t border-white/10">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 block">Skills Used</span>
                                <div className="flex flex-wrap gap-2">
                                  {exp.skills.map((skill, i) => (
                                    <span
                                      key={i}
                                      className="flex items-center gap-1 px-3 py-1 bg-[#2ecc71]/10 text-[#2ecc71] rounded-full text-[10px] font-bold uppercase tracking-wider"
                                    >
                                      <CheckCircle2 size={12} />
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-slate-900/30">
          <div className="container mx-auto px-6 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center p-12 bg-slate-900/60 border border-white/10 rounded-[3rem] relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-[#2ecc71]/10 rounded-full blur-[80px] -z-10"></div>

              <Briefcase className="w-16 h-16 text-[#2ecc71] mx-auto mb-6" />
              <h3 className="text-3xl font-black uppercase tracking-tight mb-4">
                Ready to Work Together?
              </h3>
              <p className="text-slate-400 mb-8 max-w-xl mx-auto">
                With over 12 years of diverse experience and 1,000+ global clients, I'm ready to bring my expertise to your next project.
              </p>
              <div className="flex flex-wrap justify-center gap-4">

                <Link
                  href="/resume"
                  className="px-10 py-5 border-2 border-white/20 text-white font-black rounded-2xl hover:border-[#2ecc71] transition-all uppercase tracking-widest text-sm"
                >
                  View Full Resume
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-6 sm:py-8 border-t border-white/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6 text-center md:text-left">
            <FooterLinks />
            <p className="text-slate-400 text-xs sm:text-sm font-medium">
              Designed and Developed by{' '}
              <span className="text-[#2ecc71] font-semibold">Neaz Morshed</span> •{' '}
              <span className="text-slate-500">Copyright © 2026</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
