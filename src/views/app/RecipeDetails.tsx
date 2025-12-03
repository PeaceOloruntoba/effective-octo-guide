import { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useRecipesStore } from "../../store/useRecipesStore";
import { Spinner } from "../../components/Spinner";

export default function RecipeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { current, loading, error, get } = useRecipesStore();

  useEffect(() => {
    if (id) get(id);
  }, [id]);

  if (loading) return (
    <div className="mx-auto max-w-4xl px-4 py-6 text-gray-600 flex items-center gap-2"><Spinner /><span>Loading...</span></div>
  );
  if (error) return (
    <div className="mx-auto max-w-4xl px-4 py-6 text-red-600">{error}</div>
  );
  if (!current) return (
    <div className="mx-auto max-w-4xl px-4 py-6 text-gray-500">Recipe not found</div>
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <button className="mb-4 text-sm text-primary underline" onClick={() => navigate(-1)}>
        ← Back
      </button>
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {current.image_url && (
          <img src={current.image_url} alt={current.name} className="w-full h-72 object-cover" />
        )}
        <div className="p-5">
          <h1 className="text-2xl font-semibold text-gray-900">{current.name}</h1>
          {current.category && (
            <div className="mt-1 text-xs uppercase text-gray-500">{current.category}</div>
          )}
          {current.description && (
            <p className="mt-4 text-gray-700 whitespace-pre-line">{current.description}</p>
          )}
          {current.details && (
            <div className="prose mt-6 max-w-none" dangerouslySetInnerHTML={{ __html: current.details as string }} />
          )}
        </div>
      </div>
    </div>
  );
}
