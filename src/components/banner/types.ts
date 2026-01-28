export interface BannerSlide {
  id: number;
  type: "image" | "video";
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  videoUrl?: string;
  ctaText?: string;
  ctaLink?: string;
  ctaSecondaryText?: string;
  ctaSecondaryLink?: string;
}

export interface FullWidthBannerProps {
  slides?: BannerSlide[];
  className?: string;
}

export interface SlideComponentProps {
  slide: BannerSlide;
  slideIndex: number;
  currentSlide: number;
  isAnimating: boolean;
  isLoaded: boolean;
  loadedImages: Set<string>;
  imageErrors: Set<string>;
}
