import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { InventoryItem, useInventory } from '../context/InventoryContext';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from '@/components/ui/Drawer';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { Label } from '@/components/ui/Label';
import { Plus, Minus, QrCode, ArrowRight, AlertTriangle, Package } from 'lucide-react-native';
import { toast } from '@/components/ui/Toast';
import { useRouter } from 'expo-router';
import { theme } from '../../theme';

interface ScanDetailDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: InventoryItem | null;
  onShowQr: (item: InventoryItem) => void;
}

export function ScanDetailDrawer({
  open,
  onOpenChange,
  item,
  onShowQr,
}: ScanDetailDrawerProps) {
  const { addStock, removeStock, items } = useInventory();
  const router = useRouter();
  const [quantity, setQuantity] = useState('1');

  const currentItem = item ? items.find(i => i.id === item.id) || item : null;

  useEffect(() => {
    if (open) {
      setQuantity('1');
    }
  }, [open]);

  if (!currentItem) return null;

  const isLowStock = currentItem.quantity <= currentItem.minStock;
  const isOutOfStock = currentItem.quantity === 0;

  const handleStockIn = () => {
    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty < 1) {
      toast.error('Masukkan jumlah barang masuk minimal 1');
      return;
    }
    addStock(currentItem.id, qty);
    toast.success(`Berhasil menambah +${qty} ${currentItem.name}`);
    setQuantity('1');
  };

  const handleStockOut = () => {
    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty < 1) {
      toast.error('Masukkan jumlah barang keluar minimal 1');
      return;
    }
    if (qty > currentItem.quantity) {
      toast.error(`Jumlah keluar (${qty}) melebihi stok yang ada (${currentItem.quantity})`);
      return;
    }
    removeStock(currentItem.id, qty);
    toast.success(`Berhasil mengeluarkan -${qty} ${currentItem.name}`);
    setQuantity('1');
  };

  const handleViewDetail = () => {
    onOpenChange(false);
    router.push('/');
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent style={styles.container}>
        <DrawerHeader style={styles.header}>
          <View style={styles.badgeRow}>
            <View style={styles.detailBadge}>
              <Text style={styles.detailBadgeText}>DETAIL CEPAT</Text>
            </View>
            {isLowStock && (
              <View style={styles.lowStockBadge}>
                <AlertTriangle size={12} color={theme.colors.warning} />
                <Text style={styles.lowStockText}>Stok Menipis</Text>
              </View>
            )}
          </View>
          <DrawerTitle style={styles.title}>{currentItem.name}</DrawerTitle>
          <DrawerDescription style={styles.description}>
            <View style={styles.codeBadge}>
              <Text style={styles.codeBadgeText}>
                {currentItem.code || currentItem.id}
              </Text>
            </View>
            <Text style={styles.metaDot}>•</Text>
            <Text style={styles.metaText}>{currentItem.category}</Text>
            <Text style={styles.metaDot}>•</Text>
            <Text style={styles.metaText}>{currentItem.location}</Text>
          </DrawerDescription>
        </DrawerHeader>

        <View style={styles.body}>
          {/* Current Stock Banner */}
          <View style={styles.stockCard}>
            <View style={styles.stockLeft}>
              <View style={styles.iconCircle}>
                <Package size={22} color={theme.colors.primary} />
              </View>
              <View>
                <Text style={styles.stockLabel}>Stok Saat Ini</Text>
                <Text style={styles.stockNumber}>{currentItem.quantity}</Text>
              </View>
            </View>
            <View style={styles.stockRight}>
              <Text style={styles.stockLabel}>Batas Minimum</Text>
              <Text style={styles.stockMin}>{currentItem.minStock} unit</Text>
            </View>
          </View>

          {/* Quantity Input */}
          <View style={styles.inputGroup}>
            <Label>Jumlah Perubahan</Label>
            <TextField
              keyboardType="numeric"
              value={quantity}
              onChangeText={setQuantity}
              placeholder="1"
            />
          </View>

          {/* Quick stock adjustments */}
          <View style={styles.btnRow}>
            <Button onPress={handleStockIn} style={[styles.actionBtn, styles.inBtn]}>
              <Plus size={16} color={theme.colors.white} style={styles.btnIcon} />
              <Text style={styles.btnText}>Barang Masuk (+)</Text>
            </Button>
            <Button
              onPress={handleStockOut}
              disabled={isOutOfStock}
              style={[styles.actionBtn, styles.outBtn]}
            >
              <Minus size={16} color={theme.colors.white} style={styles.btnIcon} />
              <Text style={styles.btnText}>Barang Keluar (−)</Text>
            </Button>
          </View>
        </View>

        <DrawerFooter style={styles.footer}>
          <Button
            variant="outline"
            onPress={() => onShowQr(currentItem)}
            style={styles.footerBtn}
          >
            <QrCode size={16} color={theme.colors.foreground} style={styles.btnIcon} />
            <Text style={styles.outlineBtnText}>Tampilkan QR</Text>
          </Button>
          <Button
            variant="secondary"
            onPress={handleViewDetail}
            style={styles.footerBtn}
          >
            <Text style={styles.secondaryBtnText}>Lihat detail</Text>
            <ArrowRight size={16} color={theme.colors.foreground} style={styles.btnIconRight} />
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 24,
  },
  header: {
    paddingBottom: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailBadge: {
    backgroundColor: theme.colors.primarySoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radii.full,
  },
  detailBadgeText: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontXs,
    fontWeight: '700',
  },
  lowStockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.warningSoft,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.radii.full,
    gap: 4,
  },
  lowStockText: {
    color: theme.colors.warning,
    fontSize: theme.typography.fontXs,
    fontWeight: '600',
  },
  title: {
    fontSize: theme.typography.fontXl,
    fontWeight: '700',
    color: theme.colors.foreground,
  },
  description: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    flexWrap: 'wrap',
    gap: 4,
  },
  codeBadge: {
    backgroundColor: theme.colors.secondary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  codeBadgeText: {
    fontSize: theme.typography.fontXs,
    fontWeight: '600',
    fontFamily: 'monospace',
    color: theme.colors.foreground,
  },
  metaDot: {
    fontSize: theme.typography.fontXs,
    color: theme.colors.mutedForeground,
  },
  metaText: {
    fontSize: theme.typography.fontXs,
    color: theme.colors.mutedForeground,
  },
  body: {
    paddingVertical: theme.spacing.md,
  },
  stockCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radii.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  stockLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: theme.colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stockLabel: {
    fontSize: theme.typography.fontXs,
    color: theme.colors.mutedForeground,
  },
  stockNumber: {
    fontSize: theme.typography.font2xl,
    fontWeight: '800',
    color: theme.colors.foreground,
  },
  stockRight: {
    alignItems: 'flex-end',
  },
  stockMin: {
    fontSize: theme.typography.fontBase,
    fontWeight: '600',
    color: theme.colors.foreground,
  },
  inputGroup: {
    marginBottom: theme.spacing.md,
  },
  btnRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  actionBtn: {
    flex: 1,
    height: 48,
  },
  inBtn: {
    backgroundColor: theme.colors.success,
  },
  outBtn: {
    backgroundColor: theme.colors.primary,
  },
  btnIcon: {
    marginRight: 6,
  },
  btnIconRight: {
    marginLeft: 6,
  },
  btnText: {
    color: theme.colors.white,
    fontWeight: '600',
    fontSize: theme.typography.fontSm,
  },
  footer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  footerBtn: {
    flex: 1,
  },
  outlineBtnText: {
    color: theme.colors.foreground,
    fontWeight: '600',
    fontSize: theme.typography.fontSm,
  },
  secondaryBtnText: {
    color: theme.colors.foreground,
    fontWeight: '600',
    fontSize: theme.typography.fontSm,
  },
});
