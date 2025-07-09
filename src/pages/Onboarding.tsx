
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';

const Onboarding: React.FC = () => {
  const { userProfile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if not authenticated
    if (!loading && !userProfile) {
      navigate('/auth');
      return;
    }

    // Skip onboarding if user already has data configured
    // You can add logic here to check if user has already completed onboarding
  }, [userProfile, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!userProfile) {
    return null; // Will redirect to auth
  }

  return <OnboardingFlow />;
};

export default Onboarding;
