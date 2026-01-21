"use client";
import React, { useState } from 'react';
import { DollarSign, CheckCircle, Clock, Search, Filter } from 'lucide-react';

export default function AdminPaymentsPage() {
  // Demo Veriler
  const [payments] = useState([
    { id: 'TRX-987123', user: 'Ahmet Yılmaz', amount: 350, type: 'Doping: Vitrin', status: 'success', date: '25.01.2025 14:30' },
    { id: 'TRX-987124', user: 'Ayşe Demir', amount: 150, type: 'Doping: Acil', status: 'success', date: '25.01.2025 12:15' },
    { id: 'TRX-987125', user: 'Mehmet Kara', amount: 500, type: 'Mağaza Üyeliği', status: 'pending', date: '24.01.2025 09:00' },
    { id: 'TRX-987126', user: 'Zeynep Su', amount: 90, type: 'Doping: Kalın Yazı', status: 'failed', date: '23.01.2025 16:45' },
  ]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Ödemeler ve Ciro</h1>
        <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50">
                <Filter size={16}/> Filtrele
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-bold hover:bg-blue-700">
                <DollarSign size={16}/> Rapor İndir
            </button>
        </div>
      </div>

      {/* Özet Kartlar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <p className="text-gray-500 text-xs font-bold uppercase mb-1">Toplam Ciro (Aylık)</p>
            <p className="text-2xl font-bold text-blue-900">45.250 TL</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <p className="text-gray-500 text-xs font-bold uppercase mb-1">Başarılı İşlem</p>
            <p className="text-2xl font-bold text-green-600">124 Adet</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <p className="text-gray-500 text-xs font-bold uppercase mb-1">Bekleyen Ödeme</p>
            <p className="text-2xl font-bold text-orange-500">1.200 TL</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
            <h3 className="font-bold text-gray-700 text-sm">Son İşlemler</h3>
            <div className="relative">
                <input type="text" placeholder="İşlem No veya Kullanıcı Ara" className="pl-8 pr-3 py-1.5 border border-gray-300 rounded-md text-xs focus:outline-none focus:border-blue-500 w-64"/>
                <Search size={14} className="absolute left-2.5 top-2 text-gray-400"/>
            </div>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b text-gray-500">
            <tr>
              <th className="p-4 font-medium">İşlem No</th>
              <th className="p-4 font-medium">Kullanıcı</th>
              <th className="p-4 font-medium">Hizmet</th>
              <th className="p-4 font-medium">Tutar</th>
              <th className="p-4 font-medium">Tarih</th>
              <th className="p-4 font-medium">Durum</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {payments.map((payment) => (
              <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 font-mono text-xs text-gray-500">{payment.id}</td>
                <td className="p-4 font-bold text-gray-800">{payment.user}</td>
                <td className="p-4 text-gray-600">{payment.type}</td>
                <td className="p-4 font-bold text-gray-800">{payment.amount} TL</td>
                <td className="p-4 text-xs text-gray-500">{payment.date}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit ${
                    payment.status === 'success' ? 'bg-green-100 text-green-700' :
                    payment.status === 'pending' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {payment.status === 'success' && <CheckCircle size={12}/>}
                    {payment.status === 'pending' && <Clock size={12}/>}
                    {payment.status === 'success' ? 'Başarılı' : payment.status === 'pending' ? 'Bekliyor' : 'Hatalı'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}