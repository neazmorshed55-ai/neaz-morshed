"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Plus, Edit2, Trash2, Search, Loader2, X,
  Briefcase, ArrowLeft, ExternalLink, Save
} from 'lucide-react';
import ProtectedRoute from '../../../components/admin/ProtectedRoute';
import { supabase } from '../../../lib/supabase';

interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon: string;
  cover_image: string | null;
  cover_image_alt_text: string | null;
  order_index: number;
}

const defaultServices: Service[] = [
  { id: '1', title: 'Video Production', slug: 'video-production', description: 'Professional video editing and production services', icon: 'Video', cover_image: null, cover_image_alt_text: null, order_index: 1 },
  { id: '2', title: 'Graphic Design', slug: 'graphic-design', description: 'Creative graphic design services', icon: 'Layout', cover_image: null, cover_image_alt_text: null, order_index: 2 },
  { id: '3', title: 'Content Writing', slug: 'content-writing', description: 'Professional content writing services', icon: 'Briefcase', cover_image: null, cover_image_alt_text: null, order_index: 3 },
  { id: '4', title: 'eBook Design', slug: 'ebook-design', description: 'Professional eBook formatting and design', icon: 'Database', cover_image: null, cover_image_alt_text: null, order_index: 4 },
  { id: '5', title: 'Virtual Assistant', slug: 'virtual-assistant', description: 'Comprehensive virtual assistance services', icon: 'Briefcase', cover_image: null, cover_image_alt_text: null, order_index: 5 },
  { id: '6', title: 'Social Media Marketing', slug: 'social-media-marketing', description: 'Strategic social media marketing services', icon: 'Target', cover_image: null, cover_image_alt_text: null, order_index: 6 },
  { id: '7', title: 'Web Design', slug: 'web-design', description: 'Professional website design', icon: 'Layout', cover_image: null, cover_image_alt_text: null, order_index: 7 },
];

const iconOptions = ['Video', 'Layout', 'Briefcase', 'Database', 'Target', 'Search', 'Star', 'Wrench'];

