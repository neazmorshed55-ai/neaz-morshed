
import React from 'react';

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
