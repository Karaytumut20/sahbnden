import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import { Providers } from "@/components/Providers";
import CompareBar from "@/components/CompareBar";
import ModalRoot from "@/components/ModalRoot";
import CookieBanner from "@/components/CookieBanner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "sahibinden.com: Satılık, Kiralık, 2.El, Emlak, Oto, Araba",
  description: "Sahibinden.com klon projesi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col font-sans pb-[60px] md:pb-0`}
      >
        <Providers>
          <Header />
          <div className="flex-1 w-full max-w-[1150px] mx-auto px-4 py-4">
              {children}
          </div>
          <Footer />
          <MobileBottomNav />
          <CompareBar />
          <ModalRoot />
          <CookieBanner />
        </Providers>
      </body>
    </html>
  );
}