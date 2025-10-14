"use client";
import React, { FC, useState } from "react";
import { Content, isFilled } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";
import { PrismicNextLink, PrismicNextImage } from "@prismicio/next";

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
      className="es-bounded es-image-gallery"
    >
      <div className="es-bounded__content es-image-gallery__content">
        {/* Header */}
        {(isFilled.richText(slice.primary.title) ||
          isFilled.richText(slice.primary.subtitle)) && (
          <div className="es-image-gallery__header">
            {isFilled.richText(slice.primary.title) && (
              <div className="es-image-gallery__title">
                <PrismicRichText field={slice.primary.title} />
              </div>
            )}
            {isFilled.richText(slice.primary.subtitle) && (
              <div className="es-image-gallery__subtitle">
                <PrismicRichText field={slice.primary.subtitle} />
              </div>
            )}
          </div>
        )}

        {/* Gallery Container */}
        <div
          className={`es-image-gallery__container es-image-gallery__container--${layout}`}
        >
          {layout === "carousel" ? (
            <>
              {/* Main Carousel */}
              <div className="es-image-gallery__main">
                <div className="es-image-gallery__track">
                  {images.map((image: any, index: number) => (
                    <div
                      key={index}
                      className={`es-image-gallery__slide ${
                        index === currentIndex
                          ? "es-image-gallery__slide--active"
                          : ""
                      }`}
                    >
                      {isFilled.image(image.image) && (
                        <div
                          className="es-image-gallery__image-container"
                          onClick={() => openModal(index)}
                        >
                          <PrismicNextImage
                            field={image.image}
                            className="es-image-gallery__image"
                          />
                          {isFilled.keyText(image.caption) && (
                            <div className="es-image-gallery__caption">
                              {image.caption}
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
                    <button
                      className="es-image-gallery__nav es-image-gallery__nav--prev"
                      onClick={prevSlide}
                      aria-label="Previous image"
                    >
                      <svg
                        width="24"
                        height="24"
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
                    </button>
                    <button
                      className="es-image-gallery__nav es-image-gallery__nav--next"
                      onClick={nextSlide}
                      aria-label="Next image"
                    >
                      <svg
                        width="24"
                        height="24"
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
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {showThumbnails && images.length > 1 && (
                <div className="es-image-gallery__thumbnails">
                  {images.map((image: any, index: number) => (
                    <button
                      key={index}
                      className={`es-image-gallery__thumbnail ${
                        index === currentIndex
                          ? "es-image-gallery__thumbnail--active"
                          : ""
                      }`}
                      onClick={() => goToSlide(index)}
                      aria-label={`View image ${index + 1}`}
                    >
                      {isFilled.image(image.image) && (
                        <PrismicNextImage
                          field={image.image}
                          className="es-image-gallery__thumbnail-image"
                        />
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Dots Navigation */}
              {!showThumbnails && images.length > 1 && (
                <div className="es-image-gallery__dots">
                  {images.map((_: any, index: number) => (
                    <button
                      key={index}
                      className={`es-image-gallery__dot ${
                        index === currentIndex
                          ? "es-image-gallery__dot--active"
                          : ""
                      }`}
                      onClick={() => goToSlide(index)}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            /* Grid Layout */
            <div className="es-image-gallery__grid">
              {images.map((image: any, index: number) => (
                <div key={index} className="es-image-gallery__grid-item">
                  {isFilled.image(image.image) && (
                    <div
                      className="es-image-gallery__grid-image-container"
                      onClick={() => openModal(index)}
                    >
                      <PrismicNextImage
                        field={image.image}
                        className="es-image-gallery__grid-image"
                      />
                      {isFilled.keyText(image.caption) && (
                        <div className="es-image-gallery__grid-caption">
                          {image.caption}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="es-image-gallery__modal" onClick={closeModal}>
          <div
            className="es-image-gallery__modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="es-image-gallery__modal-close"
              onClick={closeModal}
              aria-label="Close modal"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {images.length > 1 && (
              <>
                <button
                  className="es-image-gallery__modal-nav es-image-gallery__modal-nav--prev"
                  onClick={prevSlide}
                  aria-label="Previous image"
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
                  className="es-image-gallery__modal-nav es-image-gallery__modal-nav--next"
                  onClick={nextSlide}
                  aria-label="Next image"
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

            {isFilled.image(images[currentIndex]?.image) && (
              <div className="es-image-gallery__modal-image-container">
                <PrismicNextImage
                  field={images[currentIndex].image}
                  className="es-image-gallery__modal-image"
                />
                {isFilled.keyText(images[currentIndex]?.caption) && (
                  <div className="es-image-gallery__modal-caption">
                    {images[currentIndex].caption}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <style>
        {`
          .es-bounded {
            padding: 8vw 2rem;
          }

          .es-bounded__content {
            margin-left: auto;
            margin-right: auto;
            max-width: 90%;
          }

          @media screen and (min-width: 640px) {
            .es-bounded__content {
              max-width: 85%;
            }
          }

          @media screen and (min-width: 896px) {
            .es-bounded__content {
              max-width: 80%;
            }
          }

          @media screen and (min-width: 1280px) {
            .es-bounded__content {
              max-width: 75%;
            }
          }

          .es-image-gallery {
            font-family: system-ui, sans-serif;
            background-color: #fff;
            color: #333;
          }

          .es-image-gallery__header {
            text-align: center;
            margin-bottom: 3rem;
          }

          .es-image-gallery__title {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 1rem;
            color: #1a1a1a;
          }

          .es-image-gallery__title * {
            margin: 0;
          }

          .es-image-gallery__subtitle {
            font-size: 1.125rem;
            color: #666;
            max-width: 600px;
            margin: 0 auto;
          }

          .es-image-gallery__subtitle * {
            margin: 0;
          }

          .es-image-gallery__container {
            position: relative;
          }

          .es-image-gallery__main {
            position: relative;
            overflow: hidden;
            border-radius: 0.75rem;
            background: #f8f9fa;
          }

          .es-image-gallery__track {
            display: flex;
            transition: transform 0.5s ease-in-out;
          }

          .es-image-gallery__slide {
            flex: 0 0 100%;
            opacity: 0;
            transition: opacity 0.5s ease-in-out;
          }

          .es-image-gallery__slide--active {
            opacity: 1;
          }

          .es-image-gallery__image-container {
            position: relative;
            cursor: pointer;
            aspect-ratio: 16/9;
            overflow: hidden;
          }

          .es-image-gallery__image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s ease;
          }

          .es-image-gallery__image-container:hover .es-image-gallery__image {
            transform: scale(1.05);
          }

          .es-image-gallery__caption {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
            color: white;
            padding: 2rem 1.5rem 1.5rem;
            font-size: 1rem;
          }

          .es-image-gallery__nav {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(255, 255, 255, 0.9);
            border: none;
            border-radius: 50%;
            width: 48px;
            height: 48px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
            z-index: 10;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          }

          .es-image-gallery__nav:hover {
            background: rgba(255, 255, 255, 1);
            transform: translateY(-50%) scale(1.1);
          }

          .es-image-gallery__nav--prev {
            left: 1rem;
          }

          .es-image-gallery__nav--next {
            right: 1rem;
          }

          .es-image-gallery__thumbnails {
            display: flex;
            gap: 0.75rem;
            margin-top: 1rem;
            overflow-x: auto;
            padding: 0.5rem 0;
          }

          .es-image-gallery__thumbnail {
            flex: 0 0 80px;
            height: 60px;
            border: 2px solid transparent;
            border-radius: 0.5rem;
            overflow: hidden;
            cursor: pointer;
            transition: all 0.3s ease;
            background: none;
            padding: 0;
          }

          .es-image-gallery__thumbnail:hover {
            border-color: #16745f;
          }

          .es-image-gallery__thumbnail--active {
            border-color: #16745f;
          }

          .es-image-gallery__thumbnail-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .es-image-gallery__dots {
            display: flex;
            justify-content: center;
            gap: 0.5rem;
            margin-top: 1rem;
          }

          .es-image-gallery__dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            border: none;
            background-color: #d1d5db;
            cursor: pointer;
            transition: background-color 0.3s ease;
          }

          .es-image-gallery__dot--active {
            background-color: #16745f;
          }

          .es-image-gallery__grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1rem;
          }

          .es-image-gallery__grid-item {
            aspect-ratio: 4/3;
            overflow: hidden;
            border-radius: 0.5rem;
            cursor: pointer;
            transition: transform 0.3s ease;
          }

          .es-image-gallery__grid-item:hover {
            transform: scale(1.02);
          }

          .es-image-gallery__grid-image-container {
            position: relative;
            width: 100%;
            height: 100%;
          }

          .es-image-gallery__grid-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s ease;
          }

          .es-image-gallery__grid-item:hover .es-image-gallery__grid-image {
            transform: scale(1.1);
          }

          .es-image-gallery__grid-caption {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
            color: white;
            padding: 1.5rem 1rem 1rem;
            font-size: 0.875rem;
          }

          .es-image-gallery__modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            padding: 2rem;
          }

          .es-image-gallery__modal-content {
            position: relative;
            max-width: 90vw;
            max-height: 90vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .es-image-gallery__modal-close {
            position: absolute;
            top: -3rem;
            right: 0;
            background: rgba(255, 255, 255, 0.9);
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 1001;
          }

          .es-image-gallery__modal-nav {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(255, 255, 255, 0.9);
            border: none;
            border-radius: 50%;
            width: 48px;
            height: 48px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 1001;
          }

          .es-image-gallery__modal-nav--prev {
            left: -2rem;
          }

          .es-image-gallery__modal-nav--next {
            right: -2rem;
          }

          .es-image-gallery__modal-image-container {
            position: relative;
            max-width: 100%;
            max-height: 100%;
          }

          .es-image-gallery__modal-image {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
          }

          .es-image-gallery__modal-caption {
            position: absolute;
            bottom: -3rem;
            left: 0;
            right: 0;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 1rem;
            border-radius: 0.5rem;
            text-align: center;
          }

          @media (max-width: 768px) {
            .es-image-gallery__nav {
              display: none;
            }
            
            .es-image-gallery__modal-nav {
              display: none;
            }
          }
        `}
      </style>
    </section>
  );
};

export default ImageGallery;
