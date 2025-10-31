import { FC } from "react";
import { isFilled, Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { HeadingField, RichTextField } from "@/components/prismic/fields";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import { cn } from "@/lib/utils";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";

export type TextAndImageProps = SliceComponentProps<Content.TextAndImageSlice>;

const TextAndImage: FC<TextAndImageProps> = ({ slice }) => {
  const imageOnRight = (slice.primary.image_position || "right") === "right";
  const { ref, hasIntersected } = useIntersectionObserver({
    threshold: 0.2,
    triggerOnce: true,
  });

  return (
    <section
      ref={ref}
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className={cn(
        "relative min-w-0 bg-white text-gray-900",
        "transition-all duration-700 ease-out",
        hasIntersected ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      )}
    >
      <div
        className={cn(
          "flex flex-col gap-8 items-center",
          "lg:flex-row lg:gap-12",
          imageOnRight && "lg:flex-row-reverse"
        )}
      >
        {/* Image */}
        <div
          className={cn(
            "w-full lg:w-1/2 transition-all duration-700 ease-out",
            hasIntersected ? "opacity-100 translate-x-0" : `opacity-0 ${imageOnRight ? "translate-x-6" : "-translate-x-6"}`
          )}
          style={{ transitionDelay: hasIntersected ? "150ms" : "0ms" }}
        >
          {isFilled.image(slice.primary.image) && (
            <PrismicNextImage
              field={slice.primary.image}
              className="w-full h-auto rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 object-cover"
              alt=""
            />
          )}
        </div>

        {/* Content */}
        <div
          className={cn(
            "w-full lg:w-1/2 transition-all duration-700 ease-out",
            hasIntersected ? "opacity-100 translate-x-0" : `opacity-0 ${imageOnRight ? "-translate-x-6" : "translate-x-6"}`
          )}
          style={{ transitionDelay: hasIntersected ? "300ms" : "0ms" }}
        >
          <div className="max-w-2xl grid gap-4">
            {isFilled.richText(slice.primary.title) && (
              <HeadingField
                field={slice.primary.title}
                className={cn(
                  "text-2xl sm:text-3xl lg:text-4xl font-bold m-0",
                  "transition-all duration-500 ease-out",
                  hasIntersected ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                )}
              />
            )}

            {isFilled.richText(slice.primary.description) && (
              <RichTextField
                field={slice.primary.description}
                className={cn(
                  "text-base sm:text-lg text-muted-foreground",
                  "transition-all duration-500 ease-out",
                  hasIntersected ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                )}
              />
            )}

            {isFilled.link(slice.primary.primary_button) && (
              <div
                className={cn(
                  "transition-all duration-500 ease-out",
                  hasIntersected ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                )}
                style={{ transitionDelay: hasIntersected ? "550ms" : "0ms" }}
              >
                <PrismicNextLink
                  field={slice.primary.primary_button}
                  className="inline-flex items-center justify-center rounded-lg text-sm sm:text-base font-semibold px-6 py-3 transition-all duration-300 bg-primary text-white hover:bg-primary/90 hover:shadow-lg"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TextAndImage;
