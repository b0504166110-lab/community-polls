import axios from "axios";
import { store } from "../store/store";
import { logout } from "../store/authSlice";
import { getToken, deleteToken } from "../utils/tokenStorage";
const API_URL = import.meta.env.VITE_API_URL ?? "/api";
const api = axios.create({
  baseURL: API_URL,
});
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const code = error.response?.data?.error?.code;
    if (code === "TOKEN_EXPIRED" || code === "INVALID_TOKEN") {
      deleteToken();
      store.dispatch(logout());
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.error?.message ??
      "אין חיבור לשרת, נסו שוב מאוחר יותר"
    );
  }
  return "משהו השתבש";
}

export function getFieldErrors(error: unknown): Record<string, string> {
  const errors: Record<string, string> = {};
  if (axios.isAxiosError(error)) {
    const details: { field: string | null; message: string }[] =
      error.response?.data?.error?.details ?? [];
    for (const d of details) {
      if (d.field && !errors[d.field]) errors[d.field] = d.message;
    }
  }
  return errors;
}
