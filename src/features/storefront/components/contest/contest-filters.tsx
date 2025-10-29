"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, X, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function ContestFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "createdAt,desc";

  // Debounce the search value
  const debouncedSearchValue = useDebounce(searchValue, 300);

  const updateSearchParams = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== "") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/contest?${params.toString()}`);
  };

  // Initialize search value from URL
  useEffect(() => {
    setSearchValue(search);
  }, [search]);

  // Handle debounced search
  useEffect(() => {
    if (debouncedSearchValue !== search) {
      setIsSearching(true);
      updateSearchParams("search", debouncedSearchValue);
      // Reset searching state after a short delay
      const timer = setTimeout(() => setIsSearching(false), 100);
      return () => clearTimeout(timer);
    }
  }, [debouncedSearchValue, search]);

  const handleSearch = useCallback((value: string) => {
    setSearchValue(value);
    if (value === "") {
      setIsSearching(false);
      updateSearchParams("search", value);
    }
  }, []);

  const handleSortChange = (value: string) => {
    updateSearchParams("sort", value);
  };

  const clearSearch = () => {
    setSearchValue("");
    updateSearchParams("search", null);
  };

  const clearFilters = () => {
    setSearchValue("");
    router.push("/contest");
  };

  const hasActiveFilters = search || (sort && sort !== "createdAt,desc");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filters</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="lg:hidden"
        >
          <Filter className="h-4 w-4 mr-1" />
          {isExpanded ? "Hide" : "Show"} Filters
        </Button>
      </div>

      <div className={cn("space-y-4", !isExpanded && "hidden lg:block")}>
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className={cn(
              "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground",
              isSearching && "animate-pulse"
            )} />
            <Input
              id="search"
              placeholder="Search contests..."
              value={searchValue}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchValue && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Clear search"
              >
                <XCircle className="h-4 w-4" />
              </button>
            )}
            {isSearching && !searchValue && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
              </div>
            )}
          </div>
        </div>

        {/* Sort */}
        <div className="space-y-2">
          <Label>Sort by</Label>
          <Select
            value={sort}
            onValueChange={handleSortChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select sort option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt,desc">Newest First</SelectItem>
              <SelectItem value="createdAt,asc">Oldest First</SelectItem>
              <SelectItem value="name,asc">Name (A-Z)</SelectItem>
              <SelectItem value="name,desc">Name (Z-A)</SelectItem>
              <SelectItem value="startDate,asc">Start Date (Earliest)</SelectItem>
              <SelectItem value="startDate,desc">Start Date (Latest)</SelectItem>
              <SelectItem value="endDate,asc">End Date (Earliest)</SelectItem>
              <SelectItem value="endDate,desc">End Date (Latest)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="w-full"
          >
            <X className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
}
