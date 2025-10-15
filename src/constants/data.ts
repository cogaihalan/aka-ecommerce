import { NavItem } from "@/types";

//Info: The following data is used for the sidebar navigation and Cmd K bar.
export const navItems: NavItem[] = [
  {
    title: "Dashboard",
    url: "/admin/overview",
    icon: "dashboard",
    isActive: false,
    shortcut: ["d", "d"],
    items: [],
  },
  {
    title: "Products",
    url: "/admin/product",
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
    title: "Pages",
    url: "/admin/pages",
    icon: "page",
    shortcut: ["p", "a"],
    isActive: false,
    items: [],
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: "settings",
    shortcut: ["s", "s"],
    isActive: false,
    items: [
      {
        title: "Site Settings",
        url: "/admin/settings",
        shortcut: ["s", "i"],
      },
      {
        title: "Mega Menu",
        url: "/admin/mega-menu",
        shortcut: ["s", "m"],
      },
    ],
  },
];
