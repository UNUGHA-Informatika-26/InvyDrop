import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { X } from 'lucide-react-native';
import { theme } from '../../theme';
import { Button } from '@/components/ui/Button';

interface WebScannerSheetProps {
  onScanSuccess: (code: string) => void;
  onClose: () => void;
}

export function WebScannerSheet({ onScanSuccess, onClose }: WebScannerSheetProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanned, setIsScanned] = useState(false);

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    if (isScanned) return;
    setIsScanned(true);
    onScanSuccess(data);
  };

  return (
    <Modal
      visible
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            onPress={onClose}
            style={styles.closeButton}
          >
            <X size={24} color={theme.colors.white} />
          </Pressable>
          <Text style={styles.headerTitle}>Arahkan kamera ke QR code</Text>
          <View style={styles.closePlaceholder} />
        </View>

        {/* Camera Viewfinder */}
        <View style={styles.viewfinderContainer}>
          {!permission ? (
            <ActivityIndicator size="large" color={theme.colors.primary} />
          ) : !permission.granted ? (
            <View style={styles.permissionCard}>
              <Text style={styles.permissionText}>
                Izin kamera diperlukan untuk memindai kode QR inventaris gudang.
              </Text>
              <Button onPress={requestPermission} style={styles.permissionButton}>
                Izinkan Kamera
              </Button>
            </View>
          ) : (
            <View style={styles.cameraBox}>
              <CameraView
                style={StyleSheet.absoluteFill}
                barcodeScannerSettings={{
                  barcodeTypes: ['qr'],
                }}
                onBarcodeScanned={isScanned ? undefined : handleBarcodeScanned}
              />
              <View style={styles.reticle} pointerEvents="none" />
            </View>
          )}

          <Text style={styles.helperText}>
            Posisikan kode QR di dalam bingkai scanner
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Warehouse Scanner</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'space-between',
  },
  header: {
    paddingTop: 54,
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closePlaceholder: {
    width: 44,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: theme.typography.fontBase,
    fontWeight: '600',
  },
  viewfinderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  cameraBox: {
    width: 280,
    height: 280,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: theme.colors.primary,
    backgroundColor: '#111111',
    position: 'relative',
  },
  reticle: {
    ...StyleSheet.absoluteFill,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 22,
  },
  helperText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: theme.typography.fontSm,
    marginTop: 24,
    textAlign: 'center',
  },
  permissionCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radii.lg,
    padding: theme.spacing.lg,
    alignItems: 'center',
    maxWidth: 320,
  },
  permissionText: {
    fontSize: theme.typography.fontBase,
    color: theme.colors.foreground,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  permissionButton: {
    width: '100%',
  },
  footer: {
    paddingBottom: 40,
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  badgeText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: theme.typography.fontXs,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
});
