"use client";

import { FC, useState } from "react";
import { isFilled } from "@prismicio/client";
import { PrismicNextLink, PrismicNextImage, PrismicRichText } from "@prismicio/next";
import { cn } from "@/lib/utils";
import { ChevronRight, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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

interface MobileMegaMenuProps {
  menuItems: MenuItem[];
  className?: string;
}

export const MobileMegaMenu: FC<MobileMegaMenuProps> = ({ menuItems, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const toggleSection = (index: number) => {
    setActiveSection(activeSection === index.toString() ? null : index.toString());
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className={cn("lg:hidden", className)}>
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80">
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-4">
          {menuItems.map((item, index) => (
            <div key={index}>
              {item.has_mega_menu ? (
                <Collapsible>
                  <CollapsibleTrigger
                    onClick={() => toggleSection(index)}
                    className="flex items-center justify-between w-full py-2 text-sm font-medium hover:text-primary transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {isFilled.image(item.icon) && (
                        <PrismicNextImage
                          field={item.icon}
                          className="w-4 h-4"
                          alt=""
                        />
                      )}
                      {item.label}
                    </div>
                    <ChevronRight 
                      className={cn(
                        "w-4 h-4 transition-transform",
                        activeSection === index.toString() ? "rotate-90" : ""
                      )} 
                    />
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent className="space-y-3">
                    {/* Featured Image & Description */}
                    {(isFilled.image(item.featured_image) || isFilled.richText(item.description)) && (
                      <div className="ml-4 space-y-3">
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
                          <div className="prose prose-sm max-w-none">
                            <PrismicRichText
                              field={item.description}
                              components={{
                                paragraph: ({ children }) => (
                                  <p className="text-gray-600 leading-relaxed text-sm">{children}</p>
                                ),
                                heading3: ({ children }) => (
                                  <h3 className="text-base font-semibold text-gray-900 mb-2">{children}</h3>
                                ),
                                heading4: ({ children }) => (
                                  <h4 className="text-sm font-semibold text-gray-900 mb-2">{children}</h4>
                                ),
                              }}
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {/* Section Content */}
                    {isFilled.keyText(item.section_title) && (
                      <div className="ml-4 space-y-2">
                        <h4 className="font-medium text-gray-900 text-sm">
                          {item.section_title}
                        </h4>
                        
                        {isFilled.richText(item.section_links) && (
                          <div className="space-y-1">
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
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <PrismicNextLink
                  field={item.link}
                  className="flex items-center gap-2 py-2 text-sm font-medium hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {isFilled.image(item.icon) && (
                    <PrismicNextImage
                      field={item.icon}
                      className="w-4 h-4"
                      alt=""
                    />
                  )}
                  {item.label}
                </PrismicNextLink>
              )}
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMegaMenu;
