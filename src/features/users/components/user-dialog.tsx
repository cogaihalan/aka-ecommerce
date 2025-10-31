"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Calendar,
  Mail,
  Phone,
  Shield,
  ShieldCheck,
  Lock,
  Unlock,
} from "lucide-react";
import { format } from "date-fns";
import { User as UserType } from "@/types";
import { unifiedUserService } from "@/lib/api/services/unified";
import { toast } from "sonner";

interface UserDialogProps {
  user?: UserType;
  trigger?: React.ReactNode;
  onDialogClose?: () => void;
}

export function UserDialog({ user, trigger, onDialogClose }: UserDialogProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open && onDialogClose) {
      onDialogClose();
    }
  };

  const handleLockUnlock = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      if (user.enabled) {
        await unifiedUserService.lockUser(user.id.toString());
        toast.success("Khóa tài khoản thành công");
      } else {
        await unifiedUserService.unlockUser(user.id.toString());
        toast.success("Mở khóa tài khoản thành công");
      }
      // Close dialog and refresh the page to show updated status
      setIsDialogOpen(false);
      if (onDialogClose) {
        onDialogClose();
      }
      window.location.reload();
    } catch (error) {
      console.error("Error updating user status:", error);
      toast.error(
        user.enabled ? "Khóa tài khoản thất bại" : "Mở khóa tài khoản thất bại"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm">
            <User className="mr-2 h-4 w-4" />
            Xem chi tiết
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Thông tin người dùng</DialogTitle>
          <DialogDescription>
            Xem thông tin chi tiết về tài khoản người dùng này.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Profile Section */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatarUrl} />
              <AvatarFallback className="text-lg">
                {user.fullName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">{user.fullName}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <div className="flex items-center space-x-2">
                <Badge variant={user.enabled ? "default" : "secondary"}>
                  {user.enabled ? "Đang hoạt động" : "Ngừng hoạt động"}
                </Badge>
                <Badge variant="outline">ID: {user.id}</Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* User Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Số điện thoại</p>
                  <p className="text-sm text-muted-foreground">
                    {user.phoneNumber || "Chưa cung cấp"}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Tên người dùng</p>
                  <p className="text-sm text-muted-foreground">
                    {user.username}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Ngày tạo</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Cập nhật lần cuối</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(user.updatedAt).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Clerk ID</p>
                  <p className="text-xs text-muted-foreground font-mono">
                    {user.clerkId}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Roles Section */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium flex items-center">
              <Shield className="mr-2 h-4 w-4" />
              Vai trò & Quyền hạn
            </h4>
            <div className="space-y-2">
              {user.roles.map((role) => (
                <div
                  key={role.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center space-x-2">
                    {role.name === "ADMIN" ? (
                      <ShieldCheck className="h-4 w-4 text-primary" />
                    ) : (
                      <Shield className="h-4 w-4 text-muted-foreground" />
                    )}
                    <p className="font-medium">{role.name}</p>
                  </div>
                  <Badge
                    variant={role.name === "ADMIN" ? "default" : "secondary"}
                  >
                    {role.name}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <Separator />
          <div className="flex justify-end space-x-2">
            <Button
              variant={user.enabled ? "destructive" : "default"}
              onClick={handleLockUnlock}
              disabled={isLoading}
            >
              {user.enabled ? (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  {isLoading ? "Đang khóa..." : "Khóa tài khoản"}
                </>
              ) : (
                <>
                  <Unlock className="mr-2 h-4 w-4" />
                  {isLoading ? "Đang mở khóa..." : "Mở khóa tài khoản"}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
