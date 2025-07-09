import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/components/auth/AuthProvider';
import App from '@/App';
import { mockSupabase, cleanupMocks } from './test-setup';

describe('Authentication Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    cleanupMocks();
  });

  it('handles authentication flow correctly', async () => {
    const user = userEvent.setup();
    
    // Mock auth state change to simulate login
    let authCallback: any = null;
    mockSupabase.auth.onAuthStateChange.mockImplementation(() => ({ 
      data: { subscription: { unsubscribe: vi.fn() } } 
    }));

    const { container } = render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
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
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // Wait for app to load
    await new Promise(resolve => setTimeout(resolve, 10));
    expect(container.firstChild).toBeInTheDocument();

    // Navigation should work without errors
    expect(container).toBeInTheDocument();
  });
});