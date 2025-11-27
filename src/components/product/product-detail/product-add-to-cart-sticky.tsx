"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Price } from "@/components/ui/price";
import { QuantitySelector } from "@/components/ui/quantity-selector";
import { Loader2, ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { cn, isProductOutOfStock, getStockStatusText } from "@/lib/utils";
import { Product } from "@/types";

interface ProductAddToCartStickyProps {
  product: Product & {
    inStock?: boolean;
    stockCount?: number;
  };
  className?: string;
}

export function ProductAddToCartSticky({
  product,
  className,
}: ProductAddToCartStickyProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const { addToCart, isProductLoading, isInCart, getItemQuantity } = useCart();

  const isOutOfStock = isProductOutOfStock(product);
  const stockStatusText = getStockStatusText(product);
  const isInCartState = isInCart(product.id);
  const primaryImage = product.images.find((img) => img.primary) || product.images[0];

  // Show sticky bar when scrolled past a threshold
  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = 250; // Show after scrolling 500px
      setIsVisible(window.scrollY > scrollThreshold);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const onAddToCart = useCallback(async () => {
    await addToCart(product, quantity);
  }, [addToCart, product, quantity]);

  const handleBuyNow = useCallback(() => {
    onAddToCart();
    setTimeout(() => {
      window.location.href = "/checkout";
    }, 1000);
  }, [onAddToCart]);

  return (
    <div
      className={cn(
        "hidden lg:block fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-screen-lg z-50 bg-background/95 rounded-t-lg backdrop-blur-md border-t shadow-lg transition-transform duration-300",
        isVisible ? "translate-y-0" : "translate-y-full",
        className
      )}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Product Info */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {primaryImage && (
              <div className="relative h-12 w-12 flex-shrink-0 rounded-md overflow-hidden border">
                <Image
                  src={primaryImage.url}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="min-w-0">
              <h3 className="font-medium text-sm truncate">{product.name}</h3>
              <Price
                price={product.discountPrice || product.price}
                originalPrice={product.discountPrice ? product.price : undefined}
                size="sm"
                weight="semibold"
              />
            </div>
          </div>

          {/* Quantity & Actions */}
          <div className="flex items-center gap-3">
            {/* Quantity Selector - Hidden on mobile */}
            <div className="hidden sm:block">
              <QuantitySelector
                value={quantity}
                onChange={setQuantity}
                min={1}
                max={product.stockCount || product.stock || 10}
                size="lg"
                variant="default"
                disabled={isOutOfStock}
              />
            </div>

            {/* Add to Cart Button */}
            <Button
              size="sm"
              className={cn(isOutOfStock && "opacity-50 cursor-not-allowed")}
              onClick={onAddToCart}
              disabled={isProductLoading(product.id) || isOutOfStock}
            >
              {isProductLoading(product.id) ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isOutOfStock ? (
                <span className="hidden sm:inline">{stockStatusText}</span>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">
                    {isInCartState
                      ? `Trong giỏ (${getItemQuantity(product.id)})`
                      : "Thêm vào giỏ"}
                  </span>
                </>
              )}
            </Button>

            {/* Buy Now Button */}
            <Button
              variant="secondary"
              size="sm"
              className={cn(
                "hidden sm:flex",
                isOutOfStock && "opacity-50 cursor-not-allowed"
              )}
              onClick={handleBuyNow}
              disabled={isProductLoading(product.id) || isOutOfStock}
            >
              Mua ngay
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

