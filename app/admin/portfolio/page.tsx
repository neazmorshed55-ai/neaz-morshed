"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Plus, Edit2, Trash2, Search, Loader2, X,
  Star, ArrowLeft, Save, Image, ExternalLink, Upload
} from 'lucide-react';
import ProtectedRoute from '../../../components/admin/ProtectedRoute';
import { supabase } from '../../../lib/supabase';

interface PortfolioItem {
  id: string;
  service_id: string;
  title: string;
  description: string;
  thumbnail_url: string | null;
  image_url: string | null;
  video_url: string | null;
  project_url: string | null;
  client_name: string | null;
  completion_date: string | null;
  duration: string | null;
  tools_used: string[];
  tags: string[];
  is_featured: boolean;
  order_index: number;
}

interface Service {
  id: string;
  title: string;
  slug: string;
}

interface GalleryItem {
  id: string;
  portfolio_item_id: string;
  url: string;
  type: 'image' | 'video';
  order_index: number;
}

export default function PortfolioManagement() {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterService, setFilterService] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [newGalleryItem, setNewGalleryItem] = useState({ url: '', type: 'image' as 'image' | 'video' });
  const [addingGalleryItem, setAddingGalleryItem] = useState(false);

  const [formData, setFormData] = useState({
    service_id: '',
    title: '',
    description: '',
    thumbnail_url: '',
    image_url: '',
    video_url: '',
    project_url: '',
    client_name: '',
    completion_date: '',
    duration: '',
    tools_used: '',
    tags: '',
    is_featured: false,
    order_index: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    if (!supabase) {
      setLoading(false);
      return;
    }

    try {
      const [itemsRes, servicesRes] = await Promise.all([
        supabase.from('portfolio_items').select('*').order('order_index', { ascending: true }),
        supabase.from('services').select('id, title, slug').order('title', { ascending: true })
      ]);

      if (itemsRes.data) setPortfolioItems(itemsRes.data);
      if (servicesRes.data) setServices(servicesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  }

  const filteredItems = portfolioItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.client_name && item.client_name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesService = filterService === 'all' || item.service_id === filterService;
    return matchesSearch && matchesService;
  });

  const getServiceName = (serviceId: string) => {
    if (serviceId === 'blog') return 'Blog';
    const service = services.find(s => s.id === serviceId);
    return service?.title || 'Unknown';
  };

  const handleOpenModal = (item?: PortfolioItem) => {
    if (item) {
      setEditingItem(item);
      fetchGalleryItems(item.id);
      setFormData({
        service_id: item.service_id,
        title: item.title,
        description: item.description || '',
        thumbnail_url: item.thumbnail_url || '',
        image_url: item.image_url || '',
        video_url: item.video_url || '',
        project_url: item.project_url || '',
        client_name: item.client_name || '',
        completion_date: item.completion_date || '',
        duration: item.duration || '',
        tools_used: item.tools_used?.join(', ') || '',
        tags: item.tags?.join(', ') || '',
        is_featured: item.is_featured,
        order_index: item.order_index
      });
    } else {
      setEditingItem(null);
      setGalleryItems([]);
      setFormData({
        service_id: services[0]?.id || '',
        title: '',
        description: '',
        thumbnail_url: '',
        image_url: '',
        video_url: '',
        project_url: '',
        client_name: '',
        completion_date: '',
        duration: '',
        tools_used: '',
        tags: '',
        is_featured: false,
        order_index: portfolioItems.length + 1
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.service_id) return;
    setSaving(true);

    const itemData = {
      service_id: formData.service_id,
      title: formData.title,
      description: formData.description || null,
      thumbnail_url: formData.thumbnail_url || null,
      image_url: formData.image_url || null,
      video_url: formData.video_url || null,
      project_url: formData.project_url || null,
      client_name: formData.client_name || null,
      completion_date: formData.completion_date || null,
      duration: formData.duration || null,
      tools_used: formData.tools_used.split(',').map(t => t.trim()).filter(t => t),
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
      is_featured: formData.is_featured,
      order_index: formData.order_index
    };

    if (!supabase) {
      handleCloseModal();
      setSaving(false);
      return;
    }

    try {
      if (editingItem) {
        const { data, error } = await supabase.from('portfolio_items').update(itemData).eq('id', editingItem.id).select();
        if (error) {
          console.error('Update error:', error);
          throw error;
        }
        console.log('Updated successfully:', data);
      } else {
        const { data, error } = await supabase.from('portfolio_items').insert(itemData).select();
        if (error) {
          console.error('Insert error:', error);
          throw error;
        }
        console.log('Inserted successfully:', data);
      }
      await fetchData();
      handleCloseModal();
    } catch (error: any) {
      console.error('Error saving portfolio item:', error);
      alert(`Error saving portfolio item: ${error?.message || 'Unknown error'}. Check console for details.`);
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!supabase) {
      setDeleteConfirm(null);
      return;
    }

    try {
      const { error } = await supabase.from('portfolio_items').delete().eq('id', id);
      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error deleting portfolio item:', error);
    }
    setDeleteConfirm(null);
  };

  const uploadFile = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `portfolio-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `portfolio/${fileName}`;

    const { error: uploadError } = await supabase!.storage
      .from('images')
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data } = supabase!.storage.from('images').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !supabase) return;

    setUploadingThumbnail(true);
    try {
      const publicUrl = await uploadFile(file);
      setFormData({ ...formData, thumbnail_url: publicUrl });
    } catch (error) {
      console.error('Error uploading thumbnail:', error);
      alert('Error uploading thumbnail. Please try again.');
    }
    setUploadingThumbnail(false);
  };

  const handleProjectImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !supabase) return;

    // Use a separate loading state or reuse one if appropriate, here creating a local scope loading effect or reusing generic saving/uploading could be better, but for now we'll reuse loading or add a new one. 
    // Let's add a new state for this if needed, or just reuse 'uploadingThumbnail' (renamed to generic) or add specific. 
    // Since I can't add state easily in this Replace block without changing top of file, let's assume I'll add 'uploadingProjectImage' state in another block or reuse 'uploadingThumbnail' with a comment or just set generic loading.
    // Better: Add `uploadingProjectImage` state. For now, I'll toggle `saving` to block inputs or just proceed. 
    // Actually, I should add the state. I will add it in the top block modification.

    // Using a temporary loading indicator setup
    const btn = e.target.parentElement;
    if (btn) btn.style.opacity = '0.5';

    try {
      const publicUrl = await uploadFile(file);
      setFormData({ ...formData, image_url: publicUrl });
    } catch (error) {
      console.error('Error uploading project image:', error);
      alert('Error uploading project image.');
    }
    if (btn) btn.style.opacity = '1';
  };

  const fetchGalleryItems = async (portfolioId: string) => {
    if (!supabase) return;
    const { data, error } = await supabase
      .from('portfolio_gallery')
      .select('*')
      .eq('portfolio_item_id', portfolioId)
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Error fetching gallery items:', error);
    } else if (data) {
      setGalleryItems(data as GalleryItem[]);
    }
  };

  const handleAddGalleryItem = async () => {
    if (!supabase || !editingItem) return;

    // Allow adding if URL is present OR if we are about to upload (handled separately? No, let's make it so you select file OR enter URL)
    if (!newGalleryItem.url) return;

    setAddingGalleryItem(true);
    try {
      const { data, error } = await supabase
        .from('portfolio_gallery')
        .insert({
          portfolio_item_id: editingItem.id,
          url: newGalleryItem.url,
          type: newGalleryItem.type,
          order_index: galleryItems.length
        })
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setGalleryItems([...galleryItems, data as GalleryItem]);
        setNewGalleryItem({ url: '', type: 'image' });
      }
    } catch (error) {
      console.error('Error adding gallery item:', error);
      alert('Error adding gallery item');
    }
    setAddingGalleryItem(false);
  };

  const handleGalleryFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !supabase || !editingItem) return;

    setAddingGalleryItem(true);
    try {
      const publicUrl = await uploadFile(file);

      // Immediately add to gallery
      const { data, error } = await supabase
        .from('portfolio_gallery')
        .insert({
          portfolio_item_id: editingItem.id,
          url: publicUrl,
          type: newGalleryItem.type, // 'image' or 'video'
          order_index: galleryItems.length
        })
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setGalleryItems([...galleryItems, data as GalleryItem]);
        // Reset isn't strictly needed for file input but good practice if we were using state for file
      }
    } catch (error) {
      console.error('Error uploading/adding gallery item:', error);
      alert('Error uploading gallery item');
    }
    setAddingGalleryItem(false);
    // Reset file input
    e.target.value = '';
  };

  const handleDeleteGalleryItem = async (id: string) => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from('portfolio_gallery')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setGalleryItems(galleryItems.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting gallery item:', error);
      alert('Error deleting gallery item');
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
              <h1 className="text-3xl font-black text-white uppercase tracking-tight">Portfolio Items</h1>
            </div>
            <p className="text-slate-400">Manage portfolio items across all services</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-[#2ecc71] text-slate-950 px-6 py-3 rounded-xl font-bold text-sm hover:scale-105 active:scale-95 transition-all"
          >
            <Plus size={18} />
            Add Portfolio Item
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input
              type="text"
              placeholder="Search portfolio items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/60 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-[#2ecc71]/50 transition-all"
            />
          </div>
          <select
            value={filterService}
            onChange={(e) => setFilterService(e.target.value)}
            className="bg-slate-900/60 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#2ecc71]/50"
          >
            <option value="all">All Services</option>
            {services.map(s => (
              <option key={s.id} value={s.id}>{s.title}</option>
            ))}
            <option value="blog">Blog</option>
          </select>
        </div>

        {/* Portfolio Items List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#2ecc71] animate-spin" />
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20">
            <Star className="w-16 h-16 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500">No portfolio items found</p>
            <p className="text-slate-600 text-sm mt-1">Add your first portfolio item</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="bg-slate-900/60 border border-white/5 rounded-xl overflow-hidden hover:border-white/20 transition-all"
              >
                {/* Thumbnail */}
                <div className="aspect-video bg-slate-800 relative">
                  {item.thumbnail_url ? (
                    <img src={item.thumbnail_url} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Image size={40} className="text-slate-600" />
                    </div>
                  )}
                  {item.is_featured && (
                    <span className="absolute top-2 right-2 px-2 py-1 bg-[#2ecc71] text-slate-950 text-[10px] font-bold rounded-full uppercase">
                      Featured
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-white font-bold mb-1 line-clamp-1">{item.title}</h3>
                  <p className="text-slate-500 text-sm mb-2">{getServiceName(item.service_id)}</p>
                  {item.client_name && (
                    <p className="text-slate-400 text-xs">Client: {item.client_name}</p>
                  )}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                    <div className="flex gap-1">
                      {item.project_url && (
                        <a
                          href={item.project_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-lg"
                        >
                          <ExternalLink size={16} />
                        </a>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleOpenModal(item)}
                        className="p-2 text-slate-500 hover:text-[#2ecc71] hover:bg-[#2ecc71]/10 rounded-lg"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(item.id)}
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
                    {editingItem ? 'Edit Portfolio Item' : 'Add New Portfolio Item'}
                  </h2>
                  <button onClick={handleCloseModal} className="p-2 text-slate-500 hover:text-white rounded-lg">
                    <X size={20} />
                  </button>
                </div>

                <div className="p-6 space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Service *</label>
                      <select
                        value={formData.service_id}
                        onChange={(e) => setFormData({ ...formData, service_id: e.target.value })}
                        className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#2ecc71]/50"
                      >
                        <option value="">Select a service</option>
                        {services.map(s => (
                          <option key={s.id} value={s.id}>{s.title}</option>
                        ))}
                        <option value="blog">Blog</option>
                      </select>
                    </div>

                    <div className="col-span-2">
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Title *</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#2ecc71]/50"
                        placeholder="e.g., Corporate Video Production"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Client Name</label>
                      <input
                        type="text"
                        value={formData.client_name}
                        onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                        className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#2ecc71]/50"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Completion Date</label>
                      <input
                        type="text"
                        value={formData.completion_date}
                        onChange={(e) => setFormData({ ...formData, completion_date: e.target.value })}
                        className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#2ecc71]/50"
                        placeholder="e.g., January 2025"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Description</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                        className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#2ecc71]/50 resize-none"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Thumbnail Image</label>
                      <div className="flex items-start gap-4">
                        {/* Preview */}
                        <div className="w-32 h-20 rounded-xl bg-slate-800/50 border-2 border-dashed border-white/20 flex items-center justify-center overflow-hidden flex-shrink-0">
                          {formData.thumbnail_url ? (
                            <img
                              src={formData.thumbnail_url}
                              alt="Thumbnail"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Image size={24} className="text-slate-600" />
                          )}
                        </div>
                        {/* Upload & URL */}
                        <div className="flex-1 space-y-2">
                          <label className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-white/10 rounded-xl cursor-pointer hover:bg-slate-800 hover:border-[#2ecc71]/30 transition-all w-fit">
                            {uploadingThumbnail ? (
                              <Loader2 size={18} className="text-[#2ecc71] animate-spin" />
                            ) : (
                              <Upload size={18} className="text-[#2ecc71]" />
                            )}
                            <span className="text-slate-400 text-sm">{uploadingThumbnail ? 'Uploading...' : 'Upload Image'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleThumbnailUpload}
                              className="hidden"
                              disabled={uploadingThumbnail}
                            />
                          </label>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-600 text-xs">or</span>
                            <input
                              type="text"
                              value={formData.thumbnail_url}
                              onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                              className="flex-1 bg-slate-800/50 border border-white/10 rounded-lg py-2 px-3 text-white text-sm focus:outline-none focus:border-[#2ecc71]/50"
                              placeholder="Paste URL..."
                            />
                            {formData.thumbnail_url && (
                              <button
                                type="button"
                                onClick={() => setFormData({ ...formData, thumbnail_url: '' })}
                                className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                              >
                                <X size={16} />
                              </button>
                            )}
                          </div>
                          <p className="text-slate-600 text-xs">Upload or paste URL. Auto thumbnail will show if empty.</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Project Detail Image (Optional)</label>
                      <div className="flex items-start gap-4 mb-2">
                        {/* Preview */}
                        <div className="w-32 h-20 rounded-xl bg-slate-800/50 border-2 border-dashed border-white/20 flex items-center justify-center overflow-hidden flex-shrink-0">
                          {formData.image_url ? (
                            <img
                              src={formData.image_url}
                              alt="Detail"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Image size={24} className="text-slate-600" />
                          )}
                        </div>
                        {/* Upload & URL */}
                        <div className="flex-1 space-y-2">
                          <label className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-white/10 rounded-xl cursor-pointer hover:bg-slate-800 hover:border-[#2ecc71]/30 transition-all w-fit">
                            <Upload size={18} className="text-[#2ecc71]" />
                            <span className="text-slate-400 text-sm">Upload Image</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleProjectImageUpload}
                              className="hidden"
                            />
                          </label>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-600 text-xs">or</span>
                            <input
                              type="text"
                              value={formData.image_url}
                              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                              className="flex-1 bg-slate-800/50 border border-white/10 rounded-lg py-2 px-3 text-white text-sm focus:outline-none focus:border-[#2ecc71]/50"
                              placeholder="Paste Image URL..."
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
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Project URL</label>
                      <input
                        type="text"
                        value={formData.project_url}
                        onChange={(e) => setFormData({ ...formData, project_url: e.target.value })}
                        className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#2ecc71]/50"
                        placeholder="https://..."
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Tools Used (comma separated)</label>
                      <input
                        type="text"
                        value={formData.tools_used}
                        onChange={(e) => setFormData({ ...formData, tools_used: e.target.value })}
                        className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#2ecc71]/50"
                        placeholder="e.g., Premiere Pro, After Effects"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Tags (comma separated)</label>
                      <input
                        type="text"
                        value={formData.tags}
                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                        className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#2ecc71]/50"
                        placeholder="e.g., Corporate, Video, Marketing"
                      />
                    </div>
                  </div>

                  {/* Gallery Management Section - Only show when editing an existing item */}
                  {editingItem && (
                    <div className="border-t border-white/10 pt-6 mt-6">
                      <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                        <Image size={18} className="text-[#2ecc71]" />
                        Gallery Images & Videos
                      </h3>

                      {/* Add New Gallery Item */}
                      <div className="flex gap-3 mb-6 items-start">
                        <select
                          value={newGalleryItem.type}
                          onChange={(e) => setNewGalleryItem({ ...newGalleryItem, type: e.target.value as 'image' | 'video' })}
                          className="bg-slate-800/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#2ecc71]/50 h-[46px]"
                        >
                          <option value="image">Image</option>
                          <option value="video">Video</option>
                        </select>

                        <div className="flex-1 flex flex-col gap-2">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={newGalleryItem.url}
                              onChange={(e) => setNewGalleryItem({ ...newGalleryItem, url: e.target.value })}
                              className="flex-1 bg-slate-800/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#2ecc71]/50"
                              placeholder={newGalleryItem.type === 'image' ? "Paste Image URL or Upload..." : "Paste Video URL (YouTube) or Upload..."}
                            />
                            <button
                              type="button"
                              onClick={handleAddGalleryItem}
                              disabled={addingGalleryItem || !newGalleryItem.url}
                              className="bg-[#2ecc71] text-slate-950 px-4 rounded-xl font-bold hover:bg-[#27ae60] disabled:opacity-50 h-[46px] w-[46px] flex items-center justify-center flex-shrink-0"
                            >
                              {addingGalleryItem && newGalleryItem.url ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                            </button>
                          </div>

                          {/* Upload Button */}
                          <label className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-800/50 border border-white/10 rounded-xl cursor-pointer hover:bg-slate-800 hover:border-[#2ecc71]/30 transition-all w-full">
                            {addingGalleryItem && !newGalleryItem.url ? (
                              <Loader2 size={16} className="text-[#2ecc71] animate-spin" />
                            ) : (
                              <Upload size={16} className="text-[#2ecc71]" />
                            )}
                            <span className="text-slate-400 text-sm">Upload {newGalleryItem.type === 'image' ? 'Image' : 'Video'}</span>
                            <input
                              type="file"
                              accept={newGalleryItem.type === 'image' ? "image/*" : "video/*"}
                              onChange={handleGalleryFileUpload}
                              className="hidden"
                              disabled={addingGalleryItem}
                            />
                          </label>
                        </div>
                      </div>

                      {/* Gallery Grid */}
                      {galleryItems.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {galleryItems.map((item) => (
                            <div key={item.id} className="relative group aspect-video bg-slate-800 rounded-lg overflow-hidden border border-white/10">
                              {item.type === 'image' ? (
                                <img src={item.url} alt="Gallery item" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-slate-900">
                                  <div className="text-slate-500 flex flex-col items-center">
                                    <span className="text-xs">Video</span>
                                  </div>
                                </div>
                              )}
                              <button
                                type="button"
                                onClick={() => handleDeleteGalleryItem(item.id)}
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
                  )}

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.is_featured}
                      onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                      className="w-5 h-5 rounded bg-slate-800 border-white/10"
                    />
                    <label htmlFor="featured" className="text-slate-400">Mark as featured</label>
                  </div>
                </div>

                <div className="p-6 border-t border-white/10 flex gap-3">
                  <button onClick={handleCloseModal} className="flex-1 py-3 border border-white/10 text-white rounded-xl font-medium hover:bg-white/5">
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving || !formData.title || !formData.service_id}
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
                <h3 className="text-xl font-bold text-white mb-2">Delete Portfolio Item?</h3>
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
