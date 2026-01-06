
import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function Breadcrumb({ path }) {
  const parts = path.split(' > ');

  return (
    <div className="flex items-center text-[11px] text-gray-500 mb-4 overflow-x-auto whitespace-nowrap">
      <Link href="/" className="hover:underline text-blue-800">Anasayfa</Link>
      {parts.map((part, index) => (
        <React.Fragment key={index}>
          <ChevronRight size={12} className="mx-1 text-gray-400" />
          <span className={index === parts.length - 1 ? 'font-bold text-gray-700' : 'text-blue-800 hover:underline cursor-pointer'}>
            {part}
          </span>
        </React.Fragment>
      ))}
    </div>
  );
}
