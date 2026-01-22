"use client";
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getUserDashboardStats } from '@/lib/actions';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Loader2, Eye, List, CheckCircle, Clock } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
        getUserDashboardStats().then((data) => {
            setStats(data || []);
            setLoading(false);
        });
    }
  }, [user]);

  if (!user) return <div className="p-10">Giriş yapmalısınız.</div>;
  if (loading) return <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-blue-600"/></div>;

  // Veri Hazırlığı (Chart için)
  const activeCount = stats.filter(s => s.status === 'yayinda').length;
  const pendingCount = stats.filter(s => s.status === 'onay_bekliyor').length;
  const totalViews = stats.reduce((acc, curr) => acc + (curr.view_count || 0), 0);

  const statusData = [
    { name: 'Yayında', value: activeCount, color: '#22c55e' }, // Yeşil
    { name: 'Onay Bekleyen', value: pendingCount, color: '#eab308' }, // Sarı
    { name: 'Pasif/Red', value: stats.length - activeCount - pendingCount, color: '#ef4444' } // Kırmızı
  ];

  // Fiyat Dağılımı (Bar Chart için basit gruplama)
  const priceData = stats.slice(0, 10).map((ad, i) => ({
      name: `İlan ${i+1}`,
      views: ad.view_count || 0
  }));

  return (
    <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Hoş Geldiniz, {user.name}</h1>

        {/* Özet Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-sm border border-gray-200 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-blue-50 rounded-full"><List className="text-blue-600"/></div>
                <div><p className="text-xs text-gray-500">Toplam İlan</p><p className="text-xl font-bold">{stats.length}</p></div>
            </div>
            <div className="bg-white p-4 rounded-sm border border-gray-200 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-green-50 rounded-full"><CheckCircle className="text-green-600"/></div>
                <div><p className="text-xs text-gray-500">Yayında</p><p className="text-xl font-bold">{activeCount}</p></div>
            </div>
            <div className="bg-white p-4 rounded-sm border border-gray-200 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-yellow-50 rounded-full"><Clock className="text-yellow-600"/></div>
                <div><p className="text-xs text-gray-500">Onay Bekleyen</p><p className="text-xl font-bold">{pendingCount}</p></div>
            </div>
            <div className="bg-white p-4 rounded-sm border border-gray-200 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-purple-50 rounded-full"><Eye className="text-purple-600"/></div>
                <div><p className="text-xs text-gray-500">Toplam Görüntülenme</p><p className="text-xl font-bold">{totalViews}</p></div>
            </div>
        </div>

        {/* Grafikler */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[300px]">
            <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-700 mb-4 text-sm">İlan Durum Dağılımı</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                            {statusData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-700 mb-4 text-sm">İlan Performansı (Görüntülenme)</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={priceData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" hide />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="views" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    </div>
  );
}