"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getProfileClient } from '@/lib/services';
import { updateProfileAction, updatePasswordAction } from '@/lib/actions';
import { useToast } from '@/context/ToastContext';
import { Loader2, Save, Lock, User, Phone, Shield } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import AvatarUploader from '@/components/ui/AvatarUploader';

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
            setProfile({
              ...data,
              show_phone: data?.show_phone || false,
              full_name: data?.full_name || '',
              phone: data?.phone || '',
              avatar_url: data?.avatar_url || ''
            });
            setLoading(false);
        });
    }
  }, [user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);

    // Veri Temizliği (Sanitization)
    const updateData = {
        full_name: profile.full_name,
        phone: profile.phone,
        avatar_url: profile.avatar_url,
        show_phone: profile.show_phone
    };

    const res = await updateProfileAction(updateData);

    if (res.success) {
        addToast('Profil bilgileri güncellendi.', 'success');
    } else {
        console.error("Update error:", res.error);
        addToast('Güncelleme başarısız: ' + (res.error || 'Bilinmeyen hata'), 'error');
    }
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

  const togglePhoneVisibility = () => {
      setProfile((prev: any) => ({ ...prev, show_phone: !prev.show_phone }));
  };

  // Sonsuz döngüyü kıran, sadece URL alan basit handler
  const handleAvatarChange = (url: string | null) => {
    setProfile((prev: any) => ({ ...prev, avatar_url: url }));
  };

  if (loading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-indigo-600"/></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <h1 className="text-2xl font-bold text-gray-800 border-b border-gray-200 pb-4">Hesap Ayarları</h1>

      <div className="grid md:grid-cols-2 gap-8">

        {/* Profil Bilgileri */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit">
            <h2 className="font-bold text-lg mb-6 flex items-center gap-2 text-indigo-900">
                <User size={20}/> Kişisel Bilgiler
            </h2>

            <form onSubmit={handleProfileUpdate} className="space-y-6">

                {/* YENİ AVATAR BİLEŞENİ */}
                <div className="flex justify-center pb-4 border-b border-gray-50">
                    <AvatarUploader
                        currentImage={profile.avatar_url}
                        onImageChange={handleAvatarChange}
                    />
                </div>

                <div className="space-y-4">
                  <Input
                    label="Ad Soyad"
                    value={profile.full_name || ''}
                    onChange={(e) => setProfile({...profile, full_name: e.target.value})}
                    placeholder="Adınız ve Soyadınız"
                    // required attribute kaldırıldı, boş bırakılabilir
                  />

                  <Input
                    label="Profil Fotoğrafı URL (Opsiyonel)"
                    value={profile.avatar_url || ''}
                    onChange={(e) => setProfile({...profile, avatar_url: e.target.value})}
                    placeholder="https://..."
                    className="text-xs"
                  />

                  {/* Telefon ve Gizlilik Ayarı */}
                  <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100 space-y-3">
                      <Input
                          label="Cep Telefonu"
                          value={profile.phone || ''}
                          onChange={(e) => setProfile({...profile, phone: e.target.value})}
                          placeholder="05XX XXX XX XX"
                          className="bg-white"
                          // required kaldırıldı
                      />

                      <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center gap-2 text-sm text-indigo-900 font-medium">
                              <Phone size={16} />
                              <span>İlanlarda numaram görünsün</span>
                          </div>
                          <button
                              type="button"
                              onClick={togglePhoneVisibility}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${profile.show_phone ? 'bg-indigo-600' : 'bg-gray-300'}`}
                          >
                              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${profile.show_phone ? 'translate-x-6' : 'translate-x-1'}`} />
                          </button>
                      </div>
                      <p className="text-[10px] text-gray-500 leading-tight">
                          {profile.show_phone
                              ? 'Şu an numaranız tüm ziyaretçilere görünmektedir.'
                              : 'Numaranız gizli. Alıcılar sadece site üzerinden mesaj atabilir.'}
                      </p>
                  </div>
                </div>

                <div className="pt-2">
                    <button type="submit" disabled={savingProfile} className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50 flex justify-center items-center gap-2 transition-colors shadow-md shadow-indigo-100">
                        {savingProfile ? <Loader2 size={18} className="animate-spin"/> : <Save size={18}/>}
                        Değişiklikleri Kaydet
                    </button>
                </div>
            </form>
        </div>

        {/* Şifre Değiştirme */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit">
            <h2 className="font-bold text-lg mb-6 flex items-center gap-2 text-indigo-900">
                <Lock size={20}/> Şifre Güvenliği
            </h2>
            <form onSubmit={handlePasswordUpdate} className="space-y-5">
                <Input label="Yeni Şifre" type="password" value={passwords.new} onChange={(e) => setPasswords({...passwords, new: e.target.value})} placeholder="••••••" />
                <Input label="Yeni Şifre (Tekrar)" type="password" value={passwords.confirm} onChange={(e) => setPasswords({...passwords, confirm: e.target.value})} placeholder="••••••" />

                <div className="bg-yellow-50 p-4 rounded-lg text-xs text-yellow-800 border border-yellow-200 flex gap-2">
                    <Shield size={16} className="shrink-0 mt-0.5" />
                    <p>Güvenliğiniz için şifrenizi kimseyle paylaşmayınız ve tahmin edilmesi zor bir şifre seçiniz.</p>
                </div>

                <div className="pt-2">
                    <button type="submit" disabled={savingPassword} className="w-full bg-slate-800 text-white py-2.5 rounded-lg font-bold hover:bg-slate-900 disabled:opacity-50 flex justify-center items-center gap-2 transition-colors shadow-md">
                        {savingPassword ? <Loader2 size={18} className="animate-spin"/> : 'Şifreyi Güncelle'}
                    </button>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
}