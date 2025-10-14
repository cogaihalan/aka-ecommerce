"use client";

import { memo } from "react";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { SlideComponentProps } from "./types";

export const SlideComponent = memo(
  ({
    slide,
    slideIndex,
    currentSlide,
    isAnimating,
    isLoaded,
    loadedImages,
    imageErrors,
  }: SlideComponentProps) => {
    const imageUrl = slide.image || "/assets/placeholder-banner.png";
    const isImageLoaded = loadedImages.has(slide.image);
    const hasImageError = imageErrors.has(slide.image);
    const fallbackImage = "/assets/placeholder-banner.png";

    return (
      <div className="h-full">
        <div className="relative h-full flex items-center">
          {/* Background Image */}
          <div
            className={cn(
              "absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-1000",
              !isImageLoaded && !hasImageError && "opacity-0",
              isImageLoaded && "opacity-100"
            )}
            style={{
              backgroundImage: `url(${hasImageError ? fallbackImage : imageUrl})`,
              transform:
                slideIndex === currentSlide ? "scale(1.05)" : "scale(1.0)",
            }}
          />

          {/* Image loading placeholder */}
          {!isImageLoaded && !hasImageError && (
            <div className="absolute inset-0 z-0 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse" />
          )}

          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/5 z-10" />

          {/* Gradient overlay for better text contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-black/50 z-20" />

          {/* Content */}
          <div className="relative z-30 container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 items-center max-w-7xl mx-auto">
              {/* Text Content */}
              <div
                className={cn(
                  "space-y-6 text-center lg:text-left transition-all duration-700",
                  slideIndex === currentSlide && !isAnimating && isLoaded
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                )}
              >
                <div className="space-y-4">
                  <h1
                    className={cn(
                      "text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight text-balance transition-all duration-700 delay-200",
                      slideIndex === currentSlide && !isAnimating && isLoaded
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-12"
                    )}
                  >
                    {slide.title}
                    <span
                      className={cn(
                        "block text-primary transition-all duration-700 delay-300",
                        slideIndex === currentSlide && !isAnimating && isLoaded
                          ? "opacity-100 translate-x-0"
                          : "opacity-0 translate-x-8"
                      )}
                    >
                      {slide.subtitle}
                    </span>
                  </h1>

                  <p
                    className={cn(
                      "text-base sm:text-lg md:text-xl text-white max-w-2xl text-pretty transition-all duration-700 delay-400",
                      slideIndex === currentSlide && !isAnimating && isLoaded
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-6"
                    )}
                  >
                    {slide.description}
                  </p>
                </div>

                {/* CTA Buttons */}
                <div
                  className={cn(
                    "flex flex-col sm:flex-row gap-4 justify-center lg:justify-start w-fit mx-auto sm:w-full transition-all duration-700 delay-700",
                    slideIndex === currentSlide && !isAnimating && isLoaded
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  )}
                >
                  <Button
                    size="lg"
                    className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 hover:scale-105 transition-transform duration-200 shadow-lg"
                    asChild
                  >
                    <a href={slide.ctaLink}>{slide.ctaText}</a>
                  </Button>
                  {slide.ctaSecondaryText && (
                    <Button
                      variant="outline"
                      size="lg"
                      className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:text-white hover:bg-white/20 hover:scale-105 transition-transform duration-200"
                      asChild
                    >
                      <a href={slide.ctaSecondaryLink || "#"}>
                        <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        {slide.ctaSecondaryText}
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

SlideComponent.displayName = "SlideComponent";
