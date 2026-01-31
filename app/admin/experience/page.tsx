"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Plus, Edit2, Trash2, Search, Loader2, X,
  Award, ArrowLeft, Save, Calendar, MapPin, Building2
} from 'lucide-react';
import ProtectedRoute from '../../../components/admin/ProtectedRoute';
import { supabase } from '../../../lib/supabase';

interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  start_date: string;
  end_date: string;
  description: string[];
  type: 'full-time' | 'part-time' | 'project';
  skills: string[];
  order_index: number;
}

export default function ExperienceManagement() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    company: '',
    position: '',
    location: '',
    start_date: '',
    end_date: '',
    description: '',
    type: 'full-time' as 'full-time' | 'part-time' | 'project',
    skills: '',
    order_index: 0
  });

  useEffect(() => {
    fetchExperiences();
  }, []);

  async function fetchExperiences() {
    if (!supabase) {
      setExperiences([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('experiences')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setExperiences(data || []);
    } catch (error) {
      console.error('Error fetching experiences:', error);
    }
    setLoading(false);
  }

  const filteredExperiences = experiences.filter(exp => {
    const matchesSearch = exp.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.position.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || exp.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleOpenModal = (exp?: Experience) => {
    if (exp) {
      setEditingExp(exp);
      setFormData({
        company: exp.company,
        position: exp.position,
        location: exp.location,
        start_date: exp.start_date,
        end_date: exp.end_date,
        description: exp.description.join('\n'),
        type: exp.type,
        skills: exp.skills.join(', '),
        order_index: exp.order_index
      });
    } else {
      setEditingExp(null);
      setFormData({
        company: '',
        position: '',
        location: '',
        start_date: '',
        end_date: '',
        description: '',
        type: 'full-time',
        skills: '',
        order_index: experiences.length + 1
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingExp(null);
  };

  const handleSave = async () => {
    if (!formData.company || !formData.position) return;
    setSaving(true);

    const expData = {
      company: formData.company,
      position: formData.position,
      location: formData.location,
      start_date: formData.start_date,
      end_date: formData.end_date,
      description: formData.description.split('\n').filter(d => d.trim()),
      type: formData.type,
      skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
      order_index: formData.order_index
    };

    if (!supabase) {
      if (editingExp) {
        setExperiences(experiences.map(e =>
          e.id === editingExp.id ? { ...e, ...expData } : e
        ));
      } else {
        setExperiences([...experiences, { id: Date.now().toString(), ...expData }]);
      }
      handleCloseModal();
      setSaving(false);
      return;
    }

    try {
      if (editingExp) {
        const { error } = await supabase
          .from('experiences')
          .update(expData)
          .eq('id', editingExp.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('experiences')
          .insert(expData);
        if (error) throw error;
      }
      await fetchExperiences();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving experience:', error);
      alert('Error saving experience. Please try again.');
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!supabase) {
      setExperiences(experiences.filter(e => e.id !== id));
      setDeleteConfirm(null);
      return;
    }

    try {
      const { error } = await supabase.from('experiences').delete().eq('id', id);
      if (error) throw error;
      await fetchExperiences();
    } catch (error) {
      console.error('Error deleting experience:', error);
      alert('Error deleting experience. Please try again.');
    }
    setDeleteConfirm(null);
  };

  const typeColors = {
    'full-time': 'bg-[#2ecc71]/10 text-[#2ecc71]',
    'part-time': 'bg-blue-500/10 text-blue-400',
    'project': 'bg-purple-500/10 text-purple-400'
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link href="/admin" className="text-slate-500 hover:text-white transition-colors">
                <ArrowLeft size={20} />
              </Link>
              <h1 className="text-3xl font-black text-white uppercase tracking-tight">Experience</h1>
            </div>
            <p className="text-slate-400">Manage your work experience entries</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-[#2ecc71] text-slate-950 px-6 py-3 rounded-xl font-bold text-sm hover:scale-105 active:scale-95 transition-all"
          >
            <Plus size={18} />
            Add Experience
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input
              type="text"
              placeholder="Search experiences..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/60 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-[#2ecc71]/50 transition-all"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'full-time', 'part-time', 'project'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  filterType === type
                    ? 'bg-[#2ecc71] text-slate-950'
                    : 'bg-slate-900/60 text-slate-400 hover:text-white'
                }`}
              >
                {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-900/40 border border-white/5 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-white">{experiences.filter(e => e.type === 'full-time').length}</p>
            <p className="text-xs text-slate-500 uppercase tracking-wider">Full-Time</p>
          </div>
          <div className="bg-slate-900/40 border border-white/5 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-white">{experiences.filter(e => e.type === 'part-time').length}</p>
            <p className="text-xs text-slate-500 uppercase tracking-wider">Part-Time</p>
          </div>
          <div className="bg-slate-900/40 border border-white/5 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-white">{experiences.filter(e => e.type === 'project').length}</p>
            <p className="text-xs text-slate-500 uppercase tracking-wider">Projects</p>
          </div>
        </div>

        {/* Experience List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#2ecc71] animate-spin" />
          </div>
        ) : filteredExperiences.length === 0 ? (
          <div className="text-center py-20">
            <Award className="w-16 h-16 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500">No experiences found</p>
            <p className="text-slate-600 text-sm mt-1">Add your first experience entry</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredExperiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-slate-900/60 border border-white/5 rounded-xl p-5 hover:border-white/20 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-white font-bold">{exp.position}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${typeColors[exp.type]}`}>
                        {exp.type}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                      <span className="flex items-center gap-1">
                        <Building2 size={14} />
                        {exp.company}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={14} />
                        {exp.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {exp.start_date} - {exp.end_date}
                      </span>
                    </div>
                    {exp.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {exp.skills.slice(0, 4).map((skill, i) => (
                          <span key={i} className="px-2 py-1 bg-white/5 rounded text-xs text-slate-400">
                            {skill}
                          </span>
                        ))}
                        {exp.skills.length > 4 && (
                          <span className="px-2 py-1 text-xs text-slate-500">+{exp.skills.length - 4} more</span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenModal(exp)}
                      className="p-2 text-slate-500 hover:text-[#2ecc71] hover:bg-[#2ecc71]/10 rounded-lg transition-all"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(exp.id)}
                      className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Add/Edit Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={handleCloseModal}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">
                    {editingExp ? 'Edit Experience' : 'Add New Experience'}
                  </h2>
                  <button onClick={handleCloseModal} className="p-2 text-slate-500 hover:text-white rounded-lg">
                    <X size={20} />
                  </button>
                </div>

                <div className="p-6 space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Position *</label>
                      <input
                        type="text"
                        value={formData.position}
                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                        className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#2ecc71]/50"
                        placeholder="e.g., Freelance Consultant"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Company *</label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#2ecc71]/50"
                        placeholder="e.g., Fiverr"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Location</label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#2ecc71]/50"
                        placeholder="e.g., Remote"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Type</label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value as Experience['type'] })}
                        className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#2ecc71]/50"
                      >
                        <option value="full-time">Full-Time</option>
                        <option value="part-time">Part-Time</option>
                        <option value="project">Project</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Start Date</label>
                      <input
                        type="text"
                        value={formData.start_date}
                        onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                        className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#2ecc71]/50"
                        placeholder="e.g., January 2024"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">End Date</label>
                      <input
                        type="text"
                        value={formData.end_date}
                        onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                        className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#2ecc71]/50"
                        placeholder="e.g., Present"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Description (one per line)</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#2ecc71]/50 resize-none"
                      placeholder="Enter each responsibility on a new line..."
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Skills (comma separated)</label>
                    <input
                      type="text"
                      value={formData.skills}
                      onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                      className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#2ecc71]/50"
                      placeholder="e.g., React, Node.js, TypeScript"
                    />
                  </div>
                </div>

                <div className="p-6 border-t border-white/10 flex gap-3">
                  <button onClick={handleCloseModal} className="flex-1 py-3 border border-white/10 text-white rounded-xl font-medium hover:bg-white/5">
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving || !formData.company || !formData.position}
                    className="flex-1 py-3 bg-[#2ecc71] text-slate-950 rounded-xl font-bold disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save size={18} /> Save</>}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Modal */}
        <AnimatePresence>
          {deleteConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setDeleteConfirm(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-sm p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-bold text-white mb-2">Delete Experience?</h3>
                <p className="text-slate-400 mb-6">This action cannot be undone.</p>
                <div className="flex gap-3">
                  <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-3 border border-white/10 text-white rounded-xl">
                    Cancel
                  </button>
                  <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold">
                    Delete
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ProtectedRoute>
  );
}
