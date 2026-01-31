"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import {
  ArrowLeft, ArrowRight, ExternalLink, X, Play,
  Briefcase, Database, Target, Layout, Video, Search,
  Loader2, Calendar, User, Eye, Clock, CheckCircle2
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon: string;
  cover_image: string | null;
}

interface PortfolioItem {
  id: string;
  service_slug: string;
  title: string;
  description: string;
  thumbnail_url: string | null;
  image_url: string | null;
  video_url: string | null;
  project_url: string | null;
  client_name: string | null;
  completion_date: string | null;
  duration: string | null;
  tools_used: string[];
  tags: string[];
  is_featured: boolean;
  order_index: number;
}

// Default services data
const defaultServices: { [key: string]: Service } = {
  'video-production': {
    id: 'video-production',
    title: 'Video Production',
    slug: 'video-production',
    description: 'Professional video editing, motion graphics, and video production services. From YouTube content to corporate videos, I deliver high-quality visual content that engages your audience.',
    icon: 'Video',
    cover_image: null
  },
  'virtual-assistance': {
    id: 'virtual-assistance',
    title: 'Virtual Assistance',
    slug: 'virtual-assistance',
    description: 'Comprehensive virtual assistance services including email management, scheduling, data entry, research, and administrative support to help you focus on what matters most.',
    icon: 'Briefcase',
    cover_image: null
  },
  'web-development': {
    id: 'web-development',
    title: 'Web Development',
    slug: 'web-development',
    description: 'Modern, responsive websites built with the latest technologies. From landing pages to full-stack applications, I create digital experiences that convert.',
    icon: 'Layout',
    cover_image: null
  },
  'digital-marketing': {
    id: 'digital-marketing',
    title: 'Digital Marketing',
    slug: 'digital-marketing',
    description: 'Strategic digital marketing services including SEO, social media management, content creation, and paid advertising to grow your online presence.',
    icon: 'Target',
    cover_image: null
  },
  'data-management': {
    id: 'data-management',
    title: 'Data Management',
    slug: 'data-management',
    description: 'Expert data entry, database management, spreadsheet creation, and data analysis services to keep your business organized and data-driven.',
    icon: 'Database',
    cover_image: null
  },
  'seo-services': {
    id: 'seo-services',
    title: 'SEO Services',
    slug: 'seo-services',
    description: 'Search engine optimization services to improve your website ranking, drive organic traffic, and increase your online visibility.',
    icon: 'Search',
    cover_image: null
  }
};

