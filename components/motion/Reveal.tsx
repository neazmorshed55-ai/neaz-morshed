"use client";

import React, { useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'framer-motion';

/**
 * True once the preloader starts lifting (or straight away when it was
 * skipped). Hero animations wait for this so they play in view.
 */
export function usePageRevealed() {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (window.__npRevealed) {
      setRevealed(true);
      return;
    }
    const onReveal = () => setRevealed(true);
    window.addEventListener('np:reveal', onReveal);
    const failsafe = setTimeout(onReveal, 4000);
    return () => {
      window.removeEventListener('np:reveal', onReveal);
      clearTimeout(failsafe);
    };
  }, []);

  return revealed;
}

type RevealTag = 'div' | 'section' | 'li' | 'span' | 'article' | 'p';

/*
 * Entrance animations are plain HTML + CSS: the server sends the content
 * visible, an inline script (REVEAL_RUNTIME in Preloader.tsx) hides it before
 * the first paint only when it can animate, then sets [data-in] on each
 * element as it scrolls into view. Nothing waits for React to load, and the
 * page stays readable with JavaScript off. See "Entrance reveals" in globals.css.
 */
const vars = (v: Record<string, string | number>) => v as React.CSSProperties;

interface RevealProps {
  children: React.ReactNode;
  as?: RevealTag;
  className?: string;
  delay?: number;
  /** Starting offset in px (positive = from below). */
  y?: number;
  x?: number;
  /** Kept for compatibility: everything above the fold plays when the intro lifts. */
  onLoad?: boolean;
  amount?: number;
}

/** Fade + slide in when the element scrolls into view (once). */
export function Reveal({ children, as = 'div', className, delay = 0, y = 40, x = 0 }: RevealProps) {
  const Tag = as;
  return (
    <Tag className={className} data-reveal="fade" style={vars({ '--rv-x': `${x}px`, '--rv-y': `${y}px`, '--rv-delay': `${delay}s` })}>
      {children}
    </Tag>
  );
}

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';

interface SplitTextProps {
  text: string;
  as?: HeadingTag;
  className?: string;
  /** Extra classes for every word (e.g. a gradient). */
  wordClassName?: string;
  delay?: number;
  stagger?: number;
  onLoad?: boolean;
}

/**
 * Devix-style heading reveal: every word slides up from behind a mask, with
 * a stagger. The full text stays in the DOM, so SEO and screen readers are
 * unaffected.
 */
export function SplitText({ text, as = 'span', className, wordClassName = '', delay = 0, stagger = 0.07 }: SplitTextProps) {
  const Tag = as;
  const words = (text || '').trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return <Tag className={className}>{text}</Tag>;

  return (
    <Tag
      className={className}
      aria-label={text}
      data-reveal="words"
      style={vars({ '--rv-delay': `${delay}s`, '--rv-stagger': `${stagger}s` })}
    >
      {words.map((w, i) => (
        <React.Fragment key={`${w}-${i}`}>
          <span aria-hidden="true" className="np-mask">
            <span className={`np-word ${wordClassName}`} style={vars({ '--i': i })}>
              {w}
            </span>
          </span>
          {i < words.length - 1 ? ' ' : null}
        </React.Fragment>
      ))}
    </Tag>
  );
}

interface ImageRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  onLoad?: boolean;
}

/** Wipes media in from the left (Devix "img-custom-anim-left"). */
export function ImageReveal({ children, className, delay = 0 }: ImageRevealProps) {
  return (
    <div className={className} data-reveal="wipe" style={vars({ '--rv-delay': `${delay}s` })}>
      {children}
    </div>
  );
}

/** Element drifts toward the cursor while hovered (desktop only). */
export function Magnetic({
  children,
  className,
  strength = 0.3,
}: {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  if (reduce) return <span className={className}>{children}</span>;

  const onMove = (e: React.PointerEvent<HTMLSpanElement>) => {
    if (e.pointerType !== 'mouse' || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span
      ref={ref}
      className={`inline-flex ${className || ''}`}
      style={{ x: sx, y: sy }}
      onPointerMove={onMove}
      onPointerLeave={reset}
    >
      {children}
    </motion.span>
  );
}
