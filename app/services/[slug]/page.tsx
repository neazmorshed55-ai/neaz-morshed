import type { Metadata } from 'next';
import PortfolioCollectionPage, { type InitialData } from './Client';
import { getServerSupabase } from '../../../lib/supabase-server';

// Rendered on the server and cached; refreshed in the background every minute.
export const revalidate = 60;

async function loadService(slug: string): Promise<InitialData | null> {
  const db = getServerSupabase(60);
  if (!db) return null;
  try {
    const { data: service } = await db.from('services').select('*').eq('slug', slug).maybeSingle();
    if (!service) return null;
    const { data: portfolioItems } = await db
      .from('portfolio_items')
      .select('*')
      .eq('service_id', service.id)
      .order('order_index', { ascending: true });
    // No projects yet: the page shows its built-in examples, exactly as before.
    if (!portfolioItems || portfolioItems.length === 0) return null;
    const { data: gallery } = await db
      .from('portfolio_gallery')
      .select('*')
      .in('portfolio_item_id', portfolioItems.map((p) => p.id))
      .order('order_index', { ascending: true });
    return { service, portfolioItems, allGalleryItems: gallery ?? [] } as InitialData;
  } catch {
    return null; // the page falls back to loading in the browser
  }
}

/** Every service page is built ahead of time. */
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const db = getServerSupabase(3600);
  if (!db) return [];
  const { data } = await db.from('services').select('slug');
  return (data ?? []).filter((s) => s.slug).map((s) => ({ slug: s.slug as string }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const data = await loadService(params.slug);
  if (!data) return {};
  const title = `${data.service.title} Portfolio`;
  const description = (data.service.description || '').replace(/\s+/g, ' ').slice(0, 160);
  const image = data.service.cover_image || data.portfolioItems[0]?.thumbnail_url || data.portfolioItems[0]?.image_url;
  return {
    title,
    description,
    alternates: { canonical: `/services/${params.slug}` },
    openGraph: { title, description, images: image ? [image] : undefined },
  };
}

export default async function Page({ params }: { params: { slug: string } }) {
  const initial = await loadService(params.slug);
  return <PortfolioCollectionPage key={params.slug} initial={initial} />;
}
