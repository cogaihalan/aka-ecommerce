import { FC } from "react";
import { isFilled } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { HeadingField, RichTextField } from "@/components/prismic/fields";
import { PrismicNextLink, PrismicNextImage } from "@prismicio/next";
import { cn } from "@/lib/utils";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";

export type FullWidthBannerProps = SliceComponentProps<any>;

const FullWidthBanner: FC<FullWidthBannerProps> = ({ slice }) => {
  const { ref, hasIntersected } = useIntersectionObserver({
    threshold: 0.2,
    triggerOnce: true,
  });

  // Get position settings with defaults
  const verticalPosition = slice.primary.verticalPosition || "middle";
  const horizontalPosition = slice.primary.horizontalPosition || "center";
  const contentAlignment = slice.primary.contentAlignment || "left";

  // Position classes
  const getVerticalClass = () => {
    switch (verticalPosition) {
      case "top":
        return "items-start";
      case "bottom":
        return "items-end";
      default:
        return "items-center";
    }
  };

  const getHorizontalClass = () => {
    switch (horizontalPosition) {
      case "left":
        return "justify-start";
      case "right":
        return "justify-end";
      default:
        return "justify-center";
    }
  };

  const getContentAlignmentClass = () => {
    switch (contentAlignment) {
      case "left":
        return "text-left";
      case "center":
        return "text-center";
      case "right":
        return "text-right";
      default:
        return "text-center";
    }
  };

  return (
    <section
      ref={ref}
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className={cn(
        "relative flex p-6 md:p-16 w-full overflow-hidden",
        "transition-all duration-1000 ease-out",
        "aspect-2/3 md:aspect-3/2",
        hasIntersected ? "opacity-100" : "opacity-0",
        getVerticalClass(),
        getHorizontalClass(),
      )}
    >
      {/* Desktop Background Image */}
      {isFilled.image(slice.primary.backgroundImage) && (
        <PrismicNextImage
          field={slice.primary.backgroundImage}
          className="absolute inset-0 w-full h-full object-cover hidden md:block"
          priority
          alt=""
        />
      )}

      {/* Mobile Background Image */}
      {isFilled.image(slice.primary.mobileBackgroundImage) && (
        <PrismicNextImage
          field={slice.primary.mobileBackgroundImage}
          className="absolute inset-0 w-full h-full object-cover block md:hidden"
          priority
          alt=""
        />
      )}

      {/* Fallback to desktop image on mobile if mobile image not provided */}
      {isFilled.image(slice.primary.backgroundImage) && !isFilled.image(slice.primary.mobileBackgroundImage) && (
        <PrismicNextImage
          field={slice.primary.backgroundImage}
          className="absolute inset-0 w-full h-full object-cover block md:hidden"
          priority
          alt=""
        />
      )}

      {/* Overlay for better text readability */}
      <div className="absolute z-1 inset-0 bg-black/30" />

      {/* Content Container */}
      <div
        className={cn(
          "relative z-10 w-full md:w-fit md:max-w-112",
          "transition-all duration-700 ease-out",
          hasIntersected ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
        )}
      >
        <div className={cn("w-full md:w-fit md:max-w-112", getContentAlignmentClass())}>
          {/* Title */}
          {isFilled.richText(slice.primary.title) && (
            <HeadingField 
              field={slice.primary.title}
              className={cn(
                "mb-4 transition-all duration-500 ease-out text-white",
                hasIntersected ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            />
          )}

          {/* Description */}
          {isFilled.richText(slice.primary.description) && (
            <RichTextField 
              field={slice.primary.description}
              className={cn(
                "mb-6 transition-all duration-500 ease-out !text-white",
                hasIntersected ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            />
          )}

          {/* Call to Action */}
          {isFilled.link(slice.primary.callToActionLink) && isFilled.keyText(slice.primary.callToActionText) && (
            <div
              className={cn(
                "transition-all duration-500 ease-out",
                hasIntersected ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
              style={{ transitionDelay: hasIntersected ? "600ms" : "0ms" }}
            >
              <PrismicNextLink
                field={slice.primary.callToActionLink}
                className="inline-flex items-center justify-center rounded-lg text-sm sm:text-base md:text-lg font-semibold px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 transition-all duration-300 bg-primary text-white hover:bg-primary/90 hover:shadow-lg"
              >
                {slice.primary.callToActionText}
              </PrismicNextLink>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FullWidthBanner;
