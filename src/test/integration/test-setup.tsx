import React from 'react';
import { vi } from 'vitest';

// Mock Supabase with more complete functionality
export const mockSupabase = {
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

// Mock router to prevent navigation issues
export const MockRouter = ({ children }: { children: React.ReactNode }) => (
  <div data-testid="mock-router">{children}</div>
);

export const setupMocks = () => {
  vi.mock('@/integrations/supabase/client', () => ({
    supabase: mockSupabase
  }));

  // Mock fetch for edge function calls
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ success: true, response: 'AI response' })
    })
  ) as any;
};

export const cleanupMocks = () => {
  vi.clearAllMocks();
  vi.restoreAllMocks();
  localStorage.clear();
};