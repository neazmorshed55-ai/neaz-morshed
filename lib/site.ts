/**
 * Public address of this deployment. Used for metadata, the sitemap and
 * robots.txt. Override with NEXT_PUBLIC_SITE_URL in Vercel if it ever moves.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://www.neazmdmorshed.com'
).replace(/\/+$/, '');
