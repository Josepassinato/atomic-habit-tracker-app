import { useCallback, useEffect, useState } from 'react';

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
  version: string;
}

interface CacheConfig {
  defaultTTL: number; // Time to live in milliseconds
  maxSize: number; // Maximum number of items
  version: string; // Cache version for invalidation
  storage: 'memory' | 'localStorage' | 'sessionStorage';
}

class CacheManager {
  private cache = new Map<string, CacheItem<any>>();
  private config: CacheConfig;
  private storageKey = 'habitus-cache';

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      defaultTTL: 5 * 60 * 1000, // 5 minutes
      maxSize: 100,
      version: '1.0',
      storage: 'memory',
      ...config
    };

    this.loadFromStorage();
    this.startCleanupInterval();
  }

  private loadFromStorage() {
    if (this.config.storage === 'memory' || typeof window === 'undefined') return;

    try {
      const storage = this.config.storage === 'localStorage' ? localStorage : sessionStorage;
      const stored = storage.getItem(this.storageKey);
      
      if (stored) {
        const { version, data } = JSON.parse(stored);
        
        // Clear cache if version mismatch
        if (version !== this.config.version) {
          storage.removeItem(this.storageKey);
          return;
        }

        // Restore valid cache items
        const now = Date.now();
        Object.entries(data).forEach(([key, item]: [string, any]) => {
          if (item.timestamp + item.ttl > now) {
            this.cache.set(key, item);
          }
        });
      }
    } catch (error) {
      console.warn('Failed to load cache from storage:', error);
    }
  }

  private saveToStorage() {
    if (this.config.storage === 'memory' || typeof window === 'undefined') return;

    try {
      const storage = this.config.storage === 'localStorage' ? localStorage : sessionStorage;
      const data = Object.fromEntries(this.cache.entries());
      
      storage.setItem(this.storageKey, JSON.stringify({
        version: this.config.version,
        data
      }));
    } catch (error) {
      console.warn('Failed to save cache to storage:', error);
    }
  }

  private startCleanupInterval() {
    if (typeof window === 'undefined') return;

    setInterval(() => {
      this.cleanup();
    }, 60000); // Cleanup every minute
  }

  private cleanup() {
    const now = Date.now();
    let removed = 0;

    for (const [key, item] of this.cache.entries()) {
      if (item.timestamp + item.ttl <= now) {
        this.cache.delete(key);
        removed++;
      }
    }

    // Enforce size limit
    if (this.cache.size > this.config.maxSize) {
      const entries = Array.from(this.cache.entries());
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
      
      const toRemove = entries.slice(0, this.cache.size - this.config.maxSize);
      toRemove.forEach(([key]) => this.cache.delete(key));
      removed += toRemove.length;
    }

    if (removed > 0) {
      this.saveToStorage();
    }
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) return null;
    
    // Check if expired
    if (Date.now() > item.timestamp + item.ttl) {
      this.cache.delete(key);
      this.saveToStorage();
      return null;
    }

    return item.data;
  }

  set<T>(key: string, data: T, ttl?: number): void {
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.config.defaultTTL,
      version: this.config.version
    };

    this.cache.set(key, item);
    
    // Trigger cleanup if over size limit
    if (this.cache.size > this.config.maxSize) {
      this.cleanup();
    }

    this.saveToStorage();
  }

  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    if (deleted) {
      this.saveToStorage();
    }
    return deleted;
  }

  clear(): void {
    this.cache.clear();
    this.saveToStorage();
  }

  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;
    
    // Check if expired
    if (Date.now() > item.timestamp + item.ttl) {
      this.cache.delete(key);
      this.saveToStorage();
      return false;
    }

    return true;
  }

  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  size(): number {
    return this.cache.size;
  }

  getStats() {
    const now = Date.now();
    let expired = 0;
    let valid = 0;

    for (const item of this.cache.values()) {
      if (now > item.timestamp + item.ttl) {
        expired++;
      } else {
        valid++;
      }
    }

    return {
      total: this.cache.size,
      valid,
      expired,
      maxSize: this.config.maxSize,
      version: this.config.version
    };
  }
}

// Global cache instance
let globalCache: CacheManager | null = null;

export const getCache = (config?: Partial<CacheConfig>): CacheManager => {
  if (!globalCache) {
    globalCache = new CacheManager(config);
  }
  return globalCache;
};

// React hook for caching
export const useCache = <T>(
  key: string,
  fetcher: () => Promise<T>,
  options: {
    ttl?: number;
    enabled?: boolean;
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
  } = {}
) => {
  const { ttl, enabled = true, onSuccess, onError } = options;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const cache = getCache();

  const fetchData = useCallback(async (force = false) => {
    if (!enabled) return;

    // Check cache first
    if (!force) {
      const cached = cache.get<T>(key);
      if (cached) {
        setData(cached);
        onSuccess?.(cached);
        return cached;
      }
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetcher();
      
      // Cache the result
      cache.set(key, result, ttl);
      
      setData(result);
      onSuccess?.(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      onError?.(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [key, fetcher, enabled, ttl, cache, onSuccess, onError]);

  const invalidate = useCallback(() => {
    cache.delete(key);
    setData(null);
    setError(null);
  }, [key, cache]);

  const refresh = useCallback(() => {
    return fetchData(true);
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refresh,
    invalidate,
    isInCache: cache.has(key)
  };
};

// Query cache for API calls
export const useCachedQuery = <T>(
  queryKey: string | string[],
  queryFn: () => Promise<T>,
  options: {
    ttl?: number;
    enabled?: boolean;
    retry?: number;
    retryDelay?: number;
  } = {}
) => {
  const key = Array.isArray(queryKey) ? queryKey.join(':') : queryKey;
  const { retry = 3, retryDelay = 1000, ...cacheOptions } = options;

  const [retryCount, setRetryCount] = useState(0);

  const fetcher = useCallback(async () => {
    let lastError: Error;
    
    for (let i = 0; i <= retry; i++) {
      try {
        const result = await queryFn();
        setRetryCount(0);
        return result;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        
        if (i < retry) {
          await new Promise(resolve => setTimeout(resolve, retryDelay * (i + 1)));
          setRetryCount(i + 1);
        }
      }
    }
    
    throw lastError!;
  }, [queryFn, retry, retryDelay]);

  return {
    ...useCache(key, fetcher, cacheOptions),
    retryCount
  };
};

// Cache decorator for functions
export const cached = <T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: {
    keyFn?: (...args: Parameters<T>) => string;
    ttl?: number;
  } = {}
) => {
  const cache = getCache();
  const { keyFn = (...args) => JSON.stringify(args), ttl } = options;

  return (async (...args: Parameters<T>) => {
    const key = `fn:${fn.name}:${keyFn(...args)}`;
    
    const cached = cache.get(key);
    if (cached) return cached;

    const result = await fn(...args);
    cache.set(key, result, ttl);
    
    return result;
  }) as T;
};

export { CacheManager };