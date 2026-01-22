import React from 'react';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers"; // Merkezi Provider (Senior Pattern)
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
        {/* Tüm uygulama state'lerini kapsayan merkezi Provider */}
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          {/* ModalRoot da context'e erişebilmesi için provider içinde olmalı */}
          <ModalRoot />
        </Providers>
      </body>
    </html>
  );
}