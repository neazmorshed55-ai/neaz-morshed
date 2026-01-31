"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft, ArrowRight, Loader2, Clock, CheckCircle2,
  Star, Users, Briefcase, ExternalLink
} from 'lucide-react';
import { supabase } from '../../../../../lib/supabase';

interface SubSkill {
  id: string;
  title: string;
  slug: string;
  description: string;
  long_description: string;
  cover_image: string;
  gallery_images: string[];
  tools_used: string[];
  experience_years: string;
  project_count: number;
}

interface SkillCategory {
  id: string;
  title: string;
  slug: string;
}

const defaultSkillData: { [key: string]: { [key: string]: SubSkill } } = {
  'video-production': {
    'podcast-creation': {
      id: 's1', title: 'Podcast Creation', slug: 'podcast-creation',
      description: 'Professional podcast production including recording, editing, and publishing.',
      long_description: 'I provide end-to-end podcast production services that help you create engaging audio content. From initial recording setup and guidance to professional editing with intro/outro music, noise reduction, and audio enhancement. I also assist with publishing to major platforms like Spotify, Apple Podcasts, and Google Podcasts.\n\nMy podcast services include:\n- Audio recording guidance and quality checks\n- Professional editing and mixing\n- Intro/outro creation and music integration\n- Noise reduction and audio enhancement\n- Show notes and transcript creation\n- Platform publishing and distribution',
      cover_image: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&q=80&w=1200',
      gallery_images: [
        'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1589903308904-1010c2294adc?auto=format&fit=crop&q=80&w=600',
      ],
      tools_used: ['Adobe Audition', 'Audacity', 'Descript', 'Anchor', 'Riverside.fm'],
      experience_years: '4+ Years', project_count: 150
    },
    'subtitle-adding': {
      id: 's2', title: 'Subtitle Adding in a Video', slug: 'subtitle-adding',
      description: 'Accurate subtitle creation and synchronization for videos in multiple languages.',
      long_description: 'Professional subtitle and caption services to make your video content accessible to a global audience. I provide accurate transcription and translation services with perfect timing synchronization.\n\nServices include:\n- Manual transcription for accuracy\n- Multi-language subtitle creation\n- SRT/VTT file generation\n- Burned-in subtitles\n- Caption styling and formatting\n- Timing synchronization',
      cover_image: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&q=80&w=1200',
      gallery_images: [
        'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?auto=format&fit=crop&q=80&w=600',
      ],
      tools_used: ['Premiere Pro', 'DaVinci Resolve', 'Subtitle Edit', 'Aegisub'],
      experience_years: '4+ Years', project_count: 200
    },
  },
  'graphic-design': {
    'brochure-design': {
      id: 's3', title: 'Brochure Design', slug: 'brochure-design',
      description: 'Eye-catching brochure designs for marketing and promotional materials.',
      long_description: 'Create stunning brochures that captivate your audience and effectively communicate your message. I design professional brochures for various purposes including corporate presentations, product catalogs, and event promotions.',
      cover_image: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&q=80&w=1200',
      gallery_images: [],
      tools_used: ['Adobe InDesign', 'Illustrator', 'Canva', 'Photoshop'],
      experience_years: '5+ Years', project_count: 300
    },
    'youtube-thumbnail-design': {
      id: 's4', title: 'YouTube Thumbnail Design', slug: 'youtube-thumbnail-design',
      description: 'Click-worthy YouTube thumbnails that increase video engagement.',
      long_description: 'Eye-catching YouTube thumbnails that boost your click-through rate and help your videos stand out. I create thumbnails that are optimized for YouTube\'s algorithm while maintaining your brand consistency.',
      cover_image: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&q=80&w=1200',
      gallery_images: [],
      tools_used: ['Photoshop', 'Canva', 'Figma'],
      experience_years: '4+ Years', project_count: 500
    },
    'canva-design': {
      id: 's5', title: 'Canva Design', slug: 'canva-design',
      description: 'Professional designs using Canva for social media, presentations, and more.',
      long_description: 'Leverage the power of Canva to create stunning visuals for all your needs. From social media posts to presentations, I create professional designs that align with your brand.',
      cover_image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=1200',
      gallery_images: [],
      tools_used: ['Canva Pro', 'Photoshop'],
      experience_years: '5+ Years', project_count: 400
    },
    'tshirt-cup-design': {
      id: 's6', title: 'T-shirt and Cup Design', slug: 'tshirt-cup-design',
      description: 'Creative merchandise designs for t-shirts, mugs, and promotional items.',
      long_description: 'Unique merchandise designs that make your brand memorable. I create print-ready designs for t-shirts, mugs, and other promotional items.',
      cover_image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=1200',
      gallery_images: [],
      tools_used: ['Illustrator', 'Photoshop', 'Printful'],
      experience_years: '3+ Years', project_count: 200
    },
  },
};

