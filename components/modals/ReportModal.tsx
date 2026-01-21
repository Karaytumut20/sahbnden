"use client";
import React, { useState } from 'react';
import { useModal } from '@/context/ModalContext';
import { X, AlertTriangle, Loader2 } from 'lucide-react';
import { createReportAction } from '@/lib/actions';
import { useToast } from '@/context/ToastContext';

export default function ReportModal() {
  const { isReportOpen, closeReport, reportData } = useModal();
  const { addToast } = useToast();
  const [reason, setReason] = useState('yaniltici');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isReportOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportData?.adId) return;

    setLoading(true);
    const res = await createReportAction(reportData.adId, reason, description);
    setLoading(false);

    if (res.error) {
        addToast(res.error, 'error');
    } else {
        addToast('Şikayetiniz alındı. Teşekkür ederiz.', 'success');
        closeReport();
        setDescription('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-md w-full max-w-md shadow-xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <AlertTriangle className="text-red-500" size={20} /> İlanı Şikayet Et
          </h3>
          <button onClick={closeReport} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Şikayet Nedeni</label>
            <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full border border-gray-300 rounded-sm h-10 px-3 text-sm outline-none focus:border-blue-500"
            >
                <option value="yaniltici">Yanıltıcı Bilgi / Fotoğraf</option>
                <option value="dolandiricilik">Dolandırıcılık Şüphesi</option>
                <option value="kufur">Küfür / Hakaret</option>
                <option value="kategori">Yanlış Kategori</option>
                <option value="diger">Diğer</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Açıklama (İsteğe Bağlı)</label>
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-gray-300 rounded-sm p-3 text-sm h-24 resize-none outline-none focus:border-blue-500"
                placeholder="Lütfen detay veriniz..."
            ></textarea>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={closeReport} className="px-4 py-2 text-gray-600 text-sm font-bold hover:bg-gray-100 rounded-sm">Vazgeç</button>
            <button
                type="submit"
                disabled={loading}
                className="bg-red-600 text-white px-6 py-2 rounded-sm text-sm font-bold hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
            >
                {loading && <Loader2 size={16} className="animate-spin" />} Şikayet Et
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}