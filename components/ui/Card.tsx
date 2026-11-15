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
    default: 'bg-surface border border-line shadow-card',
    glass: 'bg-white/80 backdrop-blur-2xl border border-line shadow-card',
    solid: 'bg-surface border border-line shadow-card',
  };

  const hoverStyles = hover
    ? 'hover:border-primary/40 hover:shadow-card-hover cursor-pointer'
    : '';

  return (
    <motion.div
      whileHover={hover ? { y: -6 } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      onClick={onClick}
      className={`p-8 rounded-3xl transition-[border-color,box-shadow] duration-300 ${variants[variant]} ${hoverStyles} ${className}`}
    >
      {children}
    </motion.div>
  );
}
