import { create } from "zustand";
import { http } from "../utils/api";
import { handleError } from "../utils/handleError";

type State = {
  data: any | null;
  loading: boolean;
  error: string | null;
};

type Actions = {
  range: (from: string, to: string) => Promise<void>;
  clearError: () => void;
};

export const useStatsStore = create<State & Actions>((set) => ({
  data: null,
  loading: false,
  error: null,

  range: async (from, to) => {
    set({ loading: true, error: null });
    try {
      const { data } = await http.get(`/stats`, { params: { from, to } });
      set({ data });
    } catch (e: any) {
      set({ error: handleError(e, { fallbackMessage: "Failed to fetch stats" }) });
    } finally {
      set({ loading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
