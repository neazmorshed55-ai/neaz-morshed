"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowRight, ArrowLeft, Briefcase, Database, Target,
  Layout, Video, Search, Loader2
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon: string;
  cover_image: string | null;
  order_index: number;
}

const iconMap: { [key: string]: React.ReactNode } = {
  Briefcase: <Briefcase className="w-12 h-12" />,
  Database: <Database className="w-12 h-12" />,
  Target: <Target className="w-12 h-12" />,
  Layout: <Layout className="w-12 h-12" />,
  Video: <Video className="w-12 h-12" />,
  Search: <Search className="w-12 h-12" />,
};

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchServices() {
      if (!supabase) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true });

      if (!error && data) {
        setServices(data);
      }
      setLoading(false);
    }

    fetchServices();
  }, []);

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
            <a href="https://www.fiverr.com/neaz222" target="_blank" className="bg-[#2ecc71] text-slate-950 px-8 py-4 rounded-2xl font-black text-[11px] tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#2ecc71]/20 uppercase">HIRE ME</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 relative overflow-hidden">
        <div className="absolute top-[10%] left-[5%] w-[600px] h-[600px] bg-[#2ecc71]/5 rounded-full blur-[180px] pointer-events-none"></div>

        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-[#2ecc71] transition-all mb-8 group">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-bold uppercase tracking-wider">Back to Home</span>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[#2ecc71] text-[11px] font-black uppercase tracking-[0.5em] mb-6 block">What I Offer</span>
            <h1 className="text-6xl lg:text-8xl font-black uppercase tracking-tighter leading-none mb-8">
              My <span className="text-slate-600">Services</span>
            </h1>
            <p className="text-slate-400 text-xl max-w-2xl leading-relaxed">
              Explore my portfolio collections for each service. Click on any service to see my work samples and case studies.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-7xl">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-[#2ecc71] animate-spin" />
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-slate-400 text-lg">No services available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link href={`/services/${service.slug}`}>
                    <div className="group relative h-full">
                      {/* Card */}
                      <div className="p-10 bg-slate-900/60 border border-white/5 rounded-[3rem] hover:border-[#2ecc71]/40 hover:bg-slate-900 transition-all duration-500 h-full flex flex-col relative overflow-hidden">
                        {/* Cover Image */}
                        {service.cover_image && (
                          <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
                            <img
                              src={service.cover_image}
                              alt={service.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}

                        <div className="relative z-10">
                          {/* Icon */}
                          <div className="text-[#2ecc71] mb-8 group-hover:scale-110 group-hover:rotate-6 transition-transform inline-flex p-5 bg-white/5 rounded-[2rem] border border-white/5">
                            {iconMap[service.icon] || <Briefcase className="w-12 h-12" />}
                          </div>

                          {/* Title */}
                          <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter leading-tight group-hover:text-[#2ecc71] transition-colors">
                            {service.title}
                          </h3>

                          {/* Description */}
                          <p className="text-slate-400 text-sm leading-relaxed mb-8 flex-grow">
                            {service.description}
                          </p>

                          {/* View Portfolio Link */}
                          <div className="flex items-center gap-3 text-[#2ecc71] text-[11px] font-black uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                            View Portfolio <ArrowRight size={16} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/5">
        <div className="container mx-auto px-6 max-w-7xl flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div className="flex gap-8">
            <a href="https://www.linkedin.com/in/neazmorshed222/" target="_blank" className="text-slate-500 hover:text-[#2ecc71] transition-all uppercase text-[10px] font-bold tracking-widest">LinkedIn</a>
            <a href="https://www.fiverr.com/neaz222" target="_blank" className="text-slate-500 hover:text-[#2ecc71] transition-all uppercase text-[10px] font-bold tracking-widest">Fiverr</a>
            <a href="https://www.facebook.com/neazmorshed001/" target="_blank" className="text-slate-500 hover:text-[#2ecc71] transition-all uppercase text-[10px] font-bold tracking-widest">Facebook</a>
          </div>
          <div className="text-center">
            <p className="text-slate-400 text-sm font-medium">
              Designed and Developed by <span className="text-[#2ecc71] font-semibold">Neaz Morshed</span>
            </p>
            <p className="text-slate-600 text-xs mt-1">
              Copyright © 2026
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
