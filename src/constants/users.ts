import {
  UserRole,
  UserPermission,
  ROLE_PERMISSIONS,
  AppUser,
} from "@/types/auth";

/**
 * Development User Constants
 *
 * This file contains sample user data for development and testing purposes.
 * Use these constants to easily test different user scenarios without external API calls.
 */

// Admin Users
export const ADMIN_USERS: AppUser[] = [
  {
    id: "admin-1",
    email: "vuibinhyen2003@gmail.com",
    firstName: "Kevin",
    lastName: "Hoang",
    fullName: "Kevin Hoang",
    role: UserRole.ADMIN,
    permissions: ROLE_PERMISSIONS[UserRole.ADMIN],
    isActive: true,
    imageUrl: "https://api.slingacademy.com/public/sample-users/admin.png",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    lastSignInAt: new Date("2024-01-15"),
    metadata: { description: "Main administrator account" },
  },
  {
    id: "admin-2",
    email: "john.admin@aka.com",
    firstName: "John",
    lastName: "Admin",
    fullName: "John Admin",
    role: UserRole.ADMIN,
    permissions: ROLE_PERMISSIONS[UserRole.ADMIN],
    isActive: true,
    imageUrl: "https://api.slingacademy.com/public/sample-users/admin2.png",
    createdAt: new Date("2024-01-02"),
    updatedAt: new Date("2024-01-02"),
    lastSignInAt: new Date("2024-01-14"),
    metadata: { description: "Secondary admin account" },
  },
  {
    id: "admin-3",
    email: "sarah.manager@aka.com",
    firstName: "Sarah",
    lastName: "Manager",
    fullName: "Sarah Manager",
    role: UserRole.ADMIN,
    permissions: ROLE_PERMISSIONS[UserRole.ADMIN],
    isActive: true,
    imageUrl: "https://api.slingacademy.com/public/sample-users/manager.png",
    createdAt: new Date("2024-01-03"),
    updatedAt: new Date("2024-01-03"),
    lastSignInAt: new Date("2024-01-13"),
    metadata: { description: "Manager account" },
  },
];

