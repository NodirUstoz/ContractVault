/**
 * Custom hook for authentication.
 * Wraps the auth store for convenient use in components.
 */
import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";

export function useAuth() {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    loadProfile,
    clearError,
  } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && !user) {
      loadProfile();
    }
  }, [isAuthenticated, user, loadProfile]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    loadProfile,
    clearError,
  };
}
