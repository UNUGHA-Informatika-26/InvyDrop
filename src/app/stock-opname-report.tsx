/**
 * src/app/stock-opname-report.tsx
 * Rute Expo Router untuk Ringkasan Laporan Stock Opname Massal
 */

import React from 'react';
import { useRouter } from 'expo-router';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { OpnameReportPage } from '@/components/OpnameReportPage';

export default function StockOpnameReportRoute() {
  const router = useRouter();

  return (
    <ProtectedRoute>
      <OpnameReportPage
        onBack={() => router.back()}
        onConfirm={() => {
          // TODO: Fase B - eksekusi pembaruan stok & navigasi kembali ke beranda
          router.replace('/');
        }}
      />
    </ProtectedRoute>
  );
}
