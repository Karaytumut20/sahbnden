import React from 'react';

export default function AdDetailLoading() {
  return (
    <div className="pb-20 animate-pulse">
      {/* Header Skeleton */}
      <div className="h-[60px] bg-white border-b border-gray-200 mb-4 hidden md:block"></div>

      {/* Breadcrumb */}
      <div className="h-4 bg-gray-200 rounded w-1/3 mb-6"></div>

      {/* Title */}
      <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-6">
         <div className="h-8 bg-gray-200 rounded w-1/2"></div>
         <div className="flex gap-2">
            <div className="w-20 h-6 bg-gray-200 rounded"></div>
            <div className="w-20 h-6 bg-gray-200 rounded"></div>
         </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
         {/* Sol Kolon (Galeri) */}
         <div className="lg:w-[600px] shrink-0">
            <div className="aspect-[4/3] bg-gray-200 rounded-sm mb-2"></div>
            <div className="flex gap-2 overflow-hidden pb-2">
                {[...Array(5)].map((_, i) => <div key={i} className="w-16 h-12 bg-gray-200 shrink-0 rounded-sm"></div>)}
            </div>
            <div className="h-10 bg-gray-200 rounded mt-4 w-full"></div>
            <div className="h-40 bg-gray-200 rounded mt-4 w-full"></div>
         </div>

         {/* Orta Kolon (Bilgiler) */}
         <div className="flex-1 min-w-0">
            <div className="mb-6">
                <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
            <div className="space-y-2">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="flex justify-between py-3 border-b border-gray-100">
                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </div>
                ))}
            </div>
         </div>

         {/* Sağ Kolon (Satıcı) */}
         <div className="lg:w-[280px] shrink-0 hidden md:block">
            <div className="h-[200px] bg-gray-200 rounded-sm mb-4"></div>
            <div className="h-[150px] bg-gray-200 rounded-sm"></div>
         </div>
      </div>
    </div>
  );
}