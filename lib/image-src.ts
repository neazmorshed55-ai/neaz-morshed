/**
 * Helpers for deciding how a stored image URL can be rendered.
 *
 * next/image only optimises hosts listed in next.config.js. Anything else
 * must be rendered with `unoptimized`, otherwise Vercel answers 400 and the
 * picture silently never appears. Share-page links (Google Photos albums,
 * Drive "view" pages, Facebook posts) are web pages, not images, and can
 * never be shown in an <img>.
 */

const OPTIMIZABLE_HOSTS: RegExp[] = [
  /\.supabase\.co$/,
  /^images\.unsplash\.com$/,
  /^flagcdn\.com$/,
  /^img\.youtube\.com$/,
  /^lh3\.googleusercontent\.com$/,
];

const PAGE_LINK_HOSTS: RegExp[] = [
  /^photos\.app\.goo\.gl$/,
  /^photos\.google\.com$/,
  /^(www\.)?facebook\.com$/,
  /^fb\.watch$/,
  /^(www\.)?instagram\.com$/,
  /^(www\.)?tiktok\.com$/,
  /^(www\.)?youtube\.com$/,
  /^youtu\.be$/,
  /^docs\.google\.com$/,
  /^(www\.)?canva\.com$/,
];

function host(src: string): string | null {
  try {
    return new URL(src).hostname.toLowerCase();
  } catch {
    return null;
  }
}

/** Vercel only resizes source images up to 8,192 px on each side. */
export const MAX_OPTIMIZABLE_SIDE = 8192;

/** Optimised uploads carry their pixel size in the name: "name-1440x9000.webp". */
const SIZE_IN_NAME = /-(\d{2,5})x(\d{2,5})\.(?:webp|jpe?g|png|avif)(?=$|[?#])/i;

/** Pixel size encoded in the file name, when there is one. */
export function imageSizeFromUrl(src?: string | null): { width: number; height: number } | null {
  if (!src) return null;
  const m = src.match(SIZE_IN_NAME);
  if (!m) return null;
  const width = Number(m[1]);
  const height = Number(m[2]);
  return width > 0 && height > 0 ? { width, height } : null;
}

/** Can next/image resize this URL on Vercel? */
export function canOptimizeImage(src?: string | null): boolean {
  if (!src) return false;
  if (src.startsWith('/')) return true;
  const size = imageSizeFromUrl(src);
  if (size && Math.max(size.width, size.height) > MAX_OPTIMIZABLE_SIDE) return false;
  const h = host(src);
  if (!h || !src.startsWith('https://')) return false;
  if (h.endsWith('.supabase.co') && !src.includes('/storage/')) return false;
  return OPTIMIZABLE_HOSTS.some((re) => re.test(h));
}

/** Is this URL plausibly a direct image file (not a share/post page)? */
export function isDirectImageUrl(src?: string | null): boolean {
  if (!src) return false;
  if (src.startsWith('/') || src.startsWith('data:image/')) return true;
  const h = host(src);
  if (!h) return false;
  if (h === 'drive.google.com') return src.includes('/thumbnail') || src.includes('uc?');
  return !PAGE_LINK_HOSTS.some((re) => re.test(h));
}
