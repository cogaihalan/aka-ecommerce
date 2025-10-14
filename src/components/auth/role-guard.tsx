"use client";

import { ReactNode } from "react";
import { useAuth } from "@/hooks/use-auth";
import { UserRole, UserPermission } from "@/types/auth";
import { Skeleton } from "@/components/ui/skeleton";
import { ShieldX } from "lucide-react";

interface RoleGuardProps {
  children: ReactNode;
  requiredRole?: UserRole;
  requiredRoles?: UserRole[];
  requiredPermission?: UserPermission;
  requiredPermissions?: UserPermission[];
  fallback?: ReactNode;
  showLoading?: boolean;
  showError?: boolean;
}

export function RoleGuard({
  children,
  requiredRole,
  requiredRoles,
  requiredPermission,
  requiredPermissions,
  fallback,
  showLoading = true,
  showError = true,
}: RoleGuardProps) {
  const { 
    isLoading, 
    isAuthenticated, 
    hasRole, 
    hasAnyRole, 
    hasPermission, 
    hasAnyPermission 
  } = useAuth();

  // Show loading state
  if (isLoading && showLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    if (fallback) return <>{fallback}</>;
    if (showError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center space-y-4 max-w-md mx-auto p-6">
            <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
              <ShieldX className="w-8 h-8 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Authentication Required</h1>
            <p className="text-muted-foreground">
              You must be signed in to access this content.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a 
                href="/auth/sign-in" 
                className="inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Sign In
              </a>
              <a 
                href="/" 
                className="inline-flex items-center justify-center px-4 py-2 border border-input bg-background rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                Go Home
              </a>
            </div>
          </div>
        </div>
      );
    }
    return null;
  }

  // Check role requirements
  if (requiredRole && !hasRole(requiredRole)) {
    if (fallback) return <>{fallback}</>;
    if (showError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center space-y-4 max-w-md mx-auto p-6">
            <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
              <ShieldX className="w-8 h-8 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Access Restricted</h1>
            <p className="text-muted-foreground">
              You need {requiredRole} role to access this content.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a 
                href="/account" 
                className="inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                My Account
              </a>
              <a 
                href="/" 
                className="inline-flex items-center justify-center px-4 py-2 border border-input bg-background rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                Go Home
              </a>
            </div>
          </div>
        </div>
      );
    }
    return null;
  }

  if (requiredRoles && !hasAnyRole(requiredRoles)) {
    if (fallback) return <>{fallback}</>;
    if (showError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center space-y-4 max-w-md mx-auto p-6">
            <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
              <ShieldX className="w-8 h-8 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Access Restricted</h1>
            <p className="text-muted-foreground">
              You need one of the following roles: {requiredRoles.join(", ")}.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a 
                href="/account" 
                className="inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                My Account
              </a>
              <a 
                href="/" 
                className="inline-flex items-center justify-center px-4 py-2 border border-input bg-background rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                Go Home
              </a>
            </div>
          </div>
        </div>
      );
    }
    return null;
  }

  // Check permission requirements
  if (requiredPermission && !hasPermission(requiredPermission)) {
    if (fallback) return <>{fallback}</>;
    if (showError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center space-y-4 max-w-md mx-auto p-6">
            <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
              <ShieldX className="w-8 h-8 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Access Restricted</h1>
            <p className="text-muted-foreground">
              You don't have the required permission: {requiredPermission}.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a 
                href="/account" 
                className="inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                My Account
              </a>
              <a 
                href="/" 
                className="inline-flex items-center justify-center px-4 py-2 border border-input bg-background rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                Go Home
              </a>
            </div>
          </div>
        </div>
      );
    }
    return null;
  }

  if (requiredPermissions && !hasAnyPermission(requiredPermissions)) {
    if (fallback) return <>{fallback}</>;
    if (showError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center space-y-4 max-w-md mx-auto p-6">
            <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
              <ShieldX className="w-8 h-8 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Access Restricted</h1>
            <p className="text-muted-foreground">
              You don't have any of the required permissions: {requiredPermissions.join(", ")}.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a 
                href="/account" 
                className="inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                My Account
              </a>
              <a 
                href="/" 
                className="inline-flex items-center justify-center px-4 py-2 border border-input bg-background rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                Go Home
              </a>
            </div>
          </div>
        </div>
      );
    }
    return null;
  }

  // User has required access
  return <>{children}</>;
}

// Convenience components for common use cases
export function AdminOnly({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <RoleGuard requiredRole={UserRole.ADMIN} fallback={fallback}>
      {children}
    </RoleGuard>
  );
}

export function UserOnly({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <RoleGuard requiredRole={UserRole.USER} fallback={fallback}>
      {children}
    </RoleGuard>
  );
}

export function AuthenticatedOnly({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <RoleGuard fallback={fallback}>
      {children}
    </RoleGuard>
  );
}

export function PermissionGuard({ 
  permission, 
  children, 
  fallback 
}: { 
  permission: UserPermission; 
  children: ReactNode; 
  fallback?: ReactNode;
}) {
  return (
    <RoleGuard requiredPermission={permission} fallback={fallback}>
      {children}
    </RoleGuard>
  );
}

export function DashboardAccess({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <RoleGuard 
      requiredPermission={UserPermission.ACCESS_DASHBOARD} 
      fallback={fallback}
    >
      {children}
    </RoleGuard>
  );
}
