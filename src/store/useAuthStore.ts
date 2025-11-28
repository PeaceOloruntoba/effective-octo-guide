import { create } from "zustand";
import { api, setAccessToken } from "../utils/api";

export type User = { id: string; email: string; name?: string; role?: string };

type State = {
  token: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
  hydrated: boolean;
};

type Actions = {
  bootstrap: () => Promise<void>;
  register: (payload: { email: string; password: string; name?: string }) => Promise<any>;
  verifyOtp: (payload: { email: string; code: string }) => Promise<void>;
  login: (payload: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  forgot: (payload: { email: string }) => Promise<void>;
  reset: (payload: { email: string; code: string; password: string }) => Promise<void>;
  fetchMe: () => Promise<void>;
  clearError: () => void;
};

export const useAuthStore = create<State & Actions>((set, get) => ({
  token: localStorage.getItem("access_token"),
  user: null,
  loading: false,
  error: null,
  hydrated: false,

  bootstrap: async () => {
    try {
      const t = localStorage.getItem("access_token");
      if (t) {
        setAccessToken(t);
        await get().fetchMe().catch(() => {});
        set({ token: t });
      }
    } finally {
      set({ hydrated: true });
    }
  },

  register: async (payload) => {
    set({ loading: true, error: null });
    try {
      return await api.auth.register(payload);
    } catch (e: any) {
      set({ error: e?.response?.data?.error || "Registration failed" });
      throw e;
    } finally {
      set({ loading: false });
    }
  },

  verifyOtp: async (payload) => {
    set({ loading: true, error: null });
    try {
      await api.auth.verifyOtp(payload);
    } catch (e: any) {
      set({ error: e?.response?.data?.error || "OTP verification failed" });
      throw e;
    } finally {
      set({ loading: false });
    }
  },

  login: async (payload) => {
    set({ loading: true, error: null });
    try {
      const data = await api.auth.login(payload);
      const token = (data as any)?.token as string | undefined;
      if (!token) throw new Error("No token");
      setAccessToken(token);
      set({ token });
      await get().fetchMe();
    } catch (e: any) {
      set({ error: e?.response?.data?.error || "Login failed" });
      throw e;
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    try {
      await api.auth.logout().catch(() => {});
    } finally {
      setAccessToken(null);
      set({ token: null, user: null });
    }
  },

  logoutAll: async () => {
    try {
      await api.auth.logoutAll().catch(() => {});
    } finally {
      setAccessToken(null);
      set({ token: null, user: null });
    }
  },

  forgot: async (payload) => {
    set({ loading: true, error: null });
    try {
      await api.auth.forgot(payload);
    } catch (e: any) {
      set({ error: e?.response?.data?.error || "Failed to send reset code" });
      throw e;
    } finally {
      set({ loading: false });
    }
  },

  reset: async (payload) => {
    set({ loading: true, error: null });
    try {
      await api.auth.reset(payload);
    } catch (e: any) {
      set({ error: e?.response?.data?.error || "Failed to reset password" });
      throw e;
    } finally {
      set({ loading: false });
    }
  },

  fetchMe: async () => {
    set({ loading: true, error: null });
    try {
      const user = await api.auth.me();
      set({ user });
    } catch (e: any) {
      setAccessToken(null);
      set({ token: null, user: null });
    } finally {
      set({ loading: false });
    }
  },

  clearError: () => set({ error: null }),
}));