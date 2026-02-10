"use client";

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {
    ArrowLeft, Calendar, User, Tag, Share2, Facebook, Linkedin, Twitter,
    Clock, Eye, ArrowUp, Copy, Check
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import Navbar from '../../../components/Navbar';
import FooterLinks from '../../../components/FooterLinks';

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
    const [copied, setCopied] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [readingTime, setReadingTime] = useState(0);

    // Reading progress bar
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

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
                // Calculate reading time (average 200 words per minute)
                const wordCount = data.content.split(/\s+/).length;
                const minutes = Math.ceil(wordCount / 200);
                setReadingTime(minutes);
            }
            setLoading(false);
        }

        fetchBlog();
    }, [params.slug]);

    // Scroll to top button visibility
    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 400);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Copy link function
    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Social share functions
    const shareToTwitter = () => {
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent(blog?.title || '');
        window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
    };

    const shareToLinkedIn = () => {
        const url = encodeURIComponent(window.location.href);
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
    };

    const shareToFacebook = () => {
        const url = encodeURIComponent(window.location.href);
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

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
            {/* Reading Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-[#2ecc71] origin-left z-50"
                style={{ scaleX }}
            />

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

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-slate-400 border-b border-white/10 pb-8 mb-12"
                        >
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 bg-gradient-to-br from-[#2ecc71] to-[#27ae60] rounded-full flex items-center justify-center">
                                    <User size={18} className="text-slate-900" />
                                </div>
                                <span className="font-bold text-white">{blog.author || 'Neaz Morshed'}</span>
                            </div>
                            <span className="text-slate-700">•</span>
                            <div className="flex items-center gap-2">
                                <Calendar size={16} className="text-[#2ecc71]" />
                                <span className="font-medium">{new Date(blog.published_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}</span>
                            </div>
                            <span className="text-slate-700">•</span>
                            <div className="flex items-center gap-2">
                                <Clock size={16} className="text-[#2ecc71]" />
                                <span className="font-medium">{readingTime} min read</span>
                            </div>
                        </motion.div>
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
                    <motion.article
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="prose prose-invert prose-lg max-w-none
                            prose-headings:font-black prose-headings:tracking-tight prose-headings:scroll-mt-24
                            prose-h1:text-4xl prose-h1:text-white prose-h1:mb-6 prose-h1:mt-12 prose-h1:uppercase
                            prose-h2:text-3xl prose-h2:text-white prose-h2:mb-5 prose-h2:mt-10 prose-h2:border-l-4 prose-h2:border-[#2ecc71] prose-h2:pl-4 prose-h2:uppercase prose-h2:bg-gradient-to-r prose-h2:from-[#2ecc71]/5 prose-h2:to-transparent prose-h2:py-3 prose-h2:rounded-r-xl
                            prose-h3:text-2xl prose-h3:text-slate-200 prose-h3:mb-4 prose-h3:mt-8 prose-h3:font-bold
                            prose-h4:text-xl prose-h4:text-slate-300 prose-h4:mb-3 prose-h4:mt-6 prose-h4:font-bold
                            prose-p:text-slate-300 prose-p:leading-relaxed prose-p:mb-6 prose-p:text-lg prose-p:font-normal
                            prose-strong:text-[#2ecc71] prose-strong:font-bold
                            prose-em:text-slate-400 prose-em:italic
                            prose-a:text-[#2ecc71] prose-a:no-underline prose-a:font-semibold hover:prose-a:underline prose-a:transition-all
                            prose-ul:my-6 prose-ul:space-y-3 prose-ul:list-none
                            prose-ol:my-6 prose-ol:space-y-3 prose-ol:list-decimal prose-ol:pl-6
                            prose-li:text-slate-300 prose-li:pl-2 prose-li:relative
                            prose-li:before:absolute prose-li:before:left-[-1.5rem] prose-li:before:content-['▹'] prose-li:before:text-[#2ecc71] prose-li:before:font-bold
                            prose-ol>li:before:content-none
                            prose-li:marker:text-[#2ecc71] prose-li:marker:font-bold
                            prose-blockquote:border-l-4 prose-blockquote:border-[#2ecc71] prose-blockquote:bg-gradient-to-r prose-blockquote:from-slate-900/80 prose-blockquote:to-slate-900/20 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-2xl prose-blockquote:italic prose-blockquote:text-slate-400 prose-blockquote:my-8
                            prose-code:bg-slate-800/50 prose-code:px-2 prose-code:py-1 prose-code:rounded-lg prose-code:text-[#2ecc71] prose-code:text-sm prose-code:font-mono prose-code:border prose-code:border-[#2ecc71]/20
                            prose-pre:bg-slate-900 prose-pre:border prose-pre:border-white/10 prose-pre:rounded-2xl prose-pre:p-6 prose-pre:my-8
                            prose-img:rounded-2xl prose-img:border prose-img:border-white/10 prose-img:shadow-2xl prose-img:my-8
                            prose-hr:border-white/10 prose-hr:my-12
                            prose-table:border-collapse prose-table:w-full prose-table:my-8
                            prose-thead:border-b-2 prose-thead:border-[#2ecc71]
                            prose-th:text-left prose-th:p-4 prose-th:font-bold prose-th:text-white prose-th:uppercase prose-th:text-sm prose-th:tracking-wider
                            prose-td:p-4 prose-td:border-b prose-td:border-white/10 prose-td:text-slate-300
                            prose-tr:transition-colors hover:prose-tr:bg-white/5"
                    >
                        <div dangerouslySetInnerHTML={{ __html: blog.content || '' }} />
                    </motion.article>

                    {/* Share */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mt-16 pt-8 border-t border-white/10"
                    >
                        <h4 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
                            <Share2 size={16} className="text-[#2ecc71]" />
                            Share this article
                        </h4>
                        <div className="flex flex-wrap gap-3">
                            <motion.button
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={shareToTwitter}
                                className="flex items-center gap-2 px-5 py-3 bg-slate-900 rounded-xl hover:bg-[#1da1f2] hover:text-white transition-all text-slate-400 font-bold text-sm border border-white/10 hover:border-[#1da1f2]"
                            >
                                <Twitter size={18} />
                                <span>Twitter</span>
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={shareToLinkedIn}
                                className="flex items-center gap-2 px-5 py-3 bg-slate-900 rounded-xl hover:bg-[#0077b5] hover:text-white transition-all text-slate-400 font-bold text-sm border border-white/10 hover:border-[#0077b5]"
                            >
                                <Linkedin size={18} />
                                <span>LinkedIn</span>
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={shareToFacebook}
                                className="flex items-center gap-2 px-5 py-3 bg-slate-900 rounded-xl hover:bg-[#1877f2] hover:text-white transition-all text-slate-400 font-bold text-sm border border-white/10 hover:border-[#1877f2]"
                            >
                                <Facebook size={18} />
                                <span>Facebook</span>
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={copyLink}
                                className="flex items-center gap-2 px-5 py-3 bg-slate-900 rounded-xl hover:bg-[#2ecc71] hover:text-slate-900 transition-all text-slate-400 font-bold text-sm border border-white/10 hover:border-[#2ecc71]"
                            >
                                {copied ? <Check size={18} /> : <Copy size={18} />}
                                <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                            </motion.button>
                        </div>
                    </motion.div>
                </section>
            </main>

            {/* Scroll to Top Button */}
            {showScrollTop && (
                <motion.button
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 p-4 bg-[#2ecc71] text-slate-900 rounded-full shadow-2xl hover:bg-[#27ae60] transition-colors z-40 group"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <ArrowUp size={24} className="group-hover:-translate-y-1 transition-transform" />
                </motion.button>
            )}

            {/* Footer */}
            <footer className="py-6 sm:py-8 border-t border-white/5">
                <div className="container mx-auto px-4 sm:px-6 lg:px-12 max-w-7xl">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6 text-center md:text-left">
                        <FooterLinks />
                        <p className="text-slate-400 text-xs sm:text-sm font-medium">
                            Designed and Developed by{' '}
                            <span className="text-[#2ecc71] font-semibold">Neaz Morshed</span> •{' '}
                            <span className="text-slate-500">Copyright © 2026</span>
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
