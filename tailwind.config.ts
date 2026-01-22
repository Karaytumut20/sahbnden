import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // darkMode removed for Global Light Mode
  theme: {
    extend: {
      colors: {
        background: "#F8FAFC",
        foreground: "#0F172A",
        brand: {
            50: '#EEF2FF',
            100: '#E0E7FF',
            500: '#6366F1',
            600: '#4F46E5',
            700: '#4338CA',
            900: '#312E81',
        },
        accent: {
            500: '#f43f5e',
            600: '#e11d48',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 10px 40px -10px rgba(0,0,0,0.05)',
        'card': '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1)',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
      }
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    // require('tailwind-scrollbar') // SİLİNDİ: Yüklü olmadığı için hataya sebep oluyordu.
  ],
} satisfies Config;