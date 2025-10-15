"use client";

import { useState, memo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Price } from "@/components/ui/price";
import { Star, Heart, Share2, Minus, Plus } from "lucide-react";
import { useAddToCart } from "@/hooks/use-add-to-cart";
import { useCart } from "@/hooks/use-cart";
import {
  useWishlistActions,
  useIsInWishlist,
  useWishlistAuthStatus,
} from "@/stores/wishlist-store";
import { cn, isProductOutOfStock, getStockStatusText } from "@/lib/utils";
import { Product } from "@/types/product";

interface ProductInfoProps {
  product: Product & {
    rating?: number;
    reviewCount?: number;
    features?: string[];
    inStock?: boolean;
    stockCount?: number;
    sizes?: string[];
    colors?: string[];
  };
  className?: string;
}

export const ProductInfo = memo(function ProductInfo({
  product,
  className,
}: ProductInfoProps) {
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();

  const {
    addToCart: handleAddToCart,
    isAdding,
    error,
  } = useAddToCart({
    onSuccess: (product, quantity) => {
      console.log(`Added ${quantity} x ${product.name} to cart`);
    },
    onError: (error) => {
      console.error("Add to cart error:", error);
    },
  });

  const { isInCart, getItemQuantity } = useCart();
  const {
    addItem: addToWishlist,
    removeItem: removeFromWishlist,
    isInWishlist,
  } = useWishlistActions();
  const isAuthenticated = useWishlistAuthStatus();
  const isInCartState = isInCart(product.id);
  const cartQuantity = getItemQuantity(product.id);
  const isWishlisted = isInWishlist(product.id);

  // Stock status checks
  const isOutOfStock = isProductOutOfStock(product);
  const stockStatusText = getStockStatusText(product);

  const onAddToCart = useCallback(() => {
    handleAddToCart(product, undefined, quantity);
  }, [handleAddToCart, product, quantity]);

  const handleBuyNow = useCallback(() => {
    onAddToCart();
    // Navigate to checkout
    window.location.href = "/checkout";
  }, [onAddToCart]);

  const handleWishlistToggle = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (!isAuthenticated) {
        router.push("/auth/sign-in");
        return;
      }

      if (isWishlisted) {
        removeFromWishlist(product.id);
      } else {
        addToWishlist(product);
      }
    },
    [
      isAuthenticated,
      isWishlisted,
      product,
      addToWishlist,
      removeFromWishlist,
      router,
    ]
  );

  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  }, [product.name, product.description]);

  const handleQuantityChange = useCallback(
    (value: string) => {
      const numValue = parseInt(value, 10);
      if (!isNaN(numValue) && numValue > 0) {
        const maxQuantity = product.stockCount || 10;
        setQuantity(Math.min(numValue, maxQuantity));
      }
    },
    [product.stockCount]
  );

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          "h-4 w-4",
          i < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : "text-muted-foreground"
        )}
      />
    ));
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Product Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary">
            {product.primaryCategory?.name || "Uncategorized"}
          </Badge>
          {product.brand && (
            <Badge variant="outline">{product.brand.name}</Badge>
          )}
          {product.featured && <Badge variant="default">Featured</Badge>}
        </div>

        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1">
              {renderStars(product.rating)}
            </div>
            <span className="text-sm text-muted-foreground">
              {product.rating} ({product.reviewCount || 0} reviews)
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-3 mb-4">
          <Price
            price={product.pricing?.basePrice || 0}
            originalPrice={product.pricing?.compareAtPrice}
            size="3xl"
            weight="bold"
          />
        </div>

        <p className="text-muted-foreground">{product.description}</p>
      </div>

      <Separator />

      {/* Product Options */}
      <div className="space-y-4">
        {/* Size Selection */}
        {product.sizes && product.sizes.length > 0 && (
          <div>
            <label className="text-sm font-medium mb-2 block">Size</label>
            <Select value={selectedSize} onValueChange={setSelectedSize}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                {product.sizes.map((size) => (
                  <SelectItem key={size} value={size}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Color Selection */}
        {product.colors && product.colors.length > 0 && (
          <div>
            <label className="text-sm font-medium mb-2 block">Color</label>
            <Select value={selectedColor} onValueChange={setSelectedColor}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select color" />
              </SelectTrigger>
              <SelectContent>
                {product.colors.map((color) => (
                  <SelectItem key={color} value={color}>
                    {color}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Quantity Selector */}
        <div>
          <label className="text-sm font-medium mb-2 block">Quantity</label>
          <div className="flex items-center gap-2 w-fit">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Input
              type="number"
              min="1"
              max={product.stockCount || 10}
              value={quantity}
              onChange={(e) => handleQuantityChange(e.target.value)}
              className="w-12 text-center font-medium [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => setQuantity(quantity + 1)}
              disabled={quantity >= (product.stockCount || 10)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <Separator />

      {/* Action Buttons */}
      <div className="space-y-3">
        <div className="flex gap-3">
          <Button
            size="lg"
            className={cn(
              "flex-1",
              isOutOfStock && "opacity-50 cursor-not-allowed"
            )}
            onClick={onAddToCart}
            disabled={isAdding || isOutOfStock}
          >
            {isOutOfStock
              ? stockStatusText
              : isInCartState
                ? `In Cart (${cartQuantity})`
                : "Add to Cart"}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleWishlistToggle}
            className={cn(
              isWishlisted &&
                "bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
            )}
          >
            <Heart className={cn("h-4 w-4", isWishlisted && "fill-current")} />
          </Button>
          <Button variant="outline" size="icon" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
          </Button>
        </div>

        <Button
          variant="secondary"
          size="lg"
          className={cn(
            "w-full",
            isOutOfStock && "opacity-50 cursor-not-allowed"
          )}
          onClick={handleBuyNow}
          disabled={isAdding || isOutOfStock}
        >
          {isOutOfStock ? stockStatusText : "Buy Now"}
        </Button>

        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>

      {/* Stock Status */}
      <div className="text-sm">
        {isOutOfStock ? (
          <span className="text-red-600">✗ {stockStatusText}</span>
        ) : (
          <span className="text-green-600">✓ {stockStatusText}</span>
        )}
      </div>
    </div>
  );
});
