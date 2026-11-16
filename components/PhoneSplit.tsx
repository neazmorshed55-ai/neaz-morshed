import React from 'react';
import Link from 'next/link';
import { ArrowRight, Smartphone, Zap, Search } from 'lucide-react';
import { Reveal } from '@/components/motion/Reveal';
import { PhoneFrame, type PhoneItem } from './PhoneCoverflow';

/**
 * Split feature band: headline and call to action on the left, two tilted
 * phones on the right. Phones use the first two portfolio screenshots and
 * fall back to a branded placeholder when there are none.
 */
export default function PhoneSplit({
  items,
  primaryHref = '/services',
  primaryLabel = 'View Services',
  secondaryHref = '/skills/portfolio',
  secondaryLabel = 'See My Work',
}: {
  items: PhoneItem[];
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  const a = items?.[0];
  const b = items?.[1] ?? items?.[0];
  const pa = a ? a.thumbnail_url || a.image_url : null;
  const pb = b ? b.thumbnail_url || b.image_url : null;

  return (
    <section className="py-16 sm:py-24 bg-surface-2/60 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 max-w-7xl grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
        <div className="text-center lg:text-left">
          <Reveal y={16}>
            <span className="inline-flex items-center gap-3 text-primary text-[11px] font-extrabold uppercase tracking-[0.4em] mb-5">
              <span className="h-px w-8 bg-primary/60" />
              Built for every screen
            </span>
          </Reveal>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-[0.95] text-ink mb-6">
            Websites that <span className="text-gradient">feel fast</span> on every phone
          </h2>
          <Reveal y={20} delay={0.1}>
            <p className="text-body text-lg max-w-xl mx-auto lg:mx-0 mb-8">
              Clean, responsive, search-ready sites that load quickly and turn visitors into clients, from the first tap.
            </p>
          </Reveal>
          <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-9 text-sm font-bold text-ink">
            <span className="inline-flex items-center gap-2 rounded-full bg-surface border border-line px-4 py-2"><Smartphone className="w-4 h-4 text-primary" /> Mobile first</span>
            <span className="inline-flex items-center gap-2 rounded-full bg-surface border border-line px-4 py-2"><Zap className="w-4 h-4 text-primary" /> Fast loading</span>
            <span className="inline-flex items-center gap-2 rounded-full bg-surface border border-line px-4 py-2"><Search className="w-4 h-4 text-primary" /> SEO ready</span>
          </div>
          <div className="flex flex-wrap justify-center lg:justify-start gap-4">
            <Link href={primaryHref} className="group px-8 py-4 bg-primary text-white font-extrabold uppercase tracking-widest text-xs sm:text-sm rounded-2xl hover:bg-primary-dark transition active:scale-95 shadow-glow flex items-center gap-2">
              {primaryLabel}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href={secondaryHref} className="px-8 py-4 border-2 border-line text-ink font-extrabold uppercase tracking-widest text-xs sm:text-sm rounded-2xl hover:border-primary transition">
              {secondaryLabel}
            </Link>
          </div>
        </div>

        <div className="relative h-[420px] sm:h-[520px] flex items-center justify-center">
          <div className="absolute w-[85%] aspect-square np-orb [--c:87_119_255] [--a:0.28]" />
          <div className="absolute left-1/2 top-1/2 w-[170px] sm:w-[220px] -translate-x-[88%] -translate-y-[46%]">
            <Reveal y={40}>
              <div style={{ transform: 'rotate(-9deg)' }}>
                <PhoneFrame src={pa} alt={a?.title || 'Project'} sizes="(max-width: 640px) 170px, 220px" />
              </div>
            </Reveal>
          </div>
          <div className="absolute left-1/2 top-1/2 w-[170px] sm:w-[220px] -translate-x-[8%] -translate-y-[56%]">
            <Reveal y={60} delay={0.12}>
              <div style={{ transform: 'rotate(7deg)' }}>
                <PhoneFrame src={pb} alt={b?.title || 'Project'} sizes="(max-width: 640px) 170px, 220px" />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
