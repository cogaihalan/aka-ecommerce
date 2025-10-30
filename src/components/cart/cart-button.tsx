"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag } from "lucide-react";
import { useCartStore, useCartItemCount } from "@/stores/cart-store";
import { cn } from "@/lib/utils";

interface CartButtonProps {
  variant?:
    | "default"
    | "outline"
    | "ghost"
    | "link"
    | "destructive"
    | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  showBadge?: boolean;
  showText?: boolean;
  className?: string;
  onClick?: () => void;
}

export function CartButton({
  variant = "outline",
  size = "default",
  showBadge = true,
  showText = true,
  className,
  onClick,
}: CartButtonProps) {
  const { openCart } = useCartStore();
  const itemCount = useCartItemCount();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      openCart();
    }
  };

  if (size === "icon") {
    return (
      <div className="relative">
        <Button
          variant={variant}
          size="icon"
          onClick={handleClick}
          className={cn("relative", className)}
        >
          <ShoppingBag className="h-4 w-4" />
          {showBadge && itemCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {itemCount > 99 ? "99+" : itemCount}
            </Badge>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="relative">
      <Button
        variant={variant}
        size={size}
        onClick={handleClick}
        className={cn("relative", className)}
      >
        <ShoppingBag className="h-4 w-4" />
        {showText && <span className="ml-2">Giỏ hàng</span>}
        {showBadge && itemCount > 0 && (
          <Badge
            variant="destructive"
            className="ml-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            {itemCount > 99 ? "99+" : itemCount}
          </Badge>
        )}
      </Button>
    </div>
  );
}
