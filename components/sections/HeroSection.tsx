"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import NextImage from 'next/image';
import { ArrowRight, TrendingUp, ShieldCheck } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Button, TypewriterEffect, StatCard, Container } from '@/components/ui';

interface HeroSectionProps {
  name: string;
  title: string;
  subtitle: string;
  typewriterTexts: string[];
  description: string;
  stats: Array<{ label: string; value: number; suffix?: string }>;
}

export default function HeroSection({
  name,
  title,
  subtitle,
  typewriterTexts,
  description,
  stats,
}: HeroSectionProps) {
  const [profileImage, setProfileImage] = useState(
    'https://images.unsplash.com/photo-1519085195758-2a89f9c3f732?auto=format&fit=crop&q=80&w=800'
  );

  useEffect(() => {
    if (supabase) {
      const { data } = supabase.storage.from('images').getPublicUrl('profile.jpg');
      if (data?.publicUrl) {
        const img = new Image();
        img.onload = () => setProfileImage(data.publicUrl);
        img.src = data.publicUrl;
      }
    }
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 sm:pt-28 lg:pt-36 overflow-hidden">
      <div className="absolute top-[10%] left-[5%] w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-[#2ecc71]/5 rounded-full blur-[180px] pointer-events-none animate-subtle-pulse" />

      <Container>
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center relative z-10">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-[#2ecc71]/10 border border-[#2ecc71]/20 text-[#2ecc71] text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-6 sm:mb-10">
              <TrendingUp size={14} className="text-[#2ecc71]" />
              <span className="hidden sm:inline">{subtitle}</span>
              <span className="sm:hidden">Since 2014</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl xl:text-[90px] font-black leading-[0.9] mb-6 sm:mb-8 tracking-tighter">
              I AM <br />
              <span className="text-gradient">{name.split(' ')[0]}</span> <br />
              <span className="text-gradient">{name.split(' ')[1] || ''}</span>
            </h1>

            <div className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold mb-6 sm:mb-10 h-[40px] sm:h-[50px] lg:h-[60px]">
              <TypewriterEffect texts={typewriterTexts} speed={80} deleteSpeed={40} pauseTime={1500} />
            </div>

            <p className="text-base sm:text-lg text-slate-400 mb-8 sm:mb-12 max-w-lg leading-relaxed font-medium">
              {description}
            </p>

            {/* CTA & Stats */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6 items-start sm:items-center">
              {/* Contact button removed */}

              <div className="flex gap-4 sm:gap-6 pl-0 sm:pl-4 sm:border-l border-white/10">
                {stats.map((stat, i) => (
                  <div key={i} className="flex flex-col">
                    <span className="text-xl sm:text-2xl font-black text-white">
                      {stat.value.toLocaleString()}{stat.suffix}
                    </span>
                    <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative group order-first lg:order-last"
          >
            <div className="relative z-10 w-full aspect-[4/5] rounded-[3rem] sm:rounded-[5rem] overflow-hidden border-8 sm:border-[16px] border-white/5 shadow-2xl bg-slate-900">
              <NextImage
                src={profileImage}
                alt={name}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f1a] via-transparent to-transparent opacity-60" />

              <div className="absolute bottom-4 sm:bottom-10 left-4 right-4 sm:left-10 sm:right-10 p-4 sm:p-8 rounded-2xl sm:rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 flex items-center gap-3 sm:gap-5">
                <ShieldCheck className="text-[#2ecc71] w-8 h-8 sm:w-12 sm:h-12" />
                <div>
                  <div className="text-xs sm:text-sm font-black uppercase tracking-[0.1em]">{name}</div>
                  <div className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    Global Outsourcing Partner
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-10 -right-10 w-32 h-32 sm:w-48 sm:h-48 bg-[#2ecc71]/20 rounded-full blur-3xl -z-10 animate-subtle-pulse" />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
