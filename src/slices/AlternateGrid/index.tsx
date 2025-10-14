import { FC } from "react";
import { Content, isFilled } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";
import { PrismicNextImage } from "@prismicio/next";
import { cn } from "@/lib/utils";

export type AlternateGridProps =
  SliceComponentProps<Content.AlternateGridSlice>;

const AlternateGrid: FC<AlternateGridProps> = ({ slice }) => {
  const isImageRight = slice.variation === "imageRight";
  const hasImage = isFilled.image(slice.primary.image);

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="py-16 px-5 bg-white text-gray-900"
    >
      <div
        className={cn(
          "grid gap-6",
          hasImage && "sm:grid-cols-2"
        )}
      >
        {/* Image */}
        {hasImage && (
          <div className={cn(
            "w-auto h-auto max-w-full self-center",
            isImageRight ? "sm:order-2" : "sm:order-1"
          )}>
            <PrismicNextImage
              field={slice.primary.image}
              className="w-full h-auto"
            />
          </div>
        )}

        {/* Content */}
        <div className={cn(
          "grid gap-8",
          hasImage && (isImageRight ? "sm:order-1" : "sm:order-2")
        )}>
          {/* Intro Section */}
          <div className="grid gap-2">
            {isFilled.keyText(slice.primary.eyebrowHeadline) && (
              <p className="text-[#8592e0] text-lg font-medium m-0">
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
          </div>

          {/* Items Grid */}
          {slice.primary.items && slice.primary.items.length > 0 && (
            <div className="grid gap-8 sm:grid-cols-2">
              {slice.primary.items.map((item, i) => (
                <div key={`item-${i + 1}`} className="grid content-start">
                  {isFilled.richText(item.title) && (
                    <div className="font-bold text-lg mb-2 mt-0">
                      <PrismicRichText 
                        field={item.title}
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
                  {isFilled.richText(item.description) && (
                    <div className="text-sm">
                      <PrismicRichText 
                        field={item.description}
                        components={{
                          paragraph: ({ children }) => <p className="m-0">{children}</p>,
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AlternateGrid;
