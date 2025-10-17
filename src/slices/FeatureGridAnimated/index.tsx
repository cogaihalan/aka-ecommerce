import { FC } from "react";
import { isFilled } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";
import { PrismicNextLink, PrismicNextImage } from "@prismicio/next";
import { cn } from "@/lib/utils";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface FeatureItem {
  title?: string;
  description?: any;
  image?: any;
  icon?: any;
  link?: any;
  buttonText?: string;
  features?: string;
}

interface FeatureGridAnimatedProps extends SliceComponentProps<any> {
  slice: {
    slice_type: string;
    variation: string;
    primary: {
      title?: any;
      subtitle?: any;
      columns?: number;
      showIcons?: boolean;
      showImages?: boolean;
      text_alignment?: "left" | "right" | "center";
      footerLink?: any;
      footerButtonText?: string;
    };
    items: FeatureItem[];
  };
}

const FeatureGridAnimated: FC<FeatureGridAnimatedProps> = ({ slice }) => {
  const features = slice.items || [];
  const columns = slice.primary.columns || 3;
  const showIcons = slice.primary.showIcons !== false;
  const showImages = slice.primary.showImages !== false;
  const alignment = slice.primary.text_alignment || "center";

  const { ref, hasIntersected } = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true,
  });

  const getGridColumns = () => {
    const gridMap = {
      1: "grid-cols-1",
      2: "grid-cols-1 md:grid-cols-2",
      3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
    };
    return gridMap[columns as keyof typeof gridMap] || "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
  };

  const getAlignmentClasses = () => {
    const alignmentMap = {
      left: "text-left",
      right: "text-right",
      center: "text-center",
    };
    return alignmentMap[alignment as keyof typeof alignmentMap] || "text-center";
  };

  return (
    <section
      ref={ref}
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="py-8 md:py-16"
    >
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        {(isFilled.richText(slice.primary.title) ||
          isFilled.richText(slice.primary.subtitle)) && (
          <div
            className={cn(
              "mb-12 transition-all duration-700 ease-out",
              getAlignmentClasses(),
              hasIntersected
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            )}
          >
            {isFilled.richText(slice.primary.title) && (
              <div className="mb-6">
                <PrismicRichText
                  field={slice.primary.title}
                  components={{
                    heading1: ({ children }) => (
                      <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
                        {children}
                      </h1>
                    ),
                    heading2: ({ children }) => (
                      <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
                        {children}
                      </h2>
                    ),
                    heading3: ({ children }) => (
                      <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                        {children}
                      </h3>
                    ),
                    heading4: ({ children }) => (
                      <h4 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                        {children}
                      </h4>
                    ),
                    heading5: ({ children }) => (
                      <h5 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">
                        {children}
                      </h5>
                    ),
                    heading6: ({ children }) => (
                      <h6 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
                        {children}
                      </h6>
                    ),
                  }}
                />
              </div>
            )}
            {isFilled.richText(slice.primary.subtitle) && (
              <div
                className={cn(
                  "text-lg text-gray-600 max-w-3xl transition-all duration-500 ease-out",
                  alignment === "center" && "mx-auto"
                )}
              >
                <PrismicRichText
                  field={slice.primary.subtitle}
                  components={{
                    paragraph: ({ children }) => (
                      <p className="leading-relaxed">{children}</p>
                    ),
                  }}
                />
              </div>
            )}
          </div>
        )}

        {/* Features Grid */}
        {features.length > 0 && (
          <div className={cn("grid gap-3 md:gap-4 lg:gap-6 mb-8", getGridColumns())}>
            {features.map((feature: FeatureItem, index: number) => (
              <Card
                key={index}
                disableBlockPadding={true}
                className={cn(
                  "group h-full hover:shadow-md transition-all duration-300",
                  getAlignmentClasses(),
                  hasIntersected
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                )}
                style={{
                  transitionDelay: hasIntersected ? `${index * 100}ms` : "0ms",
                }}
              >
                {/* Feature Image */}
                {showImages && isFilled.image(feature.image) && (
                  <div className="rounded-t-lg overflow-hidden aspect-square bg-gray-100">
                    <PrismicNextLink field={feature.link}>
                      <PrismicNextImage
                        field={feature.image}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        alt=""
                      />
                    </PrismicNextLink>
                  </div>
                )}

                <CardHeader className="pb-4">
                  {/* Feature Icon */}
                  {showIcons && isFilled.image(feature.icon) && (
                    <div className="w-12 h-12 mb-4 flex items-center justify-center bg-primary rounded-lg shadow-sm">
                      <PrismicNextImage
                        field={feature.icon}
                        alt=""
                        className="w-6 h-6 filter brightness-0 invert"
                      />
                    </div>
                  )}

                  {/* Title */}
                  {isFilled.keyText(feature.title) && (
                    <h3 className="text-xl font-semibold leading-tight text-gray-900">
                      <PrismicNextLink
                        field={feature.link}
                        className="text-primary no-underline transition-colors duration-200 hover:text-primary/70"
                      >
                        {feature.title}
                      </PrismicNextLink>
                    </h3>
                  )}
                </CardHeader>

                <CardContent className="flex-1 flex flex-col">
                  {/* Description */}
                  {isFilled.richText(feature.description) && (
                    <div className="text-gray-600 mb-6 leading-relaxed flex-1">
                      <PrismicRichText
                        field={feature.description}
                        components={{
                          paragraph: ({ children }) => (
                            <p className="mb-4 last:mb-0">{children}</p>
                          ),
                        }}
                      />
                    </div>
                  )}

                  {/* Features List */}
                  {feature.features && feature.features.length > 0 && (
                    <ul className="list-none p-0 mb-6 space-y-3">
                      {feature.features
                        .split("\n")
                        .filter((item: string) => item.trim())
                        .map((item: string, itemIndex: number) => (
                          <li
                            key={itemIndex}
                            className="flex items-center gap-3 text-sm text-gray-600"
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              className="text-emerald-600 flex-shrink-0"
                            >
                              <path
                                d="M20 6L9 17L4 12"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            {item.trim()}
                          </li>
                        ))}
                    </ul>
                  )}
                </CardContent>

                {/* Button */}
                {isFilled.link(feature.link) && (
                  <CardFooter className="pt-0 pb-4">
                    <Button
                      asChild
                      className="w-full"
                      variant="default"
                    >
                      <PrismicNextLink field={feature.link}>
                        {feature.buttonText || "Learn More"}
                      </PrismicNextLink>
                    </Button>
                  </CardFooter>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Footer CTA */}
        {isFilled.link(slice.primary.footerLink) && (
          <div
            className={cn(
              "mt-6 md:mt-8 transition-all duration-500 ease-out",
              getAlignmentClasses(),
              hasIntersected
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            )}
          >
            <Button
              asChild
              variant="outline"
              size="lg"
            >
              <PrismicNextLink field={slice.primary.footerLink}>
                {slice.primary.footerButtonText || "View All Features"}
              </PrismicNextLink>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeatureGridAnimated;
