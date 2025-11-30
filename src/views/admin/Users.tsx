import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAdminStore } from "../../store/useAdminStore";

export default function AdminUsers() {
  const { users: items, loading, error, listUsers, setRole, block, unblock, forceLogoutAll } = useAdminStore();
  const [q, setQ] = useState("");

  const load = async () => {
    await listUsers(q || undefined);
  };

  useEffect(() => { load(); }, []);

  const onSetRole = async (id: string, role: string) => { try { await setRole(id, role); toast.success("Role updated"); load(); } catch { /* toast handled */ } };
  const onBlock = async (id: string) => { try { await block(id); toast.success("Blocked"); load(); } catch { /* toast handled */ } };
  const onUnblock = async (id: string) => { try { await unblock(id); toast.success("Unblocked"); load(); } catch { /* toast handled */ } };
  const onForceLogoutAll = async (id: string) => { try { await forceLogoutAll(id); toast.success("Logged out all"); } catch { /* toast handled */ } };

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
                  <button className="px-2 py-1 rounded border" onClick={()=>onSetRole(u.id, u.role==='admin'?'user':'admin')}>Set {u.role==='admin'?'user':'admin'}</button>
                  <button className="px-2 py-1 rounded border" onClick={()=>onForceLogoutAll(u.id)}>Logout all</button>
                  {u.blocked ? (
                    <button className="px-2 py-1 rounded border" onClick={()=>onUnblock(u.id)}>Unblock</button>
                  ) : (
                    <button className="px-2 py-1 rounded border" onClick={()=>onBlock(u.id)}>Block</button>
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
