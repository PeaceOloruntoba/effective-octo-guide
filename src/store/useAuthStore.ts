import { create } from "zustand";
import { http, setAccessToken } from "../utils/api";
import { handleError } from "../utils/handleError";

export type User = {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role?: string;
};

type State = {
  token: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
  hydrated: boolean;
  plans: Plans | null;
  verifyEmail: string | null;
  resetEmail: string | null;
};

type Plan = {
  plan: string;
  price_cents: number;
  currency: string;
};

type Plans = Plan[];

type Actions = {
  bootstrap: () => Promise<void>;
  register: (payload: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
  }) => Promise<any>;
  verifyOtp: (payload: { email: string; code: string }) => Promise<void>;
  login: (payload: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  forgot: (payload: { email: string }) => Promise<void>;
  reset: (payload: {
    email: string;
    code: string;
    password: string;
  }) => Promise<void>;
  fetchMe: () => Promise<void>;
  fetchPublicPlans: () => Promise<void>;
  clearError: () => void;
  resendOtp: (payload: { email: string; purpose: 'verify' | 'password_reset' }) => Promise<void>;
  setVerifyEmail: (email: string | null) => void;
  setResetEmail: (email: string | null) => void;
};

export const useAuthStore = create<State & Actions>((set, get) => ({
  token: localStorage.getItem("access_token"),
  user: null,
  loading: false,
  error: null,
  hydrated: false,
  plans: null,
  verifyEmail: null,
  resetEmail: null,

  bootstrap: async () => {
    try {
      const t = localStorage.getItem("access_token");
      if (t) {
        setAccessToken(t);
        await get()
          .fetchMe()
          .catch(() => {});
        set({ token: t });
      }
    } finally {
      set({ hydrated: true });
    }
  },

  register: async (payload) => {
    set({ loading: true, error: null });
    try {
      const { data } = await http.post(`/auth/register`, payload);
      return data;
    } catch (e: any) {
      set({
        error: handleError(e, { fallbackMessage: "Registration failed" }),
      });
      throw e;
    } finally {
      set({ loading: false });
    }
  },

  verifyOtp: async (payload) => {
    set({ loading: true, error: null });
    try {
      await http.post(`/auth/verify-otp`, payload);
    } catch (e: any) {
      set({
        error: handleError(e, { fallbackMessage: "OTP verification failed" }),
      });
      throw e;
    } finally {
      set({ loading: false });
    }
  },

  login: async (payload) => {
    set({ loading: true, error: null });
    try {
      const { data } = await http.post(`/auth/login`, payload);
      console.log(data);
      const token = (data as any)?.token as string | undefined;
      if (!token) throw new Error("No token");
      setAccessToken(token);
      set({ token });
      set({ user: data.user as User });
    } catch (e: any) {
      // Propagate error to caller to allow custom handling (e.g., unverified)
      set({ error: handleError(e, { fallbackMessage: "Login failed", silent: true }) });
      throw e;
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    try {
      await http.post(`/auth/logout`).catch(() => {});
    } finally {
      setAccessToken(null);
      set({ token: null, user: null });
    }
  },

  logoutAll: async () => {
    try {
      await http.post(`/auth/logout-all`).catch(() => {});
    } finally {
      setAccessToken(null);
      set({ token: null, user: null });
    }
  },

  forgot: async (payload) => {
    set({ loading: true, error: null });
    try {
      await http.post(`/auth/forgot-password`, payload);
    } catch (e: any) {
      set({
        error: handleError(e, { fallbackMessage: "Failed to send reset code" }),
      });
      throw e;
    } finally {
      set({ loading: false });
    }
  },

  reset: async (payload) => {
    set({ loading: true, error: null });
    try {
      await http.post(`/auth/reset-password`, payload);
    } catch (e: any) {
      set({
        error: handleError(e, { fallbackMessage: "Failed to reset password" }),
      });
      throw e;
    } finally {
      set({ loading: false });
    }
  },

  fetchMe: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await http.get(`/users/me`);
      set({ user: data as User });
    } catch (e: any) {
      setAccessToken(null);
      set({ token: null, user: null });
    } finally {
      set({ loading: false });
    }
  },

  fetchPublicPlans: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await http.get(`/billing/public/plans`);
      set({ plans: data?.plans as Plans });
    } catch (e: any) {
      set({
        error: handleError(e, {
          fallbackMessage: "Failed to fetch public plans",
        }),
      });
      throw e;
    } finally {
      set({ loading: false });
    }
  },

  clearError: () => set({ error: null }),

  resendOtp: async (payload) => {
    set({ loading: true, error: null });
    try {
      await http.post(`/auth/resend-otp`, payload);
    } catch (e: any) {
      set({ error: handleError(e, { fallbackMessage: 'Failed to resend code' }) });
      throw e;
    } finally {
      set({ loading: false });
    }
  },

  setVerifyEmail: (email) => set({ verifyEmail: email }),
  setResetEmail: (email) => set({ resetEmail: email }),
}));
