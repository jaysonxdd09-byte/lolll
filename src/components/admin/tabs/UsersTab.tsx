import React, { useState, useEffect } from 'react';
import { pb } from '../../../lib/pbClient';
import { ShieldAlert, ShieldCheck } from 'lucide-react';

export default function UsersTab() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Failsafe timeout
      const timeoutId = setTimeout(() => setLoading(false), 3000);
      
      const data = await pb.collection('users').getFullList({
        sort: '-created'
      });
      clearTimeout(timeoutId);
      
      const mappedData = data.map(item => ({
        ...item,
        created_at: item.created,
        updated_at: item.updated
      }));
      setUsers(mappedData);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (id: string, newRole: string) => {
    await pb.collection('users').update(id, { role: newRole });
    fetchUsers();
  };

  if (loading) return <div>Loading users...</div>;

  return (
    <div>
      <h3 className="text-2xl font-serif text-gray-900 mb-6">User Management</h3>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-500">
            <tr>
              <th className="px-6 py-4 font-medium">Email</th>
              <th className="px-6 py-4 font-medium">User ID</th>
              <th className="px-6 py-4 font-medium">Joined</th>
              <th className="px-6 py-4 font-medium">Role</th>
              <th className="px-6 py-4 font-medium text-right">Access Level</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50/50">
                <td className="px-6 py-4 text-gray-900 font-medium">{u.email || 'N/A'}</td>
                <td className="px-6 py-4 font-mono text-xs text-gray-500">{u.id}</td>
                <td className="px-6 py-4 text-gray-500">{new Date(u.created_at).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <select 
                    value={u.role}
                    onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                    className={`text-xs rounded-lg block p-2 border ${
                      u.role === 'admin' ? 'bg-gold-50 border-gold-200 text-gold-700' :
                      u.role === 'staff' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                      'bg-gray-50 border-gray-200 text-gray-700'
                    }`}
                  >
                    <option value="customer">Customer</option>
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-right">
                  {u.role === 'admin' ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-gold-600"><ShieldCheck className="w-3 h-3" /> Full Access</span>
                  ) : u.role === 'staff' ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-blue-600"><ShieldCheck className="w-3 h-3" /> Limited</span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-gray-400"><ShieldAlert className="w-3 h-3" /> None</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