// Regular Users
export const REGULAR_USERS: AppUser[] = [
  {
    id: "user-1",
    email: "olivia.martin@email.com",
    firstName: "Olivia",
    lastName: "Martin",
    fullName: "Olivia Martin",
    role: UserRole.USER,
    permissions: ROLE_PERMISSIONS[UserRole.USER],
    isActive: true,
    imageUrl: "https://api.slingacademy.com/public/sample-users/1.png",
    createdAt: new Date("2024-01-04"),
    updatedAt: new Date("2024-01-04"),
    lastSignInAt: new Date("2024-01-12"),
    metadata: { description: "Premium customer" },
  },
  {
    id: "user-2",
    email: "jackson.lee@email.com",
    firstName: "Jackson",
    lastName: "Lee",
    fullName: "Jackson Lee",
    role: UserRole.USER,
    permissions: ROLE_PERMISSIONS[UserRole.USER],
    isActive: true,
    imageUrl: "https://api.slingacademy.com/public/sample-users/2.png",
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-05"),
    lastSignInAt: new Date("2024-01-11"),
    metadata: { description: "Frequent buyer" },
  },
  {
    id: "user-3",
    email: "isabella.nguyen@email.com",
    firstName: "Isabella",
    lastName: "Nguyen",
    fullName: "Isabella Nguyen",
    role: UserRole.USER,
    permissions: ROLE_PERMISSIONS[UserRole.USER],
    isActive: true,
    imageUrl: "https://api.slingacademy.com/public/sample-users/3.png",
    createdAt: new Date("2024-01-06"),
    updatedAt: new Date("2024-01-06"),
    lastSignInAt: new Date("2024-01-10"),
    metadata: { description: "New customer" },
  },
  {
    id: "user-4",
    email: "will@email.com",
    firstName: "William",
    lastName: "Kim",
    fullName: "William Kim",
    role: UserRole.USER,
    permissions: ROLE_PERMISSIONS[UserRole.USER],
    isActive: true,
    imageUrl: "https://api.slingacademy.com/public/sample-users/4.png",
    createdAt: new Date("2024-01-07"),
    updatedAt: new Date("2024-01-07"),
    lastSignInAt: new Date("2024-01-09"),
    metadata: { description: "VIP customer" },
  },
  {
    id: "user-5",
    email: "sofia.davis@email.com",
    firstName: "Sofia",
    lastName: "Davis",
    fullName: "Sofia Davis",
    role: UserRole.USER,
    permissions: ROLE_PERMISSIONS[UserRole.USER],
    isActive: true,
    imageUrl: "https://api.slingacademy.com/public/sample-users/5.png",
    createdAt: new Date("2024-01-08"),
    updatedAt: new Date("2024-01-08"),
    lastSignInAt: new Date("2024-01-08"),
    metadata: { description: "Regular customer" },
  },
  {
    id: "user-6",
    email: "michael.brown@email.com",
    firstName: "Michael",
    lastName: "Brown",
    fullName: "Michael Brown",
    role: UserRole.USER,
    permissions: ROLE_PERMISSIONS[UserRole.USER],
    isActive: true,
    imageUrl: "https://api.slingacademy.com/public/sample-users/6.png",
    createdAt: new Date("2024-01-09"),
    updatedAt: new Date("2024-01-09"),
    lastSignInAt: new Date("2024-01-07"),
    metadata: { description: "Tech enthusiast" },
  },
  {
    id: "user-7",
    email: "emma.wilson@email.com",
    firstName: "Emma",
    lastName: "Wilson",
    fullName: "Emma Wilson",
    role: UserRole.USER,
    permissions: ROLE_PERMISSIONS[UserRole.USER],
    isActive: true,
    imageUrl: "https://api.slingacademy.com/public/sample-users/7.png",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10"),
    lastSignInAt: new Date("2024-01-06"),
    metadata: { description: "Fashion lover" },
  },
  {
    id: "user-8",
    email: "alex.garcia@email.com",
    firstName: "Alex",
    lastName: "Garcia",
    fullName: "Alex Garcia",
    role: UserRole.USER,
    permissions: ROLE_PERMISSIONS[UserRole.USER],
    isActive: false,
    imageUrl: "https://api.slingacademy.com/public/sample-users/8.png",
    createdAt: new Date("2024-01-11"),
    updatedAt: new Date("2024-01-11"),
    lastSignInAt: undefined,
    metadata: { description: "Inactive user" },
  },
];

// Test Users for specific scenarios
export const TEST_USERS: AppUser[] = [
  {
    id: "test-1",
    email: "test.user@aka.com",
    firstName: "Test",
    lastName: "User",
    fullName: "Test User",
    role: UserRole.USER,
    permissions: ROLE_PERMISSIONS[UserRole.USER],
    isActive: true,
    imageUrl: "https://api.slingacademy.com/public/sample-users/test.png",
    createdAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-12"),
    lastSignInAt: new Date("2024-01-05"),
    metadata: { description: "General testing account" },
  },
  {
    id: "test-2",
    email: "demo@aka.com",
    firstName: "Demo",
    lastName: "Account",
    fullName: "Demo Account",
    role: UserRole.USER,
    permissions: ROLE_PERMISSIONS[UserRole.USER],
    isActive: true,
    imageUrl: "https://api.slingacademy.com/public/sample-users/demo.png",
    createdAt: new Date("2024-01-13"),
    updatedAt: new Date("2024-01-13"),
    lastSignInAt: new Date("2024-01-04"),
    metadata: { description: "Demo account for presentations" },
  },
  {
    id: "test-3",
    email: "qa.test@aka.com",
    firstName: "QA",
    lastName: "Tester",
    fullName: "QA Tester",
    role: UserRole.USER,
    permissions: ROLE_PERMISSIONS[UserRole.USER],
    isActive: true,
    imageUrl: "https://api.slingacademy.com/public/sample-users/qa.png",
    createdAt: new Date("2024-01-14"),
    updatedAt: new Date("2024-01-14"),
    lastSignInAt: new Date("2024-01-03"),
    metadata: { description: "Quality assurance testing" },
  },
];

