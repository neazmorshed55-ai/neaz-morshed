"use client";

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import Link from 'next/link';
import Image from '../../../components/SiteImage';
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
            <div className="bg-page text-ink min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="bg-page text-ink min-h-screen flex flex-col items-center justify-center text-center p-6">
                <h1 className="text-4xl font-black mb-4">Article Not Found</h1>
                <p className="text-body mb-8">The article you are looking for does not exist or has been removed.</p>
                <Link href="/blog" className="px-8 py-4 bg-primary text-white rounded-xl font-bold uppercase tracking-widest hover:bg-primary-dark transition-colors">
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
        <div className="bg-page text-ink min-h-screen selection:bg-primary selection:text-white">
            {/* Reading Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-primary origin-left z-50"
                style={{ scaleX }}
            />

            <Navbar />

            <main className="pb-24">
                {/* Hero Section with Cover */}
                <section className="relative pt-32 pb-12">
                    <div className="container mx-auto px-6 max-w-4xl relative z-10">
                        <Link href="/blog" className="inline-flex items-center gap-2 text-body hover:text-primary transition-all mb-8 group">
                            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="text-sm font-bold uppercase tracking-wider">Back to Blog</span>
                        </Link>

                        <div className="flex flex-wrap gap-4 mb-6">
                            {blog.tags && blog.tags.map(tag => (
                                <span key={tag} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/20">
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
                            className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-body border-b border-line pb-8 mb-12"
                        >
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                                    <User size={18} className="text-white" />
                                </div>
                                <span className="font-bold text-ink">{blog.author || 'Neaz Morshed'}</span>
                            </div>
                            <span className="text-muted">•</span>
                            <div className="flex items-center gap-2">
                                <Calendar size={16} className="text-primary" />
                                <span className="font-medium">{new Date(blog.published_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}</span>
                            </div>
                            <span className="text-muted">•</span>
                            <div className="flex items-center gap-2">
                                <Clock size={16} className="text-primary" />
                                <span className="font-medium">{readingTime} min read</span>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Content Section */}
                <section className="container mx-auto px-6 max-w-4xl">
                    {/* Cover Image */}
                    {blog.cover_image && (
                        <div className="mb-12 rounded-[2rem] overflow-hidden border border-line shadow-2xl relative aspect-video">
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
                        <div className="mb-12 rounded-[2rem] overflow-hidden border border-line shadow-2xl aspect-video">
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
                        className="prose prose-invert max-w-none
                            prose-headings:tracking-normal prose-headings:scroll-mt-24 prose-headings:text-ink
                            prose-h1:text-[32px] md:prose-h1:text-[40px] prose-h1:mb-6 prose-h1:mt-10 prose-h1:leading-[1.3] prose-h1:font-black
                            prose-h2:text-[26px] md:prose-h2:text-[32px] prose-h2:mb-5 prose-h2:mt-10 prose-h2:leading-[1.4] prose-h2:font-bold prose-h2:border-none prose-h2:pl-0 prose-h2:bg-transparent prose-h2:py-0
                            prose-h3:text-[22px] md:prose-h3:text-[26px] prose-h3:text-ink prose-h3:mb-4 prose-h3:mt-8 prose-h3:leading-[1.4] prose-h3:font-semibold
                            prose-h4:text-[19px] md:prose-h4:text-[22px] prose-h4:text-ink prose-h4:mb-3 prose-h4:mt-6 prose-h4:font-semibold
                            prose-p:text-body prose-p:leading-[1.75] prose-p:mb-5 prose-p:text-[17px] md:prose-p:text-[18px] prose-p:font-normal
                            prose-strong:text-primary prose-strong:font-semibold
                            prose-em:text-body prose-em:italic
                            prose-a:text-primary prose-a:no-underline prose-a:font-medium hover:prose-a:underline prose-a:transition-all
                            prose-ul:my-6 prose-ul:space-y-2.5 prose-ul:list-none prose-ul:text-[17px] md:prose-ul:text-[18px]
                            prose-ol:my-6 prose-ol:space-y-2.5 prose-ol:list-decimal prose-ol:pl-6 prose-ol:text-[17px] md:prose-ol:text-[18px]
                            prose-li:text-body prose-li:pl-2 prose-li:relative prose-li:leading-[1.7]
                            prose-li:before:absolute prose-li:before:left-[-1.5rem] prose-li:before:content-['▹'] prose-li:before:text-primary prose-li:before:font-bold prose-li:before:text-lg
                            prose-ol>li:before:content-none
                            prose-li:marker:text-primary prose-li:marker:font-semibold
                            prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-gradient-to-r prose-blockquote:from-surface-2 prose-blockquote:to-surface-2/40 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-2xl prose-blockquote:italic prose-blockquote:text-body prose-blockquote:my-8 prose-blockquote:text-[17px]
                            prose-code:bg-surface-2 prose-code:px-2 prose-code:py-1 prose-code:rounded-lg prose-code:text-primary prose-code:text-[15px] prose-code:font-mono prose-code:border prose-code:border-primary/20
                            prose-pre:bg-surface prose-pre:border prose-pre:border-line prose-pre:rounded-2xl prose-pre:p-6 prose-pre:my-8 prose-pre:text-[15px]
                            prose-img:rounded-2xl prose-img:border prose-img:border-line prose-img:shadow-2xl prose-img:my-8
                            prose-hr:border-line prose-hr:my-12
                            prose-table:border-collapse prose-table:w-full prose-table:my-8 prose-table:text-[16px]
                            prose-thead:border-b-2 prose-thead:border-primary
                            prose-th:text-left prose-th:p-4 prose-th:font-semibold prose-th:text-ink prose-th:uppercase prose-th:text-sm prose-th:tracking-wider
                            prose-td:p-4 prose-td:border-b prose-td:border-line prose-td:text-body
                            prose-tr:transition-colors hover:prose-tr:bg-surface-2/70"
                    >
                        <div dangerouslySetInnerHTML={{ __html: blog.content || '' }} />
                    </motion.article>

                    {/* Share */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mt-16 pt-8 border-t border-line"
                    >
                        <h4 className="text-sm font-black uppercase tracking-widest text-muted mb-6 flex items-center gap-2">
                            <Share2 size={16} className="text-primary" />
                            Share this article
                        </h4>
                        <div className="flex flex-wrap gap-3">
                            <motion.button
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={shareToTwitter}
                                className="flex items-center gap-2 px-5 py-3 bg-surface rounded-xl hover:bg-[#1da1f2] hover:text-white transition-all text-body font-bold text-sm border border-line hover:border-[#1da1f2]"
                            >
                                <Twitter size={18} />
                                <span>Twitter</span>
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={shareToLinkedIn}
                                className="flex items-center gap-2 px-5 py-3 bg-surface rounded-xl hover:bg-[#0077b5] hover:text-white transition-all text-body font-bold text-sm border border-line hover:border-[#0077b5]"
                            >
                                <Linkedin size={18} />
                                <span>LinkedIn</span>
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={shareToFacebook}
                                className="flex items-center gap-2 px-5 py-3 bg-surface rounded-xl hover:bg-[#1877f2] hover:text-white transition-all text-body font-bold text-sm border border-line hover:border-[#1877f2]"
                            >
                                <Facebook size={18} />
                                <span>Facebook</span>
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={copyLink}
                                className="flex items-center gap-2 px-5 py-3 bg-surface rounded-xl hover:bg-primary hover:text-white transition-all text-body font-bold text-sm border border-line hover:border-primary"
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
                    className="fixed bottom-8 right-8 p-4 bg-primary text-white rounded-full shadow-2xl hover:bg-primary-dark transition-colors z-40 group"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <ArrowUp size={24} className="group-hover:-translate-y-1 transition-transform" />
                </motion.button>
            )}

            {/* Footer */}
            <footer className="py-6 sm:py-8 border-t border-line">
                <div className="container mx-auto px-4 sm:px-6 lg:px-12 max-w-7xl">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6 text-center md:text-left">
                        <FooterLinks />
                        <p className="text-body text-xs sm:text-sm font-medium">
                            Designed and Developed by{' '}
                            <span className="text-primary font-semibold">Neaz Morshed</span> •{' '}
                            <span className="text-muted">Copyright © 2026</span>
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
