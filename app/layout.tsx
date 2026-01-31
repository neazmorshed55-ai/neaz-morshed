
import React from 'react';

// RootLayout component for the application.
// Note: children is made optional to resolve the TypeScript error in index.tsx (line 15).
// In some environments, required 'children' props can cause issues with JSX element inference.
export default function RootLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <title>Neaz Md. Morshed | Virtual Assistant & Outsourcing Expert</title>
      </head>
      <body className="bg-[#0b0f1a] text-white antialiased overflow-x-hidden min-h-screen">
        {children}
      </body>
    </html>
  );
}
