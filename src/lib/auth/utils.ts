import { User as ClerkUser } from "@clerk/nextjs/server";
import {
  UserRole,
  UserPermission,
  ROLE_PERMISSIONS,
  AppUser,
  ClerkUserMetadata,
  AuthError,
  PermissionError,
  RoleError,
} from "@/types/auth";

/**
 * Convert Clerk user to App user with role and permissions (server-side)
 */
export function clerkUserToAppUser(clerkUser: ClerkUser): AppUser {
  const metadata = clerkUser.publicMetadata as ClerkUserMetadata;
  const role = metadata?.role || UserRole.USER;
  const permissions = ROLE_PERMISSIONS[role];

  return {
    id: clerkUser.id,
    email: clerkUser.emailAddresses[0]?.emailAddress || "",
    firstName: clerkUser.firstName || undefined,
    lastName: clerkUser.lastName || undefined,
    fullName: clerkUser.fullName || undefined,
    imageUrl: clerkUser.imageUrl || undefined,
    role,
    permissions,
    isActive: metadata?.isActive !== false,
    createdAt: new Date(clerkUser.createdAt),
    updatedAt: new Date(clerkUser.updatedAt),
    lastSignInAt: clerkUser.lastSignInAt
      ? new Date(clerkUser.lastSignInAt)
      : undefined,
    metadata: metadata || {},
  };
}

/**
 * Convert Clerk UserResource to App user with role and permissions (client-side)
 */
export function clerkUserResourceToAppUser(clerkUser: any): AppUser {
  const metadata = clerkUser.publicMetadata as ClerkUserMetadata;
  const role = metadata?.role || UserRole.USER;
  const permissions = ROLE_PERMISSIONS[role];

  return {
    id: clerkUser.id,
    email: clerkUser.emailAddresses[0]?.emailAddress || "",
    firstName: clerkUser.firstName || undefined,
    lastName: clerkUser.lastName || undefined,
    fullName: clerkUser.fullName || undefined,
    imageUrl: clerkUser.imageUrl || undefined,
    role,
    permissions,
    isActive: metadata?.isActive !== false,
    createdAt: new Date(clerkUser.createdAt),
    updatedAt: new Date(clerkUser.updatedAt),
    lastSignInAt: clerkUser.lastSignInAt
      ? new Date(clerkUser.lastSignInAt)
      : undefined,
    metadata: metadata || {},
  };
}

/**
 * Check if user has a specific permission
 */
export function hasPermission(
  user: AppUser | null,
  permission: UserPermission
): boolean {
  if (!user || !user.isActive) return false;
  return user.permissions.includes(permission);
}

/**
 * Check if user has a specific role
 */
export function hasRole(user: AppUser | null, role: UserRole): boolean {
  if (!user || !user.isActive) return false;
  return user.role === role;
}

/**
 * Check if user has any of the specified roles
 */
export function hasAnyRole(user: AppUser | null, roles: UserRole[]): boolean {
  if (!user || !user.isActive) return false;
  return roles.includes(user.role);
}

/**
 * Check if user has any of the specified permissions
 */
export function hasAnyPermission(
  user: AppUser | null,
  permissions: UserPermission[]
): boolean {
  if (!user || !user.isActive) return false;
  return permissions.some((permission) =>
    user.permissions.includes(permission)
  );
}

/**
 * Check if user can access dashboard (admin only)
 */
export function canAccessDashboard(user: AppUser | null): boolean {
  return hasPermission(user, UserPermission.ACCESS_DASHBOARD);
}

/**
 * Check if user can access storefront (all authenticated users)
 */
export function canAccessStorefront(user: AppUser | null): boolean {
  return hasPermission(user, UserPermission.VIEW_PRODUCTS);
}

/**
 * Get user permissions by role
 */
export function getPermissionsByRole(role: UserRole): UserPermission[] {
  return ROLE_PERMISSIONS[role] || [];
}

/**
 * Validate user role
 */
export function isValidRole(role: string): role is UserRole {
  return Object.values(UserRole).includes(role as UserRole);
}

/**
 * Validate user permission
 */
export function isValidPermission(
  permission: string
): permission is UserPermission {
  return Object.values(UserPermission).includes(permission as UserPermission);
}

/**
 * Create default user metadata for new users
 */
export function createDefaultUserMetadata(
  role: UserRole = UserRole.USER
): ClerkUserMetadata {
  return {
    role,
    isActive: true,
    permissions: ROLE_PERMISSIONS[role],
  };
}

/**
 * Update user metadata with role and permissions
 */
export function updateUserMetadata(
  currentMetadata: Record<string, any>,
  updates: Partial<ClerkUserMetadata>
): ClerkUserMetadata {
  const role =
    updates.role || (currentMetadata.role as UserRole) || UserRole.USER;
  const permissions = ROLE_PERMISSIONS[role];
  const isActive =
    updates.isActive !== undefined
      ? updates.isActive
      : currentMetadata.isActive !== false;

  return {
    ...currentMetadata,
    ...updates,
    role,
    permissions,
    isActive,
  };
}

/**
 * Check if user is admin
 */
export function isAdmin(user: AppUser | null): boolean {
  return hasRole(user, UserRole.ADMIN);
}

/**
 * Check if user is regular user
 */
export function isUser(user: AppUser | null): boolean {
  return hasRole(user, UserRole.USER);
}

/**
 * Get user display name
 */
export function getUserDisplayName(user: AppUser | null): string {
  if (!user) return "Guest";
  return (
    user.fullName ||
    `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
    user.email
  );
}

/**
 * Get user initials for avatar
 */
export function getUserInitials(user: AppUser | null): string {
  if (!user) return "G";

  const firstName = user.firstName || "";
  const lastName = user.lastName || "";

  if (firstName && lastName) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  }

  if (firstName) {
    return firstName[0].toUpperCase();
  }

  if (user.email) {
    return user.email[0].toUpperCase();
  }

  return "U";
}

/**
 * Create auth error
 */
export function createAuthError(
  message: string,
  code: string = "AUTH_ERROR"
): AuthError {
  return new AuthError(message, code);
}

/**
 * Create permission error
 */
export function createPermissionError(
  permission: UserPermission
): PermissionError {
  return new PermissionError(
    `Access denied. Required permission: ${permission}`,
    permission
  );
}

/**
 * Create role error
 */
export function createRoleError(role: UserRole): RoleError {
  return new RoleError(`Access denied. Required role: ${role}`, role);
}

/**
 * Validate user access for API routes
 */
export function validateUserAccess(
  user: AppUser | null,
  requiredPermission?: UserPermission,
  requiredRole?: UserRole
): void {
  if (!user) {
    throw createAuthError("Authentication required", "AUTH_REQUIRED");
  }

  if (!user.isActive) {
    throw createAuthError("Account is inactive", "ACCOUNT_INACTIVE");
  }

  if (requiredRole && !hasRole(user, requiredRole)) {
    throw createRoleError(requiredRole);
  }

  if (requiredPermission && !hasPermission(user, requiredPermission)) {
    throw createPermissionError(requiredPermission);
  }
}
