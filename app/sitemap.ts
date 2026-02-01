import { MetadataRoute } from 'next';
import { supabase } from '../lib/supabase';

// Helper to get all blog slugs
async function getBlogSlugs() {
    if (!supabase) return [];
    const { data } = await supabase.from('blogs').select('slug, updated_at').eq('is_published', true);
    return data || [];
}

// Helper to get all service slugs (assuming services are static for now, but if dynamic, fetch here)
// For now, listing static services manually based on the Services page content
const services = [
    'web-design-development',
    'video-editing-production',
    'social-media-marketing',
    'virtual-assistant-support',
    'graphics-design-branding'
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://neazmorshed.com'; // Replace with actual domain

    // Static Routes
    const staticRoutes = [
        '',
        '/skills',
        '/services',
        '/experience',
        '/reviews',
        '/contact',
        '/blog',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // Dynamic Blog Routes
    const blogPosts = await getBlogSlugs();
    const blogRoutes = blogPosts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    // Dynamic Service Routes
    const serviceRoutes = services.map((slug) => ({
        url: `${baseUrl}/services/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.9,
    }));

    return [...staticRoutes, ...serviceRoutes, ...blogRoutes];
}
