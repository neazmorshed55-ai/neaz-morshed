"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import NextImage from 'next/image';
import {
  ArrowLeft, ArrowRight, ChevronRight, ChevronDown, Loader2,
  Video, Palette, PenTool, BookOpen, Briefcase,
  Share2, Globe
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import Navbar from '../../../components/Navbar';
import FooterLinks from '../../../components/FooterLinks';

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
  'Video': <Video className="w-5 h-5" />,
  'Palette': <Palette className="w-5 h-5" />,
  'PenTool': <PenTool className="w-5 h-5" />,
  'BookOpen': <BookOpen className="w-5 h-5" />,
  'Briefcase': <Briefcase className="w-5 h-5" />,
  'Share2': <Share2 className="w-5 h-5" />,
  'Globe': <Globe className="w-5 h-5" />,
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
  // Start with first category expanded
  const [expandedCategory, setExpandedCategory] = useState<string>('1');
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!supabase) {
        setLoading(false);
        return;
      }

      try {
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

        if (catData && catData.length > 0 && skillData && skillData.length > 0) {
          setCategories(catData);
          setSubSkills(skillData);
          setExpandedCategory(catData[0].id);
        }

        // Load profile image
        const { data: imgData } = supabase.storage.from('images').getPublicUrl('profile.jpg');
        if (imgData?.publicUrl) {
          setProfileImage(imgData.publicUrl);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }

      setLoading(false);
    }

    fetchData();
  }, []);

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  };

  const getCategorySlug = (category: SkillCategory) => {
    return category.slug || generateSlug(category.title);
  };

  const getSubSkillsForCategory = (categoryId: string) => {
    return subSkills.filter(skill => skill.category_id === categoryId);
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
      <Navbar />

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
            className="text-center mb-12"
          >
            <h1 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-none mb-4">
              Skill <span className="text-[#2ecc71]">Portfolio</span>
            </h1>
            <p className="text-slate-400 max-w-xl mx-auto">
              Explore my expertise across different categories. Click on any skill to learn more.
            </p>
          </motion.div>

          {/* Main Grid - Profile + Skills */}
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Profile Image */}
            {profileImage && (
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="lg:col-span-3 hidden lg:block"
              >
                <div className="sticky top-32">
                  <div className="w-full aspect-[3/4] rounded-3xl overflow-hidden border-4 border-white/10 bg-slate-900 relative">
                    <NextImage src={profileImage} alt="Neaz Md. Morshed" fill sizes="25vw" className="object-cover" priority />
                  </div>
                  <div className="mt-6 p-4 bg-slate-900/50 rounded-2xl border border-white/5">
                    <div className="text-[#2ecc71] text-3xl font-black mb-1">10+</div>
                    <div className="text-slate-400 text-xs uppercase tracking-wider">Years Experience</div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Skills Accordion */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="lg:col-span-9"
            >
              <div className="space-y-4">
                {categories.map((category, index) => {
                  const categorySkills = getSubSkillsForCategory(category.id);
                  const isExpanded = expandedCategory === category.id;

                  return (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className={`rounded-2xl overflow-hidden border transition-all duration-300 ${
                        isExpanded
                          ? 'bg-[#1a1f2e] border-[#2ecc71]/30 shadow-lg shadow-[#2ecc71]/5'
                          : 'bg-slate-900/40 border-white/5 hover:border-white/10'
                      }`}
                      onMouseEnter={() => setExpandedCategory(category.id)}
                    >
                      {/* Category Header */}
                      <div className="flex items-center gap-4 p-5 cursor-pointer">
                        {/* Number */}
                        <div className={`text-2xl font-black w-12 text-center transition-colors ${
                          isExpanded ? 'text-[#2ecc71]' : 'text-slate-600'
                        }`}>
                          {String(index + 1).padStart(2, '0')}
                        </div>

                        {/* Icon */}
                        <div className={`p-3 rounded-xl transition-all ${
                          isExpanded ? 'bg-[#2ecc71] text-slate-900' : 'bg-white/5 text-slate-400'
                        }`}>
                          {iconMap[category.icon] || <Briefcase className="w-5 h-5" />}
                        </div>

                        {/* Title & Info */}
                        <div className="flex-1">
                          <Link href={`/skills/portfolio/${getCategorySlug(category)}`}>
                            <h3 className={`text-lg font-bold transition-colors hover:text-[#2ecc71] ${
                              isExpanded ? 'text-white' : 'text-slate-300'
                            }`}>
                              {category.title}
                            </h3>
                          </Link>
                          <p className="text-slate-500 text-xs mt-1">{categorySkills.length} services available</p>
                        </div>

                        {/* Expand Arrow */}
                        <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                          <ChevronDown size={20} className={isExpanded ? 'text-[#2ecc71]' : 'text-slate-600'} />
                        </div>

                        {/* View All Link */}
                        <Link
                          href={`/skills/portfolio/${getCategorySlug(category)}`}
                          className="text-[10px] font-bold uppercase tracking-wider text-[#2ecc71] hover:underline px-3 py-2 bg-[#2ecc71]/10 rounded-lg"
                        >
                          View All
                        </Link>
                      </div>

                      {/* Sub-skills - Expandable Content */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="px-5 pb-5 pt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
                              {categorySkills.map((skill, skillIndex) => (
                                <motion.div
                                  key={skill.id}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.2, delay: skillIndex * 0.05 }}
                                >
                                  <Link href={`/skills/portfolio/${getCategorySlug(category)}/${skill.slug || generateSlug(skill.title)}`}>
                                    <div className="flex items-center gap-3 p-3 bg-[#c9a089] hover:bg-[#d4b19a] text-slate-900 rounded-xl transition-all hover:translate-x-1 hover:shadow-md group cursor-pointer">
                                      <ChevronRight size={16} className="text-slate-700 group-hover:translate-x-1 transition-transform" />
                                      <span className="font-semibold text-sm">{skill.title}</span>
                                      <ArrowRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                  </Link>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

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
