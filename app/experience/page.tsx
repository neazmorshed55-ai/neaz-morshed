import { getServerSupabase } from '../../lib/supabase-server';
import ExperienceClient, { type Experience } from './Client';

export const revalidate = 60;

async function load(): Promise<Experience[] | null> {
  const db = getServerSupabase();
  if (!db) return null;
  const { data, error } = await db.from('experiences').select('*');
  return error || !data || data.length === 0 ? null : (data as Experience[]);
}

export default async function ExperiencePage() {
  return <ExperienceClient initial={await load()} />;
}
