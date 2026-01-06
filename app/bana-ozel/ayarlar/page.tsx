
"use client";
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { User, Lock, Bell, Shield, Save } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications'>('profile');
  const [loading, setLoading] = useState(false);

  // Form States
  const [profileData, setProfileData] = useState({ name: user?.name || '', email: user?.email || '', phone: '+90 555 123 45 67' });
  const [securityData, setSecurityData] = useState({ currentPass: '', newPass: '', confirmPass: '', twoFactor: false });
  const [notifData, setNotifData] = useState({ emailAd: true, emailNews: false, smsAd: true, smsSecurity: true });

  const handleSave = () => {
    setLoading(true);
    // API Simülasyonu
    setTimeout(() => {
      setLoading(false);
      addToast('Ayarlarınız başarıyla güncellendi.', 'success');
    }, 1000);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-sm shadow-sm min-h-[500px] flex flex-col md:flex-row dark:bg-gray-800 dark:border-gray-700">

      {/* SOL MENÜ */}
      <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 p-4">
        <h2 className="font-bold text-[#333] dark:text-white mb-4 px-2">Hesap Ayarları</h2>
        <nav className="space-y-1">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition-colors ${activeTab === 'profile' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'}`}
          >
            <User size={18} /> Profil Bilgileri
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition-colors ${activeTab === 'security' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'}`}
          >
            <Lock size={18} /> Şifre ve Güvenlik
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition-colors ${activeTab === 'notifications' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'}`}
          >
            <Bell size={18} /> Bildirim Tercihleri
          </button>
        </nav>
      </div>

      {/* SAĞ İÇERİK */}
      <div className="flex-1 p-6 md:p-8">

        {/* PROFİL SEKMESİ */}
        {activeTab === 'profile' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-left-2 duration-300">
            <div>
              <h3 className="text-lg font-bold text-[#333] dark:text-white mb-1">Profil Bilgileri</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Kişisel bilgilerinizi buradan güncelleyebilirsiniz.</p>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-xl font-bold text-blue-600 dark:text-blue-300">
                {user?.avatar || 'U'}
              </div>
              <button className="text-sm text-blue-700 font-bold hover:underline dark:text-blue-400">Fotoğrafı Değiştir</button>
            </div>

            <div className="grid gap-4 max-w-md">
              <div>
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1">Ad Soyad</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-sm h-10 px-3 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1">E-posta</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-sm h-10 px-3 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1">Cep Telefonu</label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-sm h-10 px-3 focus:border-blue-500 outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* GÜVENLİK SEKMESİ */}
        {activeTab === 'security' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-left-2 duration-300">
            <div>
              <h3 className="text-lg font-bold text-[#333] dark:text-white mb-1">Şifre ve Güvenlik</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Hesap güvenliğinizi artırmak için güçlü bir şifre kullanın.</p>
            </div>

            <div className="grid gap-4 max-w-md border-b border-gray-100 dark:border-gray-700 pb-6">
              <div>
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1">Mevcut Şifre</label>
                <input
                  type="password"
                  value={securityData.currentPass}
                  onChange={(e) => setSecurityData({...securityData, currentPass: e.target.value})}
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-sm h-10 px-3 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1">Yeni Şifre</label>
                <input
                  type="password"
                  value={securityData.newPass}
                  onChange={(e) => setSecurityData({...securityData, newPass: e.target.value})}
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-sm h-10 px-3 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1">Yeni Şifre (Tekrar)</label>
                <input
                  type="password"
                  value={securityData.confirmPass}
                  onChange={(e) => setSecurityData({...securityData, confirmPass: e.target.value})}
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-sm h-10 px-3 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            <div>
              <h4 className="font-bold text-sm text-[#333] dark:text-white mb-3 flex items-center gap-2">
                <Shield size={16} className="text-green-600" /> İki Aşamalı Doğrulama (2FA)
              </h4>
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={securityData.twoFactor}
                    onChange={(e) => setSecurityData({...securityData, twoFactor: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Giriş yaparken telefonuma SMS kodu gönder.
                </span>
              </label>
            </div>
          </div>
        )}

        {/* BİLDİRİMLER SEKMESİ */}
        {activeTab === 'notifications' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-left-2 duration-300">
            <div>
              <h3 className="text-lg font-bold text-[#333] dark:text-white mb-1">Bildirim Tercihleri</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Hangi konularda bildirim almak istediğinizi seçin.</p>
            </div>

            <div className="space-y-4 max-w-lg">
              <div className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-gray-700">
                <div>
                  <p className="font-bold text-sm text-[#333] dark:text-white">İlan Güncellemeleri (E-posta)</p>
                  <p className="text-xs text-gray-500">Favori ilanlarınızın fiyatı düştüğünde.</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifData.emailAd}
                  onChange={(e) => setNotifData({...notifData, emailAd: e.target.checked})}
                  className="accent-blue-600 w-4 h-4"
                />
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-gray-700">
                <div>
                  <p className="font-bold text-sm text-[#333] dark:text-white">Kampanya ve Haberler (E-posta)</p>
                  <p className="text-xs text-gray-500">Yeni özellikler ve fırsatlar hakkında.</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifData.emailNews}
                  onChange={(e) => setNotifData({...notifData, emailNews: e.target.checked})}
                  className="accent-blue-600 w-4 h-4"
                />
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-gray-700">
                <div>
                  <p className="font-bold text-sm text-[#333] dark:text-white">İlan Mesajları (SMS)</p>
                  <p className="text-xs text-gray-500">Biri ilanınıza mesaj attığında.</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifData.smsAd}
                  onChange={(e) => setNotifData({...notifData, smsAd: e.target.checked})}
                  className="accent-blue-600 w-4 h-4"
                />
              </div>
            </div>
          </div>
        )}

        {/* KAYDET BUTONU */}
        <div className="mt-8 pt-4 border-t border-gray-100 dark:border-gray-700">
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-blue-700 text-white px-8 py-3 rounded-sm font-bold text-sm hover:bg-blue-800 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Kaydediliyor...' : <><Save size={16} /> Değişiklikleri Kaydet</>}
          </button>
        </div>

      </div>
    </div>
  );
}
