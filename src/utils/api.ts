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
    if (error?.response?.status === 402) {
      const path = location.pathname;
      // Avoid redirect loops if already on billing pages
      if (path !== '/app/billing' && path !== '/app/billing/processing') {
        try {
          const msg = error?.response?.data?.errorMessage || 'Subscription required';
          localStorage.setItem('paywall_reason', msg);
        } catch {}
        location.assign('/app/billing');
      }
      return Promise.reject(error);
    }
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
          (original as any).__isRetryRequest = true;
          (original.headers = original.headers || {});
          (original.headers as any).Authorization = `Bearer ${newTok}`;
          return http(original);
        }
      } catch {}
    }
    return Promise.reject(error);
  }
);
