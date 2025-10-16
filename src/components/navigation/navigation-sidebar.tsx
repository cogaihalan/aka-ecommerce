"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Filter } from "lucide-react";
import { LayeredNavigation } from "./layered-navigation";
import { NavigationFilters } from "@/types/navigation";

interface NavigationSidebarProps {
  filters: NavigationFilters;
  onFiltersChange: (filters: Partial<NavigationFilters>) => void;
  onResetFilters: () => void;
  filterCounts?: { [key: string]: { [optionId: string]: number } };
  activeFiltersCount: number;
  isMobile?: boolean;
  hideCategoryFilter?: boolean;
}

export function NavigationSidebar({
  filters,
  onFiltersChange,
  onResetFilters,
  filterCounts,
  activeFiltersCount,
  isMobile = false,
  hideCategoryFilter = false,
}: NavigationSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navigationContent = (
    <LayeredNavigation
      filters={filters}
      onFiltersChange={onFiltersChange}
      onResetFilters={onResetFilters}
      filterCounts={filterCounts}
      activeFiltersCount={activeFiltersCount}
      hideCategoryFilter={hideCategoryFilter}
    />
  );

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="sm:hidden">
            <Filter className="h-4 w-4" />
            {activeFiltersCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 flex flex-col">
          <SheetHeader className="flex-shrink-0">
            <SheetTitle className="flex items-center justify-between">
              Filters
              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onResetFilters}
                  className="text-xs"
                >
                  Clear All
                </Button>
              )}
            </SheetTitle>
          </SheetHeader>
          <div className="mt-6 flex-1 overflow-y-auto">{navigationContent}</div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div className="hidden lg:block w-80 flex-shrink-0">
      <div className="sticky top-20 max-h-[calc(100vh-2rem)] overflow-y-auto">
        {navigationContent}
      </div>
    </div>
  );
}
