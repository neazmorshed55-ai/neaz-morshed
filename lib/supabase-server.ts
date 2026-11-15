import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Read-only Supabase client for Server Components.
 *
 * Requests go through Next's fetch cache, so a page that exports
 * `revalidate` is served from cache and refreshed in the background.
 */
export function getServerSupabase(revalidateSeconds = 60): SupabaseClient | null {
  if (!supabaseUrl || !supabaseAnonKey) return null;

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input: RequestInfo | URL, init?: RequestInit) =>
        fetch(input, { ...init, next: { revalidate: revalidateSeconds } } as RequestInit),
    },
  });
}

/** Public URL of a file in a public storage bucket (no request needed). */
export function publicStorageUrl(bucket: string, path: string): string | null {
  if (!supabaseUrl) return null;
  return `${supabaseUrl.replace(/\/+$/, '')}/storage/v1/object/public/${bucket}/${path}`;
}
