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
import { useAuth } from "@/hooks/use-auth";

export default function CartPage() {
  const {
    items: cartItems,
    isLoading: cartLoading,
    error,
    clearError,
    validateCart,
  } = useCart();

  const { user: authUser } = useAuth();
  console.log(authUser);

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
          <h1 className="text-3xl font-bold mb-2">Shopping Cart</h1>
          <p className="text-muted-foreground">Loading your cart...</p>
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
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-muted-foreground mb-6">
          Looks like you haven't added any items to your cart yet.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/products">Continue Shopping</Link>
          </Button>
          <Button variant="outline" asChild size="lg">
            <Link href="/">Back to Home</Link>
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
          <h1 className="text-3xl font-bold mb-2">Shopping Cart</h1>
          <p className="text-muted-foreground">
            Review your items and proceed to checkout
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/products">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continue Shopping
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
            showPromoCode={true}
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
        <h3 className="font-semibold mb-2">Need Help?</h3>
        <p className="text-sm text-muted-foreground mb-4">
          If you have any questions about your order or need assistance, our
          customer service team is here to help.
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/contact">Contact Support</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/help">Help Center</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
