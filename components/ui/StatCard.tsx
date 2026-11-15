"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: number;
  suffix?: string;
  icon?: LucideIcon;
  variant?: 'default' | 'highlight';
  duration?: number;
  children?: React.ReactNode;
}

export default function StatCard({
  label,
  value,
  suffix = '',
  icon: Icon,
  variant = 'default',
  duration = 2000,
  children,
}: StatCardProps) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const startTime = Date.now();
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(easeOut * value));
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };
          animate();
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, duration, hasAnimated]);

  const variants = {
    default: 'bg-surface border-line shadow-card',
    highlight: 'bg-gradient-to-br from-primary to-accent text-white border-transparent shadow-glow',
  };

  return (
    <motion.div
      ref={ref}
      whileHover={{ scale: 1.05, y: -5 }}
      className={`p-6 sm:p-8 lg:p-12 rounded-[3rem] sm:rounded-[4rem] border flex flex-col justify-center items-center text-center transition-all aspect-square ${variants[variant]}`}
    >
      {Icon && <Icon className={`w-8 h-8 sm:w-12 sm:h-12 mb-4 ${variant === 'highlight' ? 'text-white' : 'text-primary'}`} />}
      {children || (
        <>
          <div className={`text-3xl sm:text-4xl lg:text-5xl font-black mb-1 ${variant === 'default' ? 'text-ink' : ''}`}>
            {count.toLocaleString()}{suffix}
          </div>
          <div className={`text-[10px] font-black uppercase tracking-widest ${variant === 'highlight' ? 'opacity-80' : 'text-muted'}`}>
            {label}
          </div>
        </>
      )}
    </motion.div>
  );
}
