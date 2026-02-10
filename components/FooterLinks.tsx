"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

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

export default function FooterLinks() {
  const [links, setLinks] = useState<FooterLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
        <div className="h-4 w-16 bg-slate-800/50 rounded animate-pulse"></div>
        <div className="h-4 w-20 bg-slate-800/50 rounded animate-pulse"></div>
        <div className="h-4 w-18 bg-slate-800/50 rounded animate-pulse"></div>
        <div className="h-4 w-16 bg-slate-800/50 rounded animate-pulse"></div>
        <div className="h-4 w-14 bg-slate-800/50 rounded animate-pulse"></div>
        <div className="h-4 w-20 bg-slate-800/50 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
      {links.map((link) => (
        <a
          key={link.id}
          href={link.url}
          target={link.url.startsWith('http') ? '_blank' : undefined}
          rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
          className="text-slate-500 hover:text-[#2ecc71] transition-all uppercase text-[10px] font-bold tracking-widest"
        >
          {link.name}
        </a>
      ))}
    </div>
  );
}
