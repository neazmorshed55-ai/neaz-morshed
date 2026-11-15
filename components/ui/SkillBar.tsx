"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface SkillBarProps {
  name: string;
  level: number;
}

export default function SkillBar({ name, level }: SkillBarProps) {
  return (
    <div>
      <div className="flex justify-between mb-4">
        <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-ink">
          {name}
        </span>
        <span className="text-primary font-black">{level}%</span>
      </div>
      <div className="h-1.5 w-full bg-surface-2 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          transition={{ duration: 1.5, ease: 'circOut' }}
          viewport={{ once: true }}
          className="h-full bg-gradient-to-r from-primary to-accent rounded-full shadow-[0_0_16px_rgba(87,119,255,0.45)]"
        />
      </div>
    </div>
  );
}
