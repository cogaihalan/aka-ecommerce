export interface FilterOption {
  id: string;
  label: string;
  value: string;
  count?: number;
}

export interface FilterGroup {
  id: string;
  label: string;
  type: "checkbox" | "radio" | "range" | "color";
  options: FilterOption[];
  min?: number;
  max?: number;
  step?: number;
}

export interface SortOption {
  id: string;
  label: string;
  value: string;
  field: string;
  order: "asc" | "desc";
}

export interface NavigationFilters {
  search?: string;
  sort?: string;
  priceRange?: [number, number] | [];
  categoryIds?: string[];
  [key: string]: any;
}

export interface NavigationState {
  filters: NavigationFilters;
  page: number;
  limit: number;
}

export interface FilterCounts {
  [filterId: string]: {
    [optionId: string]: number;
  };
}

export interface NavigationContextType {
  state: NavigationState;
  updateFilters: (filters: Partial<NavigationFilters>) => void;
  updatePage: (page: number) => void;
  resetFilters: () => void;
  getFilterCounts: () => FilterCounts;
}
