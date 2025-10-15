// Permission interface
export interface Permission {
  id: number;
  code: string;
  name: string;
}

// Role interface
export interface Role {
  id: number;
  code: string;
  name: string;
  permissions: Permission[];
}

// Main user interface
export interface User {
  id: number;
  clerkId: string;
  username: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  avatarUrl: string;
  enabled: boolean;
  roles: Role[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}
