import { useAuthStore } from "../../store/useAuthStore";
import { useState } from "react";

export default function AdminSettings() {
  const { user, logout, logoutAll } = useAuthStore();
  const [busy, setBusy] = useState<"logout" | "logoutAll" | null>(null);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 space-y-6">
      <h2 className="text-2xl font-bold">Settings</h2>

      {/* User info card */}
      <div className="rounded-lg border shadow-sm p-6 bg-white space-y-2">
        <div className="text-xs text-gray-500">Signed in as</div>
        <div className="text-lg font-semibold">{user?.first_name}{" "}{user?.last_name}</div>
        <div className="text-gray-700">{user?.email}</div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          className="h-10 px-4 rounded text-white bg-red-600 hover:bg-red-700 disabled:opacity-60 transition"
          disabled={busy !== null}
          onClick={async () => {
            setBusy("logout");
            try {
              await logout();
            } finally {
              setBusy(null);
            }
          }}
        >
          {busy === "logout" ? "Logging out..." : "Logout"}
        </button>
        <button
          className="h-10 px-4 rounded text-white bg-red-700 hover:bg-red-800 disabled:opacity-60 transition"
          disabled={busy !== null}
          onClick={async () => {
            setBusy("logoutAll");
            try {
              await logoutAll();
            } finally {
              setBusy(null);
            }
          }}
        >
          {busy === "logoutAll" ? "Logging out all..." : "Logout all devices"}
        </button>
      </div>

      <div className="mt-6 text-gray-400 text-sm">v1.0.0</div>
    </div>
  );
}
