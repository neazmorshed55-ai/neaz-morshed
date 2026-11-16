"use client";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';

const AIChatbot = dynamic(() => import('./AIChatbot'), { ssr: false });

/**
 * The chatbot is not needed for the first paint, so its code is only
 * downloaded once the browser is idle (or after a few seconds at most).
 */
export default function LazyChatbot() {
  const [ready, setReady] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    const start = () => setReady(true);

    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(start, { timeout: 4000 });
      return () => w.cancelIdleCallback?.(id);
    }
    const timer = setTimeout(start, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Visitor-facing only: it would cover buttons in the admin.
  if (pathname?.startsWith('/admin')) return null;
  return ready ? <AIChatbot /> : null;
}
