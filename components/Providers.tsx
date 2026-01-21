"use client";
import React from 'react';
import { FavoritesProvider } from '@/context/FavoritesContext';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';
import { CompareProvider } from '@/context/CompareContext';
import { HistoryProvider } from '@/context/HistoryContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { ModalProvider } from '@/context/ModalContext';
import { ThemeProvider } from '@/context/ThemeContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <NotificationProvider>
            <ModalProvider>
              <FavoritesProvider>
                <CompareProvider>
                  <HistoryProvider>
                    {children}
                  </HistoryProvider>
                </CompareProvider>
              </FavoritesProvider>
            </ModalProvider>
          </NotificationProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}