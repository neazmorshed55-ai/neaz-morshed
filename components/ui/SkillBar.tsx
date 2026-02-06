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
        <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-400">
          {name}
        </span>
        <span className="text-[#2ecc71] font-black">{level}%</span>
      </div>
      <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          transition={{ duration: 1.5, ease: 'circOut' }}
          viewport={{ once: true }}
          className="h-full bg-[#2ecc71] rounded-full shadow-[0_0_20px_rgba(46,204,113,0.5)]"
        />
      </div>
    </div>
  );
}
