"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAdminAuth } from '../../lib/admin-auth';
import AdminSidebar from './AdminSidebar';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0b0f1a] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#2ecc71] animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0b0f1a]">
      <AdminSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <main
        className="transition-all duration-300"
        style={{ marginLeft: isCollapsed ? 80 : 280 }}
      >
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
