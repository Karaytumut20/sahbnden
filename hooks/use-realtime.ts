import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

type RealtimeOptions = {
  table: string;
  channelName?: string;
  filter?: string;
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  callback: (payload: any) => void;
};

/**
 * Veritabanı değişikliklerini anlık dinlemek için Custom Hook.
 * Memory leak önlemek için cleanup işlemini otomatik yapar.
 */
export function useRealtimeSubscription({ table, channelName, filter, event = '*', callback }: RealtimeOptions) {
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    // Benzersiz bir kanal adı oluştur veya verileni kullan
    const channelId = channelName || `sub_${table}_${Math.random().toString(36).substr(2, 9)}`;

    const channel = supabase
      .channel(channelId)
      .on(
        'postgres_changes',
        { event, schema: 'public', table, filter },
        (payload) => {
          // Callback'i tetikle
          callback(payload);
          // Opsiyonel: Veri değiştiğinde Next.js cache'ini tazeleyebiliriz (router.refresh())
          // Ancak bu her durumda istenmeyebilir, o yüzden manuel yönetime bırakıyoruz.
        }
      )
      .subscribe();

    // Cleanup: Bileşen unmount olduğunda dinlemeyi durdur
    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, filter, event, channelName]); // Dependency array önemli
}