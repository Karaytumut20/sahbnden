const fs = require("fs");
const path = require("path");

const rootDir = process.cwd();

// Dosya yazma fonksiyonu
function writeFile(filePath, content) {
  const targetPath = path.join(rootDir, filePath);
  const dirname = path.dirname(targetPath);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }
  fs.writeFileSync(targetPath, content.trim(), "utf8");
  console.log(`✅ Düzeltildi ve Güncellendi: ${filePath}`);
}

// ------------------------------------------------------------------
// 1. AYARLAR SAYFASI (Lacivert tonlar kaldırıldı -> Standart Dark)
// ------------------------------------------------------------------
const settingsPageContent = `
"use client";
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { User, Lock, Bell, Shield, Save } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);

  // Form States
  const [profileData, setProfileData] = useState({ name: user?.name || '', email: user?.email || '', phone: '+90 555 123 45 67' });
  const [securityData, setSecurityData] = useState({ currentPass: '', newPass: '', confirmPass: '', twoFactor: false });
  const [notifData, setNotifData] = useState({ emailAd: true, emailNews: false, smsAd: true, smsSecurity: true });

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      addToast('Ayarlarınız başarıyla güncellendi.', 'success');
    }, 1000);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-sm shadow-sm min-h-[500px] flex flex-col md:flex-row dark:bg-[#1c1c1c] dark:border-gray-700 transition-colors">

      {/* SOL MENÜ */}
      <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 p-4">
        <h2 className="font-bold text-[#333] dark:text-white mb-4 px-2">Hesap Ayarları</h2>
        <nav className="space-y-1">
          <button
            onClick={() => setActiveTab('profile')}
            className={\`w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition-colors \${activeTab === 'profile' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'}\`}
          >
            <User size={18} /> Profil Bilgileri
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={\`w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition-colors \${activeTab === 'security' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'}\`}
          >
            <Lock size={18} /> Şifre ve Güvenlik
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={\`w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition-colors \${activeTab === 'notifications' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'}\`}
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
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center text-xl font-bold text-blue-600 dark:text-blue-400 border-2 border-white dark:border-gray-600">
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
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-sm h-10 px-3 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1">E-posta</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-sm h-10 px-3 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1">Cep Telefonu</label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-sm h-10 px-3 focus:border-blue-500 outline-none"
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
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-sm h-10 px-3 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1">Yeni Şifre</label>
                <input
                  type="password"
                  value={securityData.newPass}
                  onChange={(e) => setSecurityData({...securityData, newPass: e.target.value})}
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-sm h-10 px-3 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1">Yeni Şifre (Tekrar)</label>
                <input
                  type="password"
                  value={securityData.confirmPass}
                  onChange={(e) => setSecurityData({...securityData, confirmPass: e.target.value})}
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-sm h-10 px-3 focus:border-blue-500 outline-none"
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
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
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
                  <p className="text-xs text-gray-500 dark:text-gray-400">Favori ilanlarınızın fiyatı düştüğünde.</p>
                </div>
                <input type="checkbox" checked={notifData.emailAd} onChange={(e) => setNotifData({...notifData, emailAd: e.target.checked})} className="accent-blue-600 w-4 h-4" />
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-gray-700">
                <div>
                  <p className="font-bold text-sm text-[#333] dark:text-white">Kampanya ve Haberler (E-posta)</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Yeni özellikler ve fırsatlar hakkında.</p>
                </div>
                <input type="checkbox" checked={notifData.emailNews} onChange={(e) => setNotifData({...notifData, emailNews: e.target.checked})} className="accent-blue-600 w-4 h-4" />
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-gray-700">
                <div>
                  <p className="font-bold text-sm text-[#333] dark:text-white">İlan Mesajları (SMS)</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Biri ilanınıza mesaj attığında.</p>
                </div>
                <input type="checkbox" checked={notifData.smsAd} onChange={(e) => setNotifData({...notifData, smsAd: e.target.checked})} className="accent-blue-600 w-4 h-4" />
              </div>
            </div>
          </div>
        )}

        {/* KAYDET BUTONU */}
        <div className="mt-8 pt-4 border-t border-gray-100 dark:border-gray-700">
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-blue-700 text-white px-8 py-3 rounded-sm font-bold text-sm hover:bg-blue-800 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            {loading ? 'Kaydediliyor...' : <><Save size={16} /> Değişiklikleri Kaydet</>}
          </button>
        </div>

      </div>
    </div>
  );
}
`;

