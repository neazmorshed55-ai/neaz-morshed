"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft, ArrowRight, Loader2, Calendar, MapPin, Briefcase,
  ChevronDown, CheckCircle2, Building2
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Experience {
  id: string;
  company: string;
  position: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  skills: string[];
  is_current: boolean;
  order_index: number;
}

const defaultExperiences: Experience[] = [
  {
    id: '1',
    company: 'The Global Council for Anthropological Linguistics - GLOCAL',
    position: 'Media and Web Design Coordinator',
    description: 'Remote and Full time job. Web development and design for GLOCAL website and three other websites like CALA, COMELA, AFALA, JALA, JOMELA.',
    start_date: 'January 2021',
    end_date: 'December 2022',
    location: 'Remote',
    skills: ['Responsive Web Design', 'Excel', 'Graphic Design', 'Problem Solving', 'WordPress', 'WordPress Design'],
    is_current: false,
    order_index: 7
  },
  {
    id: '2',
    company: 'Tritech Building Services Ltd.',
    position: 'Team Leader - Brand & Communication',
    description: 'Brand Promotion and team management for marketing initiatives.',
    start_date: 'January 2020',
    end_date: 'October 2022',
    location: 'Bangladesh',
    skills: ['Brand Promotion', 'Team Leadership', 'Communication'],
    is_current: false,
    order_index: 6
  },
  {
    id: '3',
    company: 'HJ Visualization',
    position: 'Virtual Assistant',
    description: 'Remote and Part time Job providing administrative support.',
    start_date: 'January 2019',
    end_date: 'December 2023',
    location: 'Remote',
    skills: ['Virtual Assistance', 'Remote Work'],
    is_current: false,
    order_index: 5
  },
  {
    id: '4',
    company: 'Tritech Building Services Ltd.',
    position: 'Client Relationship Manager',
    description: 'Project Survey and Reports, maintaining client relationships.',
    start_date: 'May 2018',
    end_date: 'January 2020',
    location: 'Bangladesh',
    skills: ['Project Survey', 'Client Relations', 'Reports'],
    is_current: false,
    order_index: 4
  },
  {
    id: '5',
    company: 'Power Sonic Transformar and Switchgear Co. Ltd.',
    position: 'Assistant Engineer',
    description: 'Project Survey, Layout design of substation following DESCO and DPDC rules, LT HT meter cable Measurement, Consult with clients about everything before and after getting any substation project.',
    start_date: 'January 2017',
    end_date: 'May 2018',
    location: 'Bangladesh',
    skills: ['Project Survey', 'Layout Design', 'Client Consultation'],
    is_current: false,
    order_index: 3
  },
  {
    id: '6',
    company: 'Cityscape International Limited',
    position: 'IT Associate Engineer',
    description: 'Network Administration and IT support.',
    start_date: 'January 2016',
    end_date: 'December 2016',
    location: 'Bangladesh',
    skills: ['Network Administration', 'IT Support'],
    is_current: false,
    order_index: 2
  },
  {
    id: '7',
    company: 'Berger Paints Bangladesh Limited',
    position: 'Project Support Engineer',
    description: 'Contractual Job. Project Documentation and IT Infrastructure.',
    start_date: 'August 2015',
    end_date: 'December 2015',
    location: 'Bangladesh',
    skills: ['Project Documentation', 'IT Infrastructure'],
    is_current: false,
    order_index: 1
  },
];

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>(defaultExperiences);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>('1');

  useEffect(() => {
    async function fetchData() {
      if (!supabase) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await supabase
          .from('experiences')
          .select('*')
          .order('order_index', { ascending: false });

        if (data && data.length > 0) {
          setExperiences(data);
          setExpandedId(data[0].id);
        }
      } catch (error) {
        console.error('Error fetching experiences:', error);
      }

      setLoading(false);
    }

    fetchData();
  }, []);

  const getYearFromDate = (dateStr: string) => {
    const parts = dateStr.split(' ');
    return parts[parts.length - 1];
  };

  const calculateDuration = (start: string, end: string) => {
    const startYear = parseInt(getYearFromDate(start));
    const endYear = parseInt(getYearFromDate(end));
    const years = endYear - startYear;
    if (years === 0) return 'Less than a year';
    if (years === 1) return '1 year';
    return `${years} years`;
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
            <Link href="/skills" className="text-[11px] font-bold tracking-[0.3em] text-slate-400 hover:text-[#2ecc71] transition-all uppercase">Skills</Link>
            <Link href="/services" className="text-[11px] font-bold tracking-[0.3em] text-slate-400 hover:text-[#2ecc71] transition-all uppercase">Services</Link>
            <Link href="/experience" className="text-[11px] font-bold tracking-[0.3em] text-[#2ecc71] transition-all uppercase">Experience</Link>
            <Link href="/reviews" className="text-[11px] font-bold tracking-[0.3em] text-slate-400 hover:text-[#2ecc71] transition-all uppercase">Reviews</Link>
            <Link href="/contact" className="text-[11px] font-bold tracking-[0.3em] text-slate-400 hover:text-[#2ecc71] transition-all uppercase">Contact</Link>
            <a href="https://www.fiverr.com/neaz222" target="_blank" className="bg-[#2ecc71] text-slate-950 px-8 py-4 rounded-2xl font-black text-[11px] tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#2ecc71]/20 uppercase">HIRE ME</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 relative overflow-hidden">
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
              A journey through my professional career spanning over 10 years of diverse experience in IT, virtual assistance, and creative services.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
          >
            <div className="p-6 bg-slate-900/50 rounded-2xl border border-white/5 text-center">
              <div className="text-4xl font-black text-[#2ecc71] mb-2">10+</div>
              <div className="text-slate-400 text-xs uppercase tracking-wider">Years Experience</div>
            </div>
            <div className="p-6 bg-slate-900/50 rounded-2xl border border-white/5 text-center">
              <div className="text-4xl font-black text-[#2ecc71] mb-2">7</div>
              <div className="text-slate-400 text-xs uppercase tracking-wider">Companies</div>
            </div>
            <div className="p-6 bg-slate-900/50 rounded-2xl border border-white/5 text-center">
              <div className="text-4xl font-black text-[#2ecc71] mb-2">5+</div>
              <div className="text-slate-400 text-xs uppercase tracking-wider">Industries</div>
            </div>
            <div className="p-6 bg-slate-900/50 rounded-2xl border border-white/5 text-center">
              <div className="text-4xl font-black text-[#2ecc71] mb-2">180+</div>
              <div className="text-slate-400 text-xs uppercase tracking-wider">Projects</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="pb-20 relative">
        <div className="container mx-auto px-6 max-w-5xl">
          {/* Timeline */}
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#2ecc71] via-[#2ecc71]/50 to-transparent transform md:-translate-x-1/2"></div>

            {experiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative flex flex-col md:flex-row gap-8 mb-12 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Timeline Dot */}
                <div className="absolute left-0 md:left-1/2 w-4 h-4 bg-[#2ecc71] rounded-full transform -translate-x-1/2 border-4 border-[#0b0f1a] shadow-[0_0_20px_rgba(46,204,113,0.5)] z-10"></div>

                {/* Year Badge - Desktop */}
                <div className={`hidden md:flex md:w-1/2 items-center ${
                  index % 2 === 0 ? 'justify-end pr-12' : 'justify-start pl-12'
                }`}>
                  <div className="text-center">
                    <div className="text-6xl font-black text-[#2ecc71]/20">{getYearFromDate(exp.start_date)}</div>
                    <div className="text-sm text-slate-500 font-bold">{calculateDuration(exp.start_date, exp.end_date)}</div>
                  </div>
                </div>

                {/* Content Card */}
                <div className={`md:w-1/2 pl-8 md:pl-0 ${index % 2 === 0 ? 'md:pl-12' : 'md:pr-12'}`}>
                  <div
                    className={`p-6 rounded-3xl border transition-all duration-300 cursor-pointer ${
                      expandedId === exp.id
                        ? 'bg-[#1a1f2e] border-[#2ecc71]/30 shadow-lg shadow-[#2ecc71]/10'
                        : 'bg-slate-900/40 border-white/5 hover:border-white/10'
                    }`}
                    onClick={() => setExpandedId(expandedId === exp.id ? null : exp.id)}
                  >
                    {/* Mobile Year */}
                    <div className="md:hidden text-[#2ecc71] text-sm font-bold mb-3">
                      {exp.start_date} - {exp.end_date}
                    </div>

                    {/* Header */}
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Building2 size={16} className="text-[#2ecc71]" />
                          <span className="text-slate-400 text-sm font-medium">{exp.company}</span>
                        </div>
                        <h3 className={`text-xl font-black transition-colors ${
                          expandedId === exp.id ? 'text-[#2ecc71]' : 'text-white'
                        }`}>
                          {exp.position}
                        </h3>
                      </div>
                      <ChevronDown
                        size={20}
                        className={`text-slate-500 transition-transform duration-300 flex-shrink-0 ${
                          expandedId === exp.id ? 'rotate-180 text-[#2ecc71]' : ''
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
                          <p className="text-slate-300 mb-4 leading-relaxed">
                            {exp.description}
                          </p>

                          {/* Skills */}
                          {exp.skills && exp.skills.length > 0 && (
                            <div>
                              <div className="text-xs uppercase tracking-wider text-slate-500 mb-3 font-bold">Skills Used</div>
                              <div className="flex flex-wrap gap-2">
                                {exp.skills.map((skill, idx) => (
                                  <span
                                    key={idx}
                                    className="flex items-center gap-1 px-3 py-1 bg-[#2ecc71]/10 text-[#2ecc71] rounded-full text-xs font-semibold"
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
              With over 10 years of diverse experience, I'm ready to bring my expertise to your next project.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/#contact"
                className="px-10 py-5 bg-[#2ecc71] text-slate-900 font-black rounded-2xl hover:scale-105 transition-transform uppercase tracking-widest text-sm flex items-center gap-3"
              >
                Contact Me <ArrowRight size={18} />
              </Link>
              <a
                href="https://www.fiverr.com/neaz222"
                target="_blank"
                rel="noopener noreferrer"
                className="px-10 py-5 border-2 border-white/20 text-white font-black rounded-2xl hover:border-[#2ecc71] transition-all uppercase tracking-widest text-sm"
              >
                View Fiverr Profile
              </a>
            </div>
          </motion.div>
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
