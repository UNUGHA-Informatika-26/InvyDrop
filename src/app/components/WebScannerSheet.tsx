import { useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X } from 'lucide-react';
import { toast } from 'sonner';

interface WebScannerSheetProps {
  onScanSuccess: (code: string) => void;
  onClose: () => void;
}

export function WebScannerSheet({ onScanSuccess, onClose }: WebScannerSheetProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isStoppedRef = useRef(false);

  useEffect(() => {
    const scannerId = 'web-scanner-reader';
    const scanner = new Html5Qrcode(scannerId);
    scannerRef.current = scanner;
    isStoppedRef.current = false;

    const startScanner = async () => {
      try {
        await scanner.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: 250,
          },
          async (decodedText) => {
            if (isStoppedRef.current) return;
            isStoppedRef.current = true;
            try {
              if (scanner.isScanning) {
                await scanner.stop();
              }
              scanner.clear();
            } catch (err) {
              console.error('Error stopping web scanner:', err);
            }
            onScanSuccess(decodedText);
          },
          () => {
            // Frame parse error ignored during continuous stream
          }
        );
      } catch (err: any) {
        console.error('Web scanner start error:', err);
        toast.error('Tidak dapat mengakses kamera browser: ' + (err?.message || 'Pastikan izin kamera diizinkan'));
        onClose();
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      startScanner();
    }, 100);

    return () => {
      clearTimeout(timer);
      isStoppedRef.current = true;
      if (scanner.isScanning) {
        scanner.stop().catch(console.error).finally(() => {
          try {
            scanner.clear();
          } catch {}
        });
      } else {
        try {
          scanner.clear();
        } catch {}
      }
    };
  }, [onScanSuccess, onClose]);

  const handleClose = async () => {
    isStoppedRef.current = true;
    if (scannerRef.current?.isScanning) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch (err) {
        console.error('Error stopping on close:', err);
      }
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between overflow-hidden">
      {/* Top Header */}
      <div className="pt-[calc(env(safe-area-inset-top)+1rem)] px-5 pb-3 flex items-center justify-between z-10">
        <button
          type="button"
          onClick={handleClose}
          aria-label="Tutup Scanner"
          className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white active:scale-95 transition-transform"
        >
          <X className="w-6 h-6" />
        </button>
        <p className="text-white text-base font-medium">Arahkan kamera ke QR code</p>
        <div className="w-11" />
      </div>

      {/* Camera Viewfinder */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-[300px] aspect-square rounded-3xl overflow-hidden relative shadow-2xl border-2 border-primary/50 bg-neutral-900">
          <div id="web-scanner-reader" className="w-full h-full" />
        </div>
        <p className="text-white/70 text-xs mt-6 text-center max-w-xs">
          Posisikan kode QR di dalam bingkai scanner
        </p>
      </div>

      {/* Bottom Safe area space */}
      <div className="pb-[calc(env(safe-area-inset-bottom)+1.5rem)] px-6 text-center">
        <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs font-mono">
          Warehouse Scanner
        </span>
      </div>
    </div>
  );
}
