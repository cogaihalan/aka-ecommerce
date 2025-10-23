/**
 * Utility functions for generating and working with URL-friendly slugs
 */

/**
 * Generates a URL-friendly slug from a given string
 * @param text - The text to convert to a slug
 * @returns A URL-friendly slug
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters except spaces and hyphens
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, "") // Remove leading/trailing hyphens
    .trim();
}

/**
 * Converts a slug back to a readable format
 * @param slug - The slug to convert
 * @returns A readable string
 */
export function slugToReadable(slug: string): string {
  return slug.replace(/-/g, " ").replace(/_/g, " ");
}

/**
 * Validates if a string is a valid slug format
 * @param slug - The slug to validate
 * @returns True if the slug is valid
 */
export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9-]+$/.test(slug);
}
