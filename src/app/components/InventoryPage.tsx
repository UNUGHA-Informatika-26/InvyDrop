import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  Pressable,
} from 'react-native';
import { useInventory, InventoryItem } from '../context/InventoryContext';
import { AlertTriangle, Trash2, Plus, Minus, Package, QrCode } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { StockDialog } from './StockDialog';
import { ItemQrDialog } from './ItemQrDialog';
import { HeroBanner } from './HeroBanner';
import warehouseImage from '@/assets/bulan-jatuh2.png';
import { toast } from '@/components/ui/Toast';
import { theme } from '../../theme';

export function InventoryPage() {
  const { items, removeItem } = useInventory();
  const [selectedQrItem, setSelectedQrItem] = useState<InventoryItem | null>(null);
  const [isQrDialogOpen, setIsQrDialogOpen] = useState(false);

  const [stockDialogState, setStockDialogState] = useState<{
    open: boolean;
    itemId: string;
    itemName: string;
    currentStock: number;
    mode: 'add' | 'remove';
  }>({
    open: false,
    itemId: '',
    itemName: '',
    currentStock: 0,
    mode: 'add',
  });

  const totalItems = items.length;
  const lowStockCount = items.filter(item => item.quantity <= item.minStock).length;

  const handleRemoveItem = (id: string, name: string) => {
    Alert.alert(
      'Hapus Barang',
      `Hapus "${name}" dari inventaris gudang?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: () => {
            removeItem(id);
            toast.success(`${name} telah dihapus`);
          },
        },
      ]
    );
  };

  const handleOpenStockDialog = (
    itemId: string,
    itemName: string,
    currentStock: number,
    mode: 'add' | 'remove'
  ) => {
    setStockDialogState({
      open: true,
      itemId,
      itemName,
      currentStock,
      mode,
    });
  };

  const handleOpenQrDialog = (item: InventoryItem) => {
    setSelectedQrItem(item);
    setIsQrDialogOpen(true);
  };

  const renderItem = ({ item }: { item: InventoryItem }) => {
    const isLowStock = item.quantity <= item.minStock;
    const isOutOfStock = item.quantity === 0;

    return (
      <View style={styles.itemCard}>
        {/* Item Title, Code, & Badge */}
        <View style={styles.cardHeader}>
          <View style={styles.titleColumn}>
            <View style={styles.titleRow}>
              <Text style={styles.itemNameText} numberOfLines={1}>
                {item.name}
              </Text>
              {item.code ? (
                <View style={styles.codeTag}>
                  <Text style={styles.codeTagText}>{item.code}</Text>
                </View>
              ) : null}
            </View>
            <Text style={styles.categoryLocationText}>
              {item.category} • {item.location}
            </Text>
          </View>

          {isLowStock ? (
            <View style={styles.lowBadge}>
              <AlertTriangle size={12} color={theme.colors.warning} />
              <Text style={styles.lowBadgeText}>Low</Text>
            </View>
          ) : null}
        </View>

        {/* Stock Metrics */}
        <View style={styles.metricsBox}>
          <View>
            <Text style={styles.metricLabel}>Stok Saat Ini</Text>
            <Text style={styles.metricValue}>{item.quantity}</Text>
          </View>
          <View style={styles.metricRight}>
            <Text style={styles.metricLabel}>Batas Minimum</Text>
            <Text style={styles.metricSubValue}>{item.minStock} unit</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <Button
            size="sm"
            onPress={() => handleOpenStockDialog(item.id, item.name, item.quantity, 'add')}
            style={[styles.actionBtn, styles.masukBtn]}
          >
            <Plus size={14} color={theme.colors.white} style={styles.iconMargin} />
            <Text style={styles.actionBtnWhiteText}>Masuk</Text>
          </Button>

          <Button
            size="sm"
            onPress={() => handleOpenStockDialog(item.id, item.name, item.quantity, 'remove')}
            disabled={isOutOfStock}
            style={[styles.actionBtn, styles.keluarBtn]}
          >
            <Minus size={14} color={theme.colors.white} style={styles.iconMargin} />
            <Text style={styles.actionBtnWhiteText}>Keluar</Text>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onPress={() => handleOpenQrDialog(item)}
            style={styles.iconBtn}
          >
            <QrCode size={16} color={theme.colors.foreground} />
          </Button>

          <Button
            size="sm"
            variant="destructive"
            onPress={() => handleRemoveItem(item.id, item.name)}
            style={styles.iconBtn}
          >
            <Trash2 size={16} color={theme.colors.white} />
          </Button>
        </View>
      </View>
    );
  };

  const ListHeader = (
    <View>
      {/* Header Banner */}
      <HeroBanner
        imageSrc={warehouseImage}
        title="InvyDrop"
        subtitle="Sistem Manajemen Gudang & Logistik"
      />

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={styles.iconBoxPrimary}>
              <Package size={22} color={theme.colors.primary} />
            </View>
            <Text style={styles.statNumberPrimary}>{totalItems}</Text>
            <Text style={styles.statLabel}>Total Barang</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.iconBoxWarning}>
              <AlertTriangle size={22} color={theme.colors.warning} />
            </View>
            <Text style={styles.statNumberWarning}>{lowStockCount}</Text>
            <Text style={styles.statLabel}>Stok Menipis</Text>
          </View>
        </View>
      </View>

      {/* Inventory Section Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Daftar Barang</Text>
        <Text style={styles.sectionSubtitle}>{totalItems} barang tercatat di sistem</Text>
      </View>
    </View>
  );

  const ListEmpty = (
    <View style={styles.emptyContainer}>
      <Package size={48} color={theme.colors.mutedForeground} style={styles.emptyIcon} />
      <Text style={styles.emptyTitle}>Belum ada barang di inventaris</Text>
      <Text style={styles.emptySubtitle}>
        Gunakan tombol Tambah di navbar bawah untuk menambahkan barang
      </Text>
    </View>
  );

  return (
    <View style={styles.screen}>
      <FlatList
        data={items}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListEmpty}
        contentContainerStyle={styles.listContent}
      />

      {/* Stock Adjustment Dialog */}
      <StockDialog
        open={stockDialogState.open}
        onOpenChange={open => setStockDialogState(prev => ({ ...prev, open }))}
        itemId={stockDialogState.itemId}
        itemName={stockDialogState.itemName}
        currentStock={stockDialogState.currentStock}
        mode={stockDialogState.mode}
      />

      {/* QR Dialog */}
      <ItemQrDialog
        open={isQrDialogOpen}
        onOpenChange={setIsQrDialogOpen}
        item={selectedQrItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listContent: {
    paddingBottom: 24,
  },
  statsContainer: {
    paddingHorizontal: 16,
    marginTop: -28,
    marginBottom: 20,
    zIndex: 10,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radii.lg,
    padding: theme.spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  iconBoxPrimary: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: theme.colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  iconBoxWarning: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: theme.colors.warningSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  statNumberPrimary: {
    fontSize: theme.typography.font2xl,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  statNumberWarning: {
    fontSize: theme.typography.font2xl,
    fontWeight: '800',
    color: theme.colors.warning,
  },
  statLabel: {
    fontSize: theme.typography.fontXs,
    color: theme.colors.mutedForeground,
    marginTop: 2,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: theme.typography.fontXl,
    fontWeight: '800',
    color: theme.colors.foreground,
  },
  sectionSubtitle: {
    fontSize: theme.typography.fontXs,
    color: theme.colors.mutedForeground,
    marginTop: 2,
  },
  itemCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radii.lg,
    padding: theme.spacing.md,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  titleColumn: {
    flex: 1,
    marginRight: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 4,
  },
  itemNameText: {
    fontSize: theme.typography.fontBase,
    fontWeight: '700',
    color: theme.colors.foreground,
  },
  codeTag: {
    backgroundColor: theme.colors.secondary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  codeTagText: {
    fontFamily: 'monospace',
    fontSize: theme.typography.fontXs,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  categoryLocationText: {
    fontSize: theme.typography.fontXs,
    color: theme.colors.mutedForeground,
  },
  lowBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.warningSoft,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  lowBadgeText: {
    fontSize: theme.typography.fontXs,
    fontWeight: '700',
    color: theme.colors.warning,
  },
  metricsBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.muted,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: theme.radii.md,
    marginBottom: 12,
  },
  metricLabel: {
    fontSize: theme.typography.fontXs,
    color: theme.colors.mutedForeground,
  },
  metricValue: {
    fontSize: theme.typography.font2xl,
    fontWeight: '800',
    color: theme.colors.foreground,
  },
  metricRight: {
    alignItems: 'flex-end',
  },
  metricSubValue: {
    fontSize: theme.typography.fontSm,
    fontWeight: '600',
    color: theme.colors.mutedForeground,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    height: 38,
  },
  masukBtn: {
    backgroundColor: theme.colors.success,
  },
  keluarBtn: {
    backgroundColor: theme.colors.primary,
  },
  iconBtn: {
    width: 40,
    height: 38,
    paddingHorizontal: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconMargin: {
    marginRight: 4,
  },
  actionBtnWhiteText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontXs,
    fontWeight: '700',
  },
  emptyContainer: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radii.lg,
    padding: 32,
    alignItems: 'center',
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  emptyIcon: {
    opacity: 0.4,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: theme.typography.fontBase,
    fontWeight: '600',
    color: theme.colors.foreground,
  },
  emptySubtitle: {
    fontSize: theme.typography.fontXs,
    color: theme.colors.mutedForeground,
    textAlign: 'center',
    marginTop: 6,
  },
});