"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Plus, Edit2, Trash2, Search, Loader2, X,
  ArrowLeft, Save, Image, Upload, ChevronUp, ChevronDown, Eye
} from 'lucide-react';
import ProtectedRoute from '../../../components/admin/ProtectedRoute';
import { supabase } from '../../../lib/supabase';

interface SlideItem {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  video_url: string | null;
  order_index: number;
  is_active: boolean;
  created_at: string;
}

export default function SlideManagement() {
  const [slides, setSlides] = useState<SlideItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingSlide, setEditingSlide] = useState<SlideItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    video_url: '',
    is_active: true,
    order_index: 0
  });

  useEffect(() => {
    fetchSlides();
  }, []);

  async function fetchSlides() {
    if (!supabase) {
      setLoading(false);
      return;
    }

    try {
      // Fetch ALL portfolio_items (no limit)
      const { data, error } = await supabase
        .from('portfolio_items')
        .select('id, title, description, image_url, video_url, order_index, created_at')
        .order('order_index', { ascending: true });

      if (error) throw error;

      if (data) {
        const slidesData = data.map(item => ({
          ...item,
          is_active: true
        }));
        setSlides(slidesData);
      }
    } catch (error) {
      console.error('Error fetching slides:', error);
    }
    setLoading(false);
  }

  const filteredSlides = slides.filter(slide =>
    slide.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenModal = (slide?: SlideItem) => {
    if (slide) {
      setEditingSlide(slide);
      setFormData({
        title: slide.title,
        description: slide.description || '',
        image_url: slide.image_url || '',
        video_url: slide.video_url || '',
        is_active: slide.is_active,
        order_index: slide.order_index
      });
    } else {
      setEditingSlide(null);
      setFormData({
        title: '',
        description: '',
        image_url: '',
        video_url: '',
        is_active: true,
        order_index: slides.length + 1
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSlide(null);
  };

  const handleSave = async () => {
    if (!formData.title) {
      alert('Title is required');
      return;
    }

    setSaving(true);

    const slideData = {
      title: formData.title,
      description: formData.description || null,
      image_url: formData.image_url || null,
      video_url: formData.video_url || null,
      order_index: formData.order_index
    };

    if (!supabase) {
      handleCloseModal();
      setSaving(false);
      return;
    }

    try {
      if (editingSlide) {
        const { error } = await supabase
          .from('portfolio_items')
          .update(slideData)
          .eq('id', editingSlide.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('portfolio_items')
          .insert(slideData);

        if (error) throw error;
      }

      await fetchSlides();
      handleCloseModal();
    } catch (error: any) {
      console.error('Error saving slide:', error);
      alert(`Error saving slide: ${error?.message || 'Unknown error'}`);
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!supabase) {
      setDeleteConfirm(null);
      return;
    }

    try {
      const { error } = await supabase
        .from('portfolio_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchSlides();
    } catch (error) {
      console.error('Error deleting slide:', error);
    }
    setDeleteConfirm(null);
  };

  const uploadFile = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `slide-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `slides/${fileName}`;

    const { error: uploadError } = await supabase!.storage
      .from('images')
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data } = supabase!.storage.from('images').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !supabase) return;

    setUploadingImage(true);
    try {
      const publicUrl = await uploadFile(file);
      setFormData({ ...formData, image_url: publicUrl });
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image. Please try again.');
    }
    setUploadingImage(false);
  };

  const handleMoveSlide = async (index: number, direction: 'up' | 'down') => {
    if (!supabase) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= slides.length) return;

    const newSlides = [...slides];
    [newSlides[index], newSlides[newIndex]] = [newSlides[newIndex], newSlides[index]];

    try {
      await Promise.all([
        supabase
          .from('portfolio_items')
          .update({ order_index: newIndex })
          .eq('id', slides[index].id),
        supabase
          .from('portfolio_items')
          .update({ order_index: index })
          .eq('id', slides[newIndex].id)
      ]);

      setSlides(newSlides.map((item, idx) => ({ ...item, order_index: idx })));
    } catch (error) {
      console.error('Error reordering slides:', error);
      alert('Error reordering slides');
    }
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
                Slide Management
              </h1>
            </div>
            <p className="text-slate-400">
              Manage all portfolio images/videos for the iPad showcase
            </p>
            <Link
              href="/"
              target="_blank"
              className="text-[#2ecc71] text-sm hover:underline flex items-center gap-1 mt-1"
            >
              <Eye size={14} />
              Preview on homepage
            </Link>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-[#2ecc71] text-slate-950 px-6 py-3 rounded-xl font-bold text-sm hover:scale-105 active:scale-95 transition-all"
          >
            <Plus size={18} />
            Add Slide
          </button>
        </div>

        {/* Info Box */}
        <div className="bg-[#2ecc71]/10 border border-[#2ecc71]/30 rounded-xl p-4 mb-6">
          <p className="text-[#2ecc71] text-sm">
            <strong>Note:</strong> All portfolio items will be shown in the iPad showcase (12 items at a time with automatic pagination).
            Use the up/down arrows to reorder slides. Current total slides: <strong>{slides.length}</strong>
          </p>
        </div>

        {/* Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input
              type="text"
              placeholder="Search slides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/60 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-[#2ecc71]/50 transition-all"
            />
          </div>
        </div>

        {/* Slides List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#2ecc71] animate-spin" />
          </div>
        ) : filteredSlides.length === 0 ? (
          <div className="text-center py-20">
            <Image className="w-16 h-16 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500">No slides found</p>
            <p className="text-slate-600 text-sm mt-1">Add your first slide to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredSlides.map((slide, index) => (
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="bg-slate-900/60 border border-white/5 rounded-xl overflow-hidden hover:border-white/20 transition-all"
              >
                {/* Order Badge */}
                <div className="absolute top-2 left-2 z-10 bg-[#2ecc71] text-slate-950 px-2 py-1 rounded-full text-xs font-bold">
                  #{index + 1}
                </div>

                {/* Image/Video Preview */}
                <div className="aspect-video bg-slate-800 relative">
                  {slide.image_url ? (
                    <img src={slide.image_url} alt={slide.title} className="w-full h-full object-cover" />
                  ) : slide.video_url ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-[#2ecc71] text-sm">Video</div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Image size={40} className="text-slate-600" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-white font-bold mb-1 line-clamp-1">{slide.title}</h3>
                  <p className="text-slate-400 text-xs line-clamp-2 mb-3">{slide.description}</p>

                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    {/* Reorder Buttons */}
                    <div className="flex gap-1">
                      {index > 0 && (
                        <button
                          onClick={() => handleMoveSlide(index, 'up')}
                          className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 rounded-lg"
                          title="Move up"
                        >
                          <ChevronUp size={16} />
                        </button>
                      )}
                      {index < slides.length - 1 && (
                        <button
                          onClick={() => handleMoveSlide(index, 'down')}
                          className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 rounded-lg"
                          title="Move down"
                        >
                          <ChevronDown size={16} />
                        </button>
                      )}
                    </div>

                    {/* Edit/Delete */}
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleOpenModal(slide)}
                        className="p-2 text-slate-500 hover:text-[#2ecc71] hover:bg-[#2ecc71]/10 rounded-lg"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(slide.id)}
                        className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
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
                className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">
                    {editingSlide ? 'Edit Slide' : 'Add New Slide'}
                  </h2>
                  <button onClick={handleCloseModal} className="p-2 text-slate-500 hover:text-white rounded-lg">
                    <X size={20} />
                  </button>
                </div>

                <div className="p-6 space-y-5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#2ecc71]/50"
                      placeholder="e.g., Video Editing Project"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#2ecc71]/50 resize-none"
                      placeholder="Brief description of the project..."
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                      Image
                    </label>
                    <div className="flex items-start gap-4">
                      <div className="w-32 h-20 rounded-xl bg-slate-800/50 border-2 border-dashed border-white/20 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {formData.image_url ? (
                          <img
                            src={formData.image_url}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Image size={24} className="text-slate-600" />
                        )}
                      </div>

                      <div className="flex-1 space-y-2">
                        <label className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-white/10 rounded-xl cursor-pointer hover:bg-slate-800 hover:border-[#2ecc71]/30 transition-all w-fit">
                          {uploadingImage ? (
                            <Loader2 size={18} className="text-[#2ecc71] animate-spin" />
                          ) : (
                            <Upload size={18} className="text-[#2ecc71]" />
                          )}
                          <span className="text-slate-400 text-sm">
                            {uploadingImage ? 'Uploading...' : 'Upload Image'}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            disabled={uploadingImage}
                          />
                        </label>

                        <div className="flex items-center gap-2">
                          <span className="text-slate-600 text-xs">or</span>
                          <input
                            type="text"
                            value={formData.image_url}
                            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                            className="flex-1 bg-slate-800/50 border border-white/10 rounded-lg py-2 px-3 text-white text-sm focus:outline-none focus:border-[#2ecc71]/50"
                            placeholder="Paste image URL..."
                          />
                          {formData.image_url && (
                            <button
                              type="button"
                              onClick={() => setFormData({ ...formData, image_url: '' })}
                              className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                            >
                              <X size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                      Video URL (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.video_url}
                      onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                      className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#2ecc71]/50"
                      placeholder="YouTube, Vimeo, or direct video URL..."
                    />
                  </div>
                </div>

                <div className="p-6 border-t border-white/10 flex gap-3">
                  <button
                    onClick={handleCloseModal}
                    className="flex-1 py-3 border border-white/10 text-white rounded-xl font-medium hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving || !formData.title}
                    className="flex-1 py-3 bg-[#2ecc71] text-slate-950 rounded-xl font-bold disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save size={18} /> Save</>}
                  </button>
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
                <h3 className="text-xl font-bold text-white mb-2">Delete Slide?</h3>
                <p className="text-slate-400 mb-6">
                  This action cannot be undone. The slide will be removed from the showcase.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="flex-1 py-3 border border-white/10 text-white rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(deleteConfirm)}
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
