import { FC } from "react";
import { Content, isFilled } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";
import { PrismicNextLink, PrismicNextImage } from "@prismicio/next";
import { cn } from "@/lib/utils";

export type CallToActionProps = SliceComponentProps<Content.CallToActionSlice>;

const CallToAction: FC<CallToActionProps> = ({ slice }) => {
  const alignment = slice.variation === "alignLeft" ? "left" : "center";
  const isLeftAligned = alignment === "left";

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="py-16 px-8 bg-white text-gray-900"
    >
      <div className="mx-auto max-w-4xl sm:max-w-5xl lg:max-w-6xl xl:max-w-7xl">
        <div className={cn(
          "grid gap-4",
          isLeftAligned ? "justify-items-start" : "justify-items-center"
        )}>
          {isFilled.image(slice.primary.image) && (
            <PrismicNextImage
              className={cn(
                "max-w-56 h-auto w-auto",
                isLeftAligned ? "justify-self-start" : "justify-self-center"
              )}
              field={slice.primary.image}
            />
          )}
          
          <div className={cn(
            "grid gap-4",
            isLeftAligned ? "justify-items-start" : "justify-items-center"
          )}>
            {isFilled.richText(slice.primary.title) && (
              <div className={cn(
                "text-3xl font-bold",
                isLeftAligned ? "text-left" : "text-center"
              )}>
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
            
            {isFilled.richText(slice.primary.paragraph) && (
              <div className={cn(
                "text-lg max-w-2xl",
                isLeftAligned ? "text-left" : "text-center"
              )}>
                <PrismicRichText 
                  field={slice.primary.paragraph}
                  components={{
                    paragraph: ({ children }) => <p className="m-0">{children}</p>,
                  }}
                />
              </div>
            )}
          </div>
          
          {isFilled.link(slice.primary.buttonLink) && (
            <PrismicNextLink
              field={slice.primary.buttonLink}
              className={cn(
                "inline-block rounded text-sm leading-tight px-10 py-4 transition-colors duration-100 bg-[#16745f] text-white hover:bg-[#0d5e4c]",
                isLeftAligned ? "justify-self-start text-left" : "justify-self-center text-center"
              )}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
