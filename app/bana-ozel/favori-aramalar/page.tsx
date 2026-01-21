"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getSavedSearchesClient, deleteSavedSearchClient } from '@/lib/services';
import { Search, Trash2, Loader2 } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export default function SavedSearchesPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [searches, setSearches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
        getSavedSearchesClient(user.id).then(data => { setSearches(data); setLoading(false); });
    }
  }, [user]);

  const handleRemove = async (id: number) => {
    await deleteSavedSearchClient(id);
    addToast('Silindi.', 'success');
    setSearches(prev => prev.filter(s => s.id !== id));
  };

  if (!user) return <div className="p-6">Giriş yapmalısınız.</div>;
  if (loading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin"/></div>;

  return (
    <div className="bg-white border p-6 rounded-sm">
        <h1 className="text-xl font-bold mb-6">Favori Aramalarım</h1>
        {searches.length === 0 ? <div>Kayıtlı arama yok.</div> : (
            <div className="space-y-2">
                {searches.map(s => (
                    <div key={s.id} className="flex justify-between items-center border-b p-3">
                        <Link href={s.url} className="text-blue-700 font-bold hover:underline">{s.name}</Link>
                        <button onClick={() => handleRemove(s.id)}><Trash2 size={16} className="text-red-500"/></button>
                    </div>
                ))}
            </div>
        )}
    </div>
  );
}