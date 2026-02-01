"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Plus, Edit2, Trash2, Search, Loader2, X,
  MessageSquare, ArrowLeft, Save, Star, User, Upload, Image as ImageIcon,
  FileSpreadsheet, Download, CheckCircle, AlertCircle
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
  country_code: string | null;
  country_name: string | null;
  city: string | null;
}

// Country list with codes for flag emojis
const countries = [
  { code: '', name: 'Not specified' },
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'IT', name: 'Italy' },
  { code: 'ES', name: 'Spain' },
  { code: 'SE', name: 'Sweden' },
  { code: 'NO', name: 'Norway' },
  { code: 'DK', name: 'Denmark' },
  { code: 'FI', name: 'Finland' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'AT', name: 'Austria' },
  { code: 'BE', name: 'Belgium' },
  { code: 'IE', name: 'Ireland' },
  { code: 'PT', name: 'Portugal' },
  { code: 'PL', name: 'Poland' },
  { code: 'CZ', name: 'Czech Republic' },
  { code: 'IN', name: 'India' },
  { code: 'BD', name: 'Bangladesh' },
  { code: 'PK', name: 'Pakistan' },
  { code: 'JP', name: 'Japan' },
  { code: 'CN', name: 'China' },
  { code: 'KR', name: 'South Korea' },
  { code: 'SG', name: 'Singapore' },
  { code: 'MY', name: 'Malaysia' },
  { code: 'ID', name: 'Indonesia' },
  { code: 'PH', name: 'Philippines' },
  { code: 'TH', name: 'Thailand' },
  { code: 'VN', name: 'Vietnam' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'QA', name: 'Qatar' },
  { code: 'KW', name: 'Kuwait' },
  { code: 'EG', name: 'Egypt' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'KE', name: 'Kenya' },
  { code: 'BR', name: 'Brazil' },
  { code: 'MX', name: 'Mexico' },
  { code: 'AR', name: 'Argentina' },
  { code: 'CO', name: 'Colombia' },
  { code: 'CL', name: 'Chile' },
  { code: 'NZ', name: 'New Zealand' },
  { code: 'IL', name: 'Israel' },
  { code: 'TR', name: 'Turkey' },
  { code: 'RU', name: 'Russia' },
  { code: 'UA', name: 'Ukraine' },
];

