"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Briefcase, Award, MessageSquare, Wrench, Star,
  TrendingUp, ExternalLink, Plus, ArrowRight, Loader2, BookOpen,
  BarChart3, Users
} from 'lucide-react';
import ProtectedRoute from '../../components/admin/ProtectedRoute';
import { supabase } from '../../lib/supabase';

interface Stats {
  services: number;
  experiences: number;
  reviews: number;
  skills: number;
  portfolioItems: number;
  blogs: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    services: 0,
    experiences: 0,
    reviews: 0,
    skills: 0,
    portfolioItems: 0,
    blogs: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      if (!supabase) {
        // Default counts if Supabase is not connected
        setStats({
          services: 7,
          experiences: 29,
          reviews: 15,
          skills: 25,
          portfolioItems: 44,
          blogs: 5
        });
        setLoading(false);
        return;
      }

      try {
        const [servicesRes, experiencesRes, reviewsRes, skillsRes, portfolioRes, blogsRes] = await Promise.all([
          supabase.from('services').select('id', { count: 'exact', head: true }),
          supabase.from('experiences').select('id', { count: 'exact', head: true }),
          supabase.from('reviews').select('id', { count: 'exact', head: true }),
          supabase.from('skills').select('id', { count: 'exact', head: true }),
          supabase.from('portfolio_items').select('id', { count: 'exact', head: true }),
          supabase.from('blogs').select('id', { count: 'exact', head: true })
        ]);


        setStats({
          services: servicesRes.count || 7,
          experiences: experiencesRes.count || 29,
          reviews: reviewsRes.count || 15,
          skills: skillsRes.count || 25,
          portfolioItems: portfolioRes.count || 44,
          blogs: blogsRes.count || 5
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }

      setLoading(false);
    }

    fetchStats();
  }, []);

  const statCards = [
    { name: 'Services', count: stats.services, icon: Briefcase, href: '/admin/services', color: '#2ecc71' },
    { name: 'Experiences', count: stats.experiences, icon: Award, href: '/admin/experience', color: '#3498db' },
    { name: 'Reviews', count: stats.reviews, icon: MessageSquare, href: '/admin/reviews', color: '#9b59b6' },
    { name: 'Skills', count: stats.skills, icon: Wrench, href: '/admin/skills', color: '#e74c3c' },
    { name: 'Portfolio Items', count: stats.portfolioItems, icon: Star, href: '/admin/portfolio', color: '#f39c12' },
    { name: 'Blogs', count: stats.blogs, icon: BookOpen, href: '/admin/blog', color: '#e84393' },
  ];

  const analyticsCards = [
    { name: 'Analytics', description: 'View visitor stats & locations', icon: BarChart3, href: '/admin/analytics', color: '#00d4ff' },
    { name: 'Leads', description: 'Manage chatbot leads', icon: Users, href: '/admin/leads', color: '#ff6b6b' },
  ];

  const quickActions = [
    { name: 'Add Service', href: '/admin/services/new', icon: Briefcase },
    { name: 'Add Experience', href: '/admin/experience/new', icon: Award },
    { name: 'Add Review', href: '/admin/reviews/new', icon: MessageSquare },
    { name: 'Add Skill', href: '/admin/skills/new', icon: Wrench },
    { name: 'Add Blog Post', href: '/admin/blog', icon: BookOpen },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white uppercase tracking-tight mb-2">Dashboard</h1>
          <p className="text-slate-400">Welcome back! Here's an overview of your portfolio.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={stat.href}
                  className="block bg-slate-900/60 border border-white/5 rounded-2xl p-6 hover:border-white/20 transition-all group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="p-3 rounded-xl"
                      style={{ backgroundColor: `${stat.color}20` }}
                    >
                      <Icon size={24} style={{ color: stat.color }} />
                    </div>
                    <ArrowRight size={18} className="text-slate-600 group-hover:text-slate-400 group-hover:translate-x-1 transition-all" />
                  </div>
                  <div>
                    {loading ? (
                      <Loader2 className="w-6 h-6 text-slate-600 animate-spin" />
                    ) : (
                      <p className="text-3xl font-black text-white mb-1">{stat.count}</p>
                    )}
                    <p className="text-sm text-slate-500 font-medium">{stat.name}</p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Analytics & Leads */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-white mb-4">Analytics & Leads</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analyticsCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <Link
                    href={card.href}
                    className="flex items-center gap-5 bg-gradient-to-r from-slate-900/80 to-slate-800/40 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all group"
                  >
                    <div
                      className="p-4 rounded-2xl"
                      style={{ backgroundColor: `${card.color}20` }}
                    >
                      <Icon size={28} style={{ color: card.color }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white group-hover:text-[#2ecc71] transition-colors">{card.name}</h3>
                      <p className="text-sm text-slate-500">{card.description}</p>
                    </div>
                    <ArrowRight size={20} className="text-slate-600 group-hover:text-[#2ecc71] group-hover:translate-x-1 transition-all" />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.div
                  key={action.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <Link
                    href={action.href}
                    className="flex items-center gap-3 bg-slate-900/40 border border-white/5 rounded-xl px-5 py-4 hover:bg-[#2ecc71] hover:text-slate-950 text-slate-400 transition-all group"
                  >
                    <Plus size={18} />
                    <span className="font-medium text-sm">{action.name}</span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Live Website */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-slate-900/60 border border-white/5 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Live Website</h2>
              <a
                href="https://neaz-morshed.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#2ecc71] hover:underline text-sm font-medium"
              >
                <ExternalLink size={16} />
                Visit Site
              </a>
            </div>
            <div className="space-y-3">
              <a
                href="https://neaz-morshed.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-colors"
              >
                <span className="text-slate-300">Homepage</span>
                <ExternalLink size={16} className="text-slate-500" />
              </a>
              <a
                href="https://neaz-morshed.vercel.app/services"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-colors"
              >
                <span className="text-slate-300">Services</span>
                <ExternalLink size={16} className="text-slate-500" />
              </a>
              <a
                href="https://neaz-morshed.vercel.app/experience"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-colors"
              >
                <span className="text-slate-300">Experience</span>
                <ExternalLink size={16} className="text-slate-500" />
              </a>
              <a
                href="https://neaz-morshed.vercel.app/reviews"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-colors"
              >
                <span className="text-slate-300">Reviews</span>
                <ExternalLink size={16} className="text-slate-500" />
              </a>
            </div>
          </motion.div>

          {/* System Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-slate-900/60 border border-white/5 rounded-2xl p-6"
          >
            <h2 className="text-xl font-bold text-white mb-6">System Status</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-[#2ecc71] rounded-full animate-pulse"></div>
                  <span className="text-slate-300">Website Status</span>
                </div>
                <span className="text-[#2ecc71] text-sm font-medium">Online</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${supabase ? 'bg-[#2ecc71] animate-pulse' : 'bg-yellow-500'}`}></div>
                  <span className="text-slate-300">Database</span>
                </div>
                <span className={`text-sm font-medium ${supabase ? 'text-[#2ecc71]' : 'text-yellow-500'}`}>
                  {supabase ? 'Connected' : 'Using Defaults'}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-[#2ecc71] rounded-full animate-pulse"></div>
                  <span className="text-slate-300">Hosting</span>
                </div>
                <span className="text-[#2ecc71] text-sm font-medium">Vercel</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <TrendingUp size={16} className="text-[#2ecc71]" />
                  <span className="text-slate-300">Performance</span>
                </div>
                <span className="text-[#2ecc71] text-sm font-medium">Excellent</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
