import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRecipesStore } from "../../store/useRecipesStore";
import QuillEditor from "../../components/QuillEditor";
import { useNavigate } from "react-router";

export default function AdminRecipes() {
  const { items, loading, error, fetch, create, remove } =
    useRecipesStore();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [details, setDetails] = useState<string>("");
  const [calories, setCalories] = useState<string>("");
  const [protein, setProtein] = useState<string>("");
  const [carbs, setCarbs] = useState<string>("");
  const [fat, setFat] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const load = async () => await fetch();

  useEffect(() => {
    load();
  }, []);

  const createRecipe = async () => {
    try {
      setSubmitting(true);
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
      if (description) form.append("description", description);
      if (details) form.append("details", details);
      if (calories) form.append("calories", calories);
      if (protein) form.append("protein_grams", protein);
      if (carbs) form.append("carbs_grams", carbs);
      if (fat) form.append("fat_grams", fat);
      if (imageUrl) form.append("image_url", imageUrl);
      if (image) form.append("image", image);
      if (!image && imageUrl) form.append("image_url", imageUrl);
      await create(form);
      setName("");
      setCategory("");
      setImage(null);
      setImageUrl("");
      setDescription("");
      setDetails("");
      setCalories("");
      setProtein("");
      setCarbs("");
      setFat("");
      setModalOpen(false);
      await load();
      toast.success("Recipe created");
    } catch (e: any) {
      toast.error(e?.response?.data?.error || "Failed to create");
    } finally {
      setSubmitting(false);
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
                <tr key={r.id} className="border-b hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/admin/recipes/${r.id}`)}>
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
                  <td className="p-2" onClick={(e) => e.stopPropagation()}>
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
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl max-h-[85vh] overflow-y-auto">
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
              <textarea
                className="min-h-20 rounded border px-3 py-2"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <div>
                <div className="text-sm font-medium mb-1">Details (rich text)</div>
                <QuillEditor value={details} onChange={setDetails} className="overflow-auto" />
              </div>
              <input
                className="h-10 rounded border px-3"
                placeholder="Image URL (optional)"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
              <div className="grid grid-cols-2 gap-3">
                <input className="h-10 rounded border px-3" placeholder="Calories" value={calories} onChange={(e) => setCalories(e.target.value)} />
                <input className="h-10 rounded border px-3" placeholder="Protein (g)" value={protein} onChange={(e) => setProtein(e.target.value)} />
                <input className="h-10 rounded border px-3" placeholder="Carbs (g)" value={carbs} onChange={(e) => setCarbs(e.target.value)} />
                <input className="h-10 rounded border px-3" placeholder="Fat (g)" value={fat} onChange={(e) => setFat(e.target.value)} />
              </div>
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
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                className={`px-4 py-2 rounded bg-primary text-white ${submitting ? "opacity-60 cursor-not-allowed" : ""}`}
                onClick={createRecipe}
                disabled={submitting}
              >
                {submitting ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
