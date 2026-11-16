"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useSiteChrome } from './SiteChrome';

interface FooterLink {
  id: string;
  name: string;
  url: string;
  order_index: number;
  is_active: boolean;
}

const defaultLinks = [
  { name: 'Blog', url: '/blog' },
];

const defaultLinkRows = (): FooterLink[] =>
  defaultLinks.map((link, index) => ({ id: `default-${index}`, ...link, order_index: index + 1, is_active: true }));

export default function FooterLinks() {
  const chrome = useSiteChrome();
  // Loaded on the server with the page (root layout); the browser query below is only a fallback.
  const fromServer = chrome ? ((chrome.footerLinks as unknown as FooterLink[] | null) ?? defaultLinkRows()) : null;
  const [links, setLinks] = useState<FooterLink[]>(fromServer ?? []);
  const [loading, setLoading] = useState(!fromServer);

  useEffect(() => {
    if (fromServer) return;
    async function fetchLinks() {
      if (!supabase) {
        // Use default links if Supabase is not configured
        setLinks(defaultLinks.map((link, index) => ({
          id: `default-${index}`,
          ...link,
          order_index: index + 1,
          is_active: true
        })));
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('footer_links')
          .select('*')
          .eq('is_active', true)
          .order('order_index', { ascending: true });

        if (error) throw error;

        if (data && data.length > 0) {
          setLinks(data);
        } else {
          // Use default links if no data in Supabase
          setLinks(defaultLinks.map((link, index) => ({
            id: `default-${index}`,
            ...link,
            order_index: index + 1,
            is_active: true
          })));
        }
      } catch (error) {
        console.error('Error fetching footer links:', error);
        // Use default links on error
        setLinks(defaultLinks.map((link, index) => ({
          id: `default-${index}`,
          ...link,
          order_index: index + 1,
          is_active: true
        })));
      } finally {
        setLoading(false);
      }
    }

    fetchLinks();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
        <div className="h-4 w-16 bg-surface-2 rounded animate-pulse"></div>
        <div className="h-4 w-20 bg-surface-2 rounded animate-pulse"></div>
        <div className="h-4 w-18 bg-surface-2 rounded animate-pulse"></div>
        <div className="h-4 w-16 bg-surface-2 rounded animate-pulse"></div>
        <div className="h-4 w-14 bg-surface-2 rounded animate-pulse"></div>
        <div className="h-4 w-20 bg-surface-2 rounded animate-pulse"></div>
      </div>
    );
  }

  return null;

}
