import React from 'react';
import { notFound } from 'next/navigation';
import { MapPin, Phone, Globe, Star } from 'lucide-react';
import { getStoreBySlugServer, getStoreAdsServer } from '@/lib/actions';
import Link from 'next/link';

export default async function StorePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const store = await getStoreBySlugServer(slug);

  if (!store) return notFound();
  const storeAds = await getStoreAdsServer(store.user_id);

  return (
    <div className="bg-[#f6f7f9] min-h-screen">
      <div className="h-[200px] w-full bg-gray-300 relative overflow-hidden"><img src={store.banner} className="w-full h-full object-cover"/></div>
      <div className="container max-w-[1150px] mx-auto px-4 -mt-16 relative z-10">
        <div className="bg-white border rounded-sm shadow-sm p-6 flex gap-6 mb-6">
          <div className="w-32 h-32 bg-white p-1 rounded-sm border shrink-0"><img src={store.image} className="w-full h-full object-contain"/></div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-1">{store.name}</h1>
            <div className="flex gap-4 text-sm text-gray-600"><MapPin size={16}/> {store.location} <Phone size={16}/> {store.phone}</div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
            {storeAds.map((ad: any) => (
                <Link href={`/ilan/${ad.id}`} key={ad.id} className="bg-white border p-2 rounded-sm block">
                    <img src={ad.image} className="w-full h-40 object-cover mb-2"/>
                    <div className="font-bold text-sm text-blue-900">{ad.price.toLocaleString()} {ad.currency}</div>
                    <div className="text-xs text-gray-600">{ad.title}</div>
                </Link>
            ))}
        </div>
      </div>
    </div>
  );
}