export default function ServicesManagement() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    icon: 'Briefcase',
    cover_image: '',
    cover_image_alt_text: '',
    order_index: 0
  });

  useEffect(() => {
    fetchServices();
  }, []);

  async function fetchServices() {
    if (!supabase) {
      setServices(defaultServices);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setServices(data || defaultServices);
    } catch (error) {
      console.error('Error fetching services:', error);
      setServices(defaultServices);
    }
    setLoading(false);
  }

  const filteredServices = services.filter(service =>
    service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const handleOpenModal = (service?: Service) => {
    if (service) {
      setEditingService(service);
      setFormData({
        title: service.title,
        slug: service.slug,
        description: service.description,
        icon: service.icon,
        cover_image: service.cover_image || '',
        cover_image_alt_text: service.cover_image_alt_text || '',
        order_index: service.order_index
      });
    } else {
      setEditingService(null);
      setFormData({
        title: '',
        slug: '',
        description: '',
        icon: 'Briefcase',
        cover_image: '',
        cover_image_alt_text: '',
        order_index: services.length + 1
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingService(null);
    setFormData({
      title: '',
      slug: '',
      description: '',
      icon: 'Briefcase',
      cover_image: '',
      cover_image_alt_text: '',
      order_index: 0
    });
  };

  const handleSave = async () => {
    if (!formData.title || !formData.slug) return;

    setSaving(true);

    if (!supabase) {
      // Simulate save for demo
      if (editingService) {
        setServices(services.map(s =>
          s.id === editingService.id
            ? { ...s, ...formData, cover_image: formData.cover_image || null, cover_image_alt_text: formData.cover_image_alt_text || null }
            : s
        ));
      } else {
        const newService: Service = {
          id: Date.now().toString(),
          ...formData,
          cover_image: formData.cover_image || null,
          cover_image_alt_text: formData.cover_image_alt_text || null
        };
        setServices([...services, newService]);
      }
      handleCloseModal();
      setSaving(false);
      return;
    }

    try {
      if (editingService) {
        const { error } = await supabase
          .from('services')
          .update({
            title: formData.title,
            slug: formData.slug,
            description: formData.description,
            icon: formData.icon,
            cover_image: formData.cover_image || null,
            cover_image_alt_text: formData.cover_image_alt_text || null,
            order_index: formData.order_index
          })
          .eq('id', editingService.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('services')
          .insert({
            title: formData.title,
            slug: formData.slug,
            description: formData.description,
            icon: formData.icon,
            cover_image: formData.cover_image || null,
            cover_image_alt_text: formData.cover_image_alt_text || null,
            order_index: formData.order_index
          });

        if (error) throw error;
      }

      await fetchServices();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving service:', error);
      alert('Error saving service. Please try again.');
    }

    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!supabase) {
      setServices(services.filter(s => s.id !== id));
      setDeleteConfirm(null);
      return;
    }

    try {
      const { error } = await supabase.from('services').delete().eq('id', id);
      if (error) throw error;
      await fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('Error deleting service. Please try again.');
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
              <h1 className="text-3xl font-black text-white uppercase tracking-tight">Services</h1>
            </div>
            <p className="text-slate-400">Manage your service offerings</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-[#2ecc71] text-slate-950 px-6 py-3 rounded-xl font-bold text-sm hover:scale-105 active:scale-95 transition-all"
          >
            <Plus size={18} />
            Add Service
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
          <input
            type="text"
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/60 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-[#2ecc71]/50 transition-all"
          />
        </div>

        {/* Services List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#2ecc71] animate-spin" />
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-20">
            <Briefcase className="w-16 h-16 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500">No services found</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-slate-900/60 border border-white/5 rounded-xl p-5 flex items-center justify-between hover:border-white/20 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#2ecc71]/10 rounded-xl flex items-center justify-center">
                    <Briefcase size={24} className="text-[#2ecc71]" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold">{service.title}</h3>
                    <p className="text-slate-500 text-sm line-clamp-1">{service.description}</p>
                    <p className="text-slate-600 text-xs mt-1">/{service.slug}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={`https://neaz-morshed.vercel.app/services/${service.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                  >
                    <ExternalLink size={18} />
                  </a>
                  <button
                    onClick={() => handleOpenModal(service)}
                    className="p-2 text-slate-500 hover:text-[#2ecc71] hover:bg-[#2ecc71]/10 rounded-lg transition-all"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(service.id)}
                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
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
                    {editingService ? 'Edit Service' : 'Add New Service'}
                  </h2>
                  <button
                    onClick={handleCloseModal}
                    className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                  >
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
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          title: e.target.value,
                          slug: !editingService ? generateSlug(e.target.value) : formData.slug
                        });
                      }}
                      className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-slate-500 focus:outline-none focus:border-[#2ecc71]/50 transition-all"
                      placeholder="e.g., Video Production"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                      Slug *
                    </label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-slate-500 focus:outline-none focus:border-[#2ecc71]/50 transition-all"
                      placeholder="e.g., video-production"
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
                      className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-slate-500 focus:outline-none focus:border-[#2ecc71]/50 transition-all resize-none"
                      placeholder="Brief description of the service..."
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                      Icon
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {iconOptions.map((icon) => (
                        <button
                          key={icon}
                          type="button"
                          onClick={() => setFormData({ ...formData, icon })}
                          className={`p-3 rounded-xl text-center text-sm font-medium transition-all ${
                            formData.icon === icon
                              ? 'bg-[#2ecc71] text-slate-950'
                              : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800'
                          }`}
                        >
                          {icon}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                      Cover Image URL
                    </label>
                    <input
                      type="text"
                      value={formData.cover_image}
                      onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                      className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-slate-500 focus:outline-none focus:border-[#2ecc71]/50 transition-all"
                      placeholder="https://..."
                    />
                    {formData.cover_image && (
                      <input
                        type="text"
                        value={formData.cover_image_alt_text}
                        onChange={(e) => setFormData({ ...formData, cover_image_alt_text: e.target.value })}
                        className="w-full mt-3 bg-slate-800/50 border border-white/10 rounded-xl py-2 px-4 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-[#2ecc71]/50 transition-all"
                        placeholder="Alt Text (SEO): e.g., Video production service cover"
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                      Order Index
                    </label>
                    <input
                      type="number"
                      value={formData.order_index}
                      onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                      className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-slate-500 focus:outline-none focus:border-[#2ecc71]/50 transition-all"
                    />
                  </div>
                </div>

                <div className="p-6 border-t border-white/10 flex gap-3">
                  <button
                    onClick={handleCloseModal}
                    className="flex-1 py-3 border border-white/10 text-white rounded-xl font-medium hover:bg-white/5 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving || !formData.title || !formData.slug}
                    className="flex-1 py-3 bg-[#2ecc71] text-slate-950 rounded-xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {saving ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Save size={18} />
                        Save
                      </>
                    )}
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
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-sm p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-bold text-white mb-2">Delete Service?</h3>
                <p className="text-slate-400 mb-6">This action cannot be undone. All portfolio items under this service will also be deleted.</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="flex-1 py-3 border border-white/10 text-white rounded-xl font-medium hover:bg-white/5 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(deleteConfirm)}
                    className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-all"
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
