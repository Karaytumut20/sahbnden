import React from 'react';
import { getAuditLogsServer } from '@/lib/actions';
import { ScrollText, User, Clock, AlertCircle } from 'lucide-react';

export default async function AdminLogsPage() {
  const logs = await getAuditLogsServer();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <ScrollText size={24} className="text-blue-600" /> Sistem Kayıtları (Audit Logs)
        </h1>
        <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Son 100 işlem</span>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b text-gray-500 uppercase text-xs">
                <tr>
                    <th className="p-4">Kullanıcı</th>
                    <th className="p-4">İşlem (Action)</th>
                    <th className="p-4">Detaylar (Metadata)</th>
                    <th className="p-4 text-right">Zaman</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {logs.length === 0 ? (
                    <tr><td colSpan={4} className="p-8 text-center text-gray-500">Henüz kayıt yok.</td></tr>
                ) : (
                    logs.map((log: any) => (
                        <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                            <td className="p-4">
                                <div className="flex items-center gap-2">
                                    <User size={16} className="text-gray-400"/>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-gray-700">{log.profiles?.full_name || 'Bilinmiyor'}</span>
                                        <span className="text-[10px] text-gray-400">{log.profiles?.email}</span>
                                    </div>
                                </div>
                            </td>
                            <td className="p-4">
                                <span className={`px-2 py-1 rounded text-[10px] font-bold font-mono ${
                                    log.action.includes('ADMIN') ? 'bg-purple-100 text-purple-700' :
                                    log.action.includes('CREATE') ? 'bg-green-100 text-green-700' :
                                    log.action.includes('SPAM') ? 'bg-red-100 text-red-700' :
                                    'bg-blue-100 text-blue-700'
                                }`}>
                                    {log.action}
                                </span>
                            </td>
                            <td className="p-4 text-xs font-mono text-gray-600 max-w-[300px] truncate">
                                {JSON.stringify(log.metadata)}
                            </td>
                            <td className="p-4 text-right text-xs text-gray-500">
                                <div className="flex items-center justify-end gap-1">
                                    <Clock size={12}/>
                                    {new Date(log.created_at).toLocaleString('tr-TR')}
                                </div>
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
      </div>
    </div>
  );
}