// Additional users for better pagination testing
export const ADDITIONAL_USERS: AppUser[] = [
  {
    id: "user-9",
    email: "david.chen@email.com",
    firstName: "David",
    lastName: "Chen",
    fullName: "David Chen",
    role: UserRole.USER,
    permissions: ROLE_PERMISSIONS[UserRole.USER],
    isActive: true,
    imageUrl: "https://api.slingacademy.com/public/sample-users/9.png",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
    lastSignInAt: new Date("2024-01-02"),
    metadata: { description: "Software developer" },
  },
  {
    id: "user-10",
    email: "lisa.wong@email.com",
    firstName: "Lisa",
    lastName: "Wong",
    fullName: "Lisa Wong",
    role: UserRole.USER,
    permissions: ROLE_PERMISSIONS[UserRole.USER],
    isActive: true,
    imageUrl: "https://api.slingacademy.com/public/sample-users/10.png",
    createdAt: new Date("2024-01-16"),
    updatedAt: new Date("2024-01-16"),
    lastSignInAt: new Date("2024-01-01"),
    metadata: { description: "Marketing specialist" },
  },
  {
    id: "user-11",
    email: "james.smith@email.com",
    firstName: "James",
    lastName: "Smith",
    fullName: "James Smith",
    role: UserRole.USER,
    permissions: ROLE_PERMISSIONS[UserRole.USER],
    isActive: false,
    imageUrl: "https://api.slingacademy.com/public/sample-users/11.png",
    createdAt: new Date("2024-01-17"),
    updatedAt: new Date("2024-01-17"),
    lastSignInAt: undefined,
    metadata: { description: "Former employee" },
  },
  {
    id: "user-12",
    email: "maria.rodriguez@email.com",
    firstName: "Maria",
    lastName: "Rodriguez",
    fullName: "Maria Rodriguez",
    role: UserRole.USER,
    permissions: ROLE_PERMISSIONS[UserRole.USER],
    isActive: true,
    imageUrl: "https://api.slingacademy.com/public/sample-users/12.png",
    createdAt: new Date("2024-01-18"),
    updatedAt: new Date("2024-01-18"),
    lastSignInAt: new Date("2024-01-31"),
    metadata: { description: "Customer service rep" },
  },
  {
    id: "user-13",
    email: "robert.johnson@email.com",
    firstName: "Robert",
    lastName: "Johnson",
    fullName: "Robert Johnson",
    role: UserRole.USER,
    permissions: ROLE_PERMISSIONS[UserRole.USER],
    isActive: true,
    imageUrl: "https://api.slingacademy.com/public/sample-users/13.png",
    createdAt: new Date("2024-01-19"),
    updatedAt: new Date("2024-01-19"),
    lastSignInAt: new Date("2024-01-30"),
    metadata: { description: "Sales manager" },
  },
  {
    id: "user-14",
    email: "sarah.williams@email.com",
    firstName: "Sarah",
    lastName: "Williams",
    fullName: "Sarah Williams",
    role: UserRole.USER,
    permissions: ROLE_PERMISSIONS[UserRole.USER],
    isActive: true,
    imageUrl: "https://api.slingacademy.com/public/sample-users/14.png",
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
    lastSignInAt: new Date("2024-01-29"),
    metadata: { description: "UX designer" },
  },
  {
    id: "user-15",
    email: "michael.davis@email.com",
    firstName: "Michael",
    lastName: "Davis",
    fullName: "Michael Davis",
    role: UserRole.USER,
    permissions: ROLE_PERMISSIONS[UserRole.USER],
    isActive: true,
    imageUrl: "https://api.slingacademy.com/public/sample-users/15.png",
    createdAt: new Date("2024-01-21"),
    updatedAt: new Date("2024-01-21"),
    lastSignInAt: new Date("2024-01-28"),
    metadata: { description: "Product manager" },
  },
  {
    id: "user-16",
    email: "jennifer.brown@email.com",
    firstName: "Jennifer",
    lastName: "Brown",
    fullName: "Jennifer Brown",
    role: UserRole.USER,
    permissions: ROLE_PERMISSIONS[UserRole.USER],
    isActive: false,
    imageUrl: "https://api.slingacademy.com/public/sample-users/16.png",
    createdAt: new Date("2024-01-22"),
    updatedAt: new Date("2024-01-22"),
    lastSignInAt: undefined,
    metadata: { description: "Inactive user" },
  },
  {
    id: "user-17",
    email: "thomas.miller@email.com",
    firstName: "Thomas",
    lastName: "Miller",
    fullName: "Thomas Miller",
    role: UserRole.USER,
    permissions: ROLE_PERMISSIONS[UserRole.USER],
    isActive: true,
    imageUrl: "https://api.slingacademy.com/public/sample-users/17.png",
    createdAt: new Date("2024-01-23"),
    updatedAt: new Date("2024-01-23"),
    lastSignInAt: new Date("2024-01-27"),
    metadata: { description: "Data analyst" },
  },
  {
    id: "user-18",
    email: "linda.garcia@email.com",
    firstName: "Linda",
    lastName: "Garcia",
    fullName: "Linda Garcia",
    role: UserRole.USER,
    permissions: ROLE_PERMISSIONS[UserRole.USER],
    isActive: true,
    imageUrl: "https://api.slingacademy.com/public/sample-users/18.png",
    createdAt: new Date("2024-01-24"),
    updatedAt: new Date("2024-01-24"),
    lastSignInAt: new Date("2024-01-26"),
    metadata: { description: "Content writer" },
  },
];

