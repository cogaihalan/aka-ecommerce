// Cache configuration
export interface CacheConfig {
  ttl: number; // Time to live in milliseconds
  maxSize: number; // Maximum number of items
  strategy: "lru" | "fifo" | "ttl"; // Cache eviction strategy
}

// Cache entry
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  accessCount: number;
  lastAccessed: number;
}

// Cache key generator
export const generateCacheKey = (
  endpoint: string,
  params?: Record<string, any>
): string => {
  const sortedParams = params
    ? Object.keys(params)
        .sort()
        .reduce(
          (result, key) => {
            result[key] = params[key];
            return result;
          },
          {} as Record<string, any>
        )
    : {};

  return `${endpoint}:${JSON.stringify(sortedParams)}`;
};

// Memory cache implementation
export class MemoryCache<T = any> {
  private cache = new Map<string, CacheEntry<T>>();
  private config: CacheConfig;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      ttl: 5 * 60 * 1000, // 5 minutes default
      maxSize: 100, // 100 items default
      strategy: "lru", // LRU default
      ...config,
    };
  }

  // Get item from cache
  get(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    // Update access info
    entry.accessCount++;
    entry.lastAccessed = Date.now();

    return entry.data;
  }

  // Set item in cache
  set(key: string, data: T, ttl?: number): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.config.ttl,
      accessCount: 1,
      lastAccessed: Date.now(),
    };

    // Check if we need to evict items
    if (this.cache.size >= this.config.maxSize) {
      this.evict();
    }

    this.cache.set(key, entry);
  }

  // Delete item from cache
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  // Clear all items
  clear(): void {
    this.cache.clear();
  }

  // Check if key exists and is not expired
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  // Get cache size
  size(): number {
    return this.cache.size;
  }

  // Evict items based on strategy
  private evict(): void {
    const entries = Array.from(this.cache.entries());

    switch (this.config.strategy) {
      case "lru":
        // Remove least recently used
        entries.sort((a, b) => a[1].lastAccessed - b[1].lastAccessed);
        break;

      case "fifo":
        // Remove first in, first out
        entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
        break;

      case "ttl":
        // Remove expired items first, then by access count
        entries.sort((a, b) => {
          const aExpired = Date.now() - a[1].timestamp > a[1].ttl;
          const bExpired = Date.now() - b[1].timestamp > b[1].ttl;

          if (aExpired && !bExpired) return -1;
          if (!aExpired && bExpired) return 1;

          return a[1].accessCount - b[1].accessCount;
        });
        break;
    }

    // Remove 25% of items
    const toRemove = Math.ceil(entries.length * 0.25);
    for (let i = 0; i < toRemove; i++) {
      this.cache.delete(entries[i][0]);
    }
  }

  // Get cache statistics
  getStats(): {
    size: number;
    maxSize: number;
    hitRate: number;
    totalAccesses: number;
    averageAccessTime: number;
  } {
    const entries = Array.from(this.cache.values());
    const totalAccesses = entries.reduce(
      (sum, entry) => sum + entry.accessCount,
      0
    );
    const averageAccessTime =
      entries.length > 0
        ? entries.reduce((sum, entry) => sum + entry.lastAccessed, 0) /
          entries.length
        : 0;

    return {
      size: this.cache.size,
      maxSize: this.config.maxSize,
      hitRate: 0, // This would need to be tracked separately
      totalAccesses,
      averageAccessTime,
    };
  }
}

// Cache manager for API responses
export class ApiCacheManager {
  private caches = new Map<string, MemoryCache>();
  private defaultConfig: CacheConfig;

  constructor(defaultConfig: Partial<CacheConfig> = {}) {
    this.defaultConfig = {
      ttl: 5 * 60 * 1000, // 5 minutes
      maxSize: 100,
      strategy: "lru",
      ...defaultConfig,
    };
  }

  // Get cache for specific endpoint
  getCache(endpoint: string, config?: Partial<CacheConfig>): MemoryCache {
    if (!this.caches.has(endpoint)) {
      this.caches.set(
        endpoint,
        new MemoryCache({
          ...this.defaultConfig,
          ...config,
        })
      );
    }
    return this.caches.get(endpoint)!;
  }

  // Cache API response
  async cacheResponse<T>(
    endpoint: string,
    key: string,
    response: T,
    ttl?: number
  ): Promise<T> {
    const cache = this.getCache(endpoint);
    cache.set(key, response, ttl);
    return response;
  }

  // Get cached response
  getCachedResponse<T>(endpoint: string, key: string): T | null {
    const cache = this.getCache(endpoint);
    return cache.get(key);
  }

  // Invalidate cache
  invalidateCache(endpoint: string, pattern?: string): void {
    const cache = this.getCache(endpoint);

    if (pattern) {
      // Invalidate specific pattern
      const keys = Array.from(cache["cache"].keys());
      keys.forEach((key) => {
        if (key.includes(pattern)) {
          cache.delete(key);
        }
      });
    } else {
      // Clear entire cache
      cache.clear();
    }
  }

  // Invalidate all caches
  invalidateAllCaches(): void {
    this.caches.forEach((cache) => cache.clear());
  }

  // Get cache statistics
  getCacheStats(): Record<string, any> {
    const stats: Record<string, any> = {};

    this.caches.forEach((cache, endpoint) => {
      stats[endpoint] = cache.getStats();
    });

    return stats;
  }
}

// Cache strategies for different types of data
export const CACHE_STRATEGIES = {
  // Short-lived data (user sessions, real-time data)
  SHORT: { ttl: 1 * 60 * 1000, maxSize: 50, strategy: "ttl" as const },

  // Medium-lived data (product listings, search results)
  MEDIUM: { ttl: 5 * 60 * 1000, maxSize: 100, strategy: "lru" as const },

  // Long-lived data (static content, categories, brands)
  LONG: { ttl: 30 * 60 * 1000, maxSize: 200, strategy: "lru" as const },

  // Very long-lived data (configuration, settings)
  VERY_LONG: { ttl: 60 * 60 * 1000, maxSize: 50, strategy: "fifo" as const },
};

// Cache decorator for API methods
export function cached(
  ttl: number = 5 * 60 * 1000,
  strategy: "lru" | "fifo" | "ttl" = "lru"
) {
  return function (
    target: any,
    propertyName: string,
    descriptor: {
      value: Function;
      writable?: boolean;
      enumerable?: boolean;
      configurable?: boolean;
    }
  ) {
    const method = descriptor.value;
    const cache = new MemoryCache({ ttl, strategy });

    descriptor.value = async function (...args: any[]) {
      const key = generateCacheKey(propertyName, args[0]);
      const cached = cache.get(key);

      if (cached) {
        return cached;
      }

      const result = await method.apply(this, args);
      cache.set(key, result);
      return result;
    };
  };
}

// Create global cache manager instance
export const apiCacheManager = new ApiCacheManager();
