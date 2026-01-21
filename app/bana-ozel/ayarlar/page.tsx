"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { User, Save, Camera, Loader2 } from 'lucide-react';
import { getProfileClient, updateProfileClient, uploadImageClient } from '@/lib/services';

export default function SettingsPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({ name: '', email: '', phone: '', avatar_url: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      getProfileClient(user.id).then(data => {
        if (data) setProfileData({ name: data.full_name || '', email: data.email || '', phone: data.phone || '', avatar_url: data.avatar_url || '' });
      });
    }
  }, [user]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length || !user) return;
    setLoading(true);
    try {
      const publicUrl = await uploadImageClient(e.target.files[0]);
      await updateProfileClient(user.id, { avatar_url: publicUrl });
      setProfileData(prev => ({ ...prev, avatar_url: publicUrl }));
      addToast('Fotoğraf güncellendi.', 'success');
    } catch { addToast('Hata oluştu.', 'error'); } finally { setLoading(false); }
  };

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    const { error } = await updateProfileClient(user.id, { full_name: profileData.name, phone: profileData.phone });
    if (!error) addToast('Kaydedildi.', 'success');
    else addToast('Hata.', 'error');
    setLoading(false);
  };

  if (!user) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-sm p-8 dark:bg-[#1c1c1c] dark:border-gray-700">
      <h2 className="font-bold text-lg mb-6 dark:text-white">Profil Ayarları</h2>
      <div className="flex items-center gap-4 mb-6">
        <div className="w-20 h-20 bg-gray-100 rounded-full overflow-hidden border">
          {profileData.avatar_url ? <img src={profileData.avatar_url} className="w-full h-full object-cover"/> : <User className="w-full h-full p-4 text-gray-400"/>}
        </div>
        <button onClick={() => fileInputRef.current?.click()} className="text-blue-600 text-sm font-bold hover:underline">Değiştir</button>
        <input type="file" ref={fileInputRef} className="hidden" onChange={handleAvatarUpload} accept="image/*" />
      </div>
      <div className="space-y-4 max-w-md">
        <input value={profileData.name} onChange={e => setProfileData({...profileData, name: e.target.value})} className="w-full border p-2 rounded-sm" placeholder="Ad Soyad" />
        <input value={profileData.phone} onChange={e => setProfileData({...profileData, phone: e.target.value})} className="w-full border p-2 rounded-sm" placeholder="Telefon" />
        <button onClick={handleSave} disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded-sm font-bold text-sm flex items-center gap-2">
          {loading ? <Loader2 className="animate-spin"/> : <Save size={16}/>} Kaydet
        </button>
      </div>
    </div>
  );
}