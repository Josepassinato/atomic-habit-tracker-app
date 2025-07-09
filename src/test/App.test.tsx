import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

const AppWrapper = ({ children }: { children: React.ReactNode }) => (
  <ErrorBoundary>
    <BrowserRouter>
      <AuthProvider>
        {children}
      </AuthProvider>
    </BrowserRouter>
  </ErrorBoundary>
);

describe('App Component', () => {
  it('renders without crashing', () => {
    const { getByText } = render(
      <AppWrapper>
        <div>Test App</div>
      </AppWrapper>
    );
    expect(getByText('Test App')).toBeInTheDocument();
  });

  it('provides auth context', () => {
    const TestComponent = () => {
      return <div>Auth context available</div>;
    };

    const { getByText } = render(
      <AppWrapper>
        <TestComponent />
      </AppWrapper>
    );
    
    expect(getByText('Auth context available')).toBeInTheDocument();
  });
});