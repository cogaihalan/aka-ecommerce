"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Trash2, ArrowLeft, Loader2 } from "lucide-react";
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
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/utils";

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

  const { addToCart, isProductLoading, isInCart, getItemQuantity } = useCart();

  const handleAddToCart = async (product: any) => {
    await addToCart(product, 1);
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
          <h1 className="text-3xl font-bold mb-2">Danh sách yêu thích</h1>
          <p className="text-muted-foreground">
            {itemCount > 0
              ? `Đã lưu ${itemCount} mục • Tổng giá trị: ${formatPrice(totalValue)}`
              : "Sản phẩm đã lưu và mục yêu thích của bạn"}
          </p>
        </div>
        {itemCount > 0 && (
          <Button
            variant="outline"
            onClick={handleClearWishlist}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Xóa tất cả
          </Button>
        )}
      </div>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            Danh sách yêu thích trống
          </h3>
          <p className="text-muted-foreground mb-6">
            Lưu sản phẩm bạn thích bằng cách bấm vào biểu tượng trái tim
          </p>
          <Link href="/products">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Bắt đầu mua sắm
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
                      alt={item.product.name}
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
                      {item.product.categories
                        ? item.product.categories[0].name
                        : "Chưa phân loại"}
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
                        {formatPrice(
                          item.product.discountPrice || item.product.price
                        )}
                      </span>
                      {item.product.discountPrice &&
                        item.product.discountPrice > item.product.price && (
                          <span className="text-sm text-muted-foreground line-through">
                            {formatPrice(item.product.price)}
                          </span>
                        )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-auto space-y-2">
                    <Button
                      size="sm"
                      onClick={() => handleAddToCart(item.product)}
                      disabled={
                        isProductLoading(item.product.id) ||
                        item.product.stock <= 0
                      }
                      className="w-full"
                    >
                      {isProductLoading(item.product.id) ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Đang thêm...
                        </>
                      ) : isInCartState ? (
                        <>
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          {`Trong giỏ (${cartQuantity})`}
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Thêm vào giỏ
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
