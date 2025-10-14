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
    max: 1000,
    step: 10,
  },
  {
    id: "categories",
    label: "Category",
    type: "checkbox",
    options: [
      {
        id: "electronics",
        label: "Electronics",
        value: "electronics",
        count: 45,
      },
      { id: "clothing", label: "Clothing", value: "clothing", count: 32 },
      { id: "home", label: "Home & Garden", value: "home", count: 28 },
      { id: "sports", label: "Sports & Outdoors", value: "sports", count: 19 },
      { id: "books", label: "Books", value: "books", count: 15 },
      { id: "beauty", label: "Beauty & Health", value: "beauty", count: 12 },
    ],
  },
  {
    id: "ratings",
    label: "Customer Rating",
    type: "checkbox",
    options: [
      { id: "5", label: "5 Stars", value: "5", count: 45 },
      { id: "4", label: "4 Stars & Up", value: "4", count: 38 },
      { id: "3", label: "3 Stars & Up", value: "3", count: 25 },
      { id: "2", label: "2 Stars & Up", value: "2", count: 12 },
    ],
  },
  {
    id: "availability",
    label: "Availability",
    type: "checkbox",
    options: [
      { id: "in-stock", label: "In Stock", value: "in-stock", count: 120 },
      { id: "on-sale", label: "On Sale", value: "on-sale", count: 25 },
      {
        id: "new-arrival",
        label: "New Arrivals",
        value: "new-arrival",
        count: 15,
      },
    ],
  },
];

export const DEFAULT_FILTERS = {
  search: "",
  sort: "featured",
  priceRange: [0, 1000] as [number, number],
  categories: [],
  ratings: [],
  availability: [],
};
