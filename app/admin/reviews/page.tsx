"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Plus, Edit2, Trash2, Search, Loader2, X,
  MessageSquare, ArrowLeft, Save, Star, User
} from 'lucide-react';
import ProtectedRoute from '../../../components/admin/ProtectedRoute';
import { supabase } from '../../../lib/supabase';

interface Review {
  id: string;
  client_name: string;
  client_title: string;
  client_company: string;
  client_image: string | null;
  rating: number;
  review_text: string;
  platform: string;
  date: string;
  is_featured: boolean;
  order_index: number;
}

export default function ReviewsManagement() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    client_name: '',
    client_title: '',
    client_company: '',
    client_image: '',
    rating: 5,
    review_text: '',
    platform: 'Fiverr',
    date: '',
    is_featured: false,
    order_index: 0
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews() {
    if (!supabase) {
      setReviews([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
    setLoading(false);
  }

  const filteredReviews = reviews.filter(review =>
    review.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    review.review_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
    review.platform.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenModal = (review?: Review) => {
    if (review) {
      setEditingReview(review);
      setFormData({
        client_name: review.client_name,
        client_title: review.client_title,
        client_company: review.client_company,
        client_image: review.client_image || '',
        rating: review.rating,
        review_text: review.review_text,
        platform: review.platform,
        date: review.date,
        is_featured: review.is_featured,
        order_index: review.order_index
      });
    } else {
      setEditingReview(null);
      setFormData({
        client_name: '',
        client_title: '',
        client_company: '',
        client_image: '',
        rating: 5,
        review_text: '',
        platform: 'Fiverr',
        date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        is_featured: false,
        order_index: reviews.length + 1
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingReview(null);
  };

  const handleSave = async () => {
    if (!formData.client_name || !formData.review_text) return;
    setSaving(true);

    const reviewData = {
      ...formData,
      client_image: formData.client_image || null
    };

    if (!supabase) {
      if (editingReview) {
        setReviews(reviews.map(r => r.id === editingReview.id ? { ...r, ...reviewData } : r));
      } else {
        setReviews([...reviews, { id: Date.now().toString(), ...reviewData }]);
      }
      handleCloseModal();
      setSaving(false);
      return;
    }

    try {
      if (editingReview) {
        const { error } = await supabase.from('reviews').update(reviewData).eq('id', editingReview.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('reviews').insert(reviewData);
        if (error) throw error;
      }
      await fetchReviews();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving review:', error);
      alert('Error saving review. Please try again.');
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!supabase) {
      setReviews(reviews.filter(r => r.id !== id));
      setDeleteConfirm(null);
      return;
    }

    try {
      const { error } = await supabase.from('reviews').delete().eq('id', id);
      if (error) throw error;
      await fetchReviews();
    } catch (error) {
      console.error('Error deleting review:', error);
    }
    setDeleteConfirm(null);
  };

  const platformOptions = ['Fiverr', 'Upwork', 'LinkedIn', 'Google', 'Direct', 'Other'];

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
              <h1 className="text-3xl font-black text-white uppercase tracking-tight">Reviews</h1>
            </div>
            <p className="text-slate-400">Manage client reviews and testimonials</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-[#2ecc71] text-slate-950 px-6 py-3 rounded-xl font-bold text-sm hover:scale-105 active:scale-95 transition-all"
          >
            <Plus size={18} />
            Add Review
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
          <input
            type="text"
            placeholder="Search reviews..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/60 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-[#2ecc71]/50 transition-all"
          />
        </div>

        {/* Reviews List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#2ecc71] animate-spin" />
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="text-center py-20">
            <MessageSquare className="w-16 h-16 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500">No reviews found</p>
            <p className="text-slate-600 text-sm mt-1">Add your first client review</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredReviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-slate-900/60 border border-white/5 rounded-xl p-5 hover:border-white/20 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-[#2ecc71]/10 rounded-full flex items-center justify-center">
                        <User size={20} className="text-[#2ecc71]" />
                      </div>
                      <div>
                        <h3 className="text-white font-bold">{review.client_name}</h3>
                        <p className="text-slate-500 text-sm">{review.client_title} at {review.client_company}</p>
                      </div>
                      {review.is_featured && (
                        <span className="px-2 py-0.5 bg-[#2ecc71]/10 text-[#2ecc71] text-[10px] font-bold rounded-full uppercase">
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-slate-600'}
                        />
                      ))}
                      <span className="text-slate-500 text-sm ml-2">{review.platform}</span>
                      <span className="text-slate-600 text-sm">• {review.date}</span>
                    </div>
                    <p className="text-slate-400 text-sm line-clamp-2">{review.review_text}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenModal(review)}
                      className="p-2 text-slate-500 hover:text-[#2ecc71] hover:bg-[#2ecc71]/10 rounded-lg transition-all"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(review.id)}
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
                    {editingReview ? 'Edit Review' : 'Add New Review'}
                  </h2>
                  <button onClick={handleCloseModal} className="p-2 text-slate-500 hover:text-white rounded-lg">
                    <X size={20} />
                  </button>
                </div>

                <div className="p-6 space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Client Name *</label>
                      <input
                        type="text"
                        value={formData.client_name}
                        onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                        className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#2ecc71]/50"
                        placeholder="e.g., John Doe"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Title</label>
                      <input
                        type="text"
                        value={formData.client_title}
                        onChange={(e) => setFormData({ ...formData, client_title: e.target.value })}
                        className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#2ecc71]/50"
                        placeholder="e.g., CEO"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Company</label>
                      <input
                        type="text"
                        value={formData.client_company}
                        onChange={(e) => setFormData({ ...formData, client_company: e.target.value })}
                        className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#2ecc71]/50"
                        placeholder="e.g., Tech Corp"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Platform</label>
                      <select
                        value={formData.platform}
                        onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                        className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#2ecc71]/50"
                      >
                        {platformOptions.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Date</label>
                      <input
                        type="text"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#2ecc71]/50"
                        placeholder="e.g., January 2025"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setFormData({ ...formData, rating: r })}
                          className="p-2"
                        >
                          <Star
                            size={24}
                            className={r <= formData.rating ? 'text-yellow-500 fill-yellow-500' : 'text-slate-600'}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Review Text *</label>
                    <textarea
                      value={formData.review_text}
                      onChange={(e) => setFormData({ ...formData, review_text: e.target.value })}
                      rows={4}
                      className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#2ecc71]/50 resize-none"
                      placeholder="What did the client say..."
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.is_featured}
                      onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                      className="w-5 h-5 rounded bg-slate-800 border-white/10"
                    />
                    <label htmlFor="featured" className="text-slate-400">Mark as featured review</label>
                  </div>
                </div>

                <div className="p-6 border-t border-white/10 flex gap-3">
                  <button onClick={handleCloseModal} className="flex-1 py-3 border border-white/10 text-white rounded-xl font-medium hover:bg-white/5">
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving || !formData.client_name || !formData.review_text}
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
                <h3 className="text-xl font-bold text-white mb-2">Delete Review?</h3>
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
