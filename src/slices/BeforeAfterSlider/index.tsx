"use client";
import { FC, useState, useRef, useEffect, useCallback } from "react";
import { isFilled } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { PrismicNextImage } from "@prismicio/next";
import { HeadingField, RichTextField } from "@/components/prismic/fields";
import { cn } from "@/lib/utils";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { GripVertical } from "lucide-react";

export type BeforeAfterSliderProps = SliceComponentProps<any>;

const BeforeAfterSlider: FC<BeforeAfterSliderProps> = ({ slice }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const startPositionRef = useRef({ x: 0, y: 0, position: 50 });
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const { ref, hasIntersected } = useIntersectionObserver({
    threshold: 0.2,
    triggerOnce: true,
  });

  const beforeImage = slice.primary.before_image;
  const afterImage = slice.primary.after_image;
  const orientation = slice.primary.orientation || "horizontal";
  const showLabels = slice.primary.show_labels !== false;
  const beforeLabel = slice.primary.before_label || "Before";
  const afterLabel = slice.primary.after_label || "After";

  // Calculate position from client coordinates
  const calculatePosition = useCallback(
    (clientX: number, clientY: number) => {
      if (!containerRef.current) return 50;

      const rect = containerRef.current.getBoundingClientRect();
      let position: number;

      if (orientation === "vertical") {
        position = ((clientY - rect.top) / rect.height) * 100;
      } else {
        position = ((clientX - rect.left) / rect.width) * 100;
      }

      return Math.max(0, Math.min(100, position));
    },
    [orientation]
  );

  // Handle mouse/touch drag with relative movement
  const handleMove = useCallback(
    (clientX: number, clientY: number) => {
      if (!containerRef.current) return;

      const startPos = startPositionRef.current;
      const rect = containerRef.current.getBoundingClientRect();
      let delta: number;
      let newPosition: number;

      if (orientation === "vertical") {
        // Swipe down (positive delta) → show more top (before) → decrease position (reveal from top)
        // Swipe up (negative delta) → show more bottom (after) → increase position (reveal from bottom)
        delta = clientY - startPos.y;
        const deltaPercent = (delta / rect.height) * 100;
        newPosition = startPos.position + deltaPercent; // Inverted for intuitive swipe
      } else {
        // Swipe right (positive delta) → show more left (before) → decrease position (reveal from left)
        // Swipe left (negative delta) → show more right (after) → increase position (reveal from right)
        delta = clientX - startPos.x;
        const deltaPercent = (delta / rect.width) * 100;
        newPosition = startPos.position + deltaPercent; // Inverted for intuitive swipe
      }

      newPosition = Math.max(0, Math.min(100, newPosition));
      setSliderPosition(newPosition);
    },
    [orientation]
  );

  const handleStart = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      setIsDragging(true);
      
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      
      startPositionRef.current = {
        x: clientX,
        y: clientY,
        position: sliderPosition,
      };
    },
    [sliderPosition]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      handleMove(e.clientX, e.clientY);
    },
    [isDragging, handleMove]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      const touch = e.touches[0];
      if (touch) {
        handleMove(touch.clientX, touch.clientY);
      }
    },
    [isDragging, handleMove]
  );

  // Mouse and touch events
  useEffect(() => {
    if (isDragging) {
      const abortController = new AbortController();
      const { signal } = abortController;

      document.addEventListener("mousemove", handleMouseMove, { passive: false, signal });
      document.addEventListener("mouseup", handleMouseUp, { signal });
      document.addEventListener("touchmove", handleTouchMove, { passive: false, signal });
      document.addEventListener("touchend", handleMouseUp, { signal });
      document.body.style.userSelect = "none";
      document.body.style.cursor = orientation === "vertical" ? "row-resize" : "col-resize";

      return () => {
        abortController.abort();
        document.body.style.userSelect = "";
        document.body.style.cursor = "";
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, orientation]);

  // Handle click on container
  const handleContainerClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current || sliderRef.current?.contains(e.target as Node)) return;
      const position = calculatePosition(e.clientX, e.clientY);
      setSliderPosition(position);
    },
    [calculatePosition]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!containerRef.current) return;
      
      const step = 2; // 2% per keypress
      let newPosition = sliderPosition;

      if (orientation === "vertical") {
        // ArrowUp → show more bottom (after) → decrease position
        // ArrowDown → show more top (before) → increase position
        if (e.key === "ArrowUp") {
          e.preventDefault();
          newPosition = Math.max(0, sliderPosition - step);
        } else if (e.key === "ArrowDown") {
          e.preventDefault();
          newPosition = Math.min(100, sliderPosition + step);
        }
      } else {
        // ArrowLeft → show more right (after) → decrease position
        // ArrowRight → show more left (before) → increase position
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          newPosition = Math.max(0, sliderPosition - step);
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          newPosition = Math.min(100, sliderPosition + step);
        }
      }

      if (newPosition !== sliderPosition) {
        setSliderPosition(newPosition);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [sliderPosition, orientation]);

  if (!isFilled.image(beforeImage) || !isFilled.image(afterImage)) {
    return null;
  }

  const isVertical = orientation === "vertical";

  return (
    <section
      ref={ref}
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className={cn(
        "relative min-w-0 bg-background text-foreground py-8 md:py-16",
        "transition-all duration-700 ease-out",
        hasIntersected ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      )}
    >
      <div className="max-w-480 mx-auto px-4">
        {/* Header */}
        {(isFilled.richText(slice.primary.title) ||
          isFilled.richText(slice.primary.subtitle)) && (
          <div
            className={cn(
              "text-center mb-8 md:mb-12",
              "transition-all duration-500 ease-out",
              hasIntersected ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            )}
          >
            {isFilled.richText(slice.primary.title) && (
              <HeadingField
                field={slice.primary.title}
                className="text-3xl md:text-4xl font-bold mb-4"
              />
            )}
            {isFilled.richText(slice.primary.subtitle) && (
              <RichTextField
                field={slice.primary.subtitle}
                className="text-lg text-muted-foreground max-w-2xl mx-auto"
              />
            )}
          </div>
        )}

        {/* Before & After Slider */}
        <div
          className={cn(
            "relative w-full overflow-hidden rounded-xl shadow-lg",
            isVertical ? "h-[500px] md:h-[600px]" : "h-[360px] md:h-[500px] lg:h-[600px]",
            "transition-all duration-500 ease-out",
            hasIntersected ? "opacity-100 scale-100" : "opacity-0 scale-95"
          )}
          style={{ transitionDelay: hasIntersected ? "200ms" : "0ms" }}
        >
          <div
            ref={containerRef}
            onClick={handleContainerClick}
            className={cn(
              "relative w-full h-full select-none",
              isDragging 
                ? (isVertical ? "cursor-row-resize" : "cursor-col-resize")
                : (isVertical ? "cursor-ns-resize" : "cursor-ew-resize")
            )}
          >
            {/* Before Image - Same layer */}
            <div className="absolute inset-0 w-full h-full z-0">
              <PrismicNextImage
                field={beforeImage}
                className="w-full h-full object-cover"
                alt={beforeLabel}
                priority
              />
              {showLabels && (
                <div
                  className={cn(
                    "absolute top-4 left-4 px-4 py-2 rounded-lg bg-black/70 text-white text-sm md:text-base font-semibold backdrop-blur-sm",
                    "transition-all duration-300 z-20"
                  )}
                >
                  {beforeLabel}
                </div>
              )}
            </div>

            {/* After Image - Same layer with clip-path */}
            <div
              className="absolute inset-0 w-full h-full z-10"
              style={{
                clipPath: isVertical
                  ? `inset(${sliderPosition}% 0 0 0)`
                  : `inset(0 0 0 ${sliderPosition}%)`,
              }}
            >
              <PrismicNextImage
                field={afterImage}
                className="w-full h-full object-cover"
                alt={afterLabel}
                priority
              />
              {showLabels && (
                <div
                  className={cn(
                    "absolute right-4 px-4 py-2 rounded-lg bg-black/70 text-white text-sm md:text-base font-semibold backdrop-blur-sm",
                    `${isVertical ? "bottom-4" : "top-4"}`,
                    "transition-all duration-300 z-20"
                  )}
                >
                  {afterLabel}
                </div>
              )}
            </div>

            {/* Slider Line & Handle */}
            <div
              ref={sliderRef}
              onMouseDown={handleStart}
              onTouchStart={handleStart}
              className={cn(
                "absolute z-20 flex items-center justify-center",
                "transition-all duration-200 ease-out",
                isDragging && "scale-110",
                isVertical
                  ? "left-0 right-0 w-full h-1"
                  : "top-0 bottom-0 h-full w-1"
              )}
              style={{
                [isVertical ? "top" : "left"]: `${sliderPosition}%`,
                transform: isVertical
                  ? "translateY(-50%)"
                  : "translateX(-50%)",
              }}
            >
              {/* Slider Line */}
              <div
                className={cn(
                  "absolute bg-white/95 shadow-2xl backdrop-blur-md",
                  "transition-all duration-200",
                  isDragging && "bg-white shadow-2xl",
                  isVertical ? "w-full h-1" : "h-full w-1"
                )}
              />

              {/* Slider Handle */}
              <div
                className={cn(
                  "relative flex items-center justify-center",
                  "bg-primary text-primary-foreground",
                  "rounded-full shadow-xl border-2 border-white",
                  "transition-all duration-200 ease-out",
                  "hover:scale-110 active:scale-105",
                  isDragging && "shadow-2xl scale-125 ring-4 ring-white/50",
                  "w-12 h-12"
                )}
                role="slider"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={sliderPosition}
                aria-label={`Slider at ${Math.round(sliderPosition)}%`}
                tabIndex={0}
              >
                <GripVertical
                  className={cn(
                    "text-white drop-shadow-sm",
                    isVertical && "rotate-90",
                    "w-6 h-6 transition-transform duration-200",
                    isDragging && "scale-110"
                  )}
                />
                {/* Arrow indicators */}
                {!isVertical && (
                  <>
                    <div className="absolute left-full ml-2 border-4 border-transparent border-l-white" />
                    <div className="absolute right-full mr-2 border-4 border-transparent border-r-white" />
                  </>
                )}
                {isVertical && (
                  <>
                    <div className="absolute top-full mt-2 border-4 border-transparent border-t-white" />
                    <div className="absolute bottom-full mb-2 border-4 border-transparent border-b-white" />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BeforeAfterSlider;

