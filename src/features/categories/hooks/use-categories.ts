import {
  usePaginatedApi,
  useMutation,
  useSearch,
} from "@/lib/api/hooks/use-api";
import { unifiedCategoryService } from "@/lib/api/services/unified";
import type {
  QueryParams,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  Category,
  CategoryTree,
  CategoryWithProducts,
} from "@/lib/api";

// Hook for managing categories list
export function useCategories(params: QueryParams = {}) {
  return usePaginatedApi(
    async (page: number, limit: number) => {
      const response = await unifiedCategoryService.getCategories({
        ...params,
        page,
        limit,
      });
      const categories = Array.isArray(response) ? response : response.categories;
      const pagination = Array.isArray(response) ? { page: 1, limit: response.length, total: response.length, totalPages: 1, hasNext: false, hasPrev: false } : response.pagination;
      
      return {
        data: categories,
        pagination: pagination,
      };
    },
    {
      initialPage: params.page || 1,
      initialLimit: params.limit || 20,
    }
  );
}

// Hook for category tree
export function useCategoryTree() {
  return useMutation<CategoryTree[]>(async () => {
    const response = await unifiedCategoryService.getCategoryTree();
    return response.categories;
  });
}

// Hook for single category
export function useCategory(id: number) {
  return useMutation<Category>(async () => {
    return await unifiedCategoryService.getCategory(id);
  });
}

// Hook for category with products
export function useCategoryWithProducts(id: number, params: QueryParams = {}) {
  return usePaginatedApi(
    async (page: number, limit: number) => {
      const response = await unifiedCategoryService.getCategoryWithProducts(id, {
        ...params,
        page,
        limit,
      });
      return {
        data: response.products,
        pagination: {
          page,
          limit,
          total: response.totalProducts,
          totalPages: Math.ceil(response.totalProducts / limit),
          hasNext: page < Math.ceil(response.totalProducts / limit),
          hasPrev: page > 1,
        },
        category: response,
      };
    },
    {
      initialPage: params.page || 1,
      initialLimit: params.limit || 20,
    }
  );
}

// Hook for category search
export function useCategorySearch() {
  return useSearch(async (query: string) => {
    return await unifiedCategoryService.searchCategories(query);
  });
}

// Hook for creating category
export function useCreateCategory() {
  return useMutation<Category>(async (data: CreateCategoryRequest) => {
    return await unifiedCategoryService.createCategory(data);
  });
}

// Hook for updating category
export function useUpdateCategory() {
  return useMutation<Category>(async (data: UpdateCategoryRequest) => {
    return await unifiedCategoryService.updateCategory(data);
  });
}

// Hook for deleting category
export function useDeleteCategory() {
  return useMutation<void>(async (id: number) => {
    return await unifiedCategoryService.deleteCategory(id);
  });
}




// Hook for validating category slug
export function useValidateCategorySlug() {
  return useMutation<{ isValid: boolean; message?: string }>(async ({ slug, excludeId }: { slug: string; excludeId?: number }) => {
    return await unifiedCategoryService.validateSlug(slug, excludeId);
  });
}
