import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useInventory } from '@/context/InventoryContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/Dialog';
import { TextField } from '@/components/ui/TextField';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';
import { toast } from '@/components/ui/Toast';
import { theme } from '@/theme';

interface StockDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemId: string;
  itemName: string;
  currentStock: number;
  mode: 'add' | 'remove';
}

export function StockDialog({
  open,
  onOpenChange,
  itemId,
  itemName,
  currentStock,
  mode,
}: StockDialogProps) {
  const { addStock, removeStock } = useInventory();
  const [quantity, setQuantity] = useState('');

  const handleSubmit = () => {
    const qty = parseInt(quantity, 10);

    if (isNaN(qty) || qty <= 0) {
      toast.error('Masukkan jumlah yang valid');
      return;
    }

    if (mode === 'remove' && qty > currentStock) {
      toast.error(`Jumlah keluar melebihi stok yang ada (${currentStock})`);
      return;
    }

    if (mode === 'add') {
      addStock(itemId, qty);
      toast.success(`Berhasil menambah +${qty} unit ke ${itemName}`);
    } else {
      removeStock(itemId, qty);
      toast.success(`Berhasil mengeluarkan -${qty} unit dari ${itemName}`);
    }

    setQuantity('');
    onOpenChange(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setQuantity('');
    }
    onOpenChange(isOpen);
  };

  const parsedQty = parseInt(quantity, 10);
  const isValidQty = !isNaN(parsedQty) && parsedQty > 0;
  const newStock = mode === 'add' ? currentStock + (isValidQty ? parsedQty : 0) : currentStock - (isValidQty ? parsedQty : 0);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === 'add' ? 'Barang Masuk (Tambah Stok)' : 'Barang Keluar (Kurang Stok)'}
          </DialogTitle>
        </DialogHeader>

        <View style={styles.body}>
          {/* Current Stock Banner */}
          <View style={styles.stockBanner}>
            <Text style={styles.itemNameText}>{itemName}</Text>
            <Text style={styles.currentStockText}>
              Stok Saat Ini: <Text style={styles.boldStock}>{currentStock}</Text> unit
            </Text>
          </View>

          {/* Input field */}
          <View style={styles.inputGroup}>
            <Label>
              Jumlah yang akan {mode === 'add' ? 'Ditambahkan' : 'Dikeluarkan'}
            </Label>
            <TextField
              keyboardType="numeric"
              value={quantity}
              onChangeText={setQuantity}
              placeholder="Masukkan jumlah unit"
              autoFocus
            />
          </View>

          {/* Preview of new stock */}
          {isValidQty && (
            <View style={styles.previewBox}>
              <Text style={styles.previewLabel}>
                Estimasi stok baru:{' '}
                <Text style={styles.previewValue}>
                  {newStock} unit
                </Text>
              </Text>
            </View>
          )}
        </View>

        <DialogFooter style={styles.footer}>
          <Button
            variant="outline"
            onPress={() => handleOpenChange(false)}
            style={styles.btn}
          >
            Batal
          </Button>
          <Button
            onPress={handleSubmit}
            style={[
              styles.btn,
              mode === 'add' ? styles.addBtn : styles.removeBtn,
            ]}
          >
            {mode === 'add' ? 'Simpan (+)' : 'Keluarkan (−)'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const styles = StyleSheet.create({
  body: {
    paddingVertical: theme.spacing.md,
  },
  stockBanner: {
    backgroundColor: theme.colors.muted,
    padding: theme.spacing.md,
    borderRadius: theme.radii.md,
    marginBottom: theme.spacing.md,
  },
  itemNameText: {
    fontSize: theme.typography.fontBase,
    fontWeight: '700',
    color: theme.colors.foreground,
    marginBottom: 4,
  },
  currentStockText: {
    fontSize: theme.typography.fontSm,
    color: theme.colors.mutedForeground,
  },
  boldStock: {
    fontWeight: '700',
    color: theme.colors.primary,
  },
  inputGroup: {
    marginBottom: theme.spacing.md,
  },
  previewBox: {
    backgroundColor: theme.colors.primarySoft,
    padding: theme.spacing.md,
    borderRadius: theme.radii.md,
  },
  previewLabel: {
    fontSize: theme.typography.fontSm,
    color: theme.colors.mutedForeground,
  },
  previewValue: {
    fontWeight: '700',
    color: theme.colors.primary,
    fontSize: theme.typography.fontBase,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: theme.spacing.sm,
  },
  btn: {
    flex: 1,
  },
  addBtn: {
    backgroundColor: theme.colors.success,
  },
  removeBtn: {
    backgroundColor: theme.colors.primary,
  },
});