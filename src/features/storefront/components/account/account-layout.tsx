"use client";

import { ReactNode, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  User,
  Package,
  MapPin,
  Settings,
  Heart,
  LogOut,
  Menu,
  Award,
  Link as LinkIcon,
} from "lucide-react";
import { SignOutButton } from "@/components/auth";

interface AccountLayoutProps {
  children: ReactNode;
}

const accountNav = [
  { label: "Tổng quan", href: "/account", icon: User },
  { label: "Đơn hàng", href: "/account/orders", icon: Package },
  { label: "Địa chỉ", href: "/account/addresses", icon: MapPin },
  { label: "Hồ sơ", href: "/account/profile", icon: Settings },
  { label: "Bài dự thi", href: "/account/submissions", icon: Award },
  { label: "Affiliate", href: "/account/affiliate", icon: LinkIcon },
  { label: "Yêu thích", href: "/account/wishlist", icon: Heart },
  { label: "Đăng xuất", href: "/auth/sign-out", icon: LogOut },
];

export default function AccountLayout({ children }: AccountLayoutProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const renderNavItems = () => {
    return accountNav.map((item) => {
      const Icon = item.icon;

      // Handle Logout item with SignOutButton
      if (item.label === "Đăng xuất") {
        return (
          <SignOutButton
            key={item.href}
            redirectUrl="/auth/sign-in"
            className={cn(
              "flex items-center justify-start gap-3 px-3 py-2 rounded-md text-sm transition-colors cursor-pointer w-full text-left",
              "hover:bg-muted"
            )}
            onClick={() => setIsOpen(false)}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </SignOutButton>
        );
      }

      return (
        <Link
          key={item.href}
          href={item.href}
          onClick={() => setIsOpen(false)}
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
            pathname === item.href ? "bg-primary text-white" : "hover:bg-muted"
          )}
        >
          <Icon className="h-4 w-4" />
          {item.label}
        </Link>
      );
    });
  };

  return (
    <div className="space-y-6 pb-8 lg:pb-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Tài khoản của tôi</h1>
          <p className="text-muted-foreground">
            Quản lý cài đặt tài khoản và đơn hàng
          </p>
        </div>

        {/* Mobile Navigation Button */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="lg:hidden">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80">
            <div className="space-y-4 p-4">
              <div>
                <h2 className="text-lg font-semibold">Menu tài khoản</h2>
                <p className="text-sm text-muted-foreground">
                  Điều hướng tài khoản của bạn
                </p>
              </div>
              <nav className="space-y-2">{renderNavItems()}</nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Desktop Navigation */}
        <div className="hidden lg:block">
          <Card className="py-4">
            <CardContent className="px-2">
              <nav className="space-y-2">{renderNavItems()}</nav>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3 border border-border rounded-lg p-6 shadow-sm bg-card">
          {children}
        </div>
      </div>
    </div>
  );
}
