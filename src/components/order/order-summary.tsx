"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Truck, CreditCard, Shield, Package } from "lucide-react";
import { Price } from "@/components/ui/price";
import { useCartStore } from "@/stores/cart-store";
import { cn } from "@/lib/utils";

interface OrderSummaryProps {
  className?: string;
  showPromoCode?: boolean;
  showShippingInfo?: boolean;
  showSecurityBadges?: boolean;
  showActionButtons?: boolean;
  showClearCart?: boolean;
  onCheckout?: () => void;
  onContinueShopping?: () => void;
  // For checkout page customization
  customShippingCost?: number;
  customTax?: number;
  showItems?: boolean;
  items?: Array<{
    id: string;
    name: string;
    image?: string;
    price: number;
    quantity: number;
  }>;
}

export function OrderSummary({
  className,
  showPromoCode = true,
  showShippingInfo = true,
  showSecurityBadges = true,
  showActionButtons = true,
  showClearCart = false,
  onCheckout,
  onContinueShopping,
  customShippingCost,
  customTax,
  showItems = true,
  items: customItems,
}: OrderSummaryProps) {
  const {
    items: cartItems,
    getSubtotal,
    getShipping,
    getTax,
    getTotal,
    getTotalItems,
    clearCart,
  } = useCartStore();

  // Use custom values if provided, otherwise use cart values
  const items = customItems || cartItems;
  const subtotal = getSubtotal();
  const shipping =
    customShippingCost !== undefined ? customShippingCost : getShipping();
  const tax = customTax !== undefined ? customTax : getTax();
  const total = getTotal();
  const itemCount = getTotalItems();

  if (items.length === 0) {
    return (
      <Card className={cn("", className)}>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Your cart is empty</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Order Summary
          <Badge variant="secondary">
            {itemCount} item{itemCount !== 1 ? "s" : ""}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Items List */}
        {showItems && (
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-md"
                    />
                  ) : (
                    <Package className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Qty: {item.quantity}
                  </p>
                </div>
                <p className="text-sm font-medium">
                  {(item.price * item.quantity).toLocaleString()} VND
                </p>
              </div>
            ))}
          </div>
        )}

        {showItems && <Separator />}

        {/* Order Details */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <Price price={subtotal} size="sm" />
          </div>

          {shipping > 0 ? (
            <div className="flex justify-between text-sm">
              <span>Shipping</span>
              <Price price={shipping} size="sm" />
            </div>
          ) : (
            <div className="flex justify-between text-sm text-green-600">
              <span className="flex items-center gap-1">
                <Truck className="w-4 h-4" />
                Free Shipping
              </span>
              <span>Free</span>
            </div>
          )}

          <div className="flex justify-between text-sm">
            <span>Tax</span>
            <Price price={tax} size="sm" />
          </div>
        </div>

        <Separator />

        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <Price price={total} size="lg" weight="bold" />
        </div>

        {/* Action Buttons */}
        {showActionButtons && (
          <div className="space-y-2">
            <Button
              className="w-full"
              size="lg"
              onClick={onCheckout}
              disabled={items.length === 0}
            >
              Proceed to Checkout
            </Button>

            {onContinueShopping && (
              <Button
                variant="outline"
                className="w-full"
                onClick={onContinueShopping}
              >
                Continue Shopping
              </Button>
            )}
          </div>
        )}

        {/* Shipping Information */}
        {showShippingInfo && (
          <div className="pt-4 border-t">
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4" />
                <span>
                  {shipping > 0
                    ? "Free shipping on orders over 1,000,000 VND"
                    : "Free shipping applied"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>Secure checkout</span>
              </div>
            </div>
          </div>
        )}

        {/* Security Badges */}
        {showSecurityBadges && (
          <div className="pt-4 border-t">
            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <CreditCard className="w-3 h-3" />
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3" />
                <span>SSL Encrypted</span>
              </div>
            </div>
          </div>
        )}

        {/* Clear Cart Button */}
        {showClearCart && (
          <div className="pt-4 border-t">
            <Button
              variant="destructive"
              size="sm"
              className="w-full"
              onClick={() => clearCart()}
            >
              Clear Cart
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
