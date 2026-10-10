import { useState } from 'react';
import { Outlet } from 'react-router';
import { BottomNav } from './BottomNav';
import { useInventory, InventoryItem } from '../context/InventoryContext';
import { useQrScanner } from '../../hooks/useQrScanner';
import { WebScannerSheet } from './WebScannerSheet';
import { ScanDetailDrawer } from './ScanDetailDrawer';
import { AddItemDialog } from './AddItemDialog';
import { ItemQrDialog } from './ItemQrDialog';
import { toast } from 'sonner';

export function Layout() {
  const { items, isAddDialogOpen, setIsAddDialogOpen, initialAddCode, openAddItem } = useInventory();
  const { scan, isWebScannerOpen, isScanning, handleWebScanSuccess, handleWebScanClose } = useQrScanner();

  const [scannedItem, setScannedItem] = useState<InventoryItem | null>(null);
  const [isQuickDetailOpen, setIsQuickDetailOpen] = useState(false);
  const [qrItem, setQrItem] = useState<InventoryItem | null>(null);
  const [isQrDialogOpen, setIsQrDialogOpen] = useState(false);

  const handleScanResult = (rawCode: string) => {
    const code = rawCode.trim();
    if (!code) return;

    // Search item by code (or fallback by id)
    const found = items.find(
      item =>
        (item.code && item.code.trim().toLowerCase() === code.toLowerCase()) ||
        item.id === code
    );

    if (found) {
      setScannedItem(found);
      setIsQuickDetailOpen(true);
      toast.success(`Barang ditemukan: ${found.name}`);
    } else {
      toast.error('Barang tidak ditemukan', {
        description: `Kode "${code}" belum terdaftar di inventaris`,
        action: {
          label: 'Tambah barang baru',
          onClick: () => {
            openAddItem(code);
          },
        },
        duration: 5000,
      });
    }
  };

  const handleStartScan = async () => {
    const result = await scan();
    if (result) {
      handleScanResult(result);
    }
  };

  const handleShowQrFromDetail = (item: InventoryItem) => {
    setQrItem(item);
    setIsQrDialogOpen(true);
  };

  return (
    <div className="app-shell h-dvh flex flex-col overflow-hidden bg-background">
      {/* Scrollable Main Content */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden pb-4">
        <Outlet />
      </main>

      {/* Unified Bottom Navigation (hidden when scanner is open) */}
      {!isScanning && (
        <BottomNav
          onAddClick={() => openAddItem()}
          onScanClick={handleStartScan}
        />
      )}

      {/* Web Scanner Fallback (Browser dev / non-native) */}
      {isWebScannerOpen && (
        <WebScannerSheet
          onScanSuccess={(code) => {
            handleWebScanSuccess(code);
            handleScanResult(code);
          }}
          onClose={handleWebScanClose}
        />
      )}

      {/* Quick Detail Bottom Sheet (Vaul Drawer) */}
      <ScanDetailDrawer
        open={isQuickDetailOpen}
        onOpenChange={setIsQuickDetailOpen}
        item={scannedItem}
        onShowQr={handleShowQrFromDetail}
      />

      {/* Global Add Item Dialog */}
      <AddItemDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        initialCode={initialAddCode}
      />

      {/* Global QR Code Dialog */}
      <ItemQrDialog
        open={isQrDialogOpen}
        onOpenChange={setIsQrDialogOpen}
        item={qrItem}
      />
    </div>
  );
}