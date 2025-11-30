import { create } from "zustand";
import { http } from "../utils/api";
import { handleError } from "../utils/handleError";

export type Plan = {
  plan: "monthly" | "quarterly" | "biannual" | "annual";
  price_cents: number;
  display: string;
  discounted?: boolean;
  discounted_price_cents?: number;
};

export type BillingStatus = {
  status: "none" | "trialing" | "active" | "past_due" | "canceled" | "expired";
  plan?: Plan["plan"] | null;
  trial_end?: string | null;
  current_period_end?: string | null;
};

type State = {
  loading: boolean;
  error: string | null;
  status: BillingStatus | null;
  plans: Plan[];
};

type Actions = {
  fetchStatus: () => Promise<void>;
  fetchPlans: () => Promise<void>;
  checkout: (plan: Plan["plan"]) => Promise<void>;
  cancel: () => Promise<void>;
  clearError: () => void;
};

export const useBillingStore = create<State & Actions>((set, get) => ({
  loading: false,
  error: null,
  status: null,
  plans: [],

  fetchStatus: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await http.get(`/billing/status`);
      // Expecting shape: { is_active: boolean, subscription: {...} }
      const sub = (data as any)?.subscription || data;
      const mapped: BillingStatus = {
        status: sub?.status ?? 'none',
        plan: sub?.plan ?? null,
        trial_end: sub?.trial_end ?? null,
        current_period_end: sub?.current_period_end ?? null,
      };
      set({ status: mapped });
    } catch (e: any) {
      set({ error: handleError(e, { fallbackMessage: "Failed to load billing status" }) });
      throw e;
    } finally {
      set({ loading: false });
    }
  },

  fetchPlans: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await http.get(`/billing/plans`);
      const plans = data.plans
      set({ plans: plans as Plan[] });
    } catch (e: any) {
      set({ error: handleError(e, { fallbackMessage: "Failed to load plans" }) });
      throw e;
    } finally {
      set({ loading: false });
    }
  },

  checkout: async (plan) => {
    set({ loading: true, error: null });
    try {
      const { data } = await http.post(`/billing/checkout`, { plan });
      const url = (data as any)?.authorization_url || (data as any)?.auth_url || (data as any)?.url;
      if (url) {
        window.open(url, "_blank");
      } else {
        // Backend returned only a reference; start polling for status change
        const ref = (data as any)?.reference;
        if (ref) {
          let tries = 0;
          const timer = setInterval(async () => {
            tries++;
            try { await get().fetchStatus(); } catch {}
            const s = get().status?.status;
            if (s === 'active' || tries > 30) clearInterval(timer); // ~2 minutes
          }, 4000);
        }
      }
    } catch (e: any) {
      set({ error: handleError(e, { fallbackMessage: "Failed to start checkout" }) });
      throw e;
    } finally {
      set({ loading: false });
    }
  },

  cancel: async () => {
    set({ loading: true, error: null });
    try {
      await http.post(`/billing/cancel`);
      await get().fetchStatus();
    } catch (e: any) {
      set({ error: handleError(e, { fallbackMessage: "Failed to cancel" }) });
      throw e;
    } finally {
      set({ loading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
