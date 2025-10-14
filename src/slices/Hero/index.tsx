import { FC } from "react";
import { Content, isFilled } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";
import { PrismicNextLink, PrismicNextImage } from "@prismicio/next";
import { cn } from "@/lib/utils";

export type HeroProps = SliceComponentProps<Content.HeroSlice>;

const Hero: FC<HeroProps> = ({ slice }) => {
  const isImageRight = slice.variation === "imageRight";
  
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="relative min-w-0 bg-white text-gray-900"
    >
      <div
        className={cn(
          "flex flex-col gap-8",
          "lg:flex-row lg:gap-0",
          isImageRight && "lg:flex-row-reverse"
        )}
      >
        {/* Image Section */}
        <div className="lg:w-1/2">
          {isFilled.image(slice.primary.image) && (
            <PrismicNextImage
              field={slice.primary.image}
              className="w-full h-auto self-center"
            />
          )}
        </div>

        {/* Content Section */}
        <div className="lg:w-1/2 flex flex-col justify-center p-6">
          <div className="grid gap-4">
            {isFilled.keyText(slice.primary.eyebrowHeadline) && (
              <p className="text-[#47C1AF] text-lg font-medium m-0">
                {slice.primary.eyebrowHeadline}
              </p>
            )}
            {isFilled.richText(slice.primary.title) && (
              <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold">
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
              <div className="text-lg xl:text-xl max-w-2xl">
                <PrismicRichText 
                  field={slice.primary.description}
                  components={{
                    paragraph: ({ children }) => <p className="m-0">{children}</p>,
                  }}
                />
              </div>
            )}
            {isFilled.link(slice.primary.callToActionLink) && (
              <PrismicNextLink
                field={slice.primary.callToActionLink}
                className="inline-flex justify-start rounded text-sm leading-tight px-10 py-4 transition-colors duration-100 bg-[#16745f] text-white hover:bg-[#0d5e4c]"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
