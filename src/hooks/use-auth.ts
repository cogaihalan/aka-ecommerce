"use client";

import { useUser, useAuth as useClerkAuth } from "@clerk/nextjs";
import { useMemo } from "react";
import {
  AppUser,
  UserRole,
  UserPermission,
  AuthContextType,
} from "@/types/auth";
import {
  clerkUserResourceToAppUser,
  hasPermission,
  hasRole,
  hasAnyRole,
  hasAnyPermission,
  canAccessDashboard,
  canAccessStorefront,
} from "@/lib/auth/utils";

/**
 * Custom hook for authentication with role-based permissions
 */
export function useAuth(): AuthContextType {
  const { user: clerkUser, isLoaded: isUserLoaded } = useUser();
  const { isSignedIn, isLoaded: isAuthLoaded } = useClerkAuth();

  const appUser = useMemo((): AppUser | null => {
    if (!isUserLoaded || !isAuthLoaded || !clerkUser || !isSignedIn) {
      return null;
    }
    return clerkUserResourceToAppUser(clerkUser);
  }, [clerkUser, isSignedIn, isUserLoaded, isAuthLoaded]);

  const isLoading = !isUserLoaded || !isAuthLoaded;

  const authContext: AuthContextType = useMemo(
    () => ({
      user: appUser,
      isLoading,
      isAuthenticated: !!appUser && !!isSignedIn,
      hasPermission: (permission: UserPermission) =>
        hasPermission(appUser, permission),
      hasRole: (role: UserRole) => hasRole(appUser, role),
      hasAnyRole: (roles: UserRole[]) => hasAnyRole(appUser, roles),
      hasAnyPermission: (permissions: UserPermission[]) =>
        hasAnyPermission(appUser, permissions),
      canAccessDashboard: () => canAccessDashboard(appUser),
      canAccessStorefront: () => canAccessStorefront(appUser),
    }),
    [appUser, isLoading, isSignedIn]
  );

  return authContext;
}

/**
 * Hook to check if user has specific permission
 */
export function usePermission(permission: UserPermission): boolean {
  const { hasPermission } = useAuth();
  return hasPermission(permission);
}

/**
 * Hook to check if user has specific role
 */
export function useRole(role: UserRole): boolean {
  const { hasRole } = useAuth();
  return hasRole(role);
}

/**
 * Hook to check if user has any of the specified roles
 */
export function useAnyRole(roles: UserRole[]): boolean {
  const { hasAnyRole } = useAuth();
  return hasAnyRole(roles);
}

/**
 * Hook to check if user has any of the specified permissions
 */
export function useAnyPermission(permissions: UserPermission[]): boolean {
  const { hasAnyPermission } = useAuth();
  return hasAnyPermission(permissions);
}

/**
 * Hook to check if user can access dashboard
 */
export function useCanAccessDashboard(): boolean {
  const { canAccessDashboard } = useAuth();
  return canAccessDashboard();
}

/**
 * Hook to check if user can access storefront
 */
export function useCanAccessStorefront(): boolean {
  const { canAccessStorefront } = useAuth();
  return canAccessStorefront();
}

/**
 * Hook to get current user
 */
export function useCurrentUser(): AppUser | null {
  const { user } = useAuth();
  return user;
}

/**
 * Hook to check if user is admin
 */
export function useIsAdmin(): boolean {
  const { hasRole } = useAuth();
  return hasRole(UserRole.ADMIN);
}

/**
 * Hook to check if user is regular user
 */
export function useIsUser(): boolean {
  const { hasRole } = useAuth();
  return hasRole(UserRole.USER);
}

/**
 * Hook to check authentication status
 */
export function useIsAuthenticated(): boolean {
  const { isAuthenticated } = useAuth();
  return isAuthenticated;
}

/**
 * Hook to check loading status
 */
export function useAuthLoading(): boolean {
  const { isLoading } = useAuth();
  return isLoading;
}
