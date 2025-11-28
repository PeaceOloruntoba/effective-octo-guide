import { useEffect, useState } from "react";
import { api } from "../../utils/api";
import { toast } from "sonner";

export default function AdminUsers() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [q, setQ] = useState("");

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.admin.users(q || undefined);
      setItems(data || []);
    } catch (e: any) {
      setError(e?.response?.data?.error || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const setRole = async (id: string, role: string) => {
    try { await api.admin.setRole(id, role); toast.success("Role updated"); load(); } catch { toast.error("Failed"); }
  };
  const block = async (id: string) => { try { await api.admin.block(id); toast.success("Blocked"); load(); } catch { toast.error("Failed"); } };
  const unblock = async (id: string) => { try { await api.admin.unblock(id); toast.success("Unblocked"); load(); } catch { toast.error("Failed"); } };
  const forceLogoutAll = async (id: string) => { try { await api.admin.forceLogoutAll(id); toast.success("Logged out all"); } catch { toast.error("Failed"); } };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="flex items-center gap-2 mb-4">
        <input className="h-10 rounded border px-3 w-full max-w-md" placeholder="Search email" value={q} onChange={(e)=>setQ(e.target.value)} />
        <button className="h-10 px-3 rounded text-white" style={{background:'#1f444c'}} onClick={load}>Search</button>
      </div>
      {error ? <div className="text-red-600 mb-3">{error}</div> : null}
      {loading ? <div>Loading...</div> : (
        <table className="w-full text-sm border">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-2 border-b">Email</th>
              <th className="text-left p-2 border-b">Name</th>
              <th className="text-left p-2 border-b">Role</th>
              <th className="text-left p-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((u) => (
              <tr key={u.id} className="border-b">
                <td className="p-2">{u.email}</td>
                <td className="p-2">{u.name || '-'}</td>
                <td className="p-2">{u.role}</td>
                <td className="p-2 flex flex-wrap gap-2">
                  <button className="px-2 py-1 rounded border" onClick={()=>setRole(u.id, u.role==='admin'?'user':'admin')}>Set {u.role==='admin'?'user':'admin'}</button>
                  <button className="px-2 py-1 rounded border" onClick={()=>forceLogoutAll(u.id)}>Logout all</button>
                  {u.blocked ? (
                    <button className="px-2 py-1 rounded border" onClick={()=>unblock(u.id)}>Unblock</button>
                  ) : (
                    <button className="px-2 py-1 rounded border" onClick={()=>block(u.id)}>Block</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
