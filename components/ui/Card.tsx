"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'glass' | 'solid';
  hover?: boolean;
  className?: string;
  onClick?: () => void;
}

export default function Card({
  children,
  variant = 'default',
  hover = true,
  className = '',
  onClick,
}: CardProps) {
  const variants = {
    default: 'bg-slate-900/40 border border-white/5',
    glass: 'bg-white/5 backdrop-blur-2xl border border-white/10',
    solid: 'bg-slate-900 border border-white/5',
  };

  const hoverStyles = hover
    ? 'hover:border-[#2ecc71]/40 hover:bg-slate-900 cursor-pointer'
    : '';

  return (
    <motion.div
      whileHover={hover ? { scale: 1.02, y: -5 } : {}}
      onClick={onClick}
      className={`p-8 rounded-3xl transition-all ${variants[variant]} ${hoverStyles} ${className}`}
    >
      {children}
    </motion.div>
  );
}
