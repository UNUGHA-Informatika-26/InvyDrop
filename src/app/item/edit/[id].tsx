import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { EditItemPage } from '@/components/EditItemPage';

export default function EditItemRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <EditItemPage itemId={id ?? ''} />;
}
