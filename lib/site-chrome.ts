import { getServerSupabase } from './supabase-server';
import type { SiteChromeData } from '../components/SiteChrome';

/** Menu, branding and footer links for every page; cached for 5 minutes. */
export async function loadSiteChrome(): Promise<SiteChromeData | null> {
  const db = getServerSupabase(300);
  if (!db) return null;
  try {
    const [nav, branding, footer] = await Promise.all([
      db.from('navigation_items').select('*').eq('is_visible', true).order('order_index', { ascending: true }),
      db.from('site_branding').select('*').limit(1).maybeSingle(),
      db.from('footer_links').select('*').eq('is_active', true).order('order_index', { ascending: true }),
    ]);
    return {
      navItems: !nav.error && nav.data && nav.data.length > 0 ? nav.data : null,
      branding: !branding.error && branding.data ? branding.data : null,
      footerLinks: !footer.error && footer.data && footer.data.length > 0 ? footer.data : null,
    };
  } catch {
    return null;
  }
}
