import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRecipesStore } from "../../store/useRecipesStore";

export default function AdminRecipes() {
  const { items, loading, error, fetch, create, update, replaceImage, remove } =
    useRecipesStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");

  // Replace image modal state
  const [replaceOpenFor, setReplaceOpenFor] = useState<number | null>(null);
  const [replaceFile, setReplaceFile] = useState<File | null>(null);
  const [replaceUrl, setReplaceUrl] = useState("");

  const load = async () => await fetch();

  useEffect(() => {
    load();
  }, []);

  const createRecipe = async () => {
    try {
      if (!name || !category) {
        toast.error("Name and category are required");
        return;
      }
      if (image && imageUrl) {
        toast.error("Provide either an image file or an image URL, not both");
        return;
      }
      const form = new FormData();
      form.append("name", name);
      form.append("category", category);
      if (image) form.append("image", image);
      if (!image && imageUrl) form.append("image_url", imageUrl);
      await create(form);
      setName("");
      setCategory("");
      setImage(null);
      setImageUrl("");
      setModalOpen(false);
      await load();
      toast.success("Recipe created");
    } catch (e: any) {
      toast.error(e?.response?.data?.error || "Failed to create");
    }
  };

  const onUpdate = async (id: number, patch: any) => {
    try {
      await update(id, patch);
      toast.success("Updated");
      load();
    } catch {
      toast.error("Failed");
    }
  };
  const submitReplace = async () => {
    const id = replaceOpenFor;
    if (!id) return;
    if (replaceFile && replaceUrl) {
      toast.error("Provide either a file or a URL, not both");
      return;
    }
    try {
      if (replaceFile) {
        const form = new FormData();
        form.append("image", replaceFile);
        await replaceImage(id, form);
      } else if (replaceUrl) {
        await onUpdate(id, { image_url: replaceUrl });
      } else {
        toast.error("Please select a file or enter an image URL");
        return;
      }
      toast.success("Image updated");
      setReplaceOpenFor(null);
      setReplaceFile(null);
      setReplaceUrl("");
      await load();
    } catch {
      toast.error("Failed");
    }
  };
  const onRemove = async (id: number) => {
    try {
      await remove(id);
      toast.success("Deleted");
      load();
    } catch {
      toast.error("Failed");
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Recipes</h2>
        <button
          className="px-4 py-2 rounded bg-primary text-white"
          onClick={() => setModalOpen(true)}
        >
          Add Recipe
        </button>
      </div>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      {/* Recipes Table */}
      <div>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <table className="w-full text-sm border">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-2 border-b">Image</th>
                <th className="text-left p-2 border-b">Name</th>
                <th className="text-left p-2 border-b">Category</th>
                <th className="text-left p-2 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((r) => (
                <tr key={r.id} className="border-b">
                  <td className="p-2">
                    {r.image_url ? (
                      <img
                        src={r.image_url}
                        className="w-16 h-16 object-cover rounded"
                      />
                    ) : (
                      <span className="text-gray-400">No image</span>
                    )}
                  </td>
                  <td className="p-2">{r.name}</td>
                  <td className="p-2">{r.category}</td>
                  <td className="p-2 flex flex-wrap gap-2 items-center">
                    <button
                      className="px-2 py-1 rounded border"
                      onClick={() =>
                        onUpdate(r.id, {
                          name: prompt("New name", r.name) || r.name,
                        })
                      }
                    >
                      Rename
                    </button>
                    <button
                      className="px-2 py-1 rounded border"
                      onClick={() =>
                        onUpdate(r.id, {
                          category:
                            prompt("New category", r.category) || r.category,
                        })
                      }
                    >
                      Set category
                    </button>
                    <button
                      className="px-2 py-1 rounded border"
                      onClick={() => { setReplaceOpenFor(r.id); setReplaceFile(null); setReplaceUrl(""); }}
                    >
                      Replace image
                    </button>
                    <button
                      className="px-2 py-1 rounded border text-red-600"
                      onClick={() => onRemove(r.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Create Recipe</h3>
            <div className="grid gap-3 mb-4">
              <input
                className="h-10 rounded border px-3"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                className="h-10 rounded border px-3"
                placeholder="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
              <div className="text-sm text-gray-600">Add either an image file or a direct image URL</div>
              <input
                className="h-10 rounded border px-3"
                placeholder="Image URL (optional)"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
              <input
                className="h-10 rounded border px-3"
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded border"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-primary text-white"
                onClick={createRecipe}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Replace Image Modal */}
      {replaceOpenFor !== null && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Replace Image</h3>
            <div className="grid gap-3 mb-4">
              <div className="text-sm text-gray-600">Paste a direct image URL or upload a new file</div>
              <input
                className="h-10 rounded border px-3"
                placeholder="Image URL"
                value={replaceUrl}
                onChange={(e) => setReplaceUrl(e.target.value)}
              />
              <input
                className="h-10 rounded border px-3"
                type="file"
                accept="image/*"
                onChange={(e) => setReplaceFile(e.target.files?.[0] || null)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded border"
                onClick={() => { setReplaceOpenFor(null); setReplaceFile(null); setReplaceUrl(""); }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-primary text-white"
                onClick={submitReplace}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
