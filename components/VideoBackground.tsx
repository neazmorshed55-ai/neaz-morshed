"use client";

import React from 'react';

interface VideoBackgroundProps {
  type: 'skills' | 'services' | 'experience' | 'reviews' | 'contact' | 'calendar';
  /** Kept for API compatibility with the old video version. */
  opacity?: number;
}

// Each page gets a slightly different soft glow so headers don't all look alike.
const glows: Record<VideoBackgroundProps['type'], { a: string; b: string }> = {
  skills: { a: '20% 10%', b: '85% 60%' },
  services: { a: '80% 0%', b: '10% 70%' },
  experience: { a: '15% 20%', b: '90% 40%' },
  reviews: { a: '70% 10%', b: '20% 80%' },
  contact: { a: '85% 15%', b: '15% 60%' },
  calendar: { a: '50% 0%', b: '50% 90%' },
};

/**
 * Light decorative header background.
 *
 * This used to stream a full-screen 2560px stock video behind every page
 * header (tens of MB per page). It is now pure CSS: same props, no download.
 */
export default function VideoBackground({ type }: VideoBackgroundProps) {
  const glow = glows[type] || glows.services;

  return (
    <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none" aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(55% 55% at ${glow.a}, rgba(87, 119, 255, 0.16) 0%, rgba(87, 119, 255, 0) 70%),
            radial-gradient(45% 45% at ${glow.b}, rgba(98, 93, 245, 0.12) 0%, rgba(98, 93, 245, 0) 70%),
            linear-gradient(180deg, #FFFFFF 0%, #F8F9FF 100%)`,
        }}
      />
      <div className="absolute inset-0 bg-dots opacity-60 [mask-image:radial-gradient(70%_60%_at_50%_30%,#000_0%,transparent_100%)]" />
      <div className="absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full border border-primary/10 animate-subtle-pulse" />
      <div className="absolute -bottom-32 -left-20 w-[360px] h-[360px] rounded-full border border-accent/10 animate-subtle-pulse" />
    </div>
  );
}
