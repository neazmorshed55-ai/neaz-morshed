import { getServerSupabase } from '../../lib/supabase-server';
import ReviewsClient, { type Review } from './Client';

export const revalidate = 60;

async function load(): Promise<Review[] | null> {
  const db = getServerSupabase();
  if (!db) return null;
  const { data, error } = await db
    .from('reviews')
    .select('id, client_name, client_title, client_company, review_text, rating, platform, client_image, client_image_alt_text, date, order_index, country_code, country_name, city')
    .order('order_index', { ascending: true });
  return error || !data || data.length === 0 ? null : (data as Review[]);
}

export default async function ReviewsPage() {
  return <ReviewsClient initial={await load()} />;
}