// ------------------------------------------------------------------
// 2. MESAJLAR SAYFASI (Eski stil kaldırıldı -> Standart Dark)
// ------------------------------------------------------------------
const messagesPageContent = `
"use client";
import React, { useState } from 'react';
import { Search, Send, MoreVertical, Phone } from 'lucide-react';

const mockConversations = [
  { id: 1, name: 'Ahmet Yılmaz', lastMsg: 'Son fiyat ne olur?', time: '14:30', avatar: 'AY', unread: 2 },
  { id: 2, name: 'Mehmet Demir', lastMsg: 'Takas düşünür müsünüz?', time: 'Dün', avatar: 'MD', unread: 0 },
  { id: 3, name: 'Ayşe Kaya', lastMsg: 'Yarın gelip görebilir miyim?', time: 'Pzt', avatar: 'AK', unread: 0 },
];

const mockMessages = [
  { id: 1, sender: 'other', text: 'Merhaba, ilanınızla ilgileniyorum.', time: '14:20' },
  { id: 2, sender: 'me', text: 'Merhaba, buyurun nasıl yardımcı olabilirim?', time: '14:22' },
  { id: 3, sender: 'other', text: 'Son fiyat ne olur? Öğrenciyim de biraz indirim yaparsanız sevinirim.', time: '14:25' },
];

export default function MessagesPage() {
  const [activeChat, setActiveChat] = useState(1);
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState(mockMessages);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    setMessages([...messages, {
      id: Date.now(),
      sender: 'me',
      text: messageInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    setMessageInput('');
  };

  return (
    <div className="bg-white border border-gray-200 rounded-sm shadow-sm h-[calc(100vh-140px)] flex overflow-hidden dark:bg-[#1c1c1c] dark:border-gray-700 transition-colors">

      {/* SOL TARA: KONUŞMA LİSTESİ */}
      <div className="w-[300px] border-r border-gray-200 flex flex-col dark:border-gray-700">
        <div className="p-3 border-b border-gray-200 bg-gray-50 dark:bg-[#151515] dark:border-gray-700">
          <div className="relative">
            <input
              type="text"
              placeholder="Mesajlarda ara..."
              className="w-full border border-gray-300 rounded-full h-8 pl-8 pr-3 text-[12px] focus:outline-none focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
            <Search size={14} className="absolute left-2.5 top-2 text-gray-400" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {mockConversations.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setActiveChat(chat.id)}
              className={\`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 transition-colors dark:border-gray-800 dark:hover:bg-gray-800 \${activeChat === chat.id ? 'bg-blue-50 border-l-4 border-l-blue-600 dark:bg-blue-900/20 dark:border-l-blue-500' : ''}\`}
            >
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-sm shrink-0 dark:bg-gray-700 dark:text-gray-300">
                {chat.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="text-[13px] font-bold text-[#333] truncate dark:text-gray-200">{chat.name}</h4>
                  <span className="text-[10px] text-gray-400 shrink-0">{chat.time}</span>
                </div>
                <p className="text-[11px] text-gray-500 truncate dark:text-gray-400">{chat.lastMsg}</p>
              </div>
              {chat.unread > 0 && (
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                  {chat.unread}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* SAĞ TARAF: SOHBET PENCERESİ */}
      <div className="flex-1 flex flex-col bg-[#efeae2] relative dark:bg-[#0b141a]">
        {/* Sohbet Başlığı */}
        <div className="h-[60px] bg-gray-100 border-b border-gray-200 flex items-center justify-between px-4 shrink-0 dark:bg-[#1c1c1c] dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold text-sm dark:bg-gray-700 dark:text-gray-300">
              AY
            </div>
            <div>
              <h3 className="font-bold text-[#333] text-sm dark:text-white">Ahmet Yılmaz</h3>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">Çevrimiçi</p>
            </div>
          </div>
          <div className="flex gap-4 text-gray-600 dark:text-gray-400">
            <Phone size={20} className="cursor-pointer hover:text-blue-600" />
            <MoreVertical size={20} className="cursor-pointer hover:text-blue-600" />
          </div>
        </div>

        {/* Mesaj Alanı */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 relative">
          {/* Karanlık Mod Arka Plan Deseni */}
          <div className="absolute inset-0 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat opacity-50 dark:opacity-5 pointer-events-none"></div>

          {messages.map((msg) => (
            <div key={msg.id} className={\`flex relative z-10 \${msg.sender === 'me' ? 'justify-end' : 'justify-start'}\`}>
              <div className={\`max-w-[70%] rounded-md p-2 shadow-sm text-[13px] relative \${msg.sender === 'me' ? 'bg-[#d9fdd3] text-[#111] dark:bg-[#005c4b] dark:text-white' : 'bg-white text-[#111] dark:bg-[#202c33] dark:text-white'}\`}>
                <p>{msg.text}</p>
                <span className="text-[10px] text-gray-500 block text-right mt-1 ml-2 dark:text-gray-400">{msg.time}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Input Alanı */}
        <div className="bg-gray-100 p-3 border-t border-gray-200 dark:bg-[#1c1c1c] dark:border-gray-700">
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Bir mesaj yazın..."
              className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            />
            <button type="submit" className="bg-blue-600 text-white p-2.5 rounded-full hover:bg-blue-700 transition-colors flex items-center justify-center">
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
`;

// --- DOSYALARI OLUŞTUR ---
writeFile("app/bana-ozel/ayarlar/page.tsx", settingsPageContent);
writeFile("app/bana-ozel/mesajlar/page.tsx", messagesPageContent);

console.log("----------------------------------------------------------");
console.log("🚀 AYARLAR VE MESAJLAR DÜZELTİLDİ!");
console.log("----------------------------------------------------------");
console.log("Artık /bana-ozel/ayarlar sayfası lacivert değil, standart");
console.log("karanlık mod (#1c1c1c) renginde olacak.");
console.log("Mesajlar sayfası da tamamen koyu moda uyumlu.");
console.log("----------------------------------------------------------");
console.log("👉 npm run dev");
