/**
 * src/app/stock-opname.tsx
 * Rute Expo Router untuk Sesi Stock Opname Massal
 */

import React from 'react';
import { useRouter } from 'expo-router';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { StockOpnameMassalPage } from '@/components/StockOpnameMassalPage';

export default function StockOpnameRoute() {
  const router = useRouter();

  return (
    <ProtectedRoute>
      <StockOpnameMassalPage
        onBack={() => router.back()}
        onFinish={() => router.push('/stock-opname-report')}
        onScanPress={() => {
          // TODO: Fase B - buka continuous camera scanner
        }}
        onFilterPress={() => {
          // TODO: Fase B - buka modal filter lokasi / status
        }}
      />
    </ProtectedRoute>
  );
}
