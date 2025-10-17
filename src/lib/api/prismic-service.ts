import { optimizedPrismicClient } from "@/lib/prismic";
import {
  PrismicContent,
  PrismicPage,
  PrismicHomepage,
  PrismicCategory,
  PrismicBlogPost,
  PrismicApiResponse,
} from "@/types/prismic";

export class PrismicApiService {
  private client = optimizedPrismicClient;

  // Get all pages with pagination and filtering
  async getPages(
    page = 1,
    pageSize = 10,
    filters?: {
      search?: string;
      status?: string;
      type?: string;
      sort?: Array<{ id: string; desc: boolean }>;
    },
    forceRefresh = false
  ): Promise<PrismicApiResponse<PrismicPage>> {
    try {
      // Clear cache if force refresh is requested
      if (forceRefresh) {
        this.client.clearCache();
      }

      const queryOptions: any = {
        page,
        pageSize,
        orderings: [
          { field: "document.last_publication_date", direction: "desc" },
        ],
        // Force fresh data by adding cache-busting
        ...(forceRefresh && {
          fetchOptions: {
            next: { revalidate: 0 },
          },
        }),
      };

      // Add search filter
      if (filters?.search) {
        queryOptions.q = `[fulltext(document, "${filters.search}")]`;
      }

      // Add status filter
      if (filters?.status && filters.status !== "all") {
        const statusQuery = `[at(document.data.status, "${filters.status}")]`;
        queryOptions.q = queryOptions.q
          ? `${queryOptions.q}${statusQuery}`
          : statusQuery;
      }

      // Add type filter
      if (filters?.type && filters.type !== "all") {
        const typeQuery = `[at(document.type, "${filters.type}")]`;
        queryOptions.q = queryOptions.q
          ? `${queryOptions.q}${typeQuery}`
          : typeQuery;
      }

      // Add sorting
      if (filters?.sort && filters.sort.length > 0) {
        const sortOrderings = filters.sort.map((sort) => ({
          field:
            sort.id === "title"
              ? "document.data.title"
              : sort.id === "status"
                ? "document.data.status"
                : sort.id === "type"
                  ? "document.type"
                  : sort.id === "last_publication_date"
                    ? "document.last_publication_date"
                    : "document.last_publication_date",
          direction: sort.desc ? "desc" : "asc",
        }));
        queryOptions.orderings = sortOrderings;
      }

      const response = await this.client.getAllByType("page", queryOptions);

      return {
        results: response as PrismicPage[],
        total_results_size: response.length,
        total_pages: Math.ceil(response.length / pageSize),
        page,
        results_per_page: pageSize,
      };
    } catch (error) {
      console.error("Error fetching pages:", error);
      return {
        results: [],
        total_results_size: 0,
        total_pages: 0,
        page,
        results_per_page: pageSize,
      };
    }
  }

  // Get page by UID
  async getPageByUID(uid: string): Promise<PrismicPage | null> {
    try {
      const page = await this.client.getByUID("page", uid);
      return page as unknown as PrismicPage;
    } catch (error) {
      console.error(`Error fetching page ${uid}:`, error);
      return null;
    }
  }

  // Get homepage
  async getHomepage(): Promise<PrismicHomepage | null> {
    try {
      const homepage = await this.client.getSingle("homepage");
      return homepage as unknown as PrismicHomepage;
    } catch (error) {
      console.error("Error fetching homepage:", error);
      return null;
    }
  }

