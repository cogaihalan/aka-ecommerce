"use client";

import { useRef, useState, useCallback, useEffect, useMemo, memo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Glider from "react-glider";
import { cn } from "@/lib/utils";
import {
  SlideComponent,
  SlideVideoComponent,
  LoadingSkeleton,
  FullWidthBannerProps,
} from "./banner";

const FullWidthBanner = memo(function FullWidthBanner({
  slides,
  className,
}: FullWidthBannerProps) {
  const gliderRef = useRef<any>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const bannerSlides = useMemo(() => slides || [], [slides]);

  if (!bannerSlides || bannerSlides.length === 0) {
    return null;
  }

  useEffect(() => {
    let idleCallbackId: number | undefined;
    let timeoutId: NodeJS.Timeout | undefined;

    // Load first image immediately for LCP
    const firstSlide = bannerSlides[0];
    if (firstSlide) {
      const firstImg = new Image();
      firstImg.fetchPriority = "high";
      firstImg.loading = "eager";
      firstImg.onload = () => {
        setLoadedImages(
          (prev) => new Set([...Array.from(prev), firstSlide.imageUrl]),
        );
        setIsLoaded(true);
      };
      firstImg.onerror = () => {
        setImageErrors(
          (prev) => new Set([...Array.from(prev), firstSlide.imageUrl]),
        );
        setIsLoaded(true);
      };
      firstImg.src = firstSlide.imageUrl;
    }

    const loadRemainingImages = () => {
      const remainingSlides = bannerSlides.slice(1);
      remainingSlides.forEach((slide) => {
        const img = new Image();
        img.fetchPriority = "low";
        img.loading = "lazy";
        img.onload = () => {
          setLoadedImages(
            (prev) => new Set([...Array.from(prev), slide.imageUrl]),
          );
        };
        img.onerror = () => {
          setImageErrors(
            (prev) => new Set([...Array.from(prev), slide.imageUrl]),
          );
        };
        img.src = slide.imageUrl;
      });
    };

    if ("requestIdleCallback" in window) {
      idleCallbackId = (window as any).requestIdleCallback(
        loadRemainingImages,
        { timeout: 3000 },
      );
    } else {
      timeoutId = setTimeout(loadRemainingImages, 1000);
    }

    return () => {
      if (idleCallbackId !== undefined && "cancelIdleCallback" in window) {
        (window as any).cancelIdleCallback(idleCallbackId);
      }
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }
    };
  }, [bannerSlides]);

  const goToSlide = useCallback(
    (index: number) => {
      if (gliderRef.current && !isAnimating) {
        setIsAnimating(true);
        setTimeout(() => {
          gliderRef.current.scrollItem(index);
          setCurrentSlide(index);
          setIsAnimating(false);
        }, 100);
      }
    },
    [isAnimating],
  );

  const nextSlide = useCallback(() => {
    const next = (currentSlide + 1) % bannerSlides.length;
    goToSlide(next);
  }, [currentSlide, bannerSlides.length, goToSlide]);

  const prevSlide = useCallback(() => {
    const prev = (currentSlide - 1 + bannerSlides.length) % bannerSlides.length;
    goToSlide(prev);
  }, [currentSlide, bannerSlides.length, goToSlide]);

  return (
    <section
      className={cn(
        "relative w-full h-[500px] sm:h-[600px] md:h-[700px] overflow-hidden",
        className,
      )}
    >
      {/* Loading skeleton */}
      {!isLoaded && <LoadingSkeleton slideCount={bannerSlides.length} />}

      <div className={cn("absolute inset-0 touch-pan-x", !isLoaded && "opacity-0")}>
        <Glider
          ref={gliderRef}
          draggable={true}
          hasArrows={false}
          hasDots={false}
          slidesToShow={1}
          slidesToScroll={1}
          duration={1.2}
          scrollLock={true}
          scrollLockDelay={100}
          rewind={true}
          className="h-full"
          onSlideVisible={(event: any) => {
            setCurrentSlide(event.detail.slide);
          }}
        >
          {bannerSlides.map((slide, slideIndex) =>
            slide.type === "video" ? (
              <SlideVideoComponent
                key={slide.id}
                slide={slide}
                slideIndex={slideIndex}
                currentSlide={currentSlide}
                isAnimating={isAnimating}
                isLoaded={isLoaded}
                loadedImages={loadedImages}
                imageErrors={imageErrors}
              />
            ) : (
              <SlideComponent
                key={slide.id}
                slide={slide}
                slideIndex={slideIndex}
                currentSlide={currentSlide}
                isAnimating={isAnimating}
                isLoaded={isLoaded}
                loadedImages={loadedImages}
                imageErrors={imageErrors}
              />
            ),
          )}
        </Glider>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        disabled={isAnimating || !isLoaded}
        className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-40 p-2 sm:p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 shadow-lg transition-all duration-200 hover:scale-110 hover:-translate-x-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
      </button>

      <button
        onClick={nextSlide}
        disabled={isAnimating || !isLoaded}
        className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-40 p-2 sm:p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 shadow-lg transition-all duration-200 hover:scale-110 hover:translate-x-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
      </button>

      {/* Dots Indicator */}
      {isLoaded && (
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 flex gap-2">
          {bannerSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              disabled={isAnimating}
              className={cn(
                "w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 hover:scale-125 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
                index === currentSlide
                  ? "bg-primary scale-125 shadow-lg shadow-primary/50"
                  : "bg-white/40 hover:bg-white/60",
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Progress Bar */}
      {isLoaded && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20 z-40">
          <div
            className="h-full bg-gradient-to-r from-primary to-chart-2 transition-all duration-500 ease-out shadow-sm"
            style={{
              width: `${((currentSlide + 1) / bannerSlides.length) * 100}%`,
            }}
          />
        </div>
      )}
    </section>
  );
});

FullWidthBanner.displayName = "FullWidthBanner";

export default FullWidthBanner;
