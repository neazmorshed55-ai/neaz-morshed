"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {
    ArrowLeft, Calendar, User, Tag, Share2, Facebook, Linkedin, Twitter
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import Navbar from '../../../components/Navbar';

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

export default function BlogDetailPage({ params }: { params: { slug: string } }) {
    const [blog, setBlog] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchBlog() {
            if (!supabase) {
                setLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from('blogs')
                .select('*')
                .eq('slug', params.slug)
                .eq('is_published', true)
                .single();

            if (!error && data) {
                setBlog(data);
            }
            setLoading(false);
        }

        fetchBlog();
    }, [params.slug]);

    if (loading) {
        return (
            <div className="bg-[#0b0f1a] text-white min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-[#2ecc71] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="bg-[#0b0f1a] text-white min-h-screen flex flex-col items-center justify-center text-center p-6">
                <h1 className="text-4xl font-black mb-4">Article Not Found</h1>
                <p className="text-slate-400 mb-8">The article you are looking for does not exist or has been removed.</p>
                <Link href="/blog" className="px-8 py-4 bg-[#2ecc71] text-slate-900 rounded-xl font-bold uppercase tracking-widest hover:bg-[#27ae60] transition-colors">
                    Back to Blog
                </Link>
            </div>
        )
    }

    // Redirect if external link is somehow accessed directly (though listing handles it, standard robust practice)
    if (blog.external_link) {
        if (typeof window !== 'undefined') {
            window.location.href = blog.external_link;
        }
        return null;
    }

    return (
        <div className="bg-[#0b0f1a] text-white min-h-screen selection:bg-[#2ecc71] selection:text-slate-900">
            <Navbar />

            <main className="pb-24">
                {/* Hero Section with Cover */}
                <section className="relative pt-32 pb-12">
                    <div className="container mx-auto px-6 max-w-4xl relative z-10">
                        <Link href="/blog" className="inline-flex items-center gap-2 text-slate-400 hover:text-[#2ecc71] transition-all mb-8 group">
                            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="text-sm font-bold uppercase tracking-wider">Back to Blog</span>
                        </Link>

                        <div className="flex flex-wrap gap-4 mb-6">
                            {blog.tags && blog.tags.map(tag => (
                                <span key={tag} className="px-3 py-1 bg-[#2ecc71]/10 text-[#2ecc71] rounded-full text-[10px] font-black uppercase tracking-widest border border-[#2ecc71]/20">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-tight mb-8">
                            {blog.title}
                        </h1>

                        <div className="flex items-center gap-6 text-sm text-slate-400 border-b border-white/10 pb-12 mb-12">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center overflow-hidden">
                                    <User size={16} />
                                </div>
                                <span className="font-bold">{blog.author || 'Neaz Morshed'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar size={16} className="text-[#2ecc71]" />
                                <span className="font-medium">{new Date(blog.published_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Content Section */}
                <section className="container mx-auto px-6 max-w-4xl">
                    {/* Cover Image */}
                    {blog.cover_image && (
                        <div className="mb-12 rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl relative aspect-video">
                            <Image
                                src={blog.cover_image}
                                alt={blog.cover_image_alt_text || blog.title}
                                fill
                                priority
                                sizes="(max-width: 768px) 100vw, 896px"
                                className="object-cover"
                            />
                        </div>
                    )}

                    {/* Video */}
                    {blog.video_url && (
                        <div className="mb-12 rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl aspect-video">
                            <iframe
                                src={blog.video_url.replace('watch?v=', 'embed/')}
                                title={blog.title}
                                className="w-full h-full"
                                allowFullScreen
                            />
                        </div>
                    )}

                    {/* Article Body */}
                    <article
                        className="prose prose-invert prose-lg max-w-none
                            prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight
                            prose-h1:text-4xl prose-h1:text-white prose-h1:mb-6 prose-h1:mt-12
                            prose-h2:text-3xl prose-h2:text-white prose-h2:mb-5 prose-h2:mt-10 prose-h2:border-l-4 prose-h2:border-[#2ecc71] prose-h2:pl-4
                            prose-h3:text-2xl prose-h3:text-slate-200 prose-h3:mb-4 prose-h3:mt-8
                            prose-h4:text-xl prose-h4:text-slate-300 prose-h4:mb-3 prose-h4:mt-6
                            prose-p:text-slate-300 prose-p:leading-relaxed prose-p:mb-6 prose-p:text-lg
                            prose-strong:text-[#2ecc71] prose-strong:font-bold
                            prose-a:text-[#2ecc71] prose-a:no-underline hover:prose-a:underline
                            prose-ul:my-6 prose-ul:space-y-3
                            prose-ol:my-6 prose-ol:space-y-3 prose-ol:list-decimal prose-ol:pl-6
                            prose-li:text-slate-300 prose-li:pl-2
                            prose-li:marker:text-[#2ecc71] prose-li:marker:font-bold
                            prose-blockquote:border-l-4 prose-blockquote:border-[#2ecc71] prose-blockquote:bg-slate-900/50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-2xl prose-blockquote:italic prose-blockquote:text-slate-400
                            prose-code:bg-slate-800 prose-code:px-2 prose-code:py-1 prose-code:rounded-lg prose-code:text-[#2ecc71] prose-code:text-sm
                            prose-pre:bg-slate-900 prose-pre:border prose-pre:border-white/10 prose-pre:rounded-2xl
                            prose-img:rounded-2xl prose-img:border prose-img:border-white/10
                            prose-hr:border-white/10 prose-hr:my-12"
                    >
                        {/* If content is HTML (from rich text editor later), verify safety. For now, assuming raw text or basic HTML provided by Admin */}
                        <div dangerouslySetInnerHTML={{ __html: blog.content ? blog.content.replace(/\n/g, '<br/>') : '' }} />
                    </article>

                    {/* Share */}
                    <div className="mt-16 pt-8 border-t border-white/10">
                        <h4 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-4">Share this article</h4>
                        <div className="flex gap-4">
                            <button className="p-3 bg-slate-900 rounded-xl hover:bg-[#1da1f2] hover:text-white transition-colors text-slate-400">
                                <Twitter size={20} />
                            </button>
                            <button className="p-3 bg-slate-900 rounded-xl hover:bg-[#0077b5] hover:text-white transition-colors text-slate-400">
                                <Linkedin size={20} />
                            </button>
                            <button className="p-3 bg-slate-900 rounded-xl hover:bg-[#1877f2] hover:text-white transition-colors text-slate-400">
                                <Facebook size={20} />
                            </button>
                        </div>
                    </div>
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
