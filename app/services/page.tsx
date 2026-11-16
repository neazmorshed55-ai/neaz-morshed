import type { Metadata } from 'next';
import ServicesPage, { type InitialData } from './Client';
import { getServerSupabase } from '../../lib/supabase-server';
import { pageMeta } from '../../lib/seo';

// Rendered on the server and cached; refreshed in the background every minute.
export const revalidate = 60;

export const metadata: Metadata = pageMeta({
  title: 'Services',
  description: 'Virtual assistant, web design, video editing, social media marketing and admin support services by Neaz Md. Morshed, with real project examples.',
  path: '/services',
});

async function loadServices(): Promise<InitialData | null> {
  const db = getServerSupabase(60);
  if (!db) return null;
  try {
    const { data, error } = await db
      .from('services')
      .select('id, title, slug, description, icon, cover_image, order_index')
      .eq('is_active', true)
      .order('order_index', { ascending: true });
    if (error || !data) return null;
    return { services: data } as InitialData;
  } catch {
    return null;
  }
}

export default async function Page() {
  return <ServicesPage initial={await loadServices()} />;
}
