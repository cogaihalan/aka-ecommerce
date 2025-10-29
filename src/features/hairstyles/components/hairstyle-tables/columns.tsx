"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/table/data-table-column-header";
import { Hairstyle } from "@/types";
import { Text } from "lucide-react";
import Image from "next/image";
import { CellAction } from "./cell-action";

const GENDER_OPTIONS = [
  { label: "Male", value: "MALE" },
  { label: "Female", value: "FEMALE" },
  { label: "Other", value: "OTHER" },
];

export const columns: ColumnDef<Hairstyle>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => <div className="w-[36px]">{row.getValue("id")}</div>,
    size: 36,
    maxSize: 36,
    enableColumnFilter: true,
  },
  {
    id: "name",
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const hairstyle = row.original;
      return (
        <div className="flex items-center space-x-3">
          {hairstyle.photos && hairstyle.photos.length > 0 && (
            <div className="relative w-12 h-12 rounded-lg overflow-hidden">
              <Image
                src={hairstyle.photos[0].url}
                alt={hairstyle.name}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="font-medium">{hairstyle.name}</div>
        </div>
      );
    },
    minSize: 300,
    enableColumnFilter: true,
    meta: {
      label: "Name",
      placeholder: "Search hairstyles...",
      variant: "text",
      icon: Text,
    },
  },
  {
    id: "gender",
    accessorKey: "gender",
    header: "Gender",
    cell: ({ row }) => {
      const gender = row.getValue("gender") as string;
      const genderColors = {
        MALE: "bg-blue-100 text-blue-800",
        FEMALE: "bg-pink-100 text-pink-800",
        OTHER: "bg-purple-100 text-purple-800",
      };
      return (
        <Badge className={genderColors[gender as keyof typeof genderColors]}>
          {gender}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    enableColumnFilter: true,
    meta: {
      label: "Gender",
      variant: "select",
      options: GENDER_OPTIONS,
    },
  },
  {
    accessorKey: "barberName",
    header: "Barber",
    cell: ({ row }) => (
      <div className="flex items-center space-x-2">
        <span>{row.getValue("barberName")}</span>
      </div>
    ),
  },
  {
    accessorKey: "voteCount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Votes" />
    ),
    cell: ({ row }) => {
      const voteCount = row.getValue("voteCount") as number;
      return (
        <div className="flex items-center space-x-2">
          <span className="font-medium">{voteCount}</span>
        </div>
      );
    },
    enableColumnFilter: true,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const hairstyle = row.original;
      return <CellAction data={hairstyle} />;
    },
  },
];
