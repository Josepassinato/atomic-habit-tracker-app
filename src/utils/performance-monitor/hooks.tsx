import { useEffect } from 'react';
import type { WebVitalsConfig } from './types';
import { initializePerformanceMonitoring, getPerformanceMonitor } from './index';

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
    getMetrics: () => getPerformanceMonitor()?.getMetrics() || [],
    clearMetrics: () => getPerformanceMonitor()?.clearMetrics(),
    updateConfig: (newConfig: Partial<WebVitalsConfig>) => 
      getPerformanceMonitor()?.updateConfig(newConfig)
  };
};

// Component performance tracker HOC
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
        
        const performanceMonitor = getPerformanceMonitor();
        if (renderTime > 16 && performanceMonitor) { // Components taking more than 16ms (60fps threshold)
          (performanceMonitor as any).recordMetric(`COMPONENT_RENDER_${componentName}`, renderTime);
        }
      };
    });

    return <Component {...props} />;
  };
};