"use client";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const AIChatbot = dynamic(() => import('./AIChatbot'), { ssr: false });

/**
 * The chatbot is not needed for the first paint, so its code is only
 * downloaded once the browser is idle (or after a few seconds at most).
 */
export default function LazyChatbot() {
  const [ready, setReady] = useState(false);

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

  return ready ? <AIChatbot /> : null;
}
