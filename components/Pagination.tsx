
"use client";
import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
};

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());

    // Sayfa değişince yukarı kaydır
    window.scrollTo({ top: 0, behavior: 'smooth' });

    router.push(`/search?${params.toString()}`);
  };

  // Sayfa numaralarını oluştur (1, 2, ..., 10 gibi akıllı yapı)
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-8 mb-4">
      {/* Önceki Sayfa */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 border border-gray-300 rounded-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed bg-white"
      >
        <ChevronLeft size={16} />
      </button>

      {/* Sayfa Numaraları */}
      {getPageNumbers().map((page, idx) => (
        <button
          key={idx}
          onClick={() => typeof page === 'number' ? handlePageChange(page) : null}
          disabled={typeof page !== 'number'}
          className={`
            px-3 py-1.5 text-sm font-bold border rounded-sm transition-colors
            ${page === currentPage
              ? 'bg-blue-700 text-white border-blue-700'
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}
            ${typeof page !== 'number' ? 'border-none bg-transparent cursor-default' : ''}
          `}
        >
          {page}
        </button>
      ))}

      {/* Sonraki Sayfa */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 border border-gray-300 rounded-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed bg-white"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
