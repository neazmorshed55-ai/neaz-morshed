/**
 * Video source parsing for video reviews.
 *
 * A single pasted link is turned into one of three playback modes:
 *   - 'iframe'  : provider gives us an embeddable player (YouTube, Vimeo, Loom, Drive)
 *   - 'native'  : the URL is a video file we can hand straight to <video>
 *   - 'resolve' : the URL is a share page that hides the real file; /api/video-resolve
 *                 must fetch it server-side first (Google Photos)
 *   - 'unsupported': nothing playable — the UI falls back to "open in new tab"
 */

export type VideoProvider =
  | 'youtube'
  | 'vimeo'
  | 'loom'
  | 'drive'
  | 'googlephotos'
  | 'file'
  | 'unknown';

export type PlaybackMode = 'iframe' | 'native' | 'resolve' | 'unsupported';

export interface ParsedVideo {
  provider: VideoProvider;
  mode: PlaybackMode;
  /** iframe src (without autoplay — call withAutoplay when the user hits play) */
  embedUrl: string | null;
  /** direct file URL for <video src> */
  sourceUrl: string | null;
  /** poster image, when the provider exposes one for free */
  thumbnail: string | null;
  originalUrl: string;
}

const YOUTUBE_RE =
  /(?:youtube\.com\/(?:watch\?(?:[^#]*&)?v=|embed\/|shorts\/|live\/|v\/)|youtu\.be\/)([\w-]{11})/i;
const VIMEO_RE =
  /vimeo\.com\/(?:video\/|channels\/[\w-]+\/|groups\/[\w-]+\/videos\/)?(\d+)/i;
const LOOM_RE = /loom\.com\/(?:share|embed)\/([a-zA-Z0-9]+)/i;
const DRIVE_RE = /drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?(?:[^#]*&)?id=)([\w-]+)/i;
const GOOGLE_PHOTOS_RE =
  /^https?:\/\/(?:photos\.app\.goo\.gl\/|photos\.google\.com\/share\/)/i;
const VIDEO_FILE_RE = /\.(mp4|webm|ogv|ogg|mov|m4v)(\?.*)?$/i;

export function parseVideoUrl(rawUrl: string | null | undefined): ParsedVideo {
  const url = (rawUrl || '').trim();

  const base: ParsedVideo = {
    provider: 'unknown',
    mode: 'unsupported',
    embedUrl: null,
    sourceUrl: null,
    thumbnail: null,
    originalUrl: url,
  };

  if (!url) return base;

  const youtube = url.match(YOUTUBE_RE);
  if (youtube) {
    const id = youtube[1];
    return {
      ...base,
      provider: 'youtube',
      mode: 'iframe',
      embedUrl: `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&playsinline=1`,
      thumbnail: `https://img.youtube.com/vi/${id}/maxresdefault.jpg`,
    };
  }

  const vimeo = url.match(VIMEO_RE);
  if (vimeo) {
    return {
      ...base,
      provider: 'vimeo',
      mode: 'iframe',
      embedUrl: `https://player.vimeo.com/video/${vimeo[1]}?byline=0&portrait=0`,
    };
  }

  const loom = url.match(LOOM_RE);
  if (loom) {
    return {
      ...base,
      provider: 'loom',
      mode: 'iframe',
      embedUrl: `https://www.loom.com/embed/${loom[1]}`,
    };
  }

  const drive = url.match(DRIVE_RE);
  if (drive) {
    return {
      ...base,
      provider: 'drive',
      mode: 'iframe',
      embedUrl: `https://drive.google.com/file/d/${drive[1]}/preview`,
    };
  }

  // Google Photos blocks iframing (X-Frame-Options: SAMEORIGIN), but the share
  // page exposes the real MP4 via og:video. The API route digs it out.
  if (GOOGLE_PHOTOS_RE.test(url)) {
    return { ...base, provider: 'googlephotos', mode: 'resolve' };
  }

  if (VIDEO_FILE_RE.test(url)) {
    return { ...base, provider: 'file', mode: 'native', sourceUrl: url };
  }

  return base;
}

/** Add autoplay to an iframe src. Safe to call only from a user gesture. */
export function withAutoplay(embedUrl: string): string {
  const separator = embedUrl.includes('?') ? '&' : '?';
  return `${embedUrl}${separator}autoplay=1`;
}

/** Human label for the admin UI. */
export function providerLabel(provider: VideoProvider): string {
  switch (provider) {
    case 'youtube':
      return 'YouTube';
    case 'vimeo':
      return 'Vimeo';
    case 'loom':
      return 'Loom';
    case 'drive':
      return 'Google Drive';
    case 'googlephotos':
      return 'Google Photos';
    case 'file':
      return 'Video file';
    default:
      return 'Unrecognized link';
  }
}
