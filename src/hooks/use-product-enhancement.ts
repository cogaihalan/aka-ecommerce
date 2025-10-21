import { useMemo, useDeferredValue } from "react";
import { Product } from "@/lib/api/types";

interface EnhancedProduct extends Product {
  inStock: boolean;
  stockCount: number;
}

export function useProductEnhancement(
  product: Product | null
): EnhancedProduct | null {
  const deferredProduct = useDeferredValue(product);

  return useMemo(() => {
    if (!deferredProduct) return null;

    return {
      ...deferredProduct,
      inStock: deferredProduct.variants[0].stock > 0,
      stockCount: deferredProduct.variants[0].stock,
    };
  }, [deferredProduct]);
}
