import { FilterGroup, SortOption } from "@/types/navigation";

export const SORT_OPTIONS: SortOption[] = [
  {
    id: "featured",
    label: "Featured",
    value: "featured",
    field: "featured",
    order: "desc",
  },
  {
    id: "price-low",
    label: "Price: Low to High",
    value: "price-low",
    field: "price",
    order: "asc",
  },
  {
    id: "price-high",
    label: "Price: High to Low",
    value: "price-high",
    field: "price",
    order: "desc",
  },
  {
    id: "rating",
    label: "Highest Rated",
    value: "rating",
    field: "rating",
    order: "desc",
  },
  {
    id: "newest",
    label: "Newest First",
    value: "newest",
    field: "createdAt",
    order: "desc",
  },
  {
    id: "name-asc",
    label: "Name: A to Z",
    value: "name-asc",
    field: "name",
    order: "asc",
  },
  {
    id: "name-desc",
    label: "Name: Z to A",
    value: "name-desc",
    field: "name",
    order: "desc",
  },
];

export const FILTER_GROUPS: FilterGroup[] = [
  {
    id: "price",
    label: "Price Range",
    type: "range",
    options: [],
    min: 0,
    max: 100000000,
    step: 1000,
  },
  {
    id: "categories",
    label: "Category",
    type: "checkbox",
    options: [],
  },
];

export const DEFAULT_FILTERS = {
  search: "",
  sort: "featured",
  priceRange: [0, 1000] as [number, number],
  categories: [],
};
