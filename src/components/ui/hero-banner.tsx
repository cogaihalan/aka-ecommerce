"use client";

import { cn } from "@/lib/utils";

type VerticalPosition = "top" | "center" | "bottom";
type HorizontalPosition = "left" | "center" | "right";

interface HeroBannerProps {
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl: string;
  verticalPos?: VerticalPosition;
  horizontalPos?: HorizontalPosition;
  className?: string;
  overlayOpacity?: number;
  children?: React.ReactNode;
}

const verticalPositionClasses: Record<VerticalPosition, string> = {
  top: "items-start pt-12 sm:pt-16 md:pt-20",
  center: "items-center",
  bottom: "items-end pb-12 sm:pb-16 md:pb-20",
};

const horizontalPositionClasses: Record<HorizontalPosition, string> = {
  left: "justify-start text-left",
  center: "justify-center text-center",
  right: "justify-end text-right",
};

const textAlignClasses: Record<HorizontalPosition, string> = {
  left: "items-start",
  center: "items-center",
  right: "items-end",
};

const HeroBanner = ({
  title,
  subtitle,
  description,
  imageUrl,
  verticalPos = "center",
  horizontalPos = "left",
  className,
  overlayOpacity = 50,
  children,
}: HeroBannerProps) => {
  return (
    <section className="-mx-4 sm:-mx-6 lg:-mx-8">
      <div
        className={cn(
          "relative w-full h-[400px] sm:h-[500px] md:h-[600px] overflow-hidden",
          className,
        )}
      >
        {/* Background Image */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 hover:scale-105"
          style={{
            backgroundImage: `url(${imageUrl})`,
          }}
        />

        {/* Dark overlay for better text readability */}
        <div
          className="absolute inset-0 z-10"
          style={{
            backgroundColor: `rgba(0, 0, 0, ${overlayOpacity / 100})`,
          }}
        />

        {/* Content Container */}
        <div
          className={cn(
            "relative z-20 h-full flex mx-auto p-4 sm:px-6 lg:px-8",
            verticalPositionClasses[verticalPos],
            horizontalPositionClasses[horizontalPos],
          )}
        >
          {/* Text Content */}
          <div
            className={cn(
              "flex flex-col space-y-4 max-w-2xl",
              textAlignClasses[horizontalPos],
            )}
          >
            {subtitle && (
              <span className="text-sm sm:text-base md:text-lg font-medium text-primary uppercase tracking-wider">
                {subtitle}
              </span>
            )}

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight text-balance">
              {title}
            </h1>

            {description && (
              <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-xl text-pretty">
                {description}
              </p>
            )}

            {/* Optional children for CTA buttons or additional content */}
            {children && <div className="mt-4">{children}</div>}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
