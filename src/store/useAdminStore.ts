import { create } from "zustand";
import { http } from "../utils/api";
import { handleError } from "../utils/handleError";

type State = {
  users: any[];
  loading: boolean;
  error: string | null;
};

type Actions = {
  listUsers: (q?: string) => Promise<void>;
  setRole: (id: string, role: string) => Promise<void>;
  block: (id: string) => Promise<void>;
  unblock: (id: string) => Promise<void>;
  forceLogoutAll: (id: string) => Promise<void>;
  clearError: () => void;
};

export const useAdminStore = create<State & Actions>((set, get) => ({
  users: [],
  loading: false,
  error: null,

  listUsers: async (q) => {
    set({ loading: true, error: null });
    try {
      const { data } = await http.get(`/admin/users`, { params: q ? { q } : undefined });
      set({ users: data });
    } catch (e: any) {
      set({ error: handleError(e, { fallbackMessage: "Failed to fetch users" }) });
    } finally {
      set({ loading: false });
    }
  },

  setRole: async (id, role) => {
    set({ loading: true, error: null });
    try {
      await http.post(`/admin/users/${id}/role`, { role });
      set({ users: get().users.map((u: any) => (u.id === id ? { ...u, role } : u)) });
    } catch (e: any) {
      set({ error: handleError(e, { fallbackMessage: "Failed to set role" }) });
    } finally {
      set({ loading: false });
    }
  },

  block: async (id) => {
    set({ loading: true, error: null });
    try {
      await http.post(`/admin/users/${id}/block`);
      set({ users: get().users.map((u: any) => (u.id === id ? { ...u, blocked: true } : u)) });
    } catch (e: any) {
      set({ error: handleError(e, { fallbackMessage: "Failed to block user" }) });
    } finally {
      set({ loading: false });
    }
  },

  unblock: async (id) => {
    set({ loading: true, error: null });
    try {
      await http.post(`/admin/users/${id}/unblock`);
      set({ users: get().users.map((u: any) => (u.id === id ? { ...u, blocked: false } : u)) });
    } catch (e: any) {
      set({ error: handleError(e, { fallbackMessage: "Failed to unblock user" }) });
    } finally {
      set({ loading: false });
    }
  },

  forceLogoutAll: async (id) => {
    set({ loading: true, error: null });
    try {
      await http.post(`/admin/users/${id}/logout-all`);
    } catch (e: any) {
      set({ error: handleError(e, { fallbackMessage: "Failed to force logout" }) });
    } finally {
      set({ loading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
