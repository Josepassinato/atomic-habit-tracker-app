interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

interface CacheConfig {
  defaultTTL: number;
  maxSize: number;
  enableLogging: boolean;
}

class PerformanceCacheService {
  private cache = new Map<string, CacheEntry<any>>();
  private accessTimes = new Map<string, number>();
  private config: CacheConfig = {
    defaultTTL: 300000, // 5 minutes
    maxSize: 1000,
    enableLogging: true
  };

  constructor(config?: Partial<CacheConfig>) {
    if (config) {
      this.config = { ...this.config, ...config };
    }
  }

  /**
   * Set a value in the cache with optional TTL
   */
  set<T>(key: string, data: T, ttl?: number): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.config.defaultTTL
    };

    // If cache is at max size, remove least recently used items
    if (this.cache.size >= this.config.maxSize) {
      this.evictLRU();
    }

    this.cache.set(key, entry);
    this.accessTimes.set(key, Date.now());

    if (this.config.enableLogging) {
      console.log(`Cache SET: ${key} (TTL: ${entry.ttl}ms)`);
    }
  }

  /**
   * Get a value from the cache
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      if (this.config.enableLogging) {
        console.log(`Cache MISS: ${key}`);
      }
      return null;
    }

    // Check if entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.delete(key);
      if (this.config.enableLogging) {
        console.log(`Cache EXPIRED: ${key}`);
      }
      return null;
    }

    // Update access time for LRU
    this.accessTimes.set(key, Date.now());

    if (this.config.enableLogging) {
      console.log(`Cache HIT: ${key}`);
    }

    return entry.data as T;
  }

  /**
   * Get or set a value using a factory function
   */
  async getOrSet<T>(
    key: string, 
    factory: () => Promise<T> | T, 
    ttl?: number
  ): Promise<T> {
    const cached = this.get<T>(key);
    
    if (cached !== null) {
      return cached;
    }

    const startTime = performance.now();
    const data = await factory();
    const endTime = performance.now();

    if (this.config.enableLogging) {
      console.log(`Cache FACTORY: ${key} took ${(endTime - startTime).toFixed(2)}ms`);
    }

    this.set(key, data, ttl);
    return data;
  }

  /**
   * Delete a specific key from the cache
   */
  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    this.accessTimes.delete(key);

    if (deleted && this.config.enableLogging) {
      console.log(`Cache DELETE: ${key}`);
    }

    return deleted;
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    const size = this.cache.size;
    this.cache.clear();
    this.accessTimes.clear();

    if (this.config.enableLogging) {
      console.log(`Cache CLEAR: Removed ${size} entries`);
    }
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const now = Date.now();
    let totalSize = 0;
    let expiredCount = 0;
    let validCount = 0;

    for (const [key, entry] of this.cache.entries()) {
      totalSize += JSON.stringify(entry.data).length;
      
      if (now - entry.timestamp > entry.ttl) {
        expiredCount++;
      } else {
        validCount++;
      }
    }

    return {
      totalEntries: this.cache.size,
      validEntries: validCount,
      expiredEntries: expiredCount,
      estimatedSize: totalSize,
      maxSize: this.config.maxSize,
      hitRate: this.calculateHitRate(),
      lastActivity: Math.max(...Array.from(this.accessTimes.values()), 0)
    };
  }

  /**
   * Remove expired entries
   */
  cleanup(): number {
    const now = Date.now();
    let removedCount = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
        this.accessTimes.delete(key);
        removedCount++;
      }
    }

    if (this.config.enableLogging && removedCount > 0) {
      console.log(`Cache CLEANUP: Removed ${removedCount} expired entries`);
    }

    return removedCount;
  }

  /**
   * Get all keys matching a pattern
   */
  getKeys(pattern?: RegExp): string[] {
    const keys = Array.from(this.cache.keys());
    
    if (pattern) {
      return keys.filter(key => pattern.test(key));
    }

    return keys;
  }

  /**
   * Invalidate all keys matching a pattern
   */
  invalidatePattern(pattern: RegExp): number {
    const keysToDelete = this.getKeys(pattern);
    
    keysToDelete.forEach(key => this.delete(key));

    if (this.config.enableLogging && keysToDelete.length > 0) {
      console.log(`Cache INVALIDATE: Removed ${keysToDelete.length} entries matching pattern`);
    }

    return keysToDelete.length;
  }

  /**
   * Create a namespace-specific cache instance
   */
  namespace(prefix: string) {
    return {
      set: <T>(key: string, data: T, ttl?: number) => this.set(`${prefix}:${key}`, data, ttl),
      get: <T>(key: string) => this.get<T>(`${prefix}:${key}`),
      getOrSet: <T>(key: string, factory: () => Promise<T> | T, ttl?: number) => 
        this.getOrSet<T>(`${prefix}:${key}`, factory, ttl),
      delete: (key: string) => this.delete(`${prefix}:${key}`),
      clear: () => this.invalidatePattern(new RegExp(`^${prefix}:`)),
      getKeys: () => this.getKeys(new RegExp(`^${prefix}:`))
    };
  }

  private evictLRU(): void {
    if (this.accessTimes.size === 0) return;

    // Find the least recently used key
    let oldestKey = '';
    let oldestTime = Infinity;

    for (const [key, time] of this.accessTimes.entries()) {
      if (time < oldestTime) {
        oldestTime = time;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.delete(oldestKey);
      if (this.config.enableLogging) {
        console.log(`Cache LRU EVICT: ${oldestKey}`);
      }
    }
  }

  private calculateHitRate(): number {
    // This is a simplified calculation
    // In a real implementation, you'd track hits and misses over time
    const stats = this.getStats();
    return stats.validEntries / Math.max(stats.totalEntries, 1);
  }

  /**
   * Start automatic cleanup interval
   */
  startAutoCleanup(intervalMs = 60000): NodeJS.Timeout {
    return setInterval(() => {
      this.cleanup();
    }, intervalMs);
  }
}

// Create namespaced cache instances for different parts of the application
export const performanceCache = new PerformanceCacheService({
  defaultTTL: 300000, // 5 minutes
  maxSize: 1000,
  enableLogging: true
});

// Specialized caches for different data types
export const aiCache = performanceCache.namespace('ai');
export const adminCache = performanceCache.namespace('admin');
export const metricsCache = performanceCache.namespace('metrics');
export const userCache = performanceCache.namespace('user');

// Auto-cleanup every minute
performanceCache.startAutoCleanup(60000);

export default performanceCache;