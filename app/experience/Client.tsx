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

// One clear colour per job type: used by the year chip, badge, card edge and tint
const TYPE_STYLE = {
  'full-time': {
    chip: 'from-primary to-accent',
    chipShadow: 'shadow-[0_14px_30px_-12px_rgba(87,119,255,0.75)]',
    badge: 'bg-primary text-white',
    card: 'border-primary/25 border-l-primary bg-gradient-to-br from-white via-white to-primary-soft',
    glow: 'hover:shadow-[0_24px_50px_-24px_rgba(87,119,255,0.55)]',
    dot: 'bg-primary',
  },
  'part-time': {
    chip: 'from-amber-500 to-orange-500',
    chipShadow: 'shadow-[0_14px_30px_-12px_rgba(245,158,11,0.75)]',
    badge: 'bg-amber-500 text-white',
    card: 'border-amber-300/60 border-l-amber-500 bg-gradient-to-br from-white via-white to-amber-50',
    glow: 'hover:shadow-[0_24px_50px_-24px_rgba(245,158,11,0.55)]',
    dot: 'bg-amber-500',
  },
  project: {
    chip: 'from-fuchsia-500 to-purple-600',
    chipShadow: 'shadow-[0_14px_30px_-12px_rgba(192,38,211,0.7)]',
    badge: 'bg-fuchsia-600 text-white',
    card: 'border-fuchsia-300/60 border-l-fuchsia-500 bg-gradient-to-br from-white via-white to-fuchsia-50',
    glow: 'hover:shadow-[0_24px_50px_-24px_rgba(192,38,211,0.5)]',
    dot: 'bg-fuchsia-500',
  },
} as const;

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
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50, y: 20 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ type: 'spring', stiffness: 90, damping: 18 }}
      className={`relative flex flex-col md:flex-row gap-8 mb-10 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
    >
      {/* Timeline Dot */}
      <div className="absolute left-0 md:left-1/2 top-6 md:top-1/2 z-10 -translate-x-1/2 md:-translate-y-1/2">
        <span className={`absolute inset-0 rounded-full ${TYPE_STYLE[exp.type].dot} opacity-40 animate-ping`} />
        <span className={`relative block w-5 h-5 rounded-full ${TYPE_STYLE[exp.type].dot} border-4 border-white shadow-lg`} />
      </div>

      {/* Year Badge - Desktop */}
      <div className={`hidden md:flex md:w-1/2 items-center ${index % 2 === 0 ? 'justify-end pr-12' : 'justify-start pl-12'}`}>
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 220, damping: 14, delay: 0.1 }}
            className={`inline-block px-7 py-3 rounded-2xl bg-gradient-to-br ${TYPE_STYLE[exp.type].chip} ${TYPE_STYLE[exp.type].chipShadow} text-white text-4xl lg:text-5xl font-black tracking-tight leading-none`}
          >
            {exp.start_date.split(' ').pop()}
          </motion.div>
          <div className="mt-3">
            <span className={`inline-block text-[11px] px-4 py-1.5 rounded-full font-extrabold uppercase tracking-wider ${TYPE_STYLE[exp.type].badge}`}>
              {exp.type}
            </span>
          </div>
        </div>
      </div>

      {/* Content Card */}
      <div className={`md:w-1/2 pl-8 md:pl-0 ${index % 2 === 0 ? 'md:pl-12' : 'md:pr-12'}`}>
        <motion.div
          whileHover={{ y: -6, scale: 1.012 }}
          whileTap={{ scale: 0.99 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          className={`p-6 rounded-3xl border border-l-[6px] shadow-card transition-shadow duration-300 cursor-pointer ${TYPE_STYLE[exp.type].card} ${TYPE_STYLE[exp.type].glow} ${isExpanded ? 'ring-2 ring-primary/30' : ''}`}
          onClick={() => setExpandedId(isExpanded ? null : exp.id)}
        >
          {/* Mobile Type Badge & Year */}
          <div className="md:hidden flex items-center gap-3 mb-3">
            <span className={`text-[10px] px-3 py-1 rounded-full font-extrabold uppercase tracking-wider ${TYPE_STYLE[exp.type].badge}`}>
              {exp.type}
            </span>
            <span className={`text-xs font-extrabold text-white px-3 py-1 rounded-full bg-gradient-to-br ${TYPE_STYLE[exp.type].chip}`}>
              {exp.start_date.split(' ').pop()}
            </span>
          </div>

          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Building2 size={16} className="text-primary" />
                <span className="text-body text-sm font-medium">{exp.company}</span>
              </div>
              <h3 className={`text-xl font-black transition-colors ${
                isExpanded ? 'text-primary' : 'text-ink'
              }`}>
                {exp.position}
              </h3>
            </div>
            <ChevronDown
              size={20}
              className={`text-muted transition-transform duration-300 flex-shrink-0 ${
                isExpanded ? 'rotate-180 text-primary' : ''
              }`}
            />
          </div>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-4 text-sm text-body mb-4">
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-primary" />
              <span>{exp.start_date} - {exp.end_date}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-primary" />
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
                    <li key={i} className="text-body text-sm flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>{desc}</span>
                    </li>
                  ))}
                </ul>

                {/* Skills */}
                {exp.skills && exp.skills.length > 0 && (
                  <div className="pt-4 border-t border-line">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted mb-3 block">Skills Used</span>
                    <div className="flex flex-wrap gap-2">
                      {exp.skills.map((skill, i) => (
                        <span
                          key={i}
                          className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-bold uppercase tracking-wider"
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
        </motion.div>
      </div>
    </motion.div>
  );
});

ExperienceCard.displayName = 'ExperienceCard';

export default function ExperiencePage({ initial }: { initial?: Experience[] | null }) {
  const hasInitial = !!initial && initial.length > 0;
  const [experiences, setExperiences] = useState<Experience[]>(() => (hasInitial ? sortByDate(initial!) : defaultExperiences));
  const [loading, setLoading] = useState(!hasInitial);
  const [expandedId, setExpandedId] = useState<string | null>(() => (hasInitial ? sortByDate(initial!)[0]?.id ?? null : null));
  const [activeTab, setActiveTab] = useState<'all' | 'full-time' | 'part-time' | 'project'>('all');

  useEffect(() => {
    if (hasInitial) return;
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
      <div className="bg-page text-ink min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-page text-ink min-h-screen">
      <Navbar />
      <main className="pb-24">
        {/* Hero Section */}
        <section className="pt-32 pb-16 relative overflow-hidden min-h-[55vh] flex flex-col justify-center">
          {/* Simplified static gradient background - much faster than VideoBackground */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#4facfe]/20 via-[#00f2fe]/10 to-transparent"></div>
          <div className="absolute inset-0 bg-page/80"></div>

          {/* Additional decorative elements */}
          <div className="absolute top-[20%] left-[10%] w-[400px] h-[400px] rounded-full pointer-events-none np-orb [--c:87_119_255] [--a:0.11]"></div>
          <div className="absolute bottom-[20%] right-[10%] w-[300px] h-[300px] rounded-full pointer-events-none np-orb [--c:87_119_255] [--a:0.11]"></div>

          <div className="container mx-auto px-6 max-w-7xl relative z-10">
            {/* Back Link */}
            <Link href="/" className="inline-flex items-center gap-2 text-body hover:text-primary transition-all mb-8 group">
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
                Work <span className="text-primary">Experience</span>
              </h1>
              <p className="text-body text-lg max-w-2xl mx-auto">
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
              <div className="p-6 bg-surface rounded-2xl border border-line text-center">
                <div className="text-4xl font-black text-primary mb-2">12+</div>
                <div className="text-body text-xs uppercase tracking-wider">Years Experience</div>
              </div>
              <div className="p-6 bg-surface rounded-2xl border border-line text-center">
                <div className="text-4xl font-black text-primary mb-2">{stats.total}</div>
                <div className="text-body text-xs uppercase tracking-wider">Total Positions</div>
              </div>
              <div className="p-6 bg-surface rounded-2xl border border-line text-center">
                <div className="text-4xl font-black text-primary mb-2">1,000+</div>
                <div className="text-body text-xs uppercase tracking-wider">Global Clients</div>
              </div>
              <div className="p-6 bg-surface rounded-2xl border border-line text-center">
                <div className="text-4xl font-black text-primary mb-2">10,000+</div>
                <div className="text-body text-xs uppercase tracking-wider">Hours Completed</div>
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
                      ? 'bg-primary text-white'
                      : 'bg-surface border border-line text-body hover:border-primary/30 hover:text-ink'
                  }`}
                >
                  {tab.label}
                  <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                    activeTab === tab.key ? 'bg-surface-2/60' : 'bg-surface-2'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-20 bg-surface-2/60 relative">
          <div className="container mx-auto px-6 max-w-5xl">
            {/* Timeline */}
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-transparent transform md:-translate-x-1/2"></div>

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
        <section className="py-20 bg-surface-2/60">
          <div className="container mx-auto px-6 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center p-12 bg-surface border border-line rounded-[3rem] relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-[200px] h-[200px] rounded-full -z-10 np-orb [--c:87_119_255] [--a:0.22]"></div>

              <Briefcase className="w-16 h-16 text-primary mx-auto mb-6" />
              <h3 className="text-3xl font-black uppercase tracking-tight mb-4">
                Ready to Work Together?
              </h3>
              <p className="text-body mb-8 max-w-xl mx-auto">
                With over 12 years of diverse experience and 1,000+ global clients, I'm ready to bring my expertise to your next project.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/resume"
                  className="px-10 py-5 border-2 border-line text-ink font-black rounded-2xl hover:border-primary transition-all uppercase tracking-widest text-sm"
                >
                  View Full Resume
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-6 sm:py-8 border-t border-line">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6 text-center md:text-left">
            <FooterLinks />
            <p className="text-body text-xs sm:text-sm font-medium">
              Designed and Developed by{' '}
              <span className="text-primary font-semibold">Neaz Morshed</span> •{' '}
              <span className="text-muted">Copyright © 2026</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
