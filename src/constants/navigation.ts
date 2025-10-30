import { FilterGroup, SortOption } from "@/types/navigation";

export const SORT_OPTIONS: SortOption[] = [
  {
    id: "featured",
    label: "Nổi bật",
    value: "featured",
    field: "featured",
    order: "desc",
  },
  {
    id: "price-asc",
    label: "Giá: Thấp đến Cao",
    value: "price,asc",
    field: "price",
    order: "asc",
  },
  {
    id: "price-desc",
    label: "Giá: Cao đến Thấp",
    value: "price,desc",
    field: "price",
    order: "desc",
  },
  {
    id: "name-asc",
    label: "Tên: A đến Z",
    value: "name,asc",
    field: "name",
    order: "asc",
  },
  {
    id: "name-desc",
    label: "Tên: Z đến A",
    value: "name,desc",
    field: "name",
    order: "desc",
  },
];

export const FILTER_GROUPS: FilterGroup[] = [
  {
    id: "price",
    label: "Khoảng giá",
    type: "range",
    options: [],
    min: 0,
    max: 100000000,
    step: 1000,
  },
  {
    id: "categoryIds",
    label: "Danh mục",
    type: "checkbox",
    options: [],
  },
];

export const DEFAULT_FILTERS = {
  search: "",
  sort: "featured",
  priceRange: [] as [] | [number, number],
  categoryIds: [],
};
