import './globals.css';
import React from 'react';
import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import VisitorTracker from '../components/VisitorTracker';
import Preloader, { PRELOADER_HEAD_SCRIPT } from '../components/motion/Preloader';
import SiteEffects from '../components/motion/SiteEffects';
import { SITE_URL } from '../lib/site';
import { SiteChromeProvider } from '../components/SiteChrome';
import { loadSiteChrome } from '../lib/site-chrome';
import JsonLd from '../components/JsonLd';
import { IS_PORTFOLIO_COPY } from '../lib/seo';

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
    // No url here: it would be inherited by every page and claim they are the homepage.
    title: 'Neaz Md. Morshed | Virtual Assistant & Outsourcing Expert',
    description: 'Expert Virtual Assistant & Outsourcing Professional. Scaling businesses with Web Design, Video Editing, and Digital Marketing services.',
    siteName: 'Neaz Md. Morshed',
    // Preview image comes from app/opengraph-image.tsx
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


const PERSON_ID = `${SITE_URL}/#person`;
const SITE_SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: 'Neaz Md. Morshed',
      inLanguage: 'en',
      publisher: { '@id': PERSON_ID },
    },
    {
      '@type': 'Person',
      '@id': PERSON_ID,
      name: 'Neaz Md. Morshed',
      jobTitle: 'Virtual Assistant & Outsourcing Expert',
      url: SITE_URL,
      image: process.env.NEXT_PUBLIC_SUPABASE_URL
        ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/profile.jpg`
        : undefined,
      email: 'contact@neazmdmorshed.com',
      address: { '@type': 'PostalAddress', addressCountry: 'BD' },
      knowsAbout: ['Virtual assistance', 'Outsourcing', 'Web design', 'Video editing', 'Social media marketing', 'Admin support'],
      ...(IS_PORTFOLIO_COPY
        ? {}
        : {
            sameAs: [
              'https://www.linkedin.com/in/neazmorshed222/',
              'https://www.facebook.com/neazmorshed001/',
              'https://www.fiverr.com/neaz222',
            ],
          }),
    },
    {
      '@type': 'ProfessionalService',
      '@id': `${SITE_URL}/#service`,
      name: 'Neaz Md. Morshed - Virtual Assistant & Outsourcing Services',
      url: SITE_URL,
      provider: { '@id': PERSON_ID },
      areaServed: 'Worldwide',
      serviceType: ['Virtual assistant', 'Web design', 'Video editing', 'Social media marketing', 'Admin support'],
    },
  ],
};

export default async function RootLayout({
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
        <JsonLd data={SITE_SCHEMA} />
        <Preloader />
        <SiteEffects />
        <VisitorTracker />
        <SiteChromeProvider value={await loadSiteChrome()}>{children}</SiteChromeProvider>
        {/* Portfolio variant: no WhatsApp button, chatbot or external scripts */}
      </body>
    </html>
  );
}
