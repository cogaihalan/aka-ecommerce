"use client";

import { useRef, useState, useCallback, useEffect, useMemo, memo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Glider from "react-glider";
import { cn } from "@/lib/utils";
import {
  SlideComponent,
  LoadingSkeleton,
  BannerSlide,
  FullWidthBannerProps,
} from "./banner";

const slides: BannerSlide[] = [
  {
    id: 1,
    title: "Transform Your Business",
    subtitle: "with AI-Powered Solutions",
    description:
      "Discover cutting-edge technology that revolutionizes how you work, collaborate, and grow your business in the digital age.",
    image:
      "/assets/placeholder-banner.png",
    ctaText: "Get Started Free",
    ctaLink: "#",
    ctaSecondaryText: "Watch Demo",
    ctaSecondaryLink: "#",
  },
  {
    id: 2,
    title: "Boost Productivity",
    subtitle: "by 300% or More",
    description:
      "Join thousands of teams who have streamlined their workflow and achieved unprecedented levels of efficiency with our platform.",
    image:
      "/assets/placeholder-banner.png",
    ctaText: "View Demo",
    ctaLink: "#",
    ctaSecondaryText: "Learn More",
    ctaSecondaryLink: "#",
  },
  {
    id: 3,
    title: "Scale Without Limits",
    subtitle: "Enterprise-Ready Platform",
    description:
      "Built for growth with enterprise-grade security, unlimited scalability, and seamless integrations with your existing tools.",
    image: "/assets/placeholder-banner.png",
    ctaText: "Contact Sales",
    ctaLink: "#",
    ctaSecondaryText: "Schedule Demo",
    ctaSecondaryLink: "#",
  },
];

const FullWidthBanner = memo(function FullWidthBanner({
  slides: customSlides,
  className,
}: FullWidthBannerProps = {}) {
  const gliderRef = useRef<any>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const bannerSlides = useMemo(() => customSlides || slides, [customSlides]);

  // Preload images to prevent layout shift - prioritize first image for LCP
  useEffect(() => {
    const preloadImages = async () => {
      // Prioritize first image (LCP candidate) - load immediately
      const firstSlide = bannerSlides[0];
      if (firstSlide) {
        const firstImg = new Image();
        firstImg.fetchPriority = "high";
        firstImg.loading = "eager";
        firstImg.onload = () => {
          setLoadedImages((prev) => new Set([...Array.from(prev), firstSlide.image]));
          setIsLoaded(true); // Show content as soon as first image loads
        };
        firstImg.onerror = () => {
          setImageErrors((prev) => new Set([...Array.from(prev), firstSlide.image]));
          setIsLoaded(true);
        };
        firstImg.src = firstSlide.image;
      }

      // Load remaining images with lower priority
      const remainingSlides = bannerSlides.slice(1);
      const imagePromises = remainingSlides.map((slide) => {
        return new Promise<string>((resolve, reject) => {
          const img = new Image();
          img.fetchPriority = "low";
          img.loading = "lazy";
          img.onload = () => {
            setLoadedImages(
              (prev) => new Set([...Array.from(prev), slide.image])
            );
            resolve(slide.image);
          };
          img.onerror = () => {
            setImageErrors(
              (prev) => new Set([...Array.from(prev), slide.image])
            );
            reject(slide.image);
          };
          img.src = slide.image;
        });
      });

      // Don't wait for remaining images - they'll load in background
      Promise.allSettled(imagePromises).catch(() => {
        // Silently handle errors for non-critical images
      });
    };

    preloadImages();
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
    [isAnimating]
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
        className
      )}
    >
      {/* Loading skeleton */}
      {!isLoaded && <LoadingSkeleton slideCount={bannerSlides.length} />}

      <div className={cn("absolute inset-0", !isLoaded && "opacity-0")}>
        <Glider
          ref={gliderRef}
          hasArrows={false}
          hasDots={false}
          slidesToShow={1}
          slidesToScroll={1}
          duration={1.2}
          className="h-full"
          onSlideVisible={(event: any) => {
            setCurrentSlide(event.detail.slide);
          }}
        >
          {bannerSlides.map((slide, slideIndex) => (
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
          ))}
        </Glider>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        disabled={isAnimating || !isLoaded}
        className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-40 p-2 sm:p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 shadow-lg transition-all duration-200 hover:scale-110 hover-translate-x-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
                  : "bg-white/40 hover:bg-white/60"
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
