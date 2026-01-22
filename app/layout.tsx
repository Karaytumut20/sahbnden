import React from 'react';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { ToastProvider } from "@/context/ToastContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { ModalProvider } from "@/context/ModalContext";
import { NotificationProvider } from "@/context/NotificationContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ModalRoot from "@/components/ModalRoot";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Marketplace - Global İlan Platformu",
  description: "Dünyanın en büyük ilan platformu.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="light">
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider>
            {/* DÜZELTME: ToastProvider EN ÜSTE TAŞINDI */}
            {/* Diğer tüm provider'lar Toast kullanabilsin diye kapsayıcı yapıldı */}
            <ToastProvider>
              <FavoritesProvider>
                <NotificationProvider>
                  <ModalProvider>

                    <div className="flex flex-col min-h-screen">
                        <Header />
                        <main className="flex-1">
                            {children}
                        </main>
                        <Footer />
                    </div>
                    <ModalRoot />

                  </ModalProvider>
                </NotificationProvider>
              </FavoritesProvider>
            </ToastProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}