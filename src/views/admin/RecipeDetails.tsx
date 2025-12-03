import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useRecipesStore } from "../../store/useRecipesStore";
import { Spinner } from "../../components/Spinner";
import QuillEditor from "../../components/QuillEditor";
import { toast } from "sonner";

export default function AdminRecipeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { current, loading, error, get, update, replaceImage, remove } = useRecipesStore();

  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState<{ name: string; category: string; description?: string | null; details?: string | null }>({ name: "", category: "" });
  const [replaceOpen, setReplaceOpen] = useState(false);
  const [replaceUrl, setReplaceUrl] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);
  const [savingImageUrl, setSavingImageUrl] = useState(false);
  const [replacingFile, setReplacingFile] = useState(false);

  useEffect(() => {
    if (id) get(id);
  }, [id]);

  useEffect(() => {
    if (current) {
      setForm({
        name: current.name || "",
        category: current.category || "",
        description: (current as any).description || "",
        details: (current as any).details || "",
      });
    }
  }, [current]);

  const submitEdit = async () => {
    if (!id) return;
    try {
      setSavingEdit(true);
      await update(id, { name: form.name, category: form.category, description: form.description, details: form.details });
      await get(id);
      setEditOpen(false);
      toast.success("Updated");
    } catch (e) {
      toast.error("Failed to update");
    } finally {
      setSavingEdit(false);
    }
  };

  const doReplace = async (file: File) => {
    if (!id) return;
    try {
      setReplacingFile(true);
      const formData = new FormData();
      formData.append("image", file);
      await replaceImage(id, formData);
      await get(id);
      setReplaceOpen(false);
      toast.success("Image replaced");
    } catch {
      toast.error("Failed to replace image");
    } finally {
      setReplacingFile(false);
    }
  };

  const doDelete = async () => {
    if (!id) return;
    try {
      await remove(id);
      toast.success("Deleted");
      navigate("/admin/recipes");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const changeCategory = async () => {
    if (!id) return;
    const cat = prompt("New category", form.category || "");
    if (cat == null) return;
    try {
      await update(id, { category: cat });
      await get(id);
      setForm((f) => ({ ...f, category: cat }));
      toast.success("Category updated");
    } catch {
      toast.error("Failed to update category");
    }
  };

  if (loading && !current) return (
    <div className="mx-auto max-w-5xl px-4 py-6 text-gray-600 flex items-center gap-2"><Spinner /><span>Loading...</span></div>
  );
  if (error) return (
    <div className="mx-auto max-w-5xl px-4 py-6 text-red-600">{error}</div>
  );
  if (!current) return (
    <div className="mx-auto max-w-5xl px-4 py-6 text-gray-500">Recipe not found</div>
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <button className="mb-4 text-sm text-primary underline" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {current.image_url && (
          <img src={current.image_url} alt={current.name} className="w-full h-80 object-cover" />
        )}
        <div className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">{current.name}</h1>
              {current.category && (
                <div className="mt-1 text-xs uppercase text-gray-500">{current.category}</div>
              )}
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 rounded border" onClick={() => setEditOpen(true)}>Edit</button>
              <button className="px-3 py-1.5 rounded border" onClick={() => setReplaceOpen(true)}>Replace image</button>
              <button className="px-3 py-1.5 rounded border" onClick={changeCategory}>Change category</button>
              <button className="px-3 py-1.5 rounded border text-red-600" onClick={doDelete}>Delete</button>
            </div>
          </div>

          {current.description && (
            <p className="mt-4 text-gray-700 whitespace-pre-line">{current.description}</p>
          )}
          {current.details && (
            <div className="prose mt-6 max-w-none" dangerouslySetInnerHTML={{ __html: current.details as string }} />
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl max-h-[85vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Edit Recipe</h3>
            <div className="grid gap-3 mb-4">
              <input className="h-10 rounded border px-3" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <input className="h-10 rounded border px-3" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
              <textarea className="min-h-20 rounded border px-3 py-2" placeholder="Description" value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <div>
                <div className="text-sm font-medium mb-1">Details (rich text)</div>
                <QuillEditor value={form.details || ""} onChange={(v: string) => setForm({ ...form, details: v })} className="h-64 overflow-auto" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button className="px-4 py-2 rounded border" onClick={() => setEditOpen(false)} disabled={savingEdit}>Cancel</button>
              <button className={`px-4 py-2 rounded bg-primary text-white ${savingEdit ? "opacity-60 cursor-not-allowed" : ""}`} onClick={submitEdit} disabled={savingEdit}>{savingEdit ? "Saving..." : "Save"}</button>
            </div>
          </div>
        </div>
      )}

      {/* Replace Image Modal */}
      {replaceOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Replace Image</h3>
            <input
              className="h-10 rounded border px-3 w-full mb-3"
              placeholder="Image URL (optional)"
              value={replaceUrl}
              onChange={(e) => setReplaceUrl(e.target.value)}
            />
            <input
              className="h-10 rounded border px-3 w-full mb-4"
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (f) await doReplace(f);
              }}
            />
            <div className="flex justify-end gap-2">
              <button className="px-4 py-2 rounded border" onClick={() => setReplaceOpen(false)} disabled={savingImageUrl || replacingFile}>Close</button>
              <button className={`px-4 py-2 rounded bg-primary text-white ${replacingFile ? "opacity-60 cursor-not-allowed" : ""}`} disabled={replacingFile}>
                {replacingFile ? "Uploading..." : "Upload File"}
              </button>
              <button
                className={`px-4 py-2 rounded bg-primary text-white ${savingImageUrl ? "opacity-60 cursor-not-allowed" : ""}`}
                onClick={async () => {
                  if (!id) return;
                  try {
                    setSavingImageUrl(true);
                    if (replaceUrl.trim()) {
                      await update(id, { image_url: replaceUrl.trim() });
                      await get(id);
                      setReplaceUrl("");
                      setReplaceOpen(false);
                      toast.success("Image updated");
                    }
                  } catch {
                    toast.error("Failed to update image URL");
                  } finally {
                    setSavingImageUrl(false);
                  }
                }}
                disabled={savingImageUrl}
              >
                {savingImageUrl ? "Saving..." : "Use Image URL"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
