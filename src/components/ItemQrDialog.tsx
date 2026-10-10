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
      <DialogContent style={styles.dialogCard}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Kode QR Barang</Text>
          <Text style={styles.subtitle}>Pindai untuk identifikasi cepat barang</Text>
        </View>

        {/* QR Code Container */}
        <View style={styles.qrWrapper}>
          <View style={styles.qrCard}>
            <QRCodeSVG
              value={qrValue}
              size={160}
              color="#111827"
              backgroundColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Item Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.itemName} numberOfLines={2}>
            {item.name}
          </Text>
          <View style={styles.codeBadge}>
            <Text style={styles.itemCode}>{qrValue}</Text>
          </View>
          <Text style={styles.itemMeta}>
            {item.category} • {item.location}
          </Text>
        </View>

        {/* Footer Actions */}
        <View style={styles.footer}>
          <Button
            variant="outline"
            onPress={() => onOpenChange(false)}
            style={styles.actionBtnOutline}
          >
            Tutup
          </Button>
          <Button onPress={handleShareOrPrint} style={styles.actionBtnPrimary}>
            <Printer size={16} color={theme.colors.white} style={styles.iconSpacing} />
            <Text style={styles.btnText}>Bagikan / Cetak</Text>
          </Button>
        </View>
      </DialogContent>
    </Dialog>
  );
}

const styles = StyleSheet.create({
  dialogCard: {
    padding: 22,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 14,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.foreground,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    color: theme.colors.mutedForeground,
    textAlign: 'center',
    marginTop: 2,
  },
  qrWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  qrCard: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 18,
    width: '100%',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.foreground,
    textAlign: 'center',
    marginBottom: 6,
  },
  codeBadge: {
    backgroundColor: theme.colors.primarySoft,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 4,
  },
  itemCode: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'monospace',
    color: theme.colors.primary,
  },
  itemMeta: {
    fontSize: 12,
    color: theme.colors.mutedForeground,
    textAlign: 'center',
  },
  footer: {
    width: '100%',
    flexDirection: 'row',
    gap: 10,
  },
  actionBtnOutline: {
    flex: 1,
    height: 44,
  },
  actionBtnPrimary: {
    flex: 1.4,
    height: 44,
  },
  iconSpacing: {
    marginRight: 6,
  },
  btnText: {
    color: theme.colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
});
