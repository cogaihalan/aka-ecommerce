"use client";
import React, { FC, useState } from "react";
import { Content, isFilled } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";
import { PrismicNextLink, PrismicNextImage } from "@prismicio/next";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export type ImageGalleryProps = SliceComponentProps<any>;

const ImageGallery: FC<ImageGalleryProps> = ({ slice }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const images = slice.items || [];
  const layout = slice.primary.layout || "carousel";
  const showThumbnails = slice.primary.showThumbnails !== false;
  const showNavigation = slice.primary.showNavigation !== false;
  const autoPlay = slice.primary.autoPlay === true;
  const autoPlayInterval = slice.primary.autoPlayInterval || 5000;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const openModal = (index: number) => {
    setCurrentIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Auto-play functionality
  React.useEffect(() => {
    if (autoPlay && images.length > 1) {
      const interval = setInterval(nextSlide, autoPlayInterval);
      return () => clearInterval(interval);
    }
  }, [autoPlay, autoPlayInterval, images.length]);

  if (images.length === 0) return null;

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="py-16 px-8 bg-background text-foreground"
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
              <div className="text-lg text-muted-foreground max-w-2xl mx-auto">
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

        {/* Gallery Container */}
        <div className="relative">
          {layout === "carousel" ? (
            <>
              {/* Main Carousel */}
              <div className="relative overflow-hidden rounded-xl bg-muted">
                <div className="flex transition-transform duration-500 ease-in-out">
                  {images.map((image: any, index: number) => (
                    <div
                      key={index}
                      className={cn(
                        "flex-none w-full transition-opacity duration-500",
                        index === currentIndex ? "opacity-100" : "opacity-0 absolute inset-0"
                      )}
                    >
                      {isFilled.image(image.image) && (
                        <div
                          className="relative aspect-video overflow-hidden cursor-pointer group"
                          onClick={() => openModal(index)}
                        >
                          <PrismicNextImage
                            field={image.image}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          {isFilled.keyText(image.caption) && (
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white p-6">
                              <p className="text-sm font-medium">{image.caption}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Navigation Arrows */}
                {showNavigation && images.length > 1 && (
                  <>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/90 hover:bg-background shadow-lg"
                      onClick={prevSlide}
                      aria-label="Previous image"
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
                      aria-label="Next image"
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

              {/* Thumbnails */}
              {showThumbnails && images.length > 1 && (
                <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                  {images.map((image: any, index: number) => (
                    <button
                      key={index}
                      className={cn(
                        "flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300",
                        index === currentIndex
                          ? "border-primary shadow-md"
                          : "border-border hover:border-primary/50"
                      )}
                      onClick={() => goToSlide(index)}
                      aria-label={`View image ${index + 1}`}
                    >
                      {isFilled.image(image.image) && (
                        <PrismicNextImage
                          field={image.image}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Dots Navigation */}
              {!showThumbnails && images.length > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  {images.map((_: any, index: number) => (
                    <button
                      key={index}
                      className={cn(
                        "w-3 h-3 rounded-full transition-colors duration-300",
                        index === currentIndex
                          ? "bg-primary"
                          : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                      )}
                      onClick={() => goToSlide(index)}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            /* Grid Layout */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((image: any, index: number) => (
                <Card key={index} className="overflow-hidden group cursor-pointer" onClick={() => openModal(index)}>
                  {isFilled.image(image.image) && (
                    <div className="relative aspect-video overflow-hidden">
                      <PrismicNextImage
                        field={image.image}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {isFilled.keyText(image.caption) && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white p-4">
                          <p className="text-sm font-medium">{image.caption}</p>
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div
            className="relative max-w-4xl max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="outline"
              size="icon"
              className="absolute -top-12 right-0 bg-background/90 hover:bg-background"
              onClick={closeModal}
              aria-label="Close modal"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Button>

            {images.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/90 hover:bg-background"
                  onClick={prevSlide}
                  aria-label="Previous image"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
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
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/90 hover:bg-background"
                  onClick={nextSlide}
                  aria-label="Next image"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
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

            {isFilled.image(images[currentIndex]?.image) && (
              <div className="relative">
                <PrismicNextImage
                  field={images[currentIndex].image}
                  className="max-w-full max-h-[80vh] object-contain rounded-lg"
                />
                {isFilled.keyText(images[currentIndex]?.caption) && (
                  <div className="absolute -bottom-12 left-0 right-0 bg-black/80 text-white p-4 rounded-lg text-center">
                    <p className="text-sm">{images[currentIndex].caption}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default ImageGallery;
