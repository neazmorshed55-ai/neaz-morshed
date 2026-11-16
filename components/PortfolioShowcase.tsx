"use client";

import React from 'react';
import Link from 'next/link';
import NextImage from './SiteImage';
import { ArrowRight } from 'lucide-react';
import { Reveal, SplitText } from '@/components/motion/Reveal';

export interface PortfolioShowcaseItem {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  video_url?: string | null;
  thumbnail_url?: string | null;
  order_index: number;
}

// Hosts next/image is allowed to optimise (see next.config.js remotePatterns)
const OPTIMIZABLE = /^https:\/\/([a-z0-9-]+\.supabase\.co\/storage\/|images\.unsplash\.com\/|lh3\.googleusercontent\.com\/|img\.youtube\.com\/)/;

/**
 * Homepage project grid. Items come from the server; images are resized by
 * next/image (≈30-80 KB each instead of multi-MB originals) and lazy-loaded.
 */
export default function PortfolioShowcase({ items }: { items: PortfolioShowcaseItem[] }) {
  if (!items || items.length === 0) return null;

  return (
    <section className="py-16 sm:py-24 bg-surface relative overflow-hidden">
      <div className="absolute inset-0 bg-dots opacity-40 [mask-image:linear-gradient(180deg,#000,transparent_70%)] pointer-events-none" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 max-w-7xl relative">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <Reveal y={16}>
            <span className="flex items-center justify-center gap-3 text-primary text-[11px] font-extrabold uppercase tracking-[0.4em] mb-5">
              <span className="h-px w-8 bg-primary/60" />
              Portfolio
              <span className="h-px w-8 bg-primary/60" />
            </span>
          </Reveal>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-[0.95] mb-5 text-ink">
            <SplitText text="Our" wordClassName="text-gradient" /> <SplitText text="Projects" delay={0.08} />
          </h2>
          <Reveal y={20} delay={0.1}>
            <p className="text-body text-lg max-w-2xl mx-auto">
              Explore our diverse portfolio of successful projects
            </p>
          </Reveal>
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
          {items.map((item, index) => {
            const src = item.thumbnail_url || item.image_url;
            return (
              <Reveal key={item.id} delay={(index % 4) * 0.08} y={30}>
                <div className="group relative aspect-video rounded-2xl overflow-hidden bg-surface-2 border border-line shadow-card hover:shadow-card-hover hover:border-primary/40 transition-all duration-300">
                  {src ? (
                    <NextImage
                      src={src}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 55vw, (max-width: 1024px) 34vw, (max-width: 1280px) 25vw, 20vw"
                      quality={70}
                      unoptimized={!OPTIMIZABLE.test(src)}
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/15 to-accent/15 flex items-center justify-center">
                      <p className="text-body text-sm text-center px-4 font-semibold">{item.title}</p>
                    </div>
                  )}

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <h3 className="text-white font-bold text-base sm:text-lg mb-1 line-clamp-1 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-white/80 text-xs sm:text-sm line-clamp-2">
                        {item.description}
                      </p>
                    )}
                  </div>

                  {/* Index Badge */}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-card">
                    <span className="text-ink text-xs font-bold">#{index + 1}</span>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* View All Button */}
        <Reveal y={20} className="flex justify-center mt-12">
          <Link
            href="/services"
            className="group px-8 py-4 bg-primary text-white font-extrabold uppercase tracking-widest text-xs sm:text-sm rounded-2xl hover:bg-primary-dark transition-all duration-300 active:scale-95 shadow-glow flex items-center gap-2"
          >
            View All Projects
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
