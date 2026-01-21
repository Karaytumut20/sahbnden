import React from 'react';
import CategoryWizard from '@/components/CategoryWizard';

export default function PostAdCategoryPage() {
  return (
    <div className="max-w-[800px] mx-auto py-10 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-[#333] mb-2">Ücretsiz İlan Ver</h1>
        <p className="text-gray-500 text-sm">İlanınızın en doğru kitleye ulaşması için kategoriyi adım adım seçiniz.</p>
      </div>
      <CategoryWizard />
    </div>
  );
}