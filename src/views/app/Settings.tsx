import { useAuthStore } from "../../store/useAuthStore";

export default function Settings() {
  const { user, logout, logoutAll } = useAuthStore();

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h2 className="text-2xl font-bold mb-4">Settings</h2>
      <div className="rounded border p-4 mb-4">
        <div className="text-xs text-gray-500 mb-1">Signed in as</div>
        <div className="text-lg font-semibold">{user?.name || '-'}</div>
        <div className="text-gray-700">{user?.email}</div>
      </div>
      <div className="flex gap-3">
        <button className="h-10 px-4 rounded text-white bg-red-600" onClick={()=>logout()}>Logout</button>
        <button className="h-10 px-4 rounded text-white bg-red-700" onClick={()=>logoutAll()}>Logout all devices</button>
      </div>
      <div className="mt-6 text-gray-400">v1.0.0</div>
    </div>
  );
}
