import React from 'react';
import { Users, FileText, TrendingUp, AlertCircle, Clock } from 'lucide-react';
import { getAdminStatsServer } from '@/lib/actions';

export default async function AdminDashboard() {
  const stats = await getAdminStatsServer();

  const statCards = [
    { title: 'Toplam Üye', value: stats.totalUsers || 0, icon: Users, color: 'bg-blue-500' },
    { title: 'Aktif İlanlar', value: stats.activeAds || 0, icon: FileText, color: 'bg-green-500' },
    { title: 'Toplam Ciro', value: `${stats.totalRevenue || 0} TL`, icon: TrendingUp, color: 'bg-purple-500' },
    { title: 'Bekleyen İşler', value: '0', icon: AlertCircle, color: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">Yönetim Paneli Genel Bakış</h1>
        <div className="flex items-center gap-2 text-xs text-gray-500 bg-white px-3 py-1.5 rounded-full border border-gray-200 w-fit">
            <Clock size={14} />
            <span>Son Güncelleme: {new Date().toLocaleTimeString('tr-TR')}</span>
        </div>
      </div>

      {/* Responsive Grid Yapısı: Mobilde 1, Tablette 2, Masaüstünde 4 sütun */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white p-5 md:p-6 rounded-xl shadow-sm border border-gray-200 flex flex-row md:flex-col items-center md:items-start gap-4 md:gap-3 hover:shadow-md transition-shadow">
            <div className={`p-3 rounded-xl text-white ${stat.color} shrink-0`}>
              <stat.icon size={24} />
            </div>
            <div className="min-w-0">
              <h3 className="text-gray-500 text-xs md:text-sm font-medium uppercase tracking-wider truncate">{stat.title}</h3>
              <p className="text-xl md:text-2xl font-bold text-gray-800 mt-0.5">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start gap-3">
        <AlertCircle size={20} className="text-blue-600 shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
           <p className="font-bold mb-0.5">Sistem Bilgilendirmesi</p>
           <p className="opacity-90">Veriler gerçek zamanlı olarak veritabanından çekilmektedir. İlan onaylama işlemlerini "İlan Yönetimi" sayfasından yapabilirsiniz.</p>
        </div>
      </div>
    </div>
  );
}