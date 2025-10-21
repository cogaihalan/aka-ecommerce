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
    id: "price-asc",
    label: "Price: Low to High",
    value: "price,asc",
    field: "price",
    order: "asc",
  },
  {
    id: "price-desc",
    label: "Price: High to Low",
    value: "price,desc",
    field: "price",
    order: "desc",
  },
  {
    id: "name-asc",
    label: "Name: A to Z",
    value: "name,asc",
    field: "name",
    order: "asc",
  },
  {
    id: "name-desc",
    label: "Name: Z to A",
    value: "name,desc",
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
    id: "categoryIds",
    label: "Category",
    type: "checkbox",
    options: [],
  },
];

export const DEFAULT_FILTERS = {
  search: "",
  sort: "featured", // Keep "featured" as default option
  priceRange: [] as [] | [number, number],
  categoryIds: [],
};
