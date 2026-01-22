import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';

/**
 * Şu an sayfada olan kullanıcıları takip eder.
 * @param roomId Hangi odadaki kullanıcılar? (Örn: 'ad_123' veya 'global')
 */
export function usePresence(roomId: string) {
  const { user } = useAuth();
  const supabase = createClient();
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    const channel = supabase.channel(roomId);

    channel
      .on('presence', { event: 'sync' }, () => {
        // Presence state'i senkronize olduğunda listeyi güncelle
        const newState = channel.presenceState();
        const users = Object.values(newState).flat();
        setOnlineUsers(users);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          // Kanala bağlandığında kendini "Ben buradayım" diye kaydet
          await channel.track({
            user_id: user.id,
            name: user.name,
            avatar: user.avatar,
            online_at: new Date().toISOString(),
          });
        }
      });

    return () => {
      channel.unsubscribe();
    };
  }, [user, roomId]);

  return { onlineUsers, count: onlineUsers.length };
}