  // Get all categories
  async getCategories(): Promise<PrismicCategory[]> {
    try {
      const categories = await this.client.getAllByType("category", {
        orderings: [
          { field: "document.first_publication_date", direction: "asc" },
        ],
      });
      return categories as unknown as PrismicCategory[];
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  }

  // Get category by UID
  async getCategoryByUID(uid: string): Promise<PrismicCategory | null> {
    try {
      const category = await this.client.getByUID("category", uid);
      return category as unknown as PrismicCategory;
    } catch (error) {
      console.error(`Error fetching category ${uid}:`, error);
      return null;
    }
  }

  // Get blog posts
  async getBlogPosts(
    page = 1,
    pageSize = 10
  ): Promise<PrismicApiResponse<PrismicBlogPost>> {
    try {
      const response = await this.client.getAllByType("blog_post", {
        page,
        pageSize,
        orderings: [
          { field: "document.last_publication_date", direction: "desc" },
        ],
      });

      return {
        results: response as unknown as PrismicBlogPost[],
        total_results_size: response.length,
        total_pages: Math.ceil(response.length / pageSize),
        page,
        results_per_page: pageSize,
      };
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      return {
        results: [],
        total_results_size: 0,
        total_pages: 0,
        page,
        results_per_page: pageSize,
      };
    }
  }

  // Get blog post by UID
  async getBlogPostByUID(uid: string): Promise<PrismicBlogPost | null> {
    try {
      const post = await this.client.getByUID("blog_post", uid);
      return post as unknown as PrismicBlogPost;
    } catch (error) {
      console.error(`Error fetching blog post ${uid}:`, error);
      return null;
    }
  }

  // Search content
  async searchContent(query: string, type?: string): Promise<PrismicContent[]> {
    try {
      const searchOptions: any = {
        q: `[at(document.type, "${type || "page"}")]`,
        orderings: [
          { field: "document.last_publication_date", direction: "desc" },
        ],
      };

      if (query) {
        searchOptions.q += `[fulltext(document, "${query}")]`;
      }

      const results = await this.client.getAllByType(
        type || "page",
        searchOptions
      );
      return results as unknown as PrismicContent[];
    } catch (error) {
      console.error("Error searching content:", error);
      return [];
    }
  }

  // Get content by ID
  async getContentByID(id: string): Promise<PrismicContent | null> {
    try {
      const content = await this.client.getByID(id);
      return content as unknown as PrismicContent;
    } catch (error) {
      console.error(`Error fetching content ${id}:`, error);
      return null;
    }
  }

  // Get all content types (for admin dashboard)
  async getAllContent(): Promise<{
    pages: PrismicPage[];
    categories: PrismicCategory[];
    blogPosts: PrismicBlogPost[];
  }> {
    try {
      const [pages, categories, blogPosts] = await Promise.allSettled([
        this.client.getAllByType("page").catch(() => []),
        this.client.getAllByType("category").catch(() => []),
        this.client.getAllByType("blog_post").catch(() => []),
        this.client.getAllByType("static_page").catch(() => []),
      ]);

      return {
        pages: (pages.status === "fulfilled"
          ? pages.value
          : []) as unknown as PrismicPage[],
        categories: (categories.status === "fulfilled"
          ? categories.value
          : []) as unknown as PrismicCategory[],
        blogPosts: (blogPosts.status === "fulfilled"
          ? blogPosts.value
          : []) as unknown as PrismicBlogPost[],
      };
    } catch (error) {
      console.error("Error fetching all content:", error);
      return {
        pages: [],
        categories: [],
        blogPosts: [],
      };
    }
  }

  // Clear cache
  clearCache() {
    this.client.clearCache();
  }

  // Force refresh all data
  async refreshAllData() {
    this.client.clearCache();
    // Force refresh all content types
    await Promise.allSettled([
      this.client.getAllByType("page", {
        fetchOptions: { next: { revalidate: 0 } },
      }),
      this.client.getAllByType("category", {
        fetchOptions: { next: { revalidate: 0 } },
      }),
    ]);
  }
}

// Export singleton instance
export const prismicApiService = new PrismicApiService();

// Export individual methods for convenience
export const {
  getPages,
  getPageByUID,
  getHomepage,
  getCategories,
  getCategoryByUID,
  getBlogPosts,
  getBlogPostByUID,
  searchContent,
  getContentByID,
  getAllContent,
  clearCache,
} = prismicApiService;
