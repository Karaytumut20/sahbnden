"use client";
import React from 'react';
import { usePathname } from 'next/navigation';
import { Check, Layers, FileText, Zap, CreditCard } from 'lucide-react';

const steps = [
  { id: 'category', label: 'Kategori', path: '/ilan-ver', icon: Layers },
  { id: 'details', label: 'İlan Detayı', path: '/ilan-ver/detay', icon: FileText },
  { id: 'doping', label: 'Öne Çıkar', path: '/ilan-ver/doping', icon: Zap },
  { id: 'payment', label: 'Ödeme', path: '/ilan-ver/odeme', icon: CreditCard },
];

export default function PostAdLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Aktif adımı bul
  const activeIndex = steps.findIndex(s => pathname === s.path || pathname.startsWith(s.path + '/'));
  const safeActiveIndex = activeIndex === -1 && pathname.includes('basarili') ? 4 : activeIndex;

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* STEPPER HEADER */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm/50 backdrop-blur-md bg-white/90">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between py-4">

            {steps.map((step, idx) => {
              const isActive = idx === safeActiveIndex;
              const isCompleted = idx < safeActiveIndex;
              const Icon = step.icon;

              return (
                <div key={step.id} className="flex items-center flex-1 last:flex-none relative">
                  <div className={`flex items-center gap-3 relative z-10 ${idx !== steps.length - 1 ? 'w-full' : ''}`}>

                    {/* Circle */}
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 shadow-sm
                      ${isCompleted ? 'bg-green-500 text-white' : isActive ? 'bg-indigo-600 text-white ring-4 ring-indigo-50 scale-110' : 'bg-white border-2 border-gray-200 text-gray-400'}
                    `}>
                      {isCompleted ? <Check size={18} /> : <Icon size={18} />}
                    </div>

                    {/* Label (Hidden on mobile) */}
                    <div className="hidden md:block">
                      <p className={`text-xs font-bold uppercase tracking-wider mb-0.5 ${isActive ? 'text-indigo-600' : isCompleted ? 'text-green-600' : 'text-gray-400'}`}>
                        Adım {idx + 1}
                      </p>
                      <p className={`text-sm font-bold ${isActive || isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                        {step.label}
                      </p>
                    </div>

                    {/* Connecting Line */}
                    {idx !== steps.length - 1 && (
                      <div className="flex-1 h-[2px] mx-4 bg-gray-100 hidden sm:block overflow-hidden rounded-full">
                        <div className={`h-full bg-green-500 transition-all duration-500 ${isCompleted ? 'w-full' : 'w-0'}`}></div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

          </div>
        </div>
      </div>

      {/* CONTENT */}
      <main className="container max-w-5xl mx-auto px-4 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {children}
      </main>
    </div>
  );
}