import { PrismicDocument } from "@prismicio/client";

// Page content type
export interface PrismicPage extends PrismicDocument {
  type: "page";
  // data: {
  //   title: string;
  //   content: any; // Rich text content
  //   slug: string;
  //   meta_title?: string;
  //   meta_description?: string;
  //   meta_keywords?: string[];
  //   featured_image?: {
  //     url: string;
  //     alt: string;
  //   };
  //   status: "draft" | "published";
  //   published_date?: string;
  //   last_modified?: string;
  // };
}

// Homepage content type
export interface PrismicHomepage extends PrismicDocument {
  type: "homepage";
  data: {
    title: string;
    hero_title: string;
    hero_description: string;
    hero_image: {
      url: string;
      alt: string;
    };
    featured_products: any[];
    meta_title?: string;
    meta_description?: string;
  };
}

// Category content type
export interface PrismicCategory extends PrismicDocument {
  type: "category";
  data: {
    name: string;
    slug: string;
    description: string;
    image?: {
      url: string;
      alt: string;
    };
    parent_category?: {
      id: string;
      type: string;
    };
    meta_title?: string;
    meta_description?: string;
  };
}

// Blog post content type
export interface PrismicBlogPost extends PrismicDocument {
  type: "blog_post";
  data: {
    title: string;
    slug: string;
    content: any; // Rich text content
    excerpt: string;
    featured_image?: {
      url: string;
      alt: string;
    };
    author: string;
    published_date: string;
    tags: string[];
    meta_title?: string;
    meta_description?: string;
  };
}

// Mega Menu content type
export interface PrismicMegaMenu extends PrismicDocument {
  type: "mega_menu";
  data: {
    menu_title?: string;
    menu_items?: Array<{
      label: string;
      link?: any;
      has_mega_menu?: boolean;
      child_links?: Array<{
        child_label: string;
        child_link?: any;
      }>;
    }>;
    meta_title?: string;
    meta_description?: string;
  };
}

// Union type for all Prismic content types
export type PrismicContent =
  | PrismicPage
  | PrismicHomepage
  | PrismicCategory
  | PrismicBlogPost
  | PrismicMegaMenu;

// API response types
export interface PrismicApiResponse<T = PrismicContent> {
  results: T[];
  total_results_size: number;
  total_pages: number;
  page: number;
  results_per_page: number;
  next_page?: string;
  prev_page?: string;
}
