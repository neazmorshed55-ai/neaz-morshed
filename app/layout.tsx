import './globals.css';
import React from 'react';
import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import VisitorTracker from '../components/VisitorTracker';
import Preloader, { PRELOADER_HEAD_SCRIPT } from '../components/motion/Preloader';
import SiteEffects from '../components/motion/SiteEffects';
import { SITE_URL } from '../lib/site';

// Self-hosted variable font: no request to Google at runtime or build time.
const urbanist = localFont({
  src: './fonts/Urbanist-Variable-Latin.woff2',
  weight: '100 900',
  style: 'normal',
  display: 'swap',
  variable: '--font-urbanist',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#F8F9FF',
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
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
  // No site-wide canonical here: a canonical set in the root layout is
  // inherited by every page and would mark them all as copies of the homepage.
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
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
    <html lang="en" className={urbanist.variable} suppressHydrationWarning>
      <head>
        {/* Decides before first paint whether the intro preloader shows */}
        <script dangerouslySetInnerHTML={{ __html: PRELOADER_HEAD_SCRIPT }} />
        <noscript>
          <style>{'.np-preloader{display:none!important}html.np-loading,html.np-loading body{overflow:auto!important}'}</style>
        </noscript>
      </head>
      <body className="font-sans bg-page text-ink antialiased overflow-x-hidden">
        <Preloader />
        <SiteEffects />
        <VisitorTracker />
        {children}
        {/* Portfolio variant: no WhatsApp button, chatbot or external scripts */}
      </body>
    </html>
  );
}
