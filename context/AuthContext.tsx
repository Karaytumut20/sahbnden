
"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type User = {
  name: string;
  email: string;
  avatar?: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // Sayfa yenilendiğinde oturumu hatırla (Simülasyon)
  useEffect(() => {
    const storedUser = localStorage.getItem('sahibinden_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (email: string) => {
    // Mock user verisi
    const mockUser = {
      name: 'Ahmet Yılmaz',
      email: email,
      avatar: 'AY'
    };
    setUser(mockUser);
    localStorage.setItem('sahibinden_user', JSON.stringify(mockUser));
    router.push('/bana-ozel'); // Giriş başarılıysa yönlendir
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sahibinden_user');
    router.push('/');
  };

  const updateUser = (data: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...data };
      setUser(updated);
      localStorage.setItem('sahibinden_user', JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
