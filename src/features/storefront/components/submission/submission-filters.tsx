"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Search, X, XCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export function SubmissionFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "all";
  const sort = searchParams.get("sort") || "voteCount,desc";

  const debouncedSearchValue = useDebounce(searchValue, 300);

  const updateSearchParams = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== "") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/submissions?${params.toString()}`);
  };

  useEffect(() => {
    setSearchValue(search);
  }, [search]);

  useEffect(() => {
    if (debouncedSearchValue !== search) {
      setIsSearching(true);
      updateSearchParams("search", debouncedSearchValue);
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

  const handleStatusChange = (value: string) => {
    updateSearchParams("status", value);
  };

  const handleSortChange = (value: string) => {
    updateSearchParams("sort", value);
  };

  const clearSearch = () => {
    setSearchValue("");
    updateSearchParams("search", null);
  };

  const clearFilters = () => {
    setSearchValue("");
    router.push("/submissions");
  };

  const hasActiveFilters =
    search || (status && status !== "all") || (sort && sort !== "voteCount,desc");

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
          <X className="h-4 w-4 mr-1" />
          {isExpanded ? "Hide" : "Show"} Filters
        </Button>
      </div>

      <div className={cn("space-y-4", !isExpanded && "hidden lg:block")}>
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search
              className={cn(
                "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground",
                isSearching && "animate-pulse"
              )}
            />
            <Input
              id="search"
              placeholder="Search submissions..."
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
          </div>
        </div>

        {/* Status Filter */}
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger>
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort */}
        <div className="space-y-2">
          <Label>Sort by</Label>
          <Select value={sort} onValueChange={handleSortChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select sort option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="voteCount,desc">Votes (Highest)</SelectItem>
              <SelectItem value="voteCount,asc">Votes (Lowest)</SelectItem>
              <SelectItem value="name,asc">Name A-Z</SelectItem>
              <SelectItem value="name,desc">Name Z-A</SelectItem>
              <SelectItem value="barberName,asc">Barber A-Z</SelectItem>
              <SelectItem value="barberName,desc">Barber Z-A</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={clearFilters} className="w-full">
            <X className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
}


