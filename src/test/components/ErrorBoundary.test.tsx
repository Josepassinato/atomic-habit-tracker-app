import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

// Component that throws an error
const BuggyComponent = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>Working component</div>;
};

describe('ErrorBoundary', () => {
  // Suppress console.error for these tests
  const originalError = console.error;
  beforeEach(() => {
    console.error = vi.fn();
  });
  
  afterEach(() => {
    console.error = originalError;
  });

  it('renders children when there is no error', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <BuggyComponent shouldThrow={false} />
      </ErrorBoundary>
    );
    
    expect(getByText('Working component')).toBeInTheDocument();
  });

  it('renders error UI when there is an error', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <BuggyComponent shouldThrow={true} />
      </ErrorBoundary>
    );
    
    expect(getByText(/Something went wrong/)).toBeInTheDocument();
    expect(getByText('Try Again')).toBeInTheDocument();
    expect(getByText('Reload Page')).toBeInTheDocument();
  });

  it('can reset error state', async () => {
    const user = userEvent.setup();
    const { getByText, rerender } = render(
      <ErrorBoundary>
        <BuggyComponent shouldThrow={true} />
      </ErrorBoundary>
    );
    
    // Error UI should be visible
    expect(getByText(/Something went wrong/)).toBeInTheDocument();
    
    // Click try again button
    await user.click(getByText('Try Again'));
    
    // Re-render with non-throwing component
    rerender(
      <ErrorBoundary>
        <BuggyComponent shouldThrow={false} />
      </ErrorBoundary>
    );
    
    expect(getByText('Working component')).toBeInTheDocument();
  });

  it('shows custom fallback when provided', () => {
    const customFallback = <div>Custom error message</div>;
    
    const { getByText } = render(
      <ErrorBoundary fallback={customFallback}>
        <BuggyComponent shouldThrow={true} />
      </ErrorBoundary>
    );
    
    expect(getByText('Custom error message')).toBeInTheDocument();
  });
});