"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Price } from "@/components/ui/price";
import { ShoppingCart, Heart, Eye } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useQuickView } from "@/components/providers/quick-view-provider";
import {
  useWishlistActions,
  useWishlistAuthStatus,
  useIsInWishlist,
} from "@/stores/wishlist-store";
import { Product } from "@/types";
import { cn, isProductOutOfStock, getStockStatusText } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  variant?: "default" | "compact" | "featured";
  showWishlist?: boolean;
  className?: string;
}

export function ProductCard({
  product,
  variant = "default",
  showWishlist = true,
  className,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  const { addToCart, isLoading } = useCart();

  const { openQuickView } = useQuickView();
  const { addItem: addToWishlist, removeItem: removeFromWishlist } =
    useWishlistActions();
  const isAuthenticated = useWishlistAuthStatus();
  const isInWishlistState = useIsInWishlist(product.id);

  // Stock status checks
  const isOutOfStock = isProductOutOfStock(product);
  const stockStatusText = getStockStatusText(product);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await addToCart(product, 1);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      router.push("/auth/sign-in");
      return;
    }

    if (isInWishlistState) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openQuickView(product);
  };

  if (variant === "compact") {
    return (
      <Card
        className={cn("group cursor-pointer h-full flex flex-col", className)}
        disableBlockPadding={true}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardContent className="p-3 flex-1 flex flex-col">
          <div className="flex gap-3 flex-1">
            {/* Image on the left - smaller */}
            <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden">
              <Image
                src={
                  product.images?.[0]?.url || "/assets/placeholder-image.jpeg"
                }
                alt={product.name}
                width={80}
                height={80}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Content on the right */}
            <div className="flex-1 flex flex-col justify-between min-w-0">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                    {product.categories?.[0]?.name || "Uncategorized"}
                  </Badge>
                </div>
                <h3 className="font-medium text-sm line-clamp-1 group-hover:text-primary transition-colors cursor-pointer">
                  {product.name}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {product.description}
                </p>
              </div>

              <div className="flex items-center justify-between mt-2">
                <Price
                  price={product.discountPrice || product.price}
                  originalPrice={
                    product.discountPrice ? product.price : undefined
                  }
                  size="sm"
                  weight="semibold"
                />
                <div className="flex items-center gap-1">
                  {showWishlist && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleWishlist}
                      className={cn(
                        "h-7 w-7 transition-colors",
                        isInWishlistState
                          ? "bg-red-50 text-red-500 hover:bg-red-100"
                          : "hover:bg-red-50 hover:text-red-500"
                      )}
                    >
                      <Heart
                        className={cn(
                          "h-3 w-3",
                          isInWishlistState && "fill-current"
                        )}
                      />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleQuickView}
                    className="h-7 w-7 hover:bg-blue-50 hover:text-blue-500 transition-colors"
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleAddToCart}
                    disabled={isLoading || isOutOfStock}
                    className={cn(
                      "h-7 px-2 text-xs",
                      isOutOfStock && "opacity-50 cursor-not-allowed"
                    )}
                    title={stockStatusText}
                  >
                    <ShoppingCart className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === "featured") {
    return (
      <Card
        className={cn(
          "group cursor-pointer relative overflow-hidden h-full flex flex-col",
          className
        )}
        disableBlockPadding={true}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="aspect-square bg-muted rounded-t-lg overflow-hidden relative">
          <Image
            src={product.images?.[0]?.url || "/assets/placeholder-image.jpeg"}
            alt={product.name}
            width={300}
            height={300}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Overlay Actions */}
          <div
            className={cn(
              "absolute inset-0 flex items-center justify-center transition-opacity duration-200",
              isHovered ? "opacity-100" : "opacity-0"
            )}
          >
            {/* Dark overlay background */}
            <div className="absolute inset-0 bg-black/40" />

            {/* Action buttons */}
            <div className="relative flex items-center gap-3">
              {showWishlist && (
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={handleWishlist}
                  className={cn(
                    "h-10 w-10 rounded-full bg-white/90 hover:bg-white shadow-lg transition-colors",
                    isInWishlistState && "bg-red-50 hover:bg-red-100"
                  )}
                >
                  <Heart
                    className={cn(
                      "h-4 w-4",
                      isInWishlistState
                        ? "text-red-500 fill-red-500"
                        : "text-red-500"
                    )}
                  />
                </Button>
              )}
              <Button
                variant="secondary"
                size="icon"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={cn(
                  "h-10 w-10 rounded-full bg-white/90 hover:bg-white shadow-lg",
                  isOutOfStock && "opacity-50 cursor-not-allowed"
                )}
                title={stockStatusText}
              >
                <ShoppingCart className="h-4 w-4 text-black" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                onClick={handleQuickView}
                className="h-10 w-10 rounded-full bg-white/90 hover:bg-white shadow-lg"
              >
                <Eye className="h-4 w-4 text-black" />
              </Button>
            </div>
          </div>
        </div>

        <CardContent className="px-4 pb-4 flex flex-col h-full">
          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="text-xs">
                {product.categories?.[0]?.name || "Uncategorized"}
              </Badge>
            </div>

            <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors cursor-pointer">
              {product.name}
            </h3>

            <p className="text-sm text-muted-foreground line-clamp-2">
              {product.description}
            </p>

            <div className="flex items-center justify-between">
              <Price
                price={product.discountPrice || product.price}
                originalPrice={
                  product.discountPrice ? product.price : undefined
                }
                size="lg"
                weight="semibold"
                showDiscount={true}
              />
            </div>
          </div>

          <div className="mt-auto space-y-2">
            <div className="flex items-center justify-between">
              <Button
                size="sm"
                onClick={handleAddToCart}
                disabled={isLoading || isOutOfStock}
                className={cn(
                  "flex-1",
                  isOutOfStock && "opacity-50 cursor-not-allowed"
                )}
              >
                {stockStatusText}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default variant
  return (
    <Card
      className={cn("group cursor-pointer h-full flex flex-col", className)}
      disableBlockPadding={true}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex-shrink-0 bg-muted rounded-t-lg overflow-hidden relative">
        <Image
          src={product.images?.[0]?.url || "/assets/placeholder-image.jpeg"}
          alt={product.name}
          width={300}
          height={300}
          className="block w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Overlay Actions */}
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center transition-opacity duration-200",
            isHovered ? "opacity-100" : "opacity-0"
          )}
        >
          {/* Dark overlay background */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Action buttons */}
          <div className="relative flex items-center gap-3">
            {showWishlist && (
              <Button
                variant="secondary"
                size="icon"
                onClick={handleWishlist}
                className={cn(
                  "h-10 w-10 rounded-full bg-white/90 hover:bg-white shadow-lg transition-colors",
                  isInWishlistState && "bg-red-50 hover:bg-red-100"
                )}
              >
                <Heart
                  className={cn(
                    "h-4 w-4",
                    isInWishlistState
                      ? "text-red-500 fill-red-500"
                      : "text-red-500"
                  )}
                />
              </Button>
            )}
            <Button
              variant="secondary"
              size="icon"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={cn(
                "h-10 w-10 rounded-full bg-white/90 hover:bg-white shadow-lg",
                isOutOfStock && "opacity-50 cursor-not-allowed"
              )}
              title={stockStatusText}
            >
              <ShoppingCart className="h-4 w-4 text-black" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              onClick={handleQuickView}
              className="h-10 w-10 rounded-full bg-white/90 hover:bg-white shadow-lg"
            >
              <Eye className="h-4 w-4 text-black" />
            </Button>
          </div>
        </div>
      </div>

      <CardContent className="px-4 pb-4 flex flex-col gap-2 h-full">
        <div className="flex-1 space-y-3">
          <Badge variant="secondary" className="text-xs">
            {product.categories?.[0]?.name || "Uncategorized"}
          </Badge>

          {/* <Link href={`/products/${product.id}`}> */}
          <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors cursor-pointer">
            {product.name}
          </h3>
          {/* </Link> */}

          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center justify-between">
            <Price
              price={product.discountPrice || product.price}
              originalPrice={product.discountPrice ? product.price : undefined}
              size="lg"
              weight="semibold"
              showDiscount={true}
            />
          </div>
        </div>

        <div className="mt-auto space-y-2">
          <div className="flex items-center justify-between">
            <Button
              size="sm"
              onClick={handleAddToCart}
              disabled={isLoading || isOutOfStock}
              className={cn(
                "flex-1",
                isOutOfStock && "opacity-50 cursor-not-allowed"
              )}
            >
              {stockStatusText}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
