import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const priceVariants = cva("", {
  variants: {
    size: {
      sm: "text-sm",
      base: "text-base",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
      "3xl": "text-3xl",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
    color: {
      default: "text-foreground",
      muted: "text-muted-foreground",
      primary: "text-primary",
      destructive: "text-destructive",
      success: "text-green-600",
    },
  },
  defaultVariants: {
    size: "base",
    weight: "medium",
    color: "default",
  },
});

export interface PriceProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "color">,
    VariantProps<typeof priceVariants> {
  price: number;
  originalPrice?: number;
  showCurrency?: boolean;
  currency?: string;
  locale?: string;
  showDiscount?: boolean;
  discountPercentage?: number;
}

export function Price({
  price,
  originalPrice,
  showCurrency = true,
  currency = "đ",
  locale = "vi-VN",
  showDiscount = false,
  discountPercentage,
  size,
  weight,
  color,
  className,
  ...props
}: PriceProps) {
  const formattedPrice = formatPrice(price, {
    currency: showCurrency ? currency : undefined,
    locale,
    showCurrency,
  });

  const hasDiscount = originalPrice && originalPrice > price;
  const calculatedDiscountPercentage =
    discountPercentage ||
    (hasDiscount
      ? Math.round(((originalPrice! - price) / originalPrice!) * 100)
      : 0);

  return (
    <div className="flex items-center gap-2">
      <span
        className={cn(priceVariants({ size, weight, color }), className)}
        {...props}
      >
        {formattedPrice}
      </span>

      {hasDiscount && originalPrice && (
        <span className="text-sm text-muted-foreground line-through">
          {formatPrice(originalPrice, {
            currency: showCurrency ? currency : undefined,
            locale,
            showCurrency,
          })}
        </span>
      )}

      {showDiscount && calculatedDiscountPercentage > 0 && (
        <span className="absolute top-4 right-4 text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
          -{calculatedDiscountPercentage}%
        </span>
      )}
    </div>
  );
}
