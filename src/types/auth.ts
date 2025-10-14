// User roles enum
export enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

// User permissions enum
export enum UserPermission {
  // Admin permissions
  MANAGE_USERS = "manage_users",
  MANAGE_PRODUCTS = "manage_products",
  MANAGE_CATEGORIES = "manage_categories",
  MANAGE_ORDERS = "manage_orders",
  VIEW_ANALYTICS = "view_analytics",
  MANAGE_SETTINGS = "manage_settings",
  ACCESS_DASHBOARD = "access_dashboard",

  // User permissions
  VIEW_PRODUCTS = "view_products",
  CREATE_ORDERS = "create_orders",
  VIEW_ORDERS = "view_orders",
  MANAGE_PROFILE = "manage_profile",
  MANAGE_WISHLIST = "manage_wishlist",
  MANAGE_ADDRESSES = "manage_addresses",
}

// Role to permissions mapping
export const ROLE_PERMISSIONS: Record<UserRole, UserPermission[]> = {
  [UserRole.ADMIN]: [
    UserPermission.MANAGE_USERS,
    UserPermission.MANAGE_PRODUCTS,
    UserPermission.MANAGE_CATEGORIES,
    UserPermission.MANAGE_ORDERS,
    UserPermission.VIEW_ANALYTICS,
    UserPermission.MANAGE_SETTINGS,
    UserPermission.ACCESS_DASHBOARD,
    UserPermission.VIEW_PRODUCTS,
    UserPermission.CREATE_ORDERS,
    UserPermission.VIEW_ORDERS,
    UserPermission.MANAGE_PROFILE,
    UserPermission.MANAGE_WISHLIST,
    UserPermission.MANAGE_ADDRESSES,
  ],
  [UserRole.USER]: [
    UserPermission.VIEW_PRODUCTS,
    UserPermission.CREATE_ORDERS,
    UserPermission.VIEW_ORDERS,
    UserPermission.MANAGE_PROFILE,
    UserPermission.MANAGE_WISHLIST,
    UserPermission.MANAGE_ADDRESSES,
  ],
};

// Extended user interface with Clerk integration
export interface AppUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  imageUrl?: string;
  role: UserRole;
  permissions: UserPermission[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastSignInAt?: Date;
  metadata?: Record<string, any>;
}

// User creation/update payload
export interface CreateUserPayload {
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  metadata?: Record<string, any>;
}

export interface UpdateUserPayload {
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  isActive?: boolean;
  metadata?: Record<string, any>;
}

// Auth context type
export interface AuthContextType {
  user: AppUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasPermission: (permission: UserPermission) => boolean;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  hasAnyPermission: (permissions: UserPermission[]) => boolean;
  canAccessDashboard: () => boolean;
  canAccessStorefront: () => boolean;
}

// API response types
export interface AuthApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface UserListResponse {
  users: AppUser[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Clerk user metadata structure
export interface ClerkUserMetadata {
  role: UserRole;
  isActive: boolean;
  permissions?: UserPermission[];
  [key: string]: any;
}

// Error types
export class AuthError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 401
  ) {
    super(message);
    this.name = "AuthError";
  }
}

export class PermissionError extends Error {
  constructor(
    message: string,
    public requiredPermission: UserPermission,
    public statusCode: number = 403
  ) {
    super(message);
    this.name = "PermissionError";
  }
}

export class RoleError extends Error {
  constructor(
    message: string,
    public requiredRole: UserRole,
    public statusCode: number = 403
  ) {
    super(message);
    this.name = "RoleError";
  }
}
