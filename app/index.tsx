import React from 'react';
import { ProtectedRoute } from '@/app/components/ProtectedRoute';
import { Layout } from '@/app/components/Layout';
import { InventoryPage } from '@/app/components/InventoryPage';

export default function IndexRoute() {
  return (
    <ProtectedRoute>
      <Layout>
        <InventoryPage />
      </Layout>
    </ProtectedRoute>
  );
}
