import { create } from "zustand";
import { http } from "../utils/api";
import { handleError } from "../utils/handleError";

type State = {
  items: any[];
  loading: boolean;
  error: string | null;
};

type Actions = {
  fetch: () => Promise<void>;
  create: (body: any) => Promise<void>;
  update: (id: string | number, body: any) => Promise<void>;
  remove: (id: string | number) => Promise<void>;
  clearError: () => void;
};

export const useShoppingStore = create<State & Actions>((set, get) => ({
  items: [],
  loading: false,
  error: null,

  fetch: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await http.get(`/shopping`);
      set({ items: data });
    } catch (e: any) {
      set({ error: handleError(e, { fallbackMessage: "Failed to fetch shopping list" }) });
    } finally {
      set({ loading: false });
    }
  },

  create: async (body) => {
    set({ loading: true, error: null });
    try {
      const { data } = await http.post(`/shopping`, body);
      set({ items: [data, ...get().items] });
    } catch (e: any) {
      set({ error: handleError(e, { fallbackMessage: "Failed to add shopping item" }) });
    } finally {
      set({ loading: false });
    }
  },

  update: async (id, body) => {
    set({ loading: true, error: null });
    try {
      const { data } = await http.put(`/shopping/${id}`, body);
      set({ items: get().items.map((x: any) => (x.id === id ? { ...x, ...data } : x)) });
    } catch (e: any) {
      set({ error: handleError(e, { fallbackMessage: "Failed to update shopping item" }) });
    } finally {
      set({ loading: false });
    }
  },

  remove: async (id) => {
    set({ loading: true, error: null });
    try {
      await http.delete(`/shopping/${id}`);
      set({ items: get().items.filter((x: any) => x.id !== id) });
    } catch (e: any) {
      set({ error: handleError(e, { fallbackMessage: "Failed to delete shopping item" }) });
    } finally {
      set({ loading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
