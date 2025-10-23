"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Price } from "@/components/ui/price";
import { Trash2, Plus, Minus, Loader2 } from "lucide-react";
import { CartItem as CartItemType } from "@/types/cart";
import { useCartStore, useCartItemLoading } from "@/stores/cart-store";
import { cn, formatPrice } from "@/lib/utils";

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
  const isItemLoading = useCartItemLoading(item.id);

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 0) return;
    await updateQuantity(item.id, newQuantity);
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
    await removeItem(item.id);
  };

  const imageUrl = item.product.images?.find((image) => image.primary)?.url || "/assets/placeholder-image.jpeg";


  // Remove stock-related logic since CartItem doesn't have maxQuantity
  const isOutOfStock = false;

  if (variant === "minimal") {
    return (
      <div className={cn("flex items-start gap-3 py-3 group", className)}>
        <div className="w-10 h-10 bg-muted rounded-md overflow-hidden flex-shrink-0">
          <Image
            src={imageUrl}
            alt={item.product.name}
            width={40}
            height={40}
            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
          />
        </div>
        <div className="flex-1 min-w-0 space-y-1">
          <p className="text-sm font-medium group-hover:text-primary transition-colors line-clamp-2 leading-tight">
            {item.product.name}
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Qty: {item.quantity}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <div className="text-sm font-semibold">
              {formatPrice(item.price * item.quantity)}
            </div>
          </div>
          {showRemoveButton && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
              onClick={handleRemove}
              disabled={isItemLoading}
            >
              {isItemLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
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
            src={imageUrl}
            alt={item.product.name}
            width={64}
            height={64}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm truncate">{item.product.name}</h3>
        </div>

        <div className="flex items-center gap-2">
          {showQuantityControls && (
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleQuantityChange(item.quantity - 1)}
                disabled={isItemLoading || item.quantity <= 1}
              >
                {isItemLoading ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Minus className="h-3 w-3" />
                )}
              </Button>
              <Input
                type="number"
                value={item.quantity}
                onChange={handleInputChange}
                className="w-12 h-8 text-center text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                min="1"
                disabled={isItemLoading}
              />
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleQuantityChange(item.quantity + 1)}
                disabled={!!isItemLoading || !!isOutOfStock}
              >
                {isItemLoading ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Plus className="h-3 w-3" />
                )}
              </Button>
            </div>
          )}

          <div className="text-right min-w-[80px]">
            <div className="font-medium">
              {formatPrice(item.price * item.quantity)}
            </div>
          </div>

          {showRemoveButton && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={handleRemove}
              disabled={isItemLoading}
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
    <Card className={cn("overflow-hidden", className)} disableBlockPadding>
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="w-20 h-20 bg-muted rounded-md overflow-hidden flex-shrink-0">
            <Image
              src={imageUrl}
              alt={item.product.name}
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold mb-1 truncate">{item.product.name}</h3>

            <div className="flex items-center gap-2">
              <Price
                price={item.price}
                size="lg"
                weight="semibold"
                showDiscount={false}
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
                  disabled={isItemLoading || item.quantity <= 1}
                >
                  {isItemLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Minus className="h-4 w-4" />
                  )}
                </Button>
                <Input
                  type="number"
                  value={item.quantity}
                  onChange={handleInputChange}
                  className="w-16 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  min="1"
                  disabled={isItemLoading}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(item.quantity + 1)}
                  disabled={!!isItemLoading || !!isOutOfStock}
                >
                  {isItemLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </Button>
              </div>
            )}

            <div className="text-right">
              <div className="text-lg font-bold">
                {formatPrice(item.price * item.quantity)}
              </div>
            </div>

            {showRemoveButton && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRemove}
                disabled={isItemLoading}
                className="text-destructive hover:text-destructive"
              >
                {isItemLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
