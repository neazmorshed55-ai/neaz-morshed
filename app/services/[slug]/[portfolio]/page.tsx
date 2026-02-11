"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import {
  ArrowLeft, ArrowRight, ExternalLink, X,
  Briefcase, Loader2, Calendar, User, Clock, CheckCircle2,
  Play
} from 'lucide-react';
import { supabase } from '../../../../lib/supabase';
import Navbar from '../../../../components/Navbar';
import SocialEmbed from '../../../../components/SocialEmbed';
import FooterLinks from '../../../../components/FooterLinks';

// ============ PLATFORM DETECTION ============

const isImageFile = (url: string) => {
  const lowerUrl = url.toLowerCase();
  return lowerUrl.endsWith('.jpg') ||
    lowerUrl.endsWith('.jpeg') ||
    lowerUrl.endsWith('.png') ||
    lowerUrl.endsWith('.gif') ||
    lowerUrl.endsWith('.webp') ||
    lowerUrl.endsWith('.svg') ||
    lowerUrl.includes('format=jpg') ||
    lowerUrl.includes('format=png') ||
    lowerUrl.includes('format=webp');
};

const isVideoFile = (url: string) => {
  // If it's a known image file, it's not a video
  if (isImageFile(url)) return false;

  // Checking for supabase.co is risky if we store images there too, 
  // so we should rely more on extensions or explicit video indicators if possible.
  // But preserving existing logic with the safety check above:
  return url.includes('supabase.co') || url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.mov');
};

const isYouTubeUrl = (url: string) => {
  return url.includes('youtube.com') || url.includes('youtu.be');
};

// Check if YouTube URL is a channel (not embeddable)
const isYouTubeChannel = (url: string) => {
  return url.includes('/@') || url.includes('/channel/') || url.includes('/c/') || url.includes('/user/');
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
  // If it's an image file, it's not an embeddable video even if it comes from FB/Insta
  if (isImageFile(url)) return false;

  // YouTube channel URLs cannot be embedded - only video URLs can
  if (isYouTubeUrl(url) && isYouTubeChannel(url)) {
    return false;
  }
  return isYouTubeUrl(url) || isTikTokUrl(url) || isInstagramUrl(url) || isFacebookUrl(url) || url.includes('vimeo.com');
};

const isVerticalContent = (url: string) => {
  return isTikTokUrl(url) ||
    (isInstagramUrl(url) && (url.includes('/reel/') || url.includes('/reels/'))) ||
    (isFacebookUrl(url) && url.includes('/reel/')) ||
    url.includes('youtube.com/shorts');
};

const isGoogleDriveUrl = (url: string) => {
  return url.includes('drive.google.com') || url.includes('docs.google.com');
};

// Get file type label from URL
const getFileTypeLabel = (url: string): string => {
  const lowerUrl = url.toLowerCase();

  // PDF files
  if (lowerUrl.endsWith('.pdf') || (lowerUrl.includes('/export=download') && lowerUrl.includes('drive.google.com'))) {
    return 'PDF';
  }

  // Excel files
  if (lowerUrl.endsWith('.xlsx') || lowerUrl.endsWith('.xls') || lowerUrl.includes('/spreadsheets/')) {
    return 'Excel Sheet';
  }

  // Word documents
  if (lowerUrl.endsWith('.docx') || lowerUrl.endsWith('.doc') || (lowerUrl.includes('/document/') && lowerUrl.includes('docs.google.com'))) {
    return 'Word Document';
  }

  // PowerPoint
  if (lowerUrl.endsWith('.pptx') || lowerUrl.endsWith('.ppt') || lowerUrl.includes('/presentation/')) {
    return 'PowerPoint';
  }

  // Google Docs (if not detected above)
  if (lowerUrl.includes('docs.google.com')) {
    return 'Google Doc';
  }

  // Generic Google Drive
  if (lowerUrl.includes('drive.google.com')) {
    return 'Google Drive File';
  }

  // Default for other links
  return 'Document';
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

const getGoogleDriveEmbedUrl = (url: string) => {
  // Extract file ID from various Google Drive URL formats
  let fileId = '';

  // Format 1: /file/d/FILE_ID/view or /file/d/FILE_ID/
  const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) fileId = fileMatch[1];

  // Format 2: /document/d/FILE_ID/ (Google Docs)
  const docMatch = url.match(/\/document\/d\/([a-zA-Z0-9_-]+)/);
  if (docMatch) fileId = docMatch[1];

  // Format 3: /spreadsheets/d/FILE_ID/ (Google Sheets)
  const sheetMatch = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
  if (sheetMatch) fileId = sheetMatch[1];

  // Format 4: /presentation/d/FILE_ID/ (Google Slides)
  const slideMatch = url.match(/\/presentation\/d\/([a-zA-Z0-9_-]+)/);
  if (slideMatch) fileId = slideMatch[1];

  // Format 5: id= parameter
  if (!fileId) {
    const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (idMatch) fileId = idMatch[1];
  }

  if (fileId) {
    // For Google Docs, Sheets, Slides - use their specific preview URLs
    if (url.includes('/document/')) {
      return `https://docs.google.com/document/d/${fileId}/preview`;
    } else if (url.includes('/spreadsheets/')) {
      return `https://docs.google.com/spreadsheets/d/${fileId}/preview`;
    } else if (url.includes('/presentation/')) {
      return `https://docs.google.com/presentation/d/${fileId}/preview`;
    } else {
      // For generic Drive files (PDFs, etc.) - use file preview
      return `https://drive.google.com/file/d/${fileId}/preview`;
    }
  }

  // If already a preview URL, return as is
  if (url.includes('/preview')) {
    return url;
  }

  return url;
};

