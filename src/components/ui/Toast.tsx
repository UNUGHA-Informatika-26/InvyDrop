import React, { createContext, useContext, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { theme } from '../../theme';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'error' | 'info';
}

interface ToastContextType {
  show: (msg: Omit<ToastMessage, 'id'>) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

let globalShowToast: ((msg: Omit<ToastMessage, 'id'>) => void) | null = null;

export const toast = {
  success: (title: string, options?: { description?: string; action?: { label: string; onClick: () => void }; duration?: number }) => {
    if (globalShowToast) {
      globalShowToast({ title, description: options?.description, type: 'success' });
    }
  },
  error: (title: string, options?: { description?: string; action?: { label: string; onClick: () => void }; duration?: number }) => {
    if (globalShowToast) {
      globalShowToast({ title, description: options?.description, type: 'error' });
    }
  },
  info: (title: string, options?: { description?: string }) => {
    if (globalShowToast) {
      globalShowToast({ title, description: options?.description, type: 'info' });
    }
  },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [currentToast, setCurrentToast] = useState<ToastMessage | null>(null);

  const show = useCallback((msg: Omit<ToastMessage, 'id'>) => {
    const id = Date.now().toString();
    setCurrentToast({ ...msg, id });
    setTimeout(() => {
      setCurrentToast(prev => (prev?.id === id ? null : prev));
    }, 3500);
  }, []);

  globalShowToast = show;

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {currentToast && (
        <View style={styles.toastContainer} pointerEvents="none">
          <View
            style={[
              styles.toastCard,
              currentToast.type === 'error' && styles.errorCard,
              currentToast.type === 'success' && styles.successCard,
            ]}
          >
            <Text
              style={[
                styles.toastTitle,
                currentToast.type === 'error' && styles.errorText,
                currentToast.type === 'success' && styles.successText,
              ]}
            >
              {currentToast.title}
            </Text>
            {currentToast.description ? (
              <Text style={styles.toastDescription}>{currentToast.description}</Text>
            ) : null}
          </View>
        </View>
      )}
    </ToastContext.Provider>
  );
}

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    zIndex: 9999,
    alignItems: 'center',
  },
  toastCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radii.lg,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
    width: '100%',
  },
  successCard: {
    backgroundColor: theme.colors.successSoft,
    borderColor: theme.colors.success,
  },
  errorCard: {
    backgroundColor: theme.colors.destructiveSoft,
    borderColor: theme.colors.destructive,
  },
  toastTitle: {
    fontSize: theme.typography.fontBase,
    fontWeight: '600',
    color: theme.colors.foreground,
  },
  toastDescription: {
    fontSize: theme.typography.fontSm,
    color: theme.colors.mutedForeground,
    marginTop: 2,
  },
  successText: {
    color: theme.colors.success,
  },
  errorText: {
    color: theme.colors.destructive,
  },
});
