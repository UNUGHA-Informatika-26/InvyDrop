import React from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AppThemeProvider } from '@/theme/ThemeProvider';
import { AuthProvider } from '@/context/AuthContext';
import { InventoryProvider } from '@/context/InventoryContext';
import { StockHistoryProvider } from '@/context/StockHistoryContext';
import { ToastProvider } from '@/components/ui/Toast';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppThemeProvider>
        <AuthProvider>
          <InventoryProvider>
            <StockHistoryProvider>
              <ToastProvider>
                <StatusBar style="dark" />
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="index" />
                  <Stack.Screen name="statistics" />
                  <Stack.Screen name="settings" />
                  <Stack.Screen name="login" />
                  <Stack.Screen name="signup" />
                  <Stack.Screen name="item/[id]" />
                  <Stack.Screen name="item/edit/[id]" />
                  <Stack.Screen name="add-item" />
                </Stack>
              </ToastProvider>
            </StockHistoryProvider>
          </InventoryProvider>
        </AuthProvider>
      </AppThemeProvider>
    </SafeAreaProvider>
  );
}