// Add more default data for other categories...
Object.assign(defaultSkillData, {
  'content-writing': {
    'article-blog-writing': {
      id: 's7', title: 'Article, Blog, SMM Post Writing', slug: 'article-blog-writing',
      description: 'Engaging articles, blog posts, and social media content that drives traffic.',
      long_description: 'Compelling content that engages readers and drives conversions. I write SEO-optimized articles, blog posts, and social media content that resonates with your target audience.',
      cover_image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=1200',
      gallery_images: [], tools_used: ['Grammarly', 'Hemingway', 'Google Docs', 'WordPress'], experience_years: '10+ Years', project_count: 1000
    },
    'ebook-writing': {
      id: 's8', title: 'eBook Writing', slug: 'ebook-writing',
      description: 'Comprehensive eBook writing services from concept to completion.',
      long_description: 'Transform your ideas into professionally written eBooks. I handle everything from research and outline to writing and editing.',
      cover_image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=1200',
      gallery_images: [], tools_used: ['Google Docs', 'Scrivener', 'Calibre'], experience_years: '5+ Years', project_count: 50
    },
  },
  'ebook-formatting': {
    'ebook-design': {
      id: 's9', title: 'eBook Design', slug: 'ebook-design',
      description: 'Professional eBook formatting and design for Kindle, ePub, and PDF.',
      long_description: 'Get your eBook ready for publishing with professional formatting that looks great on all devices.',
      cover_image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=1200',
      gallery_images: [], tools_used: ['Calibre', 'Kindle Create', 'InDesign', 'Vellum'], experience_years: '5+ Years', project_count: 100
    },
  },
  'virtual-assistant-service': {
    'lead-generation-va': {
      id: 's10', title: 'Lead Generation VA', slug: 'lead-generation-va',
      description: 'B2B lead research and generation with verified contact information.',
      long_description: 'High-quality lead generation services that fuel your sales pipeline. I research and compile verified business contacts tailored to your target market.',
      cover_image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200',
      gallery_images: [], tools_used: ['LinkedIn Sales Navigator', 'Apollo.io', 'Hunter.io', 'ZoomInfo'], experience_years: '10+ Years', project_count: 500
    },
    'web-research-va': {
      id: 's11', title: 'Web Research VA', slug: 'web-research-va',
      description: 'Comprehensive web research and data compilation services.',
      long_description: 'Thorough research services to gather the information you need. I compile data from various sources and present it in organized, actionable formats.',
      cover_image: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?auto=format&fit=crop&q=80&w=1200',
      gallery_images: [], tools_used: ['Google', 'LinkedIn', 'Industry Databases', 'Excel'], experience_years: '10+ Years', project_count: 600
    },
    'job-search-va': {
      id: 's12', title: 'Job Search VA', slug: 'job-search-va',
      description: 'Job search assistance including application tracking and research.',
      long_description: 'Streamline your job search with professional assistance. I help research opportunities, track applications, and organize your job hunt.',
      cover_image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=1200',
      gallery_images: [], tools_used: ['LinkedIn', 'Indeed', 'Glassdoor', 'Excel'], experience_years: '5+ Years', project_count: 200
    },
    'data-entry': {
      id: 's13', title: 'Data Entry', slug: 'data-entry',
      description: 'Accurate and efficient data entry services with quality assurance.',
      long_description: 'Fast and accurate data entry services. I handle large volumes of data with attention to detail and quality assurance.',
      cover_image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200',
      gallery_images: [], tools_used: ['Excel', 'Google Sheets', 'Airtable', 'Various CRMs'], experience_years: '10+ Years', project_count: 800
    },
  },
  'social-media-marketing': {
    'social-media-management': {
      id: 's14', title: 'Social Media Management', slug: 'social-media-management',
      description: 'Complete social media account management and content scheduling.',
      long_description: 'Full-service social media management to grow your online presence. I handle content creation, scheduling, engagement, and analytics.',
      cover_image: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&q=80&w=1200',
      gallery_images: [], tools_used: ['Hootsuite', 'Buffer', 'Later', 'Canva'], experience_years: '5+ Years', project_count: 100
    },
    'organic-reach-daily-post': {
      id: 's15', title: 'Organic Reach and Daily Post', slug: 'organic-reach-daily-post',
      description: 'Organic growth strategies and daily content posting for engagement.',
      long_description: 'Build genuine engagement with organic growth strategies. I create and post content daily to maximize your reach without paid ads.',
      cover_image: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&q=80&w=1200',
      gallery_images: [], tools_used: ['Instagram', 'Facebook', 'Twitter', 'LinkedIn'], experience_years: '5+ Years', project_count: 150
    },
  },
  'wordpress-design': {
    'web-design': {
      id: 's16', title: 'Web Design', slug: 'web-design',
      description: 'Custom WordPress website design with responsive layouts and modern aesthetics.',
      long_description: 'Beautiful, functional WordPress websites tailored to your needs. I design and develop responsive sites that look great on all devices.',
      cover_image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&q=80&w=1200',
      gallery_images: [], tools_used: ['WordPress', 'Elementor', 'Divi', 'WooCommerce', 'CSS/HTML'], experience_years: '5+ Years', project_count: 50
    },
  },
});

