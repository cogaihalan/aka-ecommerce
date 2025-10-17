"use client";
import React, { FC, useState } from "react";
import { Content, isFilled } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";
import { PrismicNextImage } from "@prismicio/next";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export type TestimonialsProps = SliceComponentProps<any>;

const Testimonials: FC<TestimonialsProps> = ({ slice }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const testimonials = slice.items || [];
  const layout = slice.primary.layout || "carousel";
  const showNavigation = slice.primary.showNavigation !== false;
  const showDots = slice.primary.showDots !== false;
  const autoPlay = slice.primary.autoPlay === true;
  const autoPlayInterval = slice.primary.autoPlayInterval || 5000;
  const showRatings = slice.primary.showRatings !== false;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Auto-play functionality
  React.useEffect(() => {
    if (autoPlay && testimonials.length > 1) {
      const interval = setInterval(nextSlide, autoPlayInterval);
      return () => clearInterval(interval);
    }
  }, [autoPlay, autoPlayInterval, testimonials.length]);

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg
          key={i}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="es-testimonials__star es-testimonials__star--filled"
        >
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
        </svg>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <svg
          key="half"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="es-testimonials__star es-testimonials__star--half"
        >
          <defs>
            <linearGradient id="half-star">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <path
            d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
            fill="url(#half-star)"
          />
        </svg>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg
          key={`empty-${i}`}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className="es-testimonials__star es-testimonials__star--empty"
        >
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
        </svg>
      );
    }

    return stars;
  };

  if (testimonials.length === 0) return null;

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="py-16 px-8 bg-muted text-foreground"
    >
      <div className="mx-auto max-w-4xl sm:max-w-5xl lg:max-w-6xl xl:max-w-7xl">
        {/* Header */}
        {(isFilled.richText(slice.primary.title) ||
          isFilled.richText(slice.primary.subtitle)) && (
          <div className="text-center mb-12">
            {isFilled.richText(slice.primary.title) && (
              <div className="text-4xl font-bold mb-4 text-foreground">
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
              <div className="text-lg text-muted-foreground max-w-2xl mx-auto">
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

        {/* Testimonials Container */}
        <div className="relative">
          {layout === "carousel" ? (
            <>
              {/* Carousel Layout */}
              <div className="relative overflow-hidden rounded-xl">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{
                    transform: `translateX(-${currentIndex * 100}%)`,
                  }}
                >
                  {testimonials.map((testimonial: any, index: number) => (
                    <div key={index} className="flex-none w-full min-w-0">
                      <Card className="text-center h-full flex flex-col justify-between">
                        <CardContent className="p-12">
                          {/* Quote */}
                          {isFilled.richText(testimonial.quote) && (
                            <div className="text-xl leading-relaxed text-muted-foreground mb-8 italic relative">
                              <span className="absolute -top-4 -left-2 text-6xl text-primary font-serif">
                                "
                              </span>
                              <PrismicRichText
                                field={testimonial.quote}
                                components={{
                                  paragraph: ({ children }) => (
                                    <p className="m-0">{children}</p>
                                  ),
                                }}
                              />
                            </div>
                          )}

                          {/* Rating */}
                          {showRatings && testimonial.rating && (
                            <div className="flex justify-center gap-1 mb-8">
                              {renderStars(testimonial.rating)}
                            </div>
                          )}

                          {/* Author */}
                          <div className="flex items-center justify-center gap-4 md:flex-row flex-col">
                            {isFilled.image(testimonial.avatar) && (
                              <div className="w-15 h-15 rounded-full overflow-hidden flex-shrink-0">
                                <PrismicNextImage
                                  field={testimonial.avatar}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}

                            <div className="text-left md:text-center">
                              {isFilled.keyText(testimonial.name) && (
                                <div className="text-lg font-semibold text-foreground mb-1">
                                  {testimonial.name}
                                </div>
                              )}

                              {isFilled.keyText(testimonial.title) && (
                                <div className="text-sm text-primary font-medium mb-1">
                                  {testimonial.title}
                                </div>
                              )}

                              {isFilled.keyText(testimonial.company) && (
                                <div className="text-sm text-muted-foreground">
                                  {testimonial.company}
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>

                {/* Navigation Arrows */}
                {showNavigation && testimonials.length > 1 && (
                  <>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/90 hover:bg-background shadow-lg"
                      onClick={prevSlide}
                      aria-label="Previous testimonial"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M15 18L9 12L15 6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/90 hover:bg-background shadow-lg"
                      onClick={nextSlide}
                      aria-label="Next testimonial"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M9 18L15 12L9 6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Button>
                  </>
                )}
              </div>

              {/* Dots Navigation */}
              {showDots && testimonials.length > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {testimonials.map((_: any, index: number) => (
                    <button
                      key={index}
                      className={cn(
                        "w-3 h-3 rounded-full border-none cursor-pointer transition-colors duration-300",
                        index === currentIndex
                          ? "bg-primary hover:bg-primary/80"
                          : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                      )}
                      onClick={() => goToSlide(index)}
                      aria-label={`Go to testimonial ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            /* Grid Layout */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial: any, index: number) => (
                <Card
                  key={index}
                  className="text-center h-full flex flex-col justify-between"
                >
                  <CardContent className="p-8">
                    {/* Quote */}
                    {isFilled.richText(testimonial.quote) && (
                      <div className="text-lg leading-relaxed text-muted-foreground mb-6 italic relative">
                        <span className="absolute -top-4 -left-2 text-5xl text-primary font-serif">
                          "
                        </span>
                        <PrismicRichText
                          field={testimonial.quote}
                          components={{
                            paragraph: ({ children }) => (
                              <p className="m-0">{children}</p>
                            ),
                          }}
                        />
                      </div>
                    )}

                    {/* Rating */}
                    {showRatings && testimonial.rating && (
                      <div className="flex justify-center gap-1 mb-6">
                        {renderStars(testimonial.rating)}
                      </div>
                    )}

                    {/* Author */}
                    <div className="flex items-center justify-center gap-4 flex-col">
                      {isFilled.image(testimonial.avatar) && (
                        <div className="w-15 h-15 rounded-full overflow-hidden flex-shrink-0">
                          <PrismicNextImage
                            field={testimonial.avatar}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <div className="text-center">
                        {isFilled.keyText(testimonial.name) && (
                          <div className="text-lg font-semibold text-foreground mb-1">
                            {testimonial.name}
                          </div>
                        )}

                        {isFilled.keyText(testimonial.title) && (
                          <div className="text-sm text-primary font-medium mb-1">
                            {testimonial.title}
                          </div>
                        )}

                        {isFilled.keyText(testimonial.company) && (
                          <div className="text-sm text-muted-foreground">
                            {testimonial.company}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
