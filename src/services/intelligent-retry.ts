interface RetryConfig {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
  backoffFactor: number;
  jitter: boolean;
  retryCondition?: (error: any) => boolean;
  onRetry?: (attempt: number, error: any) => void;
}

interface RetryResult<T> {
  success: boolean;
  data?: T;
  error?: any;
  attempts: number;
  totalTime: number;
}

class IntelligentRetryService {
  private defaultConfig: RetryConfig = {
    maxAttempts: 3,
    baseDelay: 1000,
    maxDelay: 30000,
    backoffFactor: 2,
    jitter: true,
    retryCondition: (error) => this.isRetryableError(error),
    onRetry: (attempt, error) => console.log(`Retry attempt ${attempt}:`, error?.message || error)
  };

  /**
   * Execute a function with intelligent retry logic
   */
  async execute<T>(
    fn: () => Promise<T>,
    config?: Partial<RetryConfig>
  ): Promise<RetryResult<T>> {
    const finalConfig = { ...this.defaultConfig, ...config };
    const startTime = performance.now();
    let lastError: any;

    for (let attempt = 1; attempt <= finalConfig.maxAttempts; attempt++) {
      try {
        const data = await fn();
        const totalTime = performance.now() - startTime;

        return {
          success: true,
          data,
          attempts: attempt,
          totalTime
        };
      } catch (error) {
        lastError = error;

        // Check if we should retry
        if (attempt === finalConfig.maxAttempts || !finalConfig.retryCondition!(error)) {
          break;
        }

        // Calculate delay for next attempt
        const delay = this.calculateDelay(attempt, finalConfig);

        // Call retry callback
        if (finalConfig.onRetry) {
          finalConfig.onRetry(attempt, error);
        }

        // Wait before next attempt
        await this.delay(delay);
      }
    }

    const totalTime = performance.now() - startTime;

    return {
      success: false,
      error: lastError,
      attempts: finalConfig.maxAttempts,
      totalTime
    };
  }

  /**
   * Execute with circuit breaker pattern
   */
  async executeWithCircuitBreaker<T>(
    fn: () => Promise<T>,
    circuitConfig?: {
      failureThreshold: number;
      resetTimeout: number;
      monitoringPeriod: number;
    }
  ): Promise<T> {
    const config = {
      failureThreshold: 5,
      resetTimeout: 60000,
      monitoringPeriod: 60000,
      ...circuitConfig
    };

    const circuitKey = fn.toString(); // Simple key generation
    const circuit = this.getOrCreateCircuit(circuitKey, config);

    if (circuit.state === 'OPEN') {
      if (Date.now() - circuit.lastFailTime < config.resetTimeout) {
        throw new Error('Circuit breaker is OPEN');
      } else {
        circuit.state = 'HALF_OPEN';
      }
    }

    try {
      const result = await fn();
      
      if (circuit.state === 'HALF_OPEN') {
        circuit.state = 'CLOSED';
        circuit.failureCount = 0;
      }

      return result;
    } catch (error) {
      circuit.failureCount++;
      circuit.lastFailTime = Date.now();

      if (circuit.failureCount >= config.failureThreshold) {
        circuit.state = 'OPEN';
      }

      throw error;
    }
  }

  /**
   * Execute with rate limiting
   */
  async executeWithRateLimit<T>(
    fn: () => Promise<T>,
    rateLimit: {
      maxRequests: number;
      windowMs: number;
      key?: string;
    }
  ): Promise<T> {
    const key = rateLimit.key || 'default';
    const bucket = this.getOrCreateRateLimitBucket(key, rateLimit);

    const now = Date.now();
    
    // Clean up old requests
    bucket.requests = bucket.requests.filter(time => now - time < rateLimit.windowMs);

    if (bucket.requests.length >= rateLimit.maxRequests) {
      const oldestRequest = Math.min(...bucket.requests);
      const waitTime = rateLimit.windowMs - (now - oldestRequest);
      
      if (waitTime > 0) {
        await this.delay(waitTime);
        return this.executeWithRateLimit(fn, rateLimit);
      }
    }

    bucket.requests.push(now);
    return fn();
  }

