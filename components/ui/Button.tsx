"use client";

import React from 'react';
import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

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
  const baseStyles = 'inline-flex items-center justify-center gap-3 rounded-2xl font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95';

  const variants = {
    primary: 'bg-[#2ecc71] text-slate-950 shadow-[0_20px_50px_rgba(46,204,113,0.3)]',
    secondary: 'bg-white/5 border border-white/10 text-white hover:bg-[#2ecc71]/10 hover:border-[#2ecc71]/30',
    ghost: 'text-slate-400 hover:text-[#2ecc71]',
  };

  const sizes = {
    sm: 'px-6 py-3 text-[10px]',
    md: 'px-10 py-5 text-sm',
    lg: 'px-14 py-6 text-sm',
  };

  const combinedClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  const content = (
    <>
      {children}
      {Icon && <Icon size={20} className="group-hover:translate-x-1 transition-transform" />}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={`${combinedClassName} group`} target={target} rel={target === '_blank' ? 'noopener noreferrer' : undefined}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={`${combinedClassName} group`}>
      {content}
    </button>
  );
}
