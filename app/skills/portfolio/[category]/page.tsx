import type { Metadata } from 'next';
import CategoryPage, { type InitialData } from './Client';
import { getServerSupabase } from '../../../../lib/supabase-server';

// Rendered on the server and cached; refreshed in the background every minute.
export const revalidate = 60;

async function loadCategory(slug: string): Promise<InitialData | null> {
  const db = getServerSupabase(60);
  if (!db) return null;
  try {
    const { data: category } = await db.from('skill_categories').select('*').eq('slug', slug).maybeSingle();
    if (!category) return null;
    const { data: subSkills } = await db
      .from('sub_skills')
      .select('*')
      .eq('category_id', category.id)
      .eq('is_active', true)
      .order('order_index', { ascending: true });
    return { category, subSkills: subSkills ?? [] } as InitialData;
  } catch {
    return null;
  }
}

export async function generateStaticParams(): Promise<{ category: string }[]> {
  const db = getServerSupabase(3600);
  if (!db) return [];
  const { data } = await db.from('skill_categories').select('slug');
  return (data ?? []).filter((c) => c.slug).map((c) => ({ category: c.slug as string }));
}

export async function generateMetadata({ params }: { params: { category: string } }): Promise<Metadata> {
  const data = await loadCategory(params.category);
  if (!data) return {};
  const title = `${data.category.title} Portfolio`;
  const description = (data.category.description || '').replace(/\s+/g, ' ').slice(0, 160);
  return { title, description, alternates: { canonical: `/skills/portfolio/${params.category}` } };
}

export default async function Page({ params }: { params: { category: string } }) {
  const initial = await loadCategory(params.category);
  return <CategoryPage key={params.category} initial={initial} />;
}
