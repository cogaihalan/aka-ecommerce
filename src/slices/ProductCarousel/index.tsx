"use client";
import React, { FC, useState, useEffect, useCallback } from "react";
import { isFilled } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";
import { AnimatedContainer } from "@/components/ui/animated-container";
import { GliderContainer } from "@/components/ui/glider-container";
import { ProductCard } from "@/components/product";
import { ProductCardSkeleton } from "@/components/product/product-card-skeleton";
import { storefrontCatalogService } from "@/lib/api/services/storefront/catalog";
import type { Product } from "@/types/product";
import { cn } from "@/lib/utils";

export type ProductCarouselProps = SliceComponentProps<any>;

const ProductCarousel: FC<ProductCarouselProps> = ({ slice }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const gliderRef = React.useRef<any>(null);

  // Configuration from slice
  const productCount = slice.primary.productCount || 10;
  const itemsPerView = slice.primary.itemsPerView || 3;
  const showNavigation = slice.primary.showNavigation !== false;
  const showDots = slice.primary.showDots !== false;

  // Fetch products from API
  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await storefrontCatalogService.getProducts({
        page: 1,
        size: productCount,
      });

      setProducts(response.items || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch products");
      console.error("Error fetching products:", err);
    } finally {
      setIsLoading(false);
    }
  }, [productCount]);

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Loading state
  if (!isLoading) {
    return (
      <section
        data-slice-type={slice.slice_type}
        data-slice-variation={slice.variation}
        className="py-16 px-4"
      >
        <div className="mx-auto max-w-7xl">
          {/* Header Skeleton */}
          {(isFilled.richText(slice.primary.title) ||
            isFilled.richText(slice.primary.subtitle)) && (
            <div className="text-center mb-12">
              <div className="h-12 bg-muted rounded-lg w-96 mx-auto mb-4 animate-pulse"></div>
              <div className="h-6 bg-muted rounded-lg w-64 mx-auto animate-pulse"></div>
            </div>
          )}

          {/* Product Cards Skeleton Grid */}
          <div className={cn(
            "grid gap-6",
            itemsPerView === 1 && "grid-cols-1",
            itemsPerView === 2 && "grid-cols-1 md:grid-cols-2",
            itemsPerView === 3 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
            itemsPerView === 4 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          )}>
            {Array.from({ length: itemsPerView }).map((_, index) => (
              <ProductCardSkeleton key={index} variant="default" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section
        data-slice-type={slice.slice_type}
        data-slice-variation={slice.variation}
        className="py-16 px-4"
      >
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-destructive mb-4">Error loading products: {error}</p>
            <button
              onClick={fetchProducts}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  // No products state
  if (products.length === 0) {
    return (
      <section
        data-slice-type={slice.slice_type}
        data-slice-variation={slice.variation}
        className="py-16 px-4"
      >
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-muted-foreground">No products available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="py-16 px-4"
    >
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        {(isFilled.richText(slice.primary.title) ||
          isFilled.richText(slice.primary.subtitle)) && (
          <AnimatedContainer
            animation="slideUp"
            delay={0}
            className="text-center mb-12"
          >
            {isFilled.richText(slice.primary.title) && (
              <div className="text-4xl font-bold mb-4">
                <PrismicRichText
                  field={slice.primary.title}
                  components={{
                    heading1: ({ children }) => (
                      <h1 className="m-0">{children}</h1>
                    ),
                    heading2: ({ children }) => (
                      <h2 className="m-0">{children}</h2>
                    ),
                    heading3: ({ children }) => (
                      <h3 className="m-0">{children}</h3>
                    ),
                    heading4: ({ children }) => (
                      <h4 className="m-0">{children}</h4>
                    ),
                    heading5: ({ children }) => (
                      <h5 className="m-0">{children}</h5>
                    ),
                    heading6: ({ children }) => (
                      <h6 className="m-0">{children}</h6>
                    ),
                  }}
                />
              </div>
            )}
            {isFilled.richText(slice.primary.subtitle) && (
              <div className="text-lg text-muted-foreground max-w-2xl mx-auto">
                <PrismicRichText
                  field={slice.primary.subtitle}
                  components={{
                    paragraph: ({ children }) => (
                      <p className="m-0">{children}</p>
                    ),
                  }}
                />
              </div>
            )}
          </AnimatedContainer>
        )}

        {/* Product Carousel */}
        <GliderContainer
          ref={gliderRef}
          settings={{
            hasArrows: showNavigation,
            hasDots: showDots,
            slidesToShow: itemsPerView,
            slidesToScroll: 1,
            responsive: [
              {
                breakpoint: 1024,
                settings: {
                  slidesToShow: Math.min(itemsPerView, 3),
                },
              },
              {
                breakpoint: 768,
                settings: {
                  slidesToShow: Math.min(itemsPerView, 2),
                },
              },
              {
                breakpoint: 480,
                settings: {
                  slidesToShow: 1,
                },
              },
            ],
          }}
          className="product-carousel"
        >
          {products.map((product, index) => (
              <AnimatedContainer
              key={product.id}
                animation="scaleIn"
                delay={200 + index * 100}
              className="h-full"
            >
              <ProductCard
                product={product}
                variant="default"
                className="h-full"
              />
            </AnimatedContainer>
          ))}
        </GliderContainer>
      </div>
    </section>
  );
};

export default ProductCarousel;
