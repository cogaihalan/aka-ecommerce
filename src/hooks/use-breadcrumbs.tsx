"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";

type BreadcrumbItem = {
  title: string;
  link: string;
};

// This allows to add custom title as well
const routeMapping: Record<string, BreadcrumbItem[]> = {
  // Dashboard routes
  "/admin": [{ title: "Admin", link: "/admin" }],
  "/admin/products": [{ title: "Sản phẩm", link: "/admin/products" }],
  "/admin/categories": [{ title: "Danh mục", link: "/admin/categories" }],
  "/admin/users": [{ title: "Người dùng", link: "/admin/users" }],
  "/admin/orders": [{ title: "Đơn hàng", link: "/admin/orders" }],
  "/admin/courses": [{ title: "Khóa học", link: "/admin/courses" }],
  "/admin/pages": [{ title: "Trang", link: "/admin/pages" }],
  "/admin/settings": [{ title: "Cài đặt", link: "/admin/settings" }],
  "/admin/analytics": [{ title: "Phân tích", link: "/admin/analytics" }],
  "/account/wishlist": [
    { title: "Tài khoản", link: "/account" },
    { title: "Yêu thích", link: "/account/wishlist" },
  ],
  "/checkout": [{ title: "Thanh toán", link: "/checkout" }],
  "/checkout/success": [
    { title: "Thanh toán", link: "/checkout" },
    { title: "Thanh toán thành công", link: "/checkout/success" },
  ],
  "/categories": [{ title: "Danh mục", link: "/categories" }],
  "/account": [{ title: "Tài khoản", link: "/account" }],
  "/account/profile": [
    { title: "Tài khoản", link: "/account" },
    { title: "Hồ sơ", link: "/account/profile" },
  ],
  "/account/addresses": [
    { title: "Tài khoản", link: "/account" },
    { title: "Địa chỉ", link: "/account/addresses" },
  ],
  "/account/orders": [
    { title: "Tài khoản", link: "/account" },
    { title: "Đơn hàng", link: "/account/orders" },
  ],
  "/auth/sign-in": [{ title: "Đăng nhập", link: "/auth/sign-in" }],
  "/auth/sign-up": [{ title: "Đăng ký", link: "/auth/sign-up" }],
  "/affiliate": [{ title: "Chương trình Affiliate", link: "/affiliate" }],
};

export function useBreadcrumbs() {
  const pathname = usePathname();

  const breadcrumbs = useMemo(() => {
    // Don't show breadcrumbs on homepage
    if (pathname === "/") {
      return [];
    }

    // Check if we have a custom mapping for this exact path
    if (routeMapping[pathname]) {
      return routeMapping[pathname];
    }

    // Handle dynamic routes
    const segments = pathname.split("/").filter(Boolean);

    // Handle product pages
    if (segments[0] === "products" && segments[1]) {
      return [
        { title: "Sản phẩm", link: "/products" },
        { title: "Chi tiết sản phẩm", link: pathname },
      ];
    }

    // Handle category pages
    if (segments[0] === "categories" && segments[1]) {
      return [
        { title: "Danh mục", link: "/categories" },
        {
          title: segments[1].charAt(0).toUpperCase() + segments[1].slice(1),
          link: pathname,
        },
      ];
    }

    // Handle account order details
    if (segments[0] === "account" && segments[1] === "orders" && segments[2]) {
      return [
        { title: "Tài khoản", link: "/account" },
        { title: "Đơn hàng", link: "/account/orders" },
        { title: "Chi tiết đơn hàng", link: pathname },
      ];
    }

    // If no exact match, fall back to generating breadcrumbs from the path
    return segments.map((segment, index) => {
      const path = `/${segments.slice(0, index + 1).join("/")}`;
      return {
        title: segment.charAt(0).toUpperCase() + segment.slice(1),
        link: path,
      };
    });
  }, [pathname]);

  return breadcrumbs;
}
