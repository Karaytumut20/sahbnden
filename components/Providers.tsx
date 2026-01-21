"use client";
import React from 'react';
import { FavoritesProvider } from '@/context/FavoritesContext';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';
import { CompareProvider } from '@/context/CompareContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { ModalProvider } from '@/context/ModalContext';
import { HistoryProvider } from '@/context/HistoryContext';
import { MessageProvider } from '@/context/MessageContext';
import { ThemeProvider } from '@/context/ThemeContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <ModalProvider>
            <FavoritesProvider>
              <CompareProvider>
                <NotificationProvider>
                  <HistoryProvider>
                    <MessageProvider>
                      {children}
                    </MessageProvider>
                  </HistoryProvider>
                </NotificationProvider>
              </CompareProvider>
            </FavoritesProvider>
          </ModalProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}