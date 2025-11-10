"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Truck, CreditCard, Shield, Package } from "lucide-react";
import { Price } from "@/components/ui/price";
import { useCartStore } from "@/stores/cart-store";
import { cn, formatPrice } from "@/lib/utils";
import { CartItem } from "@/types/cart";

interface OrderSummaryProps {
  className?: string;
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
  items?: CartItem[];
}

export function OrderSummary({
  className,
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
          <CardTitle>Tổng quan đơn hàng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Giỏ hàng của bạn đang trống</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Tổng quan đơn hàng
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
                  {item.product.images && item.product.images.length > 0 ? (
                    <img
                      src={item.product.images[0].url}
                      alt={item.product.name}
                      className="w-full h-full object-cover rounded-md"
                    />
                  ) : (
                    <Package className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {item.product.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Qty: {item.quantity}
                  </p>
                </div>
                {item.product.discountPrice && item.product.discountPrice > 0 ? (
                  <div className="flex flex-col items-end">
                    <Price price={item.product.discountPrice * item.quantity} size="sm" className="text-primary font-semibold" />
                    <Price price={item.price * item.quantity} size="xs" className="text-muted-foreground line-through" />
                  </div>
                ) : (
                  <Price price={item.price * item.quantity} size="sm" />
                )}
              </div>
            ))}
          </div>
        )}

        {showItems && <Separator />}

        {/* Order Details */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Tạm tính</span>
            <Price price={subtotal} size="sm" />
          </div>

          {shipping > 0 ? (
            <div className="flex justify-between text-sm">
              <span>Vận chuyển</span>
              <Price price={shipping} size="sm" />
            </div>
          ) : (
            <div className="flex justify-between text-sm text-green-600">
              <span className="flex items-center gap-1">
                <Truck className="w-4 h-4" />
                Miễn phí vận chuyển
              </span>
              <span>Miễn phí</span>
            </div>
          )}

          {tax > 0 && (
            <div className="flex justify-between text-sm">
              <span>Thuế</span>
              <Price price={tax} size="sm" />
            </div>
          )}
        </div>

        <Separator />

        <div className="flex justify-between font-bold text-lg">
          <span>Tổng</span>
          <Price price={total} size="lg" weight="semibold" />
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
              Tiếp tục thanh toán
            </Button>

            {onContinueShopping && (
              <Button
                variant="outline"
                className="w-full"
                onClick={onContinueShopping}
              >
                Tiếp tục mua sắm
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
                <span>Thanh toán an toàn</span>
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
                <span>Thanh toán an toàn</span>
              </div>
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3" />
                <span>SSL mã hóa</span>
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
              Xóa giỏ hàng
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
