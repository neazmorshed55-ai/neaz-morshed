import { NextRequest, NextResponse } from 'next/server';
import { resolveGooglePhotos, GooglePhotosError } from '../../../lib/google-photos';

/**
 * Returns the poster image for a Google Photos share link.
 *
 * The video itself is NOT handed to the browser directly — Google 403s any
 * request carrying our Referer — so playback goes through /api/video-stream.
 * This route exists so the card can show a real thumbnail before playing, and
 * so the admin panel can verify a pasted link actually points at a video.
 */
export async function GET(request: NextRequest) {
  const target = request.nextUrl.searchParams.get('url');

  if (!target) {
    return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
  }

  try {
    const { poster } = await resolveGooglePhotos(target);

    return NextResponse.json(
      {
        poster,
        streamUrl: `/api/video-stream?url=${encodeURIComponent(target)}`,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    );
  } catch (error) {
    if (error instanceof GooglePhotosError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('video-resolve failed:', error);
    return NextResponse.json({ error: 'Could not reach Google Photos' }, { status: 502 });
  }
}
