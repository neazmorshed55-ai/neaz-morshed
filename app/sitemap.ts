import { MetadataRoute } from 'next';
import { supabase } from '../lib/supabase';

// Your actual domain
const BASE_URL = 'https://neazmorshed.com';

// Helper to get all blog slugs
async function getBlogSlugs() {
    if (!supabase) return [];
    const { data } = await supabase
        .from('blogs')
        .select('slug, updated_at')
        .eq('is_published', true);
    return data || [];
}

// Helper to get all service slugs from database
async function getServiceSlugs() {
    if (!supabase) return [];
    const { data } = await supabase
        .from('services')
        .select('slug, updated_at');
    return data || [];
}

// Helper to get portfolio items
async function getPortfolioItems() {
    if (!supabase) return [];
    const { data } = await supabase
        .from('portfolio_items')
        .select('slug, updated_at, category');
    return data || [];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Static Routes
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${BASE_URL}/skills`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/skills/portfolio`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/services`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/experience`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${BASE_URL}/reviews`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
        },
        {
            url: `${BASE_URL}/contact`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.6,
        },
        {
            url: `${BASE_URL}/blog`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/resume`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
    ];

    // Dynamic Blog Routes
    const blogPosts = await getBlogSlugs();
    const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
        url: `${BASE_URL}/blog/${post.slug}`,
        lastModified: new Date(post.updated_at),
        changeFrequency: 'weekly',
        priority: 0.7,
    }));

    // Dynamic Service Routes from database
    const services = await getServiceSlugs();
    const serviceRoutes: MetadataRoute.Sitemap = services.map((service) => ({
        url: `${BASE_URL}/services/${service.slug}`,
        lastModified: new Date(service.updated_at),
        changeFrequency: 'monthly',
        priority: 0.9,
    }));

    // Dynamic Portfolio Routes
    const portfolioItems = await getPortfolioItems();

    // Get unique categories for portfolio category pages
    const categories = [...new Set(portfolioItems.map(item => item.category))];
    const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
        url: `${BASE_URL}/skills/portfolio/${category}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
    }));

    // Individual portfolio item routes (if you have detail pages)
    const portfolioRoutes: MetadataRoute.Sitemap = portfolioItems.map((item) => ({
        url: `${BASE_URL}/skills/portfolio/${item.category}/${item.slug}`,
        lastModified: new Date(item.updated_at),
        changeFrequency: 'monthly',
        priority: 0.6,
    }));

    return [
        ...staticRoutes,
        ...serviceRoutes,
        ...blogRoutes,
        ...categoryRoutes,
        ...portfolioRoutes,
    ];
}
