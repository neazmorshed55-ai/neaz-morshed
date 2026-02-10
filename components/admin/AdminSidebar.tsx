"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Briefcase,
  Award,
  Star,
  Settings,
  LogOut,
  Wrench,
  MessageSquare,
  ChevronLeft,
  Menu,
  Image,
  Mail,
  Users,
  FileText,
  Link as LinkIcon
} from 'lucide-react';
import { useAdminAuth } from '../../lib/admin-auth';

interface AdminSidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

const menuItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Media Library', href: '/admin/media', icon: Image },
  { name: 'Contacts', href: '/admin/contacts', icon: Mail },
  { name: 'Leads', href: '/admin/leads', icon: Users },
  { name: 'Resume', href: '/admin/resume', icon: FileText },
  { name: 'Services', href: '/admin/services', icon: Briefcase },
  { name: 'Experience', href: '/admin/experience', icon: Award },
  { name: 'Reviews', href: '/admin/reviews', icon: MessageSquare },
  { name: 'Skills', href: '/admin/skills', icon: Wrench },
  { name: 'Portfolio Items', href: '/admin/portfolio', icon: Star },
  { name: 'Footer Links', href: '/admin/footer', icon: LinkIcon },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminSidebar({ isCollapsed, setIsCollapsed }: AdminSidebarProps) {
  const pathname = usePathname();
  const { logout, user } = useAdminAuth();

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      className="fixed left-0 top-0 h-full bg-slate-900 border-r border-white/5 z-50 flex flex-col"
    >
      {/* Logo */}
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-[#2ecc71] rounded-xl flex items-center justify-center font-black text-slate-950">
              NM
            </div>
            <div>
              <h2 className="font-bold text-white text-sm">Admin Panel</h2>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">Portfolio Manager</p>
            </div>
          </motion.div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
        >
          {isCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== '/admin' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-[#2ecc71] text-slate-950 font-bold'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon size={20} className="flex-shrink-0" />
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm"
                >
                  {item.name}
                </motion.span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-white/5">
        {!isCollapsed && user && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 px-4"
          >
            <p className="text-xs text-slate-500 uppercase tracking-wider">Logged in as</p>
            <p className="text-sm text-white font-medium truncate">{user.username}</p>
          </motion.div>
        )}
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all w-full"
        >
          <LogOut size={20} className="flex-shrink-0" />
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm"
            >
              Logout
            </motion.span>
          )}
        </button>
      </div>
    </motion.aside>
  );
}
