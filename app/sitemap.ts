import { MetadataRoute } from 'next';
import { supabase } from '../lib/supabase';
import { SITE_URL } from '../lib/site';

const BASE_URL = SITE_URL;

// Rebuilt at most once an hour so new projects/posts get listed.
export const revalidate = 3600;

type Row = Record<string, any>;

async function rows(table: string, columns: string, activeOnly = false): Promise<Row[]> {
    if (!supabase) return [];
    let query = supabase.from(table).select(columns);
    if (activeOnly) query = query.eq('is_active', true);
    const { data, error } = await query;
    if (error) {
        console.error(`sitemap: could not read ${table}:`, error.message);
        return [];
    }
    return (data as unknown as Row[]) || [];
}

// Tolerates missing or malformed timestamps instead of failing the whole sitemap
function lastModified(...values: Array<string | null | undefined>): Date {
    for (const value of values) {
        if (!value) continue;
        const date = new Date(value);
        if (!Number.isNaN(date.getTime())) return date;
    }
    return new Date();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const now = new Date();
    const staticPaths: Array<[string, MetadataRoute.Sitemap[number]['changeFrequency'], number]> = [
        ['', 'weekly', 1],
        ['/skills', 'monthly', 0.9],
        ['/skills/portfolio', 'weekly', 0.8],
        ['/services', 'monthly', 0.9],
        ['/experience', 'monthly', 0.7],
        ['/reviews', 'weekly', 0.7],
        ['/blog', 'daily', 0.8],
        ['/resume', 'monthly', 0.5],
    ];
    const staticRoutes: MetadataRoute.Sitemap = staticPaths.map(([path, changeFrequency, priority]) => ({
        url: `${BASE_URL}${path}`,
        lastModified: now,
        changeFrequency,
        priority,
    }));

    const [blogs, services, portfolioItems, categories, subSkills] = await Promise.all([
        rows('blogs', 'slug, updated_at, published_at, is_published'),
        rows('services', 'id, slug, created_at', true),
        rows('portfolio_items', 'slug, service_id, updated_at, created_at'),
        rows('skill_categories', 'id, slug, updated_at', true),
        rows('sub_skills', 'slug, category_id, updated_at', true),
    ]);

    const blogRoutes: MetadataRoute.Sitemap = blogs
        .filter((post) => post.is_published && post.slug)
        .map((post) => ({
            url: `${BASE_URL}/blog/${post.slug}`,
            lastModified: lastModified(post.updated_at, post.published_at),
            changeFrequency: 'weekly',
            priority: 0.7,
        }));

    const serviceSlugById = new Map(services.map((service) => [service.id, service.slug]));
    const serviceRoutes: MetadataRoute.Sitemap = services
        .filter((service) => service.slug)
        .map((service) => ({
            url: `${BASE_URL}/services/${service.slug}`,
            lastModified: lastModified(service.created_at),
            changeFrequency: 'monthly',
            priority: 0.9,
        }));

    // Project pages live at /services/[service]/[project]
    const portfolioRoutes: MetadataRoute.Sitemap = portfolioItems
        .filter((item) => item.slug && serviceSlugById.has(item.service_id))
        .map((item) => ({
            url: `${BASE_URL}/services/${serviceSlugById.get(item.service_id)}/${item.slug}`,
            lastModified: lastModified(item.updated_at, item.created_at),
            changeFrequency: 'monthly',
            priority: 0.6,
        }));

    // Skill portfolio pages live at /skills/portfolio/[category]/[skill]
    const categorySlugById = new Map(categories.map((category) => [category.id, category.slug]));
    const categoryRoutes: MetadataRoute.Sitemap = categories
        .filter((category) => category.slug)
        .map((category) => ({
            url: `${BASE_URL}/skills/portfolio/${category.slug}`,
            lastModified: lastModified(category.updated_at),
            changeFrequency: 'weekly',
            priority: 0.7,
        }));
    const skillRoutes: MetadataRoute.Sitemap = subSkills
        .filter((skill) => skill.slug && categorySlugById.has(skill.category_id))
        .map((skill) => ({
            url: `${BASE_URL}/skills/portfolio/${categorySlugById.get(skill.category_id)}/${skill.slug}`,
            lastModified: lastModified(skill.updated_at),
            changeFrequency: 'monthly',
            priority: 0.6,
        }));

    return [
        ...staticRoutes,
        ...serviceRoutes,
        ...portfolioRoutes,
        ...blogRoutes,
        ...categoryRoutes,
        ...skillRoutes,
    ];
}
