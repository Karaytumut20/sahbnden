import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-[11px] text-gray-500 mb-4 overflow-x-auto whitespace-nowrap scrollbar-hide">
      <Link href="/" className="hover:underline text-blue-800 transition-colors">Anasayfa</Link>

      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight size={10} className="mx-1.5 text-gray-400 shrink-0" />
          {item.href ? (
            <Link href={item.href} className="text-blue-800 hover:underline transition-colors font-medium">
              {item.label}
            </Link>
          ) : (
            <span className="font-bold text-gray-700">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}