"use client";

import { memo, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Product } from "@/types";
import {
  ProductImageGallery,
  ProductInfo,
} from "@/components/product/product-detail";
import { useI18n } from "@/components/providers/i18n-provider";

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QuickViewModal = memo(function QuickViewModal({
  product,
  isOpen,
  onClose,
}: QuickViewModalProps) {
  const { t } = useI18n();
  if (!product) return null;

  // Handle dialog close with Fancybox check
  const handleDialogClose = useCallback(
    (open: boolean) => {
      // Check if Fancybox is currently open
      const fancyboxContainer = document.querySelector(".fancybox__container");
      if (fancyboxContainer && !open) {
        // If Fancybox is open, don't close the dialog
        return;
      }
      onClose();
    },
    [onClose]
  );

  // Prepare images for the gallery
  const galleryImages =
    product.images?.map((img) => ({
      id: img.id,
      url: img.url,
      alt: product.name,
      primary: img.primary || false,
    })) || [];

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogContent className="h-auto overflow-auto max-h-[90vh] p-0 sm:w-[90%] sm:max-w-7xl">
        <DialogHeader className="px-4 py-2 flex-shrink-0 sticky top-0 bg-background z-20 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg lg:text-2xl font-bold">
              {product.name}
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 rounded-sm hover:bg-accent hover:text-accent-foreground"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">{t("common.close")}</span>
            </Button>
          </div>
        </DialogHeader>

        <div className="flex flex-col gap-6 px-4 lg:px-0 pb-4 pt-0 lg:flex-row overflow-auto">
          {/* Product Gallery - Flexible height to accommodate different image ratios */}
          <div className="lg:w-1/2 lg:pl-4 overflow-hidden">
            <ProductImageGallery images={galleryImages} />
          </div>

          {/* Product Info - Scrollable */}
          <div className="lg:w-1/2 overflow-y-auto lg:pr-4 overflow-x-hidden">
            <ProductInfo product={product} />

            {/* Additional Quick View Features */}
            <div className="mt-6 space-y-4">
              {/* View Full Details Link */}
              <div className="pt-4">
                <Link href={`/products/${product.id}`}>
                  <Button variant="outline" className="w-full">
                    {t("product.viewFullDetails")}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});
