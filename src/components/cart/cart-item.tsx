"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Price } from "@/components/ui/price";
import { Trash2, Plus, Minus, AlertCircle } from "lucide-react";
import { CartItem as CartItemType } from "@/types/cart";
import { useCartStore } from "@/stores/cart-store";
import { cn } from "@/lib/utils";

interface CartItemProps {
  item: CartItemType;
  showRemoveButton?: boolean;
  showQuantityControls?: boolean;
  variant?: "default" | "compact" | "minimal";
  className?: string;
}

export function CartItem({
  item,
  showRemoveButton = true,
  showQuantityControls = true,
  variant = "default",
  className,
}: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 0) return;

    setIsUpdating(true);
    try {
      await updateQuantity(item.id, newQuantity);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // If the input is empty, don't update quantity (keep current value)
    if (value === "" || parseInt(value) <= 0) {
      return;
    }

    const newQuantity = parseInt(value);
    if (!isNaN(newQuantity) && newQuantity >= 0) {
      handleQuantityChange(newQuantity);
    }
  };

  const handleRemove = async () => {
    setIsUpdating(true);
    try {
      await removeItem(item.id);
    } finally {
      setIsUpdating(false);
    }
  };

  const isLowStock = item.maxQuantity && item.quantity > item.maxQuantity * 0.8;
  const isOutOfStock = item.maxQuantity && item.quantity >= item.maxQuantity;

  if (variant === "minimal") {
    return (
      <div className={cn("flex items-start gap-3 py-3 group", className)}>
        <div className="w-10 h-10 bg-muted rounded-md overflow-hidden flex-shrink-0">
          <Image
            src={item.image || "/assets/placeholder-image.jpeg"}
            alt={item.name}
            width={40}
            height={40}
            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
          />
        </div>
        <div className="flex-1 min-w-0 space-y-1">
          <p className="text-sm font-medium group-hover:text-primary transition-colors line-clamp-2 leading-tight">
            {item.name}
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Qty: {item.quantity}</span>
            {Object.keys(item.attributes).length > 0 && (
              <span className="truncate">
                {Object.entries(item.attributes)
                  .slice(0, 1)
                  .map(([key, value]) => (
                    <span key={key}>
                      {key}: {value}
                    </span>
                  ))}
                {Object.keys(item.attributes).length > 1 && (
                  <span> +{Object.keys(item.attributes).length - 1}</span>
                )}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <div className="text-sm font-semibold">
              ${(item.price * item.quantity).toFixed(2)}
            </div>
            {item.compareAtPrice && item.compareAtPrice > item.price && (
              <div className="text-xs text-muted-foreground line-through">
                ${(item.compareAtPrice * item.quantity).toFixed(2)}
              </div>
            )}
          </div>
          {showRemoveButton && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
              onClick={handleRemove}
              disabled={isUpdating}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div
        className={cn(
          "flex items-center gap-3 p-3 border rounded-lg",
          className
        )}
      >
        <div className="w-16 h-16 bg-muted rounded-md overflow-hidden flex-shrink-0">
          <Image
            src={item.image || "/assets/placeholder-image.jpeg"}
            alt={item.name}
            width={64}
            height={64}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm truncate">{item.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            {Object.entries(item.attributes).map(([key, value]) => (
              <Badge key={key} variant="secondary" className="text-xs">
                {key}: {value}
              </Badge>
            ))}
          </div>
          {isLowStock && (
            <div className="flex items-center gap-1 mt-1 text-amber-600 text-xs">
              <AlertCircle className="w-3 h-3" />
              Low stock
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {showQuantityControls && (
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleQuantityChange(item.quantity - 1)}
                disabled={isUpdating || item.quantity <= 1}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <Input
                type="number"
                value={item.quantity}
                onChange={handleInputChange}
                className="w-12 h-8 text-center text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                min="1"
                max={item.maxQuantity}
                disabled={isUpdating}
              />
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleQuantityChange(item.quantity + 1)}
                disabled={!!isUpdating || !!isOutOfStock}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          )}

          <div className="text-right min-w-[80px]">
            <div className="font-medium">
              ${(item.price * item.quantity).toFixed(2)}
            </div>
            {item.compareAtPrice && item.compareAtPrice > item.price && (
              <div className="text-xs text-muted-foreground line-through">
                ${(item.compareAtPrice * item.quantity).toFixed(2)}
              </div>
            )}
          </div>

          {showRemoveButton && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={handleRemove}
              disabled={isUpdating}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <Card className={cn("overflow-hidden", className)} isProductCard>
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="w-20 h-20 bg-muted rounded-md overflow-hidden flex-shrink-0">
            <Image
              src={item.image || "/assets/placeholder-image.jpeg"}
              alt={item.name}
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold mb-1 truncate">{item.name}</h3>
            <p className="text-sm text-muted-foreground mb-2">
              SKU: {item.sku}
            </p>

            <div className="flex items-center gap-2 mb-2">
              {Object.entries(item.attributes).map(([key, value]) => (
                <Badge key={key} variant="secondary" className="text-xs">
                  {key}: {value}
                </Badge>
              ))}
            </div>

            {isLowStock && (
              <div className="flex items-center gap-1 text-amber-600 text-sm mb-2">
                <AlertCircle className="w-4 h-4" />
                Low stock - only {item.maxQuantity} available
              </div>
            )}

            <div className="flex items-center gap-2">
              <Price
                price={item.price}
                originalPrice={item.compareAtPrice}
                size="lg"
                weight="bold"
                showDiscount={true}
              />
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            {showQuantityControls && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(item.quantity - 1)}
                  disabled={isUpdating || item.quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  value={item.quantity}
                  onChange={handleInputChange}
                  className="w-16 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  min="1"
                  max={item.maxQuantity}
                  disabled={isUpdating}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(item.quantity + 1)}
                  disabled={!!isUpdating || !!isOutOfStock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}

            <div className="text-right">
              <div className="text-lg font-bold">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
              {item.compareAtPrice && item.compareAtPrice > item.price && (
                <div className="text-sm text-muted-foreground line-through">
                  ${(item.compareAtPrice * item.quantity).toFixed(2)}
                </div>
              )}
            </div>

            {showRemoveButton && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRemove}
                disabled={isUpdating}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
