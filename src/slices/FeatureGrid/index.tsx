import { FC } from "react";
import { Content, isFilled } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";
import { PrismicNextLink, PrismicNextImage } from "@prismicio/next";
import { cn } from "@/lib/utils";

export type FeatureGridProps = SliceComponentProps<any>;

const FeatureGrid: FC<FeatureGridProps> = ({ slice }) => {
  const features = slice.items || [];
  const columns = slice.primary.columns || 3;
  const layout = slice.primary.layout || "grid";
  const showIcons = slice.primary.showIcons !== false;
  const showImages = slice.primary.showImages !== false;
  const alignment = slice.primary.alignment || "center";

  const getGridColumns = () => {
    switch (columns) {
      case 1: return "grid-cols-1";
      case 2: return "grid-cols-1 md:grid-cols-2";
      case 3: return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
      case 4: return "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";
      default: return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
    }
  };

  const getAlignmentClasses = () => {
    switch (alignment) {
      case "left": return "text-left";
      case "right": return "text-right";
      default: return "text-center";
    }
  };

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="py-16 px-8 bg-white text-gray-900"
    >
      <div className="mx-auto max-w-4xl sm:max-w-5xl lg:max-w-6xl xl:max-w-7xl">
        {/* Header */}
        {(isFilled.richText(slice.primary.title) || isFilled.richText(slice.primary.subtitle)) && (
          <div className={cn("mb-12", getAlignmentClasses())}>
            {isFilled.richText(slice.primary.title) && (
              <div className="text-4xl font-bold mb-4 text-gray-900">
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
            {isFilled.richText(slice.primary.subtitle) && (
              <div className={cn(
                "text-lg text-gray-600 max-w-2xl",
                alignment === "center" && "mx-auto"
              )}>
                <PrismicRichText 
                  field={slice.primary.subtitle}
                  components={{
                    paragraph: ({ children }) => <p className="m-0">{children}</p>,
                  }}
                />
              </div>
            )}
          </div>
        )}

        {/* Features Grid */}
        {features.length > 0 && (
          <div className={cn("grid gap-8 mb-12", getGridColumns())}>
            {features.map((feature: any, index: number) => (
              <div 
                key={index} 
                className={cn(
                  "bg-white rounded-xl p-8 border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group h-full flex flex-col",
                  getAlignmentClasses()
                )}
              >
                {/* Feature Image */}
                {showImages && isFilled.image(feature.image) && (
                  <div className="mb-6 rounded-lg overflow-hidden aspect-video">
                    <PrismicNextLink field={feature.link}>
                      <PrismicNextImage
                        field={feature.image}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </PrismicNextLink>
                  </div>
                )}

                {/* Feature Icon */}
                {showIcons && isFilled.image(feature.icon) && (
                  <div className="w-16 h-16 mb-6 flex items-center justify-center bg-gradient-to-br from-[#16745f] to-[#0d5e4c] rounded-xl shadow-md">
                    <PrismicNextImage
                      field={feature.icon}
                      className="w-8 h-8 filter brightness-0 invert"
                    />
                  </div>
                )}

                {/* Feature Content */}
                <div className="flex-1 flex flex-col">
                  {/* Title */}
                  {isFilled.keyText(feature.title) && (
                    <h3 className="text-xl font-semibold mb-4 leading-tight">
                      <PrismicNextLink 
                        field={feature.link}
                        className="text-gray-900 no-underline transition-colors duration-300 hover:text-[#16745f]"
                      >
                        {feature.title}
                      </PrismicNextLink>
                    </h3>
                  )}

                  {/* Description */}
                  {isFilled.richText(feature.description) && (
                    <div className="text-gray-600 mb-6 leading-relaxed flex-1">
                      <PrismicRichText 
                        field={feature.description}
                        components={{
                          paragraph: ({ children }) => <p className="m-0">{children}</p>,
                        }}
                      />
                    </div>
                  )}

                  {/* Features List */}
                  {feature.features && feature.features.length > 0 && (
                    <ul className="list-none p-0 mb-6">
                      {feature.features.map((item: any, itemIndex: number) => (
                        <li key={itemIndex} className="flex items-center gap-3 mb-3 text-sm text-gray-600">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-[#16745f] flex-shrink-0">
                            <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Button */}
                  {isFilled.link(feature.link) && (
                    <div className="mt-auto">
                      <PrismicNextLink
                        field={feature.link}
                        className="inline-block w-full text-center bg-[#16745f] text-white px-6 py-3 rounded-lg no-underline font-medium transition-colors duration-300 hover:bg-[#0d5e4c]"
                      >
                        {feature.buttonText || "Learn More"}
                      </PrismicNextLink>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer CTA */}
        {isFilled.link(slice.primary.footerLink) && (
          <div className={cn("mt-8", getAlignmentClasses())}>
            <PrismicNextLink
              field={slice.primary.footerLink}
              className="inline-block bg-transparent text-[#16745f] px-8 py-3 border-2 border-[#16745f] rounded-lg no-underline font-medium transition-all duration-300 hover:bg-[#16745f] hover:text-white"
            >
              {slice.primary.footerButtonText || "View All Features"}
            </PrismicNextLink>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeatureGrid;
