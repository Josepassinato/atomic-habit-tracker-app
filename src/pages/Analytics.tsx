import React from 'react';
import { AdvancedAnalyticsDashboard } from '@/components/analytics/AdvancedAnalyticsDashboard';
import PageNavigation from '@/components/PageNavigation';

const Analytics: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <PageNavigation />
      <main className="container py-6">
        <AdvancedAnalyticsDashboard />
      </main>
    </div>
  );
};

export default Analytics;
