import { createClient } from '@supabase/supabase-js';
import { Database } from '../../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabaseClient = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: localStorage,
    storageKey: 'aizily_auth',
    flowType: 'pkce'
  },
  global: {
    headers: {
      'X-Client-Info': 'aizily-web'
    }
  }
});

export const STORAGE_KEY = 'aizily_auth';