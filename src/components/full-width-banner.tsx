"use client";

import { useRef, useState, useCallback, useEffect, useMemo, memo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Glider from "react-glider";
import { cn } from "@/lib/utils";
import {
  SlideComponent,
  SlideVideoComponent,
  LoadingSkeleton,
  BannerSlide,
  FullWidthBannerProps,
} from "./banner";

const slides: BannerSlide[] = [
  {
    id: 1,
    type: "video",
    title: "Nâng tầm đẳng cấp gian bếp với tinh hoa thép Việt",
    subtitle: "AKA – Sắc Bén Từ Thép, Uy Tín Từ Tâm",
    description:
      "Tự hào thương hiệu kéo gia dụng cao cấp 100% sản xuất tại Việt Nam",
    imageUrl: "/assets/placeholder-banner.png",
    videoUrl: "/assets/sample-video.mp4",
  },
  {
    id: 2,
    type: "image",
    title: "Thách Thức Mọi Loại Xương Cứng",
    subtitle: "Chinh phục mọi thực phẩm cứng đầu",
    description:
      "Thiết kế trợ lực thông minh & lưỡi răng cưa chống trượt. Cắt gà, vịt gọn bưng trong 5 phút",
    imageUrl: "/assets/placeholder-banner.png",
  },
  {
    id: 3,
    type: "image",
    title: "Gửi trọn sự an tâm vào từng bữa ăn thuần khiết",
    subtitle: "An Toàn Tuyệt Đối Cho Sức Khỏe Gia Đình",
    description:
      "Thép không gỉ cao cấp, đã qua kiểm định Quatest. Cam kết không thôi nhiễm kim loại nặng (Chì, Thạch tín).",
    imageUrl: "/assets/placeholder-banner.png",
  },
  {
    id: 4,
    type: "image",
    title: "Cam Kết Chất Lượng – Bảo Hành 5 Năm",
    subtitle: " Đồng hành cùng gian bếp Việt. Lỗi 1 đổi 1 từ nhà sản xuất",
    description:
      "Đặc quyền bảo hành 5 năm – Bảo chứng vàng cho chất lượng bền bỉ vượt thời gian",
    imageUrl: "/assets/placeholder-banner.png",
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

      <div className={cn("absolute inset-0", !isLoaded && "opacity-0")}>
        <Glider
          ref={gliderRef}
          draggable={true}
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
