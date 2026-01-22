"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getProfileClient } from '@/lib/services';
import { updateProfileAction, updatePasswordAction } from '@/lib/actions';
import { useToast } from '@/context/ToastContext';
import { Loader2, Save, Lock, User, Camera } from 'lucide-react';
import { Input } from '@/components/ui/Input';

export default function SettingsPage() {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [profile, setProfile] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [passwords, setPasswords] = useState({ new: '', confirm: '' });

  useEffect(() => {
    if (user) {
        getProfileClient(user.id).then((data) => {
            setProfile(data || {});
            setLoading(false);
        });
    }
  }, [user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    const res = await updateProfileAction(profile);
    if (res.success) addToast('Profil bilgileri güncellendi.', 'success');
    else addToast('Güncelleme başarısız.', 'error');
    setSavingProfile(false);
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
        addToast('Şifreler eşleşmiyor.', 'error');
        return;
    }
    if (passwords.new.length < 6) {
        addToast('Şifre en az 6 karakter olmalı.', 'error');
        return;
    }

    setSavingPassword(true);
    const res = await updatePasswordAction(passwords.new);
    if (res.success) {
        addToast('Şifreniz başarıyla değiştirildi.', 'success');
        setPasswords({ new: '', confirm: '' });
    } else {
        addToast(res.error || 'Şifre değiştirilemedi.', 'error');
    }
    setSavingPassword(false);
  };

  if (loading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin"/></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-gray-800 border-b pb-4">Üyelik Bilgilerim</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Profil Bilgileri */}
        <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm h-fit">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2 text-blue-900"><User size={20}/> Kişisel Bilgiler</h2>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="flex justify-center mb-4">
                    <div className="w-24 h-24 bg-gray-100 rounded-full overflow-hidden border border-gray-200 relative group flex items-center justify-center">
                        {profile.avatar_url ? (
                            <img src={profile.avatar_url} className="w-full h-full object-cover"/>
                        ) : (
                            <User size={32} className="text-gray-400"/>
                        )}
                    </div>
                </div>

                <Input label="Ad Soyad" value={profile.full_name || ''} onChange={(e) => setProfile({...profile, full_name: e.target.value})} />
                <Input label="Telefon" value={profile.phone || ''} onChange={(e) => setProfile({...profile, phone: e.target.value})} placeholder="05XX XXX XX XX" />
                <Input label="Profil Fotoğrafı URL" value={profile.avatar_url || ''} onChange={(e) => setProfile({...profile, avatar_url: e.target.value})} placeholder="https://..." />

                <div className="pt-2">
                    <button type="submit" disabled={savingProfile} className="w-full bg-blue-600 text-white py-2 rounded-sm font-bold hover:bg-blue-700 disabled:opacity-50 flex justify-center items-center gap-2">
                        {savingProfile && <Loader2 size={16} className="animate-spin"/>} Bilgileri Güncelle
                    </button>
                </div>
            </form>
        </div>

        {/* Şifre Değiştirme */}
        <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm h-fit">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2 text-blue-900"><Lock size={20}/> Şifre Değiştir</h2>
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <Input label="Yeni Şifre" type="password" value={passwords.new} onChange={(e) => setPasswords({...passwords, new: e.target.value})} />
                <Input label="Yeni Şifre (Tekrar)" type="password" value={passwords.confirm} onChange={(e) => setPasswords({...passwords, confirm: e.target.value})} />

                <div className="bg-yellow-50 p-3 rounded text-xs text-yellow-800 border border-yellow-200">
                    Güvenliğiniz için şifrenizi kimseyle paylaşmayınız.
                </div>

                <div className="pt-2">
                    <button type="submit" disabled={savingPassword} className="w-full bg-gray-800 text-white py-2 rounded-sm font-bold hover:bg-gray-900 disabled:opacity-50 flex justify-center items-center gap-2">
                        {savingPassword && <Loader2 size={16} className="animate-spin"/>} Şifreyi Güncelle
                    </button>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
}