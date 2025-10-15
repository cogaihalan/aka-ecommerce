import {
  createSearchParamsCache,
  createSerializer,
  parseAsInteger,
  parseAsString,
} from "nuqs/server";
import { getSortingStateParser } from "./parsers";

export const searchParams = {
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  name: parseAsString,
  gender: parseAsString,
  category: parseAsString,
  isActive: parseAsString,
  parentId: parseAsString,
  role: parseAsString,
  // Order-specific parameters
  orderNumber: parseAsString,
  status: parseAsString,
  paymentStatus: parseAsString,
  fulfillmentStatus: parseAsString,
  dateFrom: parseAsString,
  dateTo: parseAsString,
  // Sorting parameter
  sort: getSortingStateParser().withDefault([]),
  // Timestamp for cache busting
  t: parseAsString,
  // advanced filter
  // filters: getFiltersStateParser().withDefault([]),
  // joinOperator: parseAsStringEnum(['and', 'or']).withDefault('and')
};

export const searchParamsCache = createSearchParamsCache(searchParams);
export const serialize = createSerializer(searchParams);
