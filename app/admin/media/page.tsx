"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft, Search, Loader2, X, Upload, Trash2, Edit2, Save,
  Image as ImageIcon, Video, File, FolderOpen, Grid, List,
  Copy, Check, Filter, SortAsc, SortDesc, RefreshCw
} from 'lucide-react';
import ProtectedRoute from '../../../components/admin/ProtectedRoute';
import { supabase } from '../../../lib/supabase';

interface MediaAsset {
  id: string;
  file_name: string;
  display_name: string | null;
  file_path: string;
  public_url: string;
  alt_text: string | null;
  title: string | null;
  caption: string | null;
  file_size: number | null;
  mime_type: string | null;
  width: number | null;
  height: number | null;
  folder: string;
  tags: string[];
  uploaded_at: string;
  updated_at: string;
}

const folderOptions = [
  { value: 'all', label: 'All Files' },
  { value: 'general', label: 'General' },
  { value: 'portfolio', label: 'Portfolio' },
  { value: 'reviews', label: 'Reviews' },
  { value: 'blog', label: 'Blog' },
  { value: 'services', label: 'Services' },
];

export default function MediaLibraryPage() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'size'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Upload state
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Edit modal state
  const [editingAsset, setEditingAsset] = useState<MediaAsset | null>(null);
  const [editForm, setEditForm] = useState({
    display_name: '',
    alt_text: '',
    title: '',
    caption: '',
    folder: 'general',
    tags: ''
  });
  const [saving, setSaving] = useState(false);

  // Delete state
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Copy URL state
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetchAssets();
  }, []);

  async function fetchAssets() {
    if (!supabase) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('media_assets')
        .select('*')
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      setAssets(data || []);
    } catch (error) {
      console.error('Error fetching media assets:', error);
    }
    setLoading(false);
  }

  // Filter and sort assets
  const filteredAssets = assets
    .filter(asset => {
      const matchesSearch =
        (asset.display_name || asset.file_name).toLowerCase().includes(searchQuery.toLowerCase()) ||
        (asset.alt_text || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (asset.tags || []).some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesFolder = selectedFolder === 'all' || asset.folder === selectedFolder;
      return matchesSearch && matchesFolder;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = (a.display_name || a.file_name).localeCompare(b.display_name || b.file_name);
          break;
        case 'size':
          comparison = (a.file_size || 0) - (b.file_size || 0);
          break;
        case 'date':
        default:
          comparison = new Date(a.uploaded_at).getTime() - new Date(b.uploaded_at).getTime();
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  // File upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !supabase) return;

    setUploading(true);
    setUploadProgress(0);

    const totalFiles = files.length;
    let uploadedCount = 0;

    for (const file of Array.from(files)) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `media/${fileName}`;

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(filePath, file, { upsert: true });

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: urlData } = supabase.storage.from('images').getPublicUrl(filePath);

        // Get image dimensions if it's an image
        let width = null;
        let height = null;
        if (file.type.startsWith('image/')) {
          const dimensions = await getImageDimensions(file);
          width = dimensions.width;
          height = dimensions.height;
        }

        // Insert into media_assets table
        const { error: insertError } = await supabase
          .from('media_assets')
          .insert({
            file_name: file.name,
            display_name: file.name.replace(/\.[^/.]+$/, ''), // Remove extension
            file_path: filePath,
            public_url: urlData.publicUrl,
            file_size: file.size,
            mime_type: file.type,
            width,
            height,
            folder: 'general'
          });

        if (insertError) throw insertError;

        uploadedCount++;
        setUploadProgress(Math.round((uploadedCount / totalFiles) * 100));
      } catch (error) {
        console.error('Error uploading file:', file.name, error);
      }
    }

    setUploading(false);
    setUploadProgress(0);
    fetchAssets();
    e.target.value = ''; // Reset input
  };

  // Get image dimensions
  const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.onerror = () => {
        resolve({ width: 0, height: 0 });
      };
      img.src = URL.createObjectURL(file);
    });
  };

  // Open edit modal
  const handleEdit = (asset: MediaAsset) => {
    setEditingAsset(asset);
    setEditForm({
      display_name: asset.display_name || asset.file_name,
      alt_text: asset.alt_text || '',
      title: asset.title || '',
      caption: asset.caption || '',
      folder: asset.folder,
      tags: (asset.tags || []).join(', ')
    });
  };

  // Save edit
  const handleSaveEdit = async () => {
    if (!editingAsset || !supabase) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('media_assets')
        .update({
          display_name: editForm.display_name || null,
          alt_text: editForm.alt_text || null,
          title: editForm.title || null,
          caption: editForm.caption || null,
          folder: editForm.folder,
          tags: editForm.tags.split(',').map(t => t.trim()).filter(t => t)
        })
        .eq('id', editingAsset.id);

      if (error) throw error;

      await fetchAssets();
      setEditingAsset(null);
    } catch (error) {
      console.error('Error saving asset:', error);
      alert('Error saving changes. Please try again.');
    }
    setSaving(false);
  };

  // Delete asset
  const handleDelete = async (id: string) => {
    if (!supabase) return;

    const asset = assets.find(a => a.id === id);
    if (!asset) return;

    setDeleting(true);
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('images')
        .remove([asset.file_path]);

      if (storageError) console.warn('Storage delete warning:', storageError);

      // Delete from database
      const { error: dbError } = await supabase
        .from('media_assets')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;

      await fetchAssets();
    } catch (error) {
      console.error('Error deleting asset:', error);
      alert('Error deleting file. Please try again.');
    }
    setDeleting(false);
    setDeleteConfirm(null);
  };

  // Copy URL to clipboard
  const copyToClipboard = async (url: string, id: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  // Format file size
  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  // Get file icon
  const getFileIcon = (mimeType: string | null) => {
    if (!mimeType) return <File size={24} className="text-slate-500" />;
    if (mimeType.startsWith('image/')) return <ImageIcon size={24} className="text-[#2ecc71]" />;
    if (mimeType.startsWith('video/')) return <Video size={24} className="text-blue-400" />;
    return <File size={24} className="text-slate-500" />;
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
              <h1 className="text-3xl font-black text-white uppercase tracking-tight">Media Library</h1>
            </div>
            <p className="text-slate-400">Manage your uploaded files, images and media assets</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchAssets}
              className="flex items-center gap-2 bg-slate-800 text-slate-300 px-4 py-3 rounded-xl font-bold text-sm hover:bg-slate-700 transition-all border border-white/10"
            >
              <RefreshCw size={18} />
            </button>
            <label className="flex items-center gap-2 bg-[#2ecc71] text-slate-950 px-6 py-3 rounded-xl font-bold text-sm hover:scale-105 active:scale-95 transition-all cursor-pointer">
              {uploading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  {uploadProgress}%
                </>
              ) : (
                <>
                  <Upload size={18} />
                  Upload Files
                </>
              )}
              <input
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input
              type="text"
              placeholder="Search by name, alt text or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/60 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-[#2ecc71]/50 transition-all"
            />
          </div>
          <select
            value={selectedFolder}
            onChange={(e) => setSelectedFolder(e.target.value)}
            className="bg-slate-900/60 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#2ecc71]/50"
          >
            {folderOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'name' | 'size')}
            className="bg-slate-900/60 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#2ecc71]/50"
          >
            <option value="date">Sort by Date</option>
            <option value="name">Sort by Name</option>
            <option value="size">Sort by Size</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="bg-slate-900/60 border border-white/10 rounded-xl py-3 px-4 text-white hover:bg-slate-800 transition-all"
          >
            {sortOrder === 'asc' ? <SortAsc size={20} /> : <SortDesc size={20} />}
          </button>
          <div className="flex bg-slate-900/60 border border-white/10 rounded-xl overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-3 ${viewMode === 'grid' ? 'bg-[#2ecc71] text-slate-950' : 'text-slate-400 hover:text-white'}`}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-3 ${viewMode === 'list' ? 'bg-[#2ecc71] text-slate-950' : 'text-slate-400 hover:text-white'}`}
            >
              <List size={20} />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-4 mb-6 text-sm text-slate-500">
          <span>{filteredAssets.length} files</span>
          <span>|</span>
          <span>{formatFileSize(filteredAssets.reduce((acc, a) => acc + (a.file_size || 0), 0))} total</span>
        </div>

        {/* Media Grid/List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#2ecc71] animate-spin" />
          </div>
        ) : filteredAssets.length === 0 ? (
          <div className="text-center py-20">
            <FolderOpen className="w-16 h-16 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500">No media files found</p>
            <p className="text-slate-600 text-sm mt-1">Upload your first file to get started</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredAssets.map((asset, index) => (
              <motion.div
                key={asset.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                className="bg-slate-900/60 border border-white/5 rounded-xl overflow-hidden hover:border-[#2ecc71]/30 transition-all group"
              >
                {/* Thumbnail */}
                <div className="aspect-square relative bg-slate-800 overflow-hidden">
                  {asset.mime_type?.startsWith('image/') ? (
                    <img
                      src={asset.public_url}
                      alt={asset.alt_text || asset.display_name || asset.file_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      {getFileIcon(asset.mime_type)}
                    </div>
                  )}
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleEdit(asset)}
                      className="p-2 bg-white/20 rounded-lg hover:bg-[#2ecc71] hover:text-slate-950 transition-all"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => copyToClipboard(asset.public_url, asset.id)}
                      className="p-2 bg-white/20 rounded-lg hover:bg-blue-500 transition-all"
                    >
                      {copiedId === asset.id ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(asset.id)}
                      className="p-2 bg-white/20 rounded-lg hover:bg-red-500 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  {/* Alt text indicator */}
                  {!asset.alt_text && (
                    <div className="absolute top-2 right-2 px-2 py-1 bg-amber-500/80 rounded text-[10px] font-bold text-slate-950">
                      No Alt
                    </div>
                  )}
                </div>
                {/* Info */}
                <div className="p-3">
                  <p className="text-white text-sm font-medium truncate">
                    {asset.display_name || asset.file_name}
                  </p>
                  <p className="text-slate-500 text-xs mt-1">
                    {formatFileSize(asset.file_size)}
                    {asset.width && asset.height && ` • ${asset.width}x${asset.height}`}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="space-y-2">
            {filteredAssets.map((asset, index) => (
              <motion.div
                key={asset.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                className="bg-slate-900/60 border border-white/5 rounded-xl p-4 hover:border-[#2ecc71]/30 transition-all flex items-center gap-4"
              >
                {/* Thumbnail */}
                <div className="w-16 h-16 rounded-lg bg-slate-800 overflow-hidden flex-shrink-0">
                  {asset.mime_type?.startsWith('image/') ? (
                    <img
                      src={asset.public_url}
                      alt={asset.alt_text || asset.display_name || asset.file_name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      {getFileIcon(asset.mime_type)}
                    </div>
                  )}
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">
                    {asset.display_name || asset.file_name}
                  </p>
                  <p className="text-slate-500 text-sm truncate">
                    {asset.alt_text || <span className="text-amber-500">No alt text</span>}
                  </p>
                  <p className="text-slate-600 text-xs mt-1">
                    {formatFileSize(asset.file_size)} • {asset.folder} • {new Date(asset.uploaded_at).toLocaleDateString()}
                  </p>
                </div>
                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(asset)}
                    className="p-2 text-slate-500 hover:text-[#2ecc71] hover:bg-[#2ecc71]/10 rounded-lg transition-all"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => copyToClipboard(asset.public_url, asset.id)}
                    className="p-2 text-slate-500 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all"
                  >
                    {copiedId === asset.id ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(asset.id)}
                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Edit Modal */}
        <AnimatePresence>
          {editingAsset && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setEditingAsset(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">Edit Media Details</h2>
                  <button onClick={() => setEditingAsset(null)} className="p-2 text-slate-500 hover:text-white rounded-lg">
                    <X size={20} />
                  </button>
                </div>

                <div className="p-6">
                  <div className="flex gap-6">
                    {/* Preview */}
                    <div className="w-48 flex-shrink-0">
                      <div className="aspect-square rounded-xl bg-slate-800 overflow-hidden">
                        {editingAsset.mime_type?.startsWith('image/') ? (
                          <img
                            src={editingAsset.public_url}
                            alt={editingAsset.alt_text || ''}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            {getFileIcon(editingAsset.mime_type)}
                          </div>
                        )}
                      </div>
                      <div className="mt-3 text-xs text-slate-500 space-y-1">
                        <p>File: {editingAsset.file_name}</p>
                        <p>Size: {formatFileSize(editingAsset.file_size)}</p>
                        {editingAsset.width && editingAsset.height && (
                          <p>Dimensions: {editingAsset.width} x {editingAsset.height}</p>
                        )}
                        <p>Type: {editingAsset.mime_type}</p>
                      </div>
                    </div>

                    {/* Form */}
                    <div className="flex-1 space-y-4">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                          Display Name
                        </label>
                        <input
                          type="text"
                          value={editForm.display_name}
                          onChange={(e) => setEditForm({ ...editForm, display_name: e.target.value })}
                          className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#2ecc71]/50"
                          placeholder="Enter a display name"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                          Alt Text (SEO) <span className="text-[#2ecc71]">*Important</span>
                        </label>
                        <input
                          type="text"
                          value={editForm.alt_text}
                          onChange={(e) => setEditForm({ ...editForm, alt_text: e.target.value })}
                          className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#2ecc71]/50"
                          placeholder="Describe this image for search engines"
                        />
                        <p className="text-slate-600 text-xs mt-1">
                          Good alt text helps SEO and accessibility. Describe what's in the image.
                        </p>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                          Title
                        </label>
                        <input
                          type="text"
                          value={editForm.title}
                          onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                          className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#2ecc71]/50"
                          placeholder="Title attribute for the image"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                          Caption
                        </label>
                        <textarea
                          value={editForm.caption}
                          onChange={(e) => setEditForm({ ...editForm, caption: e.target.value })}
                          rows={2}
                          className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#2ecc71]/50 resize-none"
                          placeholder="Optional description or caption"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                            Folder
                          </label>
                          <select
                            value={editForm.folder}
                            onChange={(e) => setEditForm({ ...editForm, folder: e.target.value })}
                            className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#2ecc71]/50"
                          >
                            {folderOptions.filter(o => o.value !== 'all').map(opt => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                            Tags (comma separated)
                          </label>
                          <input
                            type="text"
                            value={editForm.tags}
                            onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
                            className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#2ecc71]/50"
                            placeholder="e.g., video, portfolio, featured"
                          />
                        </div>
                      </div>

                      {/* URL Copy */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                          Public URL
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={editingAsset.public_url}
                            readOnly
                            className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3 px-4 text-slate-400 text-sm"
                          />
                          <button
                            onClick={() => copyToClipboard(editingAsset.public_url, editingAsset.id)}
                            className="px-4 bg-slate-800 border border-white/10 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
                          >
                            {copiedId === editingAsset.id ? <Check size={18} /> : <Copy size={18} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 border-t border-white/10 flex gap-3">
                  <button
                    onClick={() => setEditingAsset(null)}
                    className="flex-1 py-3 border border-white/10 text-white rounded-xl font-medium hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    disabled={saving}
                    className="flex-1 py-3 bg-[#2ecc71] text-slate-950 rounded-xl font-bold disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save size={18} /> Save Changes</>}
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
                <h3 className="text-xl font-bold text-white mb-2">Delete File?</h3>
                <p className="text-slate-400 mb-6">This will permanently delete the file from storage. This action cannot be undone.</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="flex-1 py-3 border border-white/10 text-white rounded-xl font-medium hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(deleteConfirm)}
                    disabled={deleting}
                    className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {deleting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Delete'}
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
