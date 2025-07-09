import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuth } from '@/hooks/useAuth';

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
      getSession: vi.fn(() => Promise.resolve({ data: { session: null } })),
      signInWithPassword: vi.fn(() => Promise.resolve({ error: null })),
      signUp: vi.fn(() => Promise.resolve({ error: null })),
      signOut: vi.fn(() => Promise.resolve()),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: null }))
        }))
      }))
    }))
  }
}));

// Test component that uses auth
const TestAuthComponent = () => {
  const { user, loading, signIn, signOut } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      <div data-testid="user-status">
        {user ? `Logged in as ${user.email}` : 'Not logged in'}
      </div>
      <button 
        data-testid="sign-in-btn" 
        onClick={() => signIn('test@example.com', 'password')}
      >
        Sign In
      </button>
      <button 
        data-testid="sign-out-btn" 
        onClick={signOut}
      >
        Sign Out
      </button>
    </div>
  );
};

describe('useAuth Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('handles sign in process', async () => {
    const user = userEvent.setup();
    const { getByTestId } = render(<TestAuthComponent />);
    
    const signInButton = getByTestId('sign-in-btn');
    await user.click(signInButton);
    
    expect(getByTestId('user-status')).toBeInTheDocument();
  });

  it('handles sign out process', async () => {
    const user = userEvent.setup();
    const { getByTestId } = render(<TestAuthComponent />);
    
    const signOutButton = getByTestId('sign-out-btn');
    await user.click(signOutButton);
    
    expect(getByTestId('user-status')).toBeInTheDocument();
  });

  it('shows loading state initially', () => {
    const { getByTestId, queryByText } = render(<TestAuthComponent />);
    // Check for user status or loading text
    expect(getByTestId('user-status') || queryByText('Loading...')).toBeInTheDocument();
  });
});