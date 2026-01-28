"use client";

import { FC, useState } from "react";
import { isFilled } from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";

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

export const MobileMegaMenu: FC<MobileMegaMenuProps> = ({
  menuItems,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("lg:hidden", className)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 sm:w-96 gap-0 p-0">
        <SheetHeader className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
          <SheetTitle className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Menu
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          <Accordion type="multiple" className="w-full">
            {menuItems.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-b border-gray-100 dark:border-gray-800 last:border-b-0"
              >
                {item.has_mega_menu ? (
                  <>
                    <AccordionTrigger className="flex items-center justify-between w-full py-3 px-4 text-base font-medium text-gray-900 dark:text-gray-100 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 [&[data-state=open]]:text-primary [&[data-state=open]]:bg-gray-50 dark:[&[data-state=open]]:bg-gray-800">
                      <Link href={item.link.url} className="flex items-center gap-3">
                        {item.label}
                      </Link>
                    </AccordionTrigger>
                    <AccordionContent className="pb-2">
                      {/* Child Links */}
                      {item.child_links && item.child_links.length > 0 && (
                        <div className="ml-2">
                          {item.child_links.map((childLink, childIndex) => (
                            <PrismicNextLink
                              key={childIndex}
                              field={childLink.child_link}
                              className="flex items-center gap-3 py-3 px-4 text-sm text-gray-600 dark:text-gray-400 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
                              onClick={handleLinkClick}
                            >
                              {childLink.child_label}
                            </PrismicNextLink>
                          ))}
                        </div>
                      )}
                    </AccordionContent>
                  </>
                ) : (
                  <div className="py-3 px-4">
                    <PrismicNextLink
                      field={item.link}
                      className="flex items-center justify-between w-full text-base font-medium text-gray-900 dark:text-gray-100 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
                      onClick={handleLinkClick}
                    >
                      {item.label}
                    </PrismicNextLink>
                  </div>
                )}
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMegaMenu;
