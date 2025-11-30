import { create } from "zustand";
import { http } from "../utils/api";
import { handleError } from "../utils/handleError";

type State = {
  items: any[];
  current: any | null;
  loading: boolean;
  error: string | null;
};

type Actions = {
  fetch: (recipeId?: number) => Promise<void>;
  get: (id: string | number) => Promise<void>;
  create: (body: any) => Promise<void>;
  update: (id: string | number, body: any) => Promise<void>;
  remove: (id: string | number) => Promise<void>;
  clearError: () => void;
};

export const useNutritionStore = create<State & Actions>((set, get) => ({
  items: [],
  current: null,
  loading: false,
  error: null,

  fetch: async (recipeId) => {
    set({ loading: true, error: null });
    try {
      const { data } = await http.get(`/nutrition`, { params: recipeId ? { recipeId } : undefined });
      set({ items: data });
    } catch (e: any) {
      set({ error: handleError(e, { fallbackMessage: "Failed to fetch nutrition" }) });
    } finally {
      set({ loading: false });
    }
  },

  get: async (id) => {
    set({ loading: true, error: null });
    try {
      const { data } = await http.get(`/nutrition/${id}`);
      set({ current: data });
    } catch (e: any) {
      set({ error: handleError(e, { fallbackMessage: "Failed to fetch nutrition details" }) });
    } finally {
      set({ loading: false });
    }
  },

  create: async (body) => {
    set({ loading: true, error: null });
    try {
      const { data } = await http.post(`/nutrition`, body);
      set({ items: [data, ...get().items] });
    } catch (e: any) {
      set({ error: handleError(e, { fallbackMessage: "Failed to create nutrition" }) });
    } finally {
      set({ loading: false });
    }
  },

  update: async (id, body) => {
    set({ loading: true, error: null });
    try {
      const { data } = await http.put(`/nutrition/${id}`, body);
      set({
        items: get().items.map((x: any) => (x.id === id ? { ...x, ...data } : x)),
        current: get().current && (get().current.id === id ? { ...get().current, ...data } : get().current),
      });
    } catch (e: any) {
      set({ error: handleError(e, { fallbackMessage: "Failed to update nutrition" }) });
    } finally {
      set({ loading: false });
    }
  },

  remove: async (id) => {
    set({ loading: true, error: null });
    try {
      await http.delete(`/nutrition/${id}`);
      set({ items: get().items.filter((x: any) => x.id !== id) });
      if (get().current && get().current.id === id) set({ current: null });
    } catch (e: any) {
      set({ error: handleError(e, { fallbackMessage: "Failed to delete nutrition" }) });
    } finally {
      set({ loading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
