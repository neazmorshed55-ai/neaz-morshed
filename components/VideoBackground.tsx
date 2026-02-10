"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface VideoBackgroundProps {
  type: 'skills' | 'services' | 'experience' | 'reviews' | 'contact' | 'calendar';
  opacity?: number;
}

// Animated gradient backgrounds for different page types (replacing external videos)
const gradientBackgrounds: Record<string, string> = {
  skills: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // Purple tech gradient
  services: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', // Pink to red
  experience: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', // Blue gradient
  reviews: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', // Green to cyan
  contact: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', // Pink to yellow
  calendar: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)', // Cyan to purple
};

export default function VideoBackground({ type, opacity = 0.3 }: VideoBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.1, 1.2]);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden z-0">
      {/* Animated Gradient Background (replacing video) */}
      <motion.div
        style={{
          y,
          scale,
          background: gradientBackgrounds[type],
          opacity
        }}
        className="absolute inset-0 w-full h-full"
      />

      {/* Dark Overlay for "Dark Overlay Effect" */}
      <div className="absolute inset-0 bg-[#0b0f1a]/80" />

      {/* Gradient Overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f1a] via-[#0b0f1a]/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0b0f1a] via-transparent to-[#0b0f1a]/40" />

      {/* Subtle color tint based on brand */}
      <div className="absolute inset-0 bg-[#2ecc71]/5 mix-blend-overlay" />
    </div>
  );
}
