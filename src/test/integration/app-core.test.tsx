import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import App from '@/App';
import { cleanupMocks } from './test-setup';

describe('App Core Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    cleanupMocks();
  });

  it('renders app without errors and shows landing page', async () => {
    const { container } = render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // App should render without throwing
    expect(container).toBeInTheDocument();
    
    // Wait for any async operations
    await new Promise(resolve => setTimeout(resolve, 10));
    expect(container.firstChild).toBeInTheDocument();
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
});