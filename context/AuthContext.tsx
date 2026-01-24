"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

type User = {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role?: 'user' | 'store' | 'admin';
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  const fetchProfile = async (sessionUser: any) => {
      try {
        const { data: profile, error } = await supabase.from('profiles').select('*').eq('id', sessionUser.id).single();

        if (error) {
            console.warn("Profil çekilemedi, varsayılan değerler kullanılıyor:", error.message);
        }

        setUser({
            id: sessionUser.id,
            email: sessionUser.email!,
            name: profile?.full_name || sessionUser.email?.split('@')[0] || 'Kullanıcı',
            avatar: profile?.avatar_url,
            role: profile?.role || 'user'
        });
      } catch (err) {
          console.error("fetchProfile hatası:", err);
          // Hata olsa bile kullanıcıyı en azından email ile set et
          setUser({
            id: sessionUser.id,
            email: sessionUser.email!,
            name: sessionUser.email?.split('@')[0] || 'Kullanıcı',
            role: 'user'
          });
      }
  };

  useEffect(() => {
    let mounted = true;

    const checkUser = async () => {
      try {
        // Zaman aşımı ekleyelim (5 saniye içinde yanıt gelmezse vazgeç)
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Auth Timeout')), 5000));
        const sessionPromise = supabase.auth.getSession();

        const { data: { session } } : any = await Promise.race([sessionPromise, timeoutPromise]);

        if (session?.user && mounted) {
          await fetchProfile(session.user);
        }
      } catch (error) {
        console.error("Auth Check Error:", error);
      } finally {
        if (mounted) setLoading(false); // NE OLURSA OLSUN LOADING KAPATILIR
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
         await fetchProfile(session.user);
      } else {
        setUser(null);
        router.refresh();
      }
      setLoading(false);
    });

    return () => {
        mounted = false;
        subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/login');
  };

  const refreshUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) await fetchProfile(session.user);
  }

  return (
    <AuthContext.Provider value={{ user, loading, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}