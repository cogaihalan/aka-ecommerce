import {
  usePaginatedApi,
  useMutation,
  useSearch,
} from "@/lib/api/hooks/use-api";
import { unifiedProductService } from "@/lib/api";
import type {
  QueryParams,
  CreateProductRequest,
  UpdateProductRequest,
} from "@/lib/api";

// Hook for managing products list
export function useProducts(params: QueryParams = {}) {
  return usePaginatedApi(
    async (page: number, limit: number) => {
      const response = await unifiedProductService.getProducts({
        ...params,
        page,
        limit,
      });
      return {
        data: response.items,
        pagination: response.pagination,
      };
    },
    {
      initialPage: params.page || 1,
      initialLimit: params.limit || 20,
    }
  );
}

// Hook for product search
export function useProductSearch() {
  return useSearch(
    async (query: string) => {
      const response = await unifiedProductService.getProducts({
        search: query,
        limit: 10,
      });
      return response.items;
    },
    {
      debounceMs: 300,
      minQueryLength: 2,
    }
  );
}

// Hook for creating a product
export function useCreateProduct() {
  return useMutation(
    async (data: CreateProductRequest) => {
      return await unifiedProductService.createProduct(data);
    },
    {
      onSuccess: (product) => {
        console.log("Product created successfully:", product);
      },
    }
  );
}

// Hook for updating a product
export function useUpdateProduct() {
  return useMutation(
    async ({ id, data }: { id: number; data: UpdateProductRequest }) => {
      return await unifiedProductService.updateProduct(id, data);
    },
    {
      onSuccess: (product) => {
        console.log("Product updated successfully:", product);
      },
    }
  );
}

// Hook for deleting a product
export function useDeleteProduct() {
  return useMutation(
    async (id: number) => {
      await unifiedProductService.deleteProduct(id);
      return id;
    },
    {
      onSuccess: (id) => {
        console.log("Product deleted successfully:", id);
      },
    }
  );
}

// Hook for bulk operations
export function useBulkProductOperations() {
  const updateMutation = useMutation(
    async (
      updates: Array<{ id: number; data: Partial<UpdateProductRequest> }>
    ) => {
      return await unifiedProductService.bulkUpdateProducts(updates);
    }
  );

  const deleteMutation = useMutation(async (ids: number[]) => {
    await unifiedProductService.bulkDeleteProducts(ids);
    return ids;
  });

  return {
    bulkUpdate: updateMutation,
    bulkDelete: deleteMutation,
  };
}

// Hook for product status management
export function useProductStatus() {
  const publishMutation = useMutation(async (id: number) => {
    return await unifiedProductService.publishProduct(id);
  });

  const unpublishMutation = useMutation(async (id: number) => {
    return await unifiedProductService.unpublishProduct(id);
  });

  const archiveMutation = useMutation(async (id: number) => {
    return await unifiedProductService.archiveProduct(id);
  });

  return {
    publish: publishMutation,
    unpublish: unpublishMutation,
    archive: archiveMutation,
  };
}
