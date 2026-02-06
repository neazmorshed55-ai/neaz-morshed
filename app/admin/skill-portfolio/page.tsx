"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Plus, Edit2, Trash2, Search, Loader2, X,
  ArrowLeft, Save, Image, Upload, ExternalLink, Settings
} from 'lucide-react';
import ProtectedRoute from '../../../components/admin/ProtectedRoute';
import { supabase } from '../../../lib/supabase';

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

interface GalleryItem {
  id: string;
  sub_skill_id: string;
  url: string;
  alt_text: string | null;
  type: 'image' | 'video' | 'link';
  order_index: number;
}

export default function SkillPortfolioManagement() {
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [subSkills, setSubSkills] = useState<SubSkill[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [selectedSkill, setSelectedSkill] = useState<SubSkill | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showStructureModal, setShowStructureModal] = useState(false);
  const [newGalleryItem, setNewGalleryItem] = useState({
    url: '',
    alt_text: '',
    type: 'image' as 'image' | 'video' | 'link'
  });
  const [addingGalleryItem, setAddingGalleryItem] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    if (!supabase) {
      setLoading(false);
      return;
    }

    try {
      const [catRes, skillsRes] = await Promise.all([
        supabase.from('skill_categories').select('*').eq('is_active', true).order('order_index'),
        supabase.from('sub_skills').select('*').eq('is_active', true).order('order_index')
      ]);

      if (catRes.data) setCategories(catRes.data);
      if (skillsRes.data) setSubSkills(skillsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  }

  async function fetchGalleryItems(skillId: string) {
    if (!supabase) return;

    try {
      const { data, error } = await supabase
        .from('skill_gallery')
        .select('*')
        .eq('sub_skill_id', skillId)
        .order('order_index');

      if (error) throw error;
      if (data) setGalleryItems(data as GalleryItem[]);
    } catch (error) {
      console.error('Error fetching gallery:', error);
    }
  }

  const handleSelectSkill = async (skill: SubSkill) => {
    setSelectedSkill(skill);
    await fetchGalleryItems(skill.id);
    setShowModal(true);
  };

  const uploadFile = async (file: File) => {
    if (!supabase) throw new Error('Supabase not initialized');

    const fileExt = file.name.split('.').pop();
    const fileName = `skill-gallery-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `skills/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('images').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleGalleryFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !supabase || !selectedSkill) return;

    setAddingGalleryItem(true);
    try {
      const uploadPromises = Array.from(files).map(async (file, index) => {
        const publicUrl = await uploadFile(file);

        const { data, error } = await supabase
          .from('skill_gallery')
          .insert({
            sub_skill_id: selectedSkill.id,
            url: publicUrl,
            alt_text: newGalleryItem.alt_text || null,
            type: newGalleryItem.type,
            order_index: galleryItems.length + index
          })
          .select()
          .single();

        if (error) throw error;
        return data as GalleryItem;
      });

      const uploadedItems = await Promise.all(uploadPromises);
      setGalleryItems([...galleryItems, ...uploadedItems]);
      setNewGalleryItem({ url: '', alt_text: '', type: 'image' });
    } catch (error) {
      console.error('Error uploading gallery items:', error);
      alert('Error uploading gallery items');
    }
    setAddingGalleryItem(false);
    e.target.value = '';
  };

  const handleAddGalleryItem = async () => {
    if (!supabase || !selectedSkill || !newGalleryItem.url) return;

    setAddingGalleryItem(true);
    try {
      const { data, error } = await supabase
        .from('skill_gallery')
        .insert({
          sub_skill_id: selectedSkill.id,
          url: newGalleryItem.url,
          alt_text: newGalleryItem.alt_text || null,
          type: newGalleryItem.type,
          order_index: galleryItems.length
        })
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setGalleryItems([...galleryItems, data as GalleryItem]);
        setNewGalleryItem({ url: '', alt_text: '', type: 'image' });
      }
    } catch (error) {
      console.error('Error adding gallery item:', error);
      alert('Error adding gallery item');
    }
    setAddingGalleryItem(false);
  };

  const handleDeleteGalleryItem = async (id: string) => {
    if (!supabase) return;

    try {
      const { error } = await supabase
        .from('skill_gallery')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setGalleryItems(galleryItems.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting gallery item:', error);
      alert('Error deleting gallery item');
    }
    setDeleteConfirm(null);
  };

  const filteredSkills = subSkills.filter(skill => {
    const matchesSearch = skill.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || skill.category_id === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.title || 'Unknown';
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
              <h1 className="text-3xl font-black text-white uppercase tracking-tight">
                Skill Portfolio Gallery
              </h1>
            </div>
            <p className="text-slate-400">Manage gallery images for each skill</p>
          </div>
          <button
            onClick={() => setShowStructureModal(true)}
            className="flex items-center gap-2 bg-[#2ecc71] text-slate-950 px-6 py-3 rounded-xl font-bold text-sm hover:scale-105 active:scale-95 transition-all"
          >
            <Settings size={18} />
            Manage Structure
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
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        </div>

        {/* Skills List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#2ecc71] animate-spin" />
          </div>
        ) : filteredSkills.length === 0 ? (
          <div className="text-center py-20">
            <div className="max-w-2xl mx-auto">
              <svg className="w-20 h-20 text-slate-700 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-bold text-white mb-2">No Skills Found</h3>
              <p className="text-slate-400 mb-6">
                {searchQuery || filterCategory !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Database e skill categories ba sub-skills nai'}
              </p>
              {!searchQuery && filterCategory === 'all' && (
                <div className="bg-slate-900/60 border border-[#2ecc71]/20 rounded-xl p-6 text-left">
                  <h4 className="text-base font-bold text-[#2ecc71] mb-4">📋 Quick Setup Guide:</h4>
                  <div className="space-y-4 text-sm text-slate-300">
                    <div>
                      <p className="font-semibold text-white mb-2">Option 1: Use Default Skills (Recommended)</p>
                      <p className="text-slate-400">
                        Apnar <code className="text-[#2ecc71] bg-slate-800 px-2 py-1 rounded">/skills/portfolio</code> page e already
                        default skills ache. Direct shei skills er gallery manage korte paren.
                      </p>
                      <a
                        href="/skills/portfolio"
                        target="_blank"
                        className="inline-flex items-center gap-2 mt-2 text-[#2ecc71] hover:underline"
                      >
                        View Skills Portfolio →
                      </a>
                    </div>
                    <div className="border-t border-white/10 pt-4">
                      <p className="font-semibold text-white mb-2">Option 2: Database Setup</p>
                      <ol className="list-decimal list-inside space-y-1 text-slate-400">
                        <li>Supabase e <code className="text-[#2ecc71]">skill_categories</code> table e categories add korun</li>
                        <li><code className="text-[#2ecc71]">sub_skills</code> table e skills add korun</li>
                        <li>Both tables e <code className="text-[#2ecc71]">is_active = true</code> set korun</li>
                      </ol>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSkills.map((skill, index) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                onClick={() => handleSelectSkill(skill)}
                className="bg-slate-900/60 border border-white/5 rounded-xl overflow-hidden hover:border-white/20 transition-all cursor-pointer p-6"
              >
                <h3 className="text-white font-bold mb-2">{skill.title}</h3>
                <p className="text-slate-500 text-sm">{getCategoryName(skill.category_id)}</p>
                <button className="mt-4 w-full px-4 py-2 bg-[#2ecc71]/10 text-[#2ecc71] rounded-lg font-bold hover:bg-[#2ecc71]/20 transition-all">
                  Manage Gallery
                </button>
              </motion.div>
            ))}
          </div>
        )}

        {/* Structure Management Modal */}
        <AnimatePresence>
          {showStructureModal && (
            <StructureManager
              onClose={() => {
                setShowStructureModal(false);
                fetchData(); // Refresh data after closing
              }}
              categories={categories}
              subSkills={subSkills}
            />
          )}
        </AnimatePresence>

        {/* Gallery Modal */}
        <AnimatePresence>
          {showModal && selectedSkill && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowModal(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-slate-900 z-10">
                  <div>
                    <h2 className="text-xl font-bold text-white">{selectedSkill.title}</h2>
                    <p className="text-slate-400 text-sm">{getCategoryName(selectedSkill.category_id)}</p>
                  </div>
                  <button onClick={() => setShowModal(false)} className="p-2 text-slate-500 hover:text-white rounded-lg">
                    <X size={20} />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  {/* Add New Gallery Item */}
                  <div>
                    <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                      <Image size={18} className="text-[#2ecc71]" />
                      Add Gallery Items
                    </h3>

                    <div className="flex gap-3 mb-6 items-start">
                      <select
                        value={newGalleryItem.type}
                        onChange={(e) => setNewGalleryItem({ ...newGalleryItem, type: e.target.value as 'image' | 'video' | 'link' })}
                        className="bg-slate-800/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#2ecc71]/50"
                      >
                        <option value="image">Image</option>
                        <option value="video">Video</option>
                        <option value="link">Link</option>
                      </select>

                      <div className="flex-1 flex flex-col gap-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newGalleryItem.url}
                            onChange={(e) => setNewGalleryItem({ ...newGalleryItem, url: e.target.value })}
                            className="flex-1 bg-slate-800/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#2ecc71]/50"
                            placeholder="Paste URL (Image, YouTube, Google Drive, etc.)"
                          />
                        </div>
                        {newGalleryItem.type === 'image' && (
                          <input
                            type="text"
                            value={newGalleryItem.alt_text}
                            onChange={(e) => setNewGalleryItem({ ...newGalleryItem, alt_text: e.target.value })}
                            className="w-full bg-slate-800/50 border border-white/10 rounded-lg py-2 px-3 text-white text-sm focus:outline-none focus:border-[#2ecc71]/50"
                            placeholder="Alt Text (SEO): Describe this image"
                          />
                        )}
                        <button
                          type="button"
                          onClick={handleAddGalleryItem}
                          disabled={addingGalleryItem || !newGalleryItem.url}
                          className="bg-[#2ecc71] text-slate-950 px-4 rounded-xl font-bold hover:bg-[#27ae60] disabled:opacity-50 h-[46px] w-fit flex items-center justify-center gap-2"
                        >
                          {addingGalleryItem && newGalleryItem.url ? (
                            <Loader2 size={18} className="animate-spin" />
                          ) : (
                            <><Plus size={18} /> Add</>
                          )}
                        </button>

                        {/* File Upload */}
                        {newGalleryItem.type !== 'link' && (
                          <>
                            <div className="flex items-center gap-3 my-2">
                              <div className="flex-1 h-px bg-white/10"></div>
                              <span className="text-slate-500 text-xs font-medium uppercase">or</span>
                              <div className="flex-1 h-px bg-white/10"></div>
                            </div>

                            <label className="flex flex-col items-center justify-center gap-3 p-6 bg-slate-800/30 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:bg-slate-800/50 hover:border-[#2ecc71]/40 transition-all w-full group">
                              {addingGalleryItem && !newGalleryItem.url ? (
                                <Loader2 size={32} className="text-[#2ecc71] animate-spin" />
                              ) : (
                                <div className="p-3 bg-[#2ecc71]/10 rounded-full group-hover:bg-[#2ecc71]/20 transition-all">
                                  <Upload size={24} className="text-[#2ecc71]" />
                                </div>
                              )}
                              <div className="text-center">
                                <span className="text-white font-semibold block">
                                  Click to upload {newGalleryItem.type === 'image' ? 'Images' : 'Videos'}
                                </span>
                                <span className="text-slate-500 text-xs mt-1 block">
                                  {newGalleryItem.type === 'image' ? 'PNG, JPG, WEBP up to 10MB' : 'MP4, WEBM up to 50MB'}
                                </span>
                                <span className="text-[#2ecc71] text-xs mt-1 block font-semibold">
                                  Multiple files supported
                                </span>
                              </div>
                              <input
                                type="file"
                                accept={newGalleryItem.type === 'image' ? "image/*" : "video/*"}
                                onChange={handleGalleryFileUpload}
                                className="hidden"
                                disabled={addingGalleryItem}
                                multiple
                              />
                            </label>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Gallery Grid */}
                  <div>
                    <h3 className="text-white font-bold mb-4">Current Gallery ({galleryItems.length})</h3>
                    {galleryItems.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {galleryItems.map((item) => (
                          <div key={item.id} className="relative group aspect-video bg-slate-800 rounded-lg overflow-hidden border border-white/10">
                            {item.type === 'image' ? (
                              <img src={item.url} alt={item.alt_text || 'Gallery item'} className="w-full h-full object-cover" />
                            ) : item.type === 'video' ? (
                              <div className="w-full h-full flex items-center justify-center bg-slate-900">
                                <div className="text-slate-500 flex flex-col items-center">
                                  <span className="text-xs">Video</span>
                                </div>
                              </div>
                            ) : (
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full h-full flex items-center justify-center bg-slate-900 hover:bg-slate-800 transition-colors"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className="text-[#2ecc71] flex flex-col items-center gap-2">
                                  <ExternalLink size={24} />
                                  <span className="text-xs text-slate-400 max-w-[80%] truncate px-2">{item.url}</span>
                                </div>
                              </a>
                            )}
                            <button
                              type="button"
                              onClick={() => setDeleteConfirm(item.id)}
                              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-500 text-sm italic">No gallery items added yet.</p>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {deleteConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
              onClick={() => setDeleteConfirm(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-sm p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-bold text-white mb-2">Delete Gallery Item?</h3>
                <p className="text-slate-400 mb-6">This action cannot be undone.</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="flex-1 py-3 border border-white/10 text-white rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDeleteGalleryItem(deleteConfirm)}
                    className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold"
                  >
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

// Structure Manager Component
function StructureManager({ onClose, categories: initialCategories, subSkills: initialSubSkills }: { onClose: () => void, categories: SkillCategory[], subSkills: SubSkill[] }) {
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
                    <button onClick={() => { setEditingId(cat.id); setCatForm({ title: cat.title, is_active: Boolean(cat.is_active), order_index: cat.order_index }); }} className="p-2 text-[#2ecc71] hover:bg-[#2ecc71]/10 rounded"><Edit2 size={16} /></button>
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
                                  order_index: skill.order_index,
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
          )}
          </div>
      </motion.div>
  </motion.div>
);
}
