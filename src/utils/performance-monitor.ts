import { useEffect } from 'react';

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  url: string;
  userAgent: string;
}

interface WebVitalsConfig {
  enabled: boolean;
  endpoint?: string;
  sampleRate?: number;
}

class PerformanceMonitor {
  private config: WebVitalsConfig;
  private metrics: PerformanceMetric[] = [];

  constructor(config: WebVitalsConfig = { enabled: true, sampleRate: 1.0 }) {
    this.config = config;
    this.initializeMonitoring();
  }

  private initializeMonitoring() {
    if (!this.config.enabled || typeof window === 'undefined') return;

    // Core Web Vitals monitoring
    this.observeWebVitals();
    
    // Custom metrics
    this.observeResourceTiming();
    this.observeNavigationTiming();
    
    // User interactions
    this.observeUserInteractions();
  }

  private observeWebVitals() {
    // LCP (Largest Contentful Paint)
    this.observePerformanceEntries('largest-contentful-paint', (entry) => {
      this.recordMetric('LCP', entry.startTime);
    });

    // FID (First Input Delay) - via PerformanceEventTiming
    this.observePerformanceEntries('first-input', (entry) => {
      this.recordMetric('FID', entry.processingStart - entry.startTime);
    });

    // CLS (Cumulative Layout Shift)
    this.observePerformanceEntries('layout-shift', (entry) => {
      if (!entry.hadRecentInput) {
        this.recordMetric('CLS', entry.value);
      }
    });
  }

  private observePerformanceEntries(entryType: string, callback: (entry: any) => void) {
    try {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach(callback);
      });
      observer.observe({ entryTypes: [entryType] });
    } catch (error) {
      console.warn(`Performance observer for ${entryType} not supported:`, error);
    }
  }

  private observeResourceTiming() {
    this.observePerformanceEntries('resource', (entry) => {
      // Monitor slow resources
      if (entry.duration > 1000) { // Resources taking more than 1s
        this.recordMetric('SLOW_RESOURCE', entry.duration, {
          url: entry.name,
          type: entry.initiatorType
        });
      }
    });
  }

  private observeNavigationTiming() {
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (navigation) {
        this.recordMetric('TTFB', navigation.responseStart - navigation.requestStart);
        this.recordMetric('DOM_LOAD', navigation.domContentLoadedEventEnd - navigation.navigationStart);
        this.recordMetric('FULL_LOAD', navigation.loadEventEnd - navigation.navigationStart);
      }
    });
  }

  private observeUserInteractions() {
    let interactionCount = 0;
    
    ['click', 'keydown', 'scroll'].forEach(eventType => {
      document.addEventListener(eventType, () => {
        interactionCount++;
        if (interactionCount % 10 === 0) { // Sample every 10th interaction
          this.recordMetric('USER_INTERACTIONS', interactionCount);
        }
      }, { passive: true });
    });
  }

  private recordMetric(name: string, value: number, metadata?: any) {
    // Sample rate check
    if (Math.random() > (this.config.sampleRate || 1.0)) return;

    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent.substring(0, 100),
      ...(metadata || {})
    };

    this.metrics.push(metric);

    // Send to analytics endpoint
    this.sendMetric(metric);

    // Keep only last 100 metrics in memory
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100);
    }
  }

  private async sendMetric(metric: PerformanceMetric) {
    if (!this.config.endpoint) {
      // Log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Performance Metric:', metric);
      }
      return;
    }

    try {
      // Use sendBeacon for reliability
      if (navigator.sendBeacon) {
        navigator.sendBeacon(
          this.config.endpoint,
          JSON.stringify(metric)
        );
      } else {
        // Fallback to fetch
        fetch(this.config.endpoint, {
          method: 'POST',
          body: JSON.stringify(metric),
          headers: { 'Content-Type': 'application/json' },
          keepalive: true
        }).catch(() => {}); // Ignore errors
      }
    } catch (error) {
      console.warn('Failed to send performance metric:', error);
    }
  }

  public getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  public clearMetrics(): void {
    this.metrics = [];
  }

  public updateConfig(newConfig: Partial<WebVitalsConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}

// Singleton instance
let performanceMonitor: PerformanceMonitor | null = null;

export const initializePerformanceMonitoring = (config?: WebVitalsConfig) => {
  if (typeof window === 'undefined') return;
  
  performanceMonitor = new PerformanceMonitor(config);
  return performanceMonitor;
};

export const getPerformanceMonitor = () => performanceMonitor;

// React hook for performance monitoring
export const usePerformanceMonitoring = (config?: WebVitalsConfig) => {
  useEffect(() => {
    const monitor = initializePerformanceMonitoring(config);
    
    return () => {
      // Cleanup if needed
      monitor?.clearMetrics();
    };
  }, [config]);

  return {
    getMetrics: () => performanceMonitor?.getMetrics() || [],
    clearMetrics: () => performanceMonitor?.clearMetrics(),
    updateConfig: (newConfig: Partial<WebVitalsConfig>) => 
      performanceMonitor?.updateConfig(newConfig)
  };
};

// Component performance tracker
export const withPerformanceTracking = (
  Component: React.ComponentType<any>,
  componentName: string
) => {
  return (props: any) => {
    useEffect(() => {
      const startTime = performance.now();
      
      return () => {
        const endTime = performance.now();
        const renderTime = endTime - startTime;
        
        if (renderTime > 16) { // Components taking more than 16ms (60fps threshold)
          performanceMonitor?.recordMetric(`COMPONENT_RENDER_${componentName}`, renderTime);
        }
      };
    });

    return <Component {...props} />;
  };
};
