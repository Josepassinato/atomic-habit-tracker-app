import type { WebVitalsConfig } from './types';
import { PerformanceMonitor } from './PerformanceMonitor';

// Singleton instance
let performanceMonitor: PerformanceMonitor | null = null;

export const initializePerformanceMonitoring = (config?: WebVitalsConfig) => {
  if (typeof window === 'undefined') return;
  
  performanceMonitor = new PerformanceMonitor(config);
  return performanceMonitor;
};

export const getPerformanceMonitor = () => performanceMonitor;

// Re-export types and hooks
export type { PerformanceMetric, WebVitalsConfig } from './types';
export { usePerformanceMonitoring, withPerformanceTracking } from './hooks';
export { PerformanceMonitor } from './PerformanceMonitor';