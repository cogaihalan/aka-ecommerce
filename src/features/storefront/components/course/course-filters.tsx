"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { Search, Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function CourseFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isExpanded, setIsExpanded] = useState(false);

  const search = searchParams.get("search") || "";
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = searchParams.get("sortOrder") || "desc";

  const updateSearchParams = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== "") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/courses?${params.toString()}`);
  };

  const handleSearch = (value: string) => {
    updateSearchParams("search", value);
  };

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split("-");
    updateSearchParams("sortBy", sortBy);
    updateSearchParams("sortOrder", sortOrder);
  };


  const clearFilters = () => {
    router.push("/courses");
  };

  const hasActiveFilters = search || (sortBy && sortBy !== "createdAt") || (sortOrder && sortOrder !== "desc");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filters</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="lg:hidden"
        >
          <Filter className="h-4 w-4 mr-2" />
          {isExpanded ? "Hide" : "Show"} Filters
        </Button>
      </div>

      <div className={cn("space-y-4", !isExpanded && "hidden lg:block")}>
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search courses..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Sort */}
        <div className="space-y-2">
          <Label>Sort by</Label>
          <Select
            value={`${sortBy}-${sortOrder}`}
            onValueChange={handleSortChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select sort option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name-asc">Name (A-Z)</SelectItem>
              <SelectItem value="name-desc">Name (Z-A)</SelectItem>
              <SelectItem value="createdAt-desc">Newest First</SelectItem>
              <SelectItem value="createdAt-asc">Oldest First</SelectItem>
              <SelectItem value="duration-asc">Duration (Shortest)</SelectItem>
              <SelectItem value="duration-desc">Duration (Longest)</SelectItem>
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
