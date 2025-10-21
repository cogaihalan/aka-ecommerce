"use client";

import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "./use-debounce";

interface UseDebouncedSearchOptions {
  delay?: number;
  onSearch?: (searchTerm: string) => void;
}

export function useDebouncedSearch(options: UseDebouncedSearchOptions = {}) {
  const { delay = 300, onSearch } = options;

  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, delay);

  const handleSearch = useCallback(
    (term: string) => {
      setSearchTerm(term);
      if (term !== debouncedSearchTerm) {
        setIsSearching(true);
      }
    },
    [debouncedSearchTerm]
  );

  useEffect(() => {
    if (debouncedSearchTerm !== searchTerm) {
      setIsSearching(false);
    }

    if (onSearch && debouncedSearchTerm !== undefined) {
      onSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, searchTerm, onSearch]);

  return {
    searchTerm,
    debouncedSearchTerm,
    isSearching,
    handleSearch,
  };
}
