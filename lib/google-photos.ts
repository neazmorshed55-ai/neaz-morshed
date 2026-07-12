/**
 * Server-side resolution of Google Photos share links.
 *
 * Google Photos blocks iframing (X-Frame-Options: SAMEORIGIN) AND hotlinking
 * (the MP4 returns 403 when the request carries a Referer from our origin), so
 * the browser can neither embed the page nor load the file directly. What the
 * share page does expose is the real file in its Open Graph tags:
 *
 *   og:video -> https://lh3.googleusercontent.com/pw/<id>=...-m18   (video/mp4)
 *   og:image -> the same <id> as a still, which we upscale for the poster
 *
 * So the server fetches the file and re-serves it from our own origin — see
 * /api/video-stream. The googleusercontent URL rotates, so it is never stored.
 */

export const GOOGLE_PHOTOS_HOSTS = new Set([
  'photos.app.goo.gl',
  'photos.google.com',
]);

const BROWSER_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

export interface ResolvedVideo {
  videoUrl: string;
  poster: string | null;
}

/** True if the URL is a Google Photos share link we're allowed to fetch. */
export function isGooglePhotosUrl(raw: string): boolean {
  try {
    const url = new URL(raw);
    return url.protocol === 'https:' && GOOGLE_PHOTOS_HOSTS.has(url.hostname);
  } catch {
    return false;
  }
}

/** Reads <meta property="og:x" content="..."> with either attribute order. */
function readOpenGraph(html: string, property: string): string | null {
  const escaped = property.replace(/:/g, '\\:');
  const patterns = [
    new RegExp(`<meta[^>]+property=["']${escaped}["'][^>]*content=["']([^"']+)["']`, 'i'),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]*property=["']${escaped}["']`, 'i'),
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) return match[1];
  }
  return null;
}

/**
 * Google's media URLs end in a size directive (=w600-h315-p-k-no). The share
 * page advertises a 600px still; swap it for something that holds up as a
 * full-width poster.
 */
function upscalePoster(imageUrl: string): string {
  return imageUrl.replace(/=[\w-]+$/, '=w1280-h720-no');
}

export class GooglePhotosError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

/** Scrapes a Google Photos share page for its underlying MP4 and poster. */
export async function resolveGooglePhotos(shareUrl: string): Promise<ResolvedVideo> {
  if (!isGooglePhotosUrl(shareUrl)) {
    throw new GooglePhotosError('Only Google Photos share links can be resolved', 400);
  }

  let page: Response;
  try {
    page = await fetch(shareUrl, {
      headers: { 'User-Agent': BROWSER_UA, 'Accept-Language': 'en-US,en;q=0.9' },
      redirect: 'follow',
      next: { revalidate: 3600 },
    });
  } catch {
    throw new GooglePhotosError('Could not reach Google Photos', 502);
  }

  if (!page.ok) {
    throw new GooglePhotosError(`Google Photos returned ${page.status}`, 502);
  }

  const html = await page.text();
  const videoUrl = readOpenGraph(html, 'og:video');
  const imageUrl = readOpenGraph(html, 'og:image');

  if (!videoUrl) {
    throw new GooglePhotosError(
      'No video found at that link. Make sure the item is a video and the share link is public ("Anyone with the link").',
      404
    );
  }

  return { videoUrl, poster: imageUrl ? upscalePoster(imageUrl) : null };
}

/**
 * Fetches the underlying file. Sends no Referer — that is the whole point: the
 * same URL returns 200 with no Referer and 403 with one from our origin.
 */
export function fetchGoogleMedia(videoUrl: string, range: string | null) {
  const headers: Record<string, string> = { 'User-Agent': BROWSER_UA };
  if (range) headers.Range = range;

  return fetch(videoUrl, { headers, redirect: 'follow', cache: 'no-store' });
}
