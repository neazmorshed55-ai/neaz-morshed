"use client";

import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'full';
}

export default function Container({
  children,
  className = '',
  size = 'lg',
}: ContainerProps) {
  const sizes = {
    sm: 'max-w-4xl',
    md: 'max-w-6xl',
    lg: 'max-w-7xl',
    full: 'max-w-full',
  };

  return (
    <div className={`container mx-auto px-4 sm:px-6 lg:px-12 ${sizes[size]} ${className}`}>
      {children}
    </div>
  );
}
