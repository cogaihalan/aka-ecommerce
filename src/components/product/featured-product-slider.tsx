"use client";

import { useState, useRef, useEffect } from "react";
import Glider from "react-glider";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FeaturedProductCard } from "./featured-product-card";
import { cn } from "@/lib/utils";
import { Product } from "@/types/product";

interface FeaturedProductSliderProps {
  products: Product[];
  title?: string;
  showViewAll?: boolean;
  viewAllHref?: string;
  className?: string;
}

export function FeaturedProductSlider({
  products,
  title = "Featured Products",
  showViewAll = true,
  viewAllHref = "/products",
  className,
}: FeaturedProductSliderProps) {
  const gliderRef = useRef<any>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const settings = {
    slidesToShow: 3,
    slidesToScroll: 1,
    itemWidth: 300,
    duration: 0.5,
    draggable: true,
    dragVelocity: 1.5,
    scrollLock: true,
    scrollLockDelay: 100,
    rewind: false,
    arrows: {
      prev: ".glider-prev",
      next: ".glider-next",
    },
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          itemWidth: 280,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          itemWidth: 300,
        },
      },
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
          itemWidth: 300,
        },
      },
      {
        breakpoint: 1536,
        settings: {
          slidesToShow: 4,
          itemWidth: 300,
        },
      },
    ],
  };

  const handlePrevious = () => {
    if (gliderRef.current) {
      gliderRef.current.scrollItem("prev");
    }
  };

  const handleNext = () => {
    if (gliderRef.current) {
      gliderRef.current.scrollItem("next");
    }
  };

  const handleSlideChange = (event: any) => {
    setCurrentSlide(event.detail.slide);
  };

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
        {showViewAll && (
          <Button variant="outline" asChild>
            <a href={viewAllHref}>
              View All
              <ChevronRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        )}
      </div>

      {/* Slider Container */}
      <div className="relative group">
        {/* Navigation Arrows */}
        <div className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 hidden lg:block">
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm border shadow-lg hover:bg-background transition-all duration-200 opacity-0 group-hover:opacity-100"
            onClick={handlePrevious}
            disabled={currentSlide === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>

        <div className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 hidden lg:block">
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm border shadow-lg hover:bg-background transition-all duration-200 opacity-0 group-hover:opacity-100"
            onClick={handleNext}
            disabled={currentSlide >= products.length - 3}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Glider Container */}
        <div className="glider-container">
          <Glider
            ref={gliderRef}
            className="glider"
            hasArrows={false}
            hasDots={false}
            {...settings}
            onSlideVisible={handleSlideChange}
          >
            {products.map((product) => (
              <div key={product.id} className="px-3">
                <div
                  className={cn(
                    "transform transition-all duration-300 ease-out",
                    isLoaded
                      ? "translate-y-0 opacity-100"
                      : "translate-y-4 opacity-0"
                  )}
                  style={{
                    transitionDelay: `${Math.random() * 200}ms`,
                  }}
                >
                  <FeaturedProductCard product={product} />
                </div>
              </div>
            ))}
          </Glider>
        </div>

        {/* Mobile Navigation */}
        <div className="flex justify-center gap-2 mt-6 lg:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevious}
            disabled={currentSlide === 0}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={currentSlide >= products.length - 1}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
