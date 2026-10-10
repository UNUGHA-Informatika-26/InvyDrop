import React from 'react';
import { View, Text, StyleSheet, Share } from 'react-native';
import QRCodeSVG from 'react-native-qrcode-svg';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Printer } from 'lucide-react-native';
import { InventoryItem } from '@/context/InventoryContext';
import { theme } from '@/theme';

interface ItemQrDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: InventoryItem | null;
}

export function ItemQrDialog({ open, onOpenChange, item }: ItemQrDialogProps) {
  if (!item) return null;

  const qrValue = item.code || item.id;

  const handleShareOrPrint = async () => {
    try {
      await Share.share({
        message: `Warehouse Item: ${item.name} | Code: ${qrValue} | Location: ${item.location} | Qty: ${item.quantity}`,
        title: `QR Code: ${item.name}`,
      });
    } catch (e) {
      console.error('Error sharing QR data:', e);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent style={styles.dialogContent}>
        <DialogHeader style={styles.header}>
          <DialogTitle style={styles.headerTitle}>Kode QR Barang</DialogTitle>
        </DialogHeader>

        {/* QR Code Container */}
        <View style={styles.qrWrapper}>
          <View style={styles.qrCard}>
            <QRCodeSVG
              value={qrValue}
              size={150}
              color="#000000"
              backgroundColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Item Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.itemName} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.itemCode}>{qrValue}</Text>
          <Text style={styles.itemMeta}>
            {item.category} • {item.location}
          </Text>
        </View>

        <DialogFooter style={styles.footer}>
          <Button
            variant="outline"
            onPress={() => onOpenChange(false)}
            style={styles.actionBtn}
          >
            Tutup
          </Button>
          <Button onPress={handleShareOrPrint} style={styles.actionBtn}>
            <Printer size={16} color={theme.colors.white} style={styles.iconSpacing} />
            <Text style={styles.btnText}>Bagikan / Cetak</Text>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const styles = StyleSheet.create({
  dialogContent: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  header: {
    marginBottom: 4,
  },
  headerTitle: {
    textAlign: 'center',
    fontSize: theme.typography.fontLg,
  },
  qrWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  qrCard: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
  },
  infoContainer: {
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 6,
  },
  itemName: {
    fontSize: theme.typography.fontBase,
    fontWeight: '700',
    color: theme.colors.foreground,
    textAlign: 'center',
  },
  itemCode: {
    fontSize: theme.typography.fontSm,
    fontWeight: '600',
    fontFamily: 'monospace',
    color: theme.colors.primary,
    marginTop: 2,
  },
  itemMeta: {
    fontSize: theme.typography.fontXs,
    color: theme.colors.mutedForeground,
    marginTop: 2,
  },
  footer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
    marginTop: 8,
  },
  actionBtn: {
    flex: 1,
    height: 42,
  },
  iconSpacing: {
    marginRight: 6,
  },
  btnText: {
    color: theme.colors.white,
    fontWeight: '600',
    fontSize: theme.typography.fontSm,
  },
});
