"use client";

import React from 'react';
import { AdminAuthProvider } from '../../lib/admin-auth';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthProvider>
      {/* The public site is light now; the admin keeps its original dark look. */}
      <div className="min-h-screen bg-[#0b0f1a] text-slate-50 selection:bg-[#2ecc71] selection:text-slate-950">
        {children}
      </div>
    </AdminAuthProvider>
  );
}
