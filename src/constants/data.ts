import { NavItem } from "@/types";

//Info: The following data is used for the sidebar navigation and Cmd K bar.
export const navItems: NavItem[] = [
  {
    title: "Products",
    url: "/admin/products",
    icon: "product",
    shortcut: ["p", "p"],
    isActive: false,
    items: [],
  },
  {
    title: "Categories",
    url: "/admin/categories",
    icon: "folder",
    shortcut: ["c", "c"],
    isActive: false,
    items: [],
  },
  {
    title: "Users",
    url: "/admin/users",
    icon: "users",
    shortcut: ["u", "u"],
    isActive: false,
    items: [],
  },
  {
    title: "Orders",
    url: "/admin/orders",
    icon: "package",
    shortcut: ["o", "o"],
    isActive: false,
    items: [],
  },
  {
    title: "Courses",
    url: "/admin/courses",
    icon: "media",
    shortcut: ["c", "o"],
    isActive: false,
    items: [],
  },
  {
    title: "Contests",
    url: "/admin/contests",
    icon: "trophy",
    shortcut: ["c", "t"],
    isActive: false,
    items: [],
  },
  {
    title: "Hairstyles",
    url: "/admin/hairstyles",
    icon: "scissors",
    shortcut: ["h", "h"],
    isActive: false,
    items: [],
  },
  {
    title: "Pages",
    url: "/admin/pages",
    icon: "page",
    shortcut: ["p", "a"],
    isActive: false,
    items: [],
  },
];
