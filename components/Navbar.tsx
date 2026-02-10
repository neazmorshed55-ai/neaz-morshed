"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface NavItem {
  id: string;
  label: string;
  href: string;
  order_index: number;
  is_visible: boolean;
  is_button: boolean;
  open_in_new_tab: boolean;
}

interface SiteBranding {
  logo_text: string;
  site_name: string;
  tagline: string;
  logo_image_url: string | null;
  primary_color: string;
}

// Default navigation items (fallback if Supabase is not available)
const defaultNavItems: NavItem[] = [
  { id: '1', label: 'Home', href: '/', order_index: 1, is_visible: true, is_button: false, open_in_new_tab: false },
  { id: '2', label: 'Skills', href: '/skills', order_index: 2, is_visible: true, is_button: false, open_in_new_tab: false },
  { id: '3', label: 'Services', href: '/services', order_index: 3, is_visible: true, is_button: false, open_in_new_tab: false },
  { id: '4', label: 'Experience', href: '/experience', order_index: 4, is_visible: true, is_button: false, open_in_new_tab: false },
  { id: '5', label: 'Reviews', href: '/reviews', order_index: 5, is_visible: true, is_button: false, open_in_new_tab: false },
  // Contact link removed as per request
  { id: '8', label: 'Resume', href: '/resume', order_index: 8, is_visible: true, is_button: true, open_in_new_tab: false },
];

const defaultBranding: SiteBranding = {
  logo_text: 'NM',
  site_name: 'NEAZ MORSHED',
  tagline: 'Top Rated Pro',
  logo_image_url: null,
  primary_color: '#2ecc71',
};

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [navItems, setNavItems] = useState<NavItem[]>(defaultNavItems);
  const [branding, setBranding] = useState<SiteBranding>(defaultBranding);
  const pathname = usePathname();

  // Fetch navigation items from Supabase
  useEffect(() => {
    const fetchNavigation = async () => {
      if (!supabase) return;

      try {
        // Fetch navigation items
        const { data: navData, error: navError } = await supabase
          .from('navigation_items')
          .select('*')
          .eq('is_visible', true)
          .order('order_index', { ascending: true });

        if (!navError && navData && navData.length > 0) {
          // Filter out contact page link
          const filteredNavData = navData.filter(item => item.href !== '/contact');
          setNavItems(filteredNavData);
        }

        // Fetch site branding
        const { data: brandingData, error: brandingError } = await supabase
          .from('site_branding')
          .select('*')
          .limit(1)
          .single();

        if (!brandingError && brandingData) {
          setBranding(brandingData);
        }
      } catch (error) {
        console.log('Using default navigation');
      }
    };

    fetchNavigation();
  }, []);

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  // Separate regular nav items from button items
  const regularItems = navItems.filter(item => !item.is_button);
  const buttonItems = navItems.filter(item => item.is_button);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${isScrolled
          ? 'bg-[#0b0f1a]/90 backdrop-blur-2xl border-b border-white/5 py-4'
          : 'bg-transparent py-8'
          }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 flex justify-between items-center max-w-7xl">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 md:gap-4 group cursor-pointer">
            {branding.logo_image_url ? (
              <img
                src={branding.logo_image_url}
                alt={branding.site_name}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl object-cover group-hover:rotate-6 transition-all shadow-[0_0_30px_rgba(46,204,113,0.3)]"
              />
            ) : (
              <div
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center font-black text-sm sm:text-base text-slate-950 group-hover:rotate-6 transition-all shadow-[0_0_30px_rgba(46,204,113,0.3)]"
                style={{ backgroundColor: branding.primary_color }}
              >
                {branding.logo_text}
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-base sm:text-lg md:text-xl font-extrabold tracking-tighter leading-none text-white">
                {branding.site_name}
              </span>
              <span
                className="text-[9px] sm:text-[10px] font-bold tracking-[0.15em] sm:tracking-[0.2em] mt-0.5 sm:mt-1 uppercase"
                style={{ color: branding.primary_color }}
              >
                {branding.tagline}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-10">
            {regularItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                target={item.open_in_new_tab ? '_blank' : undefined}
                rel={item.open_in_new_tab ? 'noopener noreferrer' : undefined}
                className={`text-[11px] font-bold tracking-[0.3em] transition-all uppercase ${isActive(item.href) ? 'text-[#2ecc71]' : 'text-slate-400 hover:text-[#2ecc71]'
                  }`}
              >
                {item.label}
              </Link>
            ))}
            {buttonItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                target={item.open_in_new_tab ? '_blank' : undefined}
                rel={item.open_in_new_tab ? 'noopener noreferrer' : undefined}
                className={`px-8 py-4 rounded-2xl font-black text-[11px] tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg uppercase ${isActive(item.href)
                  ? 'bg-white text-slate-950 shadow-white/20'
                  : 'bg-[#2ecc71] text-slate-950 shadow-[#2ecc71]/20'
                  }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-[#2ecc71]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="lg:hidden fixed inset-0 bg-[#0b0f1a] z-[110] flex flex-col items-center justify-center gap-8 p-6"
          >
            <button
              className="absolute top-8 right-8 text-[#2ecc71]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X size={40} />
            </button>
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                target={item.open_in_new_tab ? '_blank' : undefined}
                rel={item.open_in_new_tab ? 'noopener noreferrer' : undefined}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-4xl font-black transition-colors uppercase tracking-tighter ${isActive(item.href) || item.is_button
                  ? 'text-[#2ecc71]'
                  : 'text-white hover:text-[#2ecc71]'
                  }`}
              >
                {item.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
