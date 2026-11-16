"use client";

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import GalleryCoverflow, { type CoverflowImage } from './GalleryCoverflow';

/**
 * Full-screen picture viewer: the same 3D coverflow (natural-shape cards,
 * swipe, arrows, dots) on a dark backdrop. Plain opacity + transforms only.
 */
export default function CoverflowViewer({ images, startIndex, onClose }: { images: CoverflowImage[]; startIndex: number; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90" onClick={onClose} role="dialog" aria-modal="true" aria-label="Project pictures">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        style={{ minWidth: 0, minHeight: 0 }}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 h-12 w-12 rounded-full bg-white/15 text-white flex items-center justify-center hover:bg-primary transition"
      >
        <X size={24} />
      </button>
      <div className="w-full max-w-5xl px-2" onClick={(e) => e.stopPropagation()}>
        <GalleryCoverflow images={images} startIndex={startIndex} wide hint={false} onOpen={() => {}} />
        <p className="text-center text-xs text-white/60 mt-3">Swipe or use the arrows · tap outside to close</p>
      </div>
    </div>
  );
}
