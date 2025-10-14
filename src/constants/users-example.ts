/**
 * User Constants Usage Examples
 *
 * This file demonstrates how to use the user constants for development and testing.
 * Copy these examples into your components or services as needed.
 */

import { UserRole, AppUser } from "@/types/auth";
import {
  // Individual user arrays
  ADMIN_USERS,
  REGULAR_USERS,
  TEST_USERS,
  ALL_DEV_USERS,

  // Email arrays
  ADMIN_EMAILS,
  USER_EMAILS,
  ALL_EMAILS,

  // Helper functions
  getUserByEmail,
  getUsersByRole,
  getActiveUsers,
  getRandomUser,
  getRandomUsers,

  // Quick access constants
  DEV_USER_CONSTANTS,

  // Validation helpers
  isValidDevEmail,
  isAdminEmail,
  isUserEmail,
} from "./users";
import { unifiedUserService } from '@/lib/api/services/factories';

// Example 1: Get all admin users
export function getAllAdmins() {
  return ADMIN_USERS;
  // or
  return getUsersByRole(UserRole.ADMIN);
}

// Example 2: Get a specific user by email
export function getUserByEmailExample(email: string) {
  return getUserByEmail(email);
  // Usage: getUserByEmail("admin@aka.com")
}

// Example 3: Get random users for testing
export function getRandomUsersExample(count: number = 3) {
  return getRandomUsers(count);
}

// Example 4: Check if email is valid for development
export function validateDevEmail(email: string) {
  if (isValidDevEmail(email)) {
    console.log(`${email} is a valid development email`);
    return true;
  }
  console.log(`${email} is not a valid development email`);
  return false;
}

// Example 5: Get users by role
export function getUsersByRoleExample(role: UserRole) {
  return getUsersByRole(role);
}

// Example 6: Get active users only
export function getActiveUsersExample() {
  return getActiveUsers();
}

// Example 7: Quick access to specific users
export function getQuickAccessUsers() {
  return {
    primaryAdmin: DEV_USER_CONSTANTS.ADMIN.PRIMARY,
    premiumUser: DEV_USER_CONSTANTS.USER.PREMIUM,
    testUser: DEV_USER_CONSTANTS.TEST.GENERAL,
    demoUser: DEV_USER_CONSTANTS.TEST.DEMO,
  };
}

// Example 8: Using the service methods
export function useServiceMethods() {
  // Get all dev users
  const allUsers = unifiedUserService.getDevUsers();

  // Get admin users
  const adminUsers = unifiedUserService.getDevUsersByRole(UserRole.ADMIN);

  // Check if email is admin
  const isAdmin = unifiedUserService.isDevAdminEmail("admin@aka.com");

  // Get random users
  const randomUsers = unifiedUserService.getDevRandomUsers(5);

  return {
    allUsers,
    adminUsers,
    isAdmin,
    randomUsers,
  };
}

// Example 9: Form validation with dev emails
export function validateUserForm(email: string, role: UserRole) {
  const errors: string[] = [];

  if (!isValidDevEmail(email)) {
    errors.push("Please use a valid development email");
  }

  if (role === UserRole.ADMIN && !isAdminEmail(email)) {
    errors.push("Admin role requires an admin email");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Example 10: Populate dropdown with user emails
export function getUserEmailOptions() {
  return {
    adminEmails: ADMIN_EMAILS,
    userEmails: USER_EMAILS,
    allEmails: ALL_EMAILS,
  };
}

// Example 11: Create test data for components
export function createTestUserData() {
  return {
    // For user management table
    tableData: ALL_DEV_USERS.map((user) => ({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      role: user.role,
      status: user.isActive ? "Active" : "Inactive",
      avatar: user.imageUrl,
    })),

    // For user selection dropdown
    selectOptions: ALL_DEV_USERS.map((user) => ({
      value: user.id,
      label: `${user.firstName} ${user.lastName} (${user.email})`,
      role: user.role,
    })),

    // For role-based filtering
    roleGroups: {
      admins: getUsersByRole(UserRole.ADMIN),
      users: getUsersByRole(UserRole.USER),
    },
  };
}

// Example 12: Authentication simulation
export function simulateAuth(email: string) {
  const user = getUserByEmail(email);

  if (!user) {
    return { success: false, message: "User not found" };
  }

  if (!user.isActive) {
    return { success: false, message: "User account is inactive" };
  }

  return {
    success: true,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      avatar: user.imageUrl,
    },
  };
}
