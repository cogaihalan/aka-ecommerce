"use client";

import React from "react";
import { useDataTable } from "@/hooks/use-data-table";
import { ColumnDef } from "@tanstack/react-table";
import { parseAsInteger, useQueryState } from "nuqs";
import { DataTable } from "@/components/ui/table/data-table";
import { DataTableToolbar } from "@/components/ui/table/data-table-toolbar";

interface DataTableWrapperProps<TData, TValue> {
  data: TData[];
  totalItems: number;
  columns: ColumnDef<TData, TValue>[];
  debounceMs?: number;
  shallow?: boolean;
  position?: "absolute" | "relative";
}

export function DataTableWrapper<TData, TValue>({
  data,
  totalItems,
  columns,
  debounceMs = 500,
  shallow = false,
  position = "absolute",
}: DataTableWrapperProps<TData, TValue>) {
  const [pageSize] = useQueryState("perPage", parseAsInteger.withDefault(10));

  const pageCount = Math.ceil(totalItems / pageSize);

  const { table } = useDataTable({
    data,
    columns,
    pageCount: pageCount,
    shallow, // Setting to false triggers a network request with the updated querystring.
    debounceMs,
  });

  return (
    <DataTable table={table} position={position}>
      <DataTableToolbar table={table} />
    </DataTable>
  );
}
