"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Mail, Phone, Building2, DollarSign, MessageSquare,
  Clock, MapPin, ChevronDown, ChevronUp, RefreshCw, Filter,
  CheckCircle, XCircle, AlertCircle, Star, Sparkles
} from 'lucide-react';
import ProtectedRoute from '../../../components/admin/ProtectedRoute';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  service_interest: string | null;
  budget: string | null;
  message: string | null;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  priority: 'low' | 'medium' | 'high';
  country: string | null;
  city: string | null;
  notes: string | null;
  created_at: string;
}

interface LeadStats {
  total_leads: number;
  new_leads: number;
  contacted_leads: number;
  qualified_leads: number;
  converted_leads: number;
  leads_today: number;
  leads_week: number;
}

const statusColors: Record<string, { bg: string; text: string; icon: any }> = {
  new: { bg: 'bg-blue-500/20', text: 'text-blue-400', icon: Sparkles },
  contacted: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', icon: MessageSquare },
  qualified: { bg: 'bg-purple-500/20', text: 'text-purple-400', icon: Star },
  converted: { bg: 'bg-green-500/20', text: 'text-green-400', icon: CheckCircle },
  lost: { bg: 'bg-red-500/20', text: 'text-red-400', icon: XCircle },
};

const priorityColors: Record<string, string> = {
  low: 'bg-slate-500',
  medium: 'bg-yellow-500',
  high: 'bg-red-500',
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<LeadStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expandedLead, setExpandedLead] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [leadsRes, statsRes] = await Promise.all([
        fetch(`/api/leads${statusFilter !== 'all' ? `?status=${statusFilter}` : ''}`),
        fetch('/api/leads?type=stats'),
      ]);

      if (leadsRes.ok) setLeads(await leadsRes.json());
      if (statsRes.ok) setStats(await statsRes.json());
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [statusFilter]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const updateLeadStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const response = await fetch('/api/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (response.ok) {
        setLeads(prev => prev.map(lead =>
          lead.id === id ? { ...lead, status: newStatus as Lead['status'] } : lead
        ));
        fetchData(); // Refresh stats
      }
    } catch (error) {
      console.error('Error updating lead:', error);
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const statCards = [
    { label: 'Total Leads', value: stats?.total_leads || 0, icon: Users, color: '#2ecc71' },
    { label: 'New', value: stats?.new_leads || 0, icon: Sparkles, color: '#3498db' },
    { label: 'Contacted', value: stats?.contacted_leads || 0, icon: MessageSquare, color: '#f39c12' },
    { label: 'Qualified', value: stats?.qualified_leads || 0, icon: Star, color: '#9b59b6' },
    { label: 'Converted', value: stats?.converted_leads || 0, icon: CheckCircle, color: '#2ecc71' },
    { label: 'Today', value: stats?.leads_today || 0, icon: Clock, color: '#e74c3c' },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-white uppercase tracking-tight mb-2">Leads</h1>
            <p className="text-slate-400">Manage leads captured from the AI chatbot</p>
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
                    <p className="text-2xl font-black text-white">{stat.value}</p>
                    <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
                  </motion.div>
                );
              })}
            </div>

            {/* Filter */}
            <div className="flex items-center gap-4 mb-6">
              <Filter size={18} className="text-slate-500" />
              <div className="flex gap-2">
                {['all', 'new', 'contacted', 'qualified', 'converted', 'lost'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                      statusFilter === status
                        ? 'bg-[#2ecc71] text-slate-900'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Leads List */}
            <div className="space-y-4">
              {leads.length === 0 ? (
                <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-12 text-center">
                  <Users size={48} className="mx-auto text-slate-600 mb-4" />
                  <h3 className="text-lg font-bold text-slate-400 mb-2">No leads yet</h3>
                  <p className="text-slate-500 text-sm">Leads from the AI chatbot will appear here</p>
                </div>
              ) : (
                leads.map((lead, index) => {
                  const StatusIcon = statusColors[lead.status]?.icon || AlertCircle;
                  const isExpanded = expandedLead === lead.id;

                  return (
                    <motion.div
                      key={lead.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-slate-900/60 border border-white/5 rounded-2xl overflow-hidden"
                    >
                      {/* Lead Header */}
                      <div
                        className="p-6 cursor-pointer hover:bg-white/5 transition-colors"
                        onClick={() => setExpandedLead(isExpanded ? null : lead.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            {/* Priority Indicator */}
                            <div className={`w-2 h-12 rounded-full ${priorityColors[lead.priority]}`} />

                            {/* Lead Info */}
                            <div>
                              <div className="flex items-center gap-3 mb-1">
                                <h3 className="text-lg font-bold text-white">{lead.name}</h3>
                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${statusColors[lead.status]?.bg} ${statusColors[lead.status]?.text}`}>
                                  <StatusIcon size={12} className="inline mr-1" />
                                  {lead.status}
                                </span>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-slate-400">
                                <span className="flex items-center gap-1">
                                  <Mail size={14} />
                                  {lead.email}
                                </span>
                                {lead.service_interest && (
                                  <span className="flex items-center gap-1">
                                    <Sparkles size={14} className="text-[#2ecc71]" />
                                    {lead.service_interest}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <span className="text-xs text-slate-500">{formatDate(lead.created_at)}</span>
                            {isExpanded ? <ChevronUp size={20} className="text-slate-500" /> : <ChevronDown size={20} className="text-slate-500" />}
                          </div>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="px-6 pb-6 border-t border-white/5 pt-6">
                              <div className="grid md:grid-cols-2 gap-6">
                                {/* Contact Info */}
                                <div className="space-y-4">
                                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Contact Info</h4>
                                  <div className="space-y-3">
                                    {lead.phone && (
                                      <div className="flex items-center gap-3">
                                        <Phone size={16} className="text-slate-500" />
                                        <span className="text-slate-300">{lead.phone}</span>
                                      </div>
                                    )}
                                    {lead.company && (
                                      <div className="flex items-center gap-3">
                                        <Building2 size={16} className="text-slate-500" />
                                        <span className="text-slate-300">{lead.company}</span>
                                      </div>
                                    )}
                                    {lead.budget && (
                                      <div className="flex items-center gap-3">
                                        <DollarSign size={16} className="text-slate-500" />
                                        <span className="text-slate-300">{lead.budget}</span>
                                      </div>
                                    )}
                                    {(lead.city || lead.country) && (
                                      <div className="flex items-center gap-3">
                                        <MapPin size={16} className="text-slate-500" />
                                        <span className="text-slate-300">
                                          {lead.city ? `${lead.city}, ` : ''}{lead.country}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Message */}
                                {lead.message && (
                                  <div>
                                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Message</h4>
                                    <p className="text-slate-300 bg-slate-800/50 p-4 rounded-xl text-sm leading-relaxed">
                                      {lead.message}
                                    </p>
                                  </div>
                                )}
                              </div>

                              {/* Status Actions */}
                              <div className="mt-6 pt-6 border-t border-white/5">
                                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Update Status</h4>
                                <div className="flex flex-wrap gap-2">
                                  {['new', 'contacted', 'qualified', 'converted', 'lost'].map((status) => {
                                    const StatusBtnIcon = statusColors[status]?.icon || AlertCircle;
                                    const isActive = lead.status === status;
                                    const isUpdating = updatingId === lead.id;

                                    return (
                                      <button
                                        key={status}
                                        onClick={() => updateLeadStatus(lead.id, status)}
                                        disabled={isActive || isUpdating}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize flex items-center gap-2 ${
                                          isActive
                                            ? `${statusColors[status]?.bg} ${statusColors[status]?.text}`
                                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                        } disabled:opacity-50`}
                                      >
                                        <StatusBtnIcon size={14} />
                                        {status}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Quick Actions */}
                              <div className="mt-6 flex gap-3">
                                <a
                                  href={`mailto:${lead.email}`}
                                  className="flex items-center gap-2 px-4 py-2 bg-[#2ecc71] text-slate-900 rounded-lg text-sm font-bold hover:bg-[#27ae60] transition-all"
                                >
                                  <Mail size={16} />
                                  Send Email
                                </a>
                                {lead.phone && (
                                  <a
                                    href={`tel:${lead.phone}`}
                                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-700 transition-all"
                                  >
                                    <Phone size={16} />
                                    Call
                                  </a>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })
              )}
            </div>
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}
