"use client";
import React, { FC, useState } from "react";
import { Content, isFilled } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";
import { PrismicNextLink, PrismicNextImage } from "@prismicio/next";
import { cn } from "@/lib/utils";
import { AnimatedContainer } from "@/components/ui/animated-container";

export type ProductCarouselProps = SliceComponentProps<any>;

const ProductCarousel: FC<ProductCarouselProps> = ({ slice }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const products = slice.items || [];
  const itemsPerView = slice.primary.itemsPerView || 3;
  const showNavigation = slice.primary.showNavigation !== false;
  const showDots = slice.primary.showDots !== false;
  const autoPlay = slice.primary.autoPlay === true;
  const autoPlayInterval = slice.primary.autoPlayInterval || 5000;

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev + itemsPerView >= products.length ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? Math.max(0, products.length - itemsPerView) : prev - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Auto-play functionality
  React.useEffect(() => {
    if (autoPlay && products.length > itemsPerView) {
      const interval = setInterval(nextSlide, autoPlayInterval);
      return () => clearInterval(interval);
    }
  }, [autoPlay, autoPlayInterval, products.length, itemsPerView]);

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="py-16 px-8 bg-white text-gray-900"
    >
      <div className="mx-auto max-w-4xl sm:max-w-5xl lg:max-w-6xl xl:max-w-7xl">
        {/* Header */}
        {(isFilled.richText(slice.primary.title) ||
          isFilled.richText(slice.primary.subtitle)) && (
          <AnimatedContainer
            animation="slideUp"
            delay={0}
            className="text-center mb-12"
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
              <div className="text-lg text-gray-600 max-w-2xl mx-auto">
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
          </AnimatedContainer>
        )}

        {/* Carousel Container */}
        <div className="relative overflow-hidden rounded-lg">
          <div
            className="flex transition-transform duration-500 ease-in-out gap-6"
            style={{
              transform: `translateX(-${(currentIndex * 100) / itemsPerView}%)`,
            }}
          >
            {products.map((product: any, index: number) => (
              <AnimatedContainer
                key={index}
                animation="scaleIn"
                delay={200 + index * 100}
                className={cn(
                  "flex-none min-w-0",
                  itemsPerView === 1 && "w-full",
                  itemsPerView === 2 && "w-1/2 md:w-1/2",
                  itemsPerView === 3 && "w-full sm:w-1/2 lg:w-1/3",
                  itemsPerView === 4 && "w-1/2 lg:w-1/4"
                )}
              >
                <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full flex flex-col group">
                  {isFilled.image(product.image) && (
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <PrismicNextLink field={product.link}>
                        <PrismicNextImage
                          field={product.image}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </PrismicNextLink>
                    </div>
                  )}

                  <div className="p-6 flex-1 flex flex-col">
                    {isFilled.keyText(product.title) && (
                      <h3 className="text-xl font-semibold mb-3 leading-tight">
                        <PrismicNextLink
                          field={product.link}
                          className="text-gray-900 no-underline transition-colors duration-300 hover:text-[#16745f]"
                        >
                          {product.title}
                        </PrismicNextLink>
                      </h3>
                    )}

                    {isFilled.richText(product.description) && (
                      <div className="text-sm text-gray-600 mb-4 flex-1">
                        <PrismicRichText
                          field={product.description}
                          components={{
                            paragraph: ({ children }) => (
                              <p className="m-0">{children}</p>
                            ),
                          }}
                        />
                      </div>
                    )}

                    <div className="flex justify-between items-center mt-auto">
                      {isFilled.keyText(product.price) && (
                        <div className="text-xl font-bold text-[#16745f]">
                          {product.price}
                        </div>
                      )}

                      {isFilled.link(product.link) && (
                        <PrismicNextLink
                          field={product.link}
                          className="bg-[#16745f] text-white px-4 py-2 rounded-md text-sm font-medium no-underline transition-colors duration-300 hover:bg-[#0d5e4c]"
                        >
                          {product.buttonText || "View Product"}
                        </PrismicNextLink>
                      )}
                    </div>
                  </div>
                </div>
              </AnimatedContainer>
            ))}
          </div>

          {/* Navigation Arrows */}
          {showNavigation && products.length > itemsPerView && (
            <>
              <button
                className="absolute top-1/2 -left-6 -translate-y-1/2 bg-white/90 border-none rounded-full w-12 h-12 flex items-center justify-center cursor-pointer transition-all duration-300 z-10 shadow-md hover:bg-white hover:scale-110"
                onClick={prevSlide}
                aria-label="Previous products"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M15 18L9 12L15 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                className="absolute top-1/2 -right-6 -translate-y-1/2 bg-white/90 border-none rounded-full w-12 h-12 flex items-center justify-center cursor-pointer transition-all duration-300 z-10 shadow-md hover:bg-white hover:scale-110"
                onClick={nextSlide}
                aria-label="Next products"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9 18L15 12L9 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Dots Navigation */}
        {showDots && products.length > itemsPerView && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({
              length: Math.ceil(products.length / itemsPerView),
            }).map((_, index) => (
              <button
                key={index}
                className={cn(
                  "w-3 h-3 rounded-full border-none cursor-pointer transition-colors duration-300",
                  Math.floor(currentIndex / itemsPerView) === index
                    ? "bg-[#16745f] hover:bg-[#0d5e4c]"
                    : "bg-gray-300 hover:bg-gray-400"
                )}
                onClick={() => goToSlide(index * itemsPerView)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductCarousel;
