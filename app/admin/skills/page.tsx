"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Plus, Edit2, Trash2, Search, Loader2, X,
  Wrench, ArrowLeft, Save
} from 'lucide-react';
import ProtectedRoute from '../../../components/admin/ProtectedRoute';
import { supabase } from '../../../lib/supabase';

interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  icon: string | null;
  order_index: number;
}

const categories = [
  'Web Development',
  'Design',
  'Video Production',
  'Virtual Assistance',
  'Marketing',
  'AI & Automation',
  'Content Creation',
  'Other'
];

export default function SkillsManagement() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Web Development',
    proficiency: 80,
    icon: '',
    order_index: 0
  });

  useEffect(() => {
    fetchSkills();
  }, []);

  async function fetchSkills() {
    if (!supabase) {
      setSkills([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('category', { ascending: true })
        .order('order_index', { ascending: true });

      if (error) throw error;
      setSkills(data || []);
    } catch (error) {
      console.error('Error fetching skills:', error);
    }
    setLoading(false);
  }

  const filteredSkills = skills.filter(skill => {
    const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || skill.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const groupedSkills = filteredSkills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  const handleOpenModal = (skill?: Skill) => {
    if (skill) {
      setEditingSkill(skill);
      setFormData({
        name: skill.name,
        category: skill.category,
        proficiency: skill.proficiency,
        icon: skill.icon || '',
        order_index: skill.order_index
      });
    } else {
      setEditingSkill(null);
      setFormData({
        name: '',
        category: 'Web Development',
        proficiency: 80,
        icon: '',
        order_index: skills.length + 1
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSkill(null);
  };

  const handleSave = async () => {
    if (!formData.name) return;
    setSaving(true);

    const skillData = {
      ...formData,
      icon: formData.icon || null
    };

    if (!supabase) {
      if (editingSkill) {
        setSkills(skills.map(s => s.id === editingSkill.id ? { ...s, ...skillData } : s));
      } else {
        setSkills([...skills, { id: Date.now().toString(), ...skillData }]);
      }
      handleCloseModal();
      setSaving(false);
      return;
    }

    try {
      if (editingSkill) {
        const { error } = await supabase.from('skills').update(skillData).eq('id', editingSkill.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('skills').insert(skillData);
        if (error) throw error;
      }
      await fetchSkills();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving skill:', error);
      alert('Error saving skill. Please try again.');
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!supabase) {
      setSkills(skills.filter(s => s.id !== id));
      setDeleteConfirm(null);
      return;
    }

    try {
      const { error } = await supabase.from('skills').delete().eq('id', id);
      if (error) throw error;
      await fetchSkills();
    } catch (error) {
      console.error('Error deleting skill:', error);
    }
    setDeleteConfirm(null);
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
              <h1 className="text-3xl font-black text-white uppercase tracking-tight">Skills</h1>
            </div>
            <p className="text-slate-400">Manage your professional skills</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-[#2ecc71] text-slate-950 px-6 py-3 rounded-xl font-bold text-sm hover:scale-105 active:scale-95 transition-all"
          >
            <Plus size={18} />
            Add Skill
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input
              type="text"
              placeholder="Search skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/60 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-[#2ecc71]/50 transition-all"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-slate-900/60 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#2ecc71]/50"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Skills List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#2ecc71] animate-spin" />
          </div>
        ) : Object.keys(groupedSkills).length === 0 ? (
          <div className="text-center py-20">
            <Wrench className="w-16 h-16 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500">No skills found</p>
            <p className="text-slate-600 text-sm mt-1">Add your first skill</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedSkills).map(([category, categorySkills]) => (
              <div key={category}>
                <h3 className="text-lg font-bold text-white mb-4">{category}</h3>
                <div className="grid gap-3">
                  {categorySkills.map((skill, index) => (
                    <motion.div
                      key={skill.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="bg-slate-900/60 border border-white/5 rounded-xl p-4 hover:border-white/20 transition-all"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-white font-medium">{skill.name}</h4>
                            <span className="text-[#2ecc71] text-sm font-bold">{skill.proficiency}%</span>
                          </div>
                          <div className="w-full bg-slate-800 rounded-full h-2">
                            <div
                              className="bg-[#2ecc71] h-2 rounded-full transition-all"
                              style={{ width: `${skill.proficiency}%` }}
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenModal(skill)}
                            className="p-2 text-slate-500 hover:text-[#2ecc71] hover:bg-[#2ecc71]/10 rounded-lg transition-all"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(skill.id)}
                            className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
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
                className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">
                    {editingSkill ? 'Edit Skill' : 'Add New Skill'}
                  </h2>
                  <button onClick={handleCloseModal} className="p-2 text-slate-500 hover:text-white rounded-lg">
                    <X size={20} />
                  </button>
                </div>

                <div className="p-6 space-y-5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Skill Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#2ecc71]/50"
                      placeholder="e.g., React.js"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#2ecc71]/50"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                      Proficiency: {formData.proficiency}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={formData.proficiency}
                      onChange={(e) => setFormData({ ...formData, proficiency: parseInt(e.target.value) })}
                      className="w-full h-2 bg-slate-800 rounded-full appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #2ecc71 0%, #2ecc71 ${formData.proficiency}%, #1e293b ${formData.proficiency}%, #1e293b 100%)`
                      }}
                    />
                  </div>
                </div>

                <div className="p-6 border-t border-white/10 flex gap-3">
                  <button onClick={handleCloseModal} className="flex-1 py-3 border border-white/10 text-white rounded-xl font-medium hover:bg-white/5">
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving || !formData.name}
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
                <h3 className="text-xl font-bold text-white mb-2">Delete Skill?</h3>
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
