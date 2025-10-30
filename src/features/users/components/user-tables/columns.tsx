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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "@/types";
import {
  MoreHorizontal,
  Shield,
  ShieldCheck,
  Calendar,
  Eye,
  Lock,
  Unlock,
} from "lucide-react";
import { format } from "date-fns";
import { UserDialog } from "../user-dialog";
import { unifiedUserService } from "@/lib/api/services/unified";
import { toast } from "sonner";
import { useState } from "react";

export const columns: ColumnDef<User>[] = [
  {
    id: "name",
    accessorKey: "email",
    header: "Người dùng",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatarUrl} />
            <AvatarFallback>
              {user.fullName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{user.fullName}</div>
            <div className="text-sm text-muted-foreground">{user.email}</div>
          </div>
        </div>
      );
    },
    enableColumnFilter: true,
    meta: {
      label: "Người dùng",
      placeholder: "Tìm người dùng...",
      variant: "text",
    },
  },
  {
    id: "roles",
    accessorKey: "roles",
    header: "Vai trò",
    cell: ({ row }) => {
      const user = row.original;
      const roles = user.roles;
      return (
        <div className="flex flex-wrap gap-1">
          {roles.map((role) => (
            <Badge
              key={role.id}
              variant={role.name === "ADMIN" ? "default" : "secondary"}
            >
              {role.name === "ADMIN" ? (
                <ShieldCheck className="mr-1 h-3 w-3" />
              ) : (
                <Shield className="mr-1 h-3 w-3" />
              )}
              {role.name}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    id: "enabled",
    accessorKey: "enabled",
    header: "Trạng thái",
    cell: ({ row }) => {
      const enabled = row.getValue("enabled") as boolean;
      return (
        <Badge variant={enabled ? "default" : "secondary"}>
          {enabled ? "Hoạt động" : "Ngừng hoạt động"}
        </Badge>
      );
    },
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: "Tạo lúc",
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as string;
      return (
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Calendar className="h-3 w-3" />
          {format(new Date(date), "MMM dd, yyyy")}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const user = row.original;
      const [isDropdownOpen, setIsDropdownOpen] = useState(false);

      return (
        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Mở menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
            <DropdownMenuLabel>Hành động</DropdownMenuLabel>
            <UserDialog
              user={user}
              trigger={
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Eye className="mr-2 h-4 w-4" />
                  Xem chi tiết người dùng
                </DropdownMenuItem>
              }
              onDialogClose={() => setIsDropdownOpen(false)}
            />
            <DropdownMenuItem
              onClick={async () => {
                try {
                  if (user.enabled) {
                    await unifiedUserService.lockUser(user.id.toString());
                    toast.success("Khóa tài khoản thành công");
                  } else {
                    await unifiedUserService.unlockUser(user.id.toString());
                    toast.success("Mở khóa tài khoản thành công");
                  }
                  // Refresh the page to show updated status
                  window.location.reload();
                } catch (error) {
                  console.error("Error updating user status:", error);
                  toast.error(
                    user.enabled
                      ? "Khóa tài khoản thất bại"
                      : "Mở khóa tài khoản thất bại"
                  );
                }
              }}
            >
              {user.enabled ? (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Khóa tài khoản
                </>
              ) : (
                <>
                  <Unlock className="mr-2 h-4 w-4" />
                  Mở khóa tài khoản
                </>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    size: 32,
    maxSize: 32,
  },
];
