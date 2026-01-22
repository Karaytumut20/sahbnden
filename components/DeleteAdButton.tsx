"use client";
import React from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { useServerAction } from '@/hooks/use-server-action';
import { deleteAdSafeAction } from '@/lib/actions/ad-actions'; // Yeni güvenli action
import { useToast } from '@/context/ToastContext';

export default function DeleteAdButton({ adId }: { adId: number }) {
  const { addToast } = useToast();

  const { runAction, loading } = useServerAction(deleteAdSafeAction, (res: any) => {
      addToast(res?.message || 'İlan silindi.', 'success');
  });

  const handleDelete = () => {
      if(confirm('Bu ilanı silmek istediğinize emin misiniz?')) {
          runAction(adId);
      }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="p-1.5 border border-red-200 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors disabled:opacity-50"
      title="İlanı Sil"
    >
      {loading ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
    </button>
  );
}