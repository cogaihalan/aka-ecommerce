import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { OrderHistoryAction, Product } from "@/types";
import { CheckCircle, Truck, RefreshCw, AlertCircle, Clock } from "lucide-react";

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

/**
 * Check if a product is out of stock
 */
export function isProductOutOfStock(product: Product): boolean {
  // Check if product stock is 0 or less
  if (product.stock <= 0) {
    return true;
  }

  return false;
}

/**
 * Get stock status text for display
 */
export function getStockStatusText(product: Product): string {
  if (product.stock <= 0) {
    return "Hết hàng";
  }

  if (product.stock > 0 && product.stock < 10) {
    return `Chỉ còn ${product.stock} sản phẩm`;
  }

  return "Thêm vào giỏ";
}


export function getStatusBadgeVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  switch (status.toUpperCase()) {
    case "DELIVERED":
    case "PAID":
      return "default";
    case "SHIPPING":
    case "CONFIRMED":
      return "secondary";
    case "CANCELLED":
    case "FAILED":
    case "REFUNDED":
      return "destructive";
    case "PENDING":
    case "UNPAID":
    default:
      return "outline";
  }
}

export function getStatusText(status: string) {
  switch (status.toUpperCase()) {
    case "DELIVERED":
      return "Đã giao";
    case "SHIPPING":
      return "Đang giao";
    case "CONFIRMED":
      return "Đã xác nhận";
    case "CANCELLED":
      return "Đã hủy";
    case "PAID":
      return "Đã thanh toán";
    case "UNPAID":
      return "Chưa thanh toán";
    case "FAILED":
      return "Thất bại";
    case "PENDING":
      return "Chờ xử lý";
    case "REFUNDED":
      return "Đã hoàn tiền";
    default:
      return status.replace("_", " ");
  }
}


export function getOrderActionText(action: OrderHistoryAction): string {
  switch (action) {
    case "CREATED":
      return "Tạo đơn hàng";
    case "CONFIRMED":
      return "Xác nhận đơn hàng";
    case "SHIPPING":
      return "Đang giao";
    case "DELIVERED":
      return "Đã giao";
    case "CANCELLED":
      return "Đã hủy";
    case "REFUNDED":
      return "Đã hoàn tiền";
    default:
      return action.replace("_", " ");
  }
}