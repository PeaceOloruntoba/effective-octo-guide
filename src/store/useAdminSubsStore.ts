import { create } from "zustand";
import { http } from "../utils/api";
import { handleError } from "../utils/handleError";

export type SubsSettings = {
  is_active: boolean;
  trial_days: number;
  founder_discount_enabled: boolean;
  founder_window_starts_at: string | null;
  founder_window_ends_at: string | null;
  founder_capacity: number;
  founder_discount_pct: number;
  founder_awarded_count: number;
  price_monthly_cents?: number;
  price_quarterly_cents?: number;
  price_biannual_cents?: number;
  price_annual_cents?: number;
};

type State = {
  loading: boolean;
  error: string | null;
  settings: SubsSettings | null;
  overview: any | null;
};

type Actions = {
  fetchSettings: () => Promise<void>;
  saveSettings: (payload: Partial<SubsSettings>) => Promise<void>;
  startFounderWindow: () => Promise<void>;
  stopFounderWindow: () => Promise<void>;
  fetchOverview: () => Promise<void>;
  clearError: () => void;
};

export const useAdminSubsStore = create<State & Actions>((set) => ({
  loading: false,
  error: null,
  settings: null,
  overview: null,

  fetchSettings: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await http.get(`/admin/subscriptions/settings`);
      set({ settings: data as SubsSettings });
    } catch (e: any) {
      set({ error: handleError(e, { fallbackMessage: "Failed to load settings" }) });
    } finally { set({ loading: false }); }
  },

  saveSettings: async (payload) => {
    set({ loading: true, error: null });
    try {
      const { data } = await http.put(`/admin/subscriptions/settings`, payload);
      set({ settings: data as SubsSettings });
    } catch (e: any) {
      set({ error: handleError(e, { fallbackMessage: "Failed to save settings" }) });
      throw e;
    } finally { set({ loading: false }); }
  },

  startFounderWindow: async () => {
    set({ loading: true, error: null });
    try {
      await http.post(`/admin/subscriptions/founder-window/start`);
      await (useAdminSubsStore.getState().fetchSettings());
    } catch (e: any) {
      set({ error: handleError(e, { fallbackMessage: "Failed to start founder window" }) });
    } finally { set({ loading: false }); }
  },

  stopFounderWindow: async () => {
    set({ loading: true, error: null });
    try {
      await http.post(`/admin/subscriptions/founder-window/stop`);
      await (useAdminSubsStore.getState().fetchSettings());
    } catch (e: any) {
      set({ error: handleError(e, { fallbackMessage: "Failed to stop founder window" }) });
    } finally { set({ loading: false }); }
  },

  fetchOverview: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await http.get(`/admin/subscriptions/overview`);
      set({ overview: data });
    } catch (e: any) {
      set({ error: handleError(e, { fallbackMessage: "Failed to load overview" }) });
    } finally { set({ loading: false }); }
  },

  clearError: () => set({ error: null })
}));
