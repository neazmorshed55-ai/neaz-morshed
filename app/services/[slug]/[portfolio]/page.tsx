import type { Metadata } from 'next';
import PortfolioDetailPage, { type InitialData } from './Client';
import { getServerSupabase } from '../../../../lib/supabase-server';

// Rendered on the server and cached; refreshed in the background every minute.
export const revalidate = 60;

type Params = { slug: string; portfolio: string };

async function loadProject(serviceSlug: string, portfolioSlug: string): Promise<InitialData | null> {
  const db = getServerSupabase(60);
  if (!db) return null;
  try {
    const { data: service } = await db.from('services').select('*').eq('slug', serviceSlug).maybeSingle();
    if (!service) return null;
    const { data: portfolio } = await db
      .from('portfolio_items')
      .select('*')
      .eq('service_id', service.id)
      .eq('slug', portfolioSlug)
      .maybeSingle();
    if (!portfolio) return null;
    const { data: gallery } = await db
      .from('portfolio_gallery')
      .select('*')
      .eq('portfolio_item_id', portfolio.id)
      .order('order_index', { ascending: true });
    return { service, portfolio, galleryItems: gallery ?? [] } as InitialData;
  } catch {
    return null; // the page falls back to loading in the browser
  }
}

/** Every project page is built ahead of time, so even the first visitor gets it instantly. */
export async function generateStaticParams(): Promise<Params[]> {
  const db = getServerSupabase(3600);
  if (!db) return [];
  const [{ data: services }, { data: items }] = await Promise.all([
    db.from('services').select('id, slug'),
    db.from('portfolio_items').select('slug, service_id'),
  ]);
  const serviceSlug = new Map((services ?? []).map((s) => [s.id, s.slug as string]));
  return (items ?? [])
    .filter((i) => i.slug && serviceSlug.get(i.service_id))
    .map((i) => ({ slug: serviceSlug.get(i.service_id) as string, portfolio: i.slug as string }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const data = await loadProject(params.slug, params.portfolio);
  if (!data) return {};
  const title = `${data.portfolio.title} | ${data.service.title}`;
  const description = (data.portfolio.description || '').replace(/\s+/g, ' ').slice(0, 160);
  const image = data.portfolio.thumbnail_url || data.portfolio.image_url;
  return {
    title,
    description,
    alternates: { canonical: `/services/${params.slug}/${params.portfolio}` },
    openGraph: { title, description, images: image ? [image] : undefined },
  };
}

export default async function Page({ params }: { params: Params }) {
  const initial = await loadProject(params.slug, params.portfolio);
  return <PortfolioDetailPage key={`${params.slug}/${params.portfolio}`} initial={initial} />;
}
