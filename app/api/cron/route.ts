import { NextResponse } from 'next/server';
import { createStaticClient } from '@/lib/supabase/server';

// Bu endpoint Vercel Cron veya harici bir scheduler tarafından her gün çağrılmalı
export async function GET(request: Request) {
  // Güvenlik Kontrolü (Bearer Token)
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const supabase = createStaticClient();
  const now = new Date().toISOString();

  // 1. Süresi dolan Vitrin dopinglerini temizle
  const { error: vitrinError, count: vitrinCount } = await supabase
    .from('ads')
    .update({ is_vitrin: false, vitrin_expires_at: null })
    .lt('vitrin_expires_at', now)
    .select('id', { count: 'exact' });

  // 2. Süresi dolan Acil etiketlerini temizle
  const { error: urgentError, count: urgentCount } = await supabase
    .from('ads')
    .update({ is_urgent: false, urgent_expires_at: null })
    .lt('urgent_expires_at', now)
    .select('id', { count: 'exact' });

  if (vitrinError || urgentError) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    message: 'Cron job executed successfully',
    stats: {
      vitrin_removed: vitrinCount,
      urgent_removed: urgentCount
    }
  });
}