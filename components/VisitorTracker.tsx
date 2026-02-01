"use client";

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

// Generate a unique session ID
function generateSessionId() {
  return 'sess_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

// Get or create session ID from localStorage
function getSessionId() {
  if (typeof window === 'undefined') return null;

  let sessionId = sessionStorage.getItem('visitor_session_id');
  if (!sessionId) {
    sessionId = generateSessionId();
    sessionStorage.setItem('visitor_session_id', sessionId);
  }
  return sessionId;
}

export default function VisitorTracker() {
  const pathname = usePathname();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    // Avoid tracking the same page twice in a row
    if (lastTrackedPath.current === pathname) return;
    lastTrackedPath.current = pathname;

    const trackVisit = async () => {
      try {
        const sessionId = getSessionId();
        if (!sessionId) return;

        await fetch('/api/visitors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            page: pathname,
            referrer: document.referrer || null,
          }),
        });
      } catch (error) {
        // Silently fail - don't disrupt user experience
        console.debug('Visitor tracking error:', error);
      }
    };

    // Small delay to not block page rendering
    const timer = setTimeout(trackVisit, 100);
    return () => clearTimeout(timer);
  }, [pathname]);

  // This component doesn't render anything
  return null;
}
