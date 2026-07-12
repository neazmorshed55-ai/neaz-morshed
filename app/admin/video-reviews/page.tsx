"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Plus, Edit2, Trash2, Search, Loader2, X,
  ArrowLeft, Save, Star, Upload, Video, Play,
  CheckCircle, AlertCircle, Eye, EyeOff, ExternalLink
} from 'lucide-react';
import ProtectedRoute from '../../../components/admin/ProtectedRoute';
import { supabase } from '../../../lib/supabase';
import { countries } from '../../../lib/countries';
import { getFlagEmoji } from '../../../lib/flag-emoji';
import { parseVideoUrl, providerLabel } from '../../../lib/video-embed';
import { parseCaptions, countCues } from '../../../lib/captions';

interface VideoReview {
  id: string;
  client_name: string;
  client_title: string | null;
  client_company: string | null;
  country_code: string | null;
  country_name: string | null;
  city: string | null;
  video_url: string;
  thumbnail_url: string | null;
  headline: string | null;
  captions_vtt: string | null;
  rating: number;
  is_active: boolean;
  order_index: number;
}

const emptyForm = {
  client_name: '',
  client_title: '',
  client_company: '',
  country_code: '',
  country_name: '',
  city: '',
  video_url: '',
  thumbnail_url: '',
  headline: '',
  captions_input: '',
  rating: 5,
  is_active: true,
  order_index: 0,
};

/**
 * Live feedback on pasted captions. The trap here is a transcript with no
 * timestamps (a plain TurboScribe/Word export) — it looks fine but can never
 * become captions, so say so rather than silently dropping it on save.
 */
