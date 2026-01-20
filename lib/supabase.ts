
import { createClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Tarayıcıdaysa Cookie kullanan 'ssr' client, Sunucudaysa düz 'js' client kullan.
// Bu sayede hem Server Component'ler hem de Client Component'ler hatasız çalışır.
const isBrowser = typeof window !== 'undefined';

export const supabase = isBrowser
  ? createBrowserClient(supabaseUrl, supabaseKey)
  : createClient(supabaseUrl, supabaseKey);
