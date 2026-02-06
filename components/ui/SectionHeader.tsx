"use client";

import React from 'react';

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

  return (
    <div className={`mb-20 ${alignments[align]} ${className}`}>
      {subtitle && (
        <span className="text-[#2ecc71] text-[11px] font-black uppercase tracking-[0.5em] mb-6 block">
          {subtitle}
        </span>
      )}
      <h2 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-none">
        {title}
      </h2>
      {description && (
        <p className="text-slate-400 mt-6 max-w-2xl mx-auto">
          {description}
        </p>
      )}
    </div>
  );
}
