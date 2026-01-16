import { createClient } from '@supabase/supabase-js';

// Eğer env dosyası yoksa boş string döner, uygulama patlamaz.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);