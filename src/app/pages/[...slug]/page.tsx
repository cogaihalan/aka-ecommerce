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
      // prismicApiService.getStaticPages(),
      // prismicApiService.getBlogPosts(1, 100),
    ]);

    const params = [];

    // Add page routes
    for (const page of pages.results) {
      params.push({ slug: [page.uid] });
    }

    // Add static page routes
    // for (const page of staticPages) {
    //   params.push({ slug: [page.uid] });
    // }

    // Add blog post routes
    // for (const post of blogPosts.results) {
    //   params.push({ slug: ["blog", post.uid] });
    // }

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
  // const { slug } = await params;
  // const slugPath = slug.join("/");

  try {
    //   // Handle blog posts
    //   if (slug[0] === "blog" && slug.length === 2) {
    //     const post = await prismicApiService.getBlogPostByUID(slug[1]);
    //     if (post) {
    //       return {
    //         title: post.data?.meta_title || post.data?.title || "Blog Post",
    //         description: post.data?.meta_description || post.data?.excerpt || "",
    //         keywords: post.data?.tags?.join(", ") || "",
    //         openGraph: {
    //           title: post.data?.title || "",
    //           description: post.data?.excerpt || "",
    //           images: post.data?.featured_image?.url
    //             ? [post.data.featured_image.url]
    //             : [],
    //         },
    //       };
    //     }
    //   }

    //   // Handle regular pages
    //   const page = await prismicApiService.getPageByUID(slugPath);
    //   if (page) {
    //     return {
    //       title: page.data?.meta_title || page.data?.title || "Page",
    //       description: page.data?.meta_description || "",
    //       keywords: page.data?.meta_keywords?.join(", ") || "",
    //       openGraph: {
    //         title: page.data?.title || "",
    //         description: page.data?.meta_description || "",
    //         images: page.data?.featured_image?.url
    //           ? [page.data.featured_image.url]
    //           : [],
    //       },
    //     };
    //   }

    //   // Handle static pages
    //   const staticPage = await prismicApiService.getStaticPageByUID(slugPath);
    //   if (staticPage) {
    //     return {
    //       title: staticPage.data?.meta_title || staticPage.data?.title || "Page",
    //       description: staticPage.data?.meta_description || "",
    //       openGraph: {
    //         title: staticPage.data?.title || "",
    //         description: staticPage.data?.meta_description || "",
    //       },
    //     };
    //   }

    return {
      title: "Page",
      description: "Content page",
    };
    // return {
    //   title: "Page Not Found",
    //   description: "The requested page could not be found.",
    // };
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
          <PrismicPageRenderer content={page} type="page" />
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
