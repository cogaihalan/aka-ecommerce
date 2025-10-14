import { useState, useEffect, useCallback, useRef } from "react";
import { handleApiError, ErrorHandler } from "@/lib/api/error-handler";
import type { AppError } from "@/lib/api/error-handler";

// Generic API hook state
interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: AppError | null;
  refetch: () => Promise<void>;
}

// API hook options
interface UseApiOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: AppError) => void;
}

// Generic API hook
export function useApi<T>(
  apiCall: () => Promise<T>,
  options: UseApiOptions = {}
): UseApiState<T> {
  const { immediate = true, onSuccess, onError } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AppError | null>(null);

  const execute = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await apiCall();
      setData(result);
      onSuccess?.(result);
    } catch (err) {
      const appError = handleApiError(err, "useApi");
      setError(appError);
      onError?.(appError);
    } finally {
      setLoading(false);
    }
  }, [apiCall, onSuccess, onError]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  return {
    data,
    loading,
    error,
    refetch: execute,
  };
}

// Paginated data hook
interface UsePaginatedApiState<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  loading: boolean;
  error: AppError | null;
  refetch: () => Promise<void>;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
}

interface UsePaginatedApiOptions {
  initialPage?: number;
  initialLimit?: number;
  immediate?: boolean;
}

export function usePaginatedApi<T>(
  apiCall: (
    page: number,
    limit: number
  ) => Promise<{
    data: T[];
    pagination: any;
  }>,
  options: UsePaginatedApiOptions = {}
): UsePaginatedApiState<T> {
  const { initialPage = 1, initialLimit = 20, immediate = true } = options;

  const [data, setData] = useState<T[]>([]);
  const [pagination, setPagination] = useState({
    page: initialPage,
    limit: initialLimit,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AppError | null>(null);

  const execute = useCallback(
    async (page: number, limit: number) => {
      try {
        setLoading(true);
        setError(null);

        const result = await apiCall(page, limit);
        setData(result.data);
        setPagination(result.pagination);
      } catch (err) {
        const appError = handleApiError(err, "usePaginatedApi");
        setError(appError);
      } finally {
        setLoading(false);
      }
    },
    [apiCall]
  );

  const refetch = useCallback(() => {
    return execute(pagination.page, pagination.limit);
  }, [execute, pagination.page, pagination.limit]);

  const setPage = useCallback(
    (page: number) => {
      setPagination((prev) => ({ ...prev, page }));
      execute(page, pagination.limit);
    },
    [execute, pagination.limit]
  );

  const setLimit = useCallback(
    (limit: number) => {
      setPagination((prev) => ({ ...prev, limit, page: 1 }));
      execute(1, limit);
    },
    [execute]
  );

  useEffect(() => {
    if (immediate) {
      execute(initialPage, initialLimit);
    }
  }, [immediate, execute, initialPage, initialLimit]);

  return {
    data,
    pagination,
    loading,
    error,
    refetch,
    setPage,
    setLimit,
  };
}

// Mutation hook for create/update/delete operations
interface UseMutationState<T> {
  data: T | null;
  loading: boolean;
  error: AppError | null;
  mutate: (variables?: any) => Promise<T | null>;
  reset: () => void;
}

interface UseMutationOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: AppError) => void;
}

export function useMutation<T>(
  mutationFn: (variables?: any) => Promise<T>,
  options: UseMutationOptions<T> = {}
): UseMutationState<T> {
  const { onSuccess, onError } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AppError | null>(null);

  const mutate = useCallback(
    async (variables?: any) => {
      try {
        setLoading(true);
        setError(null);

        const result = await mutationFn(variables);
        setData(result);
        onSuccess?.(result);
        return result;
      } catch (err) {
        const appError = handleApiError(err, "useMutation");
        setError(appError);
        onError?.(appError);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [mutationFn, onSuccess, onError]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  return {
    data,
    loading,
    error,
    mutate,
    reset,
  };
}

// Search hook with debouncing
interface UseSearchState<T> {
  data: T[];
  loading: boolean;
  error: AppError | null;
  search: (query: string) => void;
  clear: () => void;
  query: string;
}

interface UseSearchOptions<T> {
  debounceMs?: number;
  minQueryLength?: number;
  onSuccess?: (data: T[]) => void;
  onError?: (error: AppError) => void;
}

export function useSearch<T>(
  searchFn: (query: string) => Promise<T[]>,
  options: UseSearchOptions<T> = {}
): UseSearchState<T> {
  const { debounceMs = 300, minQueryLength = 2, onSuccess, onError } = options;

  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AppError | null>(null);
  const [query, setQuery] = useState("");
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
    null
  );
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const executeSearch = useCallback(
    async (searchQuery: string) => {
      if (searchQuery.length < minQueryLength) {
        setData([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const result = await searchFn(searchQuery);
        setData(result);
        onSuccess?.(result);
      } catch (err) {
        const appError = handleApiError(err, "useSearch");
        setError(appError);
        onError?.(appError);
      } finally {
        setLoading(false);
      }
    },
    [searchFn, minQueryLength, onSuccess, onError]
  );

  const search = useCallback(
    (searchQuery: string) => {
      setQuery(searchQuery);

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      const timer = setTimeout(() => {
        executeSearch(searchQuery);
      }, debounceMs);

      debounceTimerRef.current = timer;
      setDebounceTimer(timer);
    },
    [executeSearch, debounceMs]
  );

  const clear = useCallback(() => {
    setQuery("");
    setData([]);
    setError(null);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
      setDebounceTimer(null);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return {
    data,
    loading,
    error,
    search,
    clear,
    query,
  };
}

// Error message hook
export function useErrorMessage(error: AppError | null): string | null {
  if (!error) return null;
  return ErrorHandler.getUserMessage(error);
}

// Error action hook
export function useErrorAction(error: AppError | null) {
  if (!error) return null;
  return ErrorHandler.getErrorAction(error);
}
