import React from 'react';
import { Users, FileText, TrendingUp, AlertCircle } from 'lucide-react';
import { getAdminStatsServer } from '@/lib/actions';

export default async function AdminDashboard() {
  const stats = await getAdminStatsServer();

  const statCards = [
    { title: 'Toplam Üye', value: stats.totalUsers, icon: Users, color: 'bg-blue-500' },
    { title: 'Aktif İlanlar', value: stats.activeAds, icon: FileText, color: 'bg-green-500' },
    { title: 'Toplam Ciro', value: `${stats.totalRevenue} TL`, icon: TrendingUp, color: 'bg-purple-500' },
    { title: 'Bekleyen İşler', value: '0', icon: AlertCircle, color: 'bg-orange-500' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Genel Bakış</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-full text-white ${stat.color}`}>
                <stat.icon size={24} />
              </div>
            </div>
            <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
            <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>
      <div className="text-sm text-gray-500">
        * Veriler gerçek zamanlı olarak veritabanından çekilmektedir.
      </div>
    </div>
  );
}