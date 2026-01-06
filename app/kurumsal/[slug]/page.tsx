
import React from 'react';
import { notFound } from 'next/navigation';
import { corporatePages } from '@/lib/contentData';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default async function CorporatePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = corporatePages[slug];

  if (!page) return notFound();

  return (
    <div className="container max-w-[1000px] mx-auto py-8 px-4 flex flex-col md:flex-row gap-8">

      {/* Sol Menü */}
      <div className="w-full md:w-[250px] shrink-0">
        <div className="bg-white border border-gray-200 rounded-sm shadow-sm">
          <div className="p-4 border-b border-gray-100 font-bold text-[#333]">Kurumsal</div>
          <ul>
            {Object.keys(corporatePages).map(key => (
              <li key={key}>
                <Link
                  href={`/kurumsal/${key}`}
                  className={`block px-4 py-3 text-sm border-b border-gray-50 last:border-0 hover:bg-gray-50 flex items-center justify-between ${slug === key ? 'text-blue-700 font-bold bg-blue-50' : 'text-gray-600'}`}
                >
                  {corporatePages[key].title}
                  {slug === key && <ChevronRight size={14} />}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/iletisim" className="block px-4 py-3 text-sm text-gray-600 hover:bg-gray-50">
                İletişim
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* İçerik */}
      <div className="flex-1 bg-white border border-gray-200 rounded-sm shadow-sm p-8">
        <h1 className="text-2xl font-bold text-[#333] mb-6 border-b border-gray-100 pb-4">
          {page.title}
        </h1>
        <div
          className="text-sm text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </div>

    </div>
  );
}
