import './globals.css';
import React from 'react';
import type { Metadata } from 'next';

/**
 * Root Layout for the Next.js Portfolio.
 * This file serves as the main entry point for the App Router shell.
 */

export const metadata: Metadata = {
  metadataBase: new URL('https://neazmorshed.com'), // Replace with actual domain when live
  title: {
    default: 'Neaz Md. Morshed | Virtual Assistant & Outsourcing Expert',
    template: '%s | Neaz Md. Morshed'
  },
  description: 'Professional Virtual Assistant & Outsourcing Expert specializing in Web Design, Video Editing, Social Media Marketing, and Admin Support.',
  keywords: ['Virtual Assistant', 'Web Design', 'Video Editing', 'Social Media Marketing', 'Outsourcing', 'Neaz Morshed', 'Virtual Assistant BD'],
  authors: [{ name: 'Neaz Md. Morshed' }],
  creator: 'Neaz Md. Morshed',
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
    <html lang="en" className="scroll-smooth">
      <body className="bg-[#0b0f1a] text-slate-50 selection:bg-[#2ecc71] selection:text-slate-950 antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}