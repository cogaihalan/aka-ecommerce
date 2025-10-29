"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function HairstyleFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [gender, setGender] = useState(searchParams.get("gender") || "");
  const [barberName, setBarberName] = useState(
    searchParams.get("barberName") || ""
  );
  const [sort, setSort] = useState(
    searchParams.get("sort") || "createdAt,desc"
  );

  const updateURL = (params: Record<string, string>) => {
    const newSearchParams = new URLSearchParams(searchParams);

    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newSearchParams.set(key, value);
      } else {
        newSearchParams.delete(key);
      }
    });

    router.push(`/hairstyles?${newSearchParams.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateURL({ search });
  };

  const handleGenderChange = (value: string) => {
    setGender(value);
    updateURL({ gender: value });
  };

  const handleBarberChange = (value: string) => {
    setBarberName(value);
    updateURL({ barberName: value });
  };

  const handleSortChange = (value: string) => {
    setSort(value);
    updateURL({ sort: value });
  };

  const clearFilters = () => {
    setSearch("");
    setGender("");
    setBarberName("");
    setSort("createdAt,desc");
    router.push("/hairstyles");
  };

  const hasActiveFilters =
    search || gender || barberName || sort !== "createdAt,desc";

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Filters</span>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-8 px-2"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search hairstyles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit" size="sm" className="w-full">
              Search
            </Button>
          </form>

          {/* Gender Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Gender</label>
            <Select value={gender} onValueChange={handleGenderChange}>
              <SelectTrigger>
                <SelectValue placeholder="All genders" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All genders</SelectItem>
                <SelectItem value="MALE">Male</SelectItem>
                <SelectItem value="FEMALE">Female</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Barber Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Barber</label>
            <Input
              placeholder="Filter by barber name..."
              value={barberName}
              onChange={(e) => setBarberName(e.target.value)}
            />
          </div>

          {/* Sort */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Sort by</label>
            <Select value={sort} onValueChange={handleSortChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt,desc">Newest first</SelectItem>
                <SelectItem value="createdAt,asc">Oldest first</SelectItem>
                <SelectItem value="name,asc">Name A-Z</SelectItem>
                <SelectItem value="name,desc">Name Z-A</SelectItem>
                <SelectItem value="barberName,asc">Barber A-Z</SelectItem>
                <SelectItem value="barberName,desc">Barber Z-A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
