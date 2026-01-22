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
  if (loading) return <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-indigo-600"/></div>;

  const activeCount = stats.filter(s => s.status === 'yayinda').length;
  const pendingCount = stats.filter(s => s.status === 'onay_bekliyor').length;
  const totalViews = stats.reduce((acc, curr) => acc + (curr.view_count || 0), 0);

  const statusData = [
    { name: 'Yayında', value: activeCount, color: '#10B981' },
    { name: 'Bekleyen', value: pendingCount, color: '#F59E0B' },
    { name: 'Pasif', value: stats.length - activeCount - pendingCount, color: '#EF4444' }
  ];

  const priceData = stats.slice(0, 10).map((ad, i) => ({
      name: `#${i+1}`,
      views: ad.view_count || 0
  }));

  const StatCard = ({ title, value, icon: Icon, colorClass, bgClass }: any) => (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg ${bgClass}`}>
          <Icon className={colorClass} size={24}/>
        </div>
        <div>
          <p className="text-sm text-slate-500 font-medium">{title}</p>
          <p className="text-2xl font-bold text-slate-800">{value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Hoş Geldiniz, {user.name}</h1>
          <p className="text-slate-500 mt-1">İlanlarınızın performans özeti ve hesap durumunuz.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Toplam İlan" value={stats.length} icon={List} colorClass="text-blue-600" bgClass="bg-blue-50" />
            <StatCard title="Yayında" value={activeCount} icon={CheckCircle} colorClass="text-green-600" bgClass="bg-green-50" />
            <StatCard title="Onay Bekleyen" value={pendingCount} icon={Clock} colorClass="text-yellow-600" bgClass="bg-yellow-50" />
            <StatCard title="Görüntülenme" value={totalViews} icon={Eye} colorClass="text-purple-600" bgClass="bg-purple-50" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-6">İlan Durum Dağılımı</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                          <Pie data={statusData} cx="50%" cy="50%" innerRadius={80} outerRadius={100} paddingAngle={5} dataKey="value">
                              {statusData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                              ))}
                          </Pie>
                          <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                      </PieChart>
                  </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-6">En Çok Görüntülenenler</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={priceData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                          <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                          <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                          <Bar dataKey="views" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={32} />
                      </BarChart>
                  </ResponsiveContainer>
                </div>
            </div>
        </div>
    </div>
  );
}