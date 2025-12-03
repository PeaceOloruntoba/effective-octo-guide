import { useEffect } from "react";
import { toast } from "sonner";
import QuillEditor from "../../components/QuillEditor";
import { useAdminStore } from "../../store/useAdminStore";
import { useNewsletterStore } from "../../store/useNewsletterStore";

export default function Newsletter() {
  const { users, listUsers, loading: usersLoading, error: usersError } = useAdminStore();
  const {
    title,
    body_html,
    exclude_user_ids,
    loading,
    error,
    setTitle,
    setBody,
    toggleExcluded,
    clearSelection,
    send,
  } = useNewsletterStore();

  useEffect(() => {
    listUsers();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await send();
    if (res) {
      toast.success("Newsletter sent", {
        description: `Recipients: ${res.recipients}, sent: ${res.sent}`,
      });
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4">Send Newsletter</h1>

      {/* Errors */}
      {(usersError || error) && (
        <div className="mb-4 text-red-600">{usersError || error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left: user multiselect (exclude list) */}
        <div className="md:col-span-1 border rounded-md bg-white overflow-hidden">
          <div className="px-3 py-2 border-b flex items-center justify-between">
            <div className="font-medium">Exclude recipients</div>
            <button
              type="button"
              onClick={clearSelection}
              className="text-xs px-2 py-1 border rounded hover:bg-gray-50"
            >
              Clear
            </button>
          </div>
          <div className="max-h-[480px] overflow-auto">
            {usersLoading ? (
              <div className="p-3 text-sm text-gray-500">Loading users...</div>
            ) : users.length === 0 ? (
              <div className="p-3 text-sm text-gray-500">No users</div>
            ) : (
              <ul className="divide-y">
                {users.map((u: any) => (
                  <li key={u.id} className="flex items-center gap-2 p-2">
                    <input
                      id={`u-${u.id}`}
                      type="checkbox"
                      checked={exclude_user_ids.includes(u.id)}
                      onChange={() => toggleExcluded(u.id)}
                      className="h-4 w-4"
                    />
                    <label htmlFor={`u-${u.id}`} className="cursor-pointer text-sm">
                      <div className="font-medium">{u.email}</div>
                      <div className="text-gray-500">{u.name || "-"}</div>
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="px-3 py-2 border-t text-xs text-gray-500">
            Excluding {exclude_user_ids.length} user(s)
          </div>
        </div>

        {/* Right: compose */}
        <form onSubmit={onSubmit} className="md:col-span-2 space-y-3 max-h-[480px]">
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Title (subject)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className="border rounded">
            <QuillEditor
              value={body_html}
              onChange={setBody}
              placeholder="Write your newsletter..."
              className="h-full"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={loading || !title || !body_html}
              className="h-10 px-4 rounded bg-primary text-white disabled:opacity-60 hover:bg-primary/90 transition"
            >
              {loading ? "Sending..." : "Send newsletter"}
            </button>
            <span className="text-xs text-gray-500">Will send to all verified users except those excluded</span>
          </div>
        </form>
      </div>
    </div>
  );
}
