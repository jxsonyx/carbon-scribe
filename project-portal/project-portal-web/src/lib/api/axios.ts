import { showToast } from "@/components/ui/Toast";
import axios, { AxiosError } from "axios";

const RAW_API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || "http://localhost:8080";

export const API_BASE_URL = RAW_API_BASE_URL.endsWith("/api/v1")
  ? RAW_API_BASE_URL
  : `${RAW_API_BASE_URL}/api/v1`;

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 20_000,
});

// Dynamically import the Zustand store to avoid circular imports
let getUserId: (() => string | null) | null = null;
export function setUserIdGetter(fn: () => string | null) {
  getUserId = fn;
}

// Attach X-User-ID header for financing endpoints if user is authenticated
api.interceptors.request.use((config) => {
  if (getUserId && config.url && config.url.includes('/financing/')) {
    const userId = getUserId();
    if (userId) {
      if (typeof window !== 'undefined') {
        console.debug('[DEBUG] X-User-ID header value:', userId);
        try {
          localStorage.setItem('last-x-user-id', userId);
        } catch {}
      }
      config.headers = config.headers || {};
      config.headers['X-User-ID'] = userId;
    } else {
      if (typeof window !== 'undefined') {
        console.warn('[DEBUG] No userId found for X-User-ID header');
        try {
          localStorage.setItem('last-x-user-id', '');
        } catch {}
      }
    }
  }
  return config;
});

// Token setter (store calls this)
export function setAuthToken(token: string | null) {
  if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`;
  else delete api.defaults.headers.common.Authorization;
}

// 401 handler (store can inject behavior)
let onUnauthorized: (() => void) | null = null;
export function setOnUnauthorized(handler: (() => void) | null) {
  onUnauthorized = handler;
}

// Track if refresh is already in progress
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function onRefreshed(token: string) {
  refreshSubscribers.forEach(cb => cb(token));
  refreshSubscribers = [];
}

function addRefreshSubscriber(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

api.interceptors.response.use(
  (res) => res,
  async (err: AxiosError) => {
    const status = err.response?.status;
    const originalRequest = err.config as any;
    
    if (status === 401 && onUnauthorized && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // If already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve) => {
          addRefreshSubscriber((token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }
      
      isRefreshing = true;
      
      try {
        // Attempt to refresh session
        const { useStore } = await import("@/lib/store/store");
        const state = useStore.getState();
        
        await state.refreshSession();
        
        const newToken = state.token;
        if (newToken) {
          // Update auth header
          setAuthToken(newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          
          // Notify queued subscribers
          onRefreshed(newToken);
          isRefreshing = false;
          
          // Retry original request
          return api(originalRequest);
        }
      } catch (refreshError) {
        isRefreshing = false;
        onRefreshed(''); // Clear subscribers
        // Refresh failed - show toast and logout
        showToast("error", "Session expired. Please sign in again.");
        onUnauthorized();
      }
      
      return Promise.reject(err);
    }
    
    return Promise.reject(err);
  },
);
