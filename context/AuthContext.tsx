"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

type User = {
  id: string;
  email: string;
  name: string;
  avatar?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // 1. Mevcut session'ı kontrol et
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Profili çek
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: profile?.full_name || session.user.email?.split('@')[0] || 'Kullanıcı',
          avatar: profile?.avatar_url
        });
      }
      setLoading(false);
    };

    checkUser();

    // 2. Dinleyici
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
         // Session varsa user'ı set et
         // (Optimizasyon: Her değişimde profil çekmek yerine cache kullanılabilir ama şimdilik güvenli yol)
         const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
         setUser({
          id: session.user.id,
          email: session.user.email!,
          name: profile?.full_name || 'Kullanıcı',
          avatar: profile?.avatar_url
        });
      } else {
        setUser(null);
        router.refresh(); // Server componentlerin yenilenmesi için
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}