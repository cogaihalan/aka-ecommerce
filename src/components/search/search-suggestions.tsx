"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { useProductSearchSuggestions } from "@/hooks/use-product-search-suggestions";

interface SearchSuggestionsProps {
  onClose?: () => void;
  className?: string;
}

export function SearchSuggestions({
  onClose,
  className,
}: SearchSuggestionsProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    suggestions,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    clearSuggestions,
    debouncedTerm,
  } = useProductSearchSuggestions({
    debounceMs: 300,
    limit: 5,
    minLength: 2,
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        onClose?.();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleInputChange = (value: string) => {
    setSearchTerm(value);
    setIsOpen(value.length >= 2);
  };

  const handleInputFocus = () => {
    if (searchTerm.length >= 2) {
      setIsOpen(true);
    }
  };

  const handleViewMoreClick = () => {
    if (searchTerm.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      setIsOpen(false);
      clearSuggestions();
      onClose?.();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && searchTerm.trim()) {
      handleViewMoreClick();
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Tìm sản phẩm..."
          value={searchTerm}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-md text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
      </div>

      {/* Suggestions Dropdown */}
      {isOpen && (
        <Card
          disableBlockPadding={true}
          className="absolute top-full left-0 right-0 z-50 mt-1 shadow-lg rounded-lg overflow-hidden border animate-in fade-in-0 zoom-in-95 duration-200"
        >
          <CardContent className="p-0">
            {error && (
              <div className="p-4 text-sm text-destructive">
                <p>Không thể tải gợi ý. Vui lòng thử lại.</p>
              </div>
            )}

            {isLoading && (
              <div className="p-4 animate-in fade-in-0 duration-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-muted rounded-md animate-pulse"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded animate-pulse"></div>
                    <div className="h-3 bg-muted rounded w-2/3 animate-pulse"></div>
                  </div>
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-muted rounded-md animate-pulse"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded animate-pulse"></div>
                    <div className="h-3 bg-muted rounded w-1/2 animate-pulse"></div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-muted rounded-md animate-pulse"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded animate-pulse"></div>
                    <div className="h-3 bg-muted rounded w-3/4 animate-pulse"></div>
                  </div>
                </div>
                <div className="flex items-center justify-center mt-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Đang tìm kiếm...</span>
                  </div>
                </div>
              </div>
            )}

            {!error && !isLoading && suggestions.length > 0 && (
              <div className="max-h-80 overflow-y-auto animate-in fade-in-0 duration-200">
                {suggestions.map((product) => {
                  const primaryImage =
                    product.images?.find((img) => img.primary) ||
                    product.images?.[0];
                  const imageUrl =
                    primaryImage?.url || "/assets/placeholder-image.jpeg";

                  return (
                    <div
                      key={product.id}
                      className="p-4 overflow-hidden hover:bg-muted/50 border-b last:border-b-0 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {/* Product Image */}
                        <div className="w-12 h-12 bg-muted rounded-md overflow-hidden flex-shrink-0">
                          <Image
                            src={imageUrl}
                            alt={product.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/products/${product.id}`}
                            onClick={() => {
                              setIsOpen(false);
                              clearSuggestions();
                              onClose?.();
                            }}
                            className="block hover:text-primary transition-colors"
                          >
                            <h4 className="font-medium text-sm truncate">
                              {product.name}
                            </h4>
                          </Link>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm font-semibold">
                              {formatPrice(
                                product.discountPrice || product.price
                              )}
                            </span>
                            {!!product.discountPrice &&
                              product.discountPrice < product.price && (
                                <Badge variant="secondary" className="text-xs">
                                  Save{" "}
                                  {formatPrice(
                                    product.price - product.discountPrice
                                  )}
                                </Badge>
                              )}
                          </div>
                          {product.categories &&
                            product.categories.length > 0 && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {product.categories[0].name}
                              </p>
                            )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* View More Button */}
                <div className="p-4 border-t bg-muted/25">
                  <Button
                    variant="ghost"
                    onClick={handleViewMoreClick}
                    className="w-full justify-between text-sm"
                  >
                    {`Xem tất cả kết quả cho "${searchTerm}"`}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {!error &&
              !isLoading &&
              suggestions.length === 0 &&
              searchTerm.length >= 2 &&
              debouncedTerm === searchTerm && (
                <div className="p-4 text-center text-muted-foreground">
                  <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">
                    {`Không tìm thấy sản phẩm cho "${searchTerm}"`}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleViewMoreClick}
                    className="mt-2"
                  >
                    Tìm tất cả sản phẩm
                  </Button>
                </div>
              )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
