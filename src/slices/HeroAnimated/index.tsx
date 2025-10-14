import { FC } from "react";
import { Content, isFilled } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";
import { PrismicNextLink, PrismicNextImage } from "@prismicio/next";
import { cn } from "@/lib/utils";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";

export type HeroAnimatedProps = SliceComponentProps<Content.HeroSlice>;

const HeroAnimated: FC<HeroAnimatedProps> = ({ slice }) => {
  const isImageRight = slice.variation === "imageRight";
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
        "transition-all duration-1000 ease-out",
        hasIntersected ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}
    >
      <div
        className={cn(
          "flex flex-col gap-8",
          "lg:flex-row lg:gap-0",
          isImageRight && "lg:flex-row-reverse"
        )}
      >
        {/* Image Section */}
        <div 
          className={cn(
            "lg:w-1/2 transition-all duration-700 ease-out",
            hasIntersected ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
          )}
          style={{ transitionDelay: hasIntersected ? "200ms" : "0ms" }}
        >
          {isFilled.image(slice.primary.image) && (
            <PrismicNextImage
              field={slice.primary.image}
              className="w-full h-auto self-center rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            />
          )}
        </div>

        {/* Content Section */}
        <div 
          className={cn(
            "lg:w-1/2 flex flex-col justify-center p-6 transition-all duration-700 ease-out",
            hasIntersected ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
          )}
          style={{ transitionDelay: hasIntersected ? "400ms" : "0ms" }}
        >
          <div className="grid gap-4">
            {isFilled.keyText(slice.primary.eyebrowHeadline) && (
              <p 
                className={cn(
                  "text-[#47C1AF] text-lg font-medium m-0 transition-all duration-500 ease-out",
                  hasIntersected ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}
                style={{ transitionDelay: hasIntersected ? "600ms" : "0ms" }}
              >
                {slice.primary.eyebrowHeadline}
              </p>
            )}
            {isFilled.richText(slice.primary.title) && (
              <div 
                className={cn(
                  "text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold transition-all duration-500 ease-out",
                  hasIntersected ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}
                style={{ transitionDelay: hasIntersected ? "800ms" : "0ms" }}
              >
                <PrismicRichText 
                  field={slice.primary.title} 
                  components={{
                    heading1: ({ children }) => <h1 className="m-0">{children}</h1>,
                    heading2: ({ children }) => <h2 className="m-0">{children}</h2>,
                    heading3: ({ children }) => <h3 className="m-0">{children}</h3>,
                    heading4: ({ children }) => <h4 className="m-0">{children}</h4>,
                    heading5: ({ children }) => <h5 className="m-0">{children}</h5>,
                    heading6: ({ children }) => <h6 className="m-0">{children}</h6>,
                  }}
                />
              </div>
            )}
            {isFilled.richText(slice.primary.description) && (
              <div 
                className={cn(
                  "text-lg xl:text-xl max-w-2xl transition-all duration-500 ease-out",
                  hasIntersected ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}
                style={{ transitionDelay: hasIntersected ? "1000ms" : "0ms" }}
              >
                <PrismicRichText 
                  field={slice.primary.description}
                  components={{
                    paragraph: ({ children }) => <p className="m-0">{children}</p>,
                  }}
                />
              </div>
            )}
            {isFilled.link(slice.primary.callToActionLink) && (
              <div
                className={cn(
                  "transition-all duration-500 ease-out",
                  hasIntersected ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}
                style={{ transitionDelay: hasIntersected ? "1200ms" : "0ms" }}
              >
                <PrismicNextLink
                  field={slice.primary.callToActionLink}
                  className="inline-flex justify-start rounded text-sm leading-tight px-10 py-4 transition-all duration-300 bg-[#16745f] text-white hover:bg-[#0d5e4c] hover:scale-105 hover:shadow-lg"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroAnimated;
