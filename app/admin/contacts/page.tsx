"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, User, MessageSquare, Clock, MapPin, ChevronDown, ChevronUp,
  RefreshCw, Filter, CheckCircle, AlertCircle, Trash2, Eye
} from 'lucide-react';
import ProtectedRoute from '../../../components/admin/ProtectedRoute';
import { supabase } from '../../../lib/supabase';

interface Contact {
  id: string;
  created_at: string;
  name: string;
  email: string;
  message: string;
  status: 'new' | 'read' | 'replied';
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expandedContact, setExpandedContact] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchContacts = async () => {
    try {
      setRefreshing(true);
      let query = supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [statusFilter]);

  const handleRefresh = () => {
    fetchContacts();
  };

  const updateStatus = async (id: string, newStatus: 'new' | 'read' | 'replied') => {
    setUpdatingId(id);
    try {
      const { error } = await supabase
        .from('contacts')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      setContacts(prev => prev.map(contact =>
        contact.id === id ? { ...contact, status: newStatus } : contact
      ));
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteContact = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setContacts(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting contact:', error);
      alert('Failed to delete message');
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const statusColors: Record<string, { bg: string; text: string; icon: any }> = {
    new: { bg: 'bg-green-500/20', text: 'text-green-400', icon: AlertCircle },
    read: { bg: 'bg-blue-500/20', text: 'text-blue-400', icon: Eye },
    replied: { bg: 'bg-purple-500/20', text: 'text-purple-400', icon: CheckCircle },
  };

  const stats = {
    total: contacts.length,
    new: contacts.filter(c => c.status === 'new').length,
    read: contacts.filter(c => c.status === 'read').length,
    replied: contacts.filter(c => c.status === 'replied').length,
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-white uppercase tracking-tight mb-2">
              Contact Messages
            </h1>
            <p className="text-slate-400">Messages from your portfolio contact form</p>
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
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-5">
                <p className="text-2xl font-black text-white">{stats.total}</p>
                <p className="text-xs text-slate-500 font-medium">Total</p>
              </div>
              <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-5">
                <p className="text-2xl font-black text-green-400">{stats.new}</p>
                <p className="text-xs text-slate-500 font-medium">New</p>
              </div>
              <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-5">
                <p className="text-2xl font-black text-blue-400">{stats.read}</p>
                <p className="text-xs text-slate-500 font-medium">Read</p>
              </div>
              <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-5">
                <p className="text-2xl font-black text-purple-400">{stats.replied}</p>
                <p className="text-xs text-slate-500 font-medium">Replied</p>
              </div>
            </div>

            {/* Filter */}
            <div className="flex items-center gap-4 mb-6">
              <Filter size={18} className="text-slate-500" />
              <div className="flex gap-2">
                {['all', 'new', 'read', 'replied'].map((status) => (
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

            {/* Contacts List */}
            <div className="space-y-4">
              {contacts.length === 0 ? (
                <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-12 text-center">
                  <Mail size={48} className="mx-auto text-slate-600 mb-4" />
                  <h3 className="text-lg font-bold text-slate-400 mb-2">No messages yet</h3>
                  <p className="text-slate-500 text-sm">Contact form messages will appear here</p>
                </div>
              ) : (
                contacts.map((contact, index) => {
                  const StatusIcon = statusColors[contact.status]?.icon || AlertCircle;
                  const isExpanded = expandedContact === contact.id;

                  return (
                    <motion.div
                      key={contact.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-slate-900/60 border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all"
                    >
                      {/* Contact Header */}
                      <div
                        className="p-6 cursor-pointer hover:bg-white/5 transition-colors"
                        onClick={() => setExpandedContact(isExpanded ? null : contact.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            {/* Status Indicator */}
                            <div className={`w-2 h-12 rounded-full ${
                              contact.status === 'new' ? 'bg-green-500' :
                              contact.status === 'read' ? 'bg-blue-500' :
                              'bg-purple-500'
                            }`} />

                            {/* Contact Info */}
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-1 flex-wrap">
                                <h3 className="text-lg font-bold text-white">{contact.name}</h3>
                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${statusColors[contact.status]?.bg} ${statusColors[contact.status]?.text}`}>
                                  <StatusIcon size={12} className="inline mr-1" />
                                  {contact.status}
                                </span>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-slate-400 flex-wrap">
                                <span className="flex items-center gap-1">
                                  <Mail size={14} />
                                  {contact.email}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock size={14} />
                                  {formatDate(contact.created_at)}
                                </span>
                              </div>
                            </div>
                          </div>

                          {isExpanded ? (
                            <ChevronUp size={20} className="text-slate-500 ml-4" />
                          ) : (
                            <ChevronDown size={20} className="text-slate-500 ml-4" />
                          )}
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
                              {/* Message */}
                              <div className="mb-6">
                                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                  <MessageSquare size={16} />
                                  Message
                                </h4>
                                <div className="bg-slate-800/50 p-4 rounded-xl">
                                  <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                                    {contact.message}
                                  </p>
                                </div>
                              </div>

                              {/* Status Actions */}
                              <div className="mb-6 pb-6 border-b border-white/5">
                                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
                                  Update Status
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {(['new', 'read', 'replied'] as const).map((status) => {
                                    const StatusBtnIcon = statusColors[status]?.icon || AlertCircle;
                                    const isActive = contact.status === status;
                                    const isUpdating = updatingId === contact.id;

                                    return (
                                      <button
                                        key={status}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          updateStatus(contact.id, status);
                                        }}
                                        disabled={isActive || isUpdating}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize flex items-center gap-2 ${
                                          isActive
                                            ? `${statusColors[status]?.bg} ${statusColors[status]?.text}`
                                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                                      >
                                        <StatusBtnIcon size={14} />
                                        {status}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Quick Actions */}
                              <div className="flex gap-3 flex-wrap">
                                <a
                                  href={`mailto:${contact.email}?subject=Re: Your message from portfolio&body=Hi ${contact.name},%0D%0A%0D%0AThank you for reaching out!%0D%0A%0D%0A`}
                                  className="flex items-center gap-2 px-4 py-2 bg-[#2ecc71] text-slate-900 rounded-lg text-sm font-bold hover:bg-[#27ae60] transition-all"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Mail size={16} />
                                  Reply via Email
                                </a>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteContact(contact.id);
                                  }}
                                  className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm font-medium hover:bg-red-500/30 transition-all"
                                >
                                  <Trash2 size={16} />
                                  Delete
                                </button>
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
