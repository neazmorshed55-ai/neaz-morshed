"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Star, Loader2, ExternalLink, Video } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { parseVideoUrl, withAutoplay, type ParsedVideo } from '../lib/video-embed';

export interface VideoReview {
  id: string | number;
  client_name: string;
  client_title?: string | null;
  client_company?: string | null;
  country_code?: string | null;
  country_name?: string | null;
  city?: string | null;
  video_url: string;
  thumbnail_url?: string | null;
  headline?: string | null;
  captions_vtt?: string | null;
  rating?: number | null;
  order_index?: number | null;
}

const getFlagUrl = (countryCode: string) =>
  `https://flagcdn.com/24x18/${countryCode.toLowerCase()}.png`;

const IFRAME_PERMISSIONS =
  'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen';

function VideoReviewCard({ review, index }: { review: VideoReview; index: number }) {
  const [parsed] = useState<ParsedVideo>(() => parseVideoUrl(review.video_url));
  const [isPlaying, setIsPlaying] = useState(false);
  const [resolved, setResolved] = useState<{ streamUrl: string; poster: string | null } | null>(null);
  const [resolveError, setResolveError] = useState<string | null>(null);
  const [playbackFailed, setPlaybackFailed] = useState(false);
  const [captionUrl, setCaptionUrl] = useState<string | null>(null);

  // A <track> needs a URL, not raw text. Serving the stored VTT as a blob keeps
  // it same-origin, so the browser will actually load it (a cross-origin track
  // would need CORS and a crossOrigin video, which our proxy doesn't need).
  useEffect(() => {
    if (!review.captions_vtt) return;

    const url = URL.createObjectURL(
      new Blob([review.captions_vtt], { type: 'text/vtt' })
    );
    setCaptionUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [review.captions_vtt]);

  // Share-page links (Google Photos) hide the real file — ask the server for it.
  useEffect(() => {
    if (parsed.mode !== 'resolve') return;

    let cancelled = false;
    fetch(`/api/video-resolve?url=${encodeURIComponent(parsed.originalUrl)}`)
      .then(async (response) => {
        const body = await response.json();
        if (!response.ok) throw new Error(body.error || 'Could not load this video');
        return body;
      })
      .then((data) => {
        if (!cancelled) setResolved(data);
      })
      .catch((error: Error) => {
        if (!cancelled) setResolveError(error.message);
      });

    return () => {
      cancelled = true;
    };
  }, [parsed.mode, parsed.originalUrl]);

  const poster = review.thumbnail_url || parsed.thumbnail || resolved?.poster || null;
  // Google Photos files are served through our own origin — see /api/video-stream.
  const nativeSource = parsed.sourceUrl || resolved?.streamUrl || null;

  const isResolving = parsed.mode === 'resolve' && !resolved && !resolveError;
  const linkOnly =
    parsed.mode === 'unsupported' ||
    (parsed.mode === 'resolve' && !!resolveError) ||
    playbackFailed;
  const canPlayInline = !linkOnly && !isResolving;

  const location = [review.city, review.country_name].filter(Boolean).join(', ');

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-slate-900/60 border border-white/5 rounded-[2rem] overflow-hidden hover:border-[#2ecc71]/30 transition-all group"
    >
      {/* Player */}
      <div className="relative aspect-video bg-slate-950">
        {isPlaying && !playbackFailed && parsed.mode === 'iframe' && parsed.embedUrl ? (
          <iframe
            src={withAutoplay(parsed.embedUrl)}
            title={`Video review by ${review.client_name}`}
            allow={IFRAME_PERMISSIONS}
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        ) : isPlaying && !playbackFailed && nativeSource ? (
          <video
            src={nativeSource}
            poster={poster || undefined}
            controls
            autoPlay
            playsInline
            preload="metadata"
            controlsList="nodownload"
            // Never strand a visitor on a dead player — fall back to the link.
            onError={() => {
              setPlaybackFailed(true);
              setIsPlaying(false);
            }}
            className="absolute inset-0 w-full h-full bg-black"
          >
            {captionUrl && (
              // `default` shows captions on load; the player's CC button lets
              // the viewer turn them back off.
              <track
                kind="captions"
                src={captionUrl}
                srcLang="en"
                label="English"
                default
              />
            )}
          </video>
        ) : (
          <>
            {poster ? (
              <img
                src={poster}
                alt={`${review.client_name} video review thumbnail`}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-950">
                <Video className="w-12 h-12 text-slate-700" />
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

            {/* Play / fallback control */}
            <div className="absolute inset-0 flex items-center justify-center">
              {canPlayInline ? (
                <button
                  type="button"
                  onClick={() => setIsPlaying(true)}
                  aria-label={`Play video review by ${review.client_name}`}
                  className="flex items-center justify-center w-20 h-20 rounded-full bg-[#2ecc71] text-slate-950 shadow-2xl shadow-[#2ecc71]/30 hover:scale-110 active:scale-95 transition-transform"
                >
                  <Play className="w-8 h-8 ml-1 fill-slate-950" />
                </button>
              ) : isResolving ? (
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-slate-900/80 border border-white/10">
                  <Loader2 className="w-8 h-8 text-[#2ecc71] animate-spin" />
                </div>
              ) : (
                <a
                  href={review.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-[#2ecc71] text-slate-950 font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform"
                >
                  Watch Video
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>

            {review.headline && (
              <p className="absolute bottom-4 left-5 right-5 text-white font-bold text-sm drop-shadow-lg line-clamp-2">
                {review.headline}
              </p>
            )}
          </>
        )}
      </div>

      {/* Client details */}
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-black text-white text-lg">{review.client_name}</h3>

            {location && (
              <div className="flex items-center gap-1.5 mt-1.5">
                {review.country_code && (
                  <img
                    src={getFlagUrl(review.country_code)}
                    alt={review.country_name || ''}
                    className="w-5 h-auto rounded-sm"
                    loading="lazy"
                  />
                )}
                <span className="text-[11px] text-slate-400">{location}</span>
              </div>
            )}

            {(review.client_title || review.client_company) && (
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-2">
                {[review.client_title, review.client_company].filter(Boolean).join(' • ')}
              </p>
            )}
          </div>

          <div className="flex gap-0.5 flex-shrink-0">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < (review.rating ?? 5)
                    ? 'text-[#2ecc71] fill-[#2ecc71]'
                    : 'text-slate-700'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function VideoReviews() {
  const [videoReviews, setVideoReviews] = useState<VideoReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideoReviews = async () => {
      if (!supabase) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('video_reviews')
          .select(
            'id, client_name, client_title, client_company, country_code, country_name, city, video_url, thumbnail_url, headline, captions_vtt, rating, order_index'
          )
          .eq('is_active', true)
          .order('order_index', { ascending: true });

        if (error) throw error;
        setVideoReviews(data || []);
      } catch (error) {
        console.log('No video reviews available yet');
      }
      setLoading(false);
    };

    fetchVideoReviews();
  }, []);

  // Nothing to show and nothing to say — stay out of the page entirely.
  if (loading || videoReviews.length === 0) return null;

  return (
    <section className="container mx-auto px-6 max-w-7xl mb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <span className="text-[#2ecc71] text-[11px] font-black uppercase tracking-[0.5em] mb-4 block">
          In Their Own Words
        </span>
        <h2 className="text-3xl lg:text-5xl font-black uppercase tracking-tighter">
          Video <span className="text-gradient">Testimonials</span>
        </h2>
      </motion.div>

      <div
        className={
          videoReviews.length === 1
            ? 'max-w-3xl mx-auto'
            : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
        }
      >
        {videoReviews.map((review, index) => (
          <VideoReviewCard key={review.id} review={review} index={index} />
        ))}
      </div>
    </section>
  );
}
