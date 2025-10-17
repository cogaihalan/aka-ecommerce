"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, ShoppingCart, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  useWishlistItems,
  useWishlistActions,
  useWishlistItemCount,
  useWishlistTotalValue,
  useWishlistStore,
  useWishlistAuthStatus,
} from "@/stores/wishlist-store";
import { useAddToCart } from "@/hooks/use-add-to-cart";
import { useCart } from "@/hooks/use-cart";

export default function WishlistPage() {
  const router = useRouter();
  const allWishlistItems = useWishlistItems();
  const currentUserId = useWishlistStore((state) => state.currentUserId);
  const isAuthenticated = useWishlistAuthStatus();
  const { removeItem: removeFromWishlist, clearWishlist } =
    useWishlistActions();
  const itemCount = useWishlistItemCount();
  const totalValue = useWishlistTotalValue();

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/sign-in");
    }
  }, [isAuthenticated, router]);

  // Filter items by current user
  const wishlistItems = allWishlistItems.filter(
    (item) => !currentUserId || item.userId === currentUserId
  );

  const { addToCart, isAdding } = useAddToCart({
    onSuccess: (product, quantity) => {
      console.log(`Added ${quantity} x ${product.name} to cart`);
    },
    onError: (error) => {
      console.error("Add to cart error:", error);
    },
  });

  const { isInCart, getItemQuantity } = useCart();

  const handleAddToCart = (product: any) => {
    addToCart(product, undefined, 1);
  };

  const handleRemoveFromWishlist = (productId: number) => {
    removeFromWishlist(productId);
  };

  const handleClearWishlist = () => {
    clearWishlist();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Wishlist</h1>
          <p className="text-muted-foreground">
            {itemCount > 0
              ? `${itemCount} item${itemCount === 1 ? "" : "s"} saved • Total value: $${totalValue.toFixed(2)}`
              : "Your saved items and favorites"}
          </p>
        </div>
        {itemCount > 0 && (
          <Button
            variant="outline"
            onClick={handleClearWishlist}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        )}
      </div>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Your wishlist is empty</h3>
          <p className="text-muted-foreground mb-6">
            Save items you love to your wishlist by clicking the heart icon
          </p>
          <Link href="/products">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Start Shopping
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((item) => {
            const isInCartState = isInCart(item.product.id);
            const cartQuantity = getItemQuantity(item.product.id);

            return (
              <Card
                disableBlockPadding
                key={item.id}
                className="group h-full flex flex-col"
              >
                <Link href={`/products/${item.product.id}`}>
                  <div className="aspect-square bg-muted rounded-t-lg relative overflow-hidden">
                    <Image
                      src={
                        item.product.images?.[0]?.url ||
                        "/assets/placeholder-image.jpeg"
                      }
                      alt={item.product.images?.[0]?.alt || item.product.name}
                      width={300}
                      height={300}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Remove button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleRemoveFromWishlist(item.product.id);
                      }}
                      className="absolute top-2 right-2 bg-white/90 hover:bg-white text-destructive hover:text-destructive shadow-lg"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Link>

                <CardContent className="p-4 flex flex-col h-full">
                  <div className="flex-1 space-y-3">
                    {/* Category badge */}
                    <Badge variant="secondary" className="text-xs w-fit">
                      {item.product.primaryCategory?.name || "Uncategorized"}
                    </Badge>

                    {/* Product name */}
                    <Link href={`/products/${item.product.id}`}>
                      <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors cursor-pointer">
                        {item.product.name}
                      </h3>
                    </Link>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {item.product.description}
                    </p>

                    {/* Price */}
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold">
                        ${item.product.pricing?.basePrice}
                      </span>
                      {item.product.pricing?.compareAtPrice &&
                        item.product.pricing?.compareAtPrice >
                          item.product.pricing?.basePrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            ${item.product.pricing.compareAtPrice}
                          </span>
                        )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-auto space-y-2">
                    <Button
                      size="sm"
                      onClick={() => handleAddToCart(item.product)}
                      disabled={isAdding || item.product.status !== "active"}
                      className="w-full"
                    >
                      {isInCartState ? (
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
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
