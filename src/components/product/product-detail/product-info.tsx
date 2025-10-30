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
import { Heart, Share2, Minus, Plus, Loader2 } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import {
  useWishlistActions,
  useWishlistAuthStatus,
  useIsInWishlist,
} from "@/stores/wishlist-store";
import { cn, isProductOutOfStock, getStockStatusText } from "@/lib/utils";
import { Product } from "@/types";

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

  const { addToCart, isProductLoading, error, isInCart, getItemQuantity } =
    useCart();
  const { addItem: addToWishlist, removeItem: removeFromWishlist } =
    useWishlistActions();
  const isAuthenticated = useWishlistAuthStatus();
  const isInCartState = isInCart(product.id);
  const isWishlisted = useIsInWishlist(product.id);

  // Stock status checks
  const isOutOfStock = isProductOutOfStock(product);
  const stockStatusText = getStockStatusText(product);

  const onAddToCart = useCallback(async () => {
    await addToCart(product, quantity);
  }, [addToCart, product, quantity]);

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

  return (
    <div className={cn("space-y-6", className)}>
      {/* Product Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary">
            {product.categories[0]?.name || "Chưa phân loại"}
          </Badge>
        </div>

        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

        {/* Price */}
        <div className="flex items-center gap-3 mb-4">
          <Price
            price={product.discountPrice || product.price}
            originalPrice={product.discountPrice ? product.price : undefined}
            size="3xl"
            weight="semibold"
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
            <label className="text-sm font-medium mb-2 block">Kích cỡ</label>
            <Select value={selectedSize} onValueChange={setSelectedSize}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn kích cỡ" />
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
            <label className="text-sm font-medium mb-2 block">Màu sắc</label>
            <Select value={selectedColor} onValueChange={setSelectedColor}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn màu sắc" />
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
          <label className="text-sm font-medium mb-2 block">Số lượng</label>
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
            disabled={isProductLoading(product.id) || isOutOfStock}
          >
            {isProductLoading(product.id) ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Đang thêm...
              </>
            ) : isOutOfStock ? (
              stockStatusText
            ) : isInCartState ? (
              `Trong giỏ (${getItemQuantity(product.id)})`
            ) : (
              "Thanh toán"
            )}
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
          disabled={isProductLoading(product.id) || isOutOfStock}
        >
          {isProductLoading(product.id) ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Đang xử lý...
            </>
          ) : isOutOfStock ? (
            stockStatusText
          ) : (
            "Mua ngay"
          )}
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
