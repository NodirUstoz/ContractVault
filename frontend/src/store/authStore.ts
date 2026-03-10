/**
 * Zustand auth store.
 * Manages authentication state, token persistence, and user profile.
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authApi, UserProfile, LoginPayload, RegisterPayload } from "../api/auth";

interface AuthState {
  user: UserProfile | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  loadProfile: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      async login(payload: LoginPayload) {
        set({ isLoading: true, error: null });
        try {
          const { data } = await authApi.login(payload);
          localStorage.setItem("access_token", data.tokens.access);
          localStorage.setItem("refresh_token", data.tokens.refresh);
          set({
            user: data.user,
            accessToken: data.tokens.access,
            refreshToken: data.tokens.refresh,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (err: any) {
          const message =
            err.response?.data?.error?.message ||
            err.response?.data?.detail ||
            "Login failed. Please check your credentials.";
          set({ error: message, isLoading: false });
          throw err;
        }
      },

      async register(payload: RegisterPayload) {
        set({ isLoading: true, error: null });
        try {
          const { data } = await authApi.register(payload);
          localStorage.setItem("access_token", data.tokens.access);
          localStorage.setItem("refresh_token", data.tokens.refresh);
          set({
            user: data.user,
            accessToken: data.tokens.access,
            refreshToken: data.tokens.refresh,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (err: any) {
          const message =
            err.response?.data?.error?.message || "Registration failed.";
          set({ error: message, isLoading: false });
          throw err;
        }
      },

      logout() {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          error: null,
        });
      },

      async loadProfile() {
        if (!get().accessToken) return;
        try {
          const { data } = await authApi.getProfile();
          set({ user: data });
        } catch {
          // Token may be invalid
          get().logout();
        }
      },

      clearError() {
        set({ error: null });
      },
    }),
    {
      name: "contractvault-auth",
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    },
  ),
);
