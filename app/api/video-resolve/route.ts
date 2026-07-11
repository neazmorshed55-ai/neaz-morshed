import { NextRequest, NextResponse } from 'next/server';

/**
 * Resolves a Google Photos share link into a directly playable MP4.
 *
 * Google Photos sends X-Frame-Options: SAMEORIGIN, so the share page cannot be
 * iframed. It does, however, publish the real file in its Open Graph tags:
 *   og:video -> https://lh3.googleusercontent.com/pw/<id>=...-m18   (video/mp4, range-seekable)
 *   og:image -> the same <id> as a still, which we upscale for the poster
 *
 * We fetch and scrape it here rather than in the browser because the share page
 * has no CORS headers. Results are cached at the edge — the underlying
 * googleusercontent URL can rotate, so we never persist it in the database.
 */

// Only these hosts are fetchable. Without this the route is an open SSRF proxy.
const ALLOWED_HOSTS = new Set(['photos.app.goo.gl', 'photos.google.com']);

const BROWSER_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

/** Reads <meta property="og:x" content="..."> with either attribute order. */
function readOpenGraph(html: string, property: string): string | null {
  const escaped = property.replace(/:/g, '\\:');
  const patterns = [
    new RegExp(
      `<meta[^>]+property=["']${escaped}["'][^>]*content=["']([^"']+)["']`,
      'i'
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']+)["'][^>]*property=["']${escaped}["']`,
      'i'
    ),
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) return match[1];
  }
  return null;
}

/**
 * Google's image URLs end in a size directive (=w600-h315-p-k-no). The share
 * page advertises a 600px still; swap it for something that holds up as a
 * full-width poster.
 */
function upscalePoster(imageUrl: string): string {
  return imageUrl.replace(/=[\w-]+$/, '=w1280-h720-no');
}

export async function GET(request: NextRequest) {
  const target = request.nextUrl.searchParams.get('url');

  if (!target) {
    return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(target);
  } catch {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }

  if (parsed.protocol !== 'https:' || !ALLOWED_HOSTS.has(parsed.hostname)) {
    return NextResponse.json(
      { error: 'Only Google Photos share links can be resolved' },
      { status: 400 }
    );
  }

  try {
    const page = await fetch(parsed.toString(), {
      headers: { 'User-Agent': BROWSER_UA, 'Accept-Language': 'en-US,en;q=0.9' },
      redirect: 'follow',
      next: { revalidate: 3600 },
    });

    if (!page.ok) {
      return NextResponse.json(
        { error: `Google Photos returned ${page.status}` },
        { status: 502 }
      );
    }

    const html = await page.text();
    const videoUrl = readOpenGraph(html, 'og:video');
    const imageUrl = readOpenGraph(html, 'og:image');

    if (!videoUrl) {
      return NextResponse.json(
        {
          error:
            'No video found at that link. Make sure the item is a video and the share link is public ("Anyone with the link").',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        videoUrl,
        poster: imageUrl ? upscalePoster(imageUrl) : null,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    );
  } catch (error) {
    console.error('video-resolve failed:', error);
    return NextResponse.json(
      { error: 'Could not reach Google Photos' },
      { status: 502 }
    );
  }
}
