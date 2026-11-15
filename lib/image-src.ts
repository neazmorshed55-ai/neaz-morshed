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

/** Can next/image resize this URL on Vercel? */
export function canOptimizeImage(src?: string | null): boolean {
  if (!src) return false;
  if (src.startsWith('/')) return true;
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
