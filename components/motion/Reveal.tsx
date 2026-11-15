"use client";

import React, { useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'framer-motion';

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

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

const MOTION_TAGS = {
  div: motion.div,
  section: motion.section,
  li: motion.li,
  span: motion.span,
  article: motion.article,
  p: motion.p,
} as const;

interface RevealProps {
  children: React.ReactNode;
  as?: RevealTag;
  className?: string;
  delay?: number;
  /** Starting offset in px (positive = from below). */
  y?: number;
  x?: number;
  /** Play when the page is revealed instead of when scrolled into view. */
  onLoad?: boolean;
  amount?: number;
}

/** Fade + slide in when the element scrolls into view (once). */
export function Reveal({
  children,
  as = 'div',
  className,
  delay = 0,
  y = 40,
  x = 0,
  onLoad = false,
  amount = 0.15,
}: RevealProps) {
  const reduce = useReducedMotion();
  const revealed = usePageRevealed();
  const Tag = MOTION_TAGS[as];

  if (reduce) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }

  const hidden = { opacity: 0, y, x };
  const shown = { opacity: 1, y: 0, x: 0 };
  const transition = { duration: 0.9, ease: EASE_OUT, delay };

  return onLoad ? (
    <Tag className={className} initial={hidden} animate={revealed ? shown : hidden} transition={transition}>
      {children}
    </Tag>
  ) : (
    <Tag
      className={className}
      initial={hidden}
      whileInView={shown}
      viewport={{ once: true, amount }}
      transition={transition}
    >
      {children}
    </Tag>
  );
}

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';

const MOTION_TEXT_TAGS = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  h4: motion.h4,
  p: motion.p,
  span: motion.span,
  div: motion.div,
} as const;

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
 * Devix-style heading reveal: every word slides up from behind a mask.
 * The whole heading is observed (a masked word is never "in view" on its
 * own), and the words follow with a stagger. The full text stays in the
 * DOM, so SEO and screen readers are unaffected.
 */
export function SplitText({
  text,
  as = 'span',
  className,
  wordClassName = '',
  delay = 0,
  stagger = 0.07,
  onLoad = false,
}: SplitTextProps) {
  const reduce = useReducedMotion();
  const revealed = usePageRevealed();
  const words = (text || '').trim().split(/\s+/).filter(Boolean);

  if (reduce || words.length === 0) {
    const Plain = as;
    return <Plain className={className}>{text}</Plain>;
  }

  const Tag = MOTION_TEXT_TAGS[as];
  const word = {
    hidden: { y: '115%', rotate: 4 },
    show: (i: number) => ({
      y: '0%',
      rotate: 0,
      transition: { duration: 0.9, ease: EASE_OUT, delay: delay + i * stagger },
    }),
  };
  const trigger = onLoad
    ? { initial: 'hidden', animate: revealed ? 'show' : 'hidden' }
    : { initial: 'hidden', whileInView: 'show', viewport: { once: true, amount: 0.3 } };

  return (
    <Tag className={className} aria-label={text} {...trigger}>
      {words.map((w, i) => (
        <React.Fragment key={`${w}-${i}`}>
          <span
            aria-hidden="true"
            className="inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em]"
          >
            <motion.span
              className={`inline-block will-change-transform ${wordClassName}`}
              variants={word}
              custom={i}
            >
              {w}
            </motion.span>
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
export function ImageReveal({ children, className, delay = 0, onLoad = false }: ImageRevealProps) {
  const reduce = useReducedMotion();
  const revealed = usePageRevealed();

  if (reduce) return <div className={className}>{children}</div>;

  const hidden = { clipPath: 'inset(0% 100% 0% 0%)', scale: 1.06 };
  const shown = { clipPath: 'inset(0% 0% 0% 0%)', scale: 1 };
  const transition = { duration: 1.3, ease: [0.77, 0, 0.175, 1] as [number, number, number, number], delay };

  return onLoad ? (
    <motion.div className={className} initial={hidden} animate={revealed ? shown : hidden} transition={transition}>
      {children}
    </motion.div>
  ) : (
    <motion.div
      className={className}
      initial={hidden}
      whileInView={shown}
      viewport={{ once: true, amount: 0.25 }}
      transition={transition}
    >
      {children}
    </motion.div>
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
