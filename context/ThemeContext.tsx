"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light'; // Sadece light

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void; // Fonksiyon var ama işlevsiz (No-op)
};

const ThemeContext = createContext<AuthContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // State her zaman 'light'
  const [theme] = useState<Theme>('light');

  useEffect(() => {
    // HTML taginden dark class'ını temizle (varsa)
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
    document.documentElement.style.colorScheme = 'light';
  }, []);

  const toggleTheme = () => {
    console.log("Dark mode bu projede devre dışı bırakılmıştır (Design Choice).");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  // Mock context to prevent breaking changes if context is missing
  return { theme: 'light', toggleTheme: () => {} };
}