// All users combined - now with more users for better pagination
export const ALL_DEV_USERS: AppUser[] = [
  ...ADMIN_USERS,
  ...REGULAR_USERS,
  ...TEST_USERS,
  ...ADDITIONAL_USERS,
];

// Email lists for easy access
export const ADMIN_EMAILS = ADMIN_USERS.map((user) => user.email);
export const USER_EMAILS = REGULAR_USERS.map((user) => user.email);
export const TEST_EMAILS = TEST_USERS.map((user) => user.email);
export const ALL_EMAILS = ALL_DEV_USERS.map((user) => user.email);

// Helper functions
export const getUserByEmail = (email: string): AppUser | undefined => {
  return ALL_DEV_USERS.find((user) => user.email === email);
};

export const getUsersByRole = (role: UserRole): AppUser[] => {
  return ALL_DEV_USERS.filter((user) => user.role === role);
};

export const getActiveUsers = (): AppUser[] => {
  return ALL_DEV_USERS.filter((user) => user.isActive);
};

export const getInactiveUsers = (): AppUser[] => {
  return ALL_DEV_USERS.filter((user) => !user.isActive);
};

export const getRandomUser = (): AppUser => {
  const randomIndex = Math.floor(Math.random() * ALL_DEV_USERS.length);
  return ALL_DEV_USERS[randomIndex];
};

export const getRandomUsers = (count: number): AppUser[] => {
  const shuffled = [...ALL_DEV_USERS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Quick access to specific users
export const DEV_USER_CONSTANTS = {
  ADMIN: {
    PRIMARY: ADMIN_USERS[0],
    SECONDARY: ADMIN_USERS[1],
    MANAGER: ADMIN_USERS[2],
  },
  USER: {
    PREMIUM: REGULAR_USERS[0],
    FREQUENT: REGULAR_USERS[1],
    NEW: REGULAR_USERS[2],
    VIP: REGULAR_USERS[3],
    REGULAR: REGULAR_USERS[4],
    INACTIVE: REGULAR_USERS[7],
  },
  TEST: {
    GENERAL: TEST_USERS[0],
    DEMO: TEST_USERS[1],
    QA: TEST_USERS[2],
  },
} as const;

// Email validation helpers
export const isValidDevEmail = (email: string): boolean => {
  return ALL_EMAILS.includes(email);
};

export const isAdminEmail = (email: string): boolean => {
  return ADMIN_EMAILS.includes(email);
};

export const isUserEmail = (email: string): boolean => {
  return USER_EMAILS.includes(email);
};

export const isTestEmail = (email: string): boolean => {
  return TEST_EMAILS.includes(email);
};
