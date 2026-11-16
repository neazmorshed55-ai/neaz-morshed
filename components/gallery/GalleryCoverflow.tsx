"use client";

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import SiteImage from '../SiteImage';
import { imageSizeFromUrl } from '../../lib/image-src';

export interface CoverflowImage {
  src: string;
  alt: string;
}

/** Same rule the gallery grid uses to decide that an item is a plain picture. */
export function isPlainImageUrl(url: string): boolean {
  const isImage = /\.(jpg|jpeg|png|gif|webp|svg)(\?|$)/i.test(url) || url.includes('fbcdn.net') || url.includes('cdninstagram.com');
  const isPost = (url.includes('tiktok.com') && url.includes('/video/')) || (url.includes('facebook.com') && !url.includes('fbcdn.net')) || (url.includes('instagram.com') && !url.includes('cdninstagram.com'));
  return isImage && !isPost;
}

const H = 360; // card height in px (desktop); scaled down on small screens via CSS var

/**
 * 3D coverflow for the project gallery. Each card keeps the picture's own
 * shape, so nothing is cropped. Only CSS transforms are animated (no blur or
 * filters, which freeze iPhones) and only the nearest cards load an image.
 */
export default function GalleryCoverflow({ images, onOpen, wide = false }: { images: CoverflowImage[]; onOpen: (index: number) => void; wide?: boolean }) {
  const n = images.length;
  const [active, setActive] = useState(Math.floor(n / 2));
  const [ratios, setRatios] = useState<Record<number, number>>({});
  const drag = useRef<{ x: number; moved: boolean } | null>(null);
  const go = useCallback((d: number) => setActive((a) => (((a + d) % n) + n) % n), [n]);
  // shortest signed distance on a loop, so the last pictures sit on the left of the first
  const wrap = (d: number) => { let x = ((d % n) + n) % n; if (x > n / 2) x -= n; return x; };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (document.activeElement?.getAttribute('data-gcf') !== '1') return;
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'ArrowRight') go(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go]);

  const ratioOf = (i: number) => {
    const known = ratios[i] ?? (imageSizeFromUrl(images[i].src) ? imageSizeFromUrl(images[i].src)!.width / imageSizeFromUrl(images[i].src)!.height : 4 / 3);
    return Math.min(1.8, Math.max(0.55, known));
  };

  return (
    <div className="select-none">
      <div
        tabIndex={0}
        data-gcf="1"
        aria-roledescription="carousel"
        aria-label="Project gallery"
        className={`relative mx-auto outline-none touch-pan-y overflow-hidden ${wide ? 'h-[360px] sm:h-[520px]' : 'h-[330px] sm:h-[430px]'}`}
        style={{ perspective: '1300px', ['--cw' as string]: `min(calc(min(${wide ? 400 : 300}px, 62vw) * ${ratioOf(active)}), 64vw)` }}
        onPointerDown={(e) => { drag.current = { x: e.clientX, moved: false }; }}
        onPointerMove={(e) => { if (drag.current && Math.abs(e.clientX - drag.current.x) > 6) drag.current.moved = true; }}
        onPointerUp={(e) => {
          const d = drag.current; drag.current = null;
          if (d && Math.abs(e.clientX - d.x) > 40) go(e.clientX < d.x ? 1 : -1);
        }}
        onPointerCancel={() => { drag.current = null; }}
      >
        {images.map((img, i) => {
          const off = wrap(i - active);
          const abs = Math.abs(off);
          const show = abs <= 3;
          const r = ratioOf(i);
          const isCenter = off === 0;
          return (
            <button
              key={i}
              type="button"
              aria-label={img.alt}
              tabIndex={-1}
              onClick={() => {
                if (drag.current?.moved) return;
                setActive(i);
                onOpen(i);
              }}
              className="absolute left-1/2 top-1/2 block overflow-hidden rounded-2xl border border-line bg-white shadow-card transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                width: `min(calc(min(${wide ? 400 : 300}px, 62vw) * ${r}), 64vw)`,
                aspectRatio: String(r),
                transform: `translate(-50%, -50%) translateX(${off === 0 ? '0px' : `calc(${off > 0 ? 1 : -1} * (var(--cw) * 0.56 + ${24 + (abs - 1) * 52}px))`}) translateZ(${-abs * 90}px) rotateY(${isCenter ? 0 : off > 0 ? -32 : 32}deg) scale(${isCenter ? 1.08 : 0.94})`,
                opacity: show ? 1 - abs * 0.2 : 0,
                zIndex: 10 - abs,
                pointerEvents: show ? 'auto' : 'none',
                cursor: 'zoom-in',
              }}
            >
              {show && (
                <SiteImage
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 640px) 90vw, 760px"
                  className="object-contain"
                  onLoad={(e) => {
                    const el = e.currentTarget;
                    if (el.naturalWidth && el.naturalHeight) {
                      const nr = el.naturalWidth / el.naturalHeight;
                      setRatios((p) => (Math.abs((p[i] ?? 0) - nr) > 0.01 ? { ...p, [i]: nr } : p));
                    }
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-3 mt-4">
        <button type="button" onClick={() => go(-1)} aria-label="Previous" className="h-11 w-11 shrink-0 rounded-full border border-line bg-surface text-ink flex items-center justify-center hover:border-primary hover:text-primary disabled:opacity-30 transition">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-[60%]">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Image ${i + 1}`}
              onClick={() => setActive(i)}
              style={{ minWidth: 0, minHeight: 0 }}
              className="p-1.5 -m-0.5 group"
            >
              <span className={`block h-2 rounded-full transition-all duration-300 ${i === active ? 'w-7 bg-primary' : 'w-2 bg-line group-hover:bg-primary/40'}`} />
            </button>
          ))}
        </div>
        <button type="button" onClick={() => go(1)} aria-label="Next" className="h-11 w-11 shrink-0 rounded-full border border-line bg-surface text-ink flex items-center justify-center hover:border-primary hover:text-primary disabled:opacity-30 transition">
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
      <p className="text-center text-xs text-muted mt-3">Tap any image to view it full size</p>
    </div>
  );
}
