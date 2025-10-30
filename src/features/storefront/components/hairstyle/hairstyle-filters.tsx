"use client";

import { useState, useEffect, useCallback } from "react";
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

export function HairstyleFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const search = searchParams.get("search") || "";
  const gender = searchParams.get("gender") || "all";
  const sort = searchParams.get("sort") || "voteCount,desc";

  // Debounce the search value
  const debouncedSearchValue = useDebounce(searchValue, 300);

  const updateSearchParams = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== "") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/hairstyles?${params.toString()}`);
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

  const handleGenderChange = (value: string) => {
    updateSearchParams("gender", value);
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
    router.push("/hairstyles");
  };

  const hasActiveFilters =
    search ||
    (gender && gender !== "all") ||
    (sort && sort !== "voteCount,desc");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Bộ lọc</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="lg:hidden"
        >
          <X className="h-4 w-4 mr-1" />
          {isExpanded ? "Ẩn" : "Hiện"} Bộ lọc
        </Button>
      </div>

      <div className={cn("space-y-4", !isExpanded && "hidden lg:block")}>
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search">Tìm kiếm</Label>
          <div className="relative">
            <Search
              className={cn(
                "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground",
                isSearching && "animate-pulse"
              )}
            />
            <Input
              id="search"
              placeholder="Tìm kiếu kiểu tóc..."
              value={searchValue}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchValue && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Xóa tìm kiếm"
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

        {/* Gender Filter */}
        <div className="space-y-2">
          <Label>Giới tính</Label>
          <Select value={gender} onValueChange={handleGenderChange}>
            <SelectTrigger>
              <SelectValue placeholder="Tất cả giới tính" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả giới tính</SelectItem>
              <SelectItem value="MALE">Nam</SelectItem>
              <SelectItem value="FEMALE">Nữ</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort */}
        <div className="space-y-2">
          <Label>Sắp xếp theo</Label>
          <Select value={sort} onValueChange={handleSortChange}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn tùy chọn sắp xếp" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="voteCount,desc">Bình chọn (Cao nhất)</SelectItem>
              <SelectItem value="voteCount,asc">Bình chọn (Thấp nhất)</SelectItem>
              <SelectItem value="name,asc">Tên (A-Z)</SelectItem>
              <SelectItem value="name,desc">Tên (Z-A)</SelectItem>
              <SelectItem value="barberName,asc">Tên barber (A-Z)</SelectItem>
              <SelectItem value="barberName,desc">Tên barber (Z-A)</SelectItem>
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
            Xóa bộ lọc
          </Button>
        )}
      </div>
    </div>
  );
}
