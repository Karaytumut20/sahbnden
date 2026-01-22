import { ImageResponse } from 'next/og';
import { createStaticClient } from '@/lib/supabase/server';

export const runtime = 'edge';

// Görsel boyutu
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image({ params }: { params: { id: string } }) {
  const supabase = createStaticClient();
  const { data: ad } = await supabase.from('ads').select('*').eq('id', params.id).single();

  if (!ad) {
    return new ImageResponse(
      (
        <div style={{ fontSize: 48, background: '#2d405a', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
          sahibinden.com Klon
        </div>
      ),
      { ...size }
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          background: '#f6f7f9',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* Arka Plan Deseni */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '20px', background: '#ffe800' }} />

        <div style={{ display: 'flex', background: 'white', padding: '40px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', alignItems: 'center', gap: '40px', maxWidth: '90%' }}>
            {/* Resim Varsa */}
            {ad.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={ad.image} alt={ad.title} style={{ width: '300px', height: '300px', objectFit: 'cover', borderRadius: '10px' }} />
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ fontSize: 24, color: '#666', fontWeight: 'bold' }}>#{ad.id}</div>
                <div style={{ fontSize: 48, fontWeight: 'bold', color: '#333', lineHeight: 1.1 }}>{ad.title.substring(0, 60)}{ad.title.length > 60 ? '...' : ''}</div>
                <div style={{ fontSize: 64, fontWeight: 'bold', color: '#2d405a', marginTop: '10px' }}>
                    {ad.price?.toLocaleString('tr-TR')} {ad.currency}
                </div>
                <div style={{ display: 'flex', gap: '20px', marginTop: '20px', fontSize: 24, color: '#555' }}>
                    <div style={{ background: '#f0f0f0', padding: '5px 15px', borderRadius: '5px' }}>{ad.city} / {ad.district}</div>
                    <div style={{ background: '#f0f0f0', padding: '5px 15px', borderRadius: '5px' }}>{new Date(ad.created_at).toLocaleDateString('tr-TR')}</div>
                </div>
            </div>
        </div>

        <div style={{ position: 'absolute', bottom: 30, right: 40, fontSize: 24, color: '#888', fontWeight: 'bold' }}>
            sahibinden.com <span style={{ color: '#2d405a' }}>klon</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}