import React from 'react';
import { ArrowUpRight, ArrowDownLeft, Clock } from 'lucide-react';

export default function TransactionHistory({ transactions }: { transactions: any[] }) {
  if (transactions.length === 0) {
    return (
        <div className="bg-white border border-gray-200 rounded-sm p-8 text-center text-gray-500 text-sm">
            Henüz bir işlem hareketiniz bulunmuyor.
        </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50">
            <h3 className="font-bold text-gray-700 text-sm">Son İşlemler</h3>
        </div>
        <div className="divide-y divide-gray-100">
            {transactions.map((trx) => (
                <div key={trx.id} className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-full ${trx.type === 'deposit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                            {trx.type === 'deposit' ? <ArrowDownLeft size={20}/> : <ArrowUpRight size={20}/>}
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-800">{trx.description}</p>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                <Clock size={10}/> {new Date(trx.created_at).toLocaleDateString()} - {new Date(trx.created_at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                            </p>
                        </div>
                    </div>
                    <div className={`text-sm font-bold ${trx.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>
                        {trx.type === 'deposit' ? '+' : '-'}{Number(trx.amount).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
}