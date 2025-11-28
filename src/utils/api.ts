import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:4000/v1";

export const http = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // send/receive httpOnly refresh cookie
  timeout: 15000,
});

let accessToken: string | null = null;
export const setAccessToken = (token: string | null) => {
  accessToken = token;
  if (token) localStorage.setItem("access_token", token);
  else localStorage.removeItem("access_token");
};
// init from storage
setAccessToken(localStorage.getItem("access_token"));

http.interceptors.request.use((config) => {
  if (accessToken) {
    (config.headers = config.headers || {});
    (config.headers as any).Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

let refreshing: Promise<string | null> | null = null;

http.interceptors.response.use(
  (r) => r,
  async (error) => {
    const original = error?.config;
    if (error?.response?.status === 401 && original && !original.__isRetryRequest) {
      try {
        if (!refreshing) {
          refreshing = (async () => {
            const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, { withCredentials: true });
            const newToken = data?.token as string | undefined;
            if (newToken) setAccessToken(newToken);
            return newToken || null;
          })().finally(() => (refreshing = null));
        }
        const newTok = await refreshing;
        if (newTok) {
          original.__isRetryRequest = true;
          (original.headers = original.headers || {});
          (original.headers as any).Authorization = `Bearer ${newTok}`;
          return http(original);
        }
      } catch {}
    }
    return Promise.reject(error);
  }
);

export const api = {
  auth: {
    register: (payload: { email: string; password: string; name?: string }) => http.post(`/auth/register`, payload).then((r) => r.data),
    verifyOtp: (payload: { email: string; code: string }) => http.post(`/auth/verify-otp`, payload).then((r) => r.data),
    login: (payload: { email: string; password: string }) => http.post(`/auth/login`, payload).then((r) => r.data as { token: string }),
    logout: () => http.post(`/auth/logout`).then((r) => r.data),
    logoutAll: () => http.post(`/auth/logout-all`).then((r) => r.data),
    forgot: (payload: { email: string }) => http.post(`/auth/forgot-password`, payload).then((r) => r.data),
    reset: (payload: { email: string; code: string; password: string }) => http.post(`/auth/reset-password`, payload).then((r) => r.data),
    me: () => http.get(`/users/me`).then((r) => r.data as { id: string; email: string; name?: string; role?: string }),
  },
  recipes: {
    list: () => http.get(`/recipes`).then((r) => r.data as { id: number; name: string; category?: string; image_url?: string }[]),
    get: (id: number | string) => http.get(`/recipes/${id}`).then((r) => r.data),
    create: (form: FormData) => http.post(`/recipes`, form, { headers: { "Content-Type": "multipart/form-data" } }).then((r) => r.data),
    update: (id: number | string, body: any) => http.put(`/recipes/${id}`, body).then((r) => r.data),
    replaceImage: (id: number | string, form: FormData) => http.post(`/recipes/${id}/image`, form, { headers: { "Content-Type": "multipart/form-data" } }).then((r) => r.data),
    remove: (id: number | string) => http.delete(`/recipes/${id}`).then((r) => r.data),
  },
  meals: {
    getPlan: () => http.get(`/meals/plan`).then((r) => r.data),
    setPlan: (plan: any) => http.put(`/meals/plan`, plan).then((r) => r.data),
    clear: () => http.post(`/meals/plan/clear`).then((r) => r.data),
  },
  nutrition: {
    list: (recipeId?: number) => http.get(`/nutrition`, { params: recipeId ? { recipeId } : undefined }).then((r) => r.data),
    get: (id: string | number) => http.get(`/nutrition/${id}`).then((r) => r.data),
    create: (body: any) => http.post(`/nutrition`, body).then((r) => r.data),
    update: (id: string | number, body: any) => http.put(`/nutrition/${id}`, body).then((r) => r.data),
    remove: (id: string | number) => http.delete(`/nutrition/${id}`).then((r) => r.data),
  },
  pantry: {
    list: () => http.get(`/pantry`).then((r) => r.data),
    create: (body: any) => http.post(`/pantry`, body).then((r) => r.data),
    update: (id: string | number, body: any) => http.put(`/pantry/${id}`, body).then((r) => r.data),
    remove: (id: string | number) => http.delete(`/pantry/${id}`).then((r) => r.data),
  },
  shopping: {
    list: () => http.get(`/shopping`).then((r) => r.data),
    create: (body: any) => http.post(`/shopping`, body).then((r) => r.data),
    update: (id: string | number, body: any) => http.put(`/shopping/${id}`, body).then((r) => r.data),
    remove: (id: string | number) => http.delete(`/shopping/${id}`).then((r) => r.data),
  },
  stats: {
    range: (from: string, to: string) => http.get(`/stats`, { params: { from, to } }).then((r) => r.data),
  },
  admin: {
    users: (q?: string) => http.get(`/admin/users`, { params: q ? { q } : undefined }).then((r) => r.data as any[]),
    setRole: (id: string, role: string) => http.post(`/admin/users/${id}/role`, { role }).then((r) => r.data),
    block: (id: string) => http.post(`/admin/users/${id}/block`).then((r) => r.data),
    unblock: (id: string) => http.post(`/admin/users/${id}/unblock`).then((r) => r.data),
    forceLogoutAll: (id: string) => http.post(`/admin/users/${id}/logout-all`).then((r) => r.data),
  },
};

export const Colors = {
  primary: "#1f444c",
  accent: "#e9be6f",
  accent2: "#c77138",
};
