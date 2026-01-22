// BU DOSYA GÜVENLİ BİR ŞEKİLDE GÜNCELLENMİŞTİR
// Eski importların kırılmaması için 'lib/supabase/client' re-export ediliyor.
import { createClient } from './supabase/client';
export const supabase = createClient();