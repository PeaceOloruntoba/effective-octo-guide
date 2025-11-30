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
      const form = new FormData();
      form.append("name", name);
      form.append("category", category);
      if (image) form.append("image", image);
      await create(form);
      setName("");
      setCategory("");
      setImage(null);
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
  const onReplaceImage = async (id: number, file: File) => {
    try {
      const form = new FormData();
      form.append("image", file);
      await replaceImage(id, form);
      toast.success("Image replaced");
      load();
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
                    <label className="px-2 py-1 rounded border cursor-pointer">
                      Replace image
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) onReplaceImage(r.id, f);
                        }}
                      />
                    </label>
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
    </div>
  );
}
