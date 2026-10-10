import { useState, useRef, useCallback } from 'react';
import { Capacitor } from '@capacitor/core';
import { BarcodeScanner, BarcodeFormat } from '@capacitor-mlkit/barcode-scanning';
import { toast } from 'sonner';

export function useQrScanner() {
  const [isWebScannerOpen, setIsWebScannerOpen] = useState(false);
  const [isNativeScanning, setIsNativeScanning] = useState(false);
  const webScanResolverRef = useRef<((code: string | null) => void) | null>(null);

  const scan = useCallback(async (): Promise<string | null> => {
    try {
      if (Capacitor.isNativePlatform()) {
        setIsNativeScanning(true);
        try {
          let permissions = await BarcodeScanner.checkPermissions();
          if (permissions.camera !== 'granted') {
            permissions = await BarcodeScanner.requestPermissions();
          }

          if (permissions.camera !== 'granted') {
            toast.error('Izin kamera diperlukan untuk scan');
            return null;
          }

          if (Capacitor.getPlatform() === 'android') {
            const { available } = await BarcodeScanner.isGoogleBarcodeScannerModuleAvailable();
            if (!available) {
              await BarcodeScanner.installGoogleBarcodeScannerModule();
              toast.info('Sedang mengunduh modul scanner Google, silakan coba beberapa saat lagi');
              return null;
            }
          }

          const { barcodes } = await BarcodeScanner.scan({
            formats: [BarcodeFormat.QrCode],
          });

          return barcodes[0]?.rawValue ?? null;
        } finally {
          setIsNativeScanning(false);
        }
      } else {
        // Fallback browser dev
        setIsWebScannerOpen(true);
        return new Promise<string | null>((resolve) => {
          webScanResolverRef.current = resolve;
        });
      }
    } catch (error: any) {
      toast.error('Gagal scan QR: ' + (error?.message || 'Terjadi kesalahan sistem'));
      return null;
    }
  }, []);

  const handleWebScanSuccess = useCallback((code: string) => {
    setIsWebScannerOpen(false);
    if (webScanResolverRef.current) {
      webScanResolverRef.current(code);
      webScanResolverRef.current = null;
    }
  }, []);

  const handleWebScanClose = useCallback(() => {
    setIsWebScannerOpen(false);
    if (webScanResolverRef.current) {
      webScanResolverRef.current(null);
      webScanResolverRef.current = null;
    }
  }, []);

  return {
    scan,
    isWebScannerOpen,
    isScanning: isWebScannerOpen || isNativeScanning,
    handleWebScanSuccess,
    handleWebScanClose,
  };
}
