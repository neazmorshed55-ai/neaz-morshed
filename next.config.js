/** @type {import('next').NextConfig} */
const nextConfig = {
  // SEO: Remove trailing slashes for canonical URLs (site.com/blog not site.com/blog/)
  trailingSlash: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/**',
      },
      {
        protocol: 'https',
        hostname: 'flagcdn.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'scontent-*.fbcdn.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'scontent-*.cdninstagram.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.instagram.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'scontent.cdninstagram.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lookaside.facebook.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'graph.facebook.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.tiktokcdn.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
    ],
    // Enable modern image formats
    formats: ['image/avif', 'image/webp'],
    // Fewer size buckets = fewer distinct variants to generate and cache.
    deviceSizes: [640, 828, 1080, 1280, 1920],
    imageSizes: [32, 64, 128, 256, 384],
    // Keep optimised images cached for 31 days. Supabase serves originals with
    // max-age=3600, so without this every image was re-processed each hour,
    // which is slow for visitors and burns through Vercel's image quota
    // (once the quota runs out, images stop loading).
    minimumCacheTTL: 2678400,
  },
};

module.exports = nextConfig;
