"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NextLink from 'next/link';
import dynamic from 'next/dynamic';
import {
    ArrowLeft, Plus, Search, Edit2, Trash2, Save, X,
    Image as ImageIcon, Video, Link as LinkIcon, Eye,
    Loader2, CheckCircle, AlertCircle, Upload
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import 'react-quill/dist/quill.snow.css';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

// Blog Interface
interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    cover_image: string;
    video_url: string;
    external_link: string;
    author: string;
    tags: string[];
    is_published: boolean;
    published_at: string;
}

export default function BlogAdminPage() {
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [currentBlog, setCurrentBlog] = useState<Partial<BlogPost>>({});
    const [saving, setSaving] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    // Quill modules configuration
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
            ['link', 'image', 'video'],
            [{ 'align': [] }],
            ['clean']
        ],
    };

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image', 'video', 'align'
    ];

    // Fetch blogs
    const fetchBlogs = async () => {
        if (!supabase) return;
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('blogs')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setBlogs(data || []);
        } catch (error) {
            console.error('Error fetching blogs:', error);
            showNotification('error', 'Failed to fetch blogs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    // Show notification
    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 3000);
    };

    // Handle File Upload
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        setUploadingImage(true);

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `blog-covers/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('portfolio-assets') // Reusing existing bucket
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('portfolio-assets')
                .getPublicUrl(filePath);

            setCurrentBlog({ ...currentBlog, cover_image: publicUrl });
            showNotification('success', 'Image uploaded successfully');
        } catch (error: any) {
            console.error('Error uploading image:', error);
            showNotification('error', error.message || 'Failed to upload image');
        } finally {
            setUploadingImage(false);
        }
    };

    // Handle Edit/Create
    const handleEdit = (blog?: BlogPost) => {
        if (blog) {
            setCurrentBlog(blog);
        } else {
            setCurrentBlog({
                title: '',
                slug: '',
                excerpt: '',
                content: '',
                cover_image: '',
                video_url: '',
                external_link: '',
                author: 'Neaz Morshed',
                tags: [],
                is_published: false
            });
        }
        setIsEditing(true);
    };

    // Generate Slug from Title
    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    // Save Blog
    const handleSave = async () => {
        if (!currentBlog.title) {
            showNotification('error', 'Title is required');
            return;
        }

        setSaving(true);
        try {
            const slug = currentBlog.slug || generateSlug(currentBlog.title);
            const blogData = {
                ...currentBlog,
                slug,
                updated_at: new Date().toISOString()
            };

            let error;
            if (currentBlog.id) {
                // Update
                const { error: updateError } = await supabase
                    .from('blogs')
                    .update(blogData)
                    .eq('id', currentBlog.id);
                error = updateError;
            } else {
                // Insert
                const { error: insertError } = await supabase
                    .from('blogs')
                    .insert([blogData]);
                error = insertError;
            }

            if (error) throw error;

            showNotification('success', 'Blog saved successfully');
            setIsEditing(false);
            fetchBlogs();
        } catch (error: any) {
            console.error('Error saving blog:', error);
            showNotification('error', error.message || 'Failed to save blog');
        } finally {
            setSaving(false);
        }
    };

    // Delete Blog
    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this blog post?')) return;

        try {
            const { error } = await supabase
                .from('blogs')
                .delete()
                .eq('id', id);

            if (error) throw error;
            showNotification('success', 'Blog deleted successfully');
            fetchBlogs();
        } catch (error) {
            console.error('Error deleting blog:', error);
            showNotification('error', 'Failed to delete blog');
        }
    };

    // Filtered blogs
    const filteredBlogs = blogs.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-[#0b0f1a] text-white min-h-screen p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                    <NextLink href="/admin" className="inline-flex items-center gap-2 text-slate-400 hover:text-[#2ecc71] transition-colors mb-4">
                        <ArrowLeft size={20} />
                        Back to Dashboard
                    </NextLink>
                    <h1 className="text-4xl font-black uppercase tracking-tighter">
                        Manage <span className="text-[#2ecc71]">Blogs</span>
                    </h1>
                </div>
                <button
                    onClick={() => handleEdit()}
                    className="flex items-center gap-2 px-6 py-3 bg-[#2ecc71] text-slate-900 rounded-xl font-black uppercase tracking-widest hover:bg-[#27ae60] transition-colors"
                >
                    <Plus size={20} />
                    New Post
                </button>
            </div>

            {/* Notification */}
            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`fixed top-8 right-8 p-4 rounded-xl flex items-center gap-3 shadow-2xl z-50 ${notification.type === 'success' ? 'bg-[#2ecc71] text-slate-900' : 'bg-red-500 text-white'
                            }`}
                    >
                        {notification.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                        <span className="font-bold">{notification.message}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Content Area */}
            {isEditing ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-900/50 border border-white/10 rounded-3xl p-8"
                >
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-black uppercase tracking-tight">
                            {currentBlog.id ? 'Edit Post' : 'New Post'}
                        </h2>
                        <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            {/* Title */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Title</label>
                                <input
                                    type="text"
                                    value={currentBlog.title || ''}
                                    onChange={(e) => setCurrentBlog({ ...currentBlog, title: e.target.value })}
                                    className="w-full bg-slate-950 border border-white/10 rounded-xl p-4 text-white focus:border-[#2ecc71] outline-none transition-colors"
                                    placeholder="Enter blog title"
                                />
                            </div>

                            {/* Slug (Optional override) */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Slug (URL)</label>
                                <input
                                    type="text"
                                    value={currentBlog.slug || ''}
                                    onChange={(e) => setCurrentBlog({ ...currentBlog, slug: e.target.value })}
                                    className="w-full bg-slate-950 border border-white/10 rounded-xl p-4 text-slate-400 focus:border-[#2ecc71] outline-none transition-colors font-mono text-sm"
                                    placeholder="Auto-generated if empty"
                                />
                            </div>

                            {/* Excerpt */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Excerpt</label>
                                <textarea
                                    value={currentBlog.excerpt || ''}
                                    onChange={(e) => setCurrentBlog({ ...currentBlog, excerpt: e.target.value })}
                                    rows={3}
                                    className="w-full bg-slate-950 border border-white/10 rounded-xl p-4 text-white focus:border-[#2ecc71] outline-none transition-colors"
                                    placeholder="Short summary for list view"
                                />
                            </div>

                            {/* External Link */}
                            <div className="p-4 bg-[#2ecc71]/5 border border-[#2ecc71]/20 rounded-xl">
                                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#2ecc71] mb-2">
                                    <LinkIcon size={14} />
                                    External Link (Redirect)
                                </label>
                                <input
                                    type="text"
                                    value={currentBlog.external_link || ''}
                                    onChange={(e) => setCurrentBlog({ ...currentBlog, external_link: e.target.value })}
                                    className="w-full bg-slate-950 border border-white/10 rounded-xl p-4 text-white focus:border-[#2ecc71] outline-none transition-colors"
                                    placeholder="e.g., https://neazoutsource.wixsite.com/..."
                                />
                                <p className="text-[10px] text-slate-500 mt-2">
                                    If filled, clicking this blog post will take the user directly to this URL instead of the details page.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* Cover Image */}
                            <div>
                                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                                    <ImageIcon size={14} />
                                    Cover Image
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={currentBlog.cover_image || ''}
                                        onChange={(e) => setCurrentBlog({ ...currentBlog, cover_image: e.target.value })}
                                        className="flex-1 bg-slate-950 border border-white/10 rounded-xl p-4 text-white focus:border-[#2ecc71] outline-none transition-colors"
                                        placeholder="https://..."
                                    />
                                    <label className="flex items-center justify-center p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl cursor-pointer transition-colors">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                            disabled={uploadingImage}
                                        />
                                        {uploadingImage ? <Loader2 size={20} className="animate-spin text-[#2ecc71]" /> : <Upload size={20} className="text-[#2ecc71]" />}
                                    </label>
                                </div>
                                {currentBlog.cover_image && (
                                    <div className="mt-4 aspect-video rounded-xl overflow-hidden border border-white/10">
                                        <img src={currentBlog.cover_image} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>

                            {/* Video URL */}
                            <div>
                                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                                    <Video size={14} />
                                    Video URL
                                </label>
                                <input
                                    type="text"
                                    value={currentBlog.video_url || ''}
                                    onChange={(e) => setCurrentBlog({ ...currentBlog, video_url: e.target.value })}
                                    className="w-full bg-slate-950 border border-white/10 rounded-xl p-4 text-white focus:border-[#2ecc71] outline-none transition-colors"
                                    placeholder="Optional video link"
                                />
                            </div>

                            {/* Status */}
                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-3 p-4 bg-slate-950 border border-white/10 rounded-xl cursor-pointer hover:border-[#2ecc71] transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={currentBlog.is_published || false}
                                        onChange={(e) => setCurrentBlog({ ...currentBlog, is_published: e.target.checked })}
                                        className="w-5 h-5 accent-[#2ecc71]"
                                    />
                                    <span className="font-bold text-sm">Published</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Rich Text Editor */}
                    <div className="mt-8">
                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Content</label>
                        <div className="bg-slate-950 border border-white/10 rounded-xl overflow-hidden text-black blog-editor">
                            <ReactQuill
                                theme="snow"
                                value={currentBlog.content || ''}
                                onChange={(value) => setCurrentBlog({ ...currentBlog, content: value })}
                                modules={modules}
                                formats={formats}
                                className="bg-white min-h-[400px]"
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-4 mt-8 pt-8 border-t border-white/10">
                        <button
                            onClick={() => setIsEditing(false)}
                            className="px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-2 px-8 py-4 bg-[#2ecc71] text-slate-900 rounded-xl font-black uppercase tracking-widest hover:bg-[#27ae60] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                            {saving ? 'Saving...' : 'Save Post'}
                        </button>
                    </div>
                </motion.div>
            ) : (
                <>
                    {/* Search Bar */}
                    <div className="relative mb-8">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                        <input
                            type="text"
                            placeholder="Search blogs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-white/10 rounded-2xl text-white focus:border-[#2ecc71] outline-none transition-colors"
                        />
                    </div>

                    {/* Blog List */}
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="w-10 h-10 text-[#2ecc71] animate-spin" />
                        </div>
                    ) : filteredBlogs.length === 0 ? (
                        <div className="text-center py-20 text-slate-500">
                            No blog posts found. Create one to get started!
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {filteredBlogs.map((blog) => (
                                <motion.div
                                    key={blog.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center justify-between p-6 bg-slate-900/50 border border-white/5 rounded-2xl hover:border-[#2ecc71]/30 transition-all group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-800 flex-shrink-0">
                                            {blog.cover_image ? (
                                                <img src={blog.cover_image} alt={blog.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-600">
                                                    <ImageIcon size={20} />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg text-white mb-1 group-hover:text-[#2ecc71] transition-colors content-center">
                                                {blog.title}
                                                {blog.external_link && <LinkIcon size={12} className="inline ml-2 text-slate-500" />}
                                            </h3>
                                            <div className="flex items-center gap-3 text-xs text-slate-500 uppercase tracking-wider">
                                                <span className={blog.is_published ? 'text-[#2ecc71]' : 'text-amber-500'}>
                                                    {blog.is_published ? 'Published' : 'Draft'}
                                                </span>
                                                <span>•</span>
                                                <span>{new Date(blog.published_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleEdit(blog)}
                                            className="p-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                                            title="Edit"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(blog.id)}
                                            className="p-3 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                                            title="Delete"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
