import { getServerSupabase } from '../../lib/supabase-server';
import BlogClient, { type BlogPost } from './Client';

export const revalidate = 60;

async function load(): Promise<BlogPost[] | null> {
  const db = getServerSupabase();
  if (!db) return null;
  const { data, error } = await db
    .from('blogs')
    .select('id, title, slug, excerpt, cover_image, cover_image_alt_text, external_link, tags, published_at')
    .eq('is_published', true)
    .order('published_at', { ascending: false });
  return error || !data ? null : (data as BlogPost[]);
}

export default async function BlogPage() {
  return <BlogClient initial={await load()} />;
}
