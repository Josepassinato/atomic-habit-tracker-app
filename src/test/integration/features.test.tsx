import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import { cleanupMocks } from './test-setup';

describe('Feature Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    cleanupMocks();
  });

  it('manages cache correctly across components', async () => {
    const { getCache } = await import('@/utils/cache-manager');
    
    const cache = getCache();
    
    // Test cache operations
    cache.set('test-key', { data: 'test-value' });
    expect(cache.get('test-key')).toEqual({ data: 'test-value' });
    
    // Test cache expiration
    cache.set('short-lived', { data: 'expires-soon' }, 1); // 1ms TTL
    
    await new Promise(resolve => setTimeout(resolve, 10));
    
    expect(cache.get('short-lived')).toBeNull();
  });

  it('monitors performance metrics', async () => {
    const { initializePerformanceMonitoring } = await import('@/utils/performance-monitor');
    
    const monitor = initializePerformanceMonitoring({
      enabled: true,
      sampleRate: 1.0
    });

    expect(monitor).toBeDefined();
    
    // Performance monitoring should be active
    expect(monitor?.getMetrics()).toEqual([]);
  });

  it('handles privacy compliance settings', async () => {
    const { render } = await import('@testing-library/react');
    const { default: PrivacyCompliance } = await import('@/components/compliance/PrivacyCompliance');

    const { getByText } = render(<PrivacyCompliance />);

    // Privacy component should render
    expect(getByText('Privacy & Data Protection')).toBeInTheDocument();
    expect(getByText('Data Processing Consent')).toBeInTheDocument();
  });
});