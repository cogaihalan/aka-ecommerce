import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { prismicApiService } from "@/lib/api/prismic-service";
import { PrismicPageRenderer } from "@/components/prismic/prismic-page-renderer";
import { PrismicPageSkeleton } from "@/components/prismic/prismic-page-skeleton";

interface DynamicPageProps {
  params: Promise<{ slug: string[] }>;
}

// Generate static params for better performance
export async function generateStaticParams() {
  try {
    const [ pages ] = await Promise.all([
      prismicApiService.getPages(1, 100),
    ]);

    const params = [];

    // Add page routes
    for (const page of pages.results) {
      params.push({ slug: [page.uid] });
    }

    return params;
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: DynamicPageProps): Promise<Metadata> {
  const { slug } = await params;
  const slugPath = slug.join("/");

  try {
      // Handle regular pages
      const page = await prismicApiService.getPageByUID(slugPath);
      if (page) {
        return {
          title: page.data?.meta_title || page.data?.title || "Page",
          description: page.data?.meta_description || "",
          keywords: page.data?.meta_keywords?.join(", ") || "",
          openGraph: {
            title: page.data?.title || "",
            description: page.data?.meta_description || "",
            images: page.data?.featured_image?.url
              ? [page.data.featured_image.url]
              : [],
          },
        };
      }

    return {
      title: "Page Not Found",
      description: "The requested page could not be found.",
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Page",
      description: "Content page",
    };
  }
}

export default async function DynamicPage({ params }: DynamicPageProps) {
  const { slug } = await params;
  const slugPath = slug.join("/");

  try {
    // Handle regular pages
    const page = await prismicApiService.getPageByUID(slugPath);
    if (page) {
      return (
        <Suspense fallback={<PrismicPageSkeleton />}>
          <PrismicPageRenderer content={page} />
        </Suspense>
      );
    }

    // Page not found
    notFound();
  } catch (error) {
    console.error("Error rendering dynamic page:", error);
    notFound();
  }
}

// Enable ISR (Incremental Static Regeneration)
export const revalidate = 3600; // Revalidate every hour
