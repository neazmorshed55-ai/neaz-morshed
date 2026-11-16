"use client";

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
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
 * 3D coverflow of phone-shaped cards. Pure CSS transforms (no blur or
 * backdrop filters, which freeze iPhones); only the cards near the centre
 * render an image, and every image is lazy-loaded and resized.
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
  const list = (items || []).slice(0, 12);
  const [active, setActive] = useState(Math.min(2, Math.max(0, list.length - 1)));
  const drag = useRef<{ x: number; moved: boolean } | null>(null);
  const n = list.length;

  const go = useCallback((d: number) => setActive((a) => Math.max(0, Math.min(n - 1, a + d))), [n]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = document.activeElement;
      if (el && el.getAttribute('data-coverflow') === '1') {
        if (e.key === 'ArrowLeft') go(-1);
        if (e.key === 'ArrowRight') go(1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go]);

  if (n === 0) return null;

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

        <div
          tabIndex={0}
          data-coverflow="1"
          aria-roledescription="carousel"
          aria-label="Project gallery"
          className="relative mx-auto h-[420px] sm:h-[520px] outline-none select-none touch-pan-y"
          style={{ perspective: '1400px' }}
          onPointerDown={(e) => { drag.current = { x: e.clientX, moved: false }; }}
          onPointerMove={(e) => { if (drag.current && Math.abs(e.clientX - drag.current.x) > 6) drag.current.moved = true; }}
          onPointerUp={(e) => {
            const d = drag.current; drag.current = null;
            if (d && Math.abs(e.clientX - d.x) > 40) go(e.clientX < d.x ? 1 : -1);
          }}
          onPointerCancel={() => { drag.current = null; }}
        >
          {list.map((item, i) => {
            const off = i - active;
            const abs = Math.abs(off);
            const show = abs <= 3;
            const src = item.thumbnail_url || item.image_url;
            return (
              <button
                key={item.id}
                type="button"
                aria-label={item.title}
                tabIndex={-1}
                onClick={() => { if (!drag.current?.moved) setActive(i); }}
                className="absolute left-1/2 top-1/2 w-[190px] sm:w-[240px] text-left transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{
                  transform: `translate(-50%, -50%) translateX(${off * 58}%) translateZ(${-abs * 130}px) rotateY(${off === 0 ? 0 : off > 0 ? -38 : 38}deg) scale(${off === 0 ? 1.12 : 1})`,
                  opacity: show ? 1 - abs * 0.18 : 0,
                  zIndex: 10 - abs,
                  pointerEvents: show ? 'auto' : 'none',
                  transformStyle: 'preserve-3d',
                }}
              >
                <PhoneFrame src={show ? src : null} alt={item.title} sizes="(max-width: 640px) 190px, 240px" />
              </button>
            );
          })}
        </div>

        <div className="mt-6 text-center min-h-[64px]">
          <h3 className="text-lg sm:text-xl font-black text-ink line-clamp-1">{list[active].title}</h3>
          {list[active].description && <p className="text-body text-sm mt-1 max-w-xl mx-auto line-clamp-2">{list[active].description}</p>}
        </div>

        <div className="flex items-center justify-center gap-4 mt-4">
          <button type="button" onClick={() => go(-1)} disabled={active === 0} aria-label="Previous" className="h-12 w-12 rounded-full border border-line bg-surface text-ink flex items-center justify-center hover:border-primary hover:text-primary disabled:opacity-30 transition">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <Link href={allHref} className="group px-7 py-3.5 bg-primary text-white font-extrabold uppercase tracking-widest text-xs rounded-2xl hover:bg-primary-dark transition active:scale-95 shadow-glow flex items-center gap-2">
            View All Projects
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <button type="button" onClick={() => go(1)} disabled={active === n - 1} aria-label="Next" className="h-12 w-12 rounded-full border border-line bg-surface text-ink flex items-center justify-center hover:border-primary hover:text-primary disabled:opacity-30 transition">
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
