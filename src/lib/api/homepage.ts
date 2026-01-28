import { asText } from "@prismicio/client";
import { optimizedPrismicClient } from "@/lib/prismic";
import { BannerSlide } from "@/components/banner";
import { BrandValueItem } from "@/features/storefront/components/homepage/brand/types";

export interface HomepageData {
  bannerSlides: BannerSlide[];
  brandSectionTitle: string;
  brandValues: BrandValueItem[];
  meta?: {
    title?: string;
    description?: string;
  };
}

/**
 * Fetches homepage data from Prismic CMS
 * Returns null if no homepage document exists or if there's an error
 */
export async function getHomepageData(): Promise<HomepageData | null> {
  try {
    const homepageDoc = await optimizedPrismicClient.getSingle("homepage");
    const rawData = homepageDoc?.data as any;

    if (!rawData) {
      console.warn("No homepage data found in Prismic");
      return null;
    }

    // Transform banner slides from Prismic format to component format
    const bannerSlides: BannerSlide[] = (rawData.banner_slides || []).map(
      (slide: any, index: number) => ({
        id: index + 1,
        type: slide.slide_type || "image",
        title: slide.title || "",
        subtitle: slide.subtitle || "",
        description: slide.description || "",
        imageUrl: slide.image?.url || "/assets/placeholder-banner.png",
        videoUrl: slide.video_url || undefined,
        ctaText: slide.cta_text || undefined,
        ctaLink: slide.cta_link?.url || undefined,
      })
    );

    // Transform brand values from Prismic format to component format
    const brandValues: BrandValueItem[] = (rawData.brand_values || []).map(
      (item: any, index: number) => ({
        id: String(index + 1),
        title: item.title || "",
        image: item.image?.url || "/assets/placeholder-image.jpeg",
        shortContent: item.short_content || "",
        fullContent: item.full_content ? asText(item.full_content) : "",
      })
    );

    return {
      bannerSlides,
      brandSectionTitle: rawData.brand_section_title || "Giới thiệu về AKA",
      brandValues,
      meta: {
        title: rawData.meta_title,
        description: rawData.meta_description,
      },
    };
  } catch (error) {
    console.error("Error fetching homepage data from Prismic:", error);
    return null;
  }
}
