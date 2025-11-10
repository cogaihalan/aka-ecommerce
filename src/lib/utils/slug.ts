/**
 * Utility functions for generating and working with URL-friendly slugs
 */

/**
 * Normalizes Vietnamese characters to their ASCII equivalents
 * @param text - The text to normalize
 * @returns Text with Vietnamese characters converted to ASCII
 */
function normalizeVietnamese(text: string): string {
  const vietnameseMap: Record<string, string> = {
    // đ and Đ
    đ: "d",
    Đ: "d",
    // a variants
    à: "a",
    á: "a",
    ả: "a",
    ã: "a",
    ạ: "a",
    ă: "a",
    ằ: "a",
    ắ: "a",
    ẳ: "a",
    ẵ: "a",
    ặ: "a",
    â: "a",
    ầ: "a",
    ấ: "a",
    ẩ: "a",
    ẫ: "a",
    ậ: "a",
    À: "A",
    Á: "A",
    Ả: "A",
    Ã: "A",
    Ạ: "A",
    Ă: "A",
    Ằ: "A",
    Ắ: "A",
    Ẳ: "A",
    Ẵ: "A",
    Ặ: "A",
    Â: "A",
    Ầ: "A",
    Ấ: "A",
    Ẩ: "A",
    Ẫ: "A",
    Ậ: "A",
    // e variants
    è: "e",
    é: "e",
    ẻ: "e",
    ẽ: "e",
    ẹ: "e",
    ê: "e",
    ề: "e",
    ế: "e",
    ể: "e",
    ễ: "e",
    ệ: "e",
    È: "E",
    É: "E",
    Ẻ: "E",
    Ẽ: "E",
    Ẹ: "E",
    Ê: "E",
    Ề: "E",
    Ế: "E",
    Ể: "E",
    Ễ: "E",
    Ệ: "E",
    // i variants
    ì: "i",
    í: "i",
    ỉ: "i",
    ĩ: "i",
    ị: "i",
    Ì: "I",
    Í: "I",
    Ỉ: "I",
    Ĩ: "I",
    Ị: "I",
    // o variants
    ò: "o",
    ó: "o",
    ỏ: "o",
    õ: "o",
    ọ: "o",
    ô: "o",
    ồ: "o",
    ố: "o",
    ổ: "o",
    ỗ: "o",
    ộ: "o",
    ơ: "o",
    ờ: "o",
    ớ: "o",
    ở: "o",
    ỡ: "o",
    ợ: "o",
    Ò: "O",
    Ó: "O",
    Ỏ: "O",
    Õ: "O",
    Ọ: "O",
    Ô: "O",
    Ồ: "O",
    Ố: "O",
    Ổ: "O",
    Ỗ: "O",
    Ộ: "O",
    Ơ: "O",
    Ờ: "O",
    Ớ: "O",
    Ở: "O",
    Ỡ: "O",
    Ợ: "O",
    // u variants
    ù: "u",
    ú: "u",
    ủ: "u",
    ũ: "u",
    ụ: "u",
    ư: "u",
    ừ: "u",
    ứ: "u",
    ử: "u",
    ữ: "u",
    ự: "u",
    Ù: "U",
    Ú: "U",
    Ủ: "U",
    Ũ: "U",
    Ụ: "U",
    Ư: "U",
    Ừ: "U",
    Ứ: "U",
    Ử: "U",
    Ữ: "U",
    Ự: "U",
    // y variants
    ỳ: "y",
    ý: "y",
    ỷ: "y",
    ỹ: "y",
    ỵ: "y",
    Ỳ: "Y",
    Ý: "Y",
    Ỷ: "Y",
    Ỹ: "Y",
    Ỵ: "Y",
  };

  return text.replace(/[àáảãạăằắẳẵặâầấẩẫậđèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵÀÁẢÃẠĂẰẮẲẴẶÂẦẤẨẪẬĐÈÉẺẼẸÊỀẾỂỄỆÌÍỈĨỊÒÓỎÕỌÔỒỐỔỖỘƠỜỚỞỠỢÙÚỦŨỤƯỪỨỬỮỰỲÝỶỸỴ]/g, (char) => vietnameseMap[char] || char);
}

/**
 * Generates a URL-friendly slug from a given string
 * @param text - The text to convert to a slug
 * @returns A URL-friendly slug
 */
export function generateSlug(text: string): string {
  return normalizeVietnamese(text)
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

/**
 * Generates a URL-friendly product URL with slug and ID
 * Format: /products/{slug}-{id}
 * @param productName - The product name to generate slug from
 * @param productId - The product ID
 * @returns A URL-friendly product URL
 */
export function generateProductUrl(productName: string, productId: number | string): string {
  const slug = generateSlug(productName);
  return `/products/${slug}-${productId}`;
}

/**
 * Extracts the product ID from a product slug URL
 * @param slug - The slug from the URL (e.g., "san-pham-dep-123")
 * @returns The product ID or null if not found
 */
export function extractProductIdFromSlug(slug: string): number | null {
  if (!slug || slug.trim() === "") {
    return null;
  }

  // Extract the last segment after the last hyphen, which should be the ID
  const parts = slug.split("-");
  if (parts.length === 0) {
    return null;
  }

  const lastPart = parts[parts.length - 1];
  
  // Validate that the last part is a valid positive integer
  if (!/^\d+$/.test(lastPart)) {
    return null;
  }

  const productId = parseInt(lastPart, 10);
  
  // Double-check it's a valid number
  if (isNaN(productId) || productId <= 0) {
    return null;
  }
  
  return productId;
}
