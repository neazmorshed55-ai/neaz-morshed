"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import {
  ArrowLeft, ExternalLink, X,
  Briefcase, Loader2, Calendar, User, Clock, CheckCircle2,
  Play
} from 'lucide-react';
import { supabase } from '../../../../lib/supabase';
import Navbar from '../../../../components/Navbar';

// ============ PLATFORM DETECTION ============

const isVideoFile = (url: string) => {
  return url.includes('supabase.co') || url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.mov');
};

const isYouTubeUrl = (url: string) => {
  return url.includes('youtube.com') || url.includes('youtu.be');
};

const isTikTokUrl = (url: string) => {
  return url.includes('tiktok.com');
};

const isInstagramUrl = (url: string) => {
  return url.includes('instagram.com');
};

const isFacebookUrl = (url: string) => {
  return url.includes('facebook.com') || url.includes('fb.watch') || url.includes('fb.com');
};

const isEmbeddableVideo = (url: string) => {
  return isYouTubeUrl(url) || isTikTokUrl(url) || isInstagramUrl(url) || isFacebookUrl(url) || url.includes('vimeo.com');
};

const isVerticalContent = (url: string) => {
  return isTikTokUrl(url) ||
    (isInstagramUrl(url) && (url.includes('/reel/') || url.includes('/reels/'))) ||
    (isFacebookUrl(url) && url.includes('/reel/')) ||
    url.includes('youtube.com/shorts');
};

// ============ EMBED URL CONVERTERS ============

const getYouTubeEmbedUrl = (url: string) => {
  if (url.includes('youtube.com/embed/')) return url;
  let videoId = '';
  const watchMatch = url.match(/youtube\.com\/watch\?v=([^&]+)/);
  if (watchMatch) videoId = watchMatch[1];
  const shortMatch = url.match(/youtu\.be\/([^?]+)/);
  if (shortMatch) videoId = shortMatch[1];
  const shortsMatch = url.match(/youtube\.com\/shorts\/([^?]+)/);
  if (shortsMatch) videoId = shortsMatch[1];
  if (videoId) return `https://www.youtube.com/embed/${videoId}`;
  return url;
};

const getTikTokEmbedUrl = (url: string) => {
  const videoMatch = url.match(/\/video\/(\d+)/);
  if (videoMatch) return `https://www.tiktok.com/embed/v2/${videoMatch[1]}`;
  return url;
};

const getInstagramEmbedUrl = (url: string) => {
  const postMatch = url.match(/instagram\.com\/(p|reel|reels|tv)\/([^/?]+)/);
  if (postMatch) return `https://www.instagram.com/${postMatch[1]}/${postMatch[2]}/embed/captioned/`;
  return url + (url.includes('?') ? '&' : '?') + 'embed=true';
};

const getFacebookEmbedUrl = (url: string) => {
  const encodedUrl = encodeURIComponent(url);
  if (url.includes('/videos/') || url.includes('/watch') || url.includes('fb.watch') || url.includes('/reel/')) {
    return `https://www.facebook.com/plugins/video.php?href=${encodedUrl}&show_text=false&width=560`;
  }
  return `https://www.facebook.com/plugins/post.php?href=${encodedUrl}&show_text=true&width=500`;
};

const getEmbedUrl = (url: string) => {
  if (isYouTubeUrl(url)) return getYouTubeEmbedUrl(url);
  if (isTikTokUrl(url)) return getTikTokEmbedUrl(url);
  if (isInstagramUrl(url)) return getInstagramEmbedUrl(url);
  if (isFacebookUrl(url)) return getFacebookEmbedUrl(url);
  return url;
};

interface PortfolioItem {
  id: string;
  service_id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail_url: string | null;
  thumbnail_alt_text?: string | null;
  image_url: string | null;
  image_alt_text?: string | null;
  video_url: string | null;
  project_url: string | null;
  client_name: string | null;
  completion_date: string | null;
  duration: string | null;
  tools_used: string[];
  tags: string[];
  is_featured: boolean;
}

interface GalleryItem {
  id: string;
  portfolio_item_id: string;
  url: string;
  alt_text?: string | null;
  type: 'image' | 'video' | 'link';
  order_index: number;
}

interface Service {
  id: string;
  title: string;
  slug: string;
}

