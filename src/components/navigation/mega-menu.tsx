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
      <div className="absolute top-full left-0 w-full bg-white shadow-lg border-t border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Menu Section */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
              {item.label}
            </h3>
            
            {item.child_links && item.child_links.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {item.child_links.map((childLink, childIndex) => (
                  <PrismicNextLink
                    key={childIndex}
                    field={childLink.child_link}
                    className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-sm font-medium text-gray-700 hover:text-primary">
                      {childLink.child_label}
                    </span>
                  </PrismicNextLink>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <nav className={cn("relative", className)}>
      <ul className="flex items-center space-x-8">
        {menuItems.map((item, index) => (
          <li
            key={index}
            className="relative"
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            <PrismicNextLink
              field={item.link}
              className="flex items-center gap-1 py-4 text-sm font-medium text-gray-700 hover:text-primary transition-colors"
            >
              {item.label}
              {item.has_mega_menu && (
                <ChevronDown className="w-4 h-4" />
              )}
            </PrismicNextLink>

            {/* Mega Menu Dropdown */}
            {item.has_mega_menu && (
              <div
                className={cn(
                  "transition-all duration-200 ease-in-out",
                  activeMenu === index.toString()
                    ? "opacity-100 visible"
                    : "opacity-0 invisible"
                )}
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
