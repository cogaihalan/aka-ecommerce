"use client";

import { useState, memo, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Glider from "react-glider";
import { Fancybox } from "@fancyapps/ui";

interface ProductImage {
  id: number;
  url: string;
  alt: string;
  primary: boolean;
}

interface ProductImageGalleryProps {
  images: ProductImage[];
  className?: string;
}

export const ProductImageGallery = memo(function ProductImageGallery({
  images,
  className,
}: ProductImageGalleryProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const mainGliderRef = useRef<any>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  // Initialize Fancybox when component mounts
  useEffect(() => {
    if (galleryRef.current) {
      Fancybox.bind(galleryRef.current, "[data-fancybox]", {
        // Enable keyboard navigation
        keyboard: {
          Escape: "close",
          Delete: "close",
          Backspace: "close",
          PageUp: "prev",
          PageDown: "next",
          ArrowRight: "next",
          ArrowLeft: "prev",
          ArrowUp: "prev",
          ArrowDown: "next",
        },
        // Close on backdrop click
        backdropClick: "close",
        // Ensure Fancybox renders above Dialog
        parentEl: document.body,
      });
    }

    // Cleanup Fancybox when component unmounts
    return () => {
      Fancybox.destroy();
    };
  }, [images]);

  // Sort images by primary and ensure primary image is first
  const sortedImages = [...images].sort((a, b) => {
    if (a.primary) return -1;
    if (b.primary) return 1;
    return a.id - b.id;
  });

  const handleSlideChange = useCallback((index: number) => {
    setCurrentSlide(index);
    if (mainGliderRef.current) {
      mainGliderRef.current.scrollItem(index);
    }
  }, []);

  const handlePrevious = useCallback(() => {
    const newIndex =
      currentSlide > 0 ? currentSlide - 1 : sortedImages.length - 1;
    setCurrentSlide(newIndex);
    if (mainGliderRef.current) {
      mainGliderRef.current.scrollItem("prev");
    }
  }, [currentSlide, sortedImages.length]);

  const handleNext = useCallback(() => {
    const newIndex =
      currentSlide < sortedImages.length - 1 ? currentSlide + 1 : 0;
    setCurrentSlide(newIndex);
    if (mainGliderRef.current) {
      mainGliderRef.current.scrollItem("next");
    }
  }, [currentSlide, sortedImages.length]);

  if (!images || images.length === 0) {
    return (
      <div
        className={cn(
          "bg-muted rounded-lg min-h-[300px] max-h-[500px] flex items-center justify-center",
          className
        )}
      >
        <div className="flex items-center justify-center h-full text-muted-foreground">
          Không có hình ảnh
        </div>
      </div>
    );
  }

  return (
    <div
      ref={galleryRef}
      className={cn("space-y-4 product-image-gallery", className)}
    >
      <div className="relative group touch-pan-x">
        <Glider
          ref={mainGliderRef}
          hasArrows={false}
          hasDots={false}
          slidesToShow={1}
          slidesToScroll={1}
          scrollLock={true}
          duration={0.5}
          draggable={true}
          dragVelocity={1.5}
          scrollLockDelay={100}
          rewind={false}
          onSlideVisible={(glider: any) => {
            if (glider && typeof glider.slide === "number") {
              setCurrentSlide(glider.slide);
            }
          }}
          className="glider-container touch-pan-x"
        >
          {sortedImages.map((image, index) => (
            <div key={image.id} className="glider-slide touch-pan-x">
              <div className="bg-muted rounded-lg overflow-hidden transform transition-all duration-300 ease-out relative group min-h-[300px] max-h-[500px] flex items-center justify-center touch-pan-x">
                <a
                  href={image.url}
                  data-fancybox="product-gallery"
                  data-caption={image.alt}
                  data-thumb={image.url}
                  className="w-full h-full flex items-center justify-center touch-pan-x"
                  draggable={false}
                >
                  <Image
                    src={image.url}
                    alt={image.alt}
                    width={600}
                    height={600}
                    className="max-w-full max-h-full object-contain transition-transform duration-500 hover:scale-105 pointer-events-none select-none"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
                    priority={index === 0}
                    draggable={false}
                  />
                </a>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 pointer-events-none">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-10 w-10 rounded-full bg-white/90 hover:bg-white shadow-lg pointer-events-auto"
                    aria-label="Open image in lightbox"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      // Trigger the Fancybox lightbox by clicking the anchor element
                      const anchorElement = e.currentTarget
                        .closest(".glider-slide")
                        ?.querySelector(
                          "a[data-fancybox]"
                        ) as HTMLAnchorElement;
                      if (anchorElement) {
                        anchorElement.click();
                      }
                    }}
                  >
                    <ZoomIn className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </Glider>

        {/* Navigation Arrows */}
        {sortedImages.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 h-8 rounded-full w-8 bg-white/90 hover:bg-white shadow-lg product-gallery-nav z-10"
              onClick={handlePrevious}
              disabled={currentSlide === 0}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 rounded-full w-8 bg-white/90 hover:bg-white shadow-lg product-gallery-nav z-10"
              onClick={handleNext}
              disabled={currentSlide >= sortedImages.length - 1}
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </>
        )}
      </div>

      {/* Thumbnail Images as Navigation Dots */}
      {sortedImages.length > 1 && (
        <div className="flex justify-center gap-2 flex-wrap">
          {sortedImages.map((image, index) => (
            <button
              key={image.id}
              onClick={() => handleSlideChange(index)}
              className={cn(
                "product-gallery-thumbnail transition-all duration-300 hover:scale-105 transform flex-shrink-0",
                // Desktop: thumbnail images
                "block md:w-16 md:h-16 md:rounded-lg overflow-hidden border-2",
                // Mobile: simple dots
                "w-3 h-3 rounded-full",
                currentSlide === index
                  ? "bg-primary active md:border-primary"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50 md:border-border md:bg-transparent"
              )}
              aria-label={`View image ${index + 1} of ${sortedImages.length}`}
              aria-pressed={currentSlide === index}
            >
              {/* Desktop: Show image */}
              <div className="hidden md:block w-full h-full">
                <Image
                  src={image.url}
                  alt={image.alt}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover transition-transform duration-300"
                  sizes="64px"
                />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
});
