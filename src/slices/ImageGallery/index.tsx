"use client";
import { FC, useState, useEffect, useRef } from "react";
import { isFilled, Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { PrismicNextImage } from "@prismicio/next";
import { HeadingField, RichTextField } from "@/components/prismic/fields";
import { GliderContainer } from "@/components/ui/glider-container";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export type ImageGalleryProps = SliceComponentProps<Content.ImageGallerySlice>;

const ImageGallery: FC<ImageGalleryProps> = ({ slice }) => {
  const images = slice.items || [];
  const layout = slice.primary.layout || "carousel";
  const showThumbnails = slice.primary.showThumbnails !== false;
  const showNavigation = slice.primary.showNavigation !== false;
  const autoPlay = slice.primary.autoPlay === true;
  const autoPlayInterval = slice.primary.autoPlayInterval || 5000;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const gliderRef = useRef<any>(null);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-play functionality
  useEffect(() => {
    if (autoPlay && layout === "carousel" && images.length > 0) {
      autoPlayTimerRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % images.length);
        if (gliderRef.current) {
          gliderRef.current.scrollItem((currentSlide + 1) % images.length);
        }
      }, autoPlayInterval);

      return () => {
        if (autoPlayTimerRef.current) {
          clearInterval(autoPlayTimerRef.current);
        }
      };
    }
  }, [autoPlay, layout, images.length, autoPlayInterval, currentSlide]);

  const openModal = (index: number) => {
    setModalImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const nextModalImage = () => {
    setModalImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevModalImage = () => {
    setModalImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Handle keyboard navigation in modal
  useEffect(() => {
    if (!isModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowRight") nextModalImage();
      if (e.key === "ArrowLeft") prevModalImage();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen, modalImageIndex, images.length]);

  if (images.length === 0) {
    return null;
  }

  // Render Carousel Layout
  if (layout === "carousel") {
    return (
      <>
        <section
          data-slice-type={slice.slice_type}
          data-slice-variation={slice.variation}
          className="py-8 md:py-16 bg-background text-foreground"
        >
          <div className="mx-auto max-w-7xl px-4">
            {/* Header */}
            {(isFilled.richText(slice.primary.title) ||
              isFilled.richText(slice.primary.subtitle)) && (
              <div className="text-center mb-8 md:mb-12">
                {isFilled.richText(slice.primary.title) && (
                  <HeadingField
                    field={slice.primary.title}
                    className="text-3xl md:text-4xl font-bold mb-4"
                  />
                )}
                {isFilled.richText(slice.primary.subtitle) && (
                  <RichTextField
                    field={slice.primary.subtitle}
                    className="text-lg text-muted-foreground max-w-2xl mx-auto"
                  />
                )}
              </div>
            )}

            {/* Main Carousel */}
            <div className="relative mb-4">
              <GliderContainer
                ref={gliderRef}
                settings={{
                  hasArrows: false,
                  hasDots: false,
                  slidesToShow: 1,
                  slidesToScroll: 1,
                  draggable: true,
                  duration: 0.8,
                  autoPlay: false, // We handle autoPlay manually
                  onSlideVisible: (event: any) => {
                    if (event && typeof event.slide === "number") {
                      setCurrentSlide(event.slide);
                    }
                  },
                }}
                className="image-gallery-carousel"
                slideClassName="image-gallery-slide"
              >
                {images.map((item, index) => (
                  <div
                    key={index}
                    className="relative group cursor-pointer"
                    onClick={() => openModal(index)}
                  >
                    {isFilled.image(item.image) && (
                      <div className="relative overflow-hidden rounded-lg">
                        <PrismicNextImage
                          field={item.image}
                          className="w-full h-auto max-h-[600px] object-cover transition-all duration-500 ease-in-out"
                          alt={""}
                        />
                        {item.caption && (
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white transition-opacity duration-300">
                            <p className="text-sm md:text-base">{item.caption}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </GliderContainer>

              {/* Custom Navigation Arrows */}
              {showNavigation && images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      const prev = (currentSlide - 1 + images.length) % images.length;
                      setCurrentSlide(prev);
                      if (gliderRef.current) {
                        gliderRef.current.scrollItem(prev);
                      }
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/90 hover:bg-white shadow-lg transition-all duration-300 ease-in-out hover:scale-110"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-800" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const next = (currentSlide + 1) % images.length;
                      setCurrentSlide(next);
                      if (gliderRef.current) {
                        gliderRef.current.scrollItem(next);
                      }
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/90 hover:bg-white shadow-lg transition-all duration-300 ease-in-out hover:scale-110"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-6 h-6 text-gray-800" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {showThumbnails && images.length > 1 && (
              <div className="flex gap-2 justify-center overflow-x-auto pb-2">
                {images.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentSlide(index);
                      if (gliderRef.current) {
                        gliderRef.current.scrollItem(index);
                      }
                    }}
                    className={cn(
                      "flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden border-2 transition-all duration-300 ease-in-out",
                      currentSlide === index
                        ? "border-primary shadow-lg opacity-100"
                        : "border-transparent opacity-60 hover:opacity-100"
                    )}
                  >
                    {isFilled.image(item.image) && (
                      <PrismicNextImage
                        field={item.image}
                        className="w-full h-full object-cover transition-transform duration-300 ease-in-out"
                        alt={""}
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Modal */}
        {isModalOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
            <div
              className="relative max-w-7xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {isFilled.image(images[modalImageIndex]?.image) && (
                <PrismicNextImage
                  field={images[modalImageIndex].image}
                  className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
                  alt={""}
                />
              )}
              {images[modalImageIndex]?.caption && (
                <div className="mt-4 text-center text-white">
                  <p className="text-lg">{images[modalImageIndex].caption}</p>
                </div>
              )}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevModalImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-8 h-8" />
                  </button>
                  <button
                    onClick={nextModalImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-8 h-8" />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
                    {modalImageIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </>
    );
  }

  // Render Masonry Layout
  if (layout === "mansory") {
    // Distribute images into 4 columns for masonry effect
    const columns = 4;
    const columnImages: Array<{ item: typeof images[0]; originalIndex: number }[]> = Array.from(
      { length: columns },
      () => []
    );

    images.forEach((image, index) => {
      columnImages[index % columns].push({ item: image, originalIndex: index });
    });

    return (
      <>
        <section
          data-slice-type={slice.slice_type}
          data-slice-variation={slice.variation}
          className="py-8 md:py-16 bg-background text-foreground"
        >
          <div className="mx-auto max-w-7xl px-4">
            {/* Header */}
            {(isFilled.richText(slice.primary.title) ||
              isFilled.richText(slice.primary.subtitle)) && (
              <div className="text-center mb-8 md:mb-12">
                {isFilled.richText(slice.primary.title) && (
                  <HeadingField
                    field={slice.primary.title}
                    className="text-3xl md:text-4xl font-bold mb-4"
                  />
                )}
                {isFilled.richText(slice.primary.subtitle) && (
                  <RichTextField
                    field={slice.primary.subtitle}
                    className="text-lg text-muted-foreground max-w-2xl mx-auto"
                  />
                )}
              </div>
            )}

            {/* Masonry Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {columnImages.map((column, colIndex) => (
                <div key={colIndex} className="grid gap-4">
                  {column.map(({ item, originalIndex }) => (
                    <div
                      key={originalIndex}
                      className="relative group cursor-pointer overflow-hidden rounded-lg"
                      onClick={() => openModal(originalIndex)}
                    >
                      {isFilled.image(item.image) && (
                        <>
                          <PrismicNextImage
                            field={item.image}
                            className="w-full h-auto object-cover transition-transform duration-300"
                            alt={""}
                          />
                          {item.caption && (
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-end">
                              <p className="text-white text-sm p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                {item.caption}
                              </p>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Modal */}
        {isModalOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
            <div
              className="relative max-w-7xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {isFilled.image(images[modalImageIndex]?.image) && (
                <PrismicNextImage
                  field={images[modalImageIndex].image}
                  className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
                  alt={""}
                />
              )}
              {images[modalImageIndex]?.caption && (
                <div className="mt-4 text-center text-white">
                  <p className="text-lg">{images[modalImageIndex].caption}</p>
                </div>
              )}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevModalImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-8 h-8" />
                  </button>
                  <button
                    onClick={nextModalImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-8 h-8" />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
                    {modalImageIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </>
    );
  }

  // Render Featured Layout
  if (layout === "featured") {
    const featuredImage = images[0];
    const otherImages = images.slice(1);

    return (
      <>
        <section
          data-slice-type={slice.slice_type}
          data-slice-variation={slice.variation}
          className="py-8 md:py-16 bg-background text-foreground"
        >
          <div className="mx-auto max-w-7xl px-4">
            {/* Header */}
            {(isFilled.richText(slice.primary.title) ||
              isFilled.richText(slice.primary.subtitle)) && (
              <div className="text-center mb-8 md:mb-12">
                {isFilled.richText(slice.primary.title) && (
                  <HeadingField
                    field={slice.primary.title}
                    className="text-3xl md:text-4xl font-bold mb-4"
                  />
                )}
                {isFilled.richText(slice.primary.subtitle) && (
                  <RichTextField
                    field={slice.primary.subtitle}
                    className="text-lg text-muted-foreground max-w-2xl mx-auto"
                  />
                )}
              </div>
            )}

            {/* Featured Layout */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {/* Featured Image - Large */}
              {isFilled.image(featuredImage?.image) && (
                <div
                  className="relative group cursor-pointer col-span-2 row-span-2 overflow-hidden rounded-lg"
                  onClick={() => openModal(0)}
                >
                  <PrismicNextImage
                    field={featuredImage.image}
                    className="w-full h-full object-cover transition-transform duration-300"
                    alt={""}
                  />
                  {featuredImage?.caption && (
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-end">
                      <p className="text-white text-base md:text-lg p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {featuredImage.caption}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Other Images */}
              {otherImages.slice(0, 4).map((item, index) => (
                <div
                  key={index + 1}
                  className="relative group cursor-pointer overflow-hidden rounded-lg"
                  onClick={() => openModal(index + 1)}
                >
                  {isFilled.image(item.image) && (
                    <>
                      <PrismicNextImage
                        field={item.image}
                        className="w-full h-auto object-cover transition-transform duration-300"
                        alt={""}
                      />
                      {item.caption && (
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-end">
                          <p className="text-white text-sm p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {item.caption}
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Additional Images Grid (if more than 5 images) */}
            {otherImages.length > 4 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {otherImages.slice(4).map((item, index) => (
                  <div
                    key={index + 5}
                    className="relative group cursor-pointer overflow-hidden rounded-lg"
                    onClick={() => openModal(index + 5)}
                  >
                    {isFilled.image(item.image) && (
                      <>
                        <PrismicNextImage
                          field={item.image}
                          className="w-full h-auto object-cover transition-transform duration-300"
                          alt={""}
                        />
                        {item.caption && (
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-end">
                            <p className="text-white text-sm p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              {item.caption}
                            </p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Modal */}
        {isModalOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
            <div
              className="relative max-w-7xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {isFilled.image(images[modalImageIndex]?.image) && (
                <PrismicNextImage
                  field={images[modalImageIndex].image}
                  className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
                  alt={""}
                />
              )}
              {images[modalImageIndex]?.caption && (
                <div className="mt-4 text-center text-white">
                  <p className="text-lg">{images[modalImageIndex].caption}</p>
                </div>
              )}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevModalImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-8 h-8" />
                  </button>
                  <button
                    onClick={nextModalImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-8 h-8" />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
                    {modalImageIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};

export default ImageGallery;

