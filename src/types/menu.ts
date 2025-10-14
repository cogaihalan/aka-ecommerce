export interface MenuItem {
  id: string;
  label: string;
  href: string;
  description?: string;
}

export interface MenuCategory {
  id: string;
  title: string;
  items: MenuItem[];
}

export interface MenuSection {
  id: string;
  title: string;
  href: string;
  categories: MenuCategory[];
}

export interface MegaMenuData {
  items: MenuSection[];
}
