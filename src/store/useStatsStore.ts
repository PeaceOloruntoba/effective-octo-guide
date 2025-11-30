import { create } from "zustand";
import { http } from "../utils/api";
import { handleError } from "../utils/handleError";

type State = {
  data: any | null;
  totals: { calories: number; protein_grams: number; carbs_grams: number; fat_grams: number } | null;
  loading: boolean;
  error: string | null;
};

type Actions = {
  summary: (period: "daily" | "week" | "month") => Promise<void>;
  clearError: () => void;
};

export const useStatsStore = create<State & Actions>((set) => ({
  data: null,
  totals: null,
  loading: false,
  error: null,

  summary: async (period) => {
    set({ loading: true, error: null });
    try {
      const { data } = await http.get(`/stats/summary`, { params: { period } });
      set({ data, totals: data?.totals ?? null });
    } catch (e: any) {
      set({ error: handleError(e, { fallbackMessage: "Failed to fetch stats summary" }) });
    } finally {
      set({ loading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
