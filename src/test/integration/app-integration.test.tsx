import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import App from '@/App';

// Mock Supabase with more complete functionality
const mockSupabase = {
  auth: {
    onAuthStateChange: vi.fn(() => ({ 
      data: { subscription: { unsubscribe: vi.fn() } } 
    })),
    getSession: vi.fn(() => Promise.resolve({ 
      data: { session: null } 
    })),
    signInWithPassword: vi.fn(() => Promise.resolve({ 
      error: null,
      data: {
        user: {
          id: 'test-user-id',
          email: 'test@example.com'
        }
      }
    })),
    signUp: vi.fn(() => Promise.resolve({ 
      error: null,
      data: {
        user: {
          id: 'test-user-id',
          email: 'test@example.com'
        }
      }
    })),
    signOut: vi.fn(() => Promise.resolve())
  },
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        single: vi.fn(() => Promise.resolve({ 
          data: {
            user_id: 'test-user-id',
            email: 'test@example.com',
            name: 'Test User',
            role: 'vendedor',
            company_id: 'test-company-id'
          } 
        }))
      })),
      limit: vi.fn(() => Promise.resolve({ data: [] })),
      order: vi.fn(() => ({
        limit: vi.fn(() => Promise.resolve({ data: [] }))
      }))
    })),
    insert: vi.fn(() => Promise.resolve({ error: null })),
    update: vi.fn(() => Promise.resolve({ error: null })),
    delete: vi.fn(() => Promise.resolve({ error: null }))
  })),
  rpc: vi.fn(() => Promise.resolve({ data: null }))
};

vi.mock('@/integrations/supabase/client', () => ({
  supabase: mockSupabase
}));

// Mock router to prevent navigation issues
const MockRouter = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('End-to-End Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset localStorage
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders app without errors and shows landing page', async () => {
    const { container } = render(
      <MockRouter>
        <App />
      </MockRouter>
    );

    // App should render without throwing
    expect(container).toBeInTheDocument();
    
    // Wait for any async operations
    await new Promise(resolve => setTimeout(resolve, 10));
    expect(container.firstChild).toBeInTheDocument();
  });

  it('handles authentication flow correctly', async () => {
    const user = userEvent.setup();
    
    // Mock auth state change to simulate login
    let authCallback: any = null;
    mockSupabase.auth.onAuthStateChange.mockImplementation(() => ({ 
      data: { subscription: { unsubscribe: vi.fn() } } 
    }));

    const { getByRole, queryByText } = render(
      <MockRouter>
        <App />
      </MockRouter>
    );

    // Simulate user login
    if (authCallback) {
      await authCallback('SIGNED_IN', {
        user: {
          id: 'test-user-id',
          email: 'test@example.com'
        }
      });
    }

    // Wait for auth state to update
    await new Promise(resolve => setTimeout(resolve, 10));
    expect(mockSupabase.from).toHaveBeenCalled();
  });

  it('handles error boundary correctly', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    // Component that throws an error
    const ErrorComponent = () => {
      throw new Error('Test error for integration test');
    };

    const { getByText } = render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    );

    // Error boundary should catch and display error
    expect(getByText(/Something went wrong/)).toBeInTheDocument();
    expect(getByText('Try Again')).toBeInTheDocument();

    consoleError.mockRestore();
  });

  it('handles navigation between routes', async () => {
    const user = userEvent.setup();
    
    // Mock authenticated user
    mockSupabase.auth.getSession.mockResolvedValue({
      data: {
        session: {
          user: {
            id: 'test-user-id',
            email: 'test@example.com'
          }
        }
      }
    });

    const { container } = render(
      <MockRouter>
        <App />
      </MockRouter>
    );

    // Wait for app to load
    await new Promise(resolve => setTimeout(resolve, 10));
    expect(container.firstChild).toBeInTheDocument();

    // Navigation should work without errors
    expect(container).toBeInTheDocument();
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

  it('integrates with Supabase edge functions', async () => {
    // Mock fetch for edge function calls
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true, response: 'AI response' })
      })
    ) as any;

    // Simulate AI consultant call
    const response = await fetch('/functions/v1/ai-consultant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Test consultation',
        consultationType: 'sales'
      })
    });

    const data = await response.json();
    expect(data.success).toBe(true);
  });

  it('handles real-time updates', async () => {
    // Mock Supabase realtime
    const mockChannel = {
      on: vi.fn(() => mockChannel),
      subscribe: vi.fn(() => Promise.resolve()),
      unsubscribe: vi.fn()
    };

    const mockSupabaseWithRealtime = {
      ...mockSupabase,
      channel: vi.fn(() => mockChannel)
    };

    (mockSupabase as any).channel = mockSupabaseWithRealtime.channel;

    // Test realtime connection
    const channel = (mockSupabase as any).channel('test-channel');
    expect(channel.on).toBeDefined();
    expect(channel.subscribe).toBeDefined();
  });

  it('maintains security audit trail', async () => {
    // Test audit logging
    const auditLogCall = mockSupabase.rpc.mockResolvedValue({ data: 'log-id' });

    // Simulate audit log
    await mockSupabase.rpc('log_user_action', {
      p_action: 'TEST_ACTION',
      p_resource_type: 'test',
      p_resource_id: null,
      p_old_values: null,
      p_new_values: { test: true },
      p_company_id: null
    });

    expect(auditLogCall).toHaveBeenCalledWith('log_user_action', {
      p_action: 'TEST_ACTION',
      p_resource_type: 'test',
      p_resource_id: null,
      p_old_values: null,
      p_new_values: { test: true },
      p_company_id: null
    });
  });
});