import { create } from "zustand";
import { http } from "../utils/api";
import { handleError } from "../utils/handleError";

type State = {
  title: string;
  body_html: string;
  exclude_user_ids: string[]; // selected users to exclude from send
  loading: boolean;
  error: string | null;
};

type Actions = {
  setTitle: (v: string) => void;
  setBody: (v: string) => void;
  toggleExcluded: (id: string) => void;
  clearSelection: () => void;
  clearError: () => void;
  send: () => Promise<{ id: string; recipients: number; sent: number } | null>;
};

export const useNewsletterStore = create<State & Actions>((set, get) => ({
  title: "",
  body_html: "",
  exclude_user_ids: [],
  loading: false,
  error: null,

  setTitle: (v) => set({ title: v }),
  setBody: (v) => set({ body_html: v }),
  toggleExcluded: (id) => {
    const cur = get().exclude_user_ids;
    if (cur.includes(id)) set({ exclude_user_ids: cur.filter((x) => x !== id) });
    else set({ exclude_user_ids: [...cur, id] });
  },
  clearSelection: () => set({ exclude_user_ids: [] }),
  clearError: () => set({ error: null }),

  send: async () => {
    const { title, body_html, exclude_user_ids } = get();
    set({ loading: true, error: null });
    try {
      const { data } = await http.post(`/admin/newsletters`, {
        title,
        body_html,
        // backend supports user_id as exclusion input as well, but send both for clarity
        user_id: exclude_user_ids,
        exclude_user_ids,
      });
      return data;
    } catch (e: any) {
      set({ error: handleError(e, { fallbackMessage: "Failed to send newsletter" }) });
      return null;
    } finally {
      set({ loading: false });
    }
  },
}));

