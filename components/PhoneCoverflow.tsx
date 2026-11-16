"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, X, ChevronLeft, ChevronRight } from 'lucide-react';
import GalleryCoverflow from './gallery/GalleryCoverflow';
import { LightboxImage } from './gallery/GalleryImages';
import NextImage from './SiteImage';
import { Reveal, SplitText } from '@/components/motion/Reveal';

export interface PhoneItem {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  thumbnail_url?: string | null;
}

const OPTIMIZABLE = /^https:\/\/([a-z0-9-]+\.supabase\.co\/storage\/|images\.unsplash\.com\/|lh3\.googleusercontent\.com\/|img\.youtube\.com\/)/;

/** Phone-shaped card: dark bezel, speaker notch, screenshot cropped to the top. */
export function PhoneFrame({ src, alt, sizes = '280px', className = '' }: { src: string | null; alt: string; sizes?: string; className?: string }) {
  return (
    <div className={`relative aspect-[9/19] w-full rounded-[2.4rem] bg-[#0B1020] p-[7px] shadow-[0_30px_60px_-25px_rgba(30,45,120,0.55)] ring-1 ring-black/10 ${className}`}>
      <div className="relative h-full w-full overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary/25 via-primary-soft to-accent/25">
        {src ? (
          <NextImage
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            quality={70}
            unoptimized={!OPTIMIZABLE.test(src)}
            className="object-cover object-top"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center p-4 text-center text-sm font-bold text-primary">{alt}</div>
        )}
      </div>
      <span className="pointer-events-none absolute left-1/2 top-[11px] h-[18px] w-[72px] -translate-x-1/2 rounded-full bg-[#0B1020]" />
    </div>
  );
}

/**
 * Homepage project showcase: a 3D coverflow where every card keeps its
 * picture's own shape (nothing is cropped). Tapping a picture opens it
 * full size. Same engine as the project gallery (CSS transforms only).
 */
export default function PhoneCoverflow({
  items,
  title = 'Projects',
  eyebrow = 'Portfolio',
  allHref = '/services',
}: {
  items: PhoneItem[];
  title?: string;
  eyebrow?: string;
  allHref?: string;
}) {
  const list = (items || []).filter((it) => it.thumbnail_url || it.image_url).slice(0, 14);
  const [open, setOpen] = useState<number | null>(null);
  const n = list.length;

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null);
      if (e.key === 'ArrowLeft') setOpen((o) => (o === null ? o : (o - 1 + n) % n));
      if (e.key === 'ArrowRight') setOpen((o) => (o === null ? o : (o + 1) % n));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, n]);

  if (n === 0) return null;
  const srcOf = (it: PhoneItem) => (it.image_url || it.thumbnail_url) as string;

  return (
    <section className="py-16 sm:py-24 bg-surface relative overflow-hidden">
      <div className="absolute inset-0 bg-dots opacity-40 [mask-image:linear-gradient(180deg,#000,transparent_70%)] pointer-events-none" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 max-w-7xl relative">
        <div className="text-center mb-8 sm:mb-12">
          <Reveal y={16}>
            <span className="flex items-center justify-center gap-3 text-primary text-[11px] font-extrabold uppercase tracking-[0.4em] mb-5">
              <span className="h-px w-8 bg-primary/60" />
              {eyebrow}
              <span className="h-px w-8 bg-primary/60" />
            </span>
          </Reveal>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-[0.95] mb-5 text-ink">
            <SplitText text="Our" wordClassName="text-gradient" /> <SplitText text={title} delay={0.08} />
          </h2>
        </div>

        <GalleryCoverflow
          images={list.map((it) => ({ src: srcOf(it), alt: it.title }))}
          onOpen={(i) => setOpen(i)}
          wide
        />

        <div className="flex justify-center mt-8">
          <Link href={allHref} className="group px-7 py-3.5 bg-primary text-white font-extrabold uppercase tracking-widest text-xs rounded-2xl hover:bg-primary-dark transition active:scale-95 shadow-glow flex items-center gap-2">
            View All Projects
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {open !== null && list[open] && (
        <div className="fixed inset-0 z-[99999] bg-black/90 flex items-center justify-center p-3 sm:p-8" onClick={() => setOpen(null)} role="dialog" aria-modal="true">
          <button type="button" aria-label="Close" onClick={() => setOpen(null)} className="absolute top-4 right-4 h-11 w-11 rounded-full bg-white/15 text-white flex items-center justify-center">
            <X className="w-6 h-6" />
          </button>
          <button type="button" aria-label="Previous" onClick={(e) => { e.stopPropagation(); setOpen((open - 1 + n) % n); }} className="absolute left-2 sm:left-6 h-11 w-11 rounded-full bg-white/15 text-white flex items-center justify-center">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <LightboxImage key={srcOf(list[open])} src={srcOf(list[open])} alt={list[open].title} frameClassName="relative mx-auto h-[82vh] w-full" />
            <p className="text-white/90 text-center text-sm font-bold mt-3">{list[open].title} <span className="text-white/50">· {open + 1} / {n}</span></p>
          </div>
          <button type="button" aria-label="Next" onClick={(e) => { e.stopPropagation(); setOpen((open + 1) % n); }} className="absolute right-2 sm:right-6 h-11 w-11 rounded-full bg-white/15 text-white flex items-center justify-center">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </section>
  );
}
