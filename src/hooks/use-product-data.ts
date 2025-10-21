import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { storefrontCatalogService } from "@/lib/api/services/storefront/catalog";
import { Product } from "@/lib/api/types";

interface UseProductDataReturn {
  product: Product | null;
  loading: boolean;
  error: string | null;
  isPending: boolean;
}

export function useProductData(productId: string): UseProductDataReturn {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState<{
    product: Product | null;
    loading: boolean;
    error: string | null;
  }>({
    product: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        const productData = await storefrontCatalogService.getProduct(
          parseInt(productId)
        );

        if (!productData) {
          router.replace("/not-found");
          return;
        }

        startTransition(() => {
          setState({
            product: productData,
            loading: false,
            error: null,
          });
        });
      } catch (err) {
        setState((prev) => ({
          ...prev,
          error: "Failed to load product data",
          loading: false,
        }));
        console.error("Error fetching product:", err);
      }
    };

    fetchProductData();
  }, [productId, router]);

  return {
    product: state.product,
    loading: state.loading,
    error: state.error,
    isPending,
  };
}
