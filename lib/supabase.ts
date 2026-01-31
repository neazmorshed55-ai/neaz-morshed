import { createClient } from '@supabase/supabase-js';

// Configuration for Supabase using Environment Variables.
// These must be defined in your Vercel Dashboard settings.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase configuration is missing. Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in Vercel.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
