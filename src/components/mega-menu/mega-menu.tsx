"use client";

import { FC, useState } from "react";
import { PrismicNextLink } from "@prismicio/next";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface ChildLink {
  child_label?: string;
  child_link?: any;
}

interface MenuItem {
  label?: string;
  link?: any;
  has_mega_menu?: boolean;
  child_links?: ChildLink[];
}

interface MegaMenuProps {
  menuItems: MenuItem[];
  className?: string;
}

export const MegaMenu: FC<MegaMenuProps> = ({ menuItems, className }) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const handleMouseEnter = (index: number) => {
    setActiveMenu(index.toString());
  };

  const handleMouseLeave = () => {
    setActiveMenu(null);
  };

  const renderMegaMenuContent = (item: MenuItem) => {
    return (
      <div className="absolute top-[calc(100%+8px)] left-0 min-w-40 max-w-2xl bg-white dark:bg-gray-900 shadow-2xl border border-gray-100 dark:border-gray-800 rounded-md z-50 overflow-hidden">
        <div className="px-4 py-3">
          {/* Content Grid */}
          {item.child_links && item.child_links.length > 0 && (
            <div className="space-y-4">
              {item.child_links.map((childLink, childIndex) => (
                <PrismicNextLink
                  key={childIndex}
                  field={childLink.child_link}
                  className="group block px-4 py-2 rounded-lg hover:bg-gradient-to-br hover:from-primary/5 hover:to-primary/10 transition-all duration-200 hover:shadow-md border border-transparent hover:border-primary/20"
                >
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors duration-200">
                    {childLink.child_label}
                  </span>
                </PrismicNextLink>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <nav className={cn("relative", className)}>
      <ul className="flex items-center space-x-4">
        {menuItems.map((item, index) => (
          <li
            key={index}
            className="relative"
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            <PrismicNextLink
              field={item.link}
              className={cn("group flex items-center gap-2 py-2 px-3 text-sm xl:text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all duration-200", activeMenu === index.toString() ? "text-primary bg-gray-50 dark:bg-gray-800" : "")}
              tabIndex={0}
              aria-expanded={
                item.has_mega_menu ? activeMenu === index.toString() : undefined
              }
              aria-haspopup={item.has_mega_menu ? "true" : undefined}
            >
              {item.label}
              {item.has_mega_menu && (
                <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
              )}
            </PrismicNextLink>

            {/* Mega Menu Dropdown */}
            {item.has_mega_menu && (
              <div
                className={cn(
                  "transition-all duration-300 ease-out transform",
                  activeMenu === index.toString()
                    ? "opacity-100 visible translate-y-0 scale-100"
                    : "opacity-0 invisible -translate-y-2 scale-95"
                )}
                role="menu"
                aria-labelledby={`menu-${index}`}
                aria-hidden={activeMenu !== index.toString()}
              >
                {renderMegaMenuContent(item)}
              </div>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default MegaMenu;
