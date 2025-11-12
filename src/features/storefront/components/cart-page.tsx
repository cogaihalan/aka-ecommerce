"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingBag, ArrowLeft, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/hooks/use-cart";
import { CartItem } from "@/components/cart";
import { OrderSummary } from "@/components/order/order-summary";

export default function CartPage() {
  const {
    items: cartItems,
    isLoading: cartLoading,
    error,
    clearError,
    validateCart,
  } = useCart();

  // Validate cart on mount
  useEffect(() => {
    const validation = validateCart();
    if (!validation.isValid) {
      console.warn("Cart validation errors:", validation.errors);
    }
  }, [validateCart]);

  // Clear errors after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  if (cartLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Giỏ hàng</h1>
          <p className="text-muted-foreground">Đang tải giỏ hàng...</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="flex gap-4">
                  <Skeleton className="w-20 h-20 rounded-md" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div>
            <Skeleton className="h-96 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-4">Giỏ hàng của bạn đang trống</h1>
        <p className="text-muted-foreground mb-6">
          Có vẻ như bạn chưa thêm bất kỳ sản phẩm nào vào giỏ hàng của bạn.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/products">Tiếp tục mua sắm</Link>
          </Button>
          <Button variant="outline" asChild size="lg">
            <Link href="/">Quay về trang chủ</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Giỏ hàng</h1>
          <p className="text-muted-foreground">
            Xem lại các sản phẩm trong giỏ hàng và tiến hành thanh toán
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/products">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Tiếp tục mua sắm
          </Link>
        </Button>
      </div>

      {/* Cart Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              variant="default"
              showRemoveButton={true}
              showQuantityControls={true}
            />
          ))}
        </div>

        {/* Order Summary */}
        <div>
          <OrderSummary
            showShippingInfo={true}
            showSecurityBadges={true}
            showActionButtons={true}
            showClearCart={true}
            onCheckout={() => {
              // Navigate to checkout
              window.location.href = "/checkout";
            }}
            onContinueShopping={() => {
              // Navigate to products
              window.location.href = "/products";
            }}
          />
        </div>
      </div>

      {/* Additional Info */}
      <div className="bg-muted/50 rounded-lg p-6">
        <h3 className="font-semibold mb-2">Cần Giúp Đỡ?</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Nếu bạn có bất kỳ câu hỏi nào về đơn hàng của bạn hoặc cần sự trợ
          giúp, nhóm dịch vụ khách hàng của chúng tôi sẽ giúp bạn.
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/">Liên hệ hỗ trợ</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/">Trung tâm hỗ trợ</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
