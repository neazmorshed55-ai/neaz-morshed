"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import {
  ArrowLeft, ArrowRight, ExternalLink, X, Play,
  Briefcase, Database, Target, Layout, Video, Search,
  Loader2, Calendar, User, Eye, Clock, CheckCircle2
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';

const isVideoFile = (url: string) => {
  return url.includes('supabase.co') || url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.mov');
};

// Convert YouTube URLs to embed format
const getYouTubeEmbedUrl = (url: string) => {
  // Handle different YouTube URL formats
  // youtube.com/watch?v=VIDEO_ID
  // youtu.be/VIDEO_ID
  // youtube.com/embed/VIDEO_ID (already embed format)

  if (url.includes('youtube.com/embed/')) {
    return url; // Already in embed format
  }

  let videoId = '';

  // Match youtube.com/watch?v=VIDEO_ID
  const watchMatch = url.match(/youtube\.com\/watch\?v=([^&]+)/);
  if (watchMatch) {
    videoId = watchMatch[1];
  }

  // Match youtu.be/VIDEO_ID
  const shortMatch = url.match(/youtu\.be\/([^?]+)/);
  if (shortMatch) {
    videoId = shortMatch[1];
  }

  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}`;
  }

  // Return original URL if no match (might be Vimeo or other)
  return url;
};

// Check if URL is a YouTube or embeddable video
const isEmbeddableVideo = (url: string) => {
  return url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com');
};

interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon: string;
  cover_image: string | null;
  cover_image_alt_text: string | null;
}

interface PortfolioItem {
  id: string;
  service_slug: string;
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

interface GalleryItem {
  id: string;
  portfolio_item_id: string;
  url: string;
  alt_text: string | null;
  type: 'image' | 'video' | 'link';
  order_index: number;
}

// Default services data
const defaultServices: { [key: string]: Service } = {
  'video-production': {
    id: 'video-production',
    title: 'Video Production',
    slug: 'video-production',
    description: 'Professional video editing, motion graphics, and video production services. From YouTube content to corporate videos, I deliver high-quality visual content that engages your audience.',
    icon: 'Video',
    cover_image: null
  },
  'graphic-design': {
    id: 'graphic-design',
    title: 'Graphic Design',
    slug: 'graphic-design',
    description: 'Creative graphic design services including logos, banners, social media graphics, presentations, and brand identity design that makes your business stand out.',
    icon: 'Layout',
    cover_image: null
  },
  'content-writing': {
    id: 'content-writing',
    title: 'Content Writing',
    slug: 'content-writing',
    description: 'Professional content writing services including blog posts, articles, website copy, product descriptions, and AI-assisted content creation for your business needs.',
    icon: 'Briefcase',
    cover_image: null
  },
  'ebook-design': {
    id: 'ebook-design',
    title: 'eBook Design',
    slug: 'ebook-design',
    description: 'Professional eBook formatting and design services for Kindle, PDF, ePub formats. Transform your manuscript into a beautifully designed digital book.',
    icon: 'Database',
    cover_image: null
  },
  'virtual-assistant': {
    id: 'virtual-assistant',
    title: 'Virtual Assistant',
    slug: 'virtual-assistant',
    description: 'Comprehensive virtual assistance services including email management, scheduling, data entry, research, and administrative support to help you focus on what matters most.',
    icon: 'Briefcase',
    cover_image: null
  },
  'social-media-marketing': {
    id: 'social-media-marketing',
    title: 'Social Media Marketing',
    slug: 'social-media-marketing',
    description: 'Strategic social media marketing services including content creation, account management, engagement strategies, and organic growth for all major platforms.',
    icon: 'Target',
    cover_image: null
  },
  'web-design': {
    id: 'web-design',
    title: 'Web Design',
    slug: 'web-design',
    description: 'Professional website design using Wix, WordPress, and other CMS platforms. Custom designs, responsive layouts, and SEO-friendly websites for your business.',
    icon: 'Layout',
    cover_image: null
  }
};

// Default portfolio items - Video Production
const defaultPortfolioItems: PortfolioItem[] = [
  // Video Production Portfolio (9 items)
  {
    id: 'vp1',
    service_slug: 'video-production',
    title: 'YouTube Channel Intro Animation',
    description: 'Created a dynamic and engaging intro animation for a tech YouTube channel. The animation features modern motion graphics, smooth transitions, and brand-aligned color schemes that capture viewer attention in the first 5 seconds.',
    thumbnail_url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&q=80',
    image_url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&q=80',
    video_url: null,
    project_url: null,
    client_name: 'Tech Reviews Daily',
    completion_date: 'January 2025',
    duration: '15 seconds',
    tools_used: ['After Effects', 'Premiere Pro', 'Illustrator'],
    tags: ['Motion Graphics', 'YouTube', 'Branding'],
    is_featured: true,
    order_index: 1
  },
  {
    id: 'vp2',
    service_slug: 'video-production',
    title: 'Corporate Promotional Video',
    description: 'Produced a high-quality corporate promotional video showcasing company culture, services, and achievements. Included drone footage, employee interviews, and professional voice-over narration.',
    thumbnail_url: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800&q=80',
    image_url: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=1200&q=80',
    video_url: null,
    project_url: null,
    client_name: 'Williams Transportation',
    completion_date: 'February 2025',
    duration: '3 minutes',
    tools_used: ['Premiere Pro', 'DaVinci Resolve', 'After Effects'],
    tags: ['Corporate', 'Promotional', 'Drone Footage'],
    is_featured: true,
    order_index: 2
  },
  {
    id: 'vp3',
    service_slug: 'video-production',
    title: 'Product Launch Video',
    description: 'Crafted an exciting product launch video with 3D product visualization, kinetic typography, and energetic music. The video generated significant engagement on social media platforms.',
    thumbnail_url: 'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=800&q=80',
    image_url: 'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=1200&q=80',
    video_url: null,
    project_url: null,
    client_name: 'TechStart Inc.',
    completion_date: 'December 2024',
    duration: '1 minute 30 seconds',
    tools_used: ['After Effects', 'Cinema 4D', 'Premiere Pro'],
    tags: ['Product Launch', '3D Animation', 'Social Media'],
    is_featured: false,
    order_index: 3
  },
  {
    id: 'vp4',
    service_slug: 'video-production',
    title: '8-Hour Relaxation Video',
    description: 'Produced an 8-hour relaxing nature video with ambient sounds for the Aura Relax YouTube channel. Combined royalty-free nature clips with calming audio for sleep and meditation purposes.',
    thumbnail_url: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&q=80',
    image_url: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=1200&q=80',
    video_url: null,
    project_url: 'https://youtube.com',
    client_name: 'Aura Relax & Nature Healing Society',
    completion_date: 'November 2024',
    duration: '8 hours',
    tools_used: ['Premiere Pro', 'Audacity', 'Storyblocks'],
    tags: ['Relaxation', 'YouTube', 'Ambient'],
    is_featured: true,
    order_index: 4
  },
  {
    id: 'vp5',
    service_slug: 'video-production',
    title: 'Event Highlight Reel',
    description: 'Created a dynamic highlight reel for the Savor Boca food festival event. Captured the energy, delicious food, and happy attendees in a 2-minute engaging video.',
    thumbnail_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80',
    video_url: null,
    project_url: null,
    client_name: 'Savor Our City',
    completion_date: 'October 2024',
    duration: '2 minutes',
    tools_used: ['Premiere Pro', 'After Effects', 'LumaFusion'],
    tags: ['Event', 'Highlight Reel', 'Food Festival'],
    is_featured: false,
    order_index: 5
  },
  {
    id: 'vp6',
    service_slug: 'video-production',
    title: 'Podcast Video Editing',
    description: 'Edited and rendered podcast episodes with professional graphics, lower thirds, and engaging visual elements. Created both full-length episodes and short clips for social media promotion.',
    thumbnail_url: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&q=80',
    image_url: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=1200&q=80',
    video_url: null,
    project_url: null,
    client_name: 'Bueno Group',
    completion_date: 'August 2024',
    duration: 'Multiple episodes',
    tools_used: ['Premiere Pro', 'After Effects', 'Descript'],
    tags: ['Podcast', 'Video Editing', 'Social Media Clips'],
    is_featured: false,
    order_index: 6
  },
  {
    id: 'vp7',
    service_slug: 'video-production',
    title: 'Quran Translation Videos',
    description: 'Created meaningful Quran translation videos using AI text-to-video software. Carefully selected scenes using precise keywords to match verse meanings and enhance spiritual experience.',
    thumbnail_url: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=800&q=80',
    image_url: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=1200&q=80',
    video_url: null,
    project_url: null,
    client_name: 'Zeir App',
    completion_date: 'September 2024',
    duration: 'Multiple videos',
    tools_used: ['AI Video Tools', 'Premiere Pro', 'After Effects'],
    tags: ['Religious Content', 'AI Video', 'Translation'],
    is_featured: false,
    order_index: 7
  },
  {
    id: 'vp8',
    service_slug: 'video-production',
    title: 'Social Media Reels Package',
    description: 'Produced a package of 30 short-form vertical videos optimized for Instagram Reels, TikTok, and YouTube Shorts. Each video features trending transitions, text animations, and music sync.',
    thumbnail_url: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800&q=80',
    image_url: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=1200&q=80',
    video_url: null,
    project_url: null,
    client_name: 'iPad Art SoCal',
    completion_date: 'November 2024',
    duration: '15-60 seconds each',
    tools_used: ['Premiere Pro', 'CapCut', 'Canva'],
    tags: ['Social Media', 'Reels', 'Short Form'],
    is_featured: true,
    order_index: 8
  },
  {
    id: 'vp9',
    service_slug: 'video-production',
    title: 'Training Video Series',
    description: 'Developed a comprehensive training video series for internal company use. Includes screen recordings, presenter footage, animated explanations, and interactive elements.',
    thumbnail_url: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800&q=80',
    image_url: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=1200&q=80',
    video_url: null,
    project_url: null,
    client_name: 'Release Media Inc.',
    completion_date: 'July 2024',
    duration: '10 videos, 5-10 min each',
    tools_used: ['Camtasia', 'Premiere Pro', 'After Effects'],
    tags: ['Training', 'Corporate', 'Educational'],
    is_featured: false,
    order_index: 9
  },
  // =====================================================
  // GRAPHIC DESIGN Portfolio (6 items)
  // =====================================================
  {
    id: 'gd1',
    service_slug: 'graphic-design',
    title: 'Brand Identity Package',
    description: 'Complete brand identity design including logo, business cards, letterhead, and brand guidelines for a tech startup. Created a modern, memorable visual identity.',
    thumbnail_url: 'https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?w=800&q=80',
    image_url: 'https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?w=1200&q=80',
    video_url: null,
    project_url: null,
    client_name: 'TechStart Inc.',
    completion_date: 'December 2024',
    duration: '2 weeks',
    tools_used: ['Adobe Illustrator', 'Photoshop', 'Canva'],
    tags: ['Logo Design', 'Branding', 'Identity'],
    is_featured: true,
    order_index: 1
  },
  {
    id: 'gd2',
    service_slug: 'graphic-design',
    title: 'Social Media Graphics Pack',
    description: 'Designed 50+ social media graphics including post templates, story templates, and highlight covers for Instagram, Facebook, and LinkedIn.',
    thumbnail_url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80',
    image_url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&q=80',
    video_url: null,
    project_url: null,
    client_name: 'Do it Digital',
    completion_date: 'November 2024',
    duration: '1 week',
    tools_used: ['Canva', 'Adobe Photoshop', 'Figma'],
    tags: ['Social Media', 'Templates', 'Graphics'],
    is_featured: true,
    order_index: 2
  },
  {
    id: 'gd3',
    service_slug: 'graphic-design',
    title: 'Presentation Design',
    description: 'Created professional PowerPoint and Google Slides presentations with custom graphics, infographics, and data visualizations for corporate clients.',
    thumbnail_url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80',
    image_url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&q=80',
    video_url: null,
    project_url: null,
    client_name: 'HJ Visualization',
    completion_date: 'October 2024',
    duration: '3 days',
    tools_used: ['PowerPoint', 'Google Slides', 'Canva'],
    tags: ['Presentation', 'Corporate', 'Infographics'],
    is_featured: false,
    order_index: 3
  },
  {
    id: 'gd4',
    service_slug: 'graphic-design',
    title: 'Marketing Banners & Ads',
    description: 'Designed eye-catching digital banners and ad creatives for Google Ads, Facebook Ads, and display advertising campaigns.',
    thumbnail_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80',
    video_url: null,
    project_url: null,
    client_name: 'ARO Commerce',
    completion_date: 'September 2024',
    duration: '5 days',
    tools_used: ['Photoshop', 'Canva', 'Figma'],
    tags: ['Advertising', 'Banners', 'Marketing'],
    is_featured: false,
    order_index: 4
  },
  {
    id: 'gd5',
    service_slug: 'graphic-design',
    title: 'Event Promotional Materials',
    description: 'Complete event branding including flyers, posters, tickets, and social media graphics for the Savor Boca food festival.',
    thumbnail_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80',
    video_url: null,
    project_url: null,
    client_name: 'Savor Our City',
    completion_date: 'August 2024',
    duration: '1 week',
    tools_used: ['Adobe Illustrator', 'Photoshop', 'InDesign'],
    tags: ['Event', 'Flyers', 'Posters'],
    is_featured: true,
    order_index: 5
  },
  {
    id: 'gd6',
    service_slug: 'graphic-design',
    title: 'Email Signature Design',
    description: 'Created professional HTML email signatures with consistent branding for entire teams, including clickable social icons and contact information.',
    thumbnail_url: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=800&q=80',
    image_url: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=1200&q=80',
    video_url: null,
    project_url: null,
    client_name: 'Multiple Clients',
    completion_date: 'Ongoing',
    duration: 'Per project',
    tools_used: ['HTML', 'Photoshop', 'Canva'],
    tags: ['Email', 'Branding', 'Corporate'],
    is_featured: false,
    order_index: 6
  },
  // =====================================================
  // CONTENT WRITING Portfolio (6 items)
  // =====================================================
  {
    id: 'cw1',
    service_slug: 'content-writing',
    title: 'Blog Content Strategy',
    description: 'Developed and executed a comprehensive blog content strategy with 50+ SEO-optimized articles, increasing organic traffic by 200%.',
    thumbnail_url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80',
    image_url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&q=80',
    video_url: null,
    project_url: null,
    client_name: 'Release Media Inc.',
    completion_date: 'January 2025',
    duration: 'Ongoing',
    tools_used: ['WordPress', 'Grammarly', 'SEMrush', 'AI Tools'],
    tags: ['Blog Writing', 'SEO', 'Content Strategy'],
    is_featured: true,
    order_index: 1
  },
  {
    id: 'cw2',
    service_slug: 'content-writing',
    title: 'Website Copywriting',
    description: 'Wrote compelling website copy for multiple business websites including homepage, about, services, and landing pages that convert visitors.',
    thumbnail_url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80',
    image_url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&q=80',
    video_url: null,
    project_url: null,
    client_name: 'TBC Websites',
    completion_date: 'December 2025',
    duration: '25+ websites',
    tools_used: ['Google Docs', 'Hemingway', 'ChatGPT', 'Claude'],
    tags: ['Copywriting', 'Website', 'Conversion'],
    is_featured: true,
    order_index: 2
  },
  {
    id: 'cw3',
    service_slug: 'content-writing',
    title: 'Product Descriptions',
    description: 'Created engaging product descriptions for e-commerce stores, optimized for both SEO and conversion with compelling calls-to-action.',
    thumbnail_url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
    image_url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80',
    video_url: null,
    project_url: null,
    client_name: 'Malaysian Super Shop',
    completion_date: 'September 2024',
    duration: '500+ products',
    tools_used: ['Google Sheets', 'AI Writing Tools', 'Grammarly'],
    tags: ['E-commerce', 'Product Copy', 'SEO'],
    is_featured: false,
    order_index: 3
  },
  {
    id: 'cw4',
    service_slug: 'content-writing',
    title: 'AI-Assisted Content Creation',
    description: 'Leveraged AI tools including Claude and ChatGPT to produce high-quality content at scale while maintaining brand voice and accuracy.',
    thumbnail_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
    image_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80',
    video_url: null,
    project_url: null,
    client_name: 'Webkonsult AS',
    completion_date: 'July 2024',
    duration: '4 months',
    tools_used: ['Claude AI', 'ChatGPT', 'TextBuilder AI'],
    tags: ['AI Content', 'Automation', 'Scale'],
    is_featured: true,
    order_index: 4
  },
  {
    id: 'cw5',
    service_slug: 'content-writing',
    title: 'Email Marketing Copy',
    description: 'Wrote email sequences including welcome series, promotional campaigns, and newsletters with high open and click-through rates.',
    thumbnail_url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80',
    image_url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&q=80',
    video_url: null,
    project_url: null,
    client_name: 'Suson Essentials',
    completion_date: 'February 2024',
    duration: '5 months',
    tools_used: ['Constant Contact', 'Mailchimp', 'Google Docs'],
    tags: ['Email Marketing', 'Copywriting', 'Newsletters'],
    is_featured: false,
    order_index: 5
  },
  {
    id: 'cw6',
    service_slug: 'content-writing',
    title: 'Press Releases & Articles',
    description: 'Authored press releases, news articles, and infographics for media distribution, helping clients gain visibility and backlinks.',
    thumbnail_url: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80',
    image_url: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&q=80',
    video_url: null,
    project_url: null,
    client_name: 'Release Media Inc.',
    completion_date: 'Ongoing',
    duration: 'Multiple projects',
    tools_used: ['Google Docs', 'Canva', 'PR Distribution'],
    tags: ['Press Release', 'PR', 'Media'],
    is_featured: false,
    order_index: 6
  },
  // =====================================================
  // EBOOK DESIGN Portfolio (5 items)
  // =====================================================
  {
    id: 'eb1',
    service_slug: 'ebook-design',
    title: 'Kindle eBook Formatting',
    description: 'Professional Kindle eBook formatting with proper chapter navigation, table of contents, and optimized images for various Kindle devices.',
    thumbnail_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80',
    image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1200&q=80',
    video_url: null,
    project_url: null,
    client_name: 'Multiple Authors',
    completion_date: 'Ongoing',
    duration: '50+ books',
    tools_used: ['Kindle Create', 'Calibre', 'Adobe InDesign'],
    tags: ['Kindle', 'eBook', 'Formatting'],
    is_featured: true,
    order_index: 1
  },
  {
    id: 'eb2',
    service_slug: 'ebook-design',
    title: 'Interactive PDF eBook',
    description: 'Designed interactive PDF eBooks with clickable table of contents, hyperlinks, embedded videos, and professional layouts.',
    thumbnail_url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80',
    image_url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&q=80',
    video_url: null,
    project_url: null,
    client_name: 'iPad Art SoCal',
    completion_date: 'November 2024',
    duration: '1 week',
    tools_used: ['Adobe InDesign', 'Canva', 'Acrobat Pro'],
    tags: ['PDF', 'Interactive', 'Design'],
    is_featured: true,
    order_index: 2
  },
  {
    id: 'eb3',
    service_slug: 'ebook-design',
    title: 'ePub Conversion',
    description: 'Converted manuscripts to ePub format for Apple Books, Kobo, and other platforms with proper metadata and formatting.',
    thumbnail_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80',
    image_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1200&q=80',
    video_url: null,
    project_url: null,
    client_name: 'Self-Published Authors',
    completion_date: 'Ongoing',
    duration: '30+ books',
    tools_used: ['Sigil', 'Calibre', 'Vellum'],
    tags: ['ePub', 'Conversion', 'Publishing'],
    is_featured: false,
    order_index: 3
  },
  {
    id: 'eb4',
    service_slug: 'ebook-design',
    title: 'eBook Cover Design',
    description: 'Created eye-catching eBook covers that stand out in online marketplaces, following platform guidelines and genre conventions.',
    thumbnail_url: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=800&q=80',
    image_url: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=1200&q=80',
    video_url: null,
    project_url: null,
    client_name: 'Various Authors',
    completion_date: 'Ongoing',
    duration: 'Per project',
    tools_used: ['Photoshop', 'Canva', 'Illustrator'],
    tags: ['Cover Design', 'Graphics', 'Marketing'],
    is_featured: true,
    order_index: 4
  },
  {
    id: 'eb5',
    service_slug: 'ebook-design',
    title: 'Lead Magnet eBook',
    description: 'Designed professional lead magnet eBooks for email marketing funnels with branded layouts and compelling visuals.',
    thumbnail_url: 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=800&q=80',
    image_url: 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=1200&q=80',
    video_url: null,
    project_url: null,
    client_name: 'Marketing Agencies',
    completion_date: 'Ongoing',
    duration: 'Per project',
    tools_used: ['Canva', 'InDesign', 'Photoshop'],
    tags: ['Lead Magnet', 'Marketing', 'Design'],
    is_featured: false,
    order_index: 5
  },
  // =====================================================
  // VIRTUAL ASSISTANT Portfolio (6 items)
  // =====================================================
  {
    id: 'va1',
    service_slug: 'virtual-assistant',
    title: 'Executive Calendar Management',
    description: 'Managed complex calendars for multiple executives, coordinating meetings across time zones, handling rescheduling, and ensuring optimal time allocation.',
    thumbnail_url: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&q=80',
    image_url: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=1200&q=80',
    video_url: null,
    project_url: null,
    client_name: 'Joey Guillory',
    completion_date: 'October 2023',
    duration: '10 months',
    tools_used: ['Google Calendar', 'Calendly', 'Slack'],
    tags: ['Calendar Management', 'Executive Support', 'Scheduling'],
    is_featured: true,
    order_index: 1
  },
  {
    id: 'va2',
    service_slug: 'virtual-assistant',
    title: 'Email Inbox Zero Management',
    description: 'Implemented inbox zero methodology, categorizing and responding to hundreds of emails daily, creating templates, and maintaining organized email systems.',
    thumbnail_url: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=800&q=80',
    image_url: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=1200&q=80',
    video_url: null,
    project_url: null,
    client_name: 'Multiple Clients',
    completion_date: 'Ongoing',
    duration: 'Continuous',
    tools_used: ['Gmail', 'Outlook', 'Superhuman'],
    tags: ['Email Management', 'Organization', 'Communication'],
    is_featured: false,
    order_index: 2
  },
  {
    id: 'va3',
    service_slug: 'virtual-assistant',
    title: 'Job Application Management',
    description: 'Managed job applications via LinkedIn, Indeed, and Google Jobs, helping clients secure positions including roles at Hilton hotels.',
    thumbnail_url: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80',
    image_url: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200&q=80',
    video_url: null,
    project_url: null,
    client_name: 'Joey Guillory',
    completion_date: 'October 2023',
    duration: '10 months',
    tools_used: ['LinkedIn', 'Indeed', 'Lazy App', 'Google Jobs'],
    tags: ['Job Search', 'Applications', 'Career Support'],
    is_featured: true,
    order_index: 3
  },
  {
    id: 'va4',
    service_slug: 'virtual-assistant',
    title: 'Travel & Event Planning',
    description: 'Coordinated travel arrangements including flights, hotels, and itineraries, plus organized corporate events and meetings.',
    thumbnail_url: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80',
    image_url: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&q=80',
    video_url: null,
    project_url: null,
    client_name: 'Multiple Executives',
    completion_date: 'Ongoing',
    duration: 'Per project',
    tools_used: ['Google Flights', 'Booking.com', 'TripIt'],
    tags: ['Travel', 'Event Planning', 'Coordination'],
    is_featured: false,
    order_index: 4
  },
  {
    id: 'va5',
    service_slug: 'virtual-assistant',
    title: 'Data Entry & Research',
    description: 'Conducted extensive online research, data compilation, spreadsheet management, and vendor sourcing for various business needs.',
    thumbnail_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
    video_url: null,
    project_url: null,
    client_name: 'Do it Digital',
    completion_date: 'Ongoing',
    duration: 'Continuous',
    tools_used: ['Google Sheets', 'Excel', 'Airtable'],
    tags: ['Data Entry', 'Research', 'Spreadsheets'],
    is_featured: false,
    order_index: 5
  },
  {
    id: 'va6',
    service_slug: 'virtual-assistant',
    title: 'Administrative Support',
    description: 'Comprehensive administrative support including document preparation, file organization, CRM management, and general office tasks.',
    thumbnail_url: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80',
    image_url: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&q=80',
    video_url: null,
    project_url: null,
    client_name: 'GLOCAL, University of London',
    completion_date: 'December 2022',
    duration: '2 years',
    tools_used: ['Google Workspace', 'Microsoft Office', 'Notion'],
    tags: ['Admin Support', 'Documentation', 'Organization'],
    is_featured: true,
    order_index: 6
  },
  // =====================================================
  // SOCIAL MEDIA MARKETING Portfolio (6 items)
  // =====================================================
  {
    id: 'smm1',
    service_slug: 'social-media-marketing',
    title: 'Instagram Growth Strategy',
    description: 'Developed and executed Instagram growth strategy achieving 300% follower increase through organic content, engagement tactics, and hashtag optimization.',
    thumbnail_url: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800&q=80',
    image_url: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=1200&q=80',
    video_url: null,
    project_url: null,
    client_name: 'iPad Art SoCal',
    completion_date: 'November 2024',
    duration: 'Ongoing',
    tools_used: ['Instagram', 'Later', 'Canva', 'Hashtag Expert'],
    tags: ['Instagram', 'Growth', 'Organic'],
    is_featured: true,
    order_index: 1
  },
  {
    id: 'smm2',
    service_slug: 'social-media-marketing',
    title: 'Multi-Platform Management',
    description: 'Managed social media presence across Facebook, Instagram, LinkedIn, and Twitter with consistent branding and content calendars.',
    thumbnail_url: 'https://images.unsplash.com/photo-1562577309-4932fdd64cd1?w=800&q=80',
    image_url: 'https://images.unsplash.com/photo-1562577309-4932fdd64cd1?w=1200&q=80',
    video_url: null,
    project_url: null,
    client_name: 'Do it Digital',
    completion_date: 'Ongoing',
    duration: 'Continuous',
    tools_used: ['Buffer', 'Hootsuite', 'Canva', 'Meta Business'],
    tags: ['Multi-Platform', 'Content Calendar', 'Management'],
    is_featured: true,
    order_index: 2
  },
  {
    id: 'smm3',
    service_slug: 'social-media-marketing',
    title: 'YouTube Channel Management',
    description: 'Complete YouTube channel management including video uploads, SEO optimization, thumbnail design, and community engagement.',
    thumbnail_url: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&q=80',
    image_url: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=1200&q=80',
    video_url: null,
    project_url: 'https://youtube.com',
    client_name: 'Aura Relax & Nature Healing Society',
    completion_date: 'Ongoing',
    duration: '4+ years',
    tools_used: ['YouTube Studio', 'TubeBuddy', 'Canva', 'VidIQ'],
    tags: ['YouTube', 'Video SEO', 'Channel Growth'],
    is_featured: true,
    order_index: 3
  },
  {
    id: 'smm4',
    service_slug: 'social-media-marketing',
    title: 'Facebook Business Page Setup',
    description: 'Set up and optimized Facebook Business pages with complete branding, automated responses, and content strategy implementation.',
    thumbnail_url: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&q=80',
    image_url: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=1200&q=80',
    video_url: null,
    project_url: null,
    client_name: 'Williams Transportation',
    completion_date: 'January 2025',
    duration: 'Ongoing',
    tools_used: ['Meta Business Suite', 'Canva', 'Facebook Ads'],
    tags: ['Facebook', 'Business Page', 'Setup'],
    is_featured: false,
    order_index: 4
  },
  {
    id: 'smm5',
    service_slug: 'social-media-marketing',
    title: 'LinkedIn Marketing Campaign',
    description: 'Executed B2B LinkedIn marketing campaigns including content creation, connection outreach, and thought leadership positioning.',
    thumbnail_url: 'https://images.unsplash.com/photo-1611944212129-29977ae1398c?w=800&q=80',
    image_url: 'https://images.unsplash.com/photo-1611944212129-29977ae1398c?w=1200&q=80',
    video_url: null,
    project_url: null,
    client_name: 'Multiple B2B Clients',
    completion_date: 'Ongoing',
    duration: 'Per campaign',
    tools_used: ['LinkedIn', 'Sales Navigator', 'Canva'],
    tags: ['LinkedIn', 'B2B', 'Lead Generation'],
    is_featured: false,
    order_index: 5
  },
  {
    id: 'smm6',
    service_slug: 'social-media-marketing',
    title: 'Social Media Content Creation',
    description: 'Created engaging social media content including graphics, captions, reels, and stories that drive engagement and brand awareness.',
    thumbnail_url: 'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=800&q=80',
    image_url: 'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=1200&q=80',
    video_url: null,
    project_url: null,
    client_name: 'White Serpent Wisdom',
    completion_date: 'Ongoing',
    duration: 'Continuous',
    tools_used: ['Canva', 'CapCut', 'Adobe Express'],
    tags: ['Content Creation', 'Reels', 'Stories'],
    is_featured: false,
    order_index: 6
  },
  // =====================================================
  // WEB DESIGN Portfolio (6 items)
  // =====================================================
  {
    id: 'wd1',
    service_slug: 'web-design',
    title: 'Transportation Company Website',
    description: 'Developed a modern, responsive website for Williams Transportation with online booking system, fleet showcase, and contact integration.',
    thumbnail_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80',
    video_url: null,
    project_url: 'https://wtransportsolution.com',
    client_name: 'Williams Transportation',
    completion_date: 'January 2025',
    duration: '3 weeks',
    tools_used: ['Next.js', 'Tailwind CSS', 'Vercel'],
    tags: ['Corporate Website', 'Responsive', 'Booking System'],
    is_featured: true,
    order_index: 1
  },
  {
    id: 'wd2',
    service_slug: 'web-design',
    title: 'Catering Business Website',
    description: 'Created an elegant website for a catering company featuring menu showcase, event gallery, testimonials, and quote request system.',
    thumbnail_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
    image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=80',
    video_url: null,
    project_url: 'https://thesoleingredientcatering.com',
    client_name: 'The Sole Ingredient Catering LLC',
    completion_date: 'January 2025',
    duration: '2 weeks',
    tools_used: ['Next.js', 'Supabase', 'Tailwind CSS'],
    tags: ['Restaurant', 'Catering', 'Food Business'],
    is_featured: true,
    order_index: 2
  },
  {
    id: 'wd3',
    service_slug: 'web-design',
    title: 'WordPress Website Management',
    description: 'Developed and maintained multiple WordPress websites including GLOCAL and related academic sites with custom themes and plugins.',
    thumbnail_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80',
    video_url: null,
    project_url: null,
    client_name: 'GLOCAL, University of London',
    completion_date: 'December 2022',
    duration: '2 years',
    tools_used: ['WordPress', 'Elementor', 'WooCommerce'],
    tags: ['WordPress', 'CMS', 'Academic'],
    is_featured: true,
    order_index: 3
  },
  {
    id: 'wd4',
    service_slug: 'web-design',
    title: 'Wix Website Collection',
    description: 'Designed 25+ websites using Wix platform with modern templates, custom designs, and integrated features for various businesses.',
    thumbnail_url: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=80',
    image_url: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1200&q=80',
    video_url: null,
    project_url: null,
    client_name: 'TBC Websites',
    completion_date: 'Ongoing',
    duration: '25+ sites',
    tools_used: ['Wix', 'Wix ADI', 'Wix Editor'],
    tags: ['Wix', 'Website Builder', 'Small Business'],
    is_featured: false,
    order_index: 4
  },
  {
    id: 'wd5',
    service_slug: 'web-design',
    title: 'Squarespace Website Design',
    description: 'Created professional Squarespace websites for creative professionals with portfolio galleries, booking systems, and e-commerce features.',
    thumbnail_url: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=800&q=80',
    image_url: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=1200&q=80',
    video_url: null,
    project_url: null,
    client_name: 'iPad Art SoCal',
    completion_date: 'November 2024',
    duration: '1 week',
    tools_used: ['Squarespace', 'Adobe Fonts', 'Unsplash'],
    tags: ['Squarespace', 'Portfolio', 'Creative'],
    is_featured: false,
    order_index: 5
  },
  {
    id: 'wd6',
    service_slug: 'web-design',
    title: 'Hypnobiz Website',
    description: 'Built a complete website using Hypnobiz platform with booking integration, service pages, and client management features.',
    thumbnail_url: 'https://images.unsplash.com/photo-1522542550221-31fd8575f4f4?w=800&q=80',
    image_url: 'https://images.unsplash.com/photo-1522542550221-31fd8575f4f4?w=1200&q=80',
    video_url: null,
    project_url: 'https://white-serpent-tradition.com',
    client_name: 'White Serpent Wisdom',
    completion_date: 'March 2024',
    duration: '2 weeks',
    tools_used: ['Hypnobiz', 'Canva', 'Custom CSS'],
    tags: ['Hypnobiz', 'Booking', 'Wellness'],
    is_featured: false,
    order_index: 6
  }
];

const iconMap: { [key: string]: React.ReactNode } = {
  Briefcase: <Briefcase className="w-8 h-8" />,
  Database: <Database className="w-8 h-8" />,
  Target: <Target className="w-8 h-8" />,
  Layout: <Layout className="w-8 h-8" />,
  Video: <Video className="w-8 h-8" />,
  Search: <Search className="w-8 h-8" />,
};

export default function PortfolioCollectionPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [service, setService] = useState<Service | null>(null);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);

  useEffect(() => {
    async function fetchGallery() {
      if (selectedItem && supabase) {
        const { data } = await supabase
          .from('portfolio_gallery')
          .select('*')
          .eq('portfolio_item_id', selectedItem.id)
          .order('order_index', { ascending: true });

        if (data) {
          setGalleryItems(data as GalleryItem[]);
        }
      } else {
        setGalleryItems([]);
      }
    }

    fetchGallery();
  }, [selectedItem]);

  useEffect(() => {
    async function fetchData() {
      // First try to get from Supabase
      if (supabase && slug) {
        try {
          // Fetch service details
          const { data: serviceData } = await supabase
            .from('services')
            .select('*')
            .eq('slug', slug)
            .single();

          if (serviceData) {
            setService(serviceData);

            // Fetch portfolio items for this service
            const { data: portfolioData } = await supabase
              .from('portfolio_items')
              .select('*')
              .eq('service_id', serviceData.id)
              .order('order_index', { ascending: true });

            if (portfolioData && portfolioData.length > 0) {
              setPortfolioItems(portfolioData);
              setLoading(false);
              return;
            }
          }
        } catch (error) {
          console.error('Error fetching from Supabase:', error);
        }
      }

      // Fall back to default data
      const defaultService = defaultServices[slug];
      if (defaultService) {
        setService(defaultService);
        const defaultItems = defaultPortfolioItems.filter(item => item.service_slug === slug);
        setPortfolioItems(defaultItems);
      }

      setLoading(false);
    }

    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="bg-[#0b0f1a] text-white min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#2ecc71] animate-spin" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="bg-[#0b0f1a] text-white min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-4xl font-black mb-4">Service Not Found</h1>
        <Link href="/services" className="text-[#2ecc71] hover:underline">
          Back to Services
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#0b0f1a] text-white min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-[100] bg-[#0b0f1a]/90 backdrop-blur-2xl border-b border-white/5 py-4">
        <div className="container mx-auto px-6 lg:px-12 flex justify-between items-center max-w-7xl">
          <Link href="/" className="flex items-center gap-4 group cursor-pointer">
            <div className="w-12 h-12 bg-[#2ecc71] rounded-2xl flex items-center justify-center font-black text-slate-950 group-hover:rotate-6 transition-all shadow-[0_0_30px_rgba(46,204,113,0.3)]">NM</div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tighter leading-none">NEAZ MORSHED</span>
              <span className="text-[10px] text-[#2ecc71] font-bold tracking-[0.2em] mt-1 uppercase">Top Rated Pro</span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-10">
            <Link href="/" className="text-[11px] font-bold tracking-[0.3em] text-slate-400 hover:text-[#2ecc71] transition-all uppercase">Home</Link>
            <Link href="/skills" className="text-[11px] font-bold tracking-[0.3em] text-slate-400 hover:text-[#2ecc71] transition-all uppercase">Skills</Link>
            <Link href="/services" className="text-[11px] font-bold tracking-[0.3em] text-[#2ecc71] transition-all uppercase">Services</Link>
            <Link href="/experience" className="text-[11px] font-bold tracking-[0.3em] text-slate-400 hover:text-[#2ecc71] transition-all uppercase">Experience</Link>
            <Link href="/reviews" className="text-[11px] font-bold tracking-[0.3em] text-slate-400 hover:text-[#2ecc71] transition-all uppercase">Reviews</Link>
            <Link href="/contact" className="text-[11px] font-bold tracking-[0.3em] text-slate-400 hover:text-[#2ecc71] transition-all uppercase">Contact</Link>
            <Link href="/resume" className="bg-[#2ecc71] text-slate-950 px-8 py-4 rounded-2xl font-black text-[11px] tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#2ecc71]/20 uppercase">Resume</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 relative overflow-hidden">
        <div className="absolute top-[10%] right-[5%] w-[600px] h-[600px] bg-[#2ecc71]/5 rounded-full blur-[180px] pointer-events-none"></div>

        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-3 mb-8">
            <Link href="/services" className="inline-flex items-center gap-2 text-slate-400 hover:text-[#2ecc71] transition-all group">
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-bold uppercase tracking-wider">Services</span>
            </Link>
            <ArrowRight size={14} className="text-slate-600" />
            <span className="text-[#2ecc71] text-sm font-bold uppercase tracking-wider">{service.title}</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8"
          >
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="text-[#2ecc71] p-4 bg-white/5 rounded-2xl border border-white/10">
                  {iconMap[service.icon] || <Briefcase className="w-8 h-8" />}
                </div>
                <span className="text-[#2ecc71] text-[11px] font-black uppercase tracking-[0.5em]">Portfolio Collection</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-none mb-6">
                {service.title}
              </h1>
              <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
                {service.description}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-center p-8 bg-slate-900/60 border border-white/10 rounded-3xl">
                <div className="text-4xl font-black text-[#2ecc71]">{portfolioItems.length}</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Projects</div>
              </div>
              <div className="text-center p-8 bg-slate-900/60 border border-white/10 rounded-3xl">
                <div className="text-4xl font-black text-[#2ecc71]">{portfolioItems.filter(i => i.is_featured).length}</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Featured</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-7xl">
          {portfolioItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 mx-auto mb-6 bg-slate-900 rounded-full flex items-center justify-center">
                {iconMap[service.icon] || <Briefcase className="w-12 h-12 text-slate-600" />}
              </div>
              <h3 className="text-2xl font-black text-slate-400 mb-4">No Projects Yet</h3>
              <p className="text-slate-500 max-w-md mx-auto">
                Portfolio items for this service will be added soon. Check back later or contact me for custom work.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 mt-8 px-8 py-4 bg-[#2ecc71] text-slate-900 font-black rounded-2xl hover:scale-105 transition-transform"
              >
                Get in Touch <ArrowRight size={18} />
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {portfolioItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onClick={() => setSelectedItem(item)}
                  className="cursor-pointer group"
                >
                  <div className="relative overflow-hidden rounded-3xl border border-white/5 hover:border-[#2ecc71]/40 transition-all duration-500 bg-slate-900/60 h-full flex flex-col">
                    {/* Image */}
                    <div className="aspect-video relative overflow-hidden">
                      {item.thumbnail_url || item.image_url ? (
                        <img
                          src={item.thumbnail_url || item.image_url || ''}
                          alt={item.thumbnail_alt_text || item.image_alt_text || item.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                          {iconMap[service.icon] || <Briefcase className="w-16 h-16 text-slate-600" />}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f1a] via-transparent to-transparent opacity-60"></div>

                      {/* Play Button for Videos */}
                      {item.video_url && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 bg-[#2ecc71] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-[#2ecc71]/30">
                            <Play size={28} className="text-slate-900 ml-1" fill="currentColor" />
                          </div>
                        </div>
                      )}

                      {/* Featured Badge */}
                      {item.is_featured && (
                        <div className="absolute top-4 right-4 px-3 py-1 bg-[#2ecc71] text-slate-900 text-[9px] font-black rounded-full uppercase">
                          Featured
                        </div>
                      )}

                      {/* Duration Badge */}
                      {item.duration && (
                        <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/70 text-white text-[10px] font-bold rounded-full flex items-center gap-1">
                          <Clock size={12} />
                          {item.duration}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-xl font-black mb-2 group-hover:text-[#2ecc71] transition-colors uppercase tracking-tight">
                        {item.title}
                      </h3>

                      {item.client_name && (
                        <div className="flex items-center gap-2 text-slate-500 text-sm mb-3">
                          <User size={14} />
                          <span>{item.client_name}</span>
                        </div>
                      )}

                      <p className="text-slate-400 text-sm line-clamp-2 mb-4 flex-1">
                        {item.description}
                      </p>

                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-auto">
                          {item.tags.slice(0, 3).map((tag, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-wider"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-900/30">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center p-12 bg-slate-900/60 border border-white/10 rounded-[3rem] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-[#2ecc71]/10 rounded-full blur-[80px] -z-10"></div>

            <div className="text-[#2ecc71] p-5 bg-white/5 rounded-2xl border border-white/10 inline-flex mb-6">
              {iconMap[service.icon] || <Briefcase className="w-10 h-10" />}
            </div>
            <h3 className="text-3xl font-black uppercase tracking-tight mb-4">
              Need Similar Work?
            </h3>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto">
              I can create custom {service.title.toLowerCase()} solutions tailored to your specific needs. Let's discuss your project!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="px-10 py-5 bg-[#2ecc71] text-slate-900 font-black rounded-2xl hover:scale-105 transition-transform uppercase tracking-widest text-sm flex items-center gap-3"
              >
                Start a Project <ArrowRight size={18} />
              </Link>
              <Link
                href="/services"
                className="px-10 py-5 border-2 border-white/20 text-white font-black rounded-2xl hover:border-[#2ecc71] transition-all uppercase tracking-widest text-sm"
              >
                View All Services
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Modal for Portfolio Item Details */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-xl overflow-y-auto"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-[#0e1526] rounded-[2rem] md:rounded-[3rem] max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/10 relative my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 md:top-6 md:right-6 z-10 p-3 bg-white/10 rounded-full hover:bg-[#2ecc71] hover:text-slate-900 transition-all"
              >
                <X size={24} />
              </button>

              {/* Image/Video */}
              {selectedItem.video_url ? (
                <div className="aspect-video relative overflow-hidden rounded-t-[2rem] md:rounded-t-[3rem] bg-black">
                  {isVideoFile(selectedItem.video_url) ? (
                    <video
                      src={selectedItem.video_url}
                      className="w-full h-full object-cover"
                      controls
                      playsInline
                      preload="none"
                    />
                  ) : (
                    <iframe
                      src={getYouTubeEmbedUrl(selectedItem.video_url)}
                      className="w-full h-full"
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      loading="lazy"
                    />
                  )}
                </div>
              ) : (selectedItem.image_url || selectedItem.thumbnail_url) && (
                <div className="aspect-video relative overflow-hidden rounded-t-[2rem] md:rounded-t-[3rem]">
                  <img
                    src={selectedItem.image_url || selectedItem.thumbnail_url || ''}
                    alt={selectedItem.image_alt_text || selectedItem.thumbnail_alt_text || selectedItem.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}

              {/* Content */}
              <div className="p-6 md:p-10">
                {/* Featured Badge */}
                {selectedItem.is_featured && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#2ecc71]/20 text-[#2ecc71] text-[10px] font-black rounded-full uppercase mb-4">
                    <CheckCircle2 size={12} />
                    Featured Project
                  </span>
                )}

                <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight mb-4">
                  {selectedItem.title}
                </h2>

                <div className="flex flex-wrap gap-4 mb-6">
                  {selectedItem.client_name && (
                    <div className="flex items-center gap-2 text-slate-400">
                      <User size={16} className="text-[#2ecc71]" />
                      <span className="text-sm font-semibold">{selectedItem.client_name}</span>
                    </div>
                  )}
                  {selectedItem.completion_date && (
                    <div className="flex items-center gap-2 text-slate-400">
                      <Calendar size={16} className="text-[#2ecc71]" />
                      <span className="text-sm font-semibold">{selectedItem.completion_date}</span>
                    </div>
                  )}
                  {selectedItem.duration && (
                    <div className="flex items-center gap-2 text-slate-400">
                      <Clock size={16} className="text-[#2ecc71]" />
                      <span className="text-sm font-semibold">{selectedItem.duration}</span>
                    </div>
                  )}
                </div>

                {selectedItem.description && (
                  <p className="text-slate-400 leading-relaxed mb-8">
                    {selectedItem.description}
                  </p>
                )}

                {/* Gallery Section */}
                {galleryItems.length > 0 && (
                  <div className="mb-8">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4 block">Project Gallery</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {galleryItems.map((item) => (
                        <div key={item.id} className="rounded-2xl overflow-hidden border border-white/10 bg-black/50">
                          {item.type === 'video' ? (
                            <div className="aspect-video relative">
                              {isVideoFile(item.url) ? (
                                <video
                                  src={item.url}
                                  className="w-full h-full object-cover"
                                  controls
                                  playsInline
                                  preload="none"
                                />
                              ) : (
                                <iframe
                                  src={getYouTubeEmbedUrl(item.url)}
                                  className="w-full h-full"
                                  allowFullScreen
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  loading="lazy"
                                />
                              )}
                            </div>
                          ) : item.type === 'link' ? (
                            <div className="aspect-video relative">
                              {isEmbeddableVideo(item.url) ? (
                                <iframe
                                  src={getYouTubeEmbedUrl(item.url)}
                                  className="w-full h-full"
                                  allowFullScreen
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  loading="lazy"
                                />
                              ) : (
                                <a
                                  href={item.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-full h-full flex items-center justify-center bg-slate-900 hover:bg-slate-800 transition-colors"
                                >
                                  <div className="text-[#2ecc71] flex flex-col items-center gap-3 p-6">
                                    <ExternalLink size={32} />
                                    <span className="text-white font-bold">View External Link</span>
                                    <span className="text-slate-400 text-sm max-w-[80%] truncate">{item.url}</span>
                                  </div>
                                </a>
                              )}
                            </div>
                          ) : (
                            <img
                              src={item.url}
                              alt={item.alt_text || `Gallery image for ${selectedItem.title}`}
                              className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
                              loading="lazy"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tools Used */}
                {selectedItem.tools_used && selectedItem.tools_used.length > 0 && (
                  <div className="mb-6">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 block">Tools & Software Used</span>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.tools_used.map((tool, i) => (
                        <span
                          key={i}
                          className="px-4 py-2 bg-[#2ecc71]/10 border border-[#2ecc71]/20 rounded-full text-sm font-bold text-[#2ecc71]"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {selectedItem.tags && selectedItem.tags.length > 0 && (
                  <div className="mb-8">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 block">Tags</span>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm font-bold text-slate-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4">
                  {selectedItem.project_url && (
                    <a
                      href={selectedItem.project_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 px-8 py-4 bg-[#2ecc71] text-slate-900 font-black rounded-2xl hover:scale-105 transition-transform uppercase tracking-wider"
                    >
                      View Project <ExternalLink size={18} />
                    </a>
                  )}
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-3 px-8 py-4 border-2 border-white/20 text-white font-black rounded-2xl hover:border-[#2ecc71] transition-all uppercase tracking-wider"
                  >
                    Request Similar Work
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="py-8 border-t border-white/5">
        <div className="container mx-auto px-6 max-w-7xl flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div className="flex gap-8">
            <a href="/blog" className="text-slate-500 hover:text-[#2ecc71] transition-all uppercase text-[10px] font-bold tracking-widest">Blog</a>
            <a href="https://www.linkedin.com/in/neazmorshed222/" target="_blank" className="text-slate-500 hover:text-[#2ecc71] transition-all uppercase text-[10px] font-bold tracking-widest">LinkedIn</a>
            <a href="https://www.fiverr.com/neaz222" target="_blank" className="text-slate-500 hover:text-[#2ecc71] transition-all uppercase text-[10px] font-bold tracking-widest">Fiverr</a>
            <a href="https://www.facebook.com/neazmorshed001/" target="_blank" className="text-slate-500 hover:text-[#2ecc71] transition-all uppercase text-[10px] font-bold tracking-widest">Facebook</a>
          </div>
          <p className="text-slate-400 text-sm font-medium">
            Designed and Developed by <span className="text-[#2ecc71] font-semibold">Neaz Morshed</span> • <span className="text-slate-600">Copyright © 2026</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
