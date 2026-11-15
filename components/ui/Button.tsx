"use client";

import React from 'react';
import Link from 'next/link';
import { LucideIcon } from 'lucide-react';
import { Magnetic } from '@/components/motion/Reveal';

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  className?: string;
  target?: '_blank' | '_self';
}

export default function Button({
  children,
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  className = '',
  target = '_self',
}: ButtonProps) {
  const baseStyles =
    'relative inline-flex items-center justify-center gap-3 rounded-2xl font-extrabold uppercase tracking-widest transition-all duration-300 active:scale-95 overflow-hidden';

  const variants = {
    primary:
      'bg-primary text-white shadow-glow hover:bg-primary-dark hover:shadow-[0_22px_44px_-14px_rgba(61,91,239,0.65)]',
    secondary:
      'bg-white border border-line text-ink shadow-card hover:border-primary/40 hover:text-primary',
    ghost: 'text-body hover:text-primary',
  };

  const sizes = {
    sm: 'px-6 py-3 text-[10px]',
    md: 'px-9 py-4 text-xs sm:text-sm',
    lg: 'px-10 sm:px-12 py-5 text-xs sm:text-sm',
  };

  const combinedClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  const content = (
    <>
      <span className="relative z-10">{children}</span>
      {Icon && (
        <Icon
          size={18}
          className="relative z-10 transition-transform duration-300 group-hover:translate-x-1 group-hover:-rotate-45"
        />
      )}
    </>
  );

  const element = href ? (
    <Link
      href={href}
      className={`${combinedClassName} group`}
      target={target}
      rel={target === '_blank' ? 'noopener noreferrer' : undefined}
    >
      {content}
    </Link>
  ) : (
    <button onClick={onClick} className={`${combinedClassName} group`}>
      {content}
    </button>
  );

  // Primary calls-to-action get the magnetic hover from the Devix design.
  return variant === 'primary' ? <Magnetic strength={0.25}>{element}</Magnetic> : element;
}
