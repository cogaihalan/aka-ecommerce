import { z } from "zod";

// Category validation schemas
export const categoryFormSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters")
    .regex(/^[a-zA-Z0-9\s\-&]+$/, "Name contains invalid characters"),

  slug: z
    .string()
    .min(1, "Slug is required")
    .max(100, "Slug must be less than 100 characters")
    .regex(
      /^[a-z0-9\-]+$/,
      "Slug must contain only lowercase letters, numbers, and hyphens"
    )
    .refine(
      (slug) => !slug.startsWith("-") && !slug.endsWith("-"),
      "Slug cannot start or end with hyphens"
    ),

  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),

  parentId: z.number().positive("Parent ID must be positive").optional(),

  image: z.string().url("Must be a valid URL").optional().or(z.literal("")),

  isActive: z.boolean().default(true),

  includeInMenu: z.boolean().default(true),

  seo: z
    .object({
      title: z
        .string()
        .max(60, "SEO title must be less than 60 characters")
        .optional(),
      description: z
        .string()
        .max(160, "SEO description must be less than 160 characters")
        .optional(),
      keywords: z
        .array(z.string().max(50, "Keyword must be less than 50 characters"))
        .max(10, "Maximum 10 keywords allowed")
        .optional(),
    })
    .optional(),
});

// Category product assignment validation
export const categoryProductAssignmentSchema = z.object({
  categoryId: z.number().positive("Category ID must be positive"),

  productIds: z
    .array(z.number().positive("Product ID must be positive"))
    .min(1, "At least one product must be selected")
    .max(100, "Maximum 100 products can be assigned at once"),

  positions: z.record(z.number().int().min(0)).optional(),
});

// Category search validation
export const categorySearchSchema = z.object({
  query: z
    .string()
    .min(1, "Search query is required")
    .max(100, "Search query must be less than 100 characters"),

  limit: z
    .number()
    .int("Limit must be an integer")
    .min(1, "Limit must be at least 1")
    .max(100, "Limit cannot exceed 100")
    .default(10),
});

// Category filter validation
export const categoryFilterSchema = z.object({
  isActive: z.boolean().optional(),

  parentId: z.number().positive("Parent ID must be positive").optional(),

  level: z
    .number()
    .int("Level must be an integer")
    .min(0, "Level must be non-negative")
    .max(10, "Level cannot exceed 10")
    .optional(),

  includeInMenu: z.boolean().optional(),

  hasProducts: z.boolean().optional(),
});

// Category tree validation
export const categoryTreeSchema = z.object({
  categories: z
    .array(
      z.object({
        id: z.number().positive(),
        name: z.string().min(1),
        slug: z.string().min(1),
        level: z.number().int().min(0),
        path: z.string().min(1),
        isActive: z.boolean(),
        includeInMenu: z.boolean(),
        productCount: z.number().int().min(0),
        children: z.array(z.any()).optional(),
      })
    )
    .min(0),

  totalCategories: z.number().int().min(0),
});

// Validation helper functions
export const validateCategorySlug = (slug: string): boolean => {
  const slugRegex = /^[a-z0-9\-]+$/;
  return slugRegex.test(slug) && !slug.startsWith("-") && !slug.endsWith("-");
};

export const validateCategoryName = (name: string): boolean => {
  const nameRegex = /^[a-zA-Z0-9\s\-&]+$/;
  return name.length >= 1 && name.length <= 100 && nameRegex.test(name);
};

export const validateCategoryPath = (
  path: string,
  parentPath?: string
): boolean => {
  if (!parentPath) {
    return /^\d+$/.test(path);
  }
  return new RegExp(`^${parentPath}/\\d+$`).test(path);
};

// Error messages
export const VALIDATION_ERRORS = {
  NAME_REQUIRED: "Category name is required",
  NAME_TOO_LONG: "Category name must be less than 100 characters",
  NAME_INVALID_CHARS: "Category name contains invalid characters",
  SLUG_REQUIRED: "Category slug is required",
  SLUG_TOO_LONG: "Category slug must be less than 100 characters",
  SLUG_INVALID_FORMAT:
    "Slug must contain only lowercase letters, numbers, and hyphens",
  SLUG_INVALID_HYPHENS: "Slug cannot start or end with hyphens",
  DESCRIPTION_TOO_LONG: "Description must be less than 500 characters",
  PARENT_ID_INVALID: "Parent ID must be positive",
  IMAGE_INVALID_URL: "Must be a valid URL",
  SEO_TITLE_TOO_LONG: "SEO title must be less than 60 characters",
  SEO_DESCRIPTION_TOO_LONG: "SEO description must be less than 160 characters",
  KEYWORD_TOO_LONG: "Keyword must be less than 50 characters",
  TOO_MANY_KEYWORDS: "Maximum 10 keywords allowed",
  SORT_ORDER_INVALID: "Sort order must be a non-negative integer",
  CATEGORY_ID_REQUIRED: "Category ID is required",
  PRODUCT_IDS_REQUIRED: "At least one product must be selected",
  TOO_MANY_PRODUCTS: "Maximum 100 products can be assigned at once",
  SEARCH_QUERY_REQUIRED: "Search query is required",
  SEARCH_QUERY_TOO_LONG: "Search query must be less than 100 characters",
  LEVEL_INVALID: "Level must be between 0 and 10",
} as const;
