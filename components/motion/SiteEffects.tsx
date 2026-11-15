"use client";

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import { PRELOADER_SEEN_KEY } from './Preloader';

declare global {
  interface Window {
    __npRevealed?: boolean;
    __lenis?: Lenis;
  }
}

// Minimum time the intro stays up, measured from navigation start, so the
// letter animation can be read even when the page is already cached.
const PRELOADER_MIN_MS = 1350;
const PRELOADER_EXIT_MS = 1000;

const INTERACTIVE =
  'a, button, [role="button"], input, textarea, select, label, summary, [data-cursor="hover"]';

function revealPage() {
  window.__npRevealed = true;
  window.dispatchEvent(new Event('np:reveal'));
}

/** Plays the preloader exit, then unlocks scrolling and the page animations. */
function usePreloaderExit() {
  useEffect(() => {
    const root = document.documentElement;
    const el = document.getElementById('np-preloader');

    if (!el || root.classList.contains('np-seen') || root.classList.contains('np-done')) {
      root.classList.remove('np-loading');
      revealPage();
      return;
    }

    let exitTimer: ReturnType<typeof setTimeout>;
    const wait = Math.max(0, PRELOADER_MIN_MS - performance.now());

    const startTimer = setTimeout(() => {
      root.classList.add('np-exit');
      revealPage();
      exitTimer = setTimeout(() => {
        root.classList.add('np-done');
        root.classList.remove('np-loading', 'np-exit');
        try {
          sessionStorage.setItem(PRELOADER_SEEN_KEY, '1');
        } catch {
          /* private mode — the intro will simply show again next time */
        }
      }, PRELOADER_EXIT_MS);
    }, wait);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(exitTimer);
    };
  }, []);
}

/** Lenis smooth scrolling for mouse/trackpad. Touch keeps native scrolling. */
function useSmoothScroll(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.1,
      anchors: { offset: -100 },
      // Let inner scroll areas (chat window, modals, menus) scroll natively.
      prevent: (node: HTMLElement) => {
        if (node.hasAttribute?.('data-lenis-prevent')) return true;
        if (node === document.body || node === document.documentElement) return false;
        const style = window.getComputedStyle(node);
        const scrollable = /(auto|scroll)/.test(style.overflowY);
        return scrollable && node.scrollHeight > node.clientHeight + 1;
      },
    });
    window.__lenis = lenis;

    const root = document.documentElement;
    if (root.classList.contains('np-loading')) lenis.stop();
    const onReveal = () => lenis.start();
    window.addEventListener('np:reveal', onReveal);

    return () => {
      window.removeEventListener('np:reveal', onReveal);
      lenis.destroy();
      if (window.__lenis === lenis) delete window.__lenis;
    };
  }, [enabled]);
}

/** Dot + trailing ring that grows over anything clickable (desktop only). */
function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!finePointer || reduced) return;

    const root = document.documentElement;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const target = { x: -100, y: -100 };
    const ringPos = { x: -100, y: -100 };
    let frame = 0;
    let hovering = false;

    const render = () => {
      ringPos.x += (target.x - ringPos.x) * 0.18;
      ringPos.y += (target.y - ringPos.y) * 0.18;
      ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`;
      const settled =
        Math.abs(target.x - ringPos.x) < 0.1 && Math.abs(target.y - ringPos.y) < 0.1;
      frame = settled ? 0 : requestAnimationFrame(render);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      target.x = e.clientX;
      target.y = e.clientY;
      dot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      root.classList.add('np-cursor-on');

      const overInteractive = !!(e.target as Element | null)?.closest?.(INTERACTIVE);
      if (overInteractive !== hovering) {
        hovering = overInteractive;
        root.classList.toggle('np-cursor-hover', hovering);
      }
      if (!frame) frame = requestAnimationFrame(render);
    };
    const onDown = () => root.classList.add('np-cursor-down');
    const onUp = () => root.classList.remove('np-cursor-down');
    const onLeave = () => root.classList.remove('np-cursor-on');

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      root.classList.remove('np-cursor-on', 'np-cursor-hover', 'np-cursor-down');
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="np-cursor np-cursor--ring" aria-hidden="true" />
      <div ref={dotRef} className="np-cursor np-cursor--dot" aria-hidden="true" />
    </>
  );
}

/**
 * Site-wide motion layer: preloader exit, smooth scrolling and the custom
 * cursor. The admin area opts out of all of it.
 */
export default function SiteEffects() {
  const pathname = usePathname() || '';
  const isAdmin = pathname.startsWith('/admin');

  usePreloaderExit();
  useSmoothScroll(!isAdmin);

  return isAdmin ? null : <CustomCursor />;
}
