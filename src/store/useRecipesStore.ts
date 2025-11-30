import { create } from "zustand";
import { http } from "../utils/api";
import { handleError } from "../utils/handleError";

export type Recipe = { id: number; name: string; category?: string; image_url?: string };

type State = {
  items: Recipe[];
  current: any | null;
  loading: boolean;
  error: string | null;
};

type Actions = {
  fetch: () => Promise<void>;
  get: (id: number | string) => Promise<void>;
  create: (form: FormData) => Promise<void>;
  update: (id: number | string, body: any) => Promise<void>;
  replaceImage: (id: number | string, form: FormData) => Promise<void>;
  remove: (id: number | string) => Promise<void>;
  clearError: () => void;
};

export const useRecipesStore = create<State & Actions>((set, get) => ({
  items: [],
  current: null,
  loading: false,
  error: null,

  fetch: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await http.get<Recipe[]>(`/recipes`);
      set({ items: data });
    } catch (e: any) {
      set({ error: handleError(e, { fallbackMessage: "Failed to fetch recipes" }) });
    } finally {
      set({ loading: false });
    }
  },

  get: async (id) => {
    set({ loading: true, error: null });
    try {
      const { data } = await http.get(`/recipes/${id}`);
      set({ current: data });
    } catch (e: any) {
      set({ error: handleError(e, { fallbackMessage: "Failed to fetch recipe" }) });
    } finally {
      set({ loading: false });
    }
  },

  create: async (form) => {
    set({ loading: true, error: null });
    try {
      const { data } = await http.post(`/recipes`, form, { headers: { "Content-Type": "multipart/form-data" } });
      set({ items: [data, ...get().items] });
    } catch (e: any) {
      set({ error: handleError(e, { fallbackMessage: "Failed to create recipe" }) });
    } finally {
      set({ loading: false });
    }
  },

  update: async (id, body) => {
    set({ loading: true, error: null });
    try {
      const { data } = await http.put(`/recipes/${id}`, body);
      set({
        items: get().items.map((x) => (x.id === (typeof id === "string" ? Number(id) : id) ? { ...x, ...data } : x)),
        current: get().current && (get().current.id === id ? { ...get().current, ...data } : get().current),
      });
    } catch (e: any) {
      set({ error: handleError(e, { fallbackMessage: "Failed to update recipe" }) });
    } finally {
      set({ loading: false });
    }
  },

  replaceImage: async (id, form) => {
    set({ loading: true, error: null });
    try {
      const { data } = await http.post(`/recipes/${id}/image`, form, { headers: { "Content-Type": "multipart/form-data" } });
      set({
        items: get().items.map((x) => (x.id === (typeof id === "string" ? Number(id) : id) ? { ...x, ...data } : x)),
        current: get().current && (get().current.id === id ? { ...get().current, ...data } : get().current),
      });
    } catch (e: any) {
      set({ error: handleError(e, { fallbackMessage: "Failed to replace image" }) });
    } finally {
      set({ loading: false });
    }
  },

  remove: async (id) => {
    set({ loading: true, error: null });
    try {
      await http.delete(`/recipes/${id}`);
      const nid = typeof id === "string" ? Number(id) : id;
      set({ items: get().items.filter((x) => x.id !== nid) });
      if (get().current && get().current.id === id) set({ current: null });
    } catch (e: any) {
      set({ error: handleError(e, { fallbackMessage: "Failed to delete recipe" }) });
    } finally {
      set({ loading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
