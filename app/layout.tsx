import React from 'react';

/**
 * Root Layout for Next.js App Router.
 * This file defines the shell of the application.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-[#0b0f1a] text-white antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
