import type { Metadata } from 'next';
import SkillPortfolioPage, { type InitialData } from './Client';
import { getServerSupabase, publicStorageUrl } from '../../../lib/supabase-server';
import { pageMeta } from '../../../lib/seo';

// Rendered on the server and cached; refreshed in the background every minute.
export const revalidate = 60;

export const metadata: Metadata = pageMeta({
  title: 'Skill Portfolio',
  description: 'Samples of work by skill: video production, graphic design, content writing, web development, WordPress design and social media marketing.',
  path: '/skills/portfolio',
});

async function loadSkills(): Promise<InitialData | null> {
  const db = getServerSupabase(60);
  if (!db) return null;
  try {
    const [{ data: categories }, { data: subSkills }] = await Promise.all([
      db.from('skill_categories').select('*').eq('is_active', true).order('order_index', { ascending: true }),
      db.from('sub_skills').select('*').eq('is_active', true).order('order_index', { ascending: true }),
    ]);
    // Same rule as in the browser: the built-in list stays unless both lists have rows.
    if (!categories?.length || !subSkills?.length) return null;
    return { categories, subSkills, profileImage: publicStorageUrl('images', 'profile.jpg') } as InitialData;
  } catch {
    return null;
  }
}

export default async function Page() {
  const initial = await loadSkills();
  return <SkillPortfolioPage initial={initial} />;
}
