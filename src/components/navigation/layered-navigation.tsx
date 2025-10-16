"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, X, Search } from "lucide-react";
import { FilterGroup, NavigationFilters } from "@/types/navigation";
import { useDynamicNavigation } from "@/hooks/use-dynamic-navigation";
import { cn } from "@/lib/utils";

interface LayeredNavigationProps {
  filters: NavigationFilters;
  onFiltersChange: (filters: Partial<NavigationFilters>) => void;
  onResetFilters: () => void;
  filterCounts?: { [key: string]: { [optionId: string]: number } };
  activeFiltersCount: number;
  hideCategoryFilter?: boolean;
}

export function LayeredNavigation({
  filters,
  onFiltersChange,
  onResetFilters,
  filterCounts = {},
  activeFiltersCount,
  hideCategoryFilter = false,
}: LayeredNavigationProps) {
  const { filterGroups } = useDynamicNavigation();
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(hideCategoryFilter ? ["price"] : ["price", "categoryIds"])
  );

  const toggleGroup = useCallback((groupId: string) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  }, []);

  // Debounced search to prevent excessive re-renders
  const [searchValue, setSearchValue] = useState(filters.search || "");
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchValue(value);

      // Clear existing timeout
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      // Set new timeout for debounced search
      searchTimeoutRef.current = setTimeout(() => {
        onFiltersChange({ search: value });
      }, 300);
    },
    [onFiltersChange]
  );

  // Update search value when filters change externally
  useEffect(() => {
    setSearchValue(filters.search || "");
  }, [filters.search]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handlePriceRangeChange = useCallback(
    (value: number[]) => {
      onFiltersChange({ priceRange: value as [number, number] });
    },
    [onFiltersChange]
  );

  const handleArrayFilterChange = useCallback(
    (filterKey: string, optionId: string, checked: boolean) => {
      const currentValues = (filters[filterKey] as string[]) || [];
      const newValues = checked
        ? [...currentValues, optionId]
        : currentValues.filter((v) => v !== optionId);

      onFiltersChange({ [filterKey]: newValues });
    },
    [filters, onFiltersChange]
  );

  const getFilterCount = useCallback(
    (groupId: string, optionId: string) => {
      return filterCounts[groupId]?.[optionId] || 0;
    },
    [filterCounts]
  );

  // Memoized active filters to prevent unnecessary re-renders
  const activeFilters = useMemo(() => {
    const activeFiltersList = [];

    if (filters.search) {
      activeFiltersList.push({
        key: "search",
        label: `Search: ${filters.search}`,
        onRemove: () => onFiltersChange({ search: "" }),
      });
    }

    if (
      filters.priceRange &&
      (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 100000000)
    ) {
      activeFiltersList.push({
        key: "price",
        label: `Price: ${filters.priceRange[0]}đ - ${filters.priceRange[1]}đ`,
        onRemove: () => onFiltersChange({ priceRange: [0, 100000000] }),
      });
    }

    // Handle category filters with proper labels
    if (filters.categoryIds && filters.categoryIds.length > 0) {
      filters.categoryIds.forEach((categoryId: string) => {
        // Find the category name from the filter groups
        const categoryGroup = filterGroups.find(group => group.id === "categoryIds");
        const categoryOption = categoryGroup?.options.find(option => option.value === categoryId);
        const categoryLabel = categoryOption?.label || categoryId; // Fallback to ID if name not found
        
        activeFiltersList.push({
          key: `categoryIds-${categoryId}`,
          label: categoryLabel,
          onRemove: () => handleArrayFilterChange("categoryIds", categoryId, false),
        });
      });
    }

    return activeFiltersList;
  }, [filters, onFiltersChange, handleArrayFilterChange, filterGroups]);

  const renderFilterGroup = useCallback(
    (group: FilterGroup) => {
      const isExpanded = expandedGroups.has(group.id);

      return (
        <Collapsible
          key={group.id}
          open={isExpanded}
          onOpenChange={() => toggleGroup(group.id)}
        >
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-between p-2 h-auto font-medium text-sm"
              )}
            >
              <span>{group.label}</span>
              {isExpanded ? (
                <ChevronUp className={cn("h-4 w-4")} />
              ) : (
                <ChevronDown className={cn("h-4 w-4")} />
              )}
            </Button>
          </CollapsibleTrigger>

          <CollapsibleContent
            className={cn(
              "space-y-3 mt-3 transition-all duration-300 ease-out"
            )}
          >
            {group.type === "range" && (
              <div className={cn("space-y-3")}>
                <div className={cn("px-1")}>
                  <Slider
                    value={filters.priceRange || [0, 100000000]}
                    onValueChange={handlePriceRangeChange}
                    max={group.max || 100000000}
                    min={group.min || 0}
                    step={group.step || 1000}
                    className={cn("w-full")}
                  />
                </div>
                <div
                  className={cn(
                    "flex justify-between text-sm text-muted-foreground"
                  )}
                >
                  <span>{filters.priceRange?.[0] || 0}</span>
                  <span>{filters.priceRange?.[1] || 100000000}</span>
                </div>
              </div>
            )}

            {group.type === "checkbox" && (
              <div className={cn("space-y-2")}>
                {group.options.map((option) => {
                  const isChecked =
                    (filters[group.id] as string[])?.includes(option.value) ||
                    false;
                  const count = getFilterCount(group.id, option.value);

                  return (
                    <div
                      key={option.id}
                      className={cn(
                        "flex items-center space-x-2 transition-all duration-200 hover:bg-muted/50 rounded-md p-1 -m-1"
                      )}
                    >
                      <Checkbox
                        id={`${group.id}-${option.id}`}
                        checked={isChecked}
                        onCheckedChange={(checked) =>
                          handleArrayFilterChange(
                            group.id,
                            option.value,
                            checked as boolean
                          )
                        }
                        className="transition-all duration-200"
                      />
                      <Label
                        htmlFor={`${group.id}-${option.id}`}
                        className={cn(
                          "flex-1 text-sm cursor-pointer flex items-center justify-between transition-colors duration-200"
                        )}
                      >
                        <span>{option.label}</span>
                        {count > 0 && (
                          <Badge
                            variant="secondary"
                            className={cn(
                              "text-xs transition-all duration-200"
                            )}
                          >
                            {count}
                          </Badge>
                        )}
                      </Label>
                    </div>
                  );
                })}
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      );
    },
    [
      expandedGroups,
      filters,
      handlePriceRangeChange,
      handleArrayFilterChange,
      getFilterCount,
      toggleGroup,
    ]
  );

  return (
    <div className={cn("w-full max-w-sm space-y-6 px-2 lg:pl-0")}>
      {/* Search */}
      <div className={cn("space-y-2")}>
        <Label htmlFor="search" className={cn("text-sm font-medium")}>
          Search Products
        </Label>
        <div className={cn("relative")}>
          <Search
            className={cn(
              "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors duration-200"
            )}
          />
          <Input
            id="search"
            placeholder="Search..."
            value={searchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            className={cn(
              "pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            )}
          />
        </div>
      </div>

      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <div className={cn("space-y-2")}>
          <div className={cn("flex items-center justify-between")}>
            <Label className={cn("text-sm font-medium")}>Active Filters</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={onResetFilters}
              className={cn(
                "text-xs text-muted-foreground hover:text-foreground"
              )}
            >
              Clear All
            </Button>
          </div>
          <div className={cn("flex flex-wrap gap-2")}>
            {activeFilters.map((filter) => (
              <Badge
                key={filter.key}
                variant="secondary"
                className={cn("text-xs")}
              >
                {filter.label}
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn("ml-1 h-auto p-0 hover:bg-transparent")}
                  onClick={filter.onRemove}
                >
                  <X className={cn("h-3 w-3")} />
                </Button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      <Separator />

      {/* Filter Groups */}
      <div className={cn("space-y-2 max-h-100 overflow-y-auto")}>
        {filterGroups
          .filter((group) => !hideCategoryFilter || group.id !== "categoryIds")
          .map(renderFilterGroup)}
      </div>
    </div>
  );
}
