import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Product } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format price with Vietnamese currency format
 * @param price - The price to format
 * @param options - Formatting options
 * @returns Formatted price string (e.g., "2,450,000 đ")
 */
export function formatPrice(
  price: number,
  options: {
    currency?: string;
    locale?: string;
    showCurrency?: boolean;
  } = {}
): string {
  const { currency = "đ", locale = "vi-VN", showCurrency = true } = options;

  const formattedNumber = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);

  return showCurrency ? `${formattedNumber} ${currency}` : formattedNumber;
}

export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number;
    sizeType?: "accurate" | "normal";
  } = {}
) {
  const { decimals = 0, sizeType = "normal" } = opts;

  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const accurateSizes = ["Bytes", "KiB", "MiB", "GiB", "TiB"];
  if (bytes === 0) return "0 Byte";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === "accurate"
      ? (accurateSizes[i] ?? "Bytest")
      : (sizes[i] ?? "Bytes")
  }`;
}

export function formatImageUrl(url: string): string {
  return `${process.env.NEXT_PUBLIC_BASE_URL}/${url}`;
}

/**
 * Check if a product is out of stock
 */
export function isProductOutOfStock(product: Product): boolean {
  // Check if product is not active
  if (product.status !== "ACTIVE") {
    return true;
  }

  // Check inventory status
  if (product.variants[0].status === "OUT_OF_STOCK") {
    return true;
  }

  // Check available quantity
  if (product.variants[0].status === "OUT_OF_STOCK" && product.variants[0].stock <= 0) {
    return true;
  }

  return false;
}

/**
 * Get stock status text for display
 */
export function getStockStatusText(product: Product): string {
  console.log(product);

  if (product.status !== "ACTIVE") {
    return "Inactive";
  }

  if (product.variants[0].status === "OUT_OF_STOCK") {
    return "Out of Stock";
  }

  if (product.variants[0].status === "ACTIVE") {
    if (product.variants[0].stock <= 0) {
      return "Out of Stock";
    }
 
    return `${product.variants[0].stock} in stock`;
  }

  return "In Stock";
}
