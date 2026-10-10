import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Slot } from 'expo-router';
import { BottomNav } from './BottomNav';
import { useInventory, InventoryItem } from '@/context/InventoryContext';
import { useQrScanner } from '@/hooks/useQrScanner';
import { WebScannerSheet } from './WebScannerSheet';
import { ScanDetailDrawer } from './ScanDetailDrawer';
import { AddItemDialog } from './AddItemDialog';
import { ItemQrDialog } from './ItemQrDialog';
import { toast } from '@/components/ui/Toast';
import { theme } from '@/theme';

interface LayoutProps {
  children?: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
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
      });
      openAddItem(code);
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
    <View style={styles.shell}>
      {/* Main Content Area */}
      <View style={styles.mainContent}>
        {children || <Slot />}
      </View>

      {/* Unified Bottom Navigation */}
      {!isScanning && (
        <BottomNav
          onAddClick={() => openAddItem()}
          onScanClick={handleStartScan}
        />
      )}

      {/* Native Camera Scanner Modal */}
      {isWebScannerOpen && (
        <WebScannerSheet
          onScanSuccess={(code) => {
            handleWebScanSuccess(code);
            handleScanResult(code);
          }}
          onClose={handleWebScanClose}
        />
      )}

      {/* Quick Detail Bottom Sheet */}
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
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  mainContent: {
    flex: 1,
  },
});