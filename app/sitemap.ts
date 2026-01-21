import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/client';

// BASE URL'i environment variable'dan al veya localhost kullan
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient();

  // En son eklenen 1000 ilanı çek
  const { data: ads } = await supabase
    .from('ads')
    .select('id, updated_at')
    .eq('status', 'yayinda')
    .order('updated_at', { ascending: false })
    .limit(1000);

  const adUrls = (ads || []).map((ad) => ({
    url: `${BASE_URL}/ilan/${ad.id}`,
    lastModified: new Date(ad.updated_at),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 1,
    },
    {
      url: `${BASE_URL}/search`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...adUrls,
  ];
}