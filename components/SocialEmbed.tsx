"use client";

import React, { useEffect, useRef, useState } from 'react';

interface SocialEmbedProps {
  url: string;
  className?: string;
}

// Platform detection
const isYouTubeUrl = (url: string) => url.includes('youtube.com') || url.includes('youtu.be');
const isTikTokUrl = (url: string) => url.includes('tiktok.com');
const isInstagramUrl = (url: string) => url.includes('instagram.com');
const isFacebookUrl = (url: string) => url.includes('facebook.com') || url.includes('fb.watch');
const isVimeoUrl = (url: string) => url.includes('vimeo.com');
const isGoogleDriveUrl = (url: string) => url.includes('drive.google.com') || url.includes('docs.google.com');

// Extract IDs
const getYouTubeVideoId = (url: string): string | null => {
  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtu\.be\/([^?]+)/,
    /youtube\.com\/shorts\/([^?]+)/,
    /youtube\.com\/embed\/([^?]+)/
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
};

const getTikTokVideoId = (url: string): string | null => {
  const match = url.match(/\/video\/(\d+)/);
  return match ? match[1] : null;
};

const getInstagramPostId = (url: string): { type: string; id: string } | null => {
  const match = url.match(/instagram\.com\/(p|reel|reels|tv)\/([^/?]+)/);
  return match ? { type: match[1], id: match[2] } : null;
};

const getVimeoVideoId = (url: string): string | null => {
  const match = url.match(/vimeo\.com\/(\d+)/);
  return match ? match[1] : null;
};

const getGoogleDriveFileId = (url: string): string | null => {
  // Supports various Google Drive URL formats
  const patterns = [
    /\/file\/d\/([^\/\?]+)/,  // drive.google.com/file/d/FILE_ID/view
    /id=([^&]+)/,             // drive.google.com/open?id=FILE_ID
    /\/d\/([^\/\?]+)/,        // docs.google.com/document/d/FILE_ID
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
};

const getGoogleDriveThumbnail = (fileId: string): string => {
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
};

// Check if content should use vertical aspect ratio
const isVerticalContent = (url: string) => {
  return isTikTokUrl(url) ||
    (isInstagramUrl(url) && (url.includes('/reel/') || url.includes('/reels/'))) ||
    url.includes('youtube.com/shorts');
};

export default function SocialEmbed({ url, className = '' }: SocialEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Trigger platform embed scripts after mount
    const timer = setTimeout(() => {
      // Instagram
      if (isInstagramUrl(url) && (window as any).instgrm) {
        (window as any).instgrm.Embeds.process();
      }
      // TikTok
      if (isTikTokUrl(url) && (window as any).tiktok) {
        // TikTok doesn't have a standard reprocess method,
        // but loading the script should handle new embeds
      }
      // Facebook
      if (isFacebookUrl(url) && (window as any).FB) {
        (window as any).FB.XFBML.parse(containerRef.current);
      }
      setIsLoaded(true);
    }, 500);

    return () => clearTimeout(timer);
  }, [url]);

  const aspectClass = isVerticalContent(url) ? 'aspect-[9/16] max-w-[400px] mx-auto' : 'aspect-video';

  // YouTube Embed
  if (isYouTubeUrl(url)) {
    const videoId = getYouTubeVideoId(url);
    if (!videoId) return null;
    return (
      <div className={`relative overflow-hidden bg-black ${aspectClass} ${className}`}>
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?rel=0`}
          className="w-full h-full"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          loading="lazy"
          title="YouTube video"
        />
      </div>
    );
  }

  // TikTok Embed
  if (isTikTokUrl(url)) {
    const videoId = getTikTokVideoId(url);
    if (!videoId) return null;
    return (
      <div ref={containerRef} className={`relative overflow-hidden bg-black ${aspectClass} ${className}`}>
        <iframe
          src={`https://www.tiktok.com/embed/v2/${videoId}?lang=en-US`}
          className="w-full h-full"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          loading="lazy"
          title="TikTok video"
          sandbox="allow-popups allow-popups-to-escape-sandbox allow-scripts allow-top-navigation allow-same-origin"
        />
      </div>
    );
  }

  // Instagram Embed
  if (isInstagramUrl(url)) {
    const postData = getInstagramPostId(url);
    if (!postData) return null;
    return (
      <div ref={containerRef} className={`relative overflow-hidden bg-black ${aspectClass} ${className}`}>
        <iframe
          src={`https://www.instagram.com/${postData.type}/${postData.id}/embed/captioned/`}
          className="w-full h-full"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          loading="lazy"
          title="Instagram post"
          sandbox="allow-popups allow-popups-to-escape-sandbox allow-scripts allow-top-navigation allow-same-origin"
        />
      </div>
    );
  }

  // Facebook Embed
  if (isFacebookUrl(url)) {
    const isVideo = url.includes('/videos/') || url.includes('/watch') || url.includes('fb.watch') || url.includes('/reel/');
    const embedType = isVideo ? 'video' : 'post';
    const embedUrl = isVideo
      ? `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false&width=560&t=0`
      : `https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(url)}&show_text=false&width=500`;

    return (
      <div ref={containerRef} className={`relative overflow-hidden bg-black ${aspectClass} ${className}`}>
        <iframe
          src={embedUrl}
          className="w-full h-full"
          allowFullScreen
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          loading="lazy"
          title={`Facebook ${embedType}`}
        />
      </div>
    );
  }

  // Vimeo Embed
  if (isVimeoUrl(url)) {
    const videoId = getVimeoVideoId(url);
    if (!videoId) return null;
    return (
      <div className={`relative overflow-hidden bg-black ${aspectClass} ${className}`}>
        <iframe
          src={`https://player.vimeo.com/video/${videoId}`}
          className="w-full h-full"
          allowFullScreen
          allow="autoplay; fullscreen; picture-in-picture"
          loading="lazy"
          title="Vimeo video"
        />
      </div>
    );
  }

  // Google Drive Embed
  if (isGoogleDriveUrl(url)) {
    const fileId = getGoogleDriveFileId(url);
    if (!fileId) return null;

    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`block group relative overflow-hidden bg-slate-900 ${aspectClass} ${className} hover:ring-2 hover:ring-[#2ecc71] transition-all cursor-pointer`}
      >
        <div className="w-full h-full">
          <img
            src={getGoogleDriveThumbnail(fileId)}
            alt="Google Drive document"
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback if thumbnail fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = `
                  <div class="w-full h-full flex items-center justify-center bg-slate-800">
                    <div class="text-center p-6">
                      <svg class="w-12 h-12 text-[#2ecc71] mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span class="text-white font-bold block mb-1">Google Drive Document</span>
                      <span class="text-slate-400 text-sm">Click to view</span>
                    </div>
                  </div>
                `;
              }
            }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-6">
          <div className="text-center">
            <svg className="w-8 h-8 text-white mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            <span className="text-white font-bold text-sm">Click to View in Google Drive</span>
          </div>
        </div>
      </a>
    );
  }

  // Unknown platform - show link
  return (
    <div className={`relative overflow-hidden bg-slate-900 ${aspectClass} ${className}`}>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full h-full flex items-center justify-center hover:bg-slate-800 transition-colors"
      >
        <div className="text-[#2ecc71] flex flex-col items-center gap-3 p-6">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          <span className="text-white font-bold">View External Link</span>
          <span className="text-slate-400 text-sm max-w-[80%] truncate">{url}</span>
        </div>
      </a>
    </div>
  );
}
