import React from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Layout } from '@/components/Layout';
import { SettingsPage } from '@/components/SettingsPage';

export default function SettingsRoute() {
  return (
    <ProtectedRoute>
      <Layout>
        <SettingsPage />
      </Layout>
    </ProtectedRoute>
  );
}
