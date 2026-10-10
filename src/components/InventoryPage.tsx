import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  Pressable,
  TextInput,
} from 'react-native';
import { useInventory, InventoryItem } from '@/context/InventoryContext';
import {
  AlertTriangle,
  Trash2,
  Plus,
  Minus,
  Package,
  QrCode,
  Search,
  X,
  CheckCircle2,
} from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { StockDialog } from './StockDialog';
import { ItemQrDialog } from './ItemQrDialog';
import { HeroBanner } from './HeroBanner';
import warehouseImage from '@/assets/bulan-jatuh2.png';
import { toast } from '@/components/ui/Toast';
import { theme } from '@/theme';

type FilterType = 'all' | 'low' | 'safe';

export function InventoryPage() {
  const { items, removeItem } = useInventory();
  const [selectedQrItem, setSelectedQrItem] = useState<InventoryItem | null>(null);
  const [isQrDialogOpen, setIsQrDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');

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
  const safeStockCount = totalItems - lowStockCount;

  // Filter items based on search query and active tab
  const filteredItems = items.filter(item => {
    if (selectedFilter === 'low' && item.quantity > item.minStock) {
      return false;
    }
    if (selectedFilter === 'safe' && item.quantity <= item.minStock) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = item.name.toLowerCase().includes(q);
      const matchCode = (item.code || '').toLowerCase().includes(q);
      const matchCategory = item.category.toLowerCase().includes(q);
      const matchLocation = item.location.toLowerCase().includes(q);
      return matchName || matchCode || matchCategory || matchLocation;
    }
    return true;
  });

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

    // Calculate progress ratio (0 to 100%)
    const stockRatio = item.minStock > 0 ? item.quantity / item.minStock : 1;
    const progressWidth = Math.min(Math.max(Math.round((stockRatio / 2) * 100), 5), 100);

    return (
      <View style={[styles.itemCard, isLowStock && styles.itemCardWarning]}>
        {/* Item Title, SKU, Category & Status Badge */}
        <View style={styles.cardHeader}>
          <View style={styles.titleColumn}>
            <Text style={styles.itemNameText} numberOfLines={1}>
              {item.name}
            </Text>
            <View style={styles.metaRow}>
              {item.code ? (
                <View style={styles.codeTag}>
                  <Text style={styles.codeTagText}>{item.code}</Text>
                </View>
              ) : null}
              <Text style={styles.categoryLocationText}>
                {item.category} • {item.location}
              </Text>
            </View>
          </View>

          {/* Status Badge */}
          {isOutOfStock ? (
            <View style={styles.outOfStockBadge}>
              <Text style={styles.outOfStockBadgeText}>Habis</Text>
            </View>
          ) : isLowStock ? (
            <View style={styles.lowBadge}>
              <AlertTriangle size={11} color={theme.colors.warning} />
              <Text style={styles.lowBadgeText}>Menipis</Text>
            </View>
          ) : (
            <View style={styles.safeBadge}>
              <Text style={styles.safeBadgeText}>Aman</Text>
            </View>
          )}
        </View>

        {/* Stock Metrics Box */}
        <View style={styles.metricsBox}>
          <View style={styles.metricsRow}>
            <View>
              <Text style={styles.metricLabel}>Stok Saat Ini</Text>
              <View style={styles.stockCountRow}>
                <Text
                  style={[
                    styles.metricValue,
                    isLowStock && styles.metricValueWarning,
                    isOutOfStock && styles.metricValueDanger,
                  ]}
                >
                  {item.quantity}
                </Text>
                <Text style={styles.metricUnit}>unit</Text>
              </View>
            </View>
            <View style={styles.metricRight}>
              <Text style={styles.metricLabel}>Batas Minimum</Text>
              <Text style={styles.metricSubValue}>{item.minStock} unit</Text>
            </View>
          </View>

          {/* Mini Health Bar */}
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${progressWidth}%` },
                isOutOfStock
                  ? styles.progressDanger
                  : isLowStock
                  ? styles.progressWarning
                  : styles.progressSuccess,
              ]}
            />
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
            style={[
              styles.actionBtn,
              styles.keluarBtn,
              isOutOfStock && styles.btnDisabled,
            ]}
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
            <QrCode size={15} color={theme.colors.foreground} />
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onPress={() => handleRemoveItem(item.id, item.name)}
            style={[styles.iconBtn, styles.deleteBtn]}
          >
            <Trash2 size={15} color={theme.colors.destructive} />
          </Button>
        </View>
      </View>
    );
  };

  const ListHeader = (
    <View>
      {/* Sleek Compact Header Banner */}
      <HeroBanner
        imageSrc={warehouseImage}
        title="InvyDrop"
        subtitle="Sistem Manajemen Gudang & Logistik"
      />

      {/* Compact Stats Summary Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statsRow}>
          <Pressable
            style={[
              styles.statCard,
              selectedFilter === 'all' && styles.statCardActive,
            ]}
            onPress={() => setSelectedFilter('all')}
          >
            <View style={styles.statHeaderRow}>
              <View style={styles.iconBoxPrimary}>
                <Package size={17} color={theme.colors.primary} />
              </View>
              <View style={styles.statPillPrimary}>
                <Text style={styles.statPillPrimaryText}>Aktif</Text>
              </View>
            </View>
            <Text style={styles.statNumberPrimary}>{totalItems}</Text>
            <Text style={styles.statLabel}>Total Barang</Text>
          </Pressable>

          <Pressable
            style={[
              styles.statCard,
              selectedFilter === 'low' && styles.statCardActiveWarning,
            ]}
            onPress={() => setSelectedFilter(selectedFilter === 'low' ? 'all' : 'low')}
          >
            <View style={styles.statHeaderRow}>
              <View style={styles.iconBoxWarning}>
                <AlertTriangle size={17} color={theme.colors.warning} />
              </View>
              <View
                style={
                  lowStockCount > 0 ? styles.statPillWarning : styles.statPillSuccess
                }
              >
                <Text
                  style={
                    lowStockCount > 0
                      ? styles.statPillWarningText
                      : styles.statPillSuccessText
                  }
                >
                  {lowStockCount > 0 ? 'Restock' : 'Aman'}
                </Text>
              </View>
            </View>
            <Text
              style={
                lowStockCount > 0
                  ? styles.statNumberWarning
                  : styles.statNumberSuccess
              }
            >
              {lowStockCount}
            </Text>
            <Text style={styles.statLabel}>Stok Menipis</Text>
          </Pressable>
        </View>
      </View>

      {/* Compact Search & Filter Section */}
      <View style={styles.filterSection}>
        <View style={styles.searchBar}>
          <Search size={15} color={theme.colors.mutedForeground} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari nama, SKU, atau kategori..."
            placeholderTextColor={theme.colors.mutedForeground}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 ? (
            <Pressable
              onPress={() => setSearchQuery('')}
              hitSlop={8}
              style={styles.clearSearchBtn}
            >
              <X size={14} color={theme.colors.mutedForeground} />
            </Pressable>
          ) : null}
        </View>

        {/* Filter Chips */}
        <View style={styles.filterChipsRow}>
          <Pressable
            style={[
              styles.filterChip,
              selectedFilter === 'all' && styles.filterChipActive,
            ]}
            onPress={() => setSelectedFilter('all')}
          >
            <Text
              style={[
                styles.filterChipText,
                selectedFilter === 'all' && styles.filterChipTextActive,
              ]}
            >
              Semua ({totalItems})
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.filterChip,
              selectedFilter === 'low' && styles.filterChipActiveWarning,
            ]}
            onPress={() => setSelectedFilter('low')}
          >
            <AlertTriangle
              size={11}
              color={
                selectedFilter === 'low'
                  ? theme.colors.warning
                  : theme.colors.mutedForeground
              }
              style={{ marginRight: 4 }}
            />
            <Text
              style={[
                styles.filterChipText,
                selectedFilter === 'low' && styles.filterChipTextWarning,
              ]}
            >
              Menipis ({lowStockCount})
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.filterChip,
              selectedFilter === 'safe' && styles.filterChipActiveSuccess,
            ]}
            onPress={() => setSelectedFilter('safe')}
          >
            <CheckCircle2
              size={11}
              color={
                selectedFilter === 'safe'
                  ? theme.colors.success
                  : theme.colors.mutedForeground
              }
              style={{ marginRight: 4 }}
            />
            <Text
              style={[
                styles.filterChipText,
                selectedFilter === 'safe' && styles.filterChipTextSuccess,
              ]}
            >
              Aman ({safeStockCount})
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Section Title */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Daftar Barang</Text>
        <Text style={styles.sectionSubtitle}>
          {filteredItems.length === totalItems
            ? `${totalItems} barang tercatat di sistem`
            : `Menampilkan ${filteredItems.length} dari ${totalItems} barang`}
        </Text>
      </View>
    </View>
  );

  const ListEmpty = (
    <View style={styles.emptyContainer}>
      <Package size={40} color={theme.colors.mutedForeground} style={styles.emptyIcon} />
      <Text style={styles.emptyTitle}>
        {items.length === 0
          ? 'Belum ada barang di inventaris'
          : 'Barang tidak ditemukan'}
      </Text>
      <Text style={styles.emptySubtitle}>
        {items.length === 0
          ? 'Gunakan tombol Tambah di navbar bawah untuk menambahkan barang baru'
          : 'Coba kata kunci pencarian lain atau ubah filter status di atas'}
      </Text>
      {items.length > 0 && (searchQuery || selectedFilter !== 'all') ? (
        <Button
          variant="outline"
          size="sm"
          onPress={() => {
            setSearchQuery('');
            setSelectedFilter('all');
          }}
          style={styles.resetFilterBtn}
        >
          <Text style={styles.resetFilterBtnText}>Reset Filter</Text>
        </Button>
      ) : null}
    </View>
  );

  return (
    <View style={styles.screen}>
      <FlatList
        data={filteredItems}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListEmpty}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
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
    paddingBottom: 110,
  },
  statsContainer: {
    paddingHorizontal: 16,
    marginTop: 10,
    marginBottom: 10,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radii.lg,
    padding: 11,
    borderWidth: 1,
    borderColor: theme.colors.border,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
  },
  statCardActive: {
    borderColor: theme.colors.primary,
  },
  statCardActiveWarning: {
    borderColor: theme.colors.warning,
  },
  statHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  iconBoxPrimary: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: theme.colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBoxWarning: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: theme.colors.warningSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statPillPrimary: {
    backgroundColor: theme.colors.primarySoft,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  statPillPrimaryText: {
    fontSize: 9,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  statPillWarning: {
    backgroundColor: theme.colors.warningSoft,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  statPillWarningText: {
    fontSize: 9,
    fontWeight: '700',
    color: theme.colors.warning,
  },
  statPillSuccess: {
    backgroundColor: theme.colors.successSoft,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  statPillSuccessText: {
    fontSize: 9,
    fontWeight: '700',
    color: theme.colors.success,
  },
  statNumberPrimary: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  statNumberWarning: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.warning,
  },
  statNumberSuccess: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.success,
  },
  statLabel: {
    fontSize: 11,
    color: theme.colors.mutedForeground,
    marginTop: 1,
    fontWeight: '500',
  },
  filterSection: {
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 10,
    height: 38,
    marginBottom: 8,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    height: 36,
    fontSize: 12,
    color: theme.colors.foreground,
    paddingVertical: 0,
  },
  clearSearchBtn: {
    padding: 3,
  },
  filterChipsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: theme.radii.full,
  },
  filterChipActive: {
    backgroundColor: theme.colors.primarySoft,
    borderColor: theme.colors.primary,
  },
  filterChipActiveWarning: {
    backgroundColor: theme.colors.warningSoft,
    borderColor: theme.colors.warning,
  },
  filterChipActiveSuccess: {
    backgroundColor: theme.colors.successSoft,
    borderColor: theme.colors.success,
  },
  filterChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.mutedForeground,
  },
  filterChipTextActive: {
    color: theme.colors.primary,
  },
  filterChipTextWarning: {
    color: theme.colors.warning,
  },
  filterChipTextSuccess: {
    color: theme.colors.success,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: theme.colors.foreground,
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: theme.colors.mutedForeground,
    marginTop: 1,
  },
  itemCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radii.lg,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
    elevation: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  itemCardWarning: {
    borderColor: 'rgba(212, 162, 76, 0.4)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleColumn: {
    flex: 1,
    marginRight: 8,
  },
  itemNameText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.foreground,
    marginBottom: 3,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  codeTag: {
    backgroundColor: theme.colors.secondary,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  codeTagText: {
    fontFamily: 'monospace',
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  categoryLocationText: {
    fontSize: 11,
    color: theme.colors.mutedForeground,
  },
  lowBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.warningSoft,
    borderWidth: 1,
    borderColor: 'rgba(212, 162, 76, 0.3)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 3,
  },
  lowBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.warning,
  },
  safeBadge: {
    backgroundColor: theme.colors.successSoft,
    borderWidth: 1,
    borderColor: 'rgba(120, 140, 93, 0.3)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  safeBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.success,
  },
  outOfStockBadge: {
    backgroundColor: theme.colors.destructiveSoft,
    borderWidth: 1,
    borderColor: 'rgba(181, 72, 58, 0.3)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  outOfStockBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.destructive,
  },
  metricsBox: {
    backgroundColor: theme.colors.muted,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: theme.radii.md,
    marginBottom: 10,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 6,
  },
  metricLabel: {
    fontSize: 10,
    color: theme.colors.mutedForeground,
    fontWeight: '500',
    marginBottom: 1,
  },
  stockCountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 3,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.foreground,
    lineHeight: 24,
  },
  metricValueWarning: {
    color: theme.colors.warning,
  },
  metricValueDanger: {
    color: theme.colors.destructive,
  },
  metricUnit: {
    fontSize: 10,
    color: theme.colors.mutedForeground,
    fontWeight: '500',
  },
  metricRight: {
    alignItems: 'flex-end',
  },
  metricSubValue: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.mutedForeground,
  },
  progressTrack: {
    height: 3,
    backgroundColor: 'rgba(0, 0, 0, 0.07)',
    borderRadius: 1.5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 1.5,
  },
  progressSuccess: {
    backgroundColor: theme.colors.success,
  },
  progressWarning: {
    backgroundColor: theme.colors.warning,
  },
  progressDanger: {
    backgroundColor: theme.colors.destructive,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  actionBtn: {
    flex: 1,
    height: 34,
    borderRadius: theme.radii.md,
  },
  masukBtn: {
    backgroundColor: theme.colors.success,
  },
  keluarBtn: {
    backgroundColor: theme.colors.primary,
  },
  btnDisabled: {
    opacity: 0.45,
  },
  iconBtn: {
    width: 34,
    height: 34,
    paddingHorizontal: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.radii.md,
  },
  deleteBtn: {
    backgroundColor: theme.colors.destructiveSoft,
  },
  iconMargin: {
    marginRight: 4,
  },
  actionBtnWhiteText: {
    color: theme.colors.white,
    fontSize: 11,
    fontWeight: '700',
  },
  emptyContainer: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radii.lg,
    padding: 24,
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 6,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  emptyIcon: {
    opacity: 0.35,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.foreground,
  },
  emptySubtitle: {
    fontSize: 11,
    color: theme.colors.mutedForeground,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 15,
  },
  resetFilterBtn: {
    marginTop: 12,
    paddingHorizontal: 14,
  },
  resetFilterBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.foreground,
  },
});