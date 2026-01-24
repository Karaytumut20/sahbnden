"use client";
import React from "react";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";
import { CompareProvider } from "@/context/CompareContext";
import { HistoryProvider } from "@/context/HistoryContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { ModalProvider } from "@/context/ModalContext";
import { MessageProvider } from "@/context/MessageContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <AuthProvider>
        <NotificationProvider>
          <ModalProvider>
            <FavoritesProvider>
              <CompareProvider>
                <HistoryProvider>
                  <MessageProvider>
                    {children}
                  </MessageProvider>
                </HistoryProvider>
              </CompareProvider>
            </FavoritesProvider>
          </ModalProvider>
        </NotificationProvider>
      </AuthProvider>
    </ToastProvider>
  );
}