// Default portfolio items - Video Production
const defaultPortfolioItems: PortfolioItem[] = [
  // Video Production Portfolio (9 items)
  {
    id: 'vp1',
    service_slug: 'video-production',
    title: 'YouTube Channel Intro Animation',
    description: 'Created a dynamic and engaging intro animation for a tech YouTube channel. The animation features modern motion graphics, smooth transitions, and brand-aligned color schemes that capture viewer attention in the first 5 seconds.',
    thumbnail_url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&q=80',
    image_url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&q=80',
    video_url: null,
    project_url: null,
    client_name: 'Tech Reviews Daily',
    completion_date: 'January 2025',
    duration: '15 seconds',
    tools_used: ['After Effects', 'Premiere Pro', 'Illustrator'],
    tags: ['Motion Graphics', 'YouTube', 'Branding'],
    is_featured: true,
    order_index: 1
  },
  {
    id: 'vp2',
    service_slug: 'video-production',
    title: 'Corporate Promotional Video',
    description: 'Produced a high-quality corporate promotional video showcasing company culture, services, and achievements. Included drone footage, employee interviews, and professional voice-over narration.',
    thumbnail_url: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800&q=80',
    image_url: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=1200&q=80',
    video_url: null,
    project_url: null,
    client_name: 'Williams Transportation',
    completion_date: 'February 2025',
    duration: '3 minutes',
    tools_used: ['Premiere Pro', 'DaVinci Resolve', 'After Effects'],
    tags: ['Corporate', 'Promotional', 'Drone Footage'],
    is_featured: true,
    order_index: 2
  },
  {
    id: 'vp3',
    service_slug: 'video-production',
    title: 'Product Launch Video',
    description: 'Crafted an exciting product launch video with 3D product visualization, kinetic typography, and energetic music. The video generated significant engagement on social media platforms.',
    thumbnail_url: 'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=800&q=80',
    image_url: 'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=1200&q=80',
    video_url: null,
    project_url: null,
    client_name: 'TechStart Inc.',
    completion_date: 'December 2024',
    duration: '1 minute 30 seconds',
    tools_used: ['After Effects', 'Cinema 4D', 'Premiere Pro'],
    tags: ['Product Launch', '3D Animation', 'Social Media'],
    is_featured: false,
    order_index: 3
  },
  {
    id: 'vp4',
    service_slug: 'video-production',
    title: '8-Hour Relaxation Video',
    description: 'Produced an 8-hour relaxing nature video with ambient sounds for the Aura Relax YouTube channel. Combined royalty-free nature clips with calming audio for sleep and meditation purposes.',
    thumbnail_url: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&q=80',
    image_url: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=1200&q=80',
    video_url: null,
    project_url: 'https://youtube.com',
    client_name: 'Aura Relax & Nature Healing Society',
    completion_date: 'November 2024',
    duration: '8 hours',
    tools_used: ['Premiere Pro', 'Audacity', 'Storyblocks'],
    tags: ['Relaxation', 'YouTube', 'Ambient'],
    is_featured: true,
    order_index: 4
  },
  {
    id: 'vp5',
    service_slug: 'video-production',
    title: 'Event Highlight Reel',
    description: 'Created a dynamic highlight reel for the Savor Boca food festival event. Captured the energy, delicious food, and happy attendees in a 2-minute engaging video.',
    thumbnail_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80',
    video_url: null,
    project_url: null,
    client_name: 'Savor Our City',
    completion_date: 'October 2024',
    duration: '2 minutes',
    tools_used: ['Premiere Pro', 'After Effects', 'LumaFusion'],
    tags: ['Event', 'Highlight Reel', 'Food Festival'],
    is_featured: false,
    order_index: 5
  },
  {
    id: 'vp6',
    service_slug: 'video-production',
    title: 'Podcast Video Editing',
    description: 'Edited and rendered podcast episodes with professional graphics, lower thirds, and engaging visual elements. Created both full-length episodes and short clips for social media promotion.',
    thumbnail_url: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&q=80',
    image_url: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=1200&q=80',
    video_url: null,
    project_url: null,
    client_name: 'Bueno Group',
    completion_date: 'August 2024',
    duration: 'Multiple episodes',
    tools_used: ['Premiere Pro', 'After Effects', 'Descript'],
    tags: ['Podcast', 'Video Editing', 'Social Media Clips'],
    is_featured: false,
    order_index: 6
  },
  {
    id: 'vp7',
    service_slug: 'video-production',
    title: 'Quran Translation Videos',
    description: 'Created meaningful Quran translation videos using AI text-to-video software. Carefully selected scenes using precise keywords to match verse meanings and enhance spiritual experience.',
    thumbnail_url: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=800&q=80',
    image_url: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=1200&q=80',
    video_url: null,
    project_url: null,
    client_name: 'Zeir App',
    completion_date: 'September 2024',
    duration: 'Multiple videos',
    tools_used: ['AI Video Tools', 'Premiere Pro', 'After Effects'],
    tags: ['Religious Content', 'AI Video', 'Translation'],
    is_featured: false,
    order_index: 7
  },
  {
    id: 'vp8',
    service_slug: 'video-production',
    title: 'Social Media Reels Package',
    description: 'Produced a package of 30 short-form vertical videos optimized for Instagram Reels, TikTok, and YouTube Shorts. Each video features trending transitions, text animations, and music sync.',
    thumbnail_url: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800&q=80',
    image_url: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=1200&q=80',
    video_url: null,
    project_url: null,
    client_name: 'iPad Art SoCal',
    completion_date: 'November 2024',
    duration: '15-60 seconds each',
    tools_used: ['Premiere Pro', 'CapCut', 'Canva'],
    tags: ['Social Media', 'Reels', 'Short Form'],
    is_featured: true,
    order_index: 8
  },
  {
    id: 'vp9',
    service_slug: 'video-production',
    title: 'Training Video Series',
    description: 'Developed a comprehensive training video series for internal company use. Includes screen recordings, presenter footage, animated explanations, and interactive elements.',
    thumbnail_url: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800&q=80',
    image_url: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=1200&q=80',
    video_url: null,
    project_url: null,
    client_name: 'Release Media Inc.',
    completion_date: 'July 2024',
    duration: '10 videos, 5-10 min each',
    tools_used: ['Camtasia', 'Premiere Pro', 'After Effects'],
    tags: ['Training', 'Corporate', 'Educational'],
    is_featured: false,
    order_index: 9
  },
  // Virtual Assistance Portfolio
  {
    id: 'va1',
    service_slug: 'virtual-assistance',
    title: 'Executive Calendar Management',
    description: 'Managed complex calendars for multiple executives, coordinating meetings across time zones, handling rescheduling, and ensuring optimal time allocation.',
    thumbnail_url: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&q=80',
    image_url: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=1200&q=80',
    video_url: null,
    project_url: null,
    client_name: 'Joey Guillory',
    completion_date: 'October 2023',
    duration: '10 months',
    tools_used: ['Google Calendar', 'Calendly', 'Slack'],
    tags: ['Calendar Management', 'Executive Support', 'Scheduling'],
    is_featured: true,
    order_index: 1
  },
  {
    id: 'va2',
    service_slug: 'virtual-assistance',
    title: 'Email Inbox Zero Management',
    description: 'Implemented inbox zero methodology, categorizing and responding to hundreds of emails daily, creating templates, and maintaining organized email systems.',
    thumbnail_url: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=800&q=80',
    image_url: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=1200&q=80',
    video_url: null,
    project_url: null,
    client_name: 'Multiple Clients',
    completion_date: 'Ongoing',
    duration: 'Continuous',
    tools_used: ['Gmail', 'Outlook', 'Superhuman'],
    tags: ['Email Management', 'Organization', 'Communication'],
    is_featured: false,
    order_index: 2
  },
  // Web Development Portfolio
  {
    id: 'wd1',
    service_slug: 'web-development',
    title: 'Transportation Company Website',
    description: 'Developed a modern, responsive website for Williams Transportation with online booking system, fleet showcase, and contact integration.',
    thumbnail_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80',
    video_url: null,
    project_url: 'https://wtransportsolution.com',
    client_name: 'Williams Transportation',
    completion_date: 'January 2025',
    duration: '3 weeks',
    tools_used: ['Next.js', 'Tailwind CSS', 'Vercel'],
    tags: ['Corporate Website', 'Responsive', 'Booking System'],
    is_featured: true,
    order_index: 1
  },
  {
    id: 'wd2',
    service_slug: 'web-development',
    title: 'Catering Business Website',
    description: 'Created an elegant website for a catering company featuring menu showcase, event gallery, testimonials, and quote request system.',
    thumbnail_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
    image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=80',
    video_url: null,
    project_url: 'https://thesoleingredientcatering.com',
    client_name: 'The Sole Ingredient Catering LLC',
    completion_date: 'January 2025',
    duration: '2 weeks',
    tools_used: ['Next.js', 'Supabase', 'Tailwind CSS'],
    tags: ['Restaurant', 'Catering', 'Food Business'],
    is_featured: true,
    order_index: 2
  },
  {
    id: 'wd3',
    service_slug: 'web-development',
    title: 'Muslim Hunt Platform',
    description: 'Engineered and deployed the Muslim Hunt website using Next.js, Supabase, and GitHub, hosted on Vercel. Integrated AI features using Claude and Gemini.',
    thumbnail_url: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800&q=80',
    image_url: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=1200&q=80',
    video_url: null,
    project_url: null,
    client_name: 'Zeir App',
    completion_date: 'March 2024',
    duration: '2 months',
    tools_used: ['Next.js', 'Supabase', 'Claude AI', 'Vercel'],
    tags: ['Web App', 'AI Integration', 'Full Stack'],
    is_featured: true,
    order_index: 3
  }
];

