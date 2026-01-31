import './globals.css';
import React from 'react';

/**
 * Root Layout for the Next.js Portfolio.
 * This file serves as the main entry point for the App Router shell.
 */
export default function RootLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <title>Neaz Md. Morshed | Virtual Assistant & Professional Outsourcer</title>
        <meta name="description" content="Professional Virtual Assistant & Outsourcing Expert Portfolio. Built with Next.js, Tailwind CSS, and Framer Motion." />
      </head>
      <body className="bg-[#0b0f1a] text-slate-50 selection:bg-[#2ecc71] selection:text-slate-950 antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}