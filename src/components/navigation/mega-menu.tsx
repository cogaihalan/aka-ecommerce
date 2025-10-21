"use client";

import { FC, useState } from "react";
import { isFilled } from "@prismicio/client";
import { PrismicNextLink, PrismicNextImage, PrismicRichText } from "@prismicio/next";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface MegaMenuSection {
  section_title?: string;
  section_links?: string;
  is_featured?: boolean;
  icon?: any;
}

interface MegaMenuContent {
  layout_type?: "columns" | "featured_products" | "categories" | "mixed";
  columns?: number;
  featured_image?: any;
  description?: any;
  section_title?: string;
  section_links?: string;
  is_featured?: boolean;
  icon?: any;
}

interface MenuItem {
  label?: string;
  link?: any;
  has_mega_menu?: boolean;
  layout_type?: "columns" | "featured_products" | "categories" | "mixed";
  columns?: number;
  featured_image?: any;
  description?: any;
  section_title?: string;
  section_links?: string;
  is_featured?: boolean;
  icon?: any;
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
    const layoutType = item.layout_type || "columns";
    const columns = item.columns || 3;

    return (
      <div className="absolute top-full left-0 w-full bg-white shadow-lg border-t border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Featured Image & Description */}
          {(isFilled.image(item.featured_image) || isFilled.richText(item.description)) && (
            <div className="mb-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {isFilled.image(item.featured_image) && (
                  <div className="aspect-video rounded-lg overflow-hidden">
                    <PrismicNextImage
                      field={item.featured_image}
                      className="w-full h-full object-cover"
                      alt=""
                    />
                  </div>
                )}
                {isFilled.richText(item.description) && (
                  <div className="flex items-center">
                    <div className="prose prose-sm max-w-none">
                      <PrismicRichText
                        field={item.description}
                        components={{
                          paragraph: ({ children }) => (
                            <p className="text-gray-600 leading-relaxed">{children}</p>
                          ),
                          heading3: ({ children }) => (
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{children}</h3>
                          ),
                          heading4: ({ children }) => (
                            <h4 className="text-base font-semibold text-gray-900 mb-2">{children}</h4>
                          ),
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Menu Section */}
          {isFilled.keyText(item.section_title) && (
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
                {item.section_title}
              </h3>
              
              {isFilled.richText(item.section_links) && (
                <div className="space-y-2">
                  <PrismicRichText
                    field={item.section_links}
                    components={{
                      paragraph: ({ children }) => (
                        <div className="space-y-1">
                          {children}
                        </div>
                      ),
                    }}
                  />
                </div>
              )}
            </div>
          )}
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
              {isFilled.image(item.icon) && (
                <PrismicNextImage
                  field={item.icon}
                  className="w-4 h-4"
                  alt=""
                />
              )}
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