  /**
   * Execute with timeout
   */
  async executeWithTimeout<T>(
    fn: () => Promise<T>,
    timeoutMs: number
  ): Promise<T> {
    return Promise.race([
      fn(),
      new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error(`Operation timed out after ${timeoutMs}ms`)), timeoutMs);
      })
    ]);
  }

  /**
   * Execute with all resilience patterns combined
   */
  async executeResilient<T>(
    fn: () => Promise<T>,
    options?: {
      retry?: Partial<RetryConfig>;
      circuitBreaker?: {
        failureThreshold: number;
        resetTimeout: number;
        monitoringPeriod: number;
      };
      rateLimit?: {
        maxRequests: number;
        windowMs: number;
        key?: string;
      };
      timeout?: number;
    }
  ): Promise<T> {
    let resilientFn = fn;

    // Wrap with timeout if specified
    if (options?.timeout) {
      const timeoutMs = options.timeout;
      resilientFn = () => this.executeWithTimeout(fn, timeoutMs);
    }

    // Wrap with rate limiting if specified
    if (options?.rateLimit) {
      const prevFn = resilientFn;
      resilientFn = () => this.executeWithRateLimit(prevFn, options.rateLimit!);
    }

    // Wrap with circuit breaker if specified
    if (options?.circuitBreaker) {
      const prevFn = resilientFn;
      resilientFn = () => this.executeWithCircuitBreaker(prevFn, options.circuitBreaker);
    }

    // Execute with retry
    const result = await this.execute(resilientFn, options?.retry);
    
    if (!result.success) {
      throw result.error;
    }

    return result.data!;
  }

  private calculateDelay(attempt: number, config: RetryConfig): number {
    let delay = config.baseDelay * Math.pow(config.backoffFactor, attempt - 1);
    delay = Math.min(delay, config.maxDelay);

    if (config.jitter) {
      delay = delay * (0.5 + Math.random() * 0.5);
    }

    return Math.floor(delay);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private isRetryableError(error: any): boolean {
    // Check for network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return true;
    }

    // Check for HTTP status codes that should be retried
    if (error.status) {
      const retryableStatus = [408, 429, 500, 502, 503, 504];
      return retryableStatus.includes(error.status);
    }

    // Check for specific error types
    const retryableErrors = [
      'NetworkError',
      'TimeoutError',
      'ConnectionError',
      'ServiceUnavailable'
    ];

    return retryableErrors.some(errorType => 
      error.name === errorType || error.message?.includes(errorType)
    );
  }

  // Circuit breaker state management
  private circuits = new Map<string, {
    state: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
    failureCount: number;
    lastFailTime: number;
  }>();

  private getOrCreateCircuit(key: string, config: any) {
    if (!this.circuits.has(key)) {
      this.circuits.set(key, {
        state: 'CLOSED',
        failureCount: 0,
        lastFailTime: 0
      });
    }
    return this.circuits.get(key)!;
  }

  // Rate limiting state management
  private rateLimitBuckets = new Map<string, {
    requests: number[];
  }>();

  private getOrCreateRateLimitBucket(key: string, config: any) {
    if (!this.rateLimitBuckets.has(key)) {
      this.rateLimitBuckets.set(key, {
        requests: []
      });
    }
    return this.rateLimitBuckets.get(key)!;
  }

  /**
   * Get statistics for monitoring
   */
  getStats() {
    return {
      circuits: Array.from(this.circuits.entries()).map(([key, circuit]) => ({
        key,
        state: circuit.state,
        failureCount: circuit.failureCount,
        lastFailTime: circuit.lastFailTime
      })),
      rateLimitBuckets: Array.from(this.rateLimitBuckets.entries()).map(([key, bucket]) => ({
        key,
        activeRequests: bucket.requests.length
      }))
    };
  }

  /**
   * Reset all circuit breakers
   */
  resetCircuitBreakers() {
    this.circuits.clear();
  }

  /**
   * Clear rate limit buckets
   */
  clearRateLimits() {
    this.rateLimitBuckets.clear();
  }
}

// Export singleton instance
export const intelligentRetry = new IntelligentRetryService();
export default intelligentRetry;