import React from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Layout } from '@/components/Layout';
import { StatisticsPage } from '@/components/StatisticsPage';

export default function StatisticsRoute() {
  return (
    <ProtectedRoute>
      <Layout>
        <StatisticsPage />
      </Layout>
    </ProtectedRoute>
  );
}
