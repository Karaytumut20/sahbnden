
import React from 'react';
import { Users, FileText, ShoppingBag, TrendingUp, AlertCircle } from 'lucide-react';

const stats = [
  { title: 'Toplam Üye', value: '12,450', change: '+12%', icon: Users, color: 'bg-blue-500' },
  { title: 'Aktif İlanlar', value: '8,320', change: '+5%', icon: FileText, color: 'bg-green-500' },
  { title: 'Bekleyen İlanlar', value: '45', change: '-2%', icon: AlertCircle, color: 'bg-orange-500' },
  { title: 'Aylık Ciro', value: '345.000 ₺', change: '+18%', icon: TrendingUp, color: 'bg-purple-500' },
];

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Genel Bakış</h1>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-full text-white ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded ${stat.change.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
            <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Son İlanlar Tablosu */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="font-bold text-gray-800 mb-4">Son Eklenen İlanlar</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-gray-500">
                  <th className="pb-3">İlan Başlığı</th>
                  <th className="pb-3">Kategori</th>
                  <th className="pb-3">Fiyat</th>
                  <th className="pb-3">Durum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="py-3 font-medium text-gray-800">Sahibinden temiz 2018 model...</td>
                    <td className="py-3 text-gray-500">Vasıta</td>
                    <td className="py-3 font-bold text-gray-700">950.000 TL</td>
                    <td className="py-3"><span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold">Yayında</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Son Üyeler */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="font-bold text-gray-800 mb-4">Yeni Üyeler</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600">
                    U{i}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">Kullanıcı Adı {i}</p>
                    <p className="text-xs text-gray-500">user{i}@mail.com</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400">10 dk önce</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
