"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Grid, List, Filter } from "lucide-react";
import { SORT_OPTIONS } from "@/constants/navigation";

interface SortControlsProps {
  sortBy: string;
  viewMode: "grid" | "list";
  onSortChange: (sort: string) => void;
  onViewModeChange: (mode: "grid" | "list") => void;
  onToggleFilters?: () => void;
  showFiltersToggle?: boolean;
  totalProducts?: number;
  filteredCount?: number;
  currentPageCount?: number;
  currentPage?: number;
}

export function SortControls({
  sortBy,
  viewMode,
  onSortChange,
  onViewModeChange,
  onToggleFilters,
  showFiltersToggle = false,
  totalProducts = 0,
  filteredCount = 0,
  currentPageCount = 0,
}: SortControlsProps) {
  return (
    <div className="w-full flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        {filteredCount > 0 ? (
          <>
            {`Hiển thị ${currentPageCount} trên ${filteredCount} sản phẩm`}
            {filteredCount !== totalProducts && (
              <span> {`(lọc từ tổng ${totalProducts})`}</span>
            )}
          </>
        ) : (
          <>{`${totalProducts} sản phẩm`}</>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        {/* Sort dropdown */}
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Sắp xếp theo" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.id} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Filters toggle (mobile) */}
        {showFiltersToggle && onToggleFilters && (
          <Button
            variant="outline"
            size="icon"
            onClick={onToggleFilters}
            className="sm:hidden"
          >
            <Filter className="h-4 w-4" />
          </Button>
        )}

        {/* View mode toggle */}
        <div className="flex border rounded-md">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="icon"
            onClick={() => onViewModeChange("grid")}
            className="rounded-r-none transition-all duration-200 ease-out"
          >
            <Grid className="h-4 w-4 transition-transform duration-200" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="icon"
            onClick={() => onViewModeChange("list")}
            className="rounded-l-none transition-all duration-200 ease-out"
          >
            <List className="h-4 w-4 transition-transform duration-200" />
          </Button>
        </div>
      </div>
    </div>
  );
}
