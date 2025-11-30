import { create } from "zustand";
import { http, setAccessToken } from "../utils/api";
import { handleError } from "../utils/handleError";

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
      const { data } = await http.post(`/auth/register`, payload);
      return data;
    } catch (e: any) {
      set({ error: handleError(e, { fallbackMessage: "Registration failed" }) });
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
      set({ error: handleError(e, { fallbackMessage: "OTP verification failed" }) });
      throw e;
    } finally {
      set({ loading: false });
    }
  },

  login: async (payload) => {
    set({ loading: true, error: null });
    try {
      const { data } = await http.post(`/auth/login`, payload);
      console.log(data)
      const token = (data as any)?.token as string | undefined;
      if (!token) throw new Error("No token");
      setAccessToken(token);
      set({ token });
      await get().fetchMe();
    } catch (e: any) {
      set({ error: handleError(e, { fallbackMessage: "Login failed" }) });
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
      set({ error: handleError(e, { fallbackMessage: "Failed to send reset code" }) });
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
      set({ error: handleError(e, { fallbackMessage: "Failed to reset password" }) });
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

  clearError: () => set({ error: null }),
}));