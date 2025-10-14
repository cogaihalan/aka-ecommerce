import { FC } from "react";
import { isFilled } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";
import { PrismicNextLink, PrismicNextImage } from "@prismicio/next";
import { cn } from "@/lib/utils";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";

export type FeatureGridAnimatedProps = SliceComponentProps<any>;

const FeatureGridAnimated: FC<FeatureGridAnimatedProps> = ({ slice }) => {
  const features = slice.items || [];
  const columns = slice.primary.columns || 3;
  const showIcons = slice.primary.showIcons !== false;
  const showImages = slice.primary.showImages !== false;
  const alignment = slice.primary.alignment || "center";

  const { ref, hasIntersected } = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true,
  });

  const getGridColumns = () => {
    switch (columns) {
      case 1:
        return "grid-cols-1";
      case 2:
        return "grid-cols-1 md:grid-cols-2";
      case 3:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
      case 4:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";
      default:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
    }
  };

  const getAlignmentClasses = () => {
    switch (alignment) {
      case "left":
        return "text-left";
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
      className="py-16 px-8 bg-white text-gray-900"
    >
      <div className="mx-auto max-w-4xl sm:max-w-5xl lg:max-w-6xl xl:max-w-7xl">
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
              <div className="text-4xl font-bold mb-4 text-gray-900">
                <PrismicRichText
                  field={slice.primary.title}
                  components={{
                    heading1: ({ children }) => (
                      <h1 className="m-0">{children}</h1>
                    ),
                    heading2: ({ children }) => (
                      <h2 className="m-0">{children}</h2>
                    ),
                    heading3: ({ children }) => (
                      <h3 className="m-0">{children}</h3>
                    ),
                    heading4: ({ children }) => (
                      <h4 className="m-0">{children}</h4>
                    ),
                    heading5: ({ children }) => (
                      <h5 className="m-0">{children}</h5>
                    ),
                    heading6: ({ children }) => (
                      <h6 className="m-0">{children}</h6>
                    ),
                  }}
                />
              </div>
            )}
            {isFilled.richText(slice.primary.subtitle) && (
              <div
                className={cn(
                  "text-lg text-gray-600 max-w-2xl transition-all duration-500 ease-out",
                  alignment === "center" && "mx-auto",
                  hasIntersected
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                )}
                style={{ transitionDelay: hasIntersected ? "200ms" : "0ms" }}
              >
                <PrismicRichText
                  field={slice.primary.subtitle}
                  components={{
                    paragraph: ({ children }) => (
                      <p className="m-0">{children}</p>
                    ),
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
                  getAlignmentClasses(),
                  "opacity-0 translate-y-8",
                  hasIntersected && "opacity-100 translate-y-0"
                )}
                style={{
                  transitionDelay: hasIntersected
                    ? `${300 + index * 100}ms`
                    : "0ms",
                  transitionDuration: "500ms",
                }}
              >
                {/* Feature Image */}
                {showImages && isFilled.image(feature.image) && (
                  <div className="mb-6 rounded-lg overflow-hidden aspect-video">
                    <PrismicNextLink field={feature.link}>
                      <PrismicNextImage
                        field={feature.image}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        alt={""}
                      />
                    </PrismicNextLink>
                  </div>
                )}

                {/* Feature Icon */}
                {showIcons && isFilled.image(feature.icon) && (
                  <div
                    className={cn(
                      "w-16 h-16 mb-6 flex items-center justify-center bg-gradient-to-br from-[#16745f] to-[#0d5e4c] rounded-xl shadow-md transition-all duration-500",
                      "opacity-0 scale-75",
                      hasIntersected && "opacity-100 scale-100"
                    )}
                    style={{
                      transitionDelay: hasIntersected
                        ? `${400 + index * 100}ms`
                        : "0ms",
                    }}
                  >
                    <PrismicNextImage
                      field={feature.icon}
                      alt={""}
                      className="w-8 h-8 filter brightness-0 invert"
                    />
                  </div>
                )}

                {/* Feature Content */}
                <div className="flex-1 flex flex-col">
                  {/* Title */}
                  {isFilled.keyText(feature.title) && (
                    <h3
                      className={cn(
                        "text-xl font-semibold mb-4 leading-tight transition-all duration-500",
                        "opacity-0 translate-y-4",
                        hasIntersected && "opacity-100 translate-y-0"
                      )}
                      style={{
                        transitionDelay: hasIntersected
                          ? `${500 + index * 100}ms`
                          : "0ms",
                      }}
                    >
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
                    <div
                      className={cn(
                        "text-gray-600 mb-6 leading-relaxed flex-1 transition-all duration-500",
                        "opacity-0 translate-y-4",
                        hasIntersected && "opacity-100 translate-y-0"
                      )}
                      style={{
                        transitionDelay: hasIntersected
                          ? `${600 + index * 100}ms`
                          : "0ms",
                      }}
                    >
                      <PrismicRichText
                        field={feature.description}
                        components={{
                          paragraph: ({ children }) => (
                            <p className="m-0">{children}</p>
                          ),
                        }}
                      />
                    </div>
                  )}

                  {/* Features List */}
                  {feature.features && feature.features.length > 0 && (
                    <ul
                      className={cn(
                        "list-none p-0 mb-6 transition-all duration-500",
                        "opacity-0 translate-y-4",
                        hasIntersected && "opacity-100 translate-y-0"
                      )}
                      style={{
                        transitionDelay: hasIntersected
                          ? `${700 + index * 100}ms`
                          : "0ms",
                      }}
                    >
                      {feature.features
                        .split("/n")
                        .map((item: any, itemIndex: number) => (
                          <li
                            key={itemIndex}
                            className={cn(
                              "flex items-center gap-3 mb-3 text-sm text-gray-600 transition-all duration-300",
                              "opacity-0 translate-x-4",
                              hasIntersected && "opacity-100 translate-x-0"
                            )}
                            style={{
                              transitionDelay: hasIntersected
                                ? `${800 + index * 100 + itemIndex * 50}ms`
                                : "0ms",
                            }}
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              className="text-[#16745f] flex-shrink-0"
                            >
                              <path
                                d="M20 6L9 17L4 12"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            {item}
                          </li>
                        ))}
                    </ul>
                  )}

                  {/* Button */}
                  {isFilled.link(feature.link) && (
                    <div
                      className={cn(
                        "mt-auto transition-all duration-500",
                        "opacity-0 translate-y-4",
                        hasIntersected && "opacity-100 translate-y-0"
                      )}
                      style={{
                        transitionDelay: hasIntersected
                          ? `${900 + index * 100}ms`
                          : "0ms",
                      }}
                    >
                      <PrismicNextLink
                        field={feature.link}
                        className="inline-block w-full text-center bg-[#16745f] text-white px-6 py-3 rounded-lg no-underline font-medium transition-all duration-300 hover:bg-[#0d5e4c] hover:scale-105 hover:shadow-lg"
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
          <div
            className={cn(
              "mt-8 transition-all duration-700 ease-out",
              getAlignmentClasses(),
              "opacity-0 translate-y-8",
              hasIntersected && "opacity-100 translate-y-0"
            )}
            style={{
              transitionDelay: hasIntersected
                ? `${1000 + features.length * 100}ms`
                : "0ms",
            }}
          >
            <PrismicNextLink
              field={slice.primary.footerLink}
              className="inline-block bg-transparent text-[#16745f] px-8 py-3 border-2 border-[#16745f] rounded-lg no-underline font-medium transition-all duration-300 hover:bg-[#16745f] hover:text-white hover:scale-105 hover:shadow-lg"
            >
              {slice.primary.footerButtonText || "View All Features"}
            </PrismicNextLink>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeatureGridAnimated;
