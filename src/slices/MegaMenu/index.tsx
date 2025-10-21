import { FC } from "react";
import { isFilled } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";
import { PrismicNextLink, PrismicNextImage } from "@prismicio/next";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface MegaMenuSection {
  section_title?: string;
  section_links?: string;
  is_featured?: boolean;
  icon?: any;
}

interface MegaMenuProps extends SliceComponentProps<any> {
  slice: {
    slice_type: string;
    variation: string;
    primary: {
      menu_title?: string;
    };
    items: Array<{
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
    }>;
  };
}

const MegaMenu: FC<MegaMenuProps> = ({ slice }) => {
  const menuItems = slice.items || [];
  const menuTitle = slice.primary.menu_title;

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="relative"
    >
      <nav className="flex items-center space-x-8">
        {menuItems.map((item, index) => (
          <div key={index} className="relative group">
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
              <div className="absolute top-full left-0 w-full bg-white shadow-lg border-t border-gray-200 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out">
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
            )}
          </div>
        ))}
      </nav>
    </section>
  );
};

export default MegaMenu;
