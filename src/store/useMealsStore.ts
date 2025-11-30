import { create } from "zustand";
import { http } from "../utils/api";
import { handleError } from "../utils/handleError";

type State = {
  plan: any | null;
  loading: boolean;
  error: string | null;
};

type Actions = {
  fetchPlan: () => Promise<void>;
  setPlan: (plan: any) => Promise<void>;
  clearPlan: () => Promise<void>;
  clearError: () => void;
};

export const useMealsStore = create<State & Actions>((set) => ({
  plan: null,
  loading: false,
  error: null,

  fetchPlan: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await http.get(`/meals/plan`);
      set({ plan: data });
    } catch (e: any) {
      set({ error: handleError(e, { fallbackMessage: "Failed to fetch meal plan" }) });
    } finally {
      set({ loading: false });
    }
  },

  setPlan: async (plan) => {
    set({ loading: true, error: null });
    try {
      const { data } = await http.put(`/meals/plan`, plan);
      set({ plan: data });
    } catch (e: any) {
      set({ error: handleError(e, { fallbackMessage: "Failed to save meal plan" }) });
    } finally {
      set({ loading: false });
    }
  },

  clearPlan: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await http.post(`/meals/plan/clear`);
      set({ plan: data });
    } catch (e: any) {
      set({ error: handleError(e, { fallbackMessage: "Failed to clear meal plan" }) });
    } finally {
      set({ loading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
