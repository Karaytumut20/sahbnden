
"use client";
import React from 'react';
import { FavoritesProvider } from '@/context/FavoritesContext';
import { AuthProvider } from '@/context/AuthContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <FavoritesProvider>
        {children}
      </FavoritesProvider>
    </AuthProvider>
  );
}
