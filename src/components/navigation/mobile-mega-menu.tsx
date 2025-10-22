"use client";

import { FC, useState } from "react";
import { isFilled } from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";
import { cn } from "@/lib/utils";
import { ChevronRight, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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

  const handleLinkClick = () => {
    setIsOpen(false);
    setActiveSection(null);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className={cn("lg:hidden", className)}>
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 sm:w-96">
        <SheetHeader>
          <SheetTitle className="text-lg font-semibold">Navigation</SheetTitle>
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
                    <PrismicNextLink field={item.link} className="flex items-center gap-2">
                      {item.label}
                      <ChevronRight 
                        className={cn(
                          "w-4 h-4 transition-transform",
                          activeSection === index.toString() ? "rotate-90" : ""
                        )} 
                      />
                    </PrismicNextLink>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent className="space-y-3">
                    {/* Child Links */}
                    {item.child_links && item.child_links.length > 0 && (
                      <div className="ml-4 space-y-2">
                        <div className="space-y-1">
                          {item.child_links.map((childLink, childIndex) => (
                            <PrismicNextLink
                              key={childIndex}
                              field={childLink.child_link}
                              className="block py-2 text-sm text-gray-700 hover:text-primary transition-colors"
                              onClick={handleLinkClick}
                            >
                              {childLink.child_label}
                            </PrismicNextLink>
                          ))}
                        </div>
                      </div>
                    )}


                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <PrismicNextLink
                  field={item.link}
                  className="flex items-center gap-2 text-sm font-medium hover:text-primary hover:bg-gray-50 rounded-md transition-colors"
                  onClick={handleLinkClick}
                >
                  
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
