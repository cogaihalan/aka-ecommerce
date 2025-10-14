"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Price } from "@/components/ui/price";
import { Star, ShoppingCart, Heart, Eye } from "lucide-react";
import { useAddToCart } from "@/hooks/use-add-to-cart";
import { useCart } from "@/hooks/use-cart";
import { useQuickView } from "@/components/providers/quick-view-provider";
import {
  useWishlistActions,
  useIsInWishlist,
  useWishlistAuthStatus,
} from "@/stores/wishlist-store";
import { cn, isProductOutOfStock, getStockStatusText } from "@/lib/utils";

import { Product } from "@/types/product";

interface FeaturedProductCardProps {
  product: Product;
  className?: string;
}

export function FeaturedProductCard({
  product,
  className,
}: FeaturedProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  const { addToCart, isAdding, error } = useAddToCart({
    onSuccess: (product, quantity) => {
      console.log(`Added ${quantity} x ${product.name} to cart`);
    },
    onError: (error) => {
      console.error("Add to cart error:", error);
    },
  });

  const { isInCart, getItemQuantity } = useCart();
  const { openQuickView } = useQuickView();
  const { addItem: addToWishlist, removeItem: removeFromWishlist } =
    useWishlistActions();
  const isAuthenticated = useWishlistAuthStatus();
  const isInCartState = isInCart(product.id);
  const cartQuantity = getItemQuantity(product.id);
  const isInWishlistState = useIsInWishlist(product.id);

  // Stock status checks
  const isOutOfStock = isProductOutOfStock(product);
  const stockStatusText = getStockStatusText(product);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, undefined, 1);
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

  return (
    <Card
      className={cn("group cursor-pointer relative overflow-hidden", className)}
      isProductCard={true}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="aspect-square bg-muted rounded-t-lg overflow-hidden relative">
        <Image
          src={product.images?.[0]?.url || "/assets/placeholder-image.jpeg"}
          alt={product.images?.[0]?.alt || product.name}
          width={300}
          height={300}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
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
            <Button
              variant="secondary"
              size="icon"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={cn(
                "h-10 w-10 rounded-full bg-white/90 hover:bg-white shadow-lg",
                isOutOfStock && "opacity-50 cursor-not-allowed"
              )}
              title={isOutOfStock ? stockStatusText : "Add to cart"}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              onClick={handleQuickView}
              className="h-10 w-10 rounded-full bg-white/90 hover:bg-white shadow-lg"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <CardContent className="px-4 pb-4 flex flex-col h-full">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${
                  star <= Math.floor(product.averageRating || 0)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted-foreground"
                }`}
              />
            ))}
          </div>

          <Link href={`/products/${product.id}`}>
            <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors cursor-pointer">
              {product.name}
            </h3>
          </Link>

          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center justify-between">
            <Price
              price={product.pricing.basePrice}
              originalPrice={product.pricing.compareAtPrice}
              size="lg"
              weight="bold"
              showDiscount={true}
            />
          </div>
        </div>

        <div className="mt-auto space-y-2">
          <Button
            size="sm"
            onClick={handleAddToCart}
            disabled={isAdding || isOutOfStock}
            className={cn(
              "w-full",
              isOutOfStock && "opacity-50 cursor-not-allowed"
            )}
          >
            {isOutOfStock ? (
              <>
                <ShoppingCart className="h-4 w-4 mr-2" />
                {stockStatusText}
              </>
            ) : isInCartState ? (
              <>
                <ShoppingCart className="h-4 w-4 mr-2" />
                In Cart ({cartQuantity})
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </>
            )}
          </Button>

          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
