"use client";

import React, { useState, useEffect, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft, Loader2, Calendar, MapPin, Briefcase,
  ChevronDown, CheckCircle2, Building2
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Navbar from '../../components/Navbar';
import FooterLinks from '../../components/FooterLinks';
import { defaultExperiences, type Experience } from '../../lib/experienceData';

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

// Memoized Experience Card Component
const ExperienceCard = memo(({ exp, index, expandedId, setExpandedId }: {
  exp: Experience;
  index: number;
  expandedId: string | null;
  setExpandedId: (id: string | null) => void;
}) => {
  const isExpanded = expandedId === exp.id;

  return (
    <div
      className={`relative flex flex-col md:flex-row gap-8 mb-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
    >
      {/* Timeline Dot */}
      <div className="absolute left-0 md:left-1/2 w-4 h-4 bg-[#2ecc71] rounded-full transform -translate-x-1/2 border-4 border-[#0b0f1a] shadow-[0_0_20px_rgba(46,204,113,0.5)] z-10"></div>

      {/* Year Badge - Desktop */}
      <div className={`hidden md:flex md:w-1/2 items-center ${index % 2 === 0 ? 'justify-end pr-12' : 'justify-start pl-12'}`}>
        <div className="text-center">
          <div className="text-5xl font-black text-[#2ecc71]/20">
            {exp.start_date.split(' ').pop()}
          </div>
          <div className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider mt-2 ${
            exp.type === 'full-time' ? 'bg-[#2ecc71]/20 text-[#2ecc71]' :
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
          className={`p-6 rounded-3xl border transition-all duration-300 cursor-pointer ${
            isExpanded
              ? 'bg-[#1a1f2e] border-[#2ecc71]/30 shadow-lg shadow-[#2ecc71]/10'
              : 'bg-slate-900/40 border-white/5 hover:border-white/10'
          }`}
          onClick={() => setExpandedId(isExpanded ? null : exp.id)}
        >
          {/* Mobile Type Badge & Year */}
          <div className="md:hidden flex items-center gap-3 mb-3">
            <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
              exp.type === 'full-time' ? 'bg-[#2ecc71]/20 text-[#2ecc71]' :
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
              <h3 className={`text-xl font-black transition-colors ${
                isExpanded ? 'text-[#2ecc71]' : 'text-white'
              }`}>
                {exp.position}
              </h3>
            </div>
            <ChevronDown
              size={20}
              className={`text-slate-500 transition-transform duration-300 flex-shrink-0 ${
                isExpanded ? 'rotate-180 text-[#2ecc71]' : ''
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
            {isExpanded && (
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
    </div>
  );
});

ExperienceCard.displayName = 'ExperienceCard';

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>(defaultExperiences);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'full-time' | 'part-time' | 'project'>('all');

  useEffect(() => {
    async function fetchData() {
      if (!supabase) {
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
          const sorted = sortByDate(defaultExperiences);
          setExperiences(sorted);
          setExpandedId(sorted[0]?.id || null);
        }
      } catch (error) {
        console.error('Error fetching experiences:', error);
        const sorted = sortByDate(defaultExperiences);
        setExperiences(sorted);
        setExpandedId(sorted[0]?.id || null);
      }

      setLoading(false);
    }

    fetchData();
  }, []);

  // Memoize filtered experiences
  const filteredExperiences = useMemo(() =>
    sortByDate(
      activeTab === 'all'
        ? experiences
        : experiences.filter(exp => exp.type === activeTab)
    ), [experiences, activeTab]
  );

  // Memoize stats calculation
  const stats = useMemo(() => ({
    fullTime: experiences.filter(e => e.type === 'full-time').length,
    partTime: experiences.filter(e => e.type === 'part-time').length,
    project: experiences.filter(e => e.type === 'project').length,
    total: experiences.length
  }), [experiences]);

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
          {/* Simplified static gradient background - much faster than VideoBackground */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#4facfe]/20 via-[#00f2fe]/10 to-transparent"></div>
          <div className="absolute inset-0 bg-[#0b0f1a]/80"></div>

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
                  className={`px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all flex items-center gap-2 ${
                    activeTab === tab.key
                      ? 'bg-[#2ecc71] text-slate-900'
                      : 'bg-slate-900/60 border border-white/10 text-slate-400 hover:border-[#2ecc71]/30 hover:text-white'
                  }`}
                >
                  {tab.label}
                  <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                    activeTab === tab.key ? 'bg-slate-900/20' : 'bg-white/10'
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
                <ExperienceCard
                  key={exp.id}
                  exp={exp}
                  index={index}
                  expandedId={expandedId}
                  setExpandedId={setExpandedId}
                />
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
