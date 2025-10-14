"use client";

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { AppUser, UserRole, UserPermission } from "@/types/auth";

interface AuthStore {
  // UI State
  isDropdownOpen: boolean;
  toggleDropdown: () => void;
  openDropdown: () => void;
  closeDropdown: () => void;
  
  // User State (for caching and offline support)
  user: AppUser | null;
  setUser: (user: AppUser | null) => void;
  clearUser: () => void;
  
  // Permission checks (cached)
  hasPermission: (permission: UserPermission) => boolean;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  hasAnyPermission: (permissions: UserPermission[]) => boolean;
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
        toggleDropdown: () => set((state) => ({ isDropdownOpen: !state.isDropdownOpen })),
        openDropdown: () => set({ isDropdownOpen: true }),
        closeDropdown: () => set({ isDropdownOpen: false }),
        
        // User State
        user: null,
        setUser: (user) => set({ user }),
        clearUser: () => set({ user: null }),
        
        // Permission checks
        hasPermission: (permission) => {
          const { user } = get();
          if (!user || !user.isActive) return false;
          return user.permissions.includes(permission);
        },
        
        hasRole: (role) => {
          const { user } = get();
          if (!user || !user.isActive) return false;
          return user.role === role;
        },
        
        hasAnyRole: (roles) => {
          const { user } = get();
          if (!user || !user.isActive) return false;
          return roles.includes(user.role);
        },
        
        hasAnyPermission: (permissions) => {
          const { user } = get();
          if (!user || !user.isActive) return false;
          return permissions.some(permission => user.permissions.includes(permission));
        },
        
        canAccessDashboard: () => {
          const { hasPermission } = get();
          return hasPermission(UserPermission.ACCESS_DASHBOARD);
        },
        
        canAccessStorefront: () => {
          const { hasPermission } = get();
          return hasPermission(UserPermission.VIEW_PRODUCTS);
        },
        
        // Utility methods
        isAdmin: () => {
          const { hasRole } = get();
          return hasRole(UserRole.ADMIN);
        },
        
        isUser: () => {
          const { hasRole } = get();
          return hasRole(UserRole.USER);
        },
        
        isAuthenticated: () => {
          const { user } = get();
          return !!user && user.isActive;
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
export const useAuthDropdownOpen = () => useAuthStore((state) => state.isDropdownOpen);
export const useAuthUser = () => useAuthStore((state) => state.user);
export const useAuthIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated());
export const useAuthIsAdmin = () => useAuthStore((state) => state.isAdmin());
export const useAuthIsUser = () => useAuthStore((state) => state.isUser());
export const useAuthCanAccessDashboard = () => useAuthStore((state) => state.canAccessDashboard());
export const useAuthCanAccessStorefront = () => useAuthStore((state) => state.canAccessStorefront());
