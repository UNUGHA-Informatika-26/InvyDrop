import { useState, useRef, useCallback } from 'react';

export function useQrScanner() {
  const [isScanning, setIsScanning] = useState(false);
  const scanResolverRef = useRef<((code: string | null) => void) | null>(null);

  const scan = useCallback((): Promise<string | null> => {
    setIsScanning(true);
    return new Promise<string | null>((resolve) => {
      scanResolverRef.current = resolve;
    });
  }, []);

  const handleScanSuccess = useCallback((code: string) => {
    setIsScanning(false);
    if (scanResolverRef.current) {
      scanResolverRef.current(code);
      scanResolverRef.current = null;
    }
  }, []);

  const handleScanClose = useCallback(() => {
    setIsScanning(false);
    if (scanResolverRef.current) {
      scanResolverRef.current(null);
      scanResolverRef.current = null;
    }
  }, []);

  return {
    scan,
    isScanning,
    isWebScannerOpen: isScanning, // compatibility
    handleScanSuccess,
    handleScanClose,
    handleWebScanSuccess: handleScanSuccess, // compatibility
    handleWebScanClose: handleScanClose, // compatibility
  };
}
