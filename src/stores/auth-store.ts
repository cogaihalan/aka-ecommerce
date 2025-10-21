"use client";

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { User } from "@/types";

interface AuthStore {
  // UI State
  isDropdownOpen: boolean;
  toggleDropdown: () => void;
  openDropdown: () => void;
  closeDropdown: () => void;

  // Loading State
  isSigningOut: boolean;
  setSigningOut: (loading: boolean) => void;

  // User State (for caching and offline support)
  user: User | null;
  setUser: (user: User | null) => void;
  clearUser: () => void;

  // Permission checks (cached)
  hasRole: (roleName: string) => boolean;
  hasAnyRole: (roleNames: string[]) => boolean;
  canAccessDashboard: () => boolean;
  canAccessStorefront: () => boolean;

  // Utility methods
  isAdmin: () => boolean;
  isUser: () => boolean;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set, get) => ({
        // UI State
        isDropdownOpen: false,
        toggleDropdown: () =>
          set((state) => ({ isDropdownOpen: !state.isDropdownOpen })),
        openDropdown: () => set({ isDropdownOpen: true }),
        closeDropdown: () => set({ isDropdownOpen: false }),

        // Loading State
        isSigningOut: false,
        setSigningOut: (loading) => set({ isSigningOut: loading }),

        // User State
        user: null,
        setUser: (user) => set({ user }),
        clearUser: () => set({ user: null }),

        // Permission checks
        hasRole: (roleName) => {
          const { user } = get();
          if (!user || !user.enabled) return false;
          return user.roles.some((role) => role.name === roleName);
        },

        hasAnyRole: (roleNames) => {
          const { user } = get();
          if (!user || !user.enabled) return false;
          return user.roles.some((role) => roleNames.includes(role.name));
        },

        canAccessDashboard: () => {
          const { hasRole } = get();
          return hasRole("ADMIN");
        },

        canAccessStorefront: () => {
          const { user } = get();
          return !!(user && user.enabled);
        },

        // Utility methods
        isAdmin: () => {
          const { hasRole } = get();
          return hasRole("ADMIN");
        },

        isUser: () => {
          const { hasRole } = get();
          return hasRole("USER");
        },

        isAuthenticated: () => {
          const { user } = get();
          return !!user && user.enabled;
        },
      }),
      {
        name: "auth-store",
        partialize: (state) => ({
          user: state.user,
        }),
      }
    ),
    {
      name: "auth-store",
    }
  )
);

// Selector hooks for better performance
export const useAuthDropdownOpen = () =>
  useAuthStore((state) => state.isDropdownOpen);
export const useAuthSigningOut = () =>
  useAuthStore((state) => state.isSigningOut);
export const useAuthUser = () => useAuthStore((state) => state.user);
export const useAuthIsAuthenticated = () =>
  useAuthStore((state) => state.isAuthenticated());
export const useAuthIsAdmin = () => useAuthStore((state) => state.isAdmin());
export const useAuthIsUser = () => useAuthStore((state) => state.isUser());
export const useAuthCanAccessDashboard = () =>
  useAuthStore((state) => state.canAccessDashboard());
export const useAuthCanAccessStorefront = () =>
  useAuthStore((state) => state.canAccessStorefront());
