import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

/**
 * Resizer for pictures that Vercel's own image optimiser cannot handle,
 * mainly full-page website screenshots taller than 8,192 px (some are
 * 1920 x 22,000 px, 40+ MB). Phones must never download or decode those.
 *
 * /api/img?u=<supabase public url>&w=828&q=70[&crop=1]
 * The result is cached for a year by the CDN, so each size is made once.
 */
export const runtime = 'nodejs';
export const maxDuration = 60;

const WIDTHS = [32, 64, 128, 256, 384, 640, 828, 1080, 1280];
const WEBP_MAX_SIDE = 16000;

function allowed(url: URL): boolean {
  if (!url.pathname.startsWith('/storage/v1/object/public/')) return false;
  if (url.protocol === 'https:' && url.hostname.endsWith('.supabase.co')) return true;
  // This project's own Supabase address (also covers local development).
  const own = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return !!own && url.origin === new URL(own).origin;
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  let source: URL;
  try {
    source = new URL(params.get('u') || '');
  } catch {
    return new NextResponse('Bad url', { status: 400 });
  }
  if (!allowed(source)) return new NextResponse('Not allowed', { status: 400 });

  const asked = Number(params.get('w')) || 828;
  const width = WIDTHS.find((w) => w >= asked) ?? WIDTHS[WIDTHS.length - 1];
  const quality = Math.min(85, Math.max(40, Number(params.get('q')) || 70));
  const crop = params.get('crop') === '1';

  try {
    const upstream = await fetch(source.toString(), { signal: AbortSignal.timeout(30000) });
    if (!upstream.ok) return new NextResponse('Not found', { status: upstream.status === 404 ? 404 : 502 });
    const input = Buffer.from(await upstream.arrayBuffer());

    // Animated GIF/WebP and SVG are passed through untouched.
    const type = upstream.headers.get('content-type') || '';
    if (/svg|gif/.test(type)) {
      return new NextResponse(input, { headers: { 'Content-Type': type, 'Cache-Control': 'public, max-age=31536000, immutable' } });
    }

    const base = sharp(input, { limitInputPixels: false, sequentialRead: true, failOn: 'none' }).rotate();
    const meta = await sharp(input, { limitInputPixels: false, failOn: 'none' }).metadata();
    const srcW = meta.width || width;
    const srcH = meta.height || width;
    const outW = Math.min(width, srcW);
    const outH = Math.round((srcH * outW) / srcW);

    let pipeline = base.resize({ width: outW, height: Math.min(outH, WEBP_MAX_SIDE), fit: 'inside', withoutEnlargement: true });
    // Card covers only ever show the top of a tall screenshot, so send just that part.
    if (crop && outH > outW * 1.3) {
      pipeline = sharp(await pipeline.png({ compressionLevel: 0 }).toBuffer()).extract({
        left: 0,
        top: 0,
        width: outW,
        height: Math.min(outH, Math.round(outW * 0.8)),
      });
    }
    const output = await pipeline.webp({ quality, effort: 3 }).toBuffer();

    return new NextResponse(new Uint8Array(output), {
      headers: {
        'Content-Type': 'image/webp',
        'Cache-Control': 'public, max-age=31536000, s-maxage=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('img resize failed:', source.pathname, (error as Error).message);
    return new NextResponse('Could not process image', { status: 502 });
  }
}
