"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft, ArrowRight, Loader2, Clock, CheckCircle2,
  Video, Palette, PenTool, BookOpen, Briefcase, Share2, Globe
} from 'lucide-react';
import { supabase } from '../../../../lib/supabase';

interface SkillCategory {
  id: string;
  title: string;
  slug: string;
  description: string;
  long_description: string;
  cover_image: string;
  icon: string;
}

interface SubSkill {
  id: string;
  category_id: string;
  title: string;
  slug: string;
  description: string;
  cover_image: string;
  experience_years: string;
  order_index: number;
}

const iconMap: { [key: string]: React.ReactNode } = {
  'Video': <Video className="w-12 h-12" />,
  'Palette': <Palette className="w-12 h-12" />,
  'PenTool': <PenTool className="w-12 h-12" />,
  'BookOpen': <BookOpen className="w-12 h-12" />,
  'Briefcase': <Briefcase className="w-12 h-12" />,
  'Share2': <Share2 className="w-12 h-12" />,
  'Globe': <Globe className="w-12 h-12" />,
};

const defaultCategories: { [key: string]: SkillCategory } = {
  'video-production': {
    id: '1', title: 'Video Production', slug: 'video-production',
    description: 'Professional video editing and production services including podcasts, subtitles, and more.',
    long_description: 'I offer comprehensive video production services that bring your vision to life. From podcast creation to professional subtitle addition, I ensure your video content stands out with high-quality editing and production values.',
    cover_image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=1200',
    icon: 'Video'
  },
  'graphic-design': {
    id: '2', title: 'Graphic Design', slug: 'graphic-design',
    description: 'Creative graphic design solutions for branding, marketing, and digital presence.',
    long_description: 'Transform your brand with stunning visual designs. I create eye-catching graphics for all your marketing needs, from YouTube thumbnails to merchandise designs.',
    cover_image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=1200',
    icon: 'Palette'
  },
  'content-writing': {
    id: '3', title: 'Content Writing', slug: 'content-writing',
    description: 'Engaging content creation for blogs, articles, social media, and eBooks.',
    long_description: 'Words that convert. I craft compelling content that engages your audience and drives results, from blog posts to comprehensive eBooks.',
    cover_image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=1200',
    icon: 'PenTool'
  },
  'ebook-formatting': {
    id: '4', title: 'eBook Formatting', slug: 'ebook-formatting',
    description: 'Professional eBook design and formatting for all major platforms.',
    long_description: 'Get your eBook ready for publishing with professional formatting that works perfectly on Kindle, ePub, and PDF formats.',
    cover_image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=1200',
    icon: 'BookOpen'
  },
  'virtual-assistant-service': {
    id: '5', title: 'Virtual Assistant Service', slug: 'virtual-assistant-service',
    description: 'Comprehensive virtual assistance for lead generation, research, and data management.',
    long_description: 'Your reliable remote partner for all administrative tasks. From lead generation to data entry, I handle the heavy lifting so you can focus on growth.',
    cover_image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&q=80&w=1200',
    icon: 'Briefcase'
  },
  'social-media-marketing': {
    id: '6', title: 'Social Media Marketing', slug: 'social-media-marketing',
    description: 'Strategic social media management and organic growth services.',
    long_description: 'Grow your social presence organically with strategic content planning, daily posting, and engagement strategies that build real connections.',
    cover_image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=1200',
    icon: 'Share2'
  },
  'wordpress-design': {
    id: '7', title: 'WordPress Design', slug: 'wordpress-design',
    description: 'Custom WordPress website design and development solutions.',
    long_description: 'Beautiful, functional WordPress websites that represent your brand perfectly. From simple blogs to complex business sites, I deliver responsive, modern designs.',
    cover_image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&q=80&w=1200',
    icon: 'Globe'
  },
};

const defaultSubSkills: { [key: string]: SubSkill[] } = {
  'video-production': [
    { id: 's1', category_id: '1', title: 'Podcast Creation', slug: 'podcast-creation', description: 'Professional podcast production including recording, editing, and publishing.', cover_image: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&q=80&w=800', experience_years: '4+ Years', order_index: 1 },
    { id: 's2', category_id: '1', title: 'Subtitle Adding in a Video', slug: 'subtitle-adding', description: 'Accurate subtitle creation and synchronization for videos in multiple languages.', cover_image: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&q=80&w=800', experience_years: '4+ Years', order_index: 2 },
  ],
  'graphic-design': [
    { id: 's3', category_id: '2', title: 'Brochure Design', slug: 'brochure-design', description: 'Eye-catching brochure designs for marketing and promotional materials.', cover_image: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&q=80&w=800', experience_years: '5+ Years', order_index: 1 },
    { id: 's4', category_id: '2', title: 'YouTube Thumbnail Design', slug: 'youtube-thumbnail-design', description: 'Click-worthy YouTube thumbnails that increase video engagement.', cover_image: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&q=80&w=800', experience_years: '4+ Years', order_index: 2 },
    { id: 's5', category_id: '2', title: 'Canva Design', slug: 'canva-design', description: 'Professional designs using Canva for social media, presentations, and more.', cover_image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=800', experience_years: '5+ Years', order_index: 3 },
    { id: 's6', category_id: '2', title: 'T-shirt and Cup Design', slug: 'tshirt-cup-design', description: 'Creative merchandise designs for t-shirts, mugs, and promotional items.', cover_image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800', experience_years: '3+ Years', order_index: 4 },
  ],
  'content-writing': [
    { id: 's7', category_id: '3', title: 'Article, Blog, SMM Post Writing', slug: 'article-blog-writing', description: 'Engaging articles, blog posts, and social media content that drives traffic.', cover_image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800', experience_years: '10+ Years', order_index: 1 },
    { id: 's8', category_id: '3', title: 'eBook Writing', slug: 'ebook-writing', description: 'Comprehensive eBook writing services from concept to completion.', cover_image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800', experience_years: '5+ Years', order_index: 2 },
  ],
  'ebook-formatting': [
    { id: 's9', category_id: '4', title: 'eBook Design', slug: 'ebook-design', description: 'Professional eBook formatting and design for Kindle, ePub, and PDF.', cover_image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800', experience_years: '5+ Years', order_index: 1 },
  ],
  'virtual-assistant-service': [
    { id: 's10', category_id: '5', title: 'Lead Generation VA', slug: 'lead-generation-va', description: 'B2B lead research and generation with verified contact information.', cover_image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800', experience_years: '10+ Years', order_index: 1 },
    { id: 's11', category_id: '5', title: 'Web Research VA', slug: 'web-research-va', description: 'Comprehensive web research and data compilation services.', cover_image: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?auto=format&fit=crop&q=80&w=800', experience_years: '10+ Years', order_index: 2 },
    { id: 's12', category_id: '5', title: 'Job Search VA', slug: 'job-search-va', description: 'Job search assistance including application tracking and research.', cover_image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=800', experience_years: '5+ Years', order_index: 3 },
    { id: 's13', category_id: '5', title: 'Data Entry', slug: 'data-entry', description: 'Accurate and efficient data entry services with quality assurance.', cover_image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800', experience_years: '10+ Years', order_index: 4 },
  ],
  'social-media-marketing': [
    { id: 's14', category_id: '6', title: 'Social Media Management', slug: 'social-media-management', description: 'Complete social media account management and content scheduling.', cover_image: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&q=80&w=800', experience_years: '5+ Years', order_index: 1 },
    { id: 's15', category_id: '6', title: 'Organic Reach and Daily Post', slug: 'organic-reach-daily-post', description: 'Organic growth strategies and daily content posting for engagement.', cover_image: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&q=80&w=800', experience_years: '5+ Years', order_index: 2 },
  ],
  'wordpress-design': [
    { id: 's16', category_id: '7', title: 'Web Design', slug: 'web-design', description: 'Custom WordPress website design with responsive layouts and modern aesthetics.', cover_image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&q=80&w=800', experience_years: '5+ Years', order_index: 1 },
  ],
};

export default function CategoryPage() {
  const params = useParams();
  const categorySlug = params.category as string;

  const [category, setCategory] = useState<SkillCategory | null>(null);
  const [subSkills, setSubSkills] = useState<SubSkill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      // First try default data
      if (defaultCategories[categorySlug]) {
        setCategory(defaultCategories[categorySlug]);
        setSubSkills(defaultSubSkills[categorySlug] || []);
      }

      if (!supabase) {
        setLoading(false);
        return;
      }

      try {
        const { data: catData } = await supabase
          .from('skill_categories')
          .select('*')
          .eq('slug', categorySlug)
          .single();

        if (catData) {
          setCategory(catData);

          const { data: skillData } = await supabase
            .from('sub_skills')
            .select('*')
            .eq('category_id', catData.id)
            .eq('is_active', true)
            .order('order_index', { ascending: true });

          if (skillData) {
            setSubSkills(skillData);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }

      setLoading(false);
    }

    fetchData();
  }, [categorySlug]);

  if (loading) {
    return (
      <div className="bg-[#0b0f1a] text-white min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#2ecc71] animate-spin" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="bg-[#0b0f1a] text-white min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-4xl font-black mb-4">Category Not Found</h1>
        <Link href="/skills/portfolio" className="text-[#2ecc71] hover:underline">Back to Portfolio</Link>
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
          <img src={category.cover_image} alt={category.title} className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0b0f1a] via-[#0b0f1a]/80 to-[#0b0f1a]"></div>
        </div>

        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-3 mb-8">
            <Link href="/skills/portfolio" className="inline-flex items-center gap-2 text-slate-400 hover:text-[#2ecc71] transition-all group">
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-bold uppercase tracking-wider">Portfolio</span>
            </Link>
            <ArrowRight size={14} className="text-slate-600" />
            <span className="text-[#2ecc71] text-sm font-bold uppercase tracking-wider">{category.title}</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="text-[#2ecc71] p-4 bg-white/5 rounded-2xl border border-white/10">
                {iconMap[category.icon] || <Briefcase className="w-12 h-12" />}
              </div>
            </div>

            <h1 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-none mb-6">
              {category.title}
            </h1>

            <p className="text-slate-300 text-xl leading-relaxed mb-8">
              {category.long_description || category.description}
            </p>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-[#2ecc71]">
                <CheckCircle2 size={20} />
                <span className="font-bold">{subSkills.length} Services</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Clock size={20} />
                <span className="font-bold">10+ Years Experience</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sub Skills Grid */}
      <section className="py-16">
        <div className="container mx-auto px-6 max-w-7xl">
          <h2 className="text-3xl font-black uppercase tracking-tight mb-12">
            Available Services
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {subSkills.map((skill, index) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={`/skills/portfolio/${categorySlug}/${skill.slug}`}>
                  <div className="group relative overflow-hidden rounded-3xl border border-white/5 hover:border-[#2ecc71]/40 transition-all duration-500 bg-slate-900/60 h-full">
                    {/* Image */}
                    <div className="aspect-video relative overflow-hidden">
                      <img
                        src={skill.cover_image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800'}
                        alt={skill.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f1a] via-transparent to-transparent opacity-60"></div>

                      {/* Experience Badge */}
                      <div className="absolute top-4 right-4 px-3 py-1 bg-[#2ecc71] text-slate-900 text-[10px] font-black rounded-full uppercase">
                        {skill.experience_years}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-black mb-3 group-hover:text-[#2ecc71] transition-colors uppercase tracking-tight">
                        {skill.title}
                      </h3>
                      <p className="text-slate-400 text-sm leading-relaxed mb-4">
                        {skill.description}
                      </p>
                      <div className="flex items-center gap-2 text-[#2ecc71] text-sm font-bold group-hover:translate-x-2 transition-transform">
                        Learn More <ArrowRight size={16} />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center p-12 bg-slate-900/60 border border-white/10 rounded-[3rem]">
            <h3 className="text-3xl font-black uppercase tracking-tight mb-4">
              Need {category.title} Services?
            </h3>
            <p className="text-slate-400 mb-8">
              Let&apos;s discuss your project requirements and how I can help.
            </p>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-3 px-10 py-5 bg-[#2ecc71] text-slate-900 font-black rounded-2xl hover:scale-105 transition-transform uppercase tracking-widest text-sm"
            >
              Get in Touch <ArrowRight size={18} />
            </Link>
          </div>
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
