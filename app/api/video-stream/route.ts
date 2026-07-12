import { NextRequest, NextResponse } from 'next/server';
import {
  resolveGooglePhotos,
  fetchGoogleMedia,
  GooglePhotosError,
} from '../../../lib/google-photos';

/**
 * Streams a Google Photos video through our own origin.
 *
 * Google hotlink-protects the file: it returns 403 when the request carries a
 * Referer from this site, so the browser can never load it directly no matter
 * what referrer policy we set. Proxying sidesteps that entirely — the <video>
 * element requests same-origin, and the server fetches upstream with no Referer.
 *
 * Range requests are forwarded so the video seeks and streams progressively
 * rather than buffering all 29MB up front. Each response is capped at
 * MAX_CHUNK_BYTES to stay well inside serverless response limits; the browser
 * simply asks for the next range when it needs more.
 */

// Comfortably under Vercel's 4.5MB serverless response ceiling.
const MAX_CHUNK_BYTES = 4 * 1024 * 1024;

/** Clamps the client's Range so a single response can't exceed MAX_CHUNK_BYTES. */
function clampRange(rangeHeader: string | null): string {
  const match = rangeHeader?.match(/bytes=(\d+)-(\d*)/);

  if (!match) return `bytes=0-${MAX_CHUNK_BYTES - 1}`;

  const start = parseInt(match[1], 10);
  const requestedEnd = match[2] ? parseInt(match[2], 10) : null;
  const maxEnd = start + MAX_CHUNK_BYTES - 1;

  const end =
    requestedEnd === null ? maxEnd : Math.min(requestedEnd, maxEnd);

  return `bytes=${start}-${end}`;
}

export async function GET(request: NextRequest) {
  const target = request.nextUrl.searchParams.get('url');

  if (!target) {
    return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
  }

  try {
    // resolveGooglePhotos rejects any host outside Google Photos, so this
    // cannot be turned into an open proxy for arbitrary URLs.
    const { videoUrl } = await resolveGooglePhotos(target);

    const range = clampRange(request.headers.get('range'));

    // Google's CDN intermittently 404s a range it serves fine on retry. One
    // hiccup mid-playback would kill the video, so give it a second chance.
    let upstream = await fetchGoogleMedia(videoUrl, range);
    if (!upstream.ok) {
      upstream = await fetchGoogleMedia(videoUrl, range);
    }

    if (!upstream.ok || !upstream.body) {
      return NextResponse.json(
        { error: `Upstream returned ${upstream.status}` },
        { status: 502 }
      );
    }

    const headers = new Headers({
      'Content-Type': upstream.headers.get('content-type') || 'video/mp4',
      'Accept-Ranges': 'bytes',
      // The upstream URL rotates, so let the browser reuse chunks but never
      // let a shared cache pin them for long.
      'Cache-Control': 'public, max-age=3600',
    });

    const contentRange = upstream.headers.get('content-range');
    if (contentRange) headers.set('Content-Range', contentRange);

    const contentLength = upstream.headers.get('content-length');
    if (contentLength) headers.set('Content-Length', contentLength);

    return new Response(upstream.body, {
      status: upstream.status, // 206 when ranged, 200 otherwise
      headers,
    });
  } catch (error) {
    if (error instanceof GooglePhotosError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('video-stream failed:', error);
    return NextResponse.json({ error: 'Could not stream video' }, { status: 502 });
  }
}
