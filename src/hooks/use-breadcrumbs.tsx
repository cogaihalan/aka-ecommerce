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
  "/dashboard": [{ title: "Dashboard", link: "/dashboard" }],
  "/admin/employee": [
    { title: "Dashboard", link: "/dashboard" },
    { title: "Employee", link: "/admin/employee" },
  ],
  "/admin/product": [
    { title: "Admin", link: "/admin" },
    { title: "Products", link: "/admin/product" },
  ],

  // Storefront routes (excluding homepage)
  "/about": [{ title: "About", link: "/about" }],
  "/contact": [{ title: "Contact", link: "/contact" }],
  "/help": [{ title: "Help", link: "/help" }],
  "/products": [{ title: "Products", link: "/products" }],
  "/search": [{ title: "Search", link: "/search" }],
  "/cart": [{ title: "Cart", link: "/cart" }],
  "/account/wishlist": [
    { title: "Account", link: "/account" },
    { title: "Wishlist", link: "/account/wishlist" },
  ],
  "/checkout": [{ title: "Checkout", link: "/checkout" }],
  "/checkout/success": [
    { title: "Checkout", link: "/checkout" },
    { title: "Success", link: "/checkout/success" },
  ],
  "/categories": [{ title: "Categories", link: "/categories" }],
  "/account": [{ title: "Account", link: "/account" }],
  "/account/profile": [
    { title: "Account", link: "/account" },
    { title: "Profile", link: "/account/profile" },
  ],
  "/account/addresses": [
    { title: "Account", link: "/account" },
    { title: "Addresses", link: "/account/addresses" },
  ],
  "/account/orders": [
    { title: "Account", link: "/account" },
    { title: "Orders", link: "/account/orders" },
  ],
  "/auth/sign-in": [{ title: "Sign In", link: "/auth/sign-in" }],
  "/auth/sign-up": [{ title: "Sign Up", link: "/auth/sign-up" }],
  "/token": [{ title: "Token", link: "/token" }],
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
        { title: "Products", link: "/products" },
        { title: "Product Details", link: pathname },
      ];
    }

    // Handle category pages
    if (segments[0] === "categories" && segments[1]) {
      return [
        { title: "Categories", link: "/categories" },
        {
          title: segments[1].charAt(0).toUpperCase() + segments[1].slice(1),
          link: pathname,
        },
      ];
    }

    // Handle account order details
    if (segments[0] === "account" && segments[1] === "orders" && segments[2]) {
      return [
        { title: "Account", link: "/account" },
        { title: "Orders", link: "/account/orders" },
        { title: "Order Details", link: pathname },
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
