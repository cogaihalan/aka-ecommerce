"use client";

import { useState, useEffect, useCallback } from "react";
import { storefrontCatalogService } from "@/lib/api/services/storefront/catalog";
import type { Product } from "@/types/product";

interface UseProductSearchSuggestionsOptions {
  debounceMs?: number;
  limit?: number;
  minLength?: number;
}

interface UseProductSearchSuggestionsReturn {
  suggestions: Product[];
  isLoading: boolean;
  error: string | null;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  clearSuggestions: () => void;
  debouncedTerm: string;
}

export function useProductSearchSuggestions(
  options: UseProductSearchSuggestionsOptions = {}
): UseProductSearchSuggestionsReturn {
  const { debounceMs = 300, limit = 5, minLength = 2 } = options;

  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");

  // Debounce the search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchTerm, debounceMs]);

  // Fetch suggestions when debounced term changes
  const fetchSuggestions = useCallback(
    async (term: string) => {
      if (term.length < minLength) {
        setSuggestions([]);
        setIsLoading(false);
        setError(null);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await storefrontCatalogService.getProducts({
          name: term,
          size: limit,
          page: 1,
        });

        setSuggestions(response.items || []);
      } catch (err) {
        console.error("Error fetching search suggestions:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch suggestions"
        );
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    },
    [limit, minLength]
  );

  // Cancel previous requests when component unmounts or search term changes
  useEffect(() => {
    return () => {
      // Cleanup function to cancel any pending requests
      setIsLoading(false);
    };
  }, [debouncedTerm]);

  // Effect to fetch suggestions when debounced term changes
  useEffect(() => {
    fetchSuggestions(debouncedTerm);
  }, [debouncedTerm, fetchSuggestions]);

  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
    setSearchTerm("");
    setError(null);
  }, []);

  return {
    suggestions,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    clearSuggestions,
    debouncedTerm,
  };
}
