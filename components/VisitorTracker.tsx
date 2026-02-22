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

        // Extract source from URL or detect from referrer
        const urlParams = new URLSearchParams(window.location.search);
        let source = urlParams.get('ref') || urlParams.get('source') || urlParams.get('utm_source');

        if (!source && document.referrer) {
          const referrer = document.referrer.toLowerCase();
          if (referrer.includes('upwork.com')) source = 'Upwork';
          else if (referrer.includes('linkedin.com')) source = 'LinkedIn';
          else if (referrer.includes('facebook.com') || referrer.includes('fb.me')) source = 'Facebook';
          else if (referrer.includes('instagram.com')) source = 'Instagram';
          else if (referrer.includes('whatsapp.com') || referrer.includes('wa.me')) source = 'WhatsApp';
          else if (referrer.includes('tiktok.com')) source = 'TikTok';
          else if (referrer.includes('reddit.com')) source = 'Reddit';
          else if (referrer.includes('t.co') || referrer.includes('twitter.com') || referrer.includes('x.com')) source = 'X (Twitter)';
        }

        await fetch('/api/visitors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            page: pathname,
            referrer: document.referrer || null,
            source: source || null,
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
