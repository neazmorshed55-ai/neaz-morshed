"use client";

import React from 'react';
import { Reveal, SplitText } from '@/components/motion/Reveal';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export default function SectionHeader({
  title,
  subtitle,
  description,
  align = 'center',
  className = '',
}: SectionHeaderProps) {
  const alignments = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };
  const labelAlign = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  };

  return (
    <div className={`mb-14 sm:mb-20 ${alignments[align]} ${className}`}>
      {subtitle && (
        <Reveal y={16}>
          <span
            className={`flex items-center gap-3 ${labelAlign[align]} text-primary text-[11px] font-extrabold uppercase tracking-[0.4em] mb-5`}
          >
            <span className="h-px w-8 bg-primary/60" />
            {subtitle}
            {align === 'center' && <span className="h-px w-8 bg-primary/60" />}
          </span>
        </Reveal>
      )}
      <SplitText
        as="h2"
        text={title}
        className="text-4xl sm:text-5xl lg:text-7xl font-black uppercase tracking-tight leading-[0.95] text-ink"
      />
      {description && (
        <Reveal y={20} delay={0.15}>
          <p className={`text-body mt-6 max-w-2xl leading-relaxed ${align === 'center' ? 'mx-auto' : ''}`}>
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}
