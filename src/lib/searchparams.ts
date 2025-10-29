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
  orderCode: parseAsString,
  status: parseAsString,
  paymentStatus: parseAsString,
  paymentMethod: parseAsString,
  recipientName: parseAsString,
  recipientPhone: parseAsString,
  dateFrom: parseAsString,
  dateTo: parseAsString,
  sort: getSortingStateParser<any>().withDefault([{ id: "id", desc: true }]),
  t: parseAsString,
  barberName: parseAsString,
};

export const searchParamsCache = createSearchParamsCache(searchParams);
export const serialize = createSerializer(searchParams);
