"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft, Download, Mail, Phone, MapPin, Globe,
  Briefcase, GraduationCap, Award, Code, Calendar,
  Linkedin, ExternalLink, Cpu, ChevronDown, CheckCircle2,
  Sparkles, Zap
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  start_date: string;
  end_date: string;
  description: string[];
  type: 'full-time' | 'part-time' | 'project';
  order_index: number;
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  start_date: string;
  end_date: string;
  location: string;
  order_index: number;
}

interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string;
  expiry?: string;
  credential_url?: string;
  order_index: number;
}

// Default Data
const defaultExperiences: Experience[] = [
  // Full-time experiences
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
    order_index: 13
  },
  // Part-time experiences
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
    order_index: 12
  },
  // Project-based experiences
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
    order_index: 4
  }
];

const defaultEducation: Education[] = [
  {
    id: 'edu1',
    institution: 'American International University-Bangladesh (AIUB)',
    degree: 'EMBA',
    field: 'Management Information Systems (MIS)',
    start_date: 'September 2020',
    end_date: 'December 2021',
    location: 'Dhaka, Bangladesh',
    order_index: 1
  },
  {
    id: 'edu2',
    institution: 'North South University',
    degree: 'B.Sc.',
    field: 'Electrical & Electronic Engineering',
    start_date: 'September 2009',
    end_date: 'December 2015',
    location: 'Dhaka, Bangladesh',
    order_index: 2
  },
  {
    id: 'edu3',
    institution: 'Dr. Abdur Razzak Municipal College',
    degree: 'H.S.C',
    field: 'Science',
    start_date: 'September 2007',
    end_date: 'September 2009',
    location: 'Jessore Board, Bangladesh',
    order_index: 3
  },
  {
    id: 'edu4',
    institution: 'Daud Public School, Jessore Cantonment',
    degree: 'S.S.C',
    field: 'Science',
    start_date: 'January 1997',
    end_date: 'May 2007',
    location: 'Jessore Board, Bangladesh',
    order_index: 4
  }
];

const defaultCertifications: Certification[] = [
  {
    id: 'cert1',
    title: 'Builders Guide to the AI SDK',
    issuer: 'Vercel',
    date: 'January 2026',
    order_index: 1
  },
  {
    id: 'cert2',
    title: 'Next.js App Router Fundamentals',
    issuer: 'Vercel',
    date: 'January 2026',
    order_index: 2
  },
  {
    id: 'cert3',
    title: 'Government Certified Freelancer',
    issuer: 'ICT Division Bangladesh Government',
    date: 'May 2024',
    expiry: 'May 2025',
    order_index: 3
  },
  {
    id: 'cert4',
    title: 'ITES Foundation Skills Training',
    issuer: 'Ernst & Young LLP, India (Certified by George Washington University, USA)',
    date: 'May 2024',
    expiry: 'May 2025',
    order_index: 4
  },
  {
    id: 'cert5',
    title: 'Social Media Marketing',
    issuer: 'HubSpot Academy',
    date: 'February 2024',
    expiry: 'March 2026',
    order_index: 5
  }
];

const skills = {
  'Modern Web Stack': ['Next.js', 'Node.js', 'Supabase (Database & Auth)', 'Vercel (Deployment)', 'React'],
  'Full-Stack Workflow': ['Building scalable web applications', 'API integration', 'Cloud databases'],
  'Administrative & VA': ['Administrative Support', 'Task Management', 'Email & Calendar Management', 'Database Management'],
  'Media & Content': ['Video Production (Premiere Pro, Filmora)', 'Canva', 'Photoshop', 'Social Media Management', 'Content Writing'],
  'Web & CMS': ['WordPress', 'Squarespace', 'Wix', 'IONOS', 'HypnoBiz-in-a-Box'],
  'Sales & Marketing': ['Technical Sales', 'Lead Generation', 'Marketing Strategy', 'Email Marketing'],
  'AI & Automation': ['GenSpark AI', 'ChatGPT', 'DALL-E', 'Eleven Labs', 'Midjourney', 'RunwayML', 'Pictory AI', 'Vizard.ai']
};

