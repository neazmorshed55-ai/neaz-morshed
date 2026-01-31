
import React from 'react';

// Using optional children to resolve "Property 'children' is missing" errors in certain build environments
export default function RootLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0b0f1a]">
      {children}
    </div>
  );
}
