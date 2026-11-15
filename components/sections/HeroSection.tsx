"use client";

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import NextImage from 'next/image';
import { ArrowRight, ShieldCheck, Sparkles, Star } from 'lucide-react';
import { Button, TypewriterEffect, Container } from '@/components/ui';
import { ImageReveal, Reveal, SplitText, usePageRevealed } from '@/components/motion/Reveal';
import { canOptimizeImage } from '@/lib/image-src';

interface HeroSectionProps {
  name: string;
  title: string;
  subtitle: string;
  typewriterTexts: string[];
  description: string;
  stats: Array<{ label: string; value: number; suffix?: string }>;
  /** Public URL of the profile photo (resolved on the server). */
  profileImage?: string | null;
}

const FALLBACK_PORTRAIT =
  'https://images.unsplash.com/photo-1519085195758-2a89f9c3f732?auto=format&fit=crop&q=80&w=800';

function FloatingBadge({
  children,
  className,
  delay,
}: {
  children: React.ReactNode;
  className: string;
  delay: number;
}) {
  const reduce = useReducedMotion();
  const revealed = usePageRevealed();

  return (
    <motion.div
      className={`absolute z-20 ${className}`}
      initial={reduce ? false : { opacity: 0, scale: 0.8, y: 20 }}
      animate={revealed ? { opacity: 1, scale: 1, y: 0 } : undefined}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        animate={reduce ? undefined : { y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: delay + 1 }}
        className="flex items-center gap-3 rounded-2xl bg-white/90 backdrop-blur-xl border border-line shadow-card px-4 py-3"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export default function HeroSection({
  name,
  title,
  subtitle,
  typewriterTexts,
  description,
  stats,
  profileImage,
}: HeroSectionProps) {
  const [portrait, setPortrait] = useState(profileImage || FALLBACK_PORTRAIT);
  const nameWords = (name || '').trim().split(/\s+/);
  const firstName = nameWords[0] || '';
  const lastName = nameWords.slice(1).join(' ');

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-28 sm:pt-32 lg:pt-36 pb-12 overflow-hidden hero-backdrop">
      {/* soft decorative shapes */}
      <div className="absolute inset-0 bg-dots opacity-50 [mask-image:radial-gradient(60%_60%_at_30%_40%,#000_0%,transparent_100%)] pointer-events-none" />
      <div className="absolute top-[12%] -left-24 w-[420px] h-[420px] rounded-full bg-primary/10 blur-[120px] pointer-events-none animate-subtle-pulse" />

      <Container>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10">
          {/* Content */}
          <div>
            <Reveal onLoad delay={0.05} y={20}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-line shadow-card text-primary text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.2em] mb-7 sm:mb-9">
                <Sparkles size={14} className="text-primary" />
                <span className="hidden sm:inline">{subtitle}</span>
                <span className="sm:hidden">Since 2014</span>
              </div>
            </Reveal>

            <h1 className="font-black leading-[0.92] tracking-tight mb-6 sm:mb-8 uppercase">
              <SplitText
                as="span"
                text={title}
                onLoad
                delay={0.1}
                className="block text-outline text-4xl sm:text-5xl lg:text-6xl xl:text-7xl mb-2 sm:mb-3"
              />
              <SplitText
                as="span"
                text={firstName}
                onLoad
                delay={0.2}
                className="block text-ink text-5xl sm:text-6xl lg:text-7xl xl:text-[96px]"
              />
              {lastName && (
                <SplitText
                  as="span"
                  text={lastName}
                  onLoad
                  delay={0.3}
                  wordClassName="text-gradient"
                  className="block text-5xl sm:text-6xl lg:text-7xl xl:text-[96px]"
                />
              )}
            </h1>

            <Reveal onLoad delay={0.45} y={24}>
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold mb-6 sm:mb-8 h-[36px] sm:h-[44px] lg:h-[52px] text-ink">
                <TypewriterEffect texts={typewriterTexts} speed={80} deleteSpeed={40} pauseTime={1500} />
              </div>
            </Reveal>

            <Reveal onLoad delay={0.55} y={24}>
              <p className="text-base sm:text-lg text-body mb-9 sm:mb-11 max-w-lg leading-relaxed font-medium">
                {description}
              </p>
            </Reveal>

            {/* CTAs */}
            <Reveal onLoad delay={0.65} y={24}>
              <div className="flex flex-wrap items-center gap-4">
                {/* Portfolio variant: no contact call-to-action, internal pages only */}
                <Button href="/services" icon={ArrowRight} size="lg">
                  View Services
                </Button>
                <Button href="/reviews" variant="secondary" size="lg">
                  Client Reviews
                </Button>
              </div>
            </Reveal>

            {/* Stats */}
            <Reveal onLoad delay={0.75} y={24}>
              <div className="mt-10 pt-8 border-t border-line grid grid-cols-3 gap-4 max-w-lg">
                {stats.map((stat, i) => (
                  <div key={i} className="flex flex-col">
                    <span className="text-2xl sm:text-4xl font-black text-ink tracking-tight">
                      {Number(stat.value).toLocaleString()}
                      <span className="text-primary">{stat.suffix}</span>
                    </span>
                    <span className="mt-1 text-[9px] sm:text-[10px] uppercase tracking-widest text-muted font-bold">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Portrait */}
          <div className="relative order-first lg:order-last mx-auto w-full max-w-[520px]">
            {/* dashed frame + glow behind the photo */}
            <div className="absolute inset-[-6%] rounded-[3.5rem] sm:rounded-[5rem] border-2 border-dashed border-primary/20 pointer-events-none" />
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-primary/25 rounded-full blur-3xl -z-10 animate-subtle-pulse" />
            <div className="absolute -top-8 -left-8 w-40 h-40 bg-accent/20 rounded-full blur-3xl -z-10 animate-subtle-pulse" />

            <ImageReveal onLoad delay={0.15} className="relative z-10 rounded-[3rem] sm:rounded-[4.5rem] overflow-hidden">
              <div className="group relative w-full aspect-[4/5] bg-surface-2 border-[10px] sm:border-[14px] border-white shadow-[0_40px_80px_-30px_rgba(61,91,239,0.45)] rounded-[3rem] sm:rounded-[4.5rem] overflow-hidden">
                <NextImage
                  src={portrait}
                  alt={name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 90vw, 520px"
                  unoptimized={!canOptimizeImage(portrait)}
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  onError={() => setPortrait(FALLBACK_PORTRAIT)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent" />
              </div>
            </ImageReveal>

            <FloatingBadge delay={0.9} className="-left-2 sm:-left-10 top-[14%]">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-glow">
                <Star className="w-5 h-5 text-white" fill="currentColor" />
              </div>
              <div>
                <div className="text-sm font-black text-ink leading-tight">Top Rated</div>
                <div className="text-[10px] uppercase tracking-widest text-muted font-bold">Freelance Professional</div>
              </div>
            </FloatingBadge>

            <FloatingBadge delay={1.05} className="-right-2 sm:-right-8 bottom-[12%]">
              <div className="w-10 h-10 rounded-xl bg-primary-soft flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-sm font-black text-ink leading-tight">{name}</div>
                <div className="text-[10px] uppercase tracking-widest text-muted font-bold">Global Outsourcing Partner</div>
              </div>
            </FloatingBadge>
          </div>
        </div>
      </Container>
    </section>
  );
}