// Convert country code to flag emoji
const getFlagEmoji = (countryCode: string) => {
  if (!countryCode) return '';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

export default function ReviewsManagement() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showCsvModal, setShowCsvModal] = useState(false);
  const [csvData, setCsvData] = useState<any[]>([]);
  const [csvUploading, setCsvUploading] = useState(false);
  const [csvError, setCsvError] = useState<string | null>(null);
  const [csvSuccess, setCsvSuccess] = useState<number>(0);

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
    order_index: 0,
    country_code: '',
    country_name: '',
    city: ''
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
        order_index: review.order_index,
        country_code: review.country_code || '',
        country_name: review.country_name || '',
        city: review.city || ''
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
        order_index: reviews.length + 1,
        country_code: '',
        country_name: '',
        city: ''
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
      client_image: formData.client_image || null,
      country_code: formData.country_code || null,
      country_name: formData.country_name || null,
      city: formData.city || null
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

  const platformOptions = ['Fiverr', 'Upwork', 'LinkedIn', 'Facebook', 'Google', 'Direct', 'Other'];

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !supabase) return;

    setUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `client-${Date.now()}.${fileExt}`;
      const filePath = `reviews/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('images').getPublicUrl(filePath);
      setFormData({ ...formData, client_image: data.publicUrl });
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image. Please try again.');
    }
    setUploadingImage(false);
  };

  // CSV Parser
  const parseCSV = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];

    // Parse header row
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/['"]/g, ''));

    const data: any[] = [];
    for (let i = 1; i < lines.length; i++) {
      const values: string[] = [];
      let current = '';
      let inQuotes = false;

      // Handle quoted values with commas
      for (const char of lines[i]) {
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      values.push(current.trim());

      if (values.length >= 3) {
        const row: any = {};
        headers.forEach((header, idx) => {
          row[header] = values[idx]?.replace(/^["']|["']$/g, '') || '';
        });
        data.push(row);
      }
    }
    return data;
  };

  // Handle CSV file upload
  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCsvError(null);
    setCsvSuccess(0);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = parseCSV(text);

        if (parsed.length === 0) {
          setCsvError('No valid data found in CSV. Make sure the file has headers and data rows.');
          return;
        }

        // Map CSV columns to review fields
        const mappedData = parsed.map((row, index) => ({
          client_name: row.client_name || row.name || row.client || '',
          client_title: row.client_title || row.title || row.position || '',
          client_company: row.client_company || row.company || '',
          rating: parseInt(row.rating) || 5,
          review_text: row.review_text || row.review || row.text || row.testimonial || '',
          platform: row.platform || 'Direct',
          date: row.date || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
          country_code: row.country_code || '',
          country_name: row.country_name || row.country || '',
          city: row.city || '',
          is_featured: row.is_featured === 'true' || row.featured === 'true' || false,
          order_index: reviews.length + index + 1,
          client_image: null
        }));

        // Filter out rows without required fields
        const validData = mappedData.filter(row => row.client_name && row.review_text);

        if (validData.length === 0) {
          setCsvError('No valid reviews found. Each row must have client_name and review_text.');
          return;
        }

        setCsvData(validData);
      } catch (error) {
        setCsvError('Error parsing CSV file. Please check the format.');
      }
    };
    reader.readAsText(file);
  };

  // Bulk insert reviews from CSV
  const handleCsvBulkInsert = async () => {
    if (!supabase || csvData.length === 0) return;

    setCsvUploading(true);
    setCsvError(null);
    setCsvSuccess(0);

    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert(csvData.map(row => ({
          ...row,
          country_code: row.country_code || null,
          country_name: row.country_name || null,
          city: row.city || null
        })));

      if (error) throw error;

      setCsvSuccess(csvData.length);
      await fetchReviews();

      // Reset after 2 seconds
      setTimeout(() => {
        setShowCsvModal(false);
        setCsvData([]);
        setCsvSuccess(0);
      }, 2000);
    } catch (error) {
      console.error('Error bulk inserting reviews:', error);
      setCsvError('Error uploading reviews. Please try again.');
    }
    setCsvUploading(false);
  };

  // Download sample CSV template
  const downloadSampleCSV = () => {
    const headers = 'client_name,client_title,client_company,rating,review_text,platform,date,country_code,country_name,city,is_featured';
    const sample1 = '"John Doe","CEO","TechCorp",5,"Excellent work! Very professional and delivered on time.","Fiverr","January 2025","US","United States","New York",false';
    const sample2 = '"Jane Smith","Marketing Director","Digital Inc",5,"Amazing virtual assistant services. Highly recommended!","Upwork","February 2025","GB","United Kingdom","London",true';

    const csvContent = `${headers}\n${sample1}\n${sample2}`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reviews_template.csv';
    a.click();
    URL.revokeObjectURL(url);
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
              <h1 className="text-3xl font-black text-white uppercase tracking-tight">Reviews</h1>
            </div>
            <p className="text-slate-400">Manage client reviews and testimonials</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowCsvModal(true)}
              className="flex items-center gap-2 bg-slate-800 text-slate-300 px-5 py-3 rounded-xl font-bold text-sm hover:bg-slate-700 transition-all border border-white/10"
            >
              <FileSpreadsheet size={18} />
              Upload CSV
            </button>
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 bg-[#2ecc71] text-slate-950 px-6 py-3 rounded-xl font-bold text-sm hover:scale-105 active:scale-95 transition-all"
            >
              <Plus size={18} />
              Add Review
            </button>
          </div>
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
                      {review.client_image ? (
                        <img
                          src={review.client_image}
                          alt={review.client_name}
                          className="w-10 h-10 rounded-full object-cover border border-[#2ecc71]/30"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-[#2ecc71]/10 rounded-full flex items-center justify-center">
                          <User size={20} className="text-[#2ecc71]" />
                        </div>
                      )}
                      <div>
                        <h3 className="text-white font-bold">{review.client_name}</h3>
                        {review.country_code && (
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-sm">{getFlagEmoji(review.country_code)}</span>
                            <span className="text-slate-400 text-xs">
                              {review.city ? `${review.city}, ` : ''}{review.country_name}
                            </span>
                          </div>
                        )}
                        <p className="text-slate-500 text-sm mt-1">{review.client_title} at {review.client_company}</p>
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
                  {/* Client Image Upload */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Client Photo</label>
                    <div className="flex items-center gap-4">
                      {formData.client_image ? (
                        <div className="relative">
                          <img
                            src={formData.client_image}
                            alt="Client"
                            className="w-20 h-20 rounded-full object-cover border-2 border-[#2ecc71]/30"
                          />
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, client_image: '' })}
                            className="absolute -top-1 -right-1 p-1 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-slate-800/50 border-2 border-dashed border-white/20 flex items-center justify-center">
                          <User size={32} className="text-slate-600" />
                        </div>
                      )}
                      <div className="flex-1">
                        <label className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-white/10 rounded-xl cursor-pointer hover:bg-slate-800 hover:border-[#2ecc71]/30 transition-all">
                          {uploadingImage ? (
                            <Loader2 size={18} className="text-[#2ecc71] animate-spin" />
                          ) : (
                            <Upload size={18} className="text-[#2ecc71]" />
                          )}
                          <span className="text-slate-400 text-sm">{uploadingImage ? 'Uploading...' : 'Upload Photo'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            disabled={uploadingImage}
                          />
                        </label>
                        <p className="text-slate-600 text-xs mt-2">Recommended: Square image, min 200x200px</p>
                      </div>
                    </div>
                  </div>

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

                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Country</label>
                      <select
                        value={formData.country_code}
                        onChange={(e) => {
                          const selected = countries.find(c => c.code === e.target.value);
                          setFormData({
                            ...formData,
                            country_code: e.target.value,
                            country_name: selected?.name || ''
                          });
                        }}
                        className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#2ecc71]/50"
                      >
                        {countries.map(c => (
                          <option key={c.code} value={c.code}>
                            {c.code ? `${getFlagEmoji(c.code)} ${c.name}` : c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">City</label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#2ecc71]/50"
                        placeholder="e.g., New York"
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

        {/* CSV Upload Modal */}
        <AnimatePresence>
          {showCsvModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => { setShowCsvModal(false); setCsvData([]); setCsvError(null); }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white">Upload Reviews via CSV</h2>
                    <p className="text-slate-500 text-sm mt-1">Bulk import reviews from a CSV file</p>
                  </div>
                  <button
                    onClick={() => { setShowCsvModal(false); setCsvData([]); setCsvError(null); }}
                    className="p-2 text-slate-500 hover:text-white rounded-lg"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                  {/* Download Template */}
                  <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-white/5">
                    <div>
                      <h3 className="text-white font-medium">Download Sample Template</h3>
                      <p className="text-slate-500 text-sm">Get a CSV template with the correct format</p>
                    </div>
                    <button
                      onClick={downloadSampleCSV}
                      className="flex items-center gap-2 px-4 py-2 bg-[#2ecc71]/10 text-[#2ecc71] rounded-lg hover:bg-[#2ecc71]/20 transition-all text-sm font-medium"
                    >
                      <Download size={16} />
                      Download
                    </button>
                  </div>

                  {/* CSV File Upload */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                      Select CSV File
                    </label>
                    <label className="flex flex-col items-center justify-center w-full p-8 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-[#2ecc71]/50 hover:bg-slate-800/30 transition-all">
                      <FileSpreadsheet size={40} className="text-slate-500 mb-3" />
                      <span className="text-slate-400 text-sm">Click to upload or drag and drop</span>
                      <span className="text-slate-600 text-xs mt-1">CSV files only</span>
                      <input
                        type="file"
                        accept=".csv"
                        onChange={handleCsvUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Error Message */}
                  {csvError && (
                    <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                      <AlertCircle size={20} className="text-red-400" />
                      <p className="text-red-400 text-sm">{csvError}</p>
                    </div>
                  )}

                  {/* Success Message */}
                  {csvSuccess > 0 && (
                    <div className="flex items-center gap-3 p-4 bg-[#2ecc71]/10 border border-[#2ecc71]/30 rounded-xl">
                      <CheckCircle size={20} className="text-[#2ecc71]" />
                      <p className="text-[#2ecc71] text-sm">Successfully uploaded {csvSuccess} reviews!</p>
                    </div>
                  )}

                  {/* Preview Table */}
                  {csvData.length > 0 && !csvSuccess && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-white font-medium">Preview ({csvData.length} reviews)</h3>
                        <span className="text-[#2ecc71] text-sm">{csvData.length} valid rows found</span>
                      </div>
                      <div className="overflow-x-auto rounded-xl border border-white/10">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-slate-800/50 text-left">
                              <th className="px-4 py-3 text-slate-400 font-medium">#</th>
                              <th className="px-4 py-3 text-slate-400 font-medium">Client Name</th>
                              <th className="px-4 py-3 text-slate-400 font-medium">Company</th>
                              <th className="px-4 py-3 text-slate-400 font-medium">Rating</th>
                              <th className="px-4 py-3 text-slate-400 font-medium">Platform</th>
                              <th className="px-4 py-3 text-slate-400 font-medium">Country</th>
                            </tr>
                          </thead>
                          <tbody>
                            {csvData.slice(0, 10).map((row, idx) => (
                              <tr key={idx} className="border-t border-white/5">
                                <td className="px-4 py-3 text-slate-500">{idx + 1}</td>
                                <td className="px-4 py-3 text-white">{row.client_name}</td>
                                <td className="px-4 py-3 text-slate-400">{row.client_company || '-'}</td>
                                <td className="px-4 py-3">
                                  <div className="flex gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                      <Star key={i} size={12} className={i < row.rating ? 'text-yellow-500 fill-yellow-500' : 'text-slate-600'} />
                                    ))}
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-slate-400">{row.platform}</td>
                                <td className="px-4 py-3 text-slate-400">
                                  {row.country_code ? (
                                    <span className="flex items-center gap-1">
                                      <span>{getFlagEmoji(row.country_code)}</span>
                                      <span>{row.city ? `${row.city}, ` : ''}{row.country_name}</span>
                                    </span>
                                  ) : '-'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {csvData.length > 10 && (
                          <div className="px-4 py-3 bg-slate-800/30 text-center text-slate-500 text-sm">
                            ... and {csvData.length - 10} more reviews
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* CSV Format Help */}
                  <div className="p-4 bg-slate-800/30 rounded-xl">
                    <h4 className="text-white font-medium mb-2">CSV Format Guide</h4>
                    <p className="text-slate-500 text-xs mb-2">Required columns: <span className="text-slate-300">client_name, review_text</span></p>
                    <p className="text-slate-500 text-xs">Optional columns: <span className="text-slate-300">client_title, client_company, rating, platform, date, country_code, country_name, city, is_featured</span></p>
                  </div>
                </div>

                <div className="p-6 border-t border-white/10 flex gap-3">
                  <button
                    onClick={() => { setShowCsvModal(false); setCsvData([]); setCsvError(null); }}
                    className="flex-1 py-3 border border-white/10 text-white rounded-xl font-medium hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCsvBulkInsert}
                    disabled={csvUploading || csvData.length === 0 || csvSuccess > 0}
                    className="flex-1 py-3 bg-[#2ecc71] text-slate-950 rounded-xl font-bold disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {csvUploading ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Uploading...</>
                    ) : (
                      <><Upload size={18} /> Upload {csvData.length} Reviews</>
                    )}
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