function CaptionStatus({ input }: { input: string }) {
  if (!input.trim()) {
    return (
      <p className="text-slate-600 text-xs mt-2">
        Optional. Paste an SRT or VTT file — the timestamps are what matter. Viewers get a
        CC button and can switch captions off.
      </p>
    );
  }

  const vtt = parseCaptions(input);

  if (!vtt) {
    return (
      <div className="flex items-start gap-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl mt-2">
        <AlertCircle size={18} className="text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="text-amber-300 text-xs">
          No timestamps found, so this can't be used as captions — it'll be ignored on save.
          A plain transcript isn't enough; captions need cue times like{' '}
          <span className="font-mono">00:00:03,127 --&gt; 00:00:08,788</span>. Export an SRT or
          VTT from your transcription tool.
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 p-3 bg-[#2ecc71]/10 border border-[#2ecc71]/30 rounded-xl mt-2">
      <CheckCircle size={16} className="text-[#2ecc71] flex-shrink-0" />
      <p className="text-[#2ecc71] text-xs font-bold">
        {countCues(vtt)} caption cues parsed
        <span className="text-slate-400 font-normal"> — saved as WebVTT.</span>
      </p>
    </div>
  );
}

/** Live feedback on a pasted link: what it is, and whether it will play on the page. */
function LinkStatus({ url }: { url: string }) {
  const parsed = parseVideoUrl(url);
  const [resolving, setResolving] = useState(false);
  const [resolveError, setResolveError] = useState<string | null>(null);
  const [poster, setPoster] = useState<string | null>(null);

  // Share-page links are only playable if the server can dig out the real file.
  // Check now so a broken link never reaches the live site.
  useEffect(() => {
    setResolveError(null);
    setPoster(null);

    if (parsed.mode !== 'resolve') return;

    let cancelled = false;
    setResolving(true);

    fetch(`/api/video-resolve?url=${encodeURIComponent(parsed.originalUrl)}`)
      .then(async (response) => {
        const body = await response.json();
        if (!response.ok) throw new Error(body.error || 'Could not read this link');
        return body;
      })
      .then((data) => {
        if (!cancelled) setPoster(data.poster);
      })
      .catch((error: Error) => {
        if (!cancelled) setResolveError(error.message);
      })
      .finally(() => {
        if (!cancelled) setResolving(false);
      });

    return () => {
      cancelled = true;
    };
  }, [parsed.mode, parsed.originalUrl]);

  if (!url.trim()) {
    return (
      <p className="text-slate-600 text-xs mt-2">
        Paste a YouTube, Vimeo, Loom, Google Drive, Google Photos, or direct .mp4 link.
      </p>
    );
  }

  if (parsed.mode === 'unsupported') {
    return (
      <div className="flex items-start gap-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl mt-2">
        <AlertCircle size={18} className="text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="text-amber-300 text-xs">
          This link can't be played on the page — visitors will get a "Watch Video" button that
          opens it in a new tab instead. For inline playback, use YouTube, Vimeo, Loom, Google
          Drive, Google Photos, or a direct .mp4 URL.
        </p>
      </div>
    );
  }

  if (resolving) {
    return (
      <div className="flex items-center gap-3 p-3 bg-slate-800/50 border border-white/10 rounded-xl mt-2">
        <Loader2 size={18} className="text-[#2ecc71] animate-spin flex-shrink-0" />
        <p className="text-slate-400 text-xs">Checking the link…</p>
      </div>
    );
  }

  if (resolveError) {
    return (
      <div className="flex items-start gap-3 p-3 bg-red-500/10 border border-red-500/30 rounded-xl mt-2">
        <AlertCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
        <p className="text-red-300 text-xs">{resolveError}</p>
      </div>
    );
  }

  const previewPoster = poster || parsed.thumbnail;

  return (
    <div className="flex items-center gap-3 p-3 bg-[#2ecc71]/10 border border-[#2ecc71]/30 rounded-xl mt-2">
      {previewPoster ? (
        <img
          src={previewPoster}
          alt="Video thumbnail"
          className="w-20 h-12 object-cover rounded-lg flex-shrink-0"
        />
      ) : (
        <div className="w-20 h-12 bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0">
          <Play size={16} className="text-[#2ecc71]" />
        </div>
      )}
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <CheckCircle size={14} className="text-[#2ecc71] flex-shrink-0" />
          <span className="text-[#2ecc71] text-xs font-bold">
            {providerLabel(parsed.provider)} detected
          </span>
        </div>
        <p className="text-slate-400 text-xs mt-0.5">Plays inline on the reviews page.</p>
      </div>
    </div>
  );
}

export default function VideoReviewsManagement() {
  const [videoReviews, setVideoReviews] = useState<VideoReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<VideoReview | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    fetchVideoReviews();
  }, []);

  async function fetchVideoReviews() {
    if (!supabase) {
      setVideoReviews([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('video_reviews')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setVideoReviews(data || []);
    } catch (error) {
      console.error('Error fetching video reviews:', error);
    }
    setLoading(false);
  }

  const filtered = videoReviews.filter((review) =>
    [review.client_name, review.client_company, review.headline]
      .filter(Boolean)
      .some((field) => field!.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleOpenModal = (review?: VideoReview) => {
    if (review) {
      setEditing(review);
      setFormData({
        client_name: review.client_name,
        client_title: review.client_title || '',
        client_company: review.client_company || '',
        country_code: review.country_code || '',
        country_name: review.country_name || '',
        city: review.city || '',
        video_url: review.video_url,
        thumbnail_url: review.thumbnail_url || '',
        headline: review.headline || '',
        captions_input: review.captions_vtt || '',
        rating: review.rating,
        is_active: review.is_active,
        order_index: review.order_index,
      });
    } else {
      setEditing(null);
      setFormData({ ...emptyForm, order_index: videoReviews.length + 1 });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditing(null);
  };

  const handleSave = async () => {
    if (!formData.client_name || !formData.video_url) return;
    setSaving(true);

    const { captions_input, ...fields } = formData;

    const payload = {
      ...fields,
      video_url: formData.video_url.trim(),
      client_title: formData.client_title || null,
      client_company: formData.client_company || null,
      country_code: formData.country_code || null,
      country_name: formData.country_name || null,
      city: formData.city || null,
      thumbnail_url: formData.thumbnail_url || null,
      headline: formData.headline || null,
      // Accepts SRT or VTT; returns null if the text carries no cue timings.
      captions_vtt: parseCaptions(captions_input),
    };

    if (!supabase) {
      alert('Supabase is not configured.');
      setSaving(false);
      return;
    }

    try {
      if (editing) {
        const { error } = await supabase
          .from('video_reviews')
          .update(payload)
          .eq('id', editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('video_reviews').insert(payload);
        if (error) throw error;
      }
      await fetchVideoReviews();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving video review:', error);
      alert('Error saving video review. Please try again.');
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!supabase) return;

    try {
      const { error } = await supabase.from('video_reviews').delete().eq('id', id);
      if (error) throw error;
      await fetchVideoReviews();
    } catch (error) {
      console.error('Error deleting video review:', error);
    }
    setDeleteConfirm(null);
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !supabase) return;

    setUploadingThumb(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `video-reviews/thumb-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('images').getPublicUrl(filePath);
      setFormData({ ...formData, thumbnail_url: data.publicUrl });
    } catch (error) {
      console.error('Error uploading thumbnail:', error);
      alert('Error uploading thumbnail. Please try again.');
    }
    setUploadingThumb(false);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link href="/admin" className="text-slate-500 hover:text-white transition-colors">
                <ArrowLeft size={20} />
              </Link>
              <h1 className="text-3xl font-black text-white uppercase tracking-tight">
                Video Reviews
              </h1>
            </div>
            <p className="text-slate-400">
              Paste a video link and it plays right on the reviews page
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-[#2ecc71] text-slate-950 px-6 py-3 rounded-xl font-bold text-sm hover:scale-105 active:scale-95 transition-all self-start"
          >
            <Plus size={18} />
            Add Video Review
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
          <input
            type="text"
            placeholder="Search video reviews..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/60 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-[#2ecc71]/50 transition-all"
          />
        </div>

        {/* List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#2ecc71] animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Video className="w-16 h-16 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500">No video reviews yet</p>
            <p className="text-slate-600 text-sm mt-1">
              Add your first one — just paste the video link
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filtered.map((review, index) => {
              const parsed = parseVideoUrl(review.video_url);

              return (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-slate-900/60 border border-white/5 rounded-xl p-5 hover:border-white/20 transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      {/* Thumbnail */}
                      <div className="w-28 h-16 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {review.thumbnail_url || parsed.thumbnail ? (
                          <img
                            src={review.thumbnail_url || parsed.thumbnail || ''}
                            alt={review.client_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Play size={20} className="text-slate-600" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-white font-bold">{review.client_name}</h3>
                          {!review.is_active && (
                            <span className="px-2 py-0.5 bg-slate-700 text-slate-400 text-[10px] font-bold rounded-full uppercase">
                              Hidden
                            </span>
                          )}
                          <span className="px-2 py-0.5 bg-[#2ecc71]/10 text-[#2ecc71] text-[10px] font-bold rounded-full uppercase">
                            {providerLabel(parsed.provider)}
                          </span>
                          {review.captions_vtt && (
                            <span className="px-2 py-0.5 bg-sky-500/10 text-sky-400 text-[10px] font-bold rounded-full uppercase">
                              CC
                            </span>
                          )}
                        </div>

                        {review.country_code && (
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-base leading-none">
                              {getFlagEmoji(review.country_code)}
                            </span>
                            <span className="text-slate-400 text-xs">
                              {review.city ? `${review.city}, ` : ''}
                              {review.country_name}
                            </span>
                          </div>
                        )}

                        {(review.client_title || review.client_company) && (
                          <p className="text-slate-500 text-sm mt-1">
                            {[review.client_title, review.client_company]
                              .filter(Boolean)
                              .join(' at ')}
                          </p>
                        )}

                        <div className="flex items-center gap-2 mt-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={13}
                              className={
                                i < review.rating
                                  ? 'text-yellow-500 fill-yellow-500'
                                  : 'text-slate-600'
                              }
                            />
                          ))}
                        </div>

                        <a
                          href={review.video_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-slate-500 hover:text-[#2ecc71] text-xs mt-2 transition-colors truncate max-w-full"
                        >
                          <ExternalLink size={12} className="flex-shrink-0" />
                          <span className="truncate">{review.video_url}</span>
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleOpenModal(review)}
                        className="p-2 text-slate-500 hover:text-[#2ecc71] hover:bg-[#2ecc71]/10 rounded-lg transition-all"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(review.id)}
                        className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Add / Edit Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={handleCloseModal}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">
                    {editing ? 'Edit Video Review' : 'Add Video Review'}
                  </h2>
                  <button
                    onClick={handleCloseModal}
                    className="p-2 text-slate-500 hover:text-white rounded-lg"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="p-6 space-y-5">
                  {/* Video link */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                      Video Link *
                    </label>
                    <input
                      type="url"
                      value={formData.video_url}
                      onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                      className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#2ecc71]/50"
                      placeholder="https://youtu.be/... or https://photos.app.goo.gl/..."
                    />
                    <LinkStatus url={formData.video_url} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                        Client Name *
                      </label>
                      <input
                        type="text"
                        value={formData.client_name}
                        onChange={(e) =>
                          setFormData({ ...formData, client_name: e.target.value })
                        }
                        className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#2ecc71]/50"
                        placeholder="e.g., David Raff"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                        Title
                      </label>
                      <input
                        type="text"
                        value={formData.client_title}
                        onChange={(e) =>
                          setFormData({ ...formData, client_title: e.target.value })
                        }
                        className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#2ecc71]/50"
                        placeholder="e.g., Founder"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                        Company
                      </label>
                      <input
                        type="text"
                        value={formData.client_company}
                        onChange={(e) =>
                          setFormData({ ...formData, client_company: e.target.value })
                        }
                        className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#2ecc71]/50"
                        placeholder="e.g., Savor Our City"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                        Country
                      </label>
                      <select
                        value={formData.country_code}
                        onChange={(e) => {
                          const selected = countries.find((c) => c.code === e.target.value);
                          setFormData({
                            ...formData,
                            country_code: e.target.value,
                            country_name: selected?.name || '',
                          });
                        }}
                        className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#2ecc71]/50"
                      >
                        {countries.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.code ? `${getFlagEmoji(c.code)} ${c.name}` : c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                        City / State
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#2ecc71]/50"
                        placeholder="e.g., Florida"
                      />
                    </div>
                  </div>

                  {/* Headline */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                      Headline
                    </label>
                    <input
                      type="text"
                      value={formData.headline}
                      onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                      className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#2ecc71]/50"
                      placeholder='e.g., "Neaz transformed how we run our operations"'
                    />
                    <p className="text-slate-600 text-xs mt-2">
                      Optional. Shown over the thumbnail before the video plays.
                    </p>
                  </div>

                  {/* Captions */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                      Captions (SRT or VTT)
                    </label>
                    <textarea
                      value={formData.captions_input}
                      onChange={(e) =>
                        setFormData({ ...formData, captions_input: e.target.value })
                      }
                      rows={5}
                      spellCheck={false}
                      className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3 px-4 text-white text-xs font-mono focus:outline-none focus:border-[#2ecc71]/50 resize-y"
                      placeholder={'1\n00:00:03,127 --> 00:00:08,788\nHi, my name is David Raff...'}
                    />
                    <CaptionStatus input={formData.captions_input} />
                  </div>

                  {/* Custom thumbnail */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                      Custom Thumbnail
                    </label>
                    <div className="flex items-center gap-4">
                      {formData.thumbnail_url ? (
                        <div className="relative">
                          <img
                            src={formData.thumbnail_url}
                            alt="Thumbnail"
                            className="w-28 h-16 rounded-lg object-cover border-2 border-[#2ecc71]/30"
                          />
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, thumbnail_url: '' })}
                            className="absolute -top-1 -right-1 p-1 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ) : (
                        <div className="w-28 h-16 rounded-lg bg-slate-800/50 border-2 border-dashed border-white/20 flex items-center justify-center flex-shrink-0">
                          <Video size={24} className="text-slate-600" />
                        </div>
                      )}
                      <div className="flex-1">
                        <label className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-white/10 rounded-xl cursor-pointer hover:bg-slate-800 hover:border-[#2ecc71]/30 transition-all">
                          {uploadingThumb ? (
                            <Loader2 size={18} className="text-[#2ecc71] animate-spin" />
                          ) : (
                            <Upload size={18} className="text-[#2ecc71]" />
                          )}
                          <span className="text-slate-400 text-sm">
                            {uploadingThumb ? 'Uploading...' : 'Upload Thumbnail'}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleThumbnailUpload}
                            className="hidden"
                            disabled={uploadingThumb}
                          />
                        </label>
                        <p className="text-slate-600 text-xs mt-2">
                          Optional — the video's own thumbnail is used by default.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                      Rating
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setFormData({ ...formData, rating: r })}
                          className="p-2"
                        >
                          <Star
                            size={24}
                            className={
                              r <= formData.rating
                                ? 'text-yellow-500 fill-yellow-500'
                                : 'text-slate-600'
                            }
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Order + visibility */}
                  <div className="grid grid-cols-2 gap-4 items-end">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                        Order
                      </label>
                      <input
                        type="number"
                        value={formData.order_index}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            order_index: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#2ecc71]/50"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                      className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm border transition-all ${
                        formData.is_active
                          ? 'bg-[#2ecc71]/10 border-[#2ecc71]/30 text-[#2ecc71]'
                          : 'bg-slate-800/50 border-white/10 text-slate-500'
                      }`}
                    >
                      {formData.is_active ? <Eye size={18} /> : <EyeOff size={18} />}
                      {formData.is_active ? 'Visible' : 'Hidden'}
                    </button>
                  </div>
                </div>

                <div className="p-6 border-t border-white/10 flex gap-3">
                  <button
                    onClick={handleCloseModal}
                    className="flex-1 py-3 border border-white/10 text-white rounded-xl font-medium hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving || !formData.client_name || !formData.video_url}
                    className="flex-1 py-3 bg-[#2ecc71] text-slate-950 rounded-xl font-bold disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {saving ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Save size={18} /> Save
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete confirm */}
        <AnimatePresence>
          {deleteConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setDeleteConfirm(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-sm p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-bold text-white mb-2">Delete Video Review?</h3>
                <p className="text-slate-400 mb-6">This action cannot be undone.</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="flex-1 py-3 border border-white/10 text-white rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(deleteConfirm)}
                    className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ProtectedRoute>
  );
}