export default function PortfolioDetailPage() {
  const params = useParams();
  const serviceSlug = params.slug as string;
  const portfolioSlug = params.portfolio as string;

  const [portfolio, setPortfolio] = useState<PortfolioItem | null>(null);
  const [service, setService] = useState<Service | null>(null);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGalleryItem, setSelectedGalleryItem] = useState<GalleryItem | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!supabase || !serviceSlug || !portfolioSlug) {
        setLoading(false);
        return;
      }

      try {
        // Fetch service
        const { data: serviceData } = await supabase
          .from('services')
          .select('*')
          .eq('slug', serviceSlug)
          .single();

        if (serviceData) {
          setService(serviceData);

          // Fetch portfolio item by slug
          const { data: portfolioData } = await supabase
            .from('portfolio_items')
            .select('*')
            .eq('service_id', serviceData.id)
            .eq('slug', portfolioSlug)
            .single();

          if (portfolioData) {
            setPortfolio(portfolioData);

            // Fetch gallery items
            const { data: galleryData } = await supabase
              .from('portfolio_gallery')
              .select('*')
              .eq('portfolio_item_id', portfolioData.id)
              .order('order_index', { ascending: true });

            if (galleryData) {
              setGalleryItems(galleryData);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }

      setLoading(false);
    }

    fetchData();
  }, [serviceSlug, portfolioSlug]);

  if (loading) {
    return (
      <div className="bg-[#0b0f1a] text-white min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#2ecc71] animate-spin" />
      </div>
    );
  }

  if (!portfolio || !service) {
    return (
      <div className="bg-[#0b0f1a] text-white min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-4xl font-black mb-4">Portfolio Item Not Found</h1>
        <Link href={`/services/${serviceSlug}`} className="text-[#2ecc71] hover:underline">
          Back to {serviceSlug?.replace(/-/g, ' ')}
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#0b0f1a] text-white min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-12 relative overflow-hidden">
        <div className="absolute top-[10%] right-[5%] w-[600px] h-[600px] bg-[#2ecc71]/5 rounded-full blur-[180px] pointer-events-none"></div>

        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-3 mb-8 text-sm flex-wrap">
            <Link href="/services" className="text-slate-400 hover:text-[#2ecc71] transition-all">
              Services
            </Link>
            <span className="text-slate-600">/</span>
            <Link href={`/services/${serviceSlug}`} className="text-slate-400 hover:text-[#2ecc71] transition-all">
              {service.title}
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-[#2ecc71] font-bold">{portfolio.title}</span>
          </div>

          {/* Back Button */}
          <Link
            href={`/services/${serviceSlug}`}
            className="inline-flex items-center gap-2 text-slate-400 hover:text-[#2ecc71] transition-all group mb-8"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold">Back to {service.title}</span>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Featured Badge */}
            {portfolio.is_featured && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#2ecc71]/20 text-[#2ecc71] text-[10px] font-black rounded-full uppercase mb-4">
                <CheckCircle2 size={12} />
                Featured Project
              </span>
            )}

            <h1 className="text-4xl lg:text-6xl font-black uppercase tracking-tighter leading-none mb-6">
              {portfolio.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap gap-6 mb-8">
              {portfolio.client_name && (
                <div className="flex items-center gap-2 text-slate-400">
                  <User size={18} className="text-[#2ecc71]" />
                  <span className="font-semibold">{portfolio.client_name}</span>
                </div>
              )}
              {portfolio.completion_date && (
                <div className="flex items-center gap-2 text-slate-400">
                  <Calendar size={18} className="text-[#2ecc71]" />
                  <span className="font-semibold">{portfolio.completion_date}</span>
                </div>
              )}
              {portfolio.duration && (
                <div className="flex items-center gap-2 text-slate-400">
                  <Clock size={18} className="text-[#2ecc71]" />
                  <span className="font-semibold">{portfolio.duration}</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-20">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Left Column - Media & Description */}
            <div className="lg:col-span-2 space-y-8">
              {/* Main Image/Video */}
              {portfolio.video_url ? (
                <div className={`relative overflow-hidden rounded-3xl bg-black border border-white/10 ${isVerticalContent(portfolio.video_url) ? 'aspect-[9/16] max-w-[400px]' : 'aspect-video'}`}>
                  {isVideoFile(portfolio.video_url) ? (
                    <video
                      src={portfolio.video_url}
                      className="w-full h-full object-cover"
                      controls
                      playsInline
                    />
                  ) : (
                    <iframe
                      src={getEmbedUrl(portfolio.video_url)}
                      className="w-full h-full"
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      loading="lazy"
                    />
                  )}
                </div>
              ) : (portfolio.image_url || portfolio.thumbnail_url) && (
                <div className="aspect-video relative overflow-hidden rounded-3xl border border-white/10">
                  <Image
                    src={portfolio.image_url || portfolio.thumbnail_url || ''}
                    alt={portfolio.image_alt_text || portfolio.thumbnail_alt_text || portfolio.title}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 800px"
                    className="object-cover"
                  />
                </div>
              )}

              {/* Description */}
              {portfolio.description && (
                <div className="prose prose-invert prose-lg max-w-none">
                  <p className="text-slate-300 leading-relaxed text-lg">
                    {portfolio.description}
                  </p>
                </div>
              )}

              {/* Gallery */}
              {galleryItems.length > 0 && (
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tight mb-6">Project Gallery</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {galleryItems.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        onClick={() => setSelectedGalleryItem(item)}
                        className="cursor-pointer group"
                      >
                        <div className={`relative overflow-hidden rounded-2xl border border-white/10 bg-black/50 ${isVerticalContent(item.url) ? 'aspect-[9/16]' : 'aspect-video'}`}>
                          {item.type === 'image' && !isEmbeddableVideo(item.url) ? (
                            <Image
                              src={item.url}
                              alt={item.alt_text || `Gallery image`}
                              fill
                              sizes="(max-width: 768px) 50vw, 33vw"
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-slate-900">
                              <Play size={32} className="text-[#2ecc71]" />
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-8">
              {/* Tools Used */}
              {portfolio.tools_used && portfolio.tools_used.length > 0 && (
                <div className="p-8 bg-slate-900/60 border border-white/10 rounded-3xl">
                  <h3 className="text-xl font-black uppercase tracking-tight mb-6">Tools & Software</h3>
                  <div className="flex flex-wrap gap-2">
                    {portfolio.tools_used.map((tool, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-[#2ecc71]/10 border border-[#2ecc71]/20 rounded-full text-sm font-bold text-[#2ecc71]"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {portfolio.tags && portfolio.tags.length > 0 && (
                <div className="p-8 bg-slate-900/60 border border-white/10 rounded-3xl">
                  <h3 className="text-xl font-black uppercase tracking-tight mb-6">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {portfolio.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm font-bold text-slate-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Project Link */}
              {portfolio.project_url && (
                <a
                  href={portfolio.project_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full px-8 py-5 bg-[#2ecc71] text-slate-900 font-black rounded-2xl hover:scale-105 transition-transform uppercase tracking-widest text-sm"
                >
                  View Live Project <ExternalLink size={18} />
                </a>
              )}

              {/* CTA */}
              <div className="p-8 bg-[#2ecc71]/10 border border-[#2ecc71]/30 rounded-3xl">
                <h3 className="text-xl font-black uppercase tracking-tight mb-4">Want Similar Work?</h3>
                <p className="text-slate-400 mb-6 text-sm">
                  I can create custom solutions tailored to your specific needs. Let&apos;s discuss your project!
                </p>
                <Link
                  href="/contact"
                  className="block w-full text-center px-6 py-4 bg-[#2ecc71] text-slate-900 font-black rounded-2xl hover:scale-105 transition-transform uppercase tracking-widest text-sm"
                >
                  Get in Touch
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Modal */}
      {selectedGalleryItem && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
          onClick={() => setSelectedGalleryItem(null)}
        >
          <button
            onClick={() => setSelectedGalleryItem(null)}
            className="absolute top-6 right-6 z-10 p-3 bg-white/10 rounded-full hover:bg-[#2ecc71] hover:text-slate-900 transition-all"
          >
            <X size={24} />
          </button>

          <div className={`max-w-4xl w-full ${isVerticalContent(selectedGalleryItem.url) ? 'max-w-[400px]' : ''}`} onClick={(e) => e.stopPropagation()}>
            {selectedGalleryItem.type === 'image' && !isEmbeddableVideo(selectedGalleryItem.url) ? (
              <div className="relative aspect-video rounded-2xl overflow-hidden">
                <Image
                  src={selectedGalleryItem.url}
                  alt={selectedGalleryItem.alt_text || 'Gallery image'}
                  fill
                  className="object-contain"
                />
              </div>
            ) : (
              <div className={`relative rounded-2xl overflow-hidden bg-black ${isVerticalContent(selectedGalleryItem.url) ? 'aspect-[9/16]' : 'aspect-video'}`}>
                <iframe
                  src={getEmbedUrl(selectedGalleryItem.url)}
                  className="w-full h-full"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                />
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Footer */}
      <footer className="py-8 border-t border-white/5">
        <div className="container mx-auto px-6 max-w-7xl flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div className="flex gap-8">
            <a href="/blog" className="text-slate-500 hover:text-[#2ecc71] transition-all uppercase text-[10px] font-bold tracking-widest">Blog</a>
            <a href="https://www.linkedin.com/in/neazmorshed222/" target="_blank" className="text-slate-500 hover:text-[#2ecc71] transition-all uppercase text-[10px] font-bold tracking-widest">LinkedIn</a>
            <a href="https://www.fiverr.com/neaz222" target="_blank" className="text-slate-500 hover:text-[#2ecc71] transition-all uppercase text-[10px] font-bold tracking-widest">Fiverr</a>
          </div>
          <p className="text-slate-400 text-sm font-medium">
            Designed and Developed by <span className="text-[#2ecc71] font-semibold">Neaz Morshed</span> • <span className="text-slate-500">Copyright © 2026</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
