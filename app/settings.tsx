import React from 'react';
import { ProtectedRoute } from '@/app/components/ProtectedRoute';
import { Layout } from '@/app/components/Layout';
import { SettingsPage } from '@/app/components/SettingsPage';

export default function SettingsRoute() {
  return (
    <ProtectedRoute>
      <Layout>
        <SettingsPage />
      </Layout>
    </ProtectedRoute>
  );
}
