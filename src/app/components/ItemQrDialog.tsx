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
import { InventoryItem } from '../context/InventoryContext';
import { theme } from '../../theme';

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
        <DialogHeader>
          <DialogTitle style={styles.headerTitle}>Kode QR Barang</DialogTitle>
        </DialogHeader>

        {/* QR Code Container */}
        <View style={styles.qrWrapper}>
          <View style={styles.qrCard}>
            <QRCodeSVG
              value={qrValue}
              size={180}
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
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  headerTitle: {
    textAlign: 'center',
  },
  qrWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
  },
  qrCard: {
    backgroundColor: '#FFFFFF',
    padding: theme.spacing.lg,
    borderRadius: theme.radii.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  infoContainer: {
    alignItems: 'center',
    marginVertical: theme.spacing.sm,
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
    marginTop: 4,
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
  },
  actionBtn: {
    flex: 1,
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
