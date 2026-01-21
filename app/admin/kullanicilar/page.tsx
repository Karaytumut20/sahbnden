
"use client";
import React, { useState, useEffect } from 'react';
import { getAllUsersClient, updateUserStatusClient, updateUserRoleClient } from '@/lib/services';
import { useToast } from '@/context/ToastContext';
import { Search, User, Shield, Ban, CheckCircle, Loader2, MoreHorizontal } from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { addToast } = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    const data = await getAllUsersClient();
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleStatusChange = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'banned' : 'active';
    const actionName = newStatus === 'active' ? 'Ban Kaldırma' : 'Banlama';

    if(!confirm(`Bu kullanıcıya ${actionName} işlemi uygulamak istediğinize emin misiniz?`)) return;

    const { error } = await updateUserStatusClient(userId, newStatus);
    if (error) {
      addToast('İşlem başarısız.', 'error');
    } else {
      addToast(`Kullanıcı durumu: ${newStatus}`, 'success');
      // Listeyi yerel olarak güncelle (Tekrar fetch etmeye gerek yok)
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus } : u));
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    const { error } = await updateUserRoleClient(userId, newRole);
    if (!error) {
      addToast('Rol güncellendi.', 'success');
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    }
  };

  const filteredUsers = users.filter(user =>
    (user.full_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Kullanıcı Yönetimi</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="İsim veya E-posta ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 w-64 text-sm"
          />
          <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-blue-600" /></div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b text-gray-500">
              <tr>
                <th className="p-4 font-medium">Kullanıcı</th>
                <th className="p-4 font-medium">İletişim</th>
                <th className="p-4 font-medium">Rol</th>
                <th className="p-4 font-medium">Durum</th>
                <th className="p-4 font-medium text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                        {user.avatar_url ? <img src={user.avatar_url} className="w-full h-full rounded-full object-cover"/> : (user.full_name?.[0] || 'U')}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{user.full_name || 'İsimsiz'}</p>
                        <p className="text-xs text-gray-400">ID: {user.id.slice(0, 8)}...</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-gray-700">{user.email}</p>
                    <p className="text-xs text-gray-500">{user.phone || 'Telefon Yok'}</p>
                  </td>
                  <td className="p-4">
                    <select
                      value={user.role || 'user'}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className="bg-white border border-gray-200 text-xs rounded p-1 outline-none focus:border-blue-500 cursor-pointer"
                    >
                      <option value="user">Üye</option>
                      <option value="store">Kurumsal</option>
                      <option value="admin">Yönetici</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit ${
                      user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {user.status === 'active' ? <CheckCircle size={12}/> : <Ban size={12}/>}
                      {user.status === 'active' ? 'Aktif' : 'Banlı'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleStatusChange(user.id, user.status)}
                      className={`px-3 py-1.5 rounded-md text-xs font-bold border transition-colors ${
                        user.status === 'active'
                          ? 'border-red-200 text-red-600 hover:bg-red-50'
                          : 'border-green-200 text-green-600 hover:bg-green-50'
                      }`}
                    >
                      {user.status === 'active' ? 'Banla' : 'Banı Kaldır'}
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr><td colSpan={5} className="p-8 text-center text-gray-500">Kullanıcı bulunamadı.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
