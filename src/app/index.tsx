import React from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Layout } from '@/components/Layout';
import { InventoryPage } from '@/components/InventoryPage';

export default function IndexRoute() {
  return (
    <ProtectedRoute>
      <Layout>
        <InventoryPage />
      </Layout>
    </ProtectedRoute>
  );
}
