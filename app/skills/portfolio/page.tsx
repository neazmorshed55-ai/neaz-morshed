"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft, ArrowRight, ChevronRight, Loader2,
  Video, Palette, PenTool, BookOpen, Briefcase,
  Share2, Globe
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface SkillCategory {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon: string;
  order_index: number;
}

interface SubSkill {
  id: string;
  category_id: string;
  title: string;
  slug: string;
  description: string;
  order_index: number;
}

const iconMap: { [key: string]: React.ReactNode } = {
  'Video': <Video className="w-6 h-6" />,
  'Palette': <Palette className="w-6 h-6" />,
  'PenTool': <PenTool className="w-6 h-6" />,
  'BookOpen': <BookOpen className="w-6 h-6" />,
  'Briefcase': <Briefcase className="w-6 h-6" />,
  'Share2': <Share2 className="w-6 h-6" />,
  'Globe': <Globe className="w-6 h-6" />,
};

// Default data
const defaultCategories: SkillCategory[] = [
  { id: '1', title: 'Video Production', slug: 'video-production', description: 'Professional video editing and production services.', icon: 'Video', order_index: 1 },
  { id: '2', title: 'Graphic Design', slug: 'graphic-design', description: 'Creative graphic design solutions.', icon: 'Palette', order_index: 2 },
  { id: '3', title: 'Content Writing', slug: 'content-writing', description: 'Engaging content creation.', icon: 'PenTool', order_index: 3 },
  { id: '4', title: 'eBook Formatting', slug: 'ebook-formatting', description: 'Professional eBook design.', icon: 'BookOpen', order_index: 4 },
  { id: '5', title: 'Virtual Assistant Service', slug: 'virtual-assistant-service', description: 'Comprehensive virtual assistance.', icon: 'Briefcase', order_index: 5 },
  { id: '6', title: 'Social Media Marketing', slug: 'social-media-marketing', description: 'Strategic social media management.', icon: 'Share2', order_index: 6 },
  { id: '7', title: 'WordPress Design', slug: 'wordpress-design', description: 'Custom WordPress solutions.', icon: 'Globe', order_index: 7 },
];

const defaultSubSkills: SubSkill[] = [
  { id: 's1', category_id: '1', title: 'Podcast Creation', slug: 'podcast-creation', description: 'Professional podcast production.', order_index: 1 },
  { id: 's2', category_id: '1', title: 'Subtitle Adding in a Video', slug: 'subtitle-adding', description: 'Accurate subtitle creation.', order_index: 2 },
  { id: 's3', category_id: '2', title: 'Brochure Design', slug: 'brochure-design', description: 'Eye-catching brochure designs.', order_index: 1 },
  { id: 's4', category_id: '2', title: 'YouTube Thumbnail Design', slug: 'youtube-thumbnail-design', description: 'Click-worthy thumbnails.', order_index: 2 },
  { id: 's5', category_id: '2', title: 'Canva Design', slug: 'canva-design', description: 'Professional Canva designs.', order_index: 3 },
  { id: 's6', category_id: '2', title: 'T-shirt and Cup Design', slug: 'tshirt-cup-design', description: 'Creative merchandise designs.', order_index: 4 },
  { id: 's7', category_id: '3', title: 'Article, Blog, SMM Post Writing', slug: 'article-blog-writing', description: 'Engaging written content.', order_index: 1 },
  { id: 's8', category_id: '3', title: 'eBook Writing', slug: 'ebook-writing', description: 'Comprehensive eBook writing.', order_index: 2 },
  { id: 's9', category_id: '4', title: 'eBook Design', slug: 'ebook-design', description: 'Professional eBook formatting.', order_index: 1 },
  { id: 's10', category_id: '5', title: 'Lead Generation VA', slug: 'lead-generation-va', description: 'B2B lead research.', order_index: 1 },
  { id: 's11', category_id: '5', title: 'Web Research VA', slug: 'web-research-va', description: 'Comprehensive web research.', order_index: 2 },
  { id: 's12', category_id: '5', title: 'Job Search VA', slug: 'job-search-va', description: 'Job search assistance.', order_index: 3 },
  { id: 's13', category_id: '5', title: 'Data Entry', slug: 'data-entry', description: 'Accurate data entry.', order_index: 4 },
  { id: 's14', category_id: '6', title: 'Social Media Management', slug: 'social-media-management', description: 'Complete social media management.', order_index: 1 },
  { id: 's15', category_id: '6', title: 'Organic Reach and Daily Post', slug: 'organic-reach-daily-post', description: 'Organic growth strategies.', order_index: 2 },
  { id: 's16', category_id: '7', title: 'Web Design', slug: 'web-design', description: 'Custom WordPress design.', order_index: 1 },
];

