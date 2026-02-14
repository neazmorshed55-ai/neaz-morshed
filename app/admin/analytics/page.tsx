"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users, Globe, MapPin, Clock, TrendingUp, Eye,
  Monitor, Smartphone, Tablet, ChevronRight, RefreshCw, Layout
} from 'lucide-react';
import ProtectedRoute from '../../../components/admin/ProtectedRoute';

interface VisitorStats {
  total_visits: number;
  unique_visitors: number;
  countries_reached: number;
  visits_today: number;
  visits_week: number;
  visits_month: number;
}

interface CountryData {
  country: string;
  country_code: string;
  visit_count: number;
  unique_visitors: number;
}

interface TopPage {
  page: string;
  visits: number;
}

interface DailyData {
  date: string;
  visits: number;
  unique_visitors: number;
}

interface RecentVisitor {
  id: string;
  ip_address?: string;
  country: string;
  city: string;
  page_visited: string;
  device_type: string;
  browser: string;
  visited_at: string;
  pages_visited?: string[];
  visit_count?: number;
}

// Country flag emoji helper
const getCountryFlag = (countryCode: string) => {
  if (!countryCode) return '🌍';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

export default function AnalyticsPage() {
  const [stats, setStats] = useState<VisitorStats | null>(null);
  const [countries, setCountries] = useState<CountryData[]>([]);
  const [dailyData, setDailyData] = useState<DailyData[]>([]);
  const [recentVisitors, setRecentVisitors] = useState<RecentVisitor[]>([]);
  const [uniqueVisitors, setUniqueVisitors] = useState<RecentVisitor[]>([]);
  const [topPages, setTopPages] = useState<TopPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const [statsRes, countriesRes, dailyRes, recentRes, uniqueRes, topPagesRes] = await Promise.all([
        fetch('/api/visitors?type=stats'),
        fetch('/api/visitors?type=countries'),
        fetch('/api/visitors?type=daily'),
        fetch('/api/visitors?type=recent'),
        fetch('/api/visitors?type=unique'),
        fetch('/api/visitors?type=top_pages'),
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (countriesRes.ok) setCountries(await countriesRes.json());
      if (dailyRes.ok) setDailyData(await dailyRes.json());
      if (recentRes.ok) setRecentVisitors(await recentRes.json());
      if (uniqueRes.ok) setUniqueVisitors(await uniqueRes.json());
      if (topPagesRes.ok) setTopPages(await topPagesRes.json());
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const statCards = [
    { label: 'Total Visits', value: stats?.total_visits || 0, icon: Eye, color: '#2ecc71' },
    { label: 'Unique Visitors', value: stats?.unique_visitors || 0, icon: Users, color: '#3498db' },
    { label: 'Countries', value: stats?.countries_reached || 0, icon: Globe, color: '#9b59b6' },
    { label: 'Today', value: stats?.visits_today || 0, icon: Clock, color: '#e74c3c' },
    { label: 'This Week', value: stats?.visits_week || 0, icon: TrendingUp, color: '#f39c12' },
    { label: 'This Month', value: stats?.visits_month || 0, icon: TrendingUp, color: '#1abc9c' },
  ];

  const getDeviceIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'mobile': return <Smartphone size={16} />;
      case 'tablet': return <Tablet size={16} />;
      default: return <Monitor size={16} />;
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  // Calculate max for chart scaling
  const maxVisits = Math.max(...dailyData.map(d => d.visits), 1);

  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-white uppercase tracking-tight mb-2">Analytics</h1>
            <p className="text-slate-400">Track your website visitors and their locations</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 transition-all disabled:opacity-50"
          >
            <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#2ecc71]/20 border-t-[#2ecc71] rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              {statCards.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-slate-900/60 border border-white/5 rounded-2xl p-5"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: `${stat.color}20` }}
                      >
                        <Icon size={18} style={{ color: stat.color }} />
                      </div>
                    </div>
                    <p className="text-2xl font-black text-white">{stat.value.toLocaleString()}</p>
                    <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
                  </motion.div>
                );
              })}
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Daily Visitors Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="lg:col-span-2 bg-slate-900/60 border border-white/5 rounded-2xl p-6"
              >
                <h2 className="text-lg font-bold text-white mb-6">Daily Visitors (Last 30 Days)</h2>
                <div className="h-[200px] flex items-end gap-1">
                  {dailyData.slice(0, 30).reverse().map((day, index) => (
                    <div
                      key={day.date}
                      className="flex-1 group relative"
                    >
                      <div
                        className="w-full bg-[#2ecc71] rounded-t transition-all hover:bg-[#27ae60]"
                        style={{ height: `${(day.visits / maxVisits) * 100}%`, minHeight: '4px' }}
                      />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        {formatDate(day.date)}: {day.visits} visits
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-4 text-xs text-slate-500">
                  <span>30 days ago</span>
                  <span>Today</span>
                </div>
              </motion.div>

              {/* Top Countries */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-slate-900/60 border border-white/5 rounded-2xl p-6"
              >
                <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <Globe size={20} className="text-[#2ecc71]" />
                  Top Countries
                </h2>
                <div className="space-y-4">
                  {countries.length === 0 ? (
                    <p className="text-slate-500 text-sm text-center py-4">No data yet</p>
                  ) : (
                    countries.map((country, index) => (
                      <div key={country.country} className="flex items-center gap-3">
                        <span className="text-2xl">{getCountryFlag(country.country_code)}</span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-slate-300">{country.country}</span>
                            <span className="text-xs text-slate-500">{country.visit_count}</span>
                          </div>
                          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#2ecc71] rounded-full transition-all"
                              style={{ width: `${(country.visit_count / (countries[0]?.visit_count || 1)) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            </div>

            {/* Top Pages Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="mt-6 bg-slate-900/60 border border-white/5 rounded-2xl p-6"
            >
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Users size={20} className="text-[#e74c3c]" />
                Top Visited Pages
              </h2>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {topPages.length === 0 ? (
                  <p className="text-slate-500 text-sm col-span-full text-center py-4">No page data yet</p>
                ) : (
                  topPages.map((page, index) => (
                    <div key={page.page} className="bg-slate-800/50 rounded-xl p-4 border border-white/5 flex flex-col">
                      <div className="text-xs text-slate-500 font-mono mb-2 truncate" title={page.page}>
                        {page.page}
                      </div>
                      <div className="text-2xl font-bold text-white">
                        {page.visits}
                      </div>
                      <div className="mt-1 h-1 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#e74c3c] rounded-full"
                          style={{ width: `${(page.visits / topPages[0].visits) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>

            {/* Top Pages Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="mt-6 bg-slate-900/60 border border-white/5 rounded-2xl p-6"
            >
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Layout size={20} className="text-[#e74c3c]" />
                Top Visited Pages
              </h2>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {topPages.length === 0 ? (
                  <p className="text-slate-500 text-sm col-span-full text-center py-4">No page data yet</p>
                ) : (
                  topPages.map((page, index) => (
                    <div key={page.page} className="bg-slate-800/50 rounded-xl p-4 border border-white/5 flex flex-col">
                      <div className="text-xs text-slate-500 font-mono mb-2 truncate" title={page.page}>
                        {page.page}
                      </div>
                      <div className="text-2xl font-bold text-white">
                        {page.visits}
                      </div>
                      <div className="mt-1 h-1 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#e74c3c] rounded-full"
                          style={{ width: `${(page.visits / topPages[0].visits) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>

            {/* Recent Visitors Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-6 bg-slate-900/60 border border-white/5 rounded-2xl p-6"
            >
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Users size={20} className="text-[#2ecc71]" />
                Recent Visitors
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase">Location</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase">Page</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase">Device</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase">Browser</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentVisitors.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-8 text-slate-500">No visitors yet</td>
                      </tr>
                    ) : (
                      recentVisitors.map((visitor) => (
                        <tr key={visitor.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <MapPin size={14} className="text-[#2ecc71]" />
                              <span className="text-sm text-slate-300">
                                {visitor.city ? `${visitor.city}, ` : ''}{visitor.country || 'Unknown'}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-sm text-slate-400 font-mono">{visitor.page_visited}</span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2 text-slate-400">
                              {getDeviceIcon(visitor.device_type)}
                              <span className="text-sm capitalize">{visitor.device_type || 'Desktop'}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-sm text-slate-400">{visitor.browser || 'Unknown'}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-sm text-slate-500">{formatTime(visitor.visited_at)}</span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Recent Unique Visitors Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-6 bg-slate-900/60 border border-white/5 rounded-2xl p-6"
            >
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Users size={20} className="text-[#3498db]" />
                Recent Unique Visitors
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase">IP Address</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase">Location</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase">First Page</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase">Journey</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase">Device</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase">Browser</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {uniqueVisitors.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-8 text-slate-500">No unique visitors yet</td>
                      </tr>
                    ) : (
                      uniqueVisitors.map((visitor) => (
                        <tr key={visitor.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="py-3 px-4">
                            <span className="text-sm text-slate-400 font-mono">{visitor.ip_address || 'Masked'}</span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <MapPin size={14} className="text-[#3498db]" />
                              <span className="text-sm text-slate-300">
                                {visitor.city ? `${visitor.city}, ` : ''}{visitor.country || 'Unknown'}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-sm text-slate-400 font-mono">{visitor.page_visited}</span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex flex-col gap-1">
                              <div className="text-xs text-slate-500">{visitor.pages_visited?.length || 1} pages</div>
                              <div className="flex flex-wrap gap-1">
                                {visitor.pages_visited?.slice(0, 3).map((p, i) => (
                                  <span key={i} className="px-1.5 py-0.5 bg-slate-800 rounded text-[10px] text-slate-400 font-mono truncate max-w-[80px]" title={p}>
                                    {p}
                                  </span>
                                ))}
                                {(visitor.pages_visited?.length || 0) > 3 && (
                                  <span className="px-1.5 py-0.5 bg-slate-800 rounded text-[10px] text-slate-500">
                                    +{(visitor.pages_visited?.length || 0) - 3}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2 text-slate-400">
                              {getDeviceIcon(visitor.device_type)}
                              <span className="text-sm capitalize">{visitor.device_type || 'Desktop'}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-sm text-slate-400">{visitor.browser || 'Unknown'}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-sm text-slate-500">{formatTime(visitor.visited_at)}</span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Last 30 Days History Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-6 bg-slate-900/60 border border-white/5 rounded-2xl p-6"
            >
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Clock size={20} className="text-[#f39c12]" />
                Last 30 Days Visit History
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase">Date</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase">Total Visits</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase">Unique Visitors</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dailyData.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="text-center py-8 text-slate-500">No history data yet</td>
                      </tr>
                    ) : (
                      dailyData.slice(0, 30).map((day) => (
                        <tr key={day.date} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="py-3 px-4">
                            <span className="text-sm text-slate-300">{formatDate(day.date)}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-sm text-slate-400 font-bold">{day.visits}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-sm text-slate-400">{day.unique_visitors}</span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Data Collection Disclaimer */}
            <div className="mt-6 p-4 border border-yellow-500/20 bg-yellow-500/5 rounded-xl text-xs text-yellow-500/80">
              <p className="font-semibold mb-1">Data Collection Note:</p>
              <p>
                IP-based location is approximate. Automated collection of personal data (Email, Phone, Exact GPS, Device Name)
                is not possible without explicit user input due to browser privacy policies and security sandboxing.
              </p>
            </div>
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}
