import type { VideoReview } from '../components/VideoReviews';
import { getServerSupabase, publicStorageUrl } from './supabase-server';

export interface HeroContent {
  hero_subtitle: string;
  hero_title_prefix: string;
  hero_name: string;
  hero_description: string;
  hero_typewriter_texts: string[];
  hero_stats: Array<{ label: string; value: number; suffix?: string }>;
}

export interface HomeSkill {
  name: string;
  level: number;
}

export interface HomeService {
  id: string;
  title: string;
  slug: string;
  icon: string | null;
  desc: string;
}

export interface HomeExperience {
  id: string;
  company: string;
  position: string;
  location: string;
  start_date: string;
  end_date: string;
  description: string[];
  type: 'full-time' | 'part-time' | 'project';
}

export interface HomePortfolioItem {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  thumbnail_url: string | null;
  video_url: string | null;
  order_index: number;
}

export interface HomepageData {
  hero: HeroContent;
  profileImage: string | null;
  skills: HomeSkill[];
  services: HomeService[];
  experiences: HomeExperience[];
  portfolio: HomePortfolioItem[];
  /** null when the query failed: the section then loads it in the browser. */
  videoReviews: VideoReview[] | null;
}

// Fallback data in case the database is empty or unreachable
export const defaultHero: HeroContent = {
  hero_subtitle: 'Powering Global Business Growth Since 2014',
  hero_title_prefix: 'I AM',
  hero_name: 'Neaz Md. Morshed',
  hero_description:
    'I handle the heavy lifting of business operations so you can focus on scale. Powered by modern tech stack.',
  hero_typewriter_texts: [
    'Virtual Assistant Expert',
    'Lead Generation Specialist',
    'CRM & Data Management Pro',
    'Next.js & Supabase Developer',
    'Business Process Optimizer',
    'Top Rated Freelancer',
  ],
  hero_stats: [
    { label: 'Job Success', value: 100, suffix: '%' },
    { label: 'Global Clients', value: 1000, suffix: '+' },
    { label: 'Hours Completed', value: 10000, suffix: '+' },
  ],
};

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

/**
 * Everything the homepage needs, fetched in parallel on the server.
 * Each query fails independently so one bad table never blanks the page.
 */
export async function getHomepageData(): Promise<HomepageData> {
  const supabase = getServerSupabase(60);
  const profileImage = publicStorageUrl('images', 'profile.jpg');

  if (!supabase) {
    return { hero: defaultHero, profileImage, skills: [], services: [], experiences: [], portfolio: [], videoReviews: null };
  }

  const [heroRes, skillsRes, servicesRes, experiencesRes, portfolioRes, videoRes] = await Promise.allSettled([
    supabase.from('homepage_content').select('*').limit(1).maybeSingle(),
    supabase.from('skills').select('name, proficiency').order('order_index', { ascending: true }).limit(6),
    supabase.from('services').select('id, title, slug, icon, description').order('order_index', { ascending: true }).limit(4),
    supabase.from('experiences').select('*').order('order_index', { ascending: true }).limit(4),
    supabase
      .from('portfolio_items')
      .select('id, title, description, image_url, thumbnail_url, video_url, order_index')
      .order('order_index', { ascending: true })
      .limit(12),
    supabase.from('video_reviews').select('*').eq('is_active', true).order('order_index', { ascending: true }),
  ]);

  const value = <T,>(res: PromiseSettledResult<{ data: T | null; error: unknown }>): T | null =>
    res.status === 'fulfilled' && !res.value.error ? res.value.data : null;

  const heroRow = value(heroRes) as Partial<HeroContent> | null;
  const hero: HeroContent = {
    ...defaultHero,
    ...(heroRow || {}),
    hero_typewriter_texts:
      asArray<string>(heroRow?.hero_typewriter_texts).length > 0
        ? asArray<string>(heroRow?.hero_typewriter_texts)
        : defaultHero.hero_typewriter_texts,
    hero_stats:
      asArray(heroRow?.hero_stats).length > 0
        ? asArray<HeroContent['hero_stats'][number]>(heroRow?.hero_stats)
        : defaultHero.hero_stats,
  };

  const skills = asArray<{ name: string; proficiency: number }>(value(skillsRes)).map((s) => ({
    name: s.name,
    level: Number(s.proficiency) || 0,
  }));

  const services = asArray<{ id: string; title: string; slug: string; icon: string | null; description: string }>(
    value(servicesRes)
  ).map((s) => ({ id: String(s.id), title: s.title, slug: s.slug, icon: s.icon, desc: s.description }));

  const experiences = asArray<HomeExperience>(value(experiencesRes)).map((e) => ({
    ...e,
    description: asArray<string>(e.description),
  }));

  const portfolio = asArray<HomePortfolioItem>(value(portfolioRes));

  const videoRows = value(videoRes);
  const videoReviews = Array.isArray(videoRows) ? (videoRows as VideoReview[]) : null;

  return { hero, profileImage, skills, services, experiences, portfolio, videoReviews };
}
