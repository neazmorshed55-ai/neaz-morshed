import './globals.css';
import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import dynamic from 'next/dynamic';
import VisitorTracker from '../components/VisitorTracker';

// Lazy load heavy components to improve initial page load
// WhatsAppButton & AIChatbot imports removed

// Optimized font loading - preloads and serves locally
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

/**
 * Root Layout for the Next.js Portfolio.
 * This file serves as the main entry point for the App Router shell.
 */

// Viewport configuration for responsive design
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#2ecc71',
};
export const metadata: Metadata = {
  metadataBase: new URL('https://neazmorshed.com'),
  title: {
    default: 'Neaz Md. Morshed | Virtual Assistant & Outsourcing Expert',
    template: '%s | Neaz Md. Morshed'
  },
  description: 'Professional Virtual Assistant & Outsourcing Expert specializing in Web Design, Video Editing, Social Media Marketing, and Admin Support.',
  keywords: ['Virtual Assistant', 'Web Design', 'Video Editing', 'Social Media Marketing', 'Outsourcing', 'Neaz Morshed', 'Virtual Assistant BD'],
  authors: [{ name: 'Neaz Md. Morshed' }],
  creator: 'Neaz Md. Morshed',
  icons: {
    icon: '/icon',
    apple: '/apple-icon',
  },
  // Canonical URL - prevents duplicate content issues
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://neazmorshed.com',
    title: 'Neaz Md. Morshed | Virtual Assistant & Outsourcing Expert',
    description: 'Expert Virtual Assistant & Outsourcing Professional. Scaling businesses with Web Design, Video Editing, and Digital Marketing services.',
    siteName: 'Neaz Md. Morshed Portfolio',
    images: [
      {
        url: '/og-image.jpg', // Ensure this exists or use a generic one
        width: 1200,
        height: 630,
        alt: 'Neaz Md. Morshed Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Neaz Md. Morshed | Virtual Assistant & Outsourcing Expert',
    description: 'Expert Virtual Assistant & Outsourcing Professional. Scaling businesses with Web Design, Video Editing, and Digital Marketing services.',
    creator: '@neazmorshed222', // Updated from Medium handle
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <html lang="en" className={`scroll-smooth ${inter.variable}`}>
      <body className={`${inter.className} bg-[#0b0f1a] text-slate-50 selection:bg-[#2ecc71] selection:text-slate-950 antialiased overflow-x-hidden`}>
        <VisitorTracker />
        {children}
        {/* All external scripts removed for Upwork portfolio */}
      </body>
    </html>
  );
}