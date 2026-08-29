import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('placeholder') &&
  !supabaseAnonKey.includes('placeholder')
);

export function createClient() {
  if (!isSupabaseConfigured) {
    return null;
  }
  return createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey);
}

export const supabase = isSupabaseConfigured
  ? createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey)
  : null;
