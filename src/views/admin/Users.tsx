import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAdminStore } from "../../store/useAdminStore";

export default function AdminUsers() {
  const {
    users: items,
    loading,
    error,
    listUsers,
    setRole,
    block,
    unblock,
    forceLogoutAll,
  } = useAdminStore();
  const [q, setQ] = useState("");

  const load = async () => {
    await listUsers(q || undefined);
  };

  useEffect(() => {
    load();
  }, []);

  const onSetRole = async (id: string, role: string) => {
    try {
      await setRole(id, role);
      toast.success("Role updated");
      load();
    } catch {}
  };
  const onBlock = async (id: string) => {
    try {
      await block(id);
      toast.success("Blocked");
      load();
    } catch {}
  };
  const onUnblock = async (id: string) => {
    try {
      await unblock(id);
      toast.success("Unblocked");
      load();
    } catch {}
  };
  const onForceLogoutAll = async (id: string) => {
    try {
      await forceLogoutAll(id);
      toast.success("Logged out all");
    } catch {}
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      {/* Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-6">
        <input
          className="py-2 rounded border px-3 flex-1"
          placeholder="Search email"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button
          className="h-10 px-4 rounded bg-primary text-white hover:bg-primary/90 transition"
          onClick={load}
        >
          Search
        </button>
      </div>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      {loading ? (
        <div>Loading...</div>
      ) : items.length === 0 ? (
        <div className="text-gray-500">No users found</div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block">
            <table className="w-full text-sm border rounded-md overflow-hidden">
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
                    <td className="p-2">{u.name || "-"}</td>
                    <td className="p-2">{u.role}</td>
                    <td className="p-2 flex flex-wrap gap-2">
                      <ActionButtons
                        user={u}
                        onSetRole={onSetRole}
                        onBlock={onBlock}
                        onUnblock={onUnblock}
                        onForceLogoutAll={onForceLogoutAll}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden grid gap-3">
            {items.map((u) => (
              <div
                key={u.id}
                className="border rounded-md p-4 shadow-sm bg-white"
              >
                <div className="font-semibold text-gray-700">{u.email}</div>
                <div className="text-gray-500 text-sm">{u.name || "-"}</div>
                <div className="mt-1 text-sm font-medium">Role: {u.role}</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <ActionButtons
                    user={u}
                    onSetRole={onSetRole}
                    onBlock={onBlock}
                    onUnblock={onUnblock}
                    onForceLogoutAll={onForceLogoutAll}
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function ActionButtons({
  user,
  onSetRole,
  onBlock,
  onUnblock,
  onForceLogoutAll,
}: any) {
  return (
    <>
      <button
        className="px-2 py-1 rounded border hover:bg-gray-100 transition text-sm"
        onClick={() =>
          onSetRole(user.id, user.role === "admin" ? "user" : "admin")
        }
      >
        Set {user.role === "admin" ? "user" : "admin"}
      </button>
      <button
        className="px-2 py-1 rounded border hover:bg-gray-100 transition text-sm"
        onClick={() => onForceLogoutAll(user.id)}
      >
        Logout all
      </button>
      {user.blocked ? (
        <button
          className="px-2 py-1 rounded border hover:bg-gray-100 transition text-sm"
          onClick={() => onUnblock(user.id)}
        >
          Unblock
        </button>
      ) : (
        <button
          className="px-2 py-1 rounded border hover:bg-gray-100 transition text-sm"
          onClick={() => onBlock(user.id)}
        >
          Block
        </button>
      )}
    </>
  );
}
