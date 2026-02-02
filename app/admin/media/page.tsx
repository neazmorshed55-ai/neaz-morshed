"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft, Search, Loader2, X, Upload, Trash2, Save,
  Image as ImageIcon, Video, File, FolderOpen, Grid, List,
  Copy, Check, SortAsc, SortDesc, RefreshCw, ChevronRight, ExternalLink,
  RotateCcw, AlertTriangle, Trash, Pencil
} from 'lucide-react';
import ProtectedRoute from '../../../components/admin/ProtectedRoute';
import { supabase } from '../../../lib/supabase';

// Extended interface to track source table
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
  deleted_at?: string | null; // For trash functionality
  // Source tracking
  source_table: 'media_assets' | 'portfolio_items' | 'portfolio_gallery' | 'reviews' | 'blogs' | 'services';
  source_id: string;
  source_field: string;
  source_name?: string;
}

const folderOptions = [
  { value: 'all', label: 'All Files' },
  { value: 'media_assets', label: 'Media Library' },
  { value: 'portfolio', label: 'Portfolio' },
  { value: 'reviews', label: 'Reviews' },
  { value: 'blog', label: 'Blog' },
  { value: 'services', label: 'Services' },
];

export default function MediaLibraryPage() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [trashedAssets, setTrashedAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'size'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // View mode: 'library' or 'trash'
  const [currentView, setCurrentView] = useState<'library' | 'trash'>('library');

  // Upload state
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Slide panel state
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
  const [editForm, setEditForm] = useState({
    display_name: '',
    file_name: '', // Original file name (can be renamed)
    alt_text: '',
    title: '',
    caption: '',
    folder: 'general',
    tags: ''
  });
  const [renaming, setRenaming] = useState(false);
  const [saving, setSaving] = useState(false);

  // Delete/Trash state
  const [trashConfirm, setTrashConfirm] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [emptyTrashConfirm, setEmptyTrashConfirm] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Selection state for bulk actions
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkAction, setBulkAction] = useState<'trash' | 'delete' | 'restore' | null>(null);

  // Copy URL state
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetchAllAssets();
  }, []);

  // Fetch from ALL sources
  async function fetchAllAssets() {
    if (!supabase) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const allAssets: MediaAsset[] = [];
    const trashed: MediaAsset[] = [];

    try {
      // 1. Fetch from media_assets table (both active and trashed)
      const { data: mediaData } = await supabase
        .from('media_assets')
        .select('*')
        .order('uploaded_at', { ascending: false });

      if (mediaData) {
        mediaData.forEach(item => {
          const asset: MediaAsset = {
            ...item,
            source_table: 'media_assets',
            source_id: item.id,
            source_field: 'public_url',
            source_name: item.display_name || item.file_name
          };

          if (item.deleted_at) {
            trashed.push(asset);
          } else {
            allAssets.push(asset);
          }
        });
      }

      // 2. Fetch from portfolio_items (thumbnail_url and image_url)
      const { data: portfolioData } = await supabase
        .from('portfolio_items')
        .select('id, title, thumbnail_url, thumbnail_alt_text, image_url, image_alt_text, created_at')
        .order('created_at', { ascending: false });

      if (portfolioData) {
        portfolioData.forEach(item => {
          if (item.thumbnail_url) {
            allAssets.push({
              id: `portfolio-thumb-${item.id}`,
              file_name: extractFileName(item.thumbnail_url),
              display_name: `${item.title} - Thumbnail`,
              file_path: item.thumbnail_url,
              public_url: item.thumbnail_url,
              alt_text: item.thumbnail_alt_text || null,
              title: item.title,
              caption: null,
              file_size: null,
              mime_type: getMimeTypeFromUrl(item.thumbnail_url),
              width: null,
              height: null,
              folder: 'portfolio',
              tags: ['portfolio', 'thumbnail'],
              uploaded_at: item.created_at,
              updated_at: item.created_at,
              source_table: 'portfolio_items',
              source_id: item.id,
              source_field: 'thumbnail_alt_text',
              source_name: item.title
            });
          }
          if (item.image_url) {
            allAssets.push({
              id: `portfolio-img-${item.id}`,
              file_name: extractFileName(item.image_url),
              display_name: `${item.title} - Main Image`,
              file_path: item.image_url,
              public_url: item.image_url,
              alt_text: item.image_alt_text || null,
              title: item.title,
              caption: null,
              file_size: null,
              mime_type: getMimeTypeFromUrl(item.image_url),
              width: null,
              height: null,
              folder: 'portfolio',
              tags: ['portfolio', 'main'],
              uploaded_at: item.created_at,
              updated_at: item.created_at,
              source_table: 'portfolio_items',
              source_id: item.id,
              source_field: 'image_alt_text',
              source_name: item.title
            });
          }
        });
      }

      // 3. Fetch from portfolio_gallery
      const { data: galleryData } = await supabase
        .from('portfolio_gallery')
        .select('id, portfolio_id, url, alt_text, caption, created_at')
        .order('created_at', { ascending: false });

      if (galleryData) {
        galleryData.forEach(item => {
          if (item.url) {
            allAssets.push({
              id: `gallery-${item.id}`,
              file_name: extractFileName(item.url),
              display_name: item.caption || 'Gallery Image',
              file_path: item.url,
              public_url: item.url,
              alt_text: item.alt_text || null,
              title: item.caption || null,
              caption: item.caption || null,
              file_size: null,
              mime_type: getMimeTypeFromUrl(item.url),
              width: null,
              height: null,
              folder: 'portfolio',
              tags: ['portfolio', 'gallery'],
              uploaded_at: item.created_at,
              updated_at: item.created_at,
              source_table: 'portfolio_gallery',
              source_id: item.id,
              source_field: 'alt_text',
              source_name: `Gallery #${item.id.substring(0, 8)}`
            });
          }
        });
      }

      // 4. Fetch from reviews (client_image)
      const { data: reviewsData } = await supabase
        .from('reviews')
        .select('id, client_name, client_image, client_image_alt_text, created_at')
        .order('created_at', { ascending: false });

      if (reviewsData) {
        reviewsData.forEach(item => {
          if (item.client_image) {
            allAssets.push({
              id: `review-${item.id}`,
              file_name: extractFileName(item.client_image),
              display_name: `${item.client_name} - Client Image`,
              file_path: item.client_image,
              public_url: item.client_image,
              alt_text: item.client_image_alt_text || null,
              title: item.client_name,
              caption: null,
              file_size: null,
              mime_type: getMimeTypeFromUrl(item.client_image),
              width: null,
              height: null,
              folder: 'reviews',
              tags: ['reviews', 'client'],
              uploaded_at: item.created_at,
              updated_at: item.created_at,
              source_table: 'reviews',
              source_id: item.id,
              source_field: 'client_image_alt_text',
              source_name: item.client_name
            });
          }
        });
      }

      // 5. Fetch from blogs (cover_image)
      const { data: blogsData } = await supabase
        .from('blogs')
        .select('id, title, cover_image, cover_image_alt_text, created_at')
        .order('created_at', { ascending: false });

      if (blogsData) {
        blogsData.forEach(item => {
          if (item.cover_image) {
            allAssets.push({
              id: `blog-${item.id}`,
              file_name: extractFileName(item.cover_image),
              display_name: `${item.title} - Cover`,
              file_path: item.cover_image,
              public_url: item.cover_image,
              alt_text: item.cover_image_alt_text || null,
              title: item.title,
              caption: null,
              file_size: null,
              mime_type: getMimeTypeFromUrl(item.cover_image),
              width: null,
              height: null,
              folder: 'blog',
              tags: ['blog', 'cover'],
              uploaded_at: item.created_at,
              updated_at: item.created_at,
              source_table: 'blogs',
              source_id: item.id,
              source_field: 'cover_image_alt_text',
              source_name: item.title
            });
          }
        });
      }

      // 6. Fetch from services (cover_image)
      const { data: servicesData } = await supabase
        .from('services')
        .select('id, title, cover_image, cover_image_alt_text, created_at')
        .order('created_at', { ascending: false });

      if (servicesData) {
        servicesData.forEach(item => {
          if (item.cover_image) {
            allAssets.push({
              id: `service-${item.id}`,
              file_name: extractFileName(item.cover_image),
              display_name: `${item.title} - Cover`,
              file_path: item.cover_image,
              public_url: item.cover_image,
              alt_text: item.cover_image_alt_text || null,
              title: item.title,
              caption: null,
              file_size: null,
              mime_type: getMimeTypeFromUrl(item.cover_image),
              width: null,
              height: null,
              folder: 'services',
              tags: ['services', 'cover'],
              uploaded_at: item.created_at,
              updated_at: item.created_at,
              source_table: 'services',
              source_id: item.id,
              source_field: 'cover_image_alt_text',
              source_name: item.title
            });
          }
        });
      }

      setAssets(allAssets);
      setTrashedAssets(trashed);
    } catch (error) {
      console.error('Error fetching media assets:', error);
    }
    setLoading(false);
  }

  // Helper: Extract filename from URL
  function extractFileName(url: string): string {
    try {
      const path = new URL(url).pathname;
      return path.split('/').pop() || 'unknown';
    } catch {
      return url.split('/').pop() || 'unknown';
    }
  }

  // Helper: Get mime type from URL
  function getMimeTypeFromUrl(url: string): string {
    const ext = url.split('.').pop()?.toLowerCase();
    const mimeTypes: Record<string, string> = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp',
      'svg': 'image/svg+xml',
      'mp4': 'video/mp4',
      'webm': 'video/webm',
      'mov': 'video/quicktime'
    };
    return mimeTypes[ext || ''] || 'image/jpeg';
  }

  // Get current display assets based on view
  const currentAssets = currentView === 'library' ? assets : trashedAssets;

  // Filter and sort assets
  const filteredAssets = currentAssets
    .filter(asset => {
      const matchesSearch =
        (asset.display_name || asset.file_name).toLowerCase().includes(searchQuery.toLowerCase()) ||
        (asset.alt_text || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (asset.source_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (asset.tags || []).some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesFolder = currentView === 'trash' || selectedFolder === 'all' ||
        asset.folder === selectedFolder ||
        (selectedFolder === 'media_assets' && asset.source_table === 'media_assets');

      return matchesSearch && matchesFolder;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (currentView === 'trash') {
        // Sort trash by deleted_at
        comparison = new Date(a.deleted_at || 0).getTime() - new Date(b.deleted_at || 0).getTime();
      } else {
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

        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(filePath, file, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage.from('images').getPublicUrl(filePath);

        let width = null;
        let height = null;
        if (file.type.startsWith('image/')) {
          const dimensions = await getImageDimensions(file);
          width = dimensions.width;
          height = dimensions.height;
        }

        const { error: insertError } = await supabase
          .from('media_assets')
          .insert({
            file_name: file.name,
            display_name: file.name.replace(/\.[^/.]+$/, ''),
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
    fetchAllAssets();
    e.target.value = '';
  };

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

  // Open slide panel
  const handleSelectAsset = (asset: MediaAsset) => {
    setSelectedAsset(asset);
    setEditForm({
      display_name: asset.display_name || asset.file_name,
      file_name: asset.file_name,
      alt_text: asset.alt_text || '',
      title: asset.title || '',
      caption: asset.caption || '',
      folder: asset.folder,
      tags: (asset.tags || []).join(', ')
    });
  };

  // Save changes
  const handleSaveEdit = async () => {
    if (!selectedAsset || !supabase) return;

    setSaving(true);
    try {
      if (selectedAsset.source_table === 'media_assets') {
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
          .eq('id', selectedAsset.source_id);

        if (error) throw error;
      } else if (selectedAsset.source_table === 'portfolio_items') {
        const updateField = selectedAsset.source_field === 'thumbnail_alt_text'
          ? { thumbnail_alt_text: editForm.alt_text || null }
          : { image_alt_text: editForm.alt_text || null };

        const { error } = await supabase
          .from('portfolio_items')
          .update(updateField)
          .eq('id', selectedAsset.source_id);

        if (error) throw error;
      } else if (selectedAsset.source_table === 'portfolio_gallery') {
        const { error } = await supabase
          .from('portfolio_gallery')
          .update({
            alt_text: editForm.alt_text || null,
            caption: editForm.caption || null
          })
          .eq('id', selectedAsset.source_id);

        if (error) throw error;
      } else if (selectedAsset.source_table === 'reviews') {
        const { error } = await supabase
          .from('reviews')
          .update({ client_image_alt_text: editForm.alt_text || null })
          .eq('id', selectedAsset.source_id);

        if (error) throw error;
      } else if (selectedAsset.source_table === 'blogs') {
        const { error } = await supabase
          .from('blogs')
          .update({ cover_image_alt_text: editForm.alt_text || null })
          .eq('id', selectedAsset.source_id);

        if (error) throw error;
      } else if (selectedAsset.source_table === 'services') {
        const { error } = await supabase
          .from('services')
          .update({ cover_image_alt_text: editForm.alt_text || null })
          .eq('id', selectedAsset.source_id);

        if (error) throw error;
      }

      await fetchAllAssets();
      setSelectedAsset(prev => prev ? {
        ...prev,
        display_name: editForm.display_name,
        alt_text: editForm.alt_text,
        title: editForm.title,
        caption: editForm.caption
      } : null);

    } catch (error) {
      console.error('Error saving asset:', error);
      alert('Error saving changes. Please try again.');
    }
    setSaving(false);
  };

  // Rename file in storage
  const handleRenameFile = async () => {
    if (!selectedAsset || !supabase || selectedAsset.source_table !== 'media_assets') return;
    if (!editForm.file_name.trim()) {
      alert('File name cannot be empty');
      return;
    }

    // Check if name actually changed
    if (editForm.file_name === selectedAsset.file_name) {
      return;
    }

    setRenaming(true);
    try {
      // Get file extension from original
      const originalExt = selectedAsset.file_name.split('.').pop()?.toLowerCase() || '';
      let newFileName = editForm.file_name.trim();

      // Ensure extension is preserved
      const newExt = newFileName.split('.').pop()?.toLowerCase() || '';
      if (newExt !== originalExt) {
        // Add original extension if missing or different
        newFileName = newFileName.replace(/\.[^/.]+$/, '') + '.' + originalExt;
      }

      // Create new file path
      const newFilePath = `media/${Date.now()}-${newFileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

      // Download the existing file
      const { data: fileData, error: downloadError } = await supabase.storage
        .from('images')
        .download(selectedAsset.file_path);

      if (downloadError) throw downloadError;

      // Upload with new name
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(newFilePath, fileData, { upsert: true });

      if (uploadError) throw uploadError;

      // Get new public URL
      const { data: urlData } = supabase.storage.from('images').getPublicUrl(newFilePath);

      // Update database
      const { error: dbError } = await supabase
        .from('media_assets')
        .update({
          file_name: newFileName,
          file_path: newFilePath,
          public_url: urlData.publicUrl
        })
        .eq('id', selectedAsset.source_id);

      if (dbError) throw dbError;

      // Delete old file
      await supabase.storage.from('images').remove([selectedAsset.file_path]);

      // Refresh
      await fetchAllAssets();
      setSelectedAsset(null);

    } catch (error) {
      console.error('Error renaming file:', error);
      alert('Error renaming file. Please try again.');
    }
    setRenaming(false);
  };

  // Move to Trash (soft delete)
  const handleMoveToTrash = async (id: string) => {
    if (!supabase) return;

    const asset = assets.find(a => a.id === id);
    if (!asset || asset.source_table !== 'media_assets') {
      alert('Can only move Media Library files to trash. Edit the source (portfolio, review, etc.) to manage other images.');
      setTrashConfirm(null);
      return;
    }

    setActionLoading(true);
    try {
      const { error } = await supabase
        .from('media_assets')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', asset.source_id);

      if (error) throw error;

      await fetchAllAssets();
      if (selectedAsset?.id === id) {
        setSelectedAsset(null);
      }
    } catch (error) {
      console.error('Error moving to trash:', error);
      alert('Error moving file to trash. Please try again.');
    }
    setActionLoading(false);
    setTrashConfirm(null);
  };

  // Restore from Trash
  const handleRestore = async (id: string) => {
    if (!supabase) return;

    const asset = trashedAssets.find(a => a.id === id);
    if (!asset) return;

    setActionLoading(true);
    try {
      const { error } = await supabase
        .from('media_assets')
        .update({ deleted_at: null })
        .eq('id', asset.source_id);

      if (error) throw error;

      await fetchAllAssets();
      if (selectedAsset?.id === id) {
        setSelectedAsset(null);
      }
    } catch (error) {
      console.error('Error restoring file:', error);
      alert('Error restoring file. Please try again.');
    }
    setActionLoading(false);
  };

  // Permanent Delete (from trash only)
  const handlePermanentDelete = async (id: string) => {
    if (!supabase) return;

    const asset = trashedAssets.find(a => a.id === id);
    if (!asset) return;

    setActionLoading(true);
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
        .eq('id', asset.source_id);

      if (dbError) throw dbError;

      await fetchAllAssets();
      if (selectedAsset?.id === id) {
        setSelectedAsset(null);
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('Error deleting file. Please try again.');
    }
    setActionLoading(false);
    setDeleteConfirm(null);
  };

  // Empty Trash
  const handleEmptyTrash = async () => {
    if (!supabase || trashedAssets.length === 0) return;

    setActionLoading(true);
    try {
      // Delete all trashed files from storage
      const filePaths = trashedAssets.map(a => a.file_path);
      if (filePaths.length > 0) {
        await supabase.storage.from('images').remove(filePaths);
      }

      // Delete all trashed records from database
      const { error } = await supabase
        .from('media_assets')
        .delete()
        .not('deleted_at', 'is', null);

      if (error) throw error;

      await fetchAllAssets();
      setSelectedAsset(null);
    } catch (error) {
      console.error('Error emptying trash:', error);
      alert('Error emptying trash. Please try again.');
    }
    setActionLoading(false);
    setEmptyTrashConfirm(false);
  };

  const copyToClipboard = async (url: string, id: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  // Selection handlers
  const toggleSelection = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const selectAll = () => {
    const selectableIds = filteredAssets
      .filter(a => currentView === 'library' ? a.source_table === 'media_assets' : true)
      .map(a => a.id);
    setSelectedIds(new Set(selectableIds));
  };

  const deselectAll = () => {
    setSelectedIds(new Set());
  };

  // Bulk action handlers
  const handleBulkMoveToTrash = async () => {
    if (!supabase || selectedIds.size === 0) return;

    setActionLoading(true);
    try {
      const idsToTrash = Array.from(selectedIds)
        .map(id => assets.find(a => a.id === id))
        .filter(a => a && a.source_table === 'media_assets')
        .map(a => a!.source_id);

      if (idsToTrash.length === 0) {
        alert('Only Media Library files can be moved to trash.');
        setActionLoading(false);
        setBulkAction(null);
        return;
      }

      const { error } = await supabase
        .from('media_assets')
        .update({ deleted_at: new Date().toISOString() })
        .in('id', idsToTrash);

      if (error) throw error;

      await fetchAllAssets();
      setSelectedIds(new Set());
      setSelectedAsset(null);
    } catch (error) {
      console.error('Error moving to trash:', error);
      alert('Error moving files to trash.');
    }
    setActionLoading(false);
    setBulkAction(null);
  };

  const handleBulkRestore = async () => {
    if (!supabase || selectedIds.size === 0) return;

    setActionLoading(true);
    try {
      const idsToRestore = Array.from(selectedIds)
        .map(id => trashedAssets.find(a => a.id === id))
        .filter(a => a)
        .map(a => a!.source_id);

      const { error } = await supabase
        .from('media_assets')
        .update({ deleted_at: null })
        .in('id', idsToRestore);

      if (error) throw error;

      await fetchAllAssets();
      setSelectedIds(new Set());
      setSelectedAsset(null);
    } catch (error) {
      console.error('Error restoring files:', error);
      alert('Error restoring files.');
    }
    setActionLoading(false);
    setBulkAction(null);
  };

  const handleBulkPermanentDelete = async () => {
    if (!supabase || selectedIds.size === 0) return;

    setActionLoading(true);
    try {
      const assetsToDelete = Array.from(selectedIds)
        .map(id => (currentView === 'trash' ? trashedAssets : assets).find(a => a.id === id))
        .filter(a => a && a.source_table === 'media_assets');

      if (assetsToDelete.length === 0) {
        alert('Only Media Library files can be permanently deleted.');
        setActionLoading(false);
        setBulkAction(null);
        return;
      }

      // Delete from storage
      const filePaths = assetsToDelete.map(a => a!.file_path);
      await supabase.storage.from('images').remove(filePaths);

      // Delete from database
      const { error } = await supabase
        .from('media_assets')
        .delete()
        .in('id', assetsToDelete.map(a => a!.source_id));

      if (error) throw error;

      await fetchAllAssets();
      setSelectedIds(new Set());
      setSelectedAsset(null);
    } catch (error) {
      console.error('Error deleting files:', error);
      alert('Error deleting files.');
    }
    setActionLoading(false);
    setBulkAction(null);
  };

  // Get selectable count (only media_assets can be selected for bulk actions in library view)
  const selectableCount = currentView === 'library'
    ? filteredAssets.filter(a => a.source_table === 'media_assets').length
    : filteredAssets.length;

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return '-';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const getFileIcon = (mimeType: string | null) => {
    if (!mimeType) return <File size={24} className="text-slate-500" />;
    if (mimeType.startsWith('image/')) return <ImageIcon size={24} className="text-[#2ecc71]" />;
    if (mimeType.startsWith('video/')) return <Video size={24} className="text-blue-400" />;
    return <File size={24} className="text-slate-500" />;
  };

  const getSourceBadge = (source: string) => {
    const colors: Record<string, string> = {
      'media_assets': 'bg-slate-700 text-slate-300',
      'portfolio_items': 'bg-purple-500/20 text-purple-400',
      'portfolio_gallery': 'bg-purple-500/20 text-purple-400',
      'reviews': 'bg-yellow-500/20 text-yellow-400',
      'blogs': 'bg-blue-500/20 text-blue-400',
      'services': 'bg-green-500/20 text-green-400'
    };
    const labels: Record<string, string> = {
      'media_assets': 'Library',
      'portfolio_items': 'Portfolio',
      'portfolio_gallery': 'Gallery',
      'reviews': 'Review',
      'blogs': 'Blog',
      'services': 'Service'
    };
    return (
      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${colors[source] || 'bg-slate-700'}`}>
        {labels[source] || source}
      </span>
    );
  };

  // Calculate days until auto-delete (30 days)
  const getDaysUntilDelete = (deletedAt: string) => {
    const deleted = new Date(deletedAt);
    const now = new Date();
    const diffDays = 30 - Math.floor((now.getTime() - deleted.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex">
        {/* Google Photos Style Selection Bar - Fixed at Top */}
        <AnimatePresence>
          {selectedIds.size > 0 && (
            <motion.div
              initial={{ y: -80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -80, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-white/10 shadow-xl"
            >
              <div className={`flex items-center justify-between px-6 py-4 transition-all duration-300 ${selectedAsset ? 'mr-[400px]' : ''}`}>
                {/* Left side - Close & Count */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={deselectAll}
                    className="p-2 hover:bg-white/10 rounded-full transition-all"
                  >
                    <X size={24} className="text-white" />
                  </button>
                  <span className="text-white font-bold text-lg">
                    {selectedIds.size} selected
                  </span>
                </div>

                {/* Right side - Actions */}
                <div className="flex items-center gap-2">
                  {currentView === 'library' ? (
                    <>
                      <button
                        onClick={() => setBulkAction('trash')}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full font-medium transition-all"
                        title="Move to Trash"
                      >
                        <Trash2 size={20} />
                        <span className="hidden sm:inline">Trash</span>
                      </button>
                      <button
                        onClick={() => setBulkAction('delete')}
                        className="flex items-center gap-2 px-4 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-full font-medium transition-all"
                        title="Delete Permanently"
                      >
                        <Trash size={20} />
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setBulkAction('restore')}
                        className="flex items-center gap-2 px-4 py-2.5 bg-[#2ecc71]/20 hover:bg-[#2ecc71]/30 text-[#2ecc71] rounded-full font-medium transition-all"
                        title="Restore"
                      >
                        <RotateCcw size={20} />
                        <span className="hidden sm:inline">Restore</span>
                      </button>
                      <button
                        onClick={() => setBulkAction('delete')}
                        className="flex items-center gap-2 px-4 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-full font-medium transition-all"
                        title="Delete Permanently"
                      >
                        <Trash size={20} />
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 ${selectedAsset ? 'mr-[400px]' : ''} ${selectedIds.size > 0 ? 'pt-[72px]' : ''}`}>
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Link href="/admin" className="text-slate-500 hover:text-white transition-colors">
                  <ArrowLeft size={20} />
                </Link>
                <h1 className="text-3xl font-black text-white uppercase tracking-tight">
                  {currentView === 'library' ? 'Media Library' : 'Recycle Bin'}
                </h1>
              </div>
              <p className="text-slate-400">
                {currentView === 'library'
                  ? 'All images and media from your website'
                  : 'Deleted files are kept for 30 days before permanent deletion'}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={fetchAllAssets}
                className="flex items-center gap-2 bg-slate-800 text-slate-300 px-4 py-3 rounded-xl font-bold text-sm hover:bg-slate-700 transition-all border border-white/10"
              >
                <RefreshCw size={18} />
              </button>

              {currentView === 'library' ? (
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
              ) : trashedAssets.length > 0 && (
                <button
                  onClick={() => setEmptyTrashConfirm(true)}
                  className="flex items-center gap-2 bg-red-500 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-red-600 transition-all"
                >
                  <Trash size={18} />
                  Empty Trash
                </button>
              )}
            </div>
          </div>

          {/* View Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => { setCurrentView('library'); setSelectedAsset(null); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                currentView === 'library'
                  ? 'bg-[#2ecc71] text-slate-950'
                  : 'bg-slate-800 text-slate-400 hover:text-white border border-white/10'
              }`}
            >
              <ImageIcon size={16} />
              Library ({assets.length})
            </button>
            <button
              onClick={() => { setCurrentView('trash'); setSelectedAsset(null); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                currentView === 'trash'
                  ? 'bg-red-500 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white border border-white/10'
              }`}
            >
              <Trash2 size={16} />
              Trash ({trashedAssets.length})
            </button>
          </div>

          {/* Filters & Search - Only show for library view */}
          {currentView === 'library' && (
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                <input
                  type="text"
                  placeholder="Search by name, alt text or source..."
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
          )}

          {/* Stats with Select All option */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex gap-4 text-sm text-slate-500">
              {currentView === 'library' ? (
                <>
                  <span>{filteredAssets.length} files</span>
                  <span>|</span>
                  <span>{assets.filter(a => a.source_table === 'media_assets').length} in Media Library</span>
                  <span>|</span>
                  <span>{assets.filter(a => !a.alt_text).length} missing alt text</span>
                </>
              ) : (
                <>
                  <span>{trashedAssets.length} files in trash</span>
                  <span>|</span>
                  <span className="text-amber-500">Files are auto-deleted after 30 days</span>
                </>
              )}
            </div>

            {/* Select All Button */}
            {selectableCount > 0 && (
              <button
                onClick={() => selectedIds.size === selectableCount ? deselectAll() : selectAll()}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  selectedIds.size > 0 && selectedIds.size === selectableCount
                    ? 'bg-[#2ecc71] border-[#2ecc71]'
                    : 'border-slate-500 hover:border-[#2ecc71]'
                }`}>
                  {selectedIds.size > 0 && selectedIds.size === selectableCount && (
                    <Check size={12} className="text-slate-950" />
                  )}
                </div>
                Select All
              </button>
            )}
          </div>

          {/* Media Grid/List */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-[#2ecc71] animate-spin" />
            </div>
          ) : filteredAssets.length === 0 ? (
            <div className="text-center py-20">
              {currentView === 'trash' ? (
                <>
                  <Trash2 className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                  <p className="text-slate-500">Trash is empty</p>
                  <p className="text-slate-600 text-sm mt-1">Deleted files will appear here</p>
                </>
              ) : (
                <>
                  <FolderOpen className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                  <p className="text-slate-500">No media files found</p>
                  <p className="text-slate-600 text-sm mt-1">Upload files or add images to your content</p>
                </>
              )}
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredAssets.map((asset, index) => {
                const isSelectable = currentView === 'trash' || asset.source_table === 'media_assets';
                const isSelected = selectedIds.has(asset.id);

                return (
                  <motion.div
                    key={asset.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    onClick={() => {
                      // If in selection mode (any item selected), toggle selection
                      if (selectedIds.size > 0 && isSelectable) {
                        const newSelected = new Set(selectedIds);
                        if (isSelected) {
                          newSelected.delete(asset.id);
                        } else {
                          newSelected.add(asset.id);
                        }
                        setSelectedIds(newSelected);
                      } else {
                        handleSelectAsset(asset);
                      }
                    }}
                    className={`bg-slate-900/60 border-2 rounded-xl overflow-hidden transition-all group cursor-pointer relative ${
                      isSelected
                        ? 'border-[#2ecc71] ring-2 ring-[#2ecc71]/30 scale-[0.98]'
                        : selectedAsset?.id === asset.id
                        ? 'border-[#2ecc71]/50'
                        : 'border-transparent hover:border-white/20'
                    } ${currentView === 'trash' ? 'opacity-75' : ''}`}
                  >
                    {/* Selected overlay tint */}
                    {isSelected && (
                      <div className="absolute inset-0 bg-[#2ecc71]/10 z-[5] pointer-events-none" />
                    )}

                    {/* Thumbnail */}
                    <div className="aspect-square relative bg-slate-800 overflow-hidden">
                      {asset.mime_type?.startsWith('image/') ? (
                        <img
                          src={asset.public_url}
                          alt={asset.alt_text || asset.display_name || asset.file_name}
                          className={`w-full h-full object-cover transition-transform duration-300 ${
                            isSelected ? 'scale-95 rounded-lg' : 'group-hover:scale-105'
                          }`}
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          {getFileIcon(asset.mime_type)}
                        </div>
                      )}

                      {/* Google Photos style circular checkbox */}
                      {isSelectable && (
                        <div
                          className={`absolute top-3 left-3 z-10 transition-all duration-200 ${
                            selectedIds.size > 0 || isSelected ? 'opacity-100 scale-100' : 'opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100'
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSelection(asset.id, e);
                          }}
                        >
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all shadow-lg ${
                            isSelected
                              ? 'bg-[#2ecc71] border-2 border-[#2ecc71]'
                              : 'bg-black/60 border-2 border-white/70 hover:border-[#2ecc71] hover:bg-black/80'
                          }`}>
                            {isSelected && <Check size={16} className="text-slate-950 stroke-[3]" />}
                          </div>
                        </div>
                      )}

                      {/* Badges overlay */}
                      <div className={`absolute top-2 right-2 flex items-start gap-1 ${
                        !isSelectable ? 'left-2' : ''
                      }`}>
                        {!isSelectable && getSourceBadge(asset.source_table)}
                        {currentView === 'trash' && asset.deleted_at ? (
                          <span className="px-2 py-0.5 bg-red-500/80 rounded text-[10px] font-bold text-white">
                            {getDaysUntilDelete(asset.deleted_at)}d left
                          </span>
                        ) : !asset.alt_text && (
                          <span className="px-2 py-0.5 bg-amber-500/80 rounded text-[10px] font-bold text-slate-950">
                            No Alt
                          </span>
                        )}
                      </div>

                      {/* Source badge for selectable items */}
                      {isSelectable && (
                        <div className="absolute bottom-2 left-2">
                          {getSourceBadge(asset.source_table)}
                        </div>
                      )}

                      {selectedAsset?.id === asset.id && !isSelected && (
                        <div className="absolute bottom-2 right-2">
                          <ChevronRight className="w-6 h-6 text-[#2ecc71]" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-3">
                      <p className="text-white text-sm font-medium truncate">
                        {asset.display_name || asset.file_name}
                      </p>
                      <p className="text-slate-500 text-xs mt-1 truncate">
                        {asset.source_name || formatFileSize(asset.file_size)}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            /* List View */
            <div className="space-y-2">
              {filteredAssets.map((asset, index) => {
                const isSelectable = currentView === 'trash' || asset.source_table === 'media_assets';
                const isSelected = selectedIds.has(asset.id);

                return (
                  <motion.div
                    key={asset.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    onClick={() => {
                      // If in selection mode (any item selected), toggle selection
                      if (selectedIds.size > 0 && isSelectable) {
                        const newSelected = new Set(selectedIds);
                        if (isSelected) {
                          newSelected.delete(asset.id);
                        } else {
                          newSelected.add(asset.id);
                        }
                        setSelectedIds(newSelected);
                      } else {
                        handleSelectAsset(asset);
                      }
                    }}
                    className={`bg-slate-900/60 border-2 rounded-xl p-4 transition-all flex items-center gap-4 cursor-pointer relative ${
                      isSelected
                        ? 'border-[#2ecc71] bg-[#2ecc71]/5'
                        : selectedAsset?.id === asset.id
                        ? 'border-[#2ecc71]/50'
                        : 'border-transparent hover:border-white/20'
                    } ${currentView === 'trash' ? 'opacity-75' : ''}`}
                  >
                    {/* Selection checkbox - circular like Google Photos */}
                    {isSelectable && (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSelection(asset.id, e);
                        }}
                        className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                          isSelected
                            ? 'bg-[#2ecc71] border-2 border-[#2ecc71]'
                            : 'bg-slate-800 border-2 border-white/30 hover:border-[#2ecc71]'
                        }`}
                      >
                        {isSelected && <Check size={16} className="text-slate-950 stroke-[3]" />}
                      </div>
                    )}

                    {/* Thumbnail */}
                    <div className={`w-16 h-16 rounded-lg bg-slate-800 overflow-hidden flex-shrink-0 transition-all ${
                      isSelected ? 'ring-2 ring-[#2ecc71]/30' : ''
                    }`}>
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
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-white font-medium truncate">
                          {asset.display_name || asset.file_name}
                        </p>
                        {getSourceBadge(asset.source_table)}
                        {currentView === 'trash' && asset.deleted_at && (
                          <span className="px-2 py-0.5 bg-red-500/20 rounded text-[10px] font-bold text-red-400">
                            {getDaysUntilDelete(asset.deleted_at)} days left
                          </span>
                        )}
                      </div>
                      <p className="text-slate-500 text-sm truncate">
                        {asset.alt_text || <span className="text-amber-500">No alt text</span>}
                      </p>
                      <p className="text-slate-600 text-xs mt-1">
                        {asset.source_name} • {new Date(asset.uploaded_at).toLocaleDateString()}
                      </p>
                    </div>

                    <ChevronRight className={`w-5 h-5 transition-colors ${
                      selectedAsset?.id === asset.id ? 'text-[#2ecc71]' : 'text-slate-600'
                    }`} />
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT SIDE SLIDE PANEL */}
        <AnimatePresence>
          {selectedAsset && (
            <motion.div
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-[400px] bg-slate-900 border-l border-white/10 z-40 flex flex-col shadow-2xl"
            >
              {/* Panel Header */}
              <div className="p-4 border-b border-white/10 flex items-center justify-between bg-slate-900/95 backdrop-blur">
                <h2 className="text-lg font-bold text-white">
                  {currentView === 'trash' ? 'Trashed File' : 'Edit Details'}
                </h2>
                <button
                  onClick={() => setSelectedAsset(null)}
                  className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Panel Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Image Preview */}
                <div className="aspect-video rounded-xl bg-slate-800 overflow-hidden relative">
                  {selectedAsset.mime_type?.startsWith('image/') ? (
                    <img
                      src={selectedAsset.public_url}
                      alt={selectedAsset.alt_text || ''}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      {getFileIcon(selectedAsset.mime_type)}
                    </div>
                  )}
                  <a
                    href={selectedAsset.public_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-2 right-2 p-2 bg-black/50 rounded-lg text-white hover:bg-black/70 transition-all"
                  >
                    <ExternalLink size={16} />
                  </a>
                </div>

                {/* Trash Warning */}
                {currentView === 'trash' && selectedAsset.deleted_at && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-red-400 font-bold text-sm">File in Trash</p>
                        <p className="text-red-400/70 text-xs mt-1">
                          This file will be permanently deleted in {getDaysUntilDelete(selectedAsset.deleted_at)} days.
                          Restore it to keep using it on your website.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Source Info */}
                <div className="bg-slate-800/50 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    {getSourceBadge(selectedAsset.source_table)}
                    <span className="text-slate-400 text-sm">{selectedAsset.source_name}</span>
                  </div>

                  {/* File Details */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-600">File Name:</span>
                      <p className="text-white font-mono truncate" title={selectedAsset.file_name}>
                        {selectedAsset.file_name}
                      </p>
                    </div>
                    {selectedAsset.file_size && (
                      <div>
                        <span className="text-slate-600">Size:</span>
                        <p className="text-white">{formatFileSize(selectedAsset.file_size)}</p>
                      </div>
                    )}
                    {selectedAsset.width && selectedAsset.height && (
                      <div>
                        <span className="text-slate-600">Dimensions:</span>
                        <p className="text-white">{selectedAsset.width} x {selectedAsset.height}px</p>
                      </div>
                    )}
                    {selectedAsset.mime_type && (
                      <div>
                        <span className="text-slate-600">Type:</span>
                        <p className="text-white">{selectedAsset.mime_type}</p>
                      </div>
                    )}
                  </div>

                  {currentView === 'trash' && selectedAsset.deleted_at && (
                    <p className="text-red-400 text-xs pt-2 border-t border-white/5">
                      Deleted: {new Date(selectedAsset.deleted_at).toLocaleString()}
                    </p>
                  )}
                </div>

                {/* Edit Form - Only show for library view */}
                {currentView === 'library' && (
                  <div className="space-y-4">
                    {/* Rename File - Prominent section for media_assets */}
                    {selectedAsset.source_table === 'media_assets' && (
                      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Pencil size={18} className="text-blue-400" />
                          <label className="text-sm font-bold text-blue-400">
                            Rename File
                          </label>
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={editForm.file_name}
                            onChange={(e) => setEditForm({ ...editForm, file_name: e.target.value })}
                            className="flex-1 bg-slate-800 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-blue-500/50"
                            placeholder="Enter file name"
                          />
                          <button
                            onClick={handleRenameFile}
                            disabled={renaming || editForm.file_name === selectedAsset.file_name}
                            className={`px-4 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${
                              editForm.file_name !== selectedAsset.file_name
                                ? 'bg-blue-500 text-white hover:bg-blue-600'
                                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                            }`}
                          >
                            {renaming ? <Loader2 size={16} className="animate-spin" /> : <><Pencil size={16} /> Rename</>}
                          </button>
                        </div>
                        <p className="text-slate-500 text-xs mt-2">
                          Changes the actual file name in storage. The URL will be updated.
                        </p>
                      </div>
                    )}

                    {/* Display Name - Editable for media_assets, read-only info for others */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                        Display Name {selectedAsset.source_table === 'media_assets' && <span className="text-slate-500">(shown in library)</span>}
                      </label>
                      {selectedAsset.source_table === 'media_assets' ? (
                        <>
                          <input
                            type="text"
                            value={editForm.display_name}
                            onChange={(e) => setEditForm({ ...editForm, display_name: e.target.value })}
                            className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#2ecc71]/50"
                            placeholder="Enter a display name"
                          />
                          <p className="text-slate-600 text-xs mt-1">
                            This is just for organizing in the library. Does not affect the actual file.
                          </p>
                        </>
                      ) : (
                        <>
                          <input
                            type="text"
                            value={selectedAsset.display_name || selectedAsset.file_name}
                            readOnly
                            className="w-full bg-slate-800/30 border border-white/5 rounded-xl py-3 px-4 text-slate-400 cursor-not-allowed"
                          />
                          <p className="text-amber-400/70 text-xs mt-2 flex items-center gap-1">
                            <span>Name comes from {selectedAsset.source_table.replace('_', ' ')} title.</span>
                            <a
                              href={`/admin/${
                                selectedAsset.source_table === 'portfolio_items' || selectedAsset.source_table === 'portfolio_gallery'
                                  ? 'portfolio'
                                  : selectedAsset.source_table === 'blogs'
                                  ? 'blog'
                                  : selectedAsset.source_table
                              }`}
                              className="underline hover:text-amber-400"
                            >
                              Edit source
                            </a>
                          </p>
                        </>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                        Alt Text (SEO) <span className="text-[#2ecc71]">*Important</span>
                      </label>
                      <textarea
                        value={editForm.alt_text}
                        onChange={(e) => setEditForm({ ...editForm, alt_text: e.target.value })}
                        rows={3}
                        className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#2ecc71]/50 resize-none"
                        placeholder="Describe this image for search engines and accessibility"
                      />
                      <p className="text-slate-600 text-xs mt-1">
                        Good alt text helps SEO and screen readers.
                      </p>
                    </div>

                    {(selectedAsset.source_table === 'media_assets' || selectedAsset.source_table === 'portfolio_gallery') && (
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                          Caption
                        </label>
                        <textarea
                          value={editForm.caption}
                          onChange={(e) => setEditForm({ ...editForm, caption: e.target.value })}
                          rows={2}
                          className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#2ecc71]/50 resize-none"
                          placeholder="Optional caption"
                        />
                      </div>
                    )}

                    {selectedAsset.source_table === 'media_assets' && (
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
                    )}

                    {/* URL Copy */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                        Public URL
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={selectedAsset.public_url}
                          readOnly
                          className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3 px-4 text-slate-400 text-xs"
                        />
                        <button
                          onClick={() => copyToClipboard(selectedAsset.public_url, selectedAsset.id)}
                          className="px-4 bg-slate-800 border border-white/10 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700 transition-all flex-shrink-0"
                        >
                          {copiedId === selectedAsset.id ? <Check size={18} className="text-[#2ecc71]" /> : <Copy size={18} />}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Panel Footer - Actions */}
              <div className="p-4 border-t border-white/10 bg-slate-900/95 backdrop-blur space-y-3">
                {currentView === 'library' ? (
                  <>
                    <button
                      onClick={handleSaveEdit}
                      disabled={saving}
                      className="w-full py-3 bg-[#2ecc71] text-slate-950 rounded-xl font-bold disabled:opacity-50 flex items-center justify-center gap-2 hover:bg-[#27ae60] transition-all"
                    >
                      {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save size={18} /> Save Changes</>}
                    </button>

                    {selectedAsset.source_table === 'media_assets' && (
                      <button
                        onClick={() => setTrashConfirm(selectedAsset.id)}
                        className="w-full py-3 border border-amber-500/30 text-amber-400 rounded-xl font-medium hover:bg-amber-500/10 transition-all flex items-center justify-center gap-2"
                      >
                        <Trash2 size={18} /> Move to Trash
                      </button>
                    )}

                    {selectedAsset.source_table !== 'media_assets' && (
                      <p className="text-slate-500 text-xs text-center">
                        To delete this image, edit the original {selectedAsset.source_table.replace('_', ' ')} item.
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleRestore(selectedAsset.id)}
                      disabled={actionLoading}
                      className="w-full py-3 bg-[#2ecc71] text-slate-950 rounded-xl font-bold disabled:opacity-50 flex items-center justify-center gap-2 hover:bg-[#27ae60] transition-all"
                    >
                      {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><RotateCcw size={18} /> Restore File</>}
                    </button>

                    <button
                      onClick={() => setDeleteConfirm(selectedAsset.id)}
                      className="w-full py-3 border border-red-500/30 text-red-400 rounded-xl font-medium hover:bg-red-500/10 transition-all flex items-center justify-center gap-2"
                    >
                      <Trash2 size={18} /> Delete Permanently
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Move to Trash Confirmation Modal */}
        <AnimatePresence>
          {trashConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setTrashConfirm(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-sm p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-amber-500/20 rounded-xl">
                    <Trash2 size={24} className="text-amber-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Move to Trash?</h3>
                </div>
                <p className="text-slate-400 mb-6">
                  This file will be moved to trash and kept for 30 days. You can restore it anytime before permanent deletion.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setTrashConfirm(null)}
                    className="flex-1 py-3 border border-white/10 text-white rounded-xl font-medium hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleMoveToTrash(trashConfirm)}
                    disabled={actionLoading}
                    className="flex-1 py-3 bg-amber-500 text-slate-950 rounded-xl font-bold disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Move to Trash'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Permanent Delete Confirmation Modal */}
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
                className="bg-slate-900 border border-red-500/30 rounded-2xl w-full max-w-sm p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-red-500/20 rounded-xl">
                    <AlertTriangle size={24} className="text-red-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Delete Permanently?</h3>
                </div>
                <p className="text-slate-400 mb-6">
                  This will permanently delete the file from storage. <strong className="text-red-400">This action cannot be undone.</strong>
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="flex-1 py-3 border border-white/10 text-white rounded-xl font-medium hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handlePermanentDelete(deleteConfirm)}
                    disabled={actionLoading}
                    className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Delete Forever'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty Trash Confirmation Modal */}
        <AnimatePresence>
          {emptyTrashConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setEmptyTrashConfirm(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-slate-900 border border-red-500/30 rounded-2xl w-full max-w-sm p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-red-500/20 rounded-xl">
                    <Trash size={24} className="text-red-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Empty Trash?</h3>
                </div>
                <p className="text-slate-400 mb-6">
                  This will permanently delete <strong className="text-white">{trashedAssets.length} files</strong> from storage.
                  <strong className="text-red-400"> This action cannot be undone.</strong>
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setEmptyTrashConfirm(false)}
                    className="flex-1 py-3 border border-white/10 text-white rounded-xl font-medium hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEmptyTrash}
                    disabled={actionLoading}
                    className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Empty Trash'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bulk Move to Trash Confirmation Modal */}
        <AnimatePresence>
          {bulkAction === 'trash' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setBulkAction(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-sm p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-amber-500/20 rounded-xl">
                    <Trash2 size={24} className="text-amber-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Move to Trash?</h3>
                </div>
                <p className="text-slate-400 mb-6">
                  Move <strong className="text-white">{selectedIds.size} files</strong> to trash?
                  They will be kept for 30 days before permanent deletion. You can restore them anytime.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setBulkAction(null)}
                    className="flex-1 py-3 border border-white/10 text-white rounded-xl font-medium hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBulkMoveToTrash}
                    disabled={actionLoading}
                    className="flex-1 py-3 bg-amber-500 text-slate-950 rounded-xl font-bold disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Move to Trash'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bulk Restore Confirmation Modal */}
        <AnimatePresence>
          {bulkAction === 'restore' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setBulkAction(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-sm p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-[#2ecc71]/20 rounded-xl">
                    <RotateCcw size={24} className="text-[#2ecc71]" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Restore Files?</h3>
                </div>
                <p className="text-slate-400 mb-6">
                  Restore <strong className="text-white">{selectedIds.size} files</strong> from trash?
                  They will be moved back to the Media Library.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setBulkAction(null)}
                    className="flex-1 py-3 border border-white/10 text-white rounded-xl font-medium hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBulkRestore}
                    disabled={actionLoading}
                    className="flex-1 py-3 bg-[#2ecc71] text-slate-950 rounded-xl font-bold disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Restore Files'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bulk Permanent Delete Confirmation Modal */}
        <AnimatePresence>
          {bulkAction === 'delete' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setBulkAction(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-slate-900 border border-red-500/30 rounded-2xl w-full max-w-sm p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-red-500/20 rounded-xl">
                    <AlertTriangle size={24} className="text-red-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Delete Permanently?</h3>
                </div>
                <p className="text-slate-400 mb-6">
                  Permanently delete <strong className="text-white">{selectedIds.size} files</strong> from storage?
                  <strong className="text-red-400"> This action cannot be undone.</strong>
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setBulkAction(null)}
                    className="flex-1 py-3 border border-white/10 text-white rounded-xl font-medium hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBulkPermanentDelete}
                    disabled={actionLoading}
                    className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Delete Forever'}
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
