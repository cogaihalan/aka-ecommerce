"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AppUser, UserRole } from "@/types/auth";
import {
  MoreHorizontal,
  Shield,
  ShieldCheck,
  Calendar,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { format } from "date-fns";
import { getUserInitials, getUserDisplayName } from "@/lib/auth/utils";

export const columns: ColumnDef<AppUser>[] = [
  {
    id: "name", // Change from "email" to "name" to match server parameter
    accessorKey: "email",
    header: "User",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.imageUrl} />
            <AvatarFallback>{getUserInitials(user)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{getUserDisplayName(user)}</div>
            <div className="text-sm text-muted-foreground">{user.email}</div>
          </div>
        </div>
      );
    },
    enableColumnFilter: true,
    meta: {
      label: "User",
      placeholder: "Search users...",
      variant: "text",
    },
  },
  {
    id: "role",
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as UserRole;
      return (
        <Badge variant={role === UserRole.ADMIN ? "default" : "secondary"}>
          {role === UserRole.ADMIN ? (
            <ShieldCheck className="mr-1 h-3 w-3" />
          ) : (
            <Shield className="mr-1 h-3 w-3" />
          )}
          {role}
        </Badge>
      );
    },
    enableColumnFilter: true,
    meta: {
      label: "Role",
      variant: "select",
      options: [
        { label: "All Roles", value: "all" },
        { label: "Admin", value: UserRole.ADMIN },
        { label: "User", value: UserRole.USER },
      ],
    },
  },
  {
    id: "isActive",
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.getValue("isActive") as boolean;
      return (
        <Badge variant={isActive ? "default" : "secondary"}>
          {isActive ? "Active" : "Inactive"}
        </Badge>
      );
    },
    enableColumnFilter: true,
    meta: {
      label: "Status",
      variant: "select",
      options: [
        { label: "All", value: "all" },
        { label: "Active", value: "true" },
        { label: "Inactive", value: "false" },
      ],
    },
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as Date;
      return (
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Calendar className="h-3 w-3" />
          {format(date, "MMM dd, yyyy")}
        </div>
      );
    },
  },
  {
    id: "lastSignInAt",
    accessorKey: "lastSignInAt",
    header: "Last Sign In",
    cell: ({ row }) => {
      const lastSignIn = row.getValue("lastSignInAt") as Date | undefined;
      return (
        <div className="text-sm text-muted-foreground">
          {lastSignIn ? format(lastSignIn, "MMM dd, yyyy") : "Never"}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const user = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(user.id)}
            >
              Copy user ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              Edit user
            </DropdownMenuItem>
            <DropdownMenuItem>
              {user.role === UserRole.ADMIN ? (
                <>
                  <UserX className="mr-2 h-4 w-4" />
                  Make User
                </>
              ) : (
                <>
                  <UserCheck className="mr-2 h-4 w-4" />
                  Make Admin
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem>
              {user.isActive ? (
                <>
                  <XCircle className="mr-2 h-4 w-4" />
                  Deactivate
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Activate
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete user
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
