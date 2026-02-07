"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Plus, Edit2, Trash2, Search, Loader2, X,
  Star, ArrowLeft, Save, Image, ExternalLink, Upload, FileText,
  ChevronUp, ChevronDown, Tag
} from 'lucide-react';
import ProtectedRoute from '../../../components/admin/ProtectedRoute';
import { supabase } from '../../../lib/supabase';

interface PortfolioItem {
  id: string;
  service_id: string | null;
  title: string;
  description: string;
  thumbnail_url: string | null;
  thumbnail_alt_text: string | null;
  image_url: string | null;
  image_alt_text: string | null;
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
  alt_text: string | null;
  type: 'image' | 'video' | 'link';
  order_index: number;
  skill_tags?: string[]; // Array of sub_skill IDs
}

interface SubSkill {
  id: string;
  title: string;
  slug: string;
  category_id: string;
}

export default function PortfolioManagement() {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [subSkills, setSubSkills] = useState<SubSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterService, setFilterService] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [newGalleryItem, setNewGalleryItem] = useState({ url: '', alt_text: '', type: 'image' as 'image' | 'video' | 'link', skill_tags: [] as string[] });
  const [showBulkInput, setShowBulkInput] = useState(false);
  const [bulkUrls, setBulkUrls] = useState('');
  const [addingGalleryItem, setAddingGalleryItem] = useState(false);
  const [editingGalleryItem, setEditingGalleryItem] = useState<GalleryItem | null>(null);
  const [showEditGalleryModal, setShowEditGalleryModal] = useState(false);
  const [selectedGalleryItems, setSelectedGalleryItems] = useState<string[]>([]);
  const [showBulkTagModal, setShowBulkTagModal] = useState(false);
  const [bulkTagSelection, setBulkTagSelection] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    service_id: '',
    title: '',
    description: '',
    thumbnail_url: '',
    thumbnail_alt_text: '',
    image_url: '',
    image_alt_text: '',
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
      const [itemsRes, servicesRes, subSkillsRes] = await Promise.all([
        supabase.from('portfolio_items').select('*').order('order_index', { ascending: true }),
        supabase.from('services').select('id, title, slug').order('title', { ascending: true }),
        supabase.from('sub_skills').select('id, title, slug, category_id').eq('is_active', true).order('title', { ascending: true })
      ]);

      if (itemsRes.data) setPortfolioItems(itemsRes.data);
      if (servicesRes.data) setServices(servicesRes.data);
      if (subSkillsRes.data) setSubSkills(subSkillsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  }

  const filteredItems = portfolioItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.client_name && item.client_name.toLowerCase().includes(searchQuery.toLowerCase()));
    // Handle blog filter - blog posts have null service_id and 'blog' in tags
    const isBlogPost = !item.service_id && item.tags?.includes('blog');
    const matchesService = filterService === 'all' ||
      (filterService === 'blog' ? isBlogPost : item.service_id === filterService);
    return matchesSearch && matchesService;
  });

  const getServiceName = (serviceId: string | null, tags?: string[]) => {
    if (!serviceId) {
      // Check if it's a blog post by tags
      if (tags?.includes('blog')) return 'Blog';
      return 'Unknown';
    }
    if (serviceId === 'blog') return 'Blog';
    const service = services.find(s => s.id === serviceId);
    return service?.title || 'Unknown';
  };

  const handleOpenModal = (item?: PortfolioItem) => {
    if (item) {
      setEditingItem(item);
      fetchGalleryItems(item.id);
      // Check if it's a blog post (null service_id with 'blog' tag)
      const isBlogPost = !item.service_id && item.tags?.includes('blog');
      setFormData({
        service_id: isBlogPost ? 'blog' : (item.service_id || ''),
        title: item.title,
        description: item.description || '',
        thumbnail_url: item.thumbnail_url || '',
        thumbnail_alt_text: item.thumbnail_alt_text || '',
        image_url: item.image_url || '',
        image_alt_text: item.image_alt_text || '',
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
        thumbnail_alt_text: '',
        image_url: '',
        image_alt_text: '',
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

    // Handle tags - add 'blog' tag automatically if blog is selected
    let tags = formData.tags.split(',').map(t => t.trim()).filter(t => t);
    const isBlogPost = formData.service_id === 'blog';
    if (isBlogPost && !tags.includes('blog')) {
      tags = ['blog', ...tags];
    }

    // Generate slug from title
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const itemData = {
      service_id: isBlogPost ? null : formData.service_id,
      title: formData.title,
      slug: slug,
      description: formData.description || null,
      thumbnail_url: formData.thumbnail_url || null,
      thumbnail_alt_text: formData.thumbnail_alt_text || null,
      image_url: formData.image_url || null,
      image_alt_text: formData.image_alt_text || null,
      video_url: formData.video_url || null,
      project_url: formData.project_url || null,
      client_name: formData.client_name || null,
      completion_date: formData.completion_date || null,
      duration: formData.duration || null,
      tools_used: formData.tools_used.split(',').map(t => t.trim()).filter(t => t),
      tags: tags,
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

  const uploadFile = async (file: File, isDocument = false) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `portfolio-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `portfolio/${fileName}`;

    // Use 'documents' bucket for documents, 'images' bucket for media
    const bucketName = isDocument ? 'documents' : 'images';

    const { error: uploadError } = await supabase!.storage
      .from(bucketName)
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data } = supabase!.storage.from(bucketName).getPublicUrl(filePath);
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
      // Fetch tags for each gallery item
      const itemsWithTags = await Promise.all(data.map(async (item) => {
        const { data: tags } = await supabase
          .from('portfolio_gallery_skill_tags')
          .select('sub_skill_id')
          .eq('portfolio_gallery_id', item.id);

        return {
          ...item,
          skill_tags: tags?.map(t => t.sub_skill_id) || []
        };
      }));

      setGalleryItems(itemsWithTags as GalleryItem[]);
    }
  };

  const handleEditGalleryItem = (item: GalleryItem) => {
    setEditingGalleryItem(item);
    setShowEditGalleryModal(true);
  };

  const handleUpdateGalleryItemTags = async () => {
    if (!supabase || !editingGalleryItem) return;

    try {
      // First, delete existing tags
      await supabase
        .from('portfolio_gallery_skill_tags')
        .delete()
        .eq('portfolio_gallery_id', editingGalleryItem.id);

      // Then, add new tags
      if (editingGalleryItem.skill_tags && editingGalleryItem.skill_tags.length > 0) {
        await addSkillTagsToGalleryItem(editingGalleryItem.id, editingGalleryItem.skill_tags);
      }

      // Refresh gallery items
      if (editingItem) {
        await fetchGalleryItems(editingItem.id);
      }

      setShowEditGalleryModal(false);
      setEditingGalleryItem(null);
    } catch (error) {
      console.error('Error updating gallery item tags:', error);
      alert('Error updating tags');
    }
  };

  const handleAddGalleryItem = async () => {
    if (!supabase || !editingItem) {
      alert('Please save the portfolio item first before adding gallery items');
      return;
    }

    if (!editingItem.id) {
      alert('Portfolio item must be saved before adding gallery items');
      return;
    }

    // Allow adding if URL is present OR if we are about to upload (handled separately? No, let's make it so you select file OR enter URL)
    if (!newGalleryItem.url) {
      alert('Please enter a URL or upload a file');
      return;
    }

    setAddingGalleryItem(true);
    try {
      const { data, error } = await supabase
        .from('portfolio_gallery')
        .insert({
          portfolio_item_id: editingItem.id,
          url: newGalleryItem.url,
          alt_text: newGalleryItem.alt_text || null,
          type: newGalleryItem.type,
          order_index: galleryItems.length
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase error details:', error);
        throw error;
      }

      if (data) {
        // Add skill tags if selected
        if (newGalleryItem.skill_tags.length > 0) {
          await addSkillTagsToGalleryItem(data.id, newGalleryItem.skill_tags);
        }

        setGalleryItems([...galleryItems, { ...data, skill_tags: newGalleryItem.skill_tags } as GalleryItem]);
        setNewGalleryItem({ url: '', alt_text: '', type: 'image', skill_tags: [] });
      }
    } catch (error: any) {
      console.error('Error adding gallery item:', error);
      const errorMessage = error?.message || error?.error_description || 'Unknown error';
      alert(`Error adding gallery item: ${errorMessage}. Check the console for details.`);
    }
    setAddingGalleryItem(false);
  };

  const handleBulkAddUrls = async () => {
    if (!supabase || !editingItem || !editingItem.id) {
      alert('Please save the portfolio item first');
      return;
    }

    if (!bulkUrls.trim()) {
      alert('Please enter at least one URL');
      return;
    }

    // Parse URLs - split by newlines and filter empty lines
    const urls = bulkUrls
      .split('\n')
      .map(url => url.trim())
      .filter(url => url.length > 0);

    if (urls.length === 0) {
      alert('No valid URLs found');
      return;
    }

    setAddingGalleryItem(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      // Process each URL
      for (let i = 0; i < urls.length; i++) {
        const url = urls[i];

        // Auto-detect type based on URL
        let type: 'image' | 'video' | 'link' = 'link';
        if (/\.(jpg|jpeg|png|gif|webp|svg)(\?|$)/i.test(url)) {
          type = 'image';
        } else if (url.includes('youtube.com') || url.includes('youtu.be') || url.includes('tiktok.com') || url.includes('vimeo.com')) {
          type = 'video';
        }

        try {
          const { data, error } = await supabase
            .from('portfolio_gallery')
            .insert({
              portfolio_item_id: editingItem.id,
              url: url,
              alt_text: null,
              type: type,
              order_index: galleryItems.length + i
            })
            .select()
            .single();

          if (error) throw error;

          if (data) {
            setGalleryItems(prev => [...prev, { ...data, skill_tags: [] } as GalleryItem]);
            successCount++;
          }
        } catch (itemError) {
          console.error(`Error adding URL ${url}:`, itemError);
          errorCount++;
        }
      }

      // Show result
      if (successCount > 0) {
        alert(`Successfully added ${successCount} URL(s)${errorCount > 0 ? `, ${errorCount} failed` : ''}`);
        setBulkUrls('');
        setShowBulkInput(false);
      } else {
        alert('Failed to add URLs. Please check the console for details.');
      }
    } catch (error) {
      console.error('Error in bulk add:', error);
      alert('Error adding URLs');
    }
    setAddingGalleryItem(false);
  };

  const addSkillTagsToGalleryItem = async (galleryId: string, skillIds: string[]) => {
    if (!supabase || skillIds.length === 0) return;

    try {
      const tagInserts = skillIds.map(skillId => ({
        portfolio_gallery_id: galleryId,
        sub_skill_id: skillId
      }));

      const { error } = await supabase
        .from('portfolio_gallery_skill_tags')
        .insert(tagInserts);

      if (error) throw error;
    } catch (error) {
      console.error('Error adding skill tags:', error);
    }
  };

  const handleGalleryFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !supabase || !editingItem) return;

    if (!editingItem.id) {
      alert('Portfolio item must be saved before adding gallery items');
      return;
    }

    setAddingGalleryItem(true);
    try {
      const uploadPromises = Array.from(files).map(async (file, index) => {
        // Upload file - use 'documents' bucket for PDFs and DOCs, 'images' for media
        const isPDF = file.name.toLowerCase().endsWith('.pdf') || file.name.toLowerCase().endsWith('.doc') || file.name.toLowerCase().endsWith('.docx');
        const publicUrl = await uploadFile(file, isPDF);

        // Determine file type based on extension
        const isVideo = file.type.startsWith('video/') || /\.(mp4|webm|mov|avi)$/i.test(file.name);
        const fileType = isVideo ? 'video' : (isPDF ? 'link' : 'image');

        // Add each file to gallery
        const { data, error } = await supabase
          .from('portfolio_gallery')
          .insert({
            portfolio_item_id: editingItem.id,
            url: publicUrl,
            alt_text: newGalleryItem.alt_text || null,
            type: fileType, // 'image', 'video', or 'link' (documents as links)
            order_index: galleryItems.length + index
          })
          .select()
          .single();

        if (error) {
          console.error('Supabase error details:', error);
          throw error;
        }

        // Add skill tags if selected
        if (newGalleryItem.skill_tags.length > 0 && data) {
          await addSkillTagsToGalleryItem(data.id, newGalleryItem.skill_tags);
        }

        return { ...data, skill_tags: newGalleryItem.skill_tags } as GalleryItem;
      });

      const uploadedItems = await Promise.all(uploadPromises);
      setGalleryItems([...galleryItems, ...uploadedItems]);
      setNewGalleryItem({ url: '', alt_text: '', type: 'image', skill_tags: [] });
    } catch (error: any) {
      console.error('Error uploading/adding gallery items:', error);
      const errorMessage = error?.message || error?.error_description || 'Unknown error';
      alert(`Error uploading gallery items: ${errorMessage}. Check the console for details.`);
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

  const handleMoveGalleryItem = async (index: number, direction: 'up' | 'down') => {
    if (!supabase || !editingItem) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= galleryItems.length) return;

    // Create a copy of the array and swap items
    const newGalleryItems = [...galleryItems];
    [newGalleryItems[index], newGalleryItems[newIndex]] = [newGalleryItems[newIndex], newGalleryItems[index]];

    // Update order_index for both items
    try {
      await Promise.all([
        supabase
          .from('portfolio_gallery')
          .update({ order_index: newIndex })
          .eq('id', galleryItems[index].id),
        supabase
          .from('portfolio_gallery')
          .update({ order_index: index })
          .eq('id', galleryItems[newIndex].id)
      ]);

      // Update local state
      setGalleryItems(newGalleryItems.map((item, idx) => ({ ...item, order_index: idx })));
    } catch (error) {
      console.error('Error reordering gallery items:', error);
      alert('Error reordering gallery items');
    }
  };

  // Toggle selection for a gallery item
  const toggleGalleryItemSelection = (itemId: string) => {
    setSelectedGalleryItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  // Select all gallery items
  const selectAllGalleryItems = () => {
    if (selectedGalleryItems.length === galleryItems.length) {
      setSelectedGalleryItems([]);
    } else {
      setSelectedGalleryItems(galleryItems.map(item => item.id));
    }
  };

  // Open bulk tag modal
  const openBulkTagModal = () => {
    if (selectedGalleryItems.length === 0) {
      alert('Please select at least one gallery item');
      return;
    }
    setShowBulkTagModal(true);
    setBulkTagSelection([]);
  };

  // Handle bulk tag assignment
  const handleBulkTagAssignment = async () => {
    if (!supabase || selectedGalleryItems.length === 0) return;

    if (bulkTagSelection.length === 0) {
      alert('Please select at least one skill tag');
      return;
    }

    if (bulkTagSelection.length > 3) {
      alert('Maximum 3 tags allowed per item');
      return;
    }

    try {
      // For each selected gallery item
      for (const itemId of selectedGalleryItems) {
        // First, delete existing tags
        await supabase
          .from('portfolio_gallery_skill_tags')
          .delete()
          .eq('portfolio_gallery_id', itemId);

        // Then, insert new tags
        if (bulkTagSelection.length > 0) {
          const tagInserts = bulkTagSelection.map(skillId => ({
            portfolio_gallery_id: itemId,
            sub_skill_id: skillId
          }));

          await supabase
            .from('portfolio_gallery_skill_tags')
            .insert(tagInserts);
        }
      }

      // Update local state
      setGalleryItems(prev =>
        prev.map(item =>
          selectedGalleryItems.includes(item.id)
            ? { ...item, skill_tags: bulkTagSelection }
            : item
        )
      );

      alert(`Successfully updated tags for ${selectedGalleryItems.length} items`);
      setShowBulkTagModal(false);
      setSelectedGalleryItems([]);
      setBulkTagSelection([]);
    } catch (error) {
      console.error('Error updating bulk tags:', error);
      alert('Error updating tags. Please try again.');
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
                  <p className="text-slate-500 text-sm mb-2">{getServiceName(item.service_id, item.tags)}</p>
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
                          <div className="mt-2">
                            <input
                              type="text"
                              value={formData.thumbnail_alt_text}
                              onChange={(e) => setFormData({ ...formData, thumbnail_alt_text: e.target.value })}
                              className="w-full bg-slate-800/50 border border-white/10 rounded-lg py-2 px-3 text-white text-sm focus:outline-none focus:border-[#2ecc71]/50"
                              placeholder="Alt Text (SEO): e.g., Corporate video production for TechStart"
                            />
                          </div>
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
                          <div className="mt-2">
                            <input
                              type="text"
                              value={formData.image_alt_text}
                              onChange={(e) => setFormData({ ...formData, image_alt_text: e.target.value })}
                              className="w-full bg-slate-800/50 border border-white/10 rounded-lg py-2 px-3 text-white text-sm focus:outline-none focus:border-[#2ecc71]/50"
                              placeholder="Alt Text (SEO): Describe the image"
                            />
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
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white font-bold flex items-center gap-2">
                          <Image size={18} className="text-[#2ecc71]" />
                          Gallery Images & Videos
                        </h3>
                        <button
                          type="button"
                          onClick={() => setShowBulkInput(!showBulkInput)}
                          className="px-4 py-2 bg-[#2ecc71]/10 border border-[#2ecc71]/30 rounded-lg text-[#2ecc71] text-sm font-medium hover:bg-[#2ecc71]/20 transition-all"
                        >
                          {showBulkInput ? '← Single Add' : '📋 Bulk Add URLs'}
                        </button>
                      </div>

                      {/* Bulk URL Input */}
                      {showBulkInput && (
                        <div className="mb-6 p-4 bg-slate-800/30 border border-[#2ecc71]/20 rounded-xl">
                          <label className="block text-white font-medium mb-2 text-sm">
                            Paste Multiple URLs (one per line)
                          </label>
                          <textarea
                            value={bulkUrls}
                            onChange={(e) => setBulkUrls(e.target.value)}
                            className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#2ecc71]/50 font-mono text-sm"
                            placeholder="https://example.com/image1.jpg&#10;https://youtube.com/watch?v=xyz&#10;https://docs.google.com/document/d/abc&#10;https://example.com/image2.png"
                            rows={8}
                          />
                          <div className="flex items-center justify-between mt-3">
                            <p className="text-slate-400 text-xs">
                              ✨ Auto-detects: Images (.jpg, .png), Videos (YouTube, TikTok), Documents/Links
                            </p>
                            <button
                              type="button"
                              onClick={handleBulkAddUrls}
                              disabled={addingGalleryItem || !bulkUrls.trim()}
                              className="px-6 py-2 bg-[#2ecc71] text-slate-950 font-bold rounded-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                              {addingGalleryItem ? 'Adding...' : `Add ${bulkUrls.split('\n').filter(u => u.trim()).length} URLs`}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Add New Gallery Item */}
                      {!showBulkInput && (
                        <div className="flex gap-3 mb-6 items-start">
                        <select
                          value={newGalleryItem.type}
                          onChange={(e) => setNewGalleryItem({ ...newGalleryItem, type: e.target.value as 'image' | 'video' | 'link' })}
                          className="bg-slate-800/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#2ecc71]/50 h-[46px]"
                        >
                          <option value="image">Image</option>
                          <option value="video">Video</option>
                          <option value="link">Link (Documents, External Links)</option>
                        </select>

                        <div className="flex-1 flex flex-col gap-2">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={newGalleryItem.url}
                              onChange={(e) => setNewGalleryItem({ ...newGalleryItem, url: e.target.value })}
                              className="flex-1 bg-slate-800/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#2ecc71]/50"
                              placeholder={
                                newGalleryItem.type === 'image'
                                  ? "Paste Image URL or Upload..."
                                  : newGalleryItem.type === 'video'
                                  ? "Paste Video URL (YouTube, TikTok) or Upload..."
                                  : "Paste URL (Documents, External Links, etc.)"
                              }
                            />
                          </div>
                          {newGalleryItem.type === 'image' && (
                            <input
                              type="text"
                              value={newGalleryItem.alt_text}
                              onChange={(e) => setNewGalleryItem({ ...newGalleryItem, alt_text: e.target.value })}
                              className="w-full bg-slate-800/50 border border-white/10 rounded-lg py-2 px-3 text-white text-sm focus:outline-none focus:border-[#2ecc71]/50"
                              placeholder="Alt Text (SEO): Describe this image for search engines"
                            />
                          )}

                          {/* Skill Tags Selection - Max 3 */}
                          <div className="space-y-2">
                            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                              Add to Skill Portfolio (Max 3)
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {subSkills.map((skill) => {
                                const isSelected = newGalleryItem.skill_tags.includes(skill.id);
                                const canSelect = newGalleryItem.skill_tags.length < 3;

                                return (
                                  <button
                                    key={skill.id}
                                    type="button"
                                    onClick={() => {
                                      if (isSelected) {
                                        // Remove tag
                                        setNewGalleryItem({
                                          ...newGalleryItem,
                                          skill_tags: newGalleryItem.skill_tags.filter(id => id !== skill.id)
                                        });
                                      } else if (canSelect) {
                                        // Add tag
                                        setNewGalleryItem({
                                          ...newGalleryItem,
                                          skill_tags: [...newGalleryItem.skill_tags, skill.id]
                                        });
                                      }
                                    }}
                                    disabled={!isSelected && !canSelect}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                      isSelected
                                        ? 'bg-[#2ecc71] text-slate-950'
                                        : canSelect
                                        ? 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-white'
                                        : 'bg-slate-900/50 text-slate-600 cursor-not-allowed'
                                    }`}
                                  >
                                    {skill.title}
                                  </button>
                                );
                              })}
                            </div>
                            <p className="text-slate-600 text-xs">
                              Selected: {newGalleryItem.skill_tags.length}/3 - Image will auto-sync to selected skill galleries
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={handleAddGalleryItem}
                            disabled={addingGalleryItem || !newGalleryItem.url}
                            className="bg-[#2ecc71] text-slate-950 px-4 rounded-xl font-bold hover:bg-[#27ae60] disabled:opacity-50 h-[46px] w-fit flex items-center justify-center gap-2"
                          >
                            {addingGalleryItem && newGalleryItem.url ? <Loader2 size={18} className="animate-spin" /> : <><Plus size={18} /> Add</>}
                          </button>

                          {/* OR Divider and File Upload - Only for image/video/document, not links */}
                          {newGalleryItem.type !== 'link' && (
                            <>
                              <div className="flex items-center gap-3 my-2">
                                <div className="flex-1 h-px bg-white/10"></div>
                                <span className="text-slate-500 text-xs font-medium uppercase">or</span>
                                <div className="flex-1 h-px bg-white/10"></div>
                              </div>

                              {/* File Upload Area */}
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
                                    {newGalleryItem.type === 'image'
                                      ? 'PNG, JPG, WEBP up to 10MB'
                                      : 'MP4, WEBM up to 50MB'}
                                  </span>
                                  <span className="text-[#2ecc71] text-xs mt-1 block font-semibold">
                                    Multiple files supported
                                  </span>
                                </div>
                                <input
                                  type="file"
                                  accept={
                                    newGalleryItem.type === 'image'
                                      ? "image/*"
                                      : "video/*"
                                  }
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
                      )}

                      {/* Gallery Grid */}
                      {galleryItems.length > 0 ? (
                        <>
                          {/* Bulk Actions Bar */}
                          <div className="flex items-center justify-between mb-4 p-3 bg-slate-800/30 border border-white/10 rounded-xl">
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={selectedGalleryItems.length === galleryItems.length && galleryItems.length > 0}
                                onChange={selectAllGalleryItems}
                                className="w-5 h-5 rounded bg-slate-800 border-white/10 text-[#2ecc71] focus:ring-[#2ecc71] focus:ring-offset-0"
                              />
                              <span className="text-slate-400 text-sm">
                                {selectedGalleryItems.length === 0
                                  ? 'Select items'
                                  : `${selectedGalleryItems.length} selected`}
                              </span>
                            </div>
                            {selectedGalleryItems.length > 0 && (
                              <button
                                onClick={openBulkTagModal}
                                className="px-4 py-2 bg-[#2ecc71]/10 border border-[#2ecc71]/30 rounded-lg text-[#2ecc71] text-sm font-medium hover:bg-[#2ecc71]/20 transition-all flex items-center gap-2"
                              >
                                <Tag size={16} />
                                Set Tags for Selected
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {galleryItems.map((item, index) => (
                            <div key={item.id} className="relative flex flex-col">
                              <div className="relative group aspect-video bg-slate-800 rounded-lg overflow-hidden border border-white/10">
                                {/* Checkbox for selection */}
                                <div className="absolute top-2 left-2 z-10">
                                  <input
                                    type="checkbox"
                                    checked={selectedGalleryItems.includes(item.id)}
                                    onChange={() => toggleGalleryItemSelection(item.id)}
                                    onClick={(e) => e.stopPropagation()}
                                    className="w-5 h-5 rounded bg-slate-800 border-white/30 text-[#2ecc71] focus:ring-[#2ecc71] focus:ring-offset-0 shadow-lg"
                                  />
                                </div>
                                {item.type === 'image' ? (
                                  <img src={item.url} alt="Gallery item" className="w-full h-full object-cover" />
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
                                      {item.url.endsWith('.pdf') || item.url.includes('/documents/') ? (
                                        <>
                                          <FileText size={32} />
                                          <span className="text-xs text-slate-400 max-w-[90%] truncate text-center">{item.alt_text || 'Document'}</span>
                                        </>
                                      ) : (
                                        <>
                                          <ExternalLink size={24} />
                                          <span className="text-xs text-slate-400 max-w-[80%] truncate">{item.url}</span>
                                        </>
                                      )}
                                    </div>
                                  </a>
                                )}

                                {/* Reorder buttons - Left side */}
                                <div className="absolute top-2 left-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  {index > 0 && (
                                    <button
                                      type="button"
                                      onClick={() => handleMoveGalleryItem(index, 'up')}
                                      className="p-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                      title="Move left"
                                    >
                                      <ChevronUp size={14} className="rotate-[-90deg]" />
                                    </button>
                                  )}
                                  {index < galleryItems.length - 1 && (
                                    <button
                                      type="button"
                                      onClick={() => handleMoveGalleryItem(index, 'down')}
                                      className="p-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                      title="Move right"
                                    >
                                      <ChevronDown size={14} className="rotate-[-90deg]" />
                                    </button>
                                  )}
                                </div>

                                {/* Action buttons - Right side */}
                                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    type="button"
                                    onClick={() => handleEditGalleryItem(item)}
                                    className="p-1.5 bg-[#2ecc71] text-slate-900 rounded-lg hover:bg-[#27ae60] transition-colors"
                                  >
                                    <Edit2 size={14} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteGalleryItem(item.id)}
                                    className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>

                              {/* Tags display */}
                              {item.skill_tags && item.skill_tags.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-1">
                                  {item.skill_tags.map((tagId) => {
                                    const skill = subSkills.find(s => s.id === tagId);
                                    return skill ? (
                                      <span
                                        key={tagId}
                                        className="px-2 py-0.5 bg-[#2ecc71]/20 text-[#2ecc71] text-[10px] font-semibold rounded"
                                      >
                                        {skill.title}
                                      </span>
                                    ) : null;
                                  })}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        </>
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

        {/* Edit Gallery Item Tags Modal */}
        <AnimatePresence>
          {showEditGalleryModal && editingGalleryItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowEditGalleryModal(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-lg p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-bold text-white mb-4">Edit Skill Tags</h3>

                {/* Preview */}
                <div className="mb-4 aspect-video rounded-lg overflow-hidden border border-white/10">
                  {editingGalleryItem.type === 'image' ? (
                    <img src={editingGalleryItem.url} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-500">
                      {editingGalleryItem.type}
                    </div>
                  )}
                </div>

                {/* Tag Selection */}
                <div className="space-y-2 mb-6">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    Select Skills (Max 3)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {subSkills.map((skill) => {
                      const isSelected = editingGalleryItem.skill_tags?.includes(skill.id);
                      const canSelect = (editingGalleryItem.skill_tags?.length || 0) < 3;

                      return (
                        <button
                          key={skill.id}
                          type="button"
                          onClick={() => {
                            const currentTags = editingGalleryItem.skill_tags || [];
                            if (isSelected) {
                              setEditingGalleryItem({
                                ...editingGalleryItem,
                                skill_tags: currentTags.filter(id => id !== skill.id)
                              });
                            } else if (canSelect) {
                              setEditingGalleryItem({
                                ...editingGalleryItem,
                                skill_tags: [...currentTags, skill.id]
                              });
                            }
                          }}
                          disabled={!isSelected && !canSelect}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            isSelected
                              ? 'bg-[#2ecc71] text-slate-950'
                              : canSelect
                              ? 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-white'
                              : 'bg-slate-900/50 text-slate-600 cursor-not-allowed'
                          }`}
                        >
                          {skill.title}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-slate-600 text-xs">
                    Selected: {editingGalleryItem.skill_tags?.length || 0}/3
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowEditGalleryModal(false)}
                    className="flex-1 py-3 border border-white/10 text-white rounded-xl hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateGalleryItemTags}
                    className="flex-1 py-3 bg-[#2ecc71] text-slate-950 rounded-xl font-bold hover:bg-[#27ae60]"
                  >
                    Save Tags
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bulk Tag Assignment Modal */}
        <AnimatePresence>
          {showBulkTagModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowBulkTagModal(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-lg p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-bold text-white mb-4">
                  Set Tags for {selectedGalleryItems.length} Items
                </h3>

                {/* Selected items preview */}
                <div className="mb-4 p-3 bg-slate-800/30 border border-white/10 rounded-xl">
                  <p className="text-slate-400 text-sm">
                    You are about to set tags for <span className="text-[#2ecc71] font-semibold">{selectedGalleryItems.length}</span> selected gallery items.
                  </p>
                </div>

                {/* Tag Selection */}
                <div className="space-y-2 mb-6">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    Select Skills (Max 3)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {subSkills.map((skill) => {
                      const isSelected = bulkTagSelection.includes(skill.id);
                      const canSelect = bulkTagSelection.length < 3;

                      return (
                        <button
                          key={skill.id}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setBulkTagSelection(prev => prev.filter(id => id !== skill.id));
                            } else if (canSelect) {
                              setBulkTagSelection(prev => [...prev, skill.id]);
                            }
                          }}
                          disabled={!isSelected && !canSelect}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            isSelected
                              ? 'bg-[#2ecc71] text-slate-950'
                              : canSelect
                              ? 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-white'
                              : 'bg-slate-900/50 text-slate-600 cursor-not-allowed'
                          }`}
                        >
                          {skill.title}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-slate-600 text-xs">
                    Selected: {bulkTagSelection.length}/3 - These tags will be applied to all selected items
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowBulkTagModal(false)}
                    className="flex-1 py-3 border border-white/10 text-white rounded-xl hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBulkTagAssignment}
                    disabled={bulkTagSelection.length === 0}
                    className="flex-1 py-3 bg-[#2ecc71] text-slate-950 rounded-xl font-bold hover:bg-[#27ae60] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Apply to {selectedGalleryItems.length} Items
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