export default function ResumePage() {
  const [experiences, setExperiences] = useState<Experience[]>(defaultExperiences);
  const [education, setEducation] = useState<Education[]>(defaultEducation);
  const [certifications, setCertifications] = useState<Certification[]>(defaultCertifications);
  const [activeTab, setActiveTab] = useState<'full-time' | 'part-time' | 'project'>('full-time');
  const [expandedExp, setExpandedExp] = useState<string | null>(null);
  const [expandedEdu, setExpandedEdu] = useState<string | null>(null);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  const personalInfo = {
    name: "NEAZ MD. MORSHED",
    title: "Digital Asset Builder | AI Implementation Engineer",
    email: "neazmd.tamim@gmail.com",
    phone: "+8801775939996",
    location: "Bashundhara R/A, Dhaka, Bangladesh",
    linkedin: "linkedin.com/in/neazmorshed222",
    portfolio: "neaz.pro"
  };

  const pdfUrl = "https://drive.google.com/uc?export=download&id=1rouYADSZdqaNf74U341XElF_0H57tqtu";

  useEffect(() => {
    async function fetchData() {
      if (!supabase) return;

      try {
        const { data: expData } = await supabase
          .from('resume_experiences')
          .select('*')
          .order('order_index', { ascending: true });
        if (expData && expData.length > 0) setExperiences(expData);

        const { data: eduData } = await supabase
          .from('resume_education')
          .select('*')
          .order('order_index', { ascending: true });
        if (eduData && eduData.length > 0) setEducation(eduData);

        const { data: certData } = await supabase
          .from('resume_certifications')
          .select('*')
          .order('order_index', { ascending: true });
        if (certData && certData.length > 0) setCertifications(certData);
      } catch (error) {
        console.error('Error fetching resume data:', error);
      }
    }

    fetchData();
  }, []);

  const filteredExperiences = experiences.filter(exp => exp.type === activeTab);

  const achievements = [
    { label: 'Job Success', value: '100%', icon: <Zap size={20} /> },
    { label: 'Hours Completed', value: '5,000+', icon: <Sparkles size={20} /> },
    { label: 'Global Clients', value: '180+', icon: <Globe size={20} /> },
    { label: 'Years Experience', value: '12+', icon: <Briefcase size={20} /> }
  ];

  return (
    <div className="bg-[#0b0f1a] text-white min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-[100] bg-[#0b0f1a]/90 backdrop-blur-2xl border-b border-white/5 py-4">
        <div className="container mx-auto px-6 lg:px-12 flex justify-between items-center max-w-7xl">
          <Link href="/" className="flex items-center gap-4 group cursor-pointer">
            <div className="w-12 h-12 bg-[#2ecc71] rounded-2xl flex items-center justify-center font-black text-slate-950 group-hover:rotate-6 transition-all shadow-[0_0_30px_rgba(46,204,113,0.3)]">NM</div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tighter leading-none">NEAZ MORSHED</span>
              <span className="text-[10px] text-[#2ecc71] font-bold tracking-[0.2em] mt-1 uppercase">Top Rated Pro</span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-10">
            <Link href="/" className="text-[11px] font-bold tracking-[0.3em] text-slate-400 hover:text-[#2ecc71] transition-all uppercase">Home</Link>
            <Link href="/skills" className="text-[11px] font-bold tracking-[0.3em] text-slate-400 hover:text-[#2ecc71] transition-all uppercase">Skills</Link>
            <Link href="/services" className="text-[11px] font-bold tracking-[0.3em] text-slate-400 hover:text-[#2ecc71] transition-all uppercase">Services</Link>
            <Link href="/experience" className="text-[11px] font-bold tracking-[0.3em] text-slate-400 hover:text-[#2ecc71] transition-all uppercase">Experience</Link>
            <Link href="/reviews" className="text-[11px] font-bold tracking-[0.3em] text-slate-400 hover:text-[#2ecc71] transition-all uppercase">Reviews</Link>
            <Link href="/contact" className="text-[11px] font-bold tracking-[0.3em] text-slate-400 hover:text-[#2ecc71] transition-all uppercase">Contact</Link>
            <Link href="/resume" className="bg-[#2ecc71] text-slate-950 px-8 py-4 rounded-2xl font-black text-[11px] tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#2ecc71]/20 uppercase">Resume</Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6 max-w-6xl">
          {/* Back Link */}
          <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-[#2ecc71] transition-all mb-8 group">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-bold uppercase tracking-wider">Back to Home</span>
          </Link>

          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative bg-gradient-to-r from-[#2ecc71]/20 via-[#2ecc71]/10 to-transparent p-8 lg:p-12 rounded-[3rem] border border-white/10 mb-12 overflow-hidden"
          >
            {/* Animated Background */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#2ecc71]/10 rounded-full blur-[100px] -z-10 animate-pulse"></div>

            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div>
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl lg:text-5xl font-black uppercase tracking-tighter mb-2"
                >
                  {personalInfo.name}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-[#2ecc71] text-lg font-bold mb-4"
                >
                  {personalInfo.title}
                </motion.p>
                {/* Contact Info */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-wrap gap-4 text-sm"
                >
                  <div className="flex items-center gap-2 text-slate-300 hover:text-[#2ecc71] transition-colors cursor-pointer">
                    <Mail size={14} className="text-[#2ecc71]" />
                    <span>{personalInfo.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300 hover:text-[#2ecc71] transition-colors cursor-pointer">
                    <Phone size={14} className="text-[#2ecc71]" />
                    <span>{personalInfo.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <MapPin size={14} className="text-[#2ecc71]" />
                    <span>{personalInfo.location}</span>
                  </div>
                </motion.div>
                <div className="flex flex-wrap gap-4 mt-3">
                  <a href={`https://www.${personalInfo.linkedin}`} target="_blank" className="flex items-center gap-2 text-slate-400 hover:text-[#2ecc71] transition-colors text-sm group">
                    <Linkedin size={14} />
                    <span>LinkedIn</span>
                    <ExternalLink size={10} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </a>
                  <a href={`https://${personalInfo.portfolio}`} target="_blank" className="flex items-center gap-2 text-slate-400 hover:text-[#2ecc71] transition-colors text-sm group">
                    <Globe size={14} />
                    <span>Portfolio</span>
                    <ExternalLink size={10} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </a>
                </div>
              </div>
              <motion.a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 px-8 py-4 bg-[#2ecc71] text-slate-950 font-black rounded-2xl shadow-lg shadow-[#2ecc71]/20 uppercase tracking-wider text-sm"
              >
                <Download size={18} />
                Download PDF
              </motion.a>
            </div>
          </motion.div>

          {/* Stats with Icons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {achievements.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="p-5 bg-slate-900/60 rounded-2xl text-center border border-white/5 hover:border-[#2ecc71]/30 transition-all cursor-pointer group"
              >
                <div className="flex justify-center mb-2 text-[#2ecc71] group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
                <div className="text-2xl font-black text-[#2ecc71]">{stat.value}</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* ========== SECTION 1: WORK EXPERIENCE ========== */}
          <section className="mb-16">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 text-2xl font-black uppercase tracking-tight mb-8"
            >
              <div className="p-3 bg-[#2ecc71]/10 rounded-xl">
                <Briefcase className="text-[#2ecc71]" size={28} />
              </div>
              Work Experience
              <span className="text-sm text-slate-500 font-normal ml-2">({experiences.length} positions)</span>
            </motion.h2>

            {/* Experience Tabs */}
            <div className="flex flex-wrap gap-3 mb-8">
              {[
                { key: 'full-time', label: 'Full-Time', color: 'bg-[#2ecc71]' },
                { key: 'part-time', label: 'Part-Time', color: 'bg-blue-500' },
                { key: 'project', label: 'Project-Based', color: 'bg-purple-500' }
              ].map((tab) => (
                <motion.button
                  key={tab.key}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab.key as typeof activeTab)}
                  className={`px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                    activeTab === tab.key
                      ? `${tab.color} text-slate-900 shadow-lg`
                      : 'bg-slate-900/60 text-slate-400 hover:text-white border border-white/10 hover:border-white/20'
                  }`}
                >
                  {tab.label}
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    activeTab === tab.key ? 'bg-slate-900/20' : 'bg-white/10'
                  }`}>
                    {experiences.filter(e => e.type === tab.key).length}
                  </span>
                </motion.button>
              ))}
            </div>

            <div className="space-y-4">
              <AnimatePresence mode="wait">
                {filteredExperiences.map((exp, i) => (
                  <motion.div
                    key={exp.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: i * 0.05 }}
                    className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                      expandedExp === exp.id
                        ? 'bg-[#1a1f2e] border-[#2ecc71]/30 shadow-lg shadow-[#2ecc71]/5'
                        : 'bg-slate-900/60 border-white/5 hover:border-white/10'
                    }`}
                  >
                    <div
                      onClick={() => setExpandedExp(expandedExp === exp.id ? null : exp.id)}
                      className="p-5 cursor-pointer"
                    >
                      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-2 mb-2">
                        <div className="flex-1">
                          <h3 className={`text-lg font-bold transition-colors ${
                            expandedExp === exp.id ? 'text-[#2ecc71]' : 'text-white'
                          }`}>{exp.position}</h3>
                          <p className="text-[#2ecc71] font-semibold text-sm">{exp.company}</p>
                          <p className="text-slate-500 text-xs mt-1">{exp.location}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-800/50 px-3 py-1.5 rounded-lg">
                            <Calendar size={12} />
                            <span>{exp.start_date} - {exp.end_date}</span>
                          </div>
                          <ChevronDown
                            size={18}
                            className={`text-slate-400 transition-transform duration-300 ${
                              expandedExp === exp.id ? 'rotate-180 text-[#2ecc71]' : ''
                            }`}
                          />
                        </div>
                      </div>
                    </div>

                    <AnimatePresence>
                      {expandedExp === exp.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-5 pt-2 border-t border-white/5">
                            <ul className="space-y-2">
                              {exp.description.map((desc, j) => (
                                <motion.li
                                  key={j}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: j * 0.1 }}
                                  className="text-slate-300 text-sm flex items-start gap-2"
                                >
                                  <CheckCircle2 size={14} className="text-[#2ecc71] mt-0.5 flex-shrink-0" />
                                  <span>{desc}</span>
                                </motion.li>
                              ))}
                            </ul>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </section>

          {/* ========== SECTION 2: EDUCATION ========== */}
          <section className="mb-16">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 text-2xl font-black uppercase tracking-tight mb-8"
            >
              <div className="p-3 bg-[#2ecc71]/10 rounded-xl">
                <GraduationCap className="text-[#2ecc71]" size={28} />
              </div>
              Education
            </motion.h2>
            <div className="grid md:grid-cols-2 gap-4">
              {education.map((edu, i) => (
                <motion.div
                  key={edu.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.02, y: -3 }}
                  onClick={() => setExpandedEdu(expandedEdu === edu.id ? null : edu.id)}
                  className={`p-6 rounded-2xl border transition-all cursor-pointer ${
                    expandedEdu === edu.id
                      ? 'bg-[#1a1f2e] border-[#2ecc71]/30 shadow-lg'
                      : 'bg-slate-900/60 border-white/5 hover:border-[#2ecc71]/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className={`p-2 rounded-lg transition-colors ${
                      expandedEdu === edu.id ? 'bg-[#2ecc71] text-slate-900' : 'bg-[#2ecc71]/10 text-[#2ecc71]'
                    }`}>
                      <GraduationCap size={20} />
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Calendar size={12} />
                      <span>{edu.end_date.split(' ').pop()}</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">{edu.degree} in {edu.field}</h3>
                  <p className="text-[#2ecc71] font-semibold text-sm">{edu.institution}</p>

                  <AnimatePresence>
                    {expandedEdu === edu.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-4 mt-4 border-t border-white/10">
                          <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                            <MapPin size={14} />
                            <span>{edu.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-400 text-sm">
                            <Calendar size={14} />
                            <span>{edu.start_date} - {edu.end_date}</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ========== SECTION 3: CAPSTONE PROJECT ========== */}
          <section className="mb-16">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 text-2xl font-black uppercase tracking-tight mb-8"
            >
              <div className="p-3 bg-[#2ecc71]/10 rounded-xl">
                <Cpu className="text-[#2ecc71]" size={28} />
              </div>
              Capstone Project
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.01 }}
              className="p-8 bg-gradient-to-br from-slate-900/80 to-slate-900/40 rounded-3xl border border-white/10 hover:border-[#2ecc71]/30 transition-all relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-[#2ecc71]/5 rounded-full blur-[80px] group-hover:bg-[#2ecc71]/10 transition-all"></div>

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-[#2ecc71]/20 text-[#2ecc71] text-xs font-bold rounded-full uppercase tracking-wider">
                    IEEE Published
                  </span>
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-bold rounded-full uppercase tracking-wider">
                    2015
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-4 leading-tight">
                  Microcontroller Based Home Automation System Using Bluetooth, GSM, Wi-Fi and DTMF
                </h3>

                <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                  Neaz Md. Morshed, G M Muid Ur Rahman, Md. Rezaul Karim and Hasan U. Zaman, Proc. 3rd Intl. Conference on Advances in Electrical Engineering (ICAEE'15), pp. 101-104, Dhaka, Bangladesh, December 17-19, 2015
                </p>

                <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                  <span className="text-slate-500 text-xs font-mono">DOI: 10.1109/ICAEE.2015.7506806</span>
                  <a
                    href="https://doi.org/10.1109/ICAEE.2015.7506806"
                    target="_blank"
                    className="flex items-center gap-1 text-[#2ecc71] text-xs font-bold hover:underline"
                  >
                    View Publication <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </motion.div>
          </section>

          {/* ========== SECTION 4: CERTIFICATIONS ========== */}
          <section className="mb-16">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 text-2xl font-black uppercase tracking-tight mb-8"
            >
              <div className="p-3 bg-[#2ecc71]/10 rounded-xl">
                <Award className="text-[#2ecc71]" size={28} />
              </div>
              Certifications
              <span className="text-sm text-slate-500 font-normal ml-2">({certifications.length})</span>
            </motion.h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {certifications.map((cert, i) => (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.03, y: -5 }}
                  className="p-5 bg-slate-900/60 rounded-2xl border border-white/5 hover:border-[#2ecc71]/30 transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2 bg-[#2ecc71]/10 rounded-lg text-[#2ecc71] group-hover:bg-[#2ecc71] group-hover:text-slate-900 transition-all">
                      <Award size={18} />
                    </div>
                    {cert.expiry && (
                      <span className="text-[10px] px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full font-bold">
                        Valid till {cert.expiry}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-white mb-1 group-hover:text-[#2ecc71] transition-colors">{cert.title}</h3>
                  <p className="text-slate-400 text-sm font-medium">{cert.issuer}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-3">
                    <Calendar size={12} />
                    <span>Issued {cert.date}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ========== SECTION 5: SKILLS & EXPERTISE ========== */}
          <section className="mb-16">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 text-2xl font-black uppercase tracking-tight mb-8"
            >
              <div className="p-3 bg-[#2ecc71]/10 rounded-xl">
                <Code className="text-[#2ecc71]" size={28} />
              </div>
              Skills & Expertise
            </motion.h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(skills).map(([category, skillList], i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  onMouseEnter={() => setHoveredSkill(category)}
                  onMouseLeave={() => setHoveredSkill(null)}
                  className={`p-5 rounded-2xl border transition-all duration-300 ${
                    hoveredSkill === category
                      ? 'bg-[#1a1f2e] border-[#2ecc71]/40 shadow-lg shadow-[#2ecc71]/10 scale-[1.02]'
                      : 'bg-slate-900/60 border-white/5'
                  }`}
                >
                  <h3 className={`text-sm font-bold uppercase tracking-wider mb-4 transition-colors ${
                    hoveredSkill === category ? 'text-[#2ecc71]' : 'text-slate-400'
                  }`}>{category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {skillList.map((skill, j) => (
                      <motion.span
                        key={j}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: j * 0.03 }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          hoveredSkill === category
                            ? 'bg-[#2ecc71]/20 text-[#2ecc71] border border-[#2ecc71]/30'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Download CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center pt-12 border-t border-white/10"
          >
            <p className="text-slate-400 mb-6 text-lg">Get a copy of my complete resume</p>
            <motion.a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 px-12 py-5 bg-[#2ecc71] text-slate-950 font-black rounded-2xl shadow-xl shadow-[#2ecc71]/30 uppercase tracking-wider group"
            >
              <Download size={20} className="group-hover:animate-bounce" />
              Download PDF Resume
            </motion.a>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-white/5">
        <div className="container mx-auto px-6 max-w-7xl flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div className="flex gap-8">
            <a href="https://www.linkedin.com/in/neazmorshed222/" target="_blank" className="text-slate-500 hover:text-[#2ecc71] transition-all uppercase text-[10px] font-bold tracking-widest">LinkedIn</a>
            <a href="https://www.fiverr.com/neaz222" target="_blank" className="text-slate-500 hover:text-[#2ecc71] transition-all uppercase text-[10px] font-bold tracking-widest">Fiverr</a>
            <a href="https://www.facebook.com/neazmorshed001/" target="_blank" className="text-slate-500 hover:text-[#2ecc71] transition-all uppercase text-[10px] font-bold tracking-widest">Facebook</a>
          </div>
          <p className="text-slate-400 text-sm font-medium">
            Designed and Developed by <span className="text-[#2ecc71] font-semibold">Neaz Morshed</span> • <span className="text-slate-600">Copyright © 2026</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
