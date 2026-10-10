import React from 'react';
import { ProtectedRoute } from '@/app/components/ProtectedRoute';
import { Layout } from '@/app/components/Layout';
import { StatisticsPage } from '@/app/components/StatisticsPage';

export default function StatisticsRoute() {
  return (
    <ProtectedRoute>
      <Layout>
        <StatisticsPage />
      </Layout>
    </ProtectedRoute>
  );
}
