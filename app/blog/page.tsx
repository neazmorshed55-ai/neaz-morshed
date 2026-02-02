"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {
    ArrowRight, ArrowLeft, Loader2, Calendar, User,
    ExternalLink, Search, Tag, Clock
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Navbar from '../../components/Navbar';
import VideoBackground from '../../components/VideoBackground';

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    cover_image: string;
    cover_image_alt_text?: string | null;
    video_url: string;
    external_link: string;
    author: string;
    tags: string[];
    published_at: string;
}

export default function BlogPage() {
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTag, setSelectedTag] = useState<string | null>(null);

    useEffect(() => {
        async function fetchBlogs() {
            if (!supabase) {
                setLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from('blogs')
                .select('*')
                .eq('is_published', true)
                .order('published_at', { ascending: false });

            if (!error && data) {
                setBlogs(data);
            }
            setLoading(false);
        }

        fetchBlogs();
    }, []);

    // Filter blogs
    const filteredBlogs = blogs.filter(blog => {
        const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            blog.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTag = selectedTag ? blog.tags?.includes(selectedTag) : true;
        return matchesSearch && matchesTag;
    });

    // Get all unique tags
    const allTags = Array.from(new Set(blogs.flatMap(blog => blog.tags || [])));

    return (
        <div className="bg-[#0b0f1a] text-white min-h-screen selection:bg-[#2ecc71] selection:text-slate-900">
            <Navbar />

            <main className="pb-24">
                {/* Hero Section */}
                <section className="pt-32 pb-20 relative overflow-hidden min-h-[50vh] flex flex-col justify-center">
                    <div className="absolute inset-0 bg-[#0b0f1a]">
                        <div className="absolute inset-0 bg-gradient-to-b from-[#2ecc71]/10 to-[#0b0f1a] opacity-30"></div>
                        {/* Abstract Shapes */}
                        <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-[#2ecc71]/5 rounded-full blur-[150px] animate-pulse"></div>
                    </div>

                    <div className="container mx-auto px-6 max-w-7xl relative z-10 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <span className="text-[#2ecc71] text-[11px] font-black uppercase tracking-[0.5em] mb-6 block">Insights & Updates</span>
                            <h1 className="text-5xl lg:text-8xl font-black uppercase tracking-tighter leading-none mb-8">
                                My <span className="text-slate-600">Blog</span>
                            </h1>
                            <p className="text-slate-400 text-xl max-w-2xl mx-auto leading-relaxed">
                                Thoughts on Virtual Assistance, Web Development, AI, and the future of remote work.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Search & Filter */}
                <section className="container mx-auto px-6 max-w-7xl mb-12">
                    <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
                        {/* Search */}
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                            <input
                                type="text"
                                placeholder="Search articles..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-white/10 rounded-2xl text-white focus:border-[#2ecc71] outline-none transition-colors"
                            />
                        </div>

                        {/* Tags */}
                        {allTags.length > 0 && (
                            <div className="flex flex-wrap justify-center gap-2">
                                <button
                                    onClick={() => setSelectedTag(null)}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${selectedTag === null ? 'bg-[#2ecc71] text-slate-900' : 'bg-slate-900/50 text-slate-400 hover:text-white'
                                        }`}
                                >
                                    All
                                </button>
                                {allTags.map(tag => (
                                    <button
                                        key={tag}
                                        onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                                        className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${selectedTag === tag ? 'bg-[#2ecc71] text-slate-900' : 'bg-slate-900/50 text-slate-400 hover:text-white'
                                            }`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* Blog Grid */}
                <section className="container mx-auto px-6 max-w-7xl">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="w-12 h-12 text-[#2ecc71] animate-spin" />
                        </div>
                    ) : filteredBlogs.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-slate-400 text-lg">No articles found matching your criteria.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredBlogs.map((blog, index) => (
                                <motion.div
                                    key={blog.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="group flex flex-col h-full bg-slate-900/40 border border-white/5 rounded-[2rem] overflow-hidden hover:border-[#2ecc71]/30 transition-all duration-300 hover:-translate-y-2"
                                >
                                    {/* Cover Image */}
                                    <div className="relative h-64 overflow-hidden">
                                        <div className="absolute inset-0 bg-slate-900 animate-pulse" /> {/* Placeholder */}
                                        {blog.cover_image && (
                                            <Image
                                                src={blog.cover_image}
                                                alt={blog.cover_image_alt_text || blog.title}
                                                fill
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        )}
                                        {/* Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f1a] to-transparent opacity-60"></div>

                                        {/* External Link Indicator */}
                                        {blog.external_link && (
                                            <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-sm p-2 rounded-full text-[#2ecc71] border border-[#2ecc71]/20">
                                                <ExternalLink size={16} />
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-8 flex flex-col flex-grow">
                                        {/* Meta */}
                                        <div className="flex items-center gap-4 text-xs text-slate-500 mb-4 font-bold uppercase tracking-wider">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={12} className="text-[#2ecc71]" />
                                                <span>{new Date(blog.published_at || blog.id).toLocaleDateString()}</span>
                                            </div>
                                            {blog.tags && blog.tags.length > 0 && (
                                                <div className="flex items-center gap-2">
                                                    <Tag size={12} className="text-[#2ecc71]" />
                                                    <span>{blog.tags[0]}</span>
                                                </div>
                                            )}
                                        </div>

                                        <h2 className="text-2xl font-black mb-4 leading-tight group-hover:text-[#2ecc71] transition-colors line-clamp-2">
                                            {blog.title}
                                        </h2>

                                        <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3">
                                            {blog.excerpt}
                                        </p>

                                        <div className="mt-auto">
                                            {// External link logic
                                                blog.external_link ? (
                                                    <a
                                                        href={blog.external_link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 text-[#2ecc71] font-black uppercase tracking-widest text-xs group-hover:translate-x-2 transition-transform"
                                                    >
                                                        Read on {blog.external_link.includes('linkedin') ? 'LinkedIn' : 'External Site'} <ExternalLink size={14} />
                                                    </a>
                                                ) : (
                                                    <Link
                                                        href={`/blog/${blog.slug}`}
                                                        className="inline-flex items-center gap-2 text-[#2ecc71] font-black uppercase tracking-widest text-xs group-hover:translate-x-2 transition-transform"
                                                    >
                                                        Read Article <ArrowRight size={14} />
                                                    </Link>
                                                )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </section>
            </main>

            {/* Footer */}
            <footer className="py-8 border-t border-white/5">
                <div className="container mx-auto px-6 max-w-7xl flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
                    <div className="flex gap-8">
                        <a href="/blog" className="text-slate-500 hover:text-[#2ecc71] transition-all uppercase text-[10px] font-bold tracking-widest">Blog</a>
                        <a href="https://linktr.ee/neazmorshed" target="_blank" className="text-slate-500 hover:text-[#2ecc71] transition-all uppercase text-[10px] font-bold tracking-widest">Linktree</a>
                        <a href="https://www.linkedin.com/in/neazmorshed222/" target="_blank" className="text-slate-500 hover:text-[#2ecc71] transition-all uppercase text-[10px] font-bold tracking-widest">LinkedIn</a>
                        <a href="https://www.fiverr.com/neaz222" target="_blank" className="text-slate-500 hover:text-[#2ecc71] transition-all uppercase text-[10px] font-bold tracking-widest">Fiverr</a>
                        <a href="https://www.facebook.com/neazmorshed001/" target="_blank" className="text-slate-500 hover:text-[#2ecc71] transition-all uppercase text-[10px] font-bold tracking-widest">Facebook</a>
                    </div>
                    <p className="text-slate-400 text-sm font-medium">
                        Designed and Developed by <span className="text-[#2ecc71] font-semibold">Neaz Morshed</span> • <span className="text-slate-500">Copyright © 2026</span>
                    </p>
                </div>
            </footer>
        </div>
    );
}
