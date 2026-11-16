import type { Metadata } from 'next';
import SkillDetailPage, { type InitialData } from './Client';
import { getServerSupabase } from '../../../../../lib/supabase-server';

// Rendered on the server and cached; refreshed in the background every minute.
export const revalidate = 60;

type Params = { category: string; skill: string };

async function loadSkill(categorySlug: string, skillSlug: string): Promise<InitialData | null> {
  const db = getServerSupabase(60);
  if (!db) return null;
  try {
    const { data: category } = await db.from('skill_categories').select('*').eq('slug', categorySlug).maybeSingle();
    if (!category) return null;
    const { data: s } = await db
      .from('sub_skills')
      .select('*')
      .eq('category_id', category.id)
      .eq('slug', skillSlug)
      .maybeSingle();
    if (!s) return null;
    const { data: gallery } = await db
      .from('skill_gallery')
      .select('*')
      .eq('sub_skill_id', s.id)
      .order('order_index', { ascending: true });
    // Same defaults and de-duplication the page applies when it loads in the browser.
    const skill = {
      ...s,
      description: s.description || 'Professional service description coming soon.',
      long_description: s.long_description || 'Detailed service description is currently being updated.',
      cover_image: s.cover_image || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1200',
      gallery_images: s.gallery_images || [],
      tools_used: s.tools_used || [],
      experience_years: s.experience_years || '5+ Years',
      project_count: s.project_count || 0,
    };
    const items = (gallery ?? []) as { url: string }[];
    const galleryItems = items.filter((item, i) => i === items.findIndex((t) => t.url === item.url));
    return { category, skill, galleryItems } as unknown as InitialData;
  } catch {
    return null; // the page falls back to loading in the browser
  }
}

/** Every skill page is built ahead of time. */
export async function generateStaticParams(): Promise<Params[]> {
  const db = getServerSupabase(3600);
  if (!db) return [];
  const [{ data: cats }, { data: skills }] = await Promise.all([
    db.from('skill_categories').select('id, slug'),
    db.from('sub_skills').select('slug, category_id'),
  ]);
  const catSlug = new Map((cats ?? []).map((c) => [c.id, c.slug as string]));
  return (skills ?? [])
    .filter((s) => s.slug && catSlug.get(s.category_id))
    .map((s) => ({ category: catSlug.get(s.category_id) as string, skill: s.slug as string }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const data = await loadSkill(params.category, params.skill);
  if (!data) return {};
  const title = `${data.skill.title} | ${data.category.title}`;
  const description = (data.skill.description || '').replace(/\s+/g, ' ').slice(0, 160);
  return {
    title,
    description,
    alternates: { canonical: `/skills/portfolio/${params.category}/${params.skill}` },
    openGraph: { title, description, images: data.skill.cover_image ? [data.skill.cover_image] : undefined },
  };
}

export default async function Page({ params }: { params: Params }) {
  const initial = await loadSkill(params.category, params.skill);
  return <SkillDetailPage key={`${params.category}/${params.skill}`} initial={initial} />;
}
