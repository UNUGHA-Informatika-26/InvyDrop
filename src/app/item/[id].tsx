import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { ItemDetailPage } from '@/components/ItemDetailPage';

export default function ItemDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <ItemDetailPage itemId={id ?? ''} />;
}