export default function SkillDetailPage() {
  const params = useParams();
  const categorySlug = params.category as string;
  const skillSlug = params.skill as string;

  const [skill, setSkill] = useState<SubSkill | null>(null);
  const [category, setCategory] = useState<SkillCategory | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      // First try default data
      if (defaultSkillData[categorySlug]?.[skillSlug]) {
        setSkill(defaultSkillData[categorySlug][skillSlug]);
      }

      if (!supabase) {
        setLoading(false);
        return;
      }

      try {
        // Fetch category
        const { data: catData } = await supabase
          .from('skill_categories')
          .select('*')
          .eq('slug', categorySlug)
          .single();

        if (catData) {
          setCategory(catData);

          // Fetch skill
          const { data: skillData } = await supabase
            .from('sub_skills')
            .select('*')
            .eq('category_id', catData.id)
            .eq('slug', skillSlug)
            .single();

          if (skillData) {
            setSkill(skillData);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }

      setLoading(false);
    }

    fetchData();
  }, [categorySlug, skillSlug]);

  if (loading) {
    return (
      <div className="bg-[#0b0f1a] text-white min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#2ecc71] animate-spin" />
      </div>
    );
  }

  if (!skill) {
    return (
      <div className="bg-[#0b0f1a] text-white min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-4xl font-black mb-4">Skill Not Found</h1>
        <Link href={`/skills/portfolio/${categorySlug}`} className="text-[#2ecc71] hover:underline">Back to Category</Link>
      </div>
    );
  }

  const categoryTitle = categorySlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

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
            <Link href="/skills" className="text-[11px] font-bold tracking-[0.3em] text-[#2ecc71] transition-all uppercase">Skills</Link>
            <Link href="/services" className="text-[11px] font-bold tracking-[0.3em] text-slate-400 hover:text-[#2ecc71] transition-all uppercase">Services</Link>
            <Link href="/#contact" className="text-[11px] font-bold tracking-[0.3em] text-slate-400 hover:text-[#2ecc71] transition-all uppercase">Contact</Link>
            <a href="https://www.fiverr.com/neaz222" target="_blank" className="bg-[#2ecc71] text-slate-950 px-8 py-4 rounded-2xl font-black text-[11px] tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#2ecc71]/20 uppercase">HIRE ME</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={skill.cover_image} alt={skill.title} className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0b0f1a] via-[#0b0f1a]/90 to-[#0b0f1a]"></div>
        </div>

        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          {/* Breadcrumb */}
          <div className="flex flex-wrap items-center gap-3 mb-8 text-sm">
            <Link href="/skills/portfolio" className="text-slate-400 hover:text-[#2ecc71] transition-all">Portfolio</Link>
            <ArrowRight size={14} className="text-slate-600" />
            <Link href={`/skills/portfolio/${categorySlug}`} className="text-slate-400 hover:text-[#2ecc71] transition-all">{categoryTitle}</Link>
            <ArrowRight size={14} className="text-slate-600" />
            <span className="text-[#2ecc71] font-bold">{skill.title}</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl lg:text-6xl font-black uppercase tracking-tighter leading-none mb-6">
              {skill.title}
            </h1>

            <p className="text-slate-300 text-xl leading-relaxed mb-8 max-w-3xl">
              {skill.description}
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 mb-8">
              <div className="flex items-center gap-3 px-6 py-4 bg-white/5 rounded-2xl border border-white/10">
                <Clock className="text-[#2ecc71]" size={24} />
                <div>
                  <div className="text-2xl font-black">{skill.experience_years}</div>
                  <div className="text-[10px] uppercase tracking-widest text-slate-500">Experience</div>
                </div>
              </div>
              <div className="flex items-center gap-3 px-6 py-4 bg-white/5 rounded-2xl border border-white/10">
                <Briefcase className="text-[#2ecc71]" size={24} />
                <div>
                  <div className="text-2xl font-black">{skill.project_count}+</div>
                  <div className="text-[10px] uppercase tracking-widest text-slate-500">Projects</div>
                </div>
              </div>
              <div className="flex items-center gap-3 px-6 py-4 bg-white/5 rounded-2xl border border-white/10">
                <Star className="text-[#2ecc71]" size={24} />
                <div>
                  <div className="text-2xl font-black">100%</div>
                  <div className="text-[10px] uppercase tracking-widest text-slate-500">Satisfaction</div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link
                href="/#contact"
                className="inline-flex items-center gap-3 px-8 py-4 bg-[#2ecc71] text-slate-900 font-black rounded-2xl hover:scale-105 transition-transform uppercase tracking-widest text-sm"
              >
                Hire Me <ArrowRight size={18} />
              </Link>
              <a
                href="https://www.fiverr.com/neaz222"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 border-2 border-white/20 text-white font-black rounded-2xl hover:border-[#2ecc71] transition-all uppercase tracking-widest text-sm"
              >
                View on Fiverr <ExternalLink size={18} />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Detailed Description */}
      <section className="py-16">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-black uppercase tracking-tight mb-8">
                About This Service
              </h2>
              <div className="prose prose-invert prose-lg max-w-none">
                {skill.long_description?.split('\n').map((paragraph, index) => (
                  <p key={index} className="text-slate-300 leading-relaxed mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Gallery */}
              {skill.gallery_images && skill.gallery_images.length > 0 && (
                <div className="mt-12">
                  <h3 className="text-2xl font-black uppercase tracking-tight mb-6">Gallery</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {skill.gallery_images.map((img, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="aspect-video rounded-2xl overflow-hidden border border-white/10"
                      >
                        <img src={img} alt={`${skill.title} example ${index + 1}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div>
              <div className="sticky top-32 space-y-8">
                {/* Tools Used */}
                {skill.tools_used && skill.tools_used.length > 0 && (
                  <div className="p-8 bg-slate-900/60 border border-white/10 rounded-3xl">
                    <h3 className="text-xl font-black uppercase tracking-tight mb-6">Tools & Software</h3>
                    <div className="flex flex-wrap gap-2">
                      {skill.tools_used.map((tool, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm font-semibold text-slate-300"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Why Choose Me */}
                <div className="p-8 bg-slate-900/60 border border-white/10 rounded-3xl">
                  <h3 className="text-xl font-black uppercase tracking-tight mb-6">Why Choose Me</h3>
                  <ul className="space-y-4">
                    {['Fast turnaround time', 'Unlimited revisions', 'Quality guaranteed', '24/7 communication', 'Competitive pricing'].map((item, index) => (
                      <li key={index} className="flex items-center gap-3 text-slate-300">
                        <CheckCircle2 className="text-[#2ecc71] flex-shrink-0" size={18} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Quick Contact */}
                <div className="p-8 bg-[#2ecc71]/10 border border-[#2ecc71]/30 rounded-3xl">
                  <h3 className="text-xl font-black uppercase tracking-tight mb-4">Ready to Start?</h3>
                  <p className="text-slate-400 mb-6 text-sm">
                    Let&apos;s discuss your project and bring your vision to life.
                  </p>
                  <Link
                    href="/#contact"
                    className="block w-full text-center px-6 py-4 bg-[#2ecc71] text-slate-900 font-black rounded-2xl hover:scale-105 transition-transform uppercase tracking-widest text-sm"
                  >
                    Get in Touch
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Back Navigation */}
      <section className="py-8 border-t border-white/5">
        <div className="container mx-auto px-6 max-w-7xl">
          <Link
            href={`/skills/portfolio/${categorySlug}`}
            className="inline-flex items-center gap-2 text-slate-400 hover:text-[#2ecc71] transition-all group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold">Back to {categoryTitle}</span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-white/5">
        <div className="container mx-auto px-6 max-w-7xl text-center">
          <p className="text-slate-500 text-sm">&copy; 2024 Neaz Md. Morshed. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
