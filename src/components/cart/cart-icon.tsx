"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import { useCartStore, useCartItemCount } from "@/stores/cart-store";
import { MiniCart } from "./mini-cart";
import { cn } from "@/lib/utils";

interface CartIconProps {
  className?: string;
  showBadge?: boolean;
}

export function CartIcon({ className, showBadge = true }: CartIconProps) {
  const { isOpen, toggleCart } = useCartStore();
  const itemCount = useCartItemCount();
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Animate when item count changes
  useEffect(() => {
    if (itemCount > 0) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 600);
      return () => clearTimeout(timer);
    }
  }, [itemCount]);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleCart}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "relative transition-all duration-200 hover:bg-muted/50 size-9",
          isOpen && "pointer-events-none",
          className
        )}
        aria-label="Giỏ hàng"
      >
        <ShoppingCart
          className={cn(
            "transition-all duration-200 size-5",
            (isHovered || isOpen) && "scale-110",
            isAnimating && "animate-pulse"
          )}
        />
        {showBadge && itemCount > 0 && (
          <Badge
            variant="destructive"
            className={cn(
              "absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center",
              "animate-in zoom-in-50 duration-200",
              isAnimating && "animate-bounce",
              itemCount > 99 && "text-xs"
            )}
          >
            {itemCount > 99 ? "99+" : itemCount}
          </Badge>
        )}
      </Button>

      {/* Mini Cart Dropdown */}
      <MiniCart />
    </div>
  );
}
