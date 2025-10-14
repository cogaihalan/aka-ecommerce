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
import { Filter, X } from "lucide-react";
import { LayeredNavigation } from "./layered-navigation";
import { NavigationFilters } from "@/types/navigation";

interface MobileNavigationProps {
    filters: NavigationFilters;
    onFiltersChange: (filters: Partial<NavigationFilters>) => void;
    onResetFilters: () => void;
    filterCounts?: { [key: string]: { [optionId: string]: number } };
    activeFiltersCount: number;
    hideCategoryFilter?: boolean;
}

export function MobileNavigation({
                                     filters,
                                     onFiltersChange,
                                     onResetFilters,
                                     filterCounts,
                                     activeFiltersCount,
                                     hideCategoryFilter = false,
                                 }: MobileNavigationProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden">
                    <Filter className="h-4 w-4" />
                    {activeFiltersCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {activeFiltersCount}
            </span>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 overflow-y-auto">
                <SheetHeader>
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
                <div className="mt-6">
                    <LayeredNavigation
                        filters={filters}
                        onFiltersChange={onFiltersChange}
                        onResetFilters={onResetFilters}
                        filterCounts={filterCounts}
                        activeFiltersCount={activeFiltersCount}
                        hideCategoryFilter={hideCategoryFilter}
                    />
                </div>
            </SheetContent>
        </Sheet>
    );
}
