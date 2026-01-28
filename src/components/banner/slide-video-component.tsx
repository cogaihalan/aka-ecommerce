"use client";

import { memo, useRef, useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { SlideComponentProps } from "./types";

export const SlideVideoComponent = memo(
  ({
    slide,
    slideIndex,
    currentSlide,
    isAnimating,
    isLoaded,
    loadedImages,
    imageErrors,
  }: SlideComponentProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);

    const videoUrl = slide.videoUrl || "/assets/sample-video.mp4";
    const imageUrl = slide.imageUrl || "/assets/placeholder-banner.png";
    const isImageLoaded = loadedImages.has(imageUrl);
    const hasImageError = imageErrors.has(imageUrl);
    const fallbackImage = "/assets/placeholder-banner.png";
    const isActive = slideIndex === currentSlide;

    // Autoplay video when slide becomes active
    useEffect(() => {
      if (videoRef.current && isActive && !isAnimating) {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsVideoPlaying(true);
            })
            .catch((error) => {
              console.error("Error autoplaying video:", error);
              setIsVideoPlaying(false);
            });
        }
      } else if (videoRef.current && !isActive) {
        videoRef.current.pause();
        setIsVideoPlaying(false);
      }
    }, [isActive, isAnimating]);

    // Handle video loading
    useEffect(() => {
      const video = videoRef.current;
      if (!video) {
        setIsVideoLoaded(false);
        setIsVideoPlaying(false);
        return;
      }

      // Reset state when video URL changes
      setIsVideoLoaded(false);
      setIsVideoPlaying(false);

      const handleCanPlay = () => {
        setIsVideoLoaded(true);
      };

      const handlePlay = () => {
        setIsVideoPlaying(true);
      };

      const handlePause = () => {
        setIsVideoPlaying(false);
      };

      const handleError = () => {
        setIsVideoLoaded(false);
        setIsVideoPlaying(false);
      };

      video.addEventListener("canplay", handleCanPlay);
      video.addEventListener("play", handlePlay);
      video.addEventListener("pause", handlePause);
      video.addEventListener("error", handleError);

      return () => {
        video.removeEventListener("canplay", handleCanPlay);
        video.removeEventListener("play", handlePlay);
        video.removeEventListener("pause", handlePause);
        video.removeEventListener("error", handleError);
      };
    }, [videoUrl]);

    // Toggle video play/pause on click
    const handleToggleVideo = useCallback(
      (e: React.MouseEvent) => {
        // Don't toggle if clicking on buttons or links
        const target = e.target as HTMLElement;
        if (
          target.closest("a") ||
          target.closest("button") ||
          target.tagName === "A" ||
          target.tagName === "BUTTON"
        ) {
          return;
        }

        if (videoRef.current) {
          if (isVideoPlaying) {
            videoRef.current.pause();
          } else {
            videoRef.current.play().catch(console.error);
          }
        }
      },
      [isVideoPlaying],
    );

    return (
      <div className="h-full">
        <div
          className="relative h-full flex items-center cursor-pointer"
          onClick={handleToggleVideo}
        >
          {/* Video Background */}
          <video
            ref={videoRef}
            src={videoUrl}
            className={cn(
              "absolute inset-0 z-0 w-full h-full object-cover transition-all duration-1000",
              !isVideoLoaded && "opacity-0",
              isVideoLoaded && "opacity-100",
            )}
            style={{
              transform:
                slideIndex === currentSlide ? "scale(1.05)" : "scale(1.0)",
              willChange: slideIndex === currentSlide ? "transform" : "auto",
            }}
            muted
            loop
            playsInline
            preload="auto"
            poster={imageUrl}
          />

          {/* Video loading placeholder */}
          {!isVideoLoaded && (
            <div className="absolute inset-0 z-0 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse" />
          )}

          {/* Fallback image while video loads or if video fails */}
          <div
            className={cn(
              "absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-1000",
              isVideoLoaded && "opacity-0",
              !isVideoLoaded && !isImageLoaded && !hasImageError && "opacity-0",
              !isVideoLoaded && isImageLoaded && "opacity-100",
            )}
            style={{
              backgroundImage: `url(${hasImageError ? fallbackImage : imageUrl})`,
              transform:
                slideIndex === currentSlide ? "scale(1.05)" : "scale(1.0)",
              willChange: slideIndex === currentSlide ? "transform" : "auto",
            }}
          />

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
                    : "opacity-0 translate-y-8",
                )}
              >
                <div className="space-y-4">
                  <h1
                    className={cn(
                      "text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight text-balance transition-all duration-700 delay-200",
                      slideIndex === currentSlide && !isAnimating && isLoaded
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-12",
                    )}
                  >
                    {slide.title}
                    <span
                      className={cn(
                        "block text-primary transition-all duration-700 delay-300",
                        slideIndex === currentSlide && !isAnimating && isLoaded
                          ? "opacity-100 translate-x-0"
                          : "opacity-0 translate-x-8",
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
                        : "opacity-0 translate-y-6",
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
                      : "opacity-0 translate-y-8",
                  )}
                >
                  {slide.ctaLink && (
                    <Button
                      size="lg"
                      className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 hover:scale-105 transition-transform duration-200 shadow-lg"
                      asChild
                    >
                      <a href={slide.ctaLink}>{slide.ctaText}</a>
                    </Button>
                  )}
                  {slide.ctaSecondaryLink && (
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
  },
);

SlideVideoComponent.displayName = "SlideVideoComponent";
