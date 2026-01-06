
"use client";
import React, { useState } from 'react';
import { Search, User, Edit, Zap, Shield, ChevronDown, ChevronUp } from 'lucide-react';
import { helpCategories, faqItems } from '@/lib/contentData';

const iconMap: any = { User, Edit, Zap, Shield };

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const filteredFaqs = faqItems.filter(item =>
    item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-[#f6f7f9] min-h-screen pb-10">

      {/* Hero Arama Alanı */}
      <div className="bg-[#2d405a] text-white py-12 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Size nasıl yardımcı olabiliriz?</h1>
        <div className="max-w-[600px] mx-auto relative">
          <input
            type="text"
            placeholder="Sorunuzu buraya yazın (Örn: Şifremi unuttum)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-12 pl-12 pr-4 rounded-sm text-black focus:outline-none shadow-lg"
          />
          <Search className="absolute left-4 top-3.5 text-gray-400" />
        </div>
      </div>

      <div className="container max-w-[1000px] mx-auto px-4 -mt-8 relative z-10">

        {/* Kategoriler */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {helpCategories.map(cat => {
            const Icon = iconMap[cat.icon];
            return (
              <div key={cat.id} className="bg-white p-6 rounded-sm shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-center cursor-pointer">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon size={24} />
                </div>
                <h3 className="font-bold text-[#333] mb-1">{cat.title}</h3>
                <p className="text-xs text-gray-500">{cat.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Sıkça Sorulan Sorular */}
        <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-6">
          <h2 className="text-xl font-bold text-[#333] mb-6 border-b border-gray-100 pb-2">
            {searchTerm ? 'Arama Sonuçları' : 'Sıkça Sorulan Sorular'}
          </h2>

          <div className="space-y-2">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map(item => (
                <div key={item.id} className="border border-gray-100 rounded-sm overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === item.id ? null : item.id)}
                    className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 text-left transition-colors"
                  >
                    <span className="font-semibold text-sm text-[#333]">{item.question}</span>
                    {openFaq === item.id ? <ChevronUp size={16} className="text-gray-500" /> : <ChevronDown size={16} className="text-gray-500" />}
                  </button>
                  {openFaq === item.id && (
                    <div className="p-4 bg-white text-sm text-gray-600 border-t border-gray-100 animate-in slide-in-from-top-2">
                      {item.answer}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">Aradığınız kriterlere uygun sonuç bulunamadı.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
