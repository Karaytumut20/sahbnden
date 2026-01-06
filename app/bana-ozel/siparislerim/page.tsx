
"use client";
import React from 'react';
import { Package, Clock, CheckCircle } from 'lucide-react';

export default function MyOrdersPage() {
  const orders = [
    { id: 'SP-102938', date: '25.01.2025', amount: '350 TL', items: 'Ana Sayfa Vitrini', status: 'completed' },
    { id: 'SP-102939', date: '10.01.2025', amount: '150 TL', items: 'Acil Acil', status: 'completed' },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-6">
      <h2 className="text-xl font-bold text-[#333] mb-6 border-b border-gray-100 pb-2">Siparişlerim</h2>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="border border-gray-200 rounded-sm p-4 flex flex-col md:flex-row justify-between items-center gap-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                <Package size={20} />
              </div>
              <div>
                <p className="font-bold text-[#333] text-sm">{order.items}</p>
                <p className="text-xs text-gray-500">Sipariş No: {order.id}</p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm w-full md:w-auto justify-between md:justify-end">
              <div className="text-gray-600 flex items-center gap-1">
                <Clock size={14} /> {order.date}
              </div>
              <div className="font-bold text-[#333]">{order.amount}</div>
              <div className="flex items-center gap-1 text-green-600 font-bold text-xs bg-green-50 px-2 py-1 rounded">
                <CheckCircle size={12} /> Tamamlandı
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