export default function SkillPortfolioPage() {
  const [categories, setCategories] = useState<SkillCategory[]>(defaultCategories);
  const [subSkills, setSubSkills] = useState<SubSkill[]>(defaultSubSkills);
  const [loading, setLoading] = useState(true);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400');

  useEffect(() => {
    async function fetchData() {
      if (!supabase) {
        setLoading(false);
        return;
      }

      try {
        // Fetch both categories and sub-skills
        const { data: catData } = await supabase
          .from('skill_categories')
          .select('*')
          .eq('is_active', true)
          .order('order_index', { ascending: true });

        const { data: skillData } = await supabase
          .from('sub_skills')
          .select('*')
          .eq('is_active', true)
          .order('order_index', { ascending: true });

        // Only use Supabase data if BOTH categories AND sub_skills have data
        // This ensures the category_id references match properly
        if (catData && catData.length > 0 && skillData && skillData.length > 0) {
          setCategories(catData);
          setSubSkills(skillData);
        }
        // If only categories exist, keep using defaults for both to maintain ID consistency

        const { data: imgData } = supabase.storage.from('images').getPublicUrl('profile.jpg');
        if (imgData?.publicUrl) {
          const img = new Image();
          img.onload = () => setProfileImage(imgData.publicUrl);
          img.src = imgData.publicUrl;
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }

      setLoading(false);
    }

    fetchData();
  }, []);

  const getSubSkillsForCategory = (categoryId: string) => {
    return subSkills.filter(skill => skill.category_id === categoryId);
  };

  const getCategoryBySlug = (slug: string) => {
    return categories.find(cat => cat.slug === slug);
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

      {/* Main Content */}
      <section className="pt-32 pb-20 relative overflow-hidden min-h-screen">
        {/* Background */}
        <div className="absolute left-0 top-0 w-1/4 h-full bg-[#1a1f2e]"></div>
        <div className="absolute top-[30%] right-[10%] w-[400px] h-[400px] bg-[#2ecc71]/5 rounded-full blur-[150px] pointer-events-none"></div>

        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          {/* Back Link */}
          <Link href="/skills" className="inline-flex items-center gap-2 text-slate-400 hover:text-[#2ecc71] transition-all mb-8 group">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-bold uppercase tracking-wider">Back to Skills</span>
          </Link>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-6xl lg:text-8xl font-black uppercase tracking-tighter leading-none">
              Content
            </h1>
            <p className="text-slate-400 mt-4 max-w-xl mx-auto">
              Hover over a category to see skills, click to explore in detail
            </p>
          </motion.div>

          {/* Main Grid */}
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Profile Image */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-3 hidden lg:block"
            >
              <div className="sticky top-32">
                <div className="relative">
                  <div className="w-full aspect-[3/4] rounded-3xl overflow-hidden border-4 border-white/10 bg-slate-900">
                    <img src={profileImage} alt="Neaz Md. Morshed" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Categories List */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="lg:col-span-5"
            >
              <div className="space-y-3">
                {categories.map((category, index) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    onMouseEnter={() => setHoveredCategory(category.id)}
                    onMouseLeave={() => setHoveredCategory(null)}
                    className="relative"
                  >
                    <Link href={`/skills/portfolio/${category.slug}`}>
                      <div className={`flex items-center gap-6 p-5 rounded-2xl cursor-pointer transition-all duration-300 group ${
                        hoveredCategory === category.id
                          ? 'bg-[#1a1f2e] border-l-4 border-[#2ecc71] shadow-lg'
                          : 'hover:bg-slate-900/50 border-l-4 border-transparent hover:border-slate-700'
                      }`}>
                        {/* Number */}
                        <div className={`text-3xl font-black w-14 text-center transition-colors ${
                          hoveredCategory === category.id ? 'text-[#2ecc71]' : 'text-slate-600 group-hover:text-slate-400'
                        }`}>
                          {String(index + 1).padStart(2, '0')}
                        </div>

                        {/* Title */}
                        <div className="flex-1">
                          <h3 className={`text-lg font-bold underline underline-offset-4 decoration-2 transition-colors ${
                            hoveredCategory === category.id
                              ? 'text-[#2ecc71] decoration-[#2ecc71]'
                              : 'text-white decoration-slate-600 group-hover:decoration-[#2ecc71]'
                          }`}>
                            {category.title}
                          </h3>
                        </div>

                        {/* Arrow */}
                        <ChevronRight
                          size={20}
                          className={`transition-all duration-300 ${
                            hoveredCategory === category.id
                              ? 'text-[#2ecc71] translate-x-1'
                              : 'text-slate-600 group-hover:text-[#2ecc71]'
                          }`}
                        />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Sub Skills Panel */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="lg:col-span-4"
            >
              <div className="sticky top-32 min-h-[400px]">
                <AnimatePresence mode="wait">
                  {hoveredCategory ? (
                    <motion.div
                      key={hoveredCategory}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-3"
                    >
                      {getSubSkillsForCategory(hoveredCategory).map((skill, index) => {
                        const category = categories.find(c => c.id === hoveredCategory);
                        return (
                          <motion.div
                            key={skill.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: index * 0.05 }}
                          >
                            <Link href={`/skills/portfolio/${category?.slug}/${skill.slug}`}>
                              <div className="p-4 bg-[#c9a089] hover:bg-[#d4b19a] text-slate-900 rounded-xl font-semibold transition-all hover:translate-x-2 hover:shadow-lg cursor-pointer group">
                                <span className="flex items-center justify-between">
                                  <span className="underline underline-offset-2">{skill.title}</span>
                                  <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                </span>
                              </div>
                            </Link>
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center p-10 bg-slate-900/30 rounded-3xl border border-dashed border-slate-700 h-full flex flex-col items-center justify-center"
                    >
                      <ArrowLeft size={40} className="text-slate-600 mx-auto mb-4" />
                      <p className="text-slate-500 font-medium">
                        Hover over a category to see sub-skills
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Decorative dots */}
                <div className="mt-8 flex justify-end gap-2">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex flex-col gap-2">
                      {[...Array(3)].map((_, j) => (
                        <div key={j} className={`w-2 h-2 rounded-full ${(i + j) % 2 === 0 ? 'bg-[#2ecc71]/40' : 'bg-slate-700/40'}`} />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
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
