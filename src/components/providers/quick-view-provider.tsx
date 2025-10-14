"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  memo,
  lazy,
  Suspense,
} from "react";
import { Product } from "@/lib/api/types";

// Lazy load the modal for better performance
const QuickViewModal = lazy(() =>
  import("@/components/product/quick-view/quick-view-modal").then((module) => ({
    default: module.QuickViewModal,
  }))
);

interface QuickViewContextType {
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;
  isOpen: boolean;
  product: Product | null;
}

const QuickViewContext = createContext<QuickViewContextType | undefined>(
  undefined
);

interface QuickViewProviderProps {
  children: ReactNode;
}

export const QuickViewProvider = memo(function QuickViewProvider({
  children,
}: QuickViewProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);

  const openQuickView = useCallback((product: Product) => {
    setProduct(product);
    setIsOpen(true);
  }, []);

  const closeQuickView = useCallback(() => {
    setIsOpen(false);
    setProduct(null);
  }, []);

  return (
    <QuickViewContext.Provider
      value={{
        openQuickView,
        closeQuickView,
        isOpen,
        product,
      }}
    >
      {children}
      {isOpen && (
        <QuickViewModal
          product={product}
          isOpen={isOpen}
          onClose={closeQuickView}
        />
      )}
    </QuickViewContext.Provider>
  );
});

export function useQuickView() {
  const context = useContext(QuickViewContext);
  if (context === undefined) {
    throw new Error("useQuickView must be used within a QuickViewProvider");
  }
  return context;
}