const isCanvaUrl = (url: string) => {
  return url.includes('canva.com');
};

const getCanvaEmbedUrl = (url: string) => {
  // Extract design ID from Canva URL
  // Format: https://www.canva.com/design/DESIGN_ID/view
  const designMatch = url.match(/canva\.com\/design\/([a-zA-Z0-9_-]+)/);

  if (designMatch) {
    const designId = designMatch[1];
    // Canva embed URL format with autoplay and loop for videos
    return `https://www.canva.com/design/${designId}/view?embed`;
  }

  // If already an embed URL, return as is
  if (url.includes('?embed') || url.includes('&embed')) {
    return url;
  }

  // Try to add embed parameter to existing URL
  if (url.includes('?')) {
    return `${url}&embed`;
  } else {
    return `${url}?embed`;
  }
};

const getEmbedUrl = (url: string) => {
  if (isYouTubeUrl(url)) return getYouTubeEmbedUrl(url);
  if (isTikTokUrl(url)) return getTikTokEmbedUrl(url);
  if (isInstagramUrl(url)) return getInstagramEmbedUrl(url);
  if (isFacebookUrl(url)) return getFacebookEmbedUrl(url);
  if (isGoogleDriveUrl(url)) return getGoogleDriveEmbedUrl(url);
  if (isCanvaUrl(url)) return getCanvaEmbedUrl(url);
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
  const [selectedGalleryIndex, setSelectedGalleryIndex] = useState<number | null>(null);

  // Navigation handlers for gallery
  const handleNextGallery = () => {
    if (selectedGalleryIndex !== null && galleryItems.length > 0) {
      setSelectedGalleryIndex((selectedGalleryIndex + 1) % galleryItems.length);
    }
  };

  const handlePrevGallery = () => {
    if (selectedGalleryIndex !== null && galleryItems.length > 0) {
      setSelectedGalleryIndex((selectedGalleryIndex - 1 + galleryItems.length) % galleryItems.length);
    }
  };

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

            <h1 className="text-4xl lg:text-6xl font-black capitalize tracking-tighter leading-none mb-6">
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
                  ) : isEmbeddableVideo(portfolio.video_url) ? (
                    <iframe
                      src={getEmbedUrl(portfolio.video_url)}
                      className="w-full h-full"
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      loading="lazy"
                    />
                  ) : (
                    <a
                      href={portfolio.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full h-full flex items-center justify-center bg-slate-900 hover:bg-slate-800 transition-colors"
                    >
                      <div className="text-[#2ecc71] flex flex-col items-center gap-3 p-6">
                        <ExternalLink size={48} />
                        <span className="text-white font-bold text-lg">Visit External Link</span>
                        <span className="text-slate-400 text-sm max-w-[80%] truncate">{portfolio.video_url}</span>
                      </div>
                    </a>
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
                    {galleryItems.map((item, index) => {
                      // Check if URL is a direct image (including CDN images from Facebook, etc.)
                      const isImageUrl = /\.(jpg|jpeg|png|gif|webp|svg)(\?|$)/i.test(item.url) ||
                        item.url.includes('fbcdn.net') ||
                        item.url.includes('cdninstagram.com');

                      // Check URL type
                      const isYouTube = item.url.includes('youtube.com') || item.url.includes('youtu.be');
                      const isTikTokPost = item.url.includes('tiktok.com') && item.url.includes('/video/');
                      const isFacebookPost = item.url.includes('facebook.com') && !item.url.includes('fbcdn.net');
                      const isInstagramPost = item.url.includes('instagram.com') && !item.url.includes('cdninstagram.com');
                      const isGoogleDrive = item.url.includes('drive.google.com') || item.url.includes('docs.google.com');
                      const isVimeo = item.url.includes('vimeo.com');
                      const isCanva = item.url.includes('canva.com');

                      // Regular image: direct image URL OR image file extension
                      const isRegularImage = isImageUrl && !isTikTokPost && !isFacebookPost && !isInstagramPost;

                      const getYouTubeThumbnail = (url: string) => {
                        const patterns = [
                          /youtube\.com\/watch\?v=([^&]+)/,
                          /youtu\.be\/([^?]+)/,
                          /youtube\.com\/shorts\/([^?]+)/,
                        ];
                        for (const pattern of patterns) {
                          const match = url.match(pattern);
                          if (match) return `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg`;
                        }
                        return null;
                      };

                      return (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          onClick={() => setSelectedGalleryIndex(index)}
                          className="cursor-pointer group"
                        >
                          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900 hover:border-[#2ecc71]/50 transition-all aspect-square">
                            {isRegularImage ? (
                              <Image
                                src={item.url}
                                alt={item.alt_text || `Gallery image`}
                                fill
                                sizes="(max-width: 768px) 50vw, 33vw"
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            ) : isYouTube ? (
                              <>
                                <Image
                                  src={getYouTubeThumbnail(item.url) || 'https://via.placeholder.com/640x360?text=YouTube+Video'}
                                  alt={item.alt_text || 'YouTube video'}
                                  fill
                                  sizes="(max-width: 768px) 50vw, 33vw"
                                  className="object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/60 transition-colors">
                                  <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center transform group-hover:scale-110 transition-transform">
                                    <Play size={24} className="text-white ml-1" />
                                  </div>
                                </div>
                              </>
                            ) : isTikTokPost ? (
                              <div className="w-full h-full relative">
                                <SocialEmbed url={item.url} className="w-full h-full pointer-events-none" />
                                <div className="absolute inset-0 z-10 bg-transparent" />
                              </div>
                            ) : isFacebookPost ? (
                              <div className="w-full h-full relative">
                                <SocialEmbed url={item.url} className="w-full h-full pointer-events-none" />
                                <div className="absolute inset-0 z-10 bg-transparent" />
                              </div>
                            ) : isInstagramPost ? (
                              <div className="w-full h-full bg-gradient-to-br from-[#833ab4] via-[#fd1d1d] to-[#fcb045] flex items-center justify-center">
                                <div className="text-center text-white">
                                  <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                  </svg>
                                  <span className="font-bold text-xs">Instagram</span>
                                </div>
                              </div>
                            ) : isGoogleDrive ? (
                              <div className={`w-full h-full flex items-center justify-center ${
                                item.url.includes('/document/') ? 'bg-gradient-to-br from-blue-600 to-blue-800' :
                                item.url.includes('/spreadsheets/') ? 'bg-gradient-to-br from-green-600 to-green-800' :
                                item.url.includes('/presentation/') ? 'bg-gradient-to-br from-yellow-600 to-yellow-800' :
                                'bg-gradient-to-br from-slate-700 to-slate-900'
                              }`}>
                                <div className="text-center text-white p-4">
                                  {item.url.includes('/document/') ? (
                                    <svg className="w-14 h-14 mx-auto mb-3" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M10,19H8V18H10V19M14,19H10V17H14V19M14,16H10V15H14V16M10,14H8V12H10V14M14,14H10V12H14V14M10,11H8V10H10V11M14,11H10V10H14V11Z" />
                                    </svg>
                                  ) : item.url.includes('/spreadsheets/') ? (
                                    <svg className="w-14 h-14 mx-auto mb-3" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M19,3H5C3.9,3 3,3.9 3,5V19C3,20.1 3.9,21 5,21H19C20.1,21 21,20.1 21,19V5C21,3.9 20.1,3 19,3M19,19H5V5H19V19M12,17H17V15H12V17M7,17H10V15H7V17M7,13H10V10H7V13M12,13H17V10H12V13M7,8H17V6H7V8Z" />
                                    </svg>
                                  ) : item.url.includes('/presentation/') ? (
                                    <svg className="w-14 h-14 mx-auto mb-3" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M19,3H5C3.9,3 3,3.9 3,5V19C3,20.1 3.9,21 5,21H19C20.1,21 21,20.1 21,19V5C21,3.9 20.1,3 19,3M19,19H5V7H19V19M17,12H13V16H11V12H7L12,7L17,12Z" />
                                    </svg>
                                  ) : (
                                    <svg className="w-14 h-14 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                  )}
                                  <span className="font-bold text-sm block">{getFileTypeLabel(item.url)}</span>
                                  <span className="text-xs opacity-75 mt-1 block">Click to view</span>
                                </div>
                              </div>
                            ) : isCanva ? (
                              <div className="w-full h-full bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 flex items-center justify-center relative overflow-hidden">
                                {/* Animated background pattern */}
                                <div className="absolute inset-0 opacity-20">
                                  <div className="absolute top-0 left-0 w-full h-full">
                                    <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/30 rounded-full blur-3xl animate-pulse"></div>
                                    <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-cyan-300/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
                                  </div>
                                </div>

                                <div className="text-center text-white relative z-10 p-4 group-hover:blur-[2px] transition-all duration-300">
                                  {/* Canva Logo Style Icon */}
                                  <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center shadow-2xl border border-white/20">
                                    <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
                                      <path d="M7.5 7.5c-1.5 0-3 1.2-3 3.3 0 1.6 1 2.9 2.4 3.2.1 0 .3-.1.3-.2V12c0-.1 0-.2-.1-.2-.7-.2-1.2-.8-1.2-1.5 0-1 .7-1.8 1.6-1.8s1.6.8 1.6 1.8c0 .7-.5 1.3-1.2 1.5-.1 0-.1.1-.1.2v1.8c0 .1.2.2.3.2 1.4-.3 2.4-1.6 2.4-3.2 0-2.1-1.5-3.3-3-3.3zm9 0c-1.5 0-3 1.2-3 3.3 0 1.6 1 2.9 2.4 3.2.1 0 .3-.1.3-.2V12c0-.1 0-.2-.1-.2-.7-.2-1.2-.8-1.2-1.5 0-1 .7-1.8 1.6-1.8s1.6.8 1.6 1.8c0 .7-.5 1.3-1.2 1.5-.1 0-.1.1-.1.2v1.8c0 .1.2.2.3.2 1.4-.3 2.4-1.6 2.4-3.2 0-2.1-1.5-3.3-3-3.3z"/>
                                    </svg>
                                  </div>
                                  <span className="font-bold text-base block drop-shadow-lg">Canva Design</span>
                                  <span className="text-xs opacity-90 mt-1.5 block">Click to open</span>
                                </div>

                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
                                  <div className="w-20 h-20 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center transform group-hover:scale-110 transition-transform shadow-2xl">
                                    <ExternalLink size={32} className="text-white" />
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                                <div className="text-center text-[#2ecc71]">
                                  <ExternalLink className="w-12 h-12 mx-auto mb-2" />
                                  <span className="font-bold text-xs text-white">Link</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
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
                  href="mailto:neazmd.tamim@gmail.com"
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
      {selectedGalleryIndex !== null && galleryItems[selectedGalleryIndex] && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl"
          onClick={() => setSelectedGalleryIndex(null)}
        >
          {/* Close Button */}
          <button
            onClick={() => setSelectedGalleryIndex(null)}
            className="absolute top-6 right-6 z-10 p-3 bg-white/10 rounded-full hover:bg-[#2ecc71] hover:text-slate-900 transition-all"
          >
            <X size={24} />
          </button>

          {/* Previous Button */}
          {galleryItems.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrevGallery();
              }}
              className="absolute left-6 z-10 p-4 bg-white/10 rounded-full hover:bg-[#2ecc71] hover:text-slate-900 transition-all"
            >
              <ArrowLeft size={28} />
            </button>
          )}

          {/* Next Button */}
          {galleryItems.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNextGallery();
              }}
              className="absolute right-6 z-10 p-4 bg-white/10 rounded-full hover:bg-[#2ecc71] hover:text-slate-900 transition-all"
            >
              <ArrowRight size={28} />
            </button>
          )}

          {/* Gallery Content */}
          <div className="max-w-6xl w-full px-4" onClick={(e) => e.stopPropagation()}>
            {(() => {
              const item = galleryItems[selectedGalleryIndex];
              const isRegularImage = item.type === 'image' &&
                !item.url.includes('youtube.com') &&
                !item.url.includes('youtu.be') &&
                !item.url.includes('drive.google.com') &&
                !item.url.includes('facebook.com') &&
                !item.url.includes('instagram.com') &&
                !item.url.includes('tiktok.com') &&
                !item.url.includes('vimeo.com') &&
                !item.url.includes('canva.com');

              const isGoogleDriveDocument = isGoogleDriveUrl(item.url);
              const isCanvaDesign = isCanvaUrl(item.url);

              if (isRegularImage) {
                return (
                  <div className="relative w-full max-w-6xl mx-auto" style={{ height: 'calc(100vh - 140px)' }}>
                    <Image
                      src={item.url}
                      alt={item.alt_text || 'Gallery image'}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
                      priority
                    />
                  </div>
                );
              }

              if (isGoogleDriveDocument) {
                const embedUrl = getGoogleDriveEmbedUrl(item.url);
                return (
                  <div className="w-full">
                    <div className="relative w-full h-[55vh] bg-white rounded-2xl overflow-hidden shadow-2xl">
                      <iframe
                        src={embedUrl}
                        className="w-full h-full border-0"
                        allow="autoplay"
                        loading="lazy"
                      />
                    </div>
                    <div className="mt-4 flex justify-center gap-4">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#2ecc71] text-slate-900 font-bold rounded-xl hover:scale-105 transition-transform"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink size={18} />
                        Open in Google Drive
                      </a>
                    </div>
                  </div>
                );
              }

              if (isCanvaDesign) {
                return (
                  <div className="w-full">
                    <div className="relative w-full h-[55vh] bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center">
                      {/* Canva Design Preview - Show thumbnail/message */}
                      <div className="text-center p-8">
                        <div className="w-32 h-32 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 flex items-center justify-center shadow-2xl">
                          <svg className="w-20 h-20 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M7.5 7.5c-1.5 0-3 1.2-3 3.3 0 1.6 1 2.9 2.4 3.2.1 0 .3-.1.3-.2V12c0-.1 0-.2-.1-.2-.7-.2-1.2-.8-1.2-1.5 0-1 .7-1.8 1.6-1.8s1.6.8 1.6 1.8c0 .7-.5 1.3-1.2 1.5-.1 0-.1.1-.1.2v1.8c0 .1.2.2.3.2 1.4-.3 2.4-1.6 2.4-3.2 0-2.1-1.5-3.3-3-3.3zm9 0c-1.5 0-3 1.2-3 3.3 0 1.6 1 2.9 2.4 3.2.1 0 .3-.1.3-.2V12c0-.1 0-.2-.1-.2-.7-.2-1.2-.8-1.2-1.5 0-1 .7-1.8 1.6-1.8s1.6.8 1.6 1.8c0 .7-.5 1.3-1.2 1.5-.1 0-.1.1-.1.2v1.8c0 .1.2.2.3.2 1.4-.3 2.4-1.6 2.4-3.2 0-2.1-1.5-3.3-3-3.3z"/>
                          </svg>
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-4">Canva Design</h3>
                        <p className="text-slate-400 mb-8 max-w-md mx-auto">
                          Click the button below to view this design in Canva
                        </p>
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 text-white font-bold rounded-xl hover:scale-105 hover:shadow-2xl transition-all"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink size={20} />
                          Open in Canva
                        </a>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div className="w-full max-h-[60vh] flex items-center justify-center">
                  <SocialEmbed url={item.url} className="rounded-2xl shadow-2xl max-w-4xl w-full" />
                </div>
              );
            })()}

            {/* Caption - Only show if alt_text exists and is not a filename */}
            {(() => {
              const altText = galleryItems[selectedGalleryIndex].alt_text;
              // Check if alt_text is not a filename (doesn't end with common image/file extensions)
              const isFilename = altText && /\.(jpg|jpeg|png|gif|webp|pdf|doc|docx|xls|xlsx|ppt|pptx)$/i.test(altText);
              return altText && !isFilename && altText.trim() !== '' && (
                <p className="text-white text-center mt-4 text-lg font-medium">
                  {altText}
                </p>
              );
            })()}

            {/* Counter */}
            <p className="text-slate-400 text-center mt-2 text-sm">
              {selectedGalleryIndex + 1} / {galleryItems.length}
            </p>
          </div>
        </motion.div>
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
