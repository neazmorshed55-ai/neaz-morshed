"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Edit2, Trash2, Loader2, X, Save, Upload } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface SkillCategory {
  id: string;
  title: string;
  slug: string;
  is_active?: boolean;
  order_index?: number;
}

interface SubSkill {
  id: string;
  category_id: string;
  title: string;
  slug: string;
  is_active?: boolean;
  order_index?: number;
  tags?: string[];
  cover_image?: string;
}

interface StructureManagerProps {
  onClose: () => void;
  categories: SkillCategory[];
  subSkills: SubSkill[];
}

export default function StructureManager({ onClose, categories: initialCategories, subSkills: initialSubSkills }: StructureManagerProps) {
  const [activeTab, setActiveTab] = useState<'categories' | 'subskills'>('categories');
  const [categories, setCategories] = useState(initialCategories);
  const [subSkills, setSubSkills] = useState(initialSubSkills);
  const [loading, setLoading] = useState(false);

  // Form States
  const [catForm, setCatForm] = useState({ title: '', is_active: true, order_index: 0 });
  const [skillForm, setSkillForm] = useState({ title: '', category_id: '', is_active: true, order_index: 0, cover_image: '' });
  const [uploadingImage, setUploadingImage] = useState(false);

  // Selection
  const [editingId, setEditingId] = useState<string | null>(null);

  // Refresh local data
  const refreshData = async () => {
    if (!supabase) return;
    const [c, s] = await Promise.all([
      supabase.from('skill_categories').select('*').order('order_index'),
      supabase.from('sub_skills').select('*').order('order_index')
    ]);
    if (c.data) setCategories(c.data);
    if (s.data) setSubSkills(s.data);
  };

  useEffect(() => {
    refreshData();
  }, []);

  // CRUD for Categories
  const handleSaveCategory = async () => {
    if (!catForm.title || !supabase) return;
    setLoading(true);

    // Auto-generate slug from title
    const slug = catForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    try {
      if (editingId) {
        // Update
        const { error } = await supabase
          .from('skill_categories')
          .update({ title: catForm.title, is_active: catForm.is_active, order_index: catForm.order_index, slug })
          .eq('id', editingId);
        if (error) throw error;
      } else {
        // Create
        const { error } = await supabase
          .from('skill_categories')
          .insert({
            title: catForm.title,
            is_active: catForm.is_active,
            order_index: categories.length + 1,
            slug
          });
        if (error) throw error;
      }
      await refreshData();
      setCatForm({ title: '', is_active: true, order_index: 0 });
      setEditingId(null);
    } catch (error) {
      console.error(error);
      alert('Error saving category');
    }
    setLoading(false);
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure? This will hide/delete related sub-skills.') || !supabase) return;
    setLoading(true);
    try {
      await supabase.from('skill_categories').delete().eq('id', id);
      await refreshData();
    } catch (e) {
      console.error(e);
      alert('Error deleting category');
    }
    setLoading(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !supabase) return;
    setUploadingImage(true);
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `skill-cover-${Date.now()}.${fileExt}`;
    const filePath = `skills/${fileName}`;

    try {
      const { error } = await supabase.storage.from('images').upload(filePath, file);
      if (error) throw error;
      const { data } = supabase.storage.from('images').getPublicUrl(filePath);
      setSkillForm({ ...skillForm, cover_image: data.publicUrl });
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image');
    }
    setUploadingImage(false);
  };

  const handleSaveSkill = async () => {
    if (!skillForm.title || !skillForm.category_id || !supabase) return;
    setLoading(true);

    const slug = skillForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    try {
      if (editingId) {
        await supabase
          .from('sub_skills')
          .update({
            title: skillForm.title,
            category_id: skillForm.category_id,
            is_active: skillForm.is_active,
            order_index: skillForm.order_index,
            cover_image: skillForm.cover_image,
            slug
          })
          .eq('id', editingId);
      } else {
        await supabase
          .from('sub_skills')
          .insert({
            title: skillForm.title,
            category_id: skillForm.category_id,
            is_active: skillForm.is_active,
            order_index: subSkills.filter(s => s.category_id === skillForm.category_id).length + 1,
            cover_image: skillForm.cover_image,
            slug
          });
      }
      await refreshData();
      setSkillForm({ ...skillForm, title: '', order_index: 0, cover_image: '' }); // keep category selected
      setEditingId(null);
    } catch (e) {
      console.error(e);
      alert('Error saving skill');
    }
    setLoading(false);
  };

  const handleDeleteSkill = async (id: string) => {
    if (!confirm('Delete this skill?') || !supabase) return;
    setLoading(true);
    try {
      await supabase.from('sub_skills').delete().eq('id', id);
      await refreshData();
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">Manage Structure</h2>
          <button onClick={onClose}><X size={24} className="text-slate-500 hover:text-white" /></button>
        </div>

        <div className="flex border-b border-white/10">
          <button
            onClick={() => setActiveTab('categories')}
            className={`flex-1 py-4 font-bold text-sm uppercase tracking-widest transition-colors ${activeTab === 'categories' ? 'text-[#2ecc71] border-b-2 border-[#2ecc71] bg-[#2ecc71]/5' : 'text-slate-500 hover:text-white'}`}
          >
            Categories
          </button>
          <button
            onClick={() => setActiveTab('subskills')}
            className={`flex-1 py-4 font-bold text-sm uppercase tracking-widest transition-colors ${activeTab === 'subskills' ? 'text-[#2ecc71] border-b-2 border-[#2ecc71] bg-[#2ecc71]/5' : 'text-slate-500 hover:text-white'}`}
          >
            Sub-Skills
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'categories' ? (
            <div className="space-y-8">
              {/* Add/Edit Category Form */}
              <div className="bg-slate-800/50 p-6 rounded-xl border border-white/5">
                <h3 className="text-white font-bold mb-4">{editingId ? 'Edit Category' : 'Add New Category'}</h3>
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <label className="text-xs text-slate-400 font-bold uppercase mb-1 block">Title</label>
                    <input
                      value={catForm.title}
                      onChange={e => setCatForm({ ...catForm, title: e.target.value })}
                      className="w-full bg-slate-900 border border-white/10 rounded-lg p-3 text-white focus:border-[#2ecc71]"
                      placeholder="e.g. Web Development"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 font-bold uppercase mb-1 block">Order</label>
                    <input
                      type="number"
                      value={catForm.order_index}
                      onChange={e => setCatForm({ ...catForm, order_index: parseInt(e.target.value) })}
                      className="w-20 bg-slate-900 border border-white/10 rounded-lg p-3 text-white focus:border-[#2ecc71]"
                    />
                  </div>
                  <div className="pb-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={catForm.is_active}
                        onChange={e => setCatForm({ ...catForm, is_active: e.target.checked })}
                        className="w-5 h-5 accent-[#2ecc71] rounded"
                      />
                      <span className="text-white text-sm">Visible</span>
                    </label>
                  </div>
                  <button
                    onClick={handleSaveCategory}
                    disabled={loading || !catForm.title}
                    className="bg-[#2ecc71] text-slate-900 font-bold px-6 py-3 rounded-lg hover:bg-[#27ae60] disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                  </button>
                  {editingId && (
                    <button onClick={() => { setEditingId(null); setCatForm({ title: '', is_active: true, order_index: 0 }); }} className="bg-slate-700 text-white font-bold px-4 py-3 rounded-lg"> Cancel </button>
                  )}
                </div>
              </div>

              {/* List */}
              <div className="space-y-2">
                {categories.map((cat) => (
                  <div key={cat.id} className="flex items-center justify-between bg-slate-800/30 p-4 rounded-lg border border-white/5">
                    <div className="flex items-center gap-4">
                      <span className="text-slate-500 font-mono text-sm">#{cat.order_index}</span>
                      <div>
                        <span className={`font-bold ${cat.is_active ? 'text-white' : 'text-slate-500 line-through'}`}>{cat.title}</span>
                        <p className="text-xs text-slate-500">Slug: {cat.slug}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setEditingId(cat.id); setCatForm({ title: cat.title, is_active: Boolean(cat.is_active), order_index: cat.order_index || 0 }); }} className="p-2 text-[#2ecc71] hover:bg-[#2ecc71]/10 rounded"><Edit2 size={16} /></button>
                      <button onClick={() => handleDeleteCategory(cat.id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded"><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Add/Edit Skill Form */}
              <div className="bg-slate-800/50 p-6 rounded-xl border border-white/5">
                <h3 className="text-white font-bold mb-4">{editingId ? 'Edit Sub-Skill' : 'Add New Sub-Skill'}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-xs text-slate-400 font-bold uppercase mb-1 block">Category</label>
                    <select
                      value={skillForm.category_id}
                      onChange={e => setSkillForm({ ...skillForm, category_id: e.target.value })}
                      className="w-full bg-slate-900 border border-white/10 rounded-lg p-3 text-white focus:border-[#2ecc71]"
                    >
                      <option value="">Select Category...</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 font-bold uppercase mb-1 block">Title</label>
                    <input
                      value={skillForm.title}
                      onChange={e => setSkillForm({ ...skillForm, title: e.target.value })}
                      className="w-full bg-slate-900 border border-white/10 rounded-lg p-3 text-white focus:border-[#2ecc71]"
                      placeholder="e.g. AI Based Website"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs text-slate-400 font-bold uppercase mb-1 block">Cover Image</label>
                    <div className="flex items-center gap-4">
                      {skillForm.cover_image && (
                        <div className="w-16 h-10 bg-slate-800 rounded overflow-hidden relative border border-white/10">
                          <img src={skillForm.cover_image} alt="Cover" className="w-full h-full object-cover" />
                          <button
                            onClick={() => setSkillForm({ ...skillForm, cover_image: '' })}
                            className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 flex items-center justify-center text-white"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      )}
                      <label className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-white/10 rounded-lg cursor-pointer text-sm font-medium text-slate-300 transition-colors">
                        {uploadingImage ? <Loader2 size={16} className="animate-spin text-[#2ecc71]" /> : <Upload size={16} />}
                        {skillForm.cover_image ? 'Change Image' : 'Upload Image'}
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-4 items-center md:col-span-2 mt-4">
                    <div>
                      <label className="text-xs text-slate-400 font-bold uppercase mb-1 block">Order</label>
                      <input
                        type="number"
                        value={skillForm.order_index}
                        onChange={e => setSkillForm({ ...skillForm, order_index: parseInt(e.target.value) })}
                        className="w-20 bg-slate-900 border border-white/10 rounded-lg p-3 text-white focus:border-[#2ecc71]"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="flex items-center gap-2 cursor-pointer mt-6">
                        <input
                          type="checkbox"
                          checked={skillForm.is_active}
                          onChange={e => setSkillForm({ ...skillForm, is_active: e.target.checked })}
                          className="w-5 h-5 accent-[#2ecc71] rounded"
                        />
                        <span className="text-white text-sm">Visible</span>
                      </label>
                    </div>
                    <button
                      onClick={handleSaveSkill}
                      disabled={loading || !skillForm.title || !skillForm.category_id}
                      className="bg-[#2ecc71] text-slate-900 font-bold px-6 py-3 rounded-lg hover:bg-[#27ae60] disabled:opacity-50 mt-4"
                    >
                      {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                    </button>
                    {editingId && (
                      <button onClick={() => { setEditingId(null); setSkillForm({ ...skillForm, title: '', is_active: true, cover_image: '' }); }} className="bg-slate-700 text-white font-bold px-4 py-3 rounded-lg mt-4"> Cancel </button>
                    )}
                  </div>
                </div>

                {/* List */}
                <div className="space-y-4">
                  {categories.map(cat => {
                    const catSkills = subSkills.filter(s => s.category_id === cat.id);
                    if (catSkills.length === 0) return null;
                    return (
                      <div key={cat.id}>
                        <h4 className="text-[#2ecc71] font-bold mb-2 uppercase text-xs tracking-widest">{cat.title}</h4>
                        <div className="space-y-2 pl-4 border-l-2 border-[#2ecc71]/20">
                          {catSkills.map(skill => (
                            <div key={skill.id} className="flex items-center justify-between bg-slate-800/30 p-3 rounded-lg border border-white/5">
                              <div className="flex items-center gap-4">
                                <span className="text-slate-500 font-mono text-xs">#{skill.order_index}</span>
                                <div>
                                  <span className={`font-bold text-sm ${skill.is_active ? 'text-white' : 'text-slate-500 line-through'}`}>{skill.title}</span>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <button onClick={() => {
                                  setEditingId(skill.id);
                                  setSkillForm({
                                    title: skill.title,
                                    category_id: skill.category_id,
                                    is_active: Boolean(skill.is_active),
                                    order_index: skill.order_index || 0,
                                    cover_image: skill.cover_image || ''
                                  });
                                }} className="p-1.5 text-[#2ecc71] hover:bg-[#2ecc71]/10 rounded"><Edit2 size={14} /></button>
                                <button onClick={() => handleDeleteSkill(skill.id)} className="p-1.5 text-red-400 hover:bg-red-400/10 rounded"><Trash2 size={14} /></button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