const iconMap: { [key: string]: React.ReactNode } = {
  Briefcase: <Briefcase className="w-8 h-8" />,
  Database: <Database className="w-8 h-8" />,
  Target: <Target className="w-8 h-8" />,
  Layout: <Layout className="w-8 h-8" />,
  Video: <Video className="w-8 h-8" />,
  Search: <Search className="w-8 h-8" />,
};

export default function PortfolioCollectionPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [service, setService] = useState<Service | null>(null);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  useEffect(() => {
    async function fetchData() {
      // First try to get from Supabase
      if (supabase && slug) {
        try {
          // Fetch service details
          const { data: serviceData } = await supabase
            .from('services')
            .select('*')
            .eq('slug', slug)
            .single();

          if (serviceData) {
            setService(serviceData);

            // Fetch portfolio items for this service
            const { data: portfolioData } = await supabase
              .from('portfolio_items')
              .select('*')
              .eq('service_id', serviceData.id)
              .order('order_index', { ascending: true });

            if (portfolioData && portfolioData.length > 0) {
              setPortfolioItems(portfolioData);
              setLoading(false);
              return;
            }
          }
        } catch (error) {
          console.error('Error fetching from Supabase:', error);
        }
      }

      // Fall back to default data
      const defaultService = defaultServices[slug];
      if (defaultService) {
        setService(defaultService);
        const defaultItems = defaultPortfolioItems.filter(item => item.service_slug === slug);
        setPortfolioItems(defaultItems);
      }

      setLoading(false);
    }

    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="bg-[#0b0f1a] text-white min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#2ecc71] animate-spin" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="bg-[#0b0f1a] text-white min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-4xl font-black mb-4">Service Not Found</h1>
        <Link href="/services" className="text-[#2ecc71] hover:underline">
          Back to Services
        </Link>
      </div>
    );
  }

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
            <Link href="/services" className="text-[11px] font-bold tracking-[0.3em] text-[#2ecc71] transition-all uppercase">Services</Link>
            <Link href="/experience" className="text-[11px] font-bold tracking-[0.3em] text-slate-400 hover:text-[#2ecc71] transition-all uppercase">Experience</Link>
            <Link href="/reviews" className="text-[11px] font-bold tracking-[0.3em] text-slate-400 hover:text-[#2ecc71] transition-all uppercase">Reviews</Link>
            <Link href="/contact" className="text-[11px] font-bold tracking-[0.3em] text-slate-400 hover:text-[#2ecc71] transition-all uppercase">Contact</Link>
            <Link href="/resume" className="bg-[#2ecc71] text-slate-950 px-8 py-4 rounded-2xl font-black text-[11px] tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#2ecc71]/20 uppercase">Resume</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 relative overflow-hidden">
        <div className="absolute top-[10%] right-[5%] w-[600px] h-[600px] bg-[#2ecc71]/5 rounded-full blur-[180px] pointer-events-none"></div>

        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-3 mb-8">
            <Link href="/services" className="inline-flex items-center gap-2 text-slate-400 hover:text-[#2ecc71] transition-all group">
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-bold uppercase tracking-wider">Services</span>
            </Link>
            <ArrowRight size={14} className="text-slate-600" />
            <span className="text-[#2ecc71] text-sm font-bold uppercase tracking-wider">{service.title}</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8"
          >
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="text-[#2ecc71] p-4 bg-white/5 rounded-2xl border border-white/10">
                  {iconMap[service.icon] || <Briefcase className="w-8 h-8" />}
                </div>
                <span className="text-[#2ecc71] text-[11px] font-black uppercase tracking-[0.5em]">Portfolio Collection</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-none mb-6">
                {service.title}
              </h1>
              <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
                {service.description}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-center p-8 bg-slate-900/60 border border-white/10 rounded-3xl">
                <div className="text-4xl font-black text-[#2ecc71]">{portfolioItems.length}</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Projects</div>
              </div>
              <div className="text-center p-8 bg-slate-900/60 border border-white/10 rounded-3xl">
                <div className="text-4xl font-black text-[#2ecc71]">{portfolioItems.filter(i => i.is_featured).length}</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Featured</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-7xl">
          {portfolioItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 mx-auto mb-6 bg-slate-900 rounded-full flex items-center justify-center">
                {iconMap[service.icon] || <Briefcase className="w-12 h-12 text-slate-600" />}
              </div>
              <h3 className="text-2xl font-black text-slate-400 mb-4">No Projects Yet</h3>
              <p className="text-slate-500 max-w-md mx-auto">
                Portfolio items for this service will be added soon. Check back later or contact me for custom work.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 mt-8 px-8 py-4 bg-[#2ecc71] text-slate-900 font-black rounded-2xl hover:scale-105 transition-transform"
              >
                Get in Touch <ArrowRight size={18} />
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {portfolioItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onClick={() => setSelectedItem(item)}
                  className="cursor-pointer group"
                >
                  <div className="relative overflow-hidden rounded-3xl border border-white/5 hover:border-[#2ecc71]/40 transition-all duration-500 bg-slate-900/60 h-full flex flex-col">
                    {/* Image */}
                    <div className="aspect-video relative overflow-hidden">
                      {item.thumbnail_url || item.image_url ? (
                        <img
                          src={item.thumbnail_url || item.image_url || ''}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                          {iconMap[service.icon] || <Briefcase className="w-16 h-16 text-slate-600" />}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f1a] via-transparent to-transparent opacity-60"></div>

                      {/* Play Button for Videos */}
                      {item.video_url && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 bg-[#2ecc71] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-[#2ecc71]/30">
                            <Play size={28} className="text-slate-900 ml-1" fill="currentColor" />
                          </div>
                        </div>
                      )}

                      {/* Featured Badge */}
                      {item.is_featured && (
                        <div className="absolute top-4 right-4 px-3 py-1 bg-[#2ecc71] text-slate-900 text-[9px] font-black rounded-full uppercase">
                          Featured
                        </div>
                      )}

                      {/* Duration Badge */}
                      {item.duration && (
                        <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/70 text-white text-[10px] font-bold rounded-full flex items-center gap-1">
                          <Clock size={12} />
                          {item.duration}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-xl font-black mb-2 group-hover:text-[#2ecc71] transition-colors uppercase tracking-tight">
                        {item.title}
                      </h3>

                      {item.client_name && (
                        <div className="flex items-center gap-2 text-slate-500 text-sm mb-3">
                          <User size={14} />
                          <span>{item.client_name}</span>
                        </div>
                      )}

                      <p className="text-slate-400 text-sm line-clamp-2 mb-4 flex-1">
                        {item.description}
                      </p>

                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-auto">
                          {item.tags.slice(0, 3).map((tag, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-wider"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
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

            <div className="text-[#2ecc71] p-5 bg-white/5 rounded-2xl border border-white/10 inline-flex mb-6">
              {iconMap[service.icon] || <Briefcase className="w-10 h-10" />}
            </div>
            <h3 className="text-3xl font-black uppercase tracking-tight mb-4">
              Need Similar Work?
            </h3>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto">
              I can create custom {service.title.toLowerCase()} solutions tailored to your specific needs. Let's discuss your project!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="px-10 py-5 bg-[#2ecc71] text-slate-900 font-black rounded-2xl hover:scale-105 transition-transform uppercase tracking-widest text-sm flex items-center gap-3"
              >
                Start a Project <ArrowRight size={18} />
              </Link>
              <Link
                href="/services"
                className="px-10 py-5 border-2 border-white/20 text-white font-black rounded-2xl hover:border-[#2ecc71] transition-all uppercase tracking-widest text-sm"
              >
                View All Services
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Modal for Portfolio Item Details */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-xl overflow-y-auto"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-[#0e1526] rounded-[2rem] md:rounded-[3rem] max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/10 relative my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 md:top-6 md:right-6 z-10 p-3 bg-white/10 rounded-full hover:bg-[#2ecc71] hover:text-slate-900 transition-all"
              >
                <X size={24} />
              </button>

              {/* Image/Video */}
              {selectedItem.video_url ? (
                <div className="aspect-video relative overflow-hidden rounded-t-[2rem] md:rounded-t-[3rem] bg-black">
                  <iframe
                    src={selectedItem.video_url}
                    className="w-full h-full"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                </div>
              ) : (selectedItem.image_url || selectedItem.thumbnail_url) && (
                <div className="aspect-video relative overflow-hidden rounded-t-[2rem] md:rounded-t-[3rem]">
                  <img
                    src={selectedItem.image_url || selectedItem.thumbnail_url || ''}
                    alt={selectedItem.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Content */}
              <div className="p-6 md:p-10">
                {/* Featured Badge */}
                {selectedItem.is_featured && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#2ecc71]/20 text-[#2ecc71] text-[10px] font-black rounded-full uppercase mb-4">
                    <CheckCircle2 size={12} />
                    Featured Project
                  </span>
                )}

                <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight mb-4">
                  {selectedItem.title}
                </h2>

                <div className="flex flex-wrap gap-4 mb-6">
                  {selectedItem.client_name && (
                    <div className="flex items-center gap-2 text-slate-400">
                      <User size={16} className="text-[#2ecc71]" />
                      <span className="text-sm font-semibold">{selectedItem.client_name}</span>
                    </div>
                  )}
                  {selectedItem.completion_date && (
                    <div className="flex items-center gap-2 text-slate-400">
                      <Calendar size={16} className="text-[#2ecc71]" />
                      <span className="text-sm font-semibold">{selectedItem.completion_date}</span>
                    </div>
                  )}
                  {selectedItem.duration && (
                    <div className="flex items-center gap-2 text-slate-400">
                      <Clock size={16} className="text-[#2ecc71]" />
                      <span className="text-sm font-semibold">{selectedItem.duration}</span>
                    </div>
                  )}
                </div>

                {selectedItem.description && (
                  <p className="text-slate-400 leading-relaxed mb-8">
                    {selectedItem.description}
                  </p>
                )}

                {/* Tools Used */}
                {selectedItem.tools_used && selectedItem.tools_used.length > 0 && (
                  <div className="mb-6">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 block">Tools & Software Used</span>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.tools_used.map((tool, i) => (
                        <span
                          key={i}
                          className="px-4 py-2 bg-[#2ecc71]/10 border border-[#2ecc71]/20 rounded-full text-sm font-bold text-[#2ecc71]"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {selectedItem.tags && selectedItem.tags.length > 0 && (
                  <div className="mb-8">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 block">Tags</span>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm font-bold text-slate-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4">
                  {selectedItem.project_url && (
                    <a
                      href={selectedItem.project_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 px-8 py-4 bg-[#2ecc71] text-slate-900 font-black rounded-2xl hover:scale-105 transition-transform uppercase tracking-wider"
                    >
                      View Project <ExternalLink size={18} />
                    </a>
                  )}
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-3 px-8 py-4 border-2 border-white/20 text-white font-black rounded-2xl hover:border-[#2ecc71] transition-all uppercase tracking-wider"
                  >
                    Request Similar Work
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
