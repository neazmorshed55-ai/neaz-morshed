"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight, ArrowLeft, Briefcase, Database, Target,
  Layout, Video, Search, Loader2
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Navbar from '../../components/Navbar';
import VideoBackground from '../../components/VideoBackground';

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
        .select('id, title, slug, description, icon, cover_image, order_index')
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
      <Navbar />

      <main className="pb-24">
        {/* Hero Section - Improved for better readability */}
        <section className="pt-32 pb-16 relative overflow-hidden min-h-[45vh] flex flex-col justify-center">
          <VideoBackground type="services" opacity={0.5} />

          {/* Softer decorative elements */}
          <div className="absolute top-[10%] left-[5%] w-[500px] h-[500px] bg-[#2ecc71]/3 rounded-full blur-[150px] pointer-events-none"></div>

          <div className="container mx-auto px-6 max-w-7xl relative z-10">
            <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-[#2ecc71] transition-all mb-10 group">
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-bold uppercase tracking-wider">Back to Home</span>
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-[#2ecc71] text-xs font-black uppercase tracking-[0.4em] mb-6 block">What I Offer</span>
              <h1 className="text-5xl lg:text-7xl font-black uppercase tracking-tight leading-[1.1] mb-6">
                My <span className="text-[#2ecc71]">Services</span>
              </h1>
              <p className="text-slate-300 text-lg lg:text-xl max-w-2xl leading-relaxed font-medium">
                Explore my portfolio collections for each service. Click on any service to see my work samples and case studies.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Services Grid - Enhanced for better visual hierarchy and eye comfort */}
        <section className="py-24 bg-gradient-to-b from-transparent via-slate-900/10 to-transparent">
          <div className="container mx-auto px-6 max-w-7xl">
            {/* Section Header */}
            <div className="text-center mb-16">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl lg:text-4xl font-black uppercase tracking-tight mb-4"
              >
                Browse All <span className="text-[#2ecc71]">Services</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-slate-400 text-base max-w-2xl mx-auto"
              >
                Select a service category to view detailed portfolio and past work
              </motion.p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-12 h-12 text-[#2ecc71] animate-spin" />
              </div>
            ) : services.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-slate-400 text-lg">No services available yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {services.map((service, index) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Link href={`/services/${service.slug}`}>
                      <div className="group relative h-full">
                        {/* Card with better contrast and spacing */}
                        <div className="p-8 lg:p-10 bg-slate-900/80 backdrop-blur-sm border border-white/10 rounded-3xl hover:border-[#2ecc71]/50 hover:bg-slate-900 hover:shadow-2xl hover:shadow-[#2ecc71]/10 transition-all duration-500 h-full flex flex-col relative overflow-hidden">
                          {/* Cover Image with reduced opacity for better readability */}
                          {service.cover_image && (
                            <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity">
                              <Image
                                src={service.cover_image}
                                alt={service.title}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="object-cover"
                              />
                            </div>
                          )}

                          <div className="relative z-10">
                            {/* Icon with better prominence */}
                            <div className="text-[#2ecc71] mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 inline-flex p-4 bg-[#2ecc71]/10 rounded-2xl border border-[#2ecc71]/20 shadow-lg shadow-[#2ecc71]/5">
                              {iconMap[service.icon] || <Briefcase className="w-12 h-12" />}
                            </div>

                            {/* Title with improved contrast */}
                            <h3 className="text-2xl lg:text-3xl font-black mb-4 uppercase tracking-tight leading-tight text-white group-hover:text-[#2ecc71] transition-colors duration-300">
                              {service.title}
                            </h3>

                            {/* Description with better readability */}
                            <p className="text-slate-300 text-base leading-relaxed mb-8 flex-grow">
                              {service.description}
                            </p>

                            {/* View Portfolio Link with better visibility */}
                            <div className="flex items-center gap-3 text-[#2ecc71] text-xs font-black uppercase tracking-wider group-hover:gap-5 transition-all duration-300">
                              View Portfolio <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>

                          {/* Subtle glow effect on hover */}
                          <div className="absolute inset-0 bg-gradient-to-br from-[#2ecc71]/0 to-[#2ecc71]/0 group-hover:from-[#2ecc71]/5 group-hover:to-transparent rounded-3xl transition-all duration-500 pointer-events-none"></div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-white/5">
        <div className="container mx-auto px-6 max-w-7xl flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div className="flex gap-8">
            <a href="/blog" className="text-slate-500 hover:text-[#2ecc71] transition-all uppercase text-[10px] font-bold tracking-widest">Blog</a>
            <a href="https://linktr.ee/neazmorshed" target="_blank" className="text-slate-500 hover:text-[#2ecc71] transition-all uppercase text-[10px] font-bold tracking-widest">Linktree</a>
            <a href="https://www.linkedin.com/in/neazmorshed222/" target="_blank" className="text-slate-500 hover:text-[#2ecc71] transition-all uppercase text-[10px] font-bold tracking-widest">LinkedIn</a>
            <a href="https://www.fiverr.com/neaz222" target="_blank" className="text-slate-500 hover:text-[#2ecc71] transition-all uppercase text-[10px] font-bold tracking-widest">Fiverr</a>
            <a href="https://www.facebook.com/neazmorshed001/" target="_blank" className="text-slate-500 hover:text-[#2ecc71] transition-all uppercase text-[10px] font-bold tracking-widest">Facebook</a>
          </div>
          <p className="text-slate-400 text-sm font-medium">
            Designed and Developed by <span className="text-[#2ecc71] font-semibold">Neaz Morshed</span> • <span className="text-slate-500">Copyright © 2026</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
