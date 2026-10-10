import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  MoreVertical,
  Copy,
  MapPin,
  Calendar,
  RefreshCw,
  ArrowDownCircle,
  ArrowUpCircle,
  AlertTriangle,
  Trash2,
  Package,
  QrCode,
} from 'lucide-react-native';
import { useInventory, InventoryItem } from '@/context/InventoryContext';
import { useStockHistory, StockTransaction } from '@/context/StockHistoryContext';
import { StockDialog } from './StockDialog';
import { ItemQrDialog } from './ItemQrDialog';
import { toast } from '@/components/ui/Toast';
import { theme } from '@/theme';

interface ItemDetailPageProps {
  itemId: string;
}

// ─────────────────── helpers ───────────────────
function formatDate(iso: string): string {
  const d = new Date(iso);
  const day = String(d.getDate()).padStart(2, '0');
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
    'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des',
  ];
  const month = monthNames[d.getMonth()];
  const year = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${day} ${month} ${year}, ${hh}.${mm}`;
}

function formatDateShort(iso: string): string {
  const d = new Date(iso);
  const day = String(d.getDate()).padStart(2, '0');
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
    'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des',
  ];
  const month = monthNames[d.getMonth()];
  const year = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${day} ${month} ${year} • ${hh}.${mm}`;
}

// ─────────────────── TransactionRow ───────────────────
function TransactionRow({ tx }: { tx: StockTransaction }) {
  const isMasuk = tx.type === 'masuk' || tx.type === 'awal';
  return (
    <View style={txStyles.row}>
      <View style={[txStyles.iconBox, isMasuk ? txStyles.iconBoxGreen : txStyles.iconBoxRed]}>
        {isMasuk ? (
          <ArrowDownCircle size={18} color={theme.colors.success} strokeWidth={2} />
        ) : (
          <ArrowUpCircle size={18} color={theme.colors.primary} strokeWidth={2} />
        )}
      </View>
      <View style={txStyles.textCol}>
        <Text style={txStyles.txLabel}>
          {tx.type === 'awal'
            ? 'Stok Awal'
            : tx.type === 'masuk'
            ? 'Barang Masuk'
            : 'Barang Keluar'}
        </Text>
        <Text style={txStyles.txDate}>{formatDateShort(tx.createdAt)}</Text>
        {tx.note ? <Text style={txStyles.txNote}>{tx.note}</Text> : null}
      </View>
      <Text style={[txStyles.txQty, isMasuk ? txStyles.txQtyGreen : txStyles.txQtyRed]}>
        {isMasuk ? `+${tx.quantity}` : `−${tx.quantity}`} unit
      </Text>
    </View>
  );
}

const txStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconBoxGreen: {
    backgroundColor: theme.colors.successSoft,
  },
  iconBoxRed: {
    backgroundColor: theme.colors.primarySoft,
  },
  textCol: {
    flex: 1,
  },
  txLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.foreground,
  },
  txDate: {
    fontSize: 11,
    color: theme.colors.mutedForeground,
    marginTop: 1,
  },
  txNote: {
    fontSize: 11,
    color: theme.colors.mutedForeground,
    fontStyle: 'italic',
    marginTop: 1,
  },
  txQty: {
    fontSize: 13,
    fontWeight: '700',
  },
  txQtyGreen: {
    color: theme.colors.success,
  },
  txQtyRed: {
    color: theme.colors.primary,
  },
});

// ─────────────────── Main Component ───────────────────
export function ItemDetailPage({ itemId }: ItemDetailPageProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { items, removeItem } = useInventory();
  const { getItemTransactions } = useStockHistory();

  const [stockDialog, setStockDialog] = useState<{
    open: boolean;
    mode: 'add' | 'remove';
  }>({ open: false, mode: 'add' });
  const [isQrOpen, setIsQrOpen] = useState(false);

  const item = items.find(i => i.id === itemId) ?? null;
  const transactions = item ? getItemTransactions(item.id) : [];

  const openStockDialog = useCallback((mode: 'add' | 'remove') => {
    setStockDialog({ open: true, mode });
  }, []);

  const handleDelete = useCallback(() => {
    if (!item) return;
    Alert.alert(
      'Hapus Barang',
      `Hapus "${item.name}" dari inventaris? Tindakan ini tidak dapat dibatalkan.`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: () => {
            removeItem(item.id);
            toast.success(`${item.name} telah dihapus`);
            router.back();
          },
        },
      ]
    );
  }, [item, removeItem, router]);

  const handleCopyCode = useCallback(() => {
    if (!item?.code) return;
    // No Clipboard API needed — just show toast
    toast.success(`Kode ${item.code} disalin`);
  }, [item]);

  if (!item) {
    return (
      <View style={[styles.screen, styles.notFoundCenter, { paddingTop: insets.top }]}>
        <Package size={48} color={theme.colors.mutedForeground} />
        <Text style={styles.notFoundTitle}>Barang tidak ditemukan</Text>
        <Text style={styles.notFoundSub}>Barang mungkin telah dihapus dari inventaris</Text>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Kembali</Text>
        </Pressable>
      </View>
    );
  }

  const isLowStock = item.quantity <= item.minStock;
  const isOutOfStock = item.quantity === 0;
  const stockAboveMin = item.quantity - item.minStock;
  const progressRatio = item.minStock > 0
    ? Math.min(item.quantity / (item.minStock * 2), 1)
    : 1;

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      {/* ── Top Bar ── */}
      <View style={styles.topBar}>
        <Pressable
          style={styles.topIconBtn}
          onPress={() => router.back()}
          hitSlop={10}
        >
          <ChevronLeft size={24} color={theme.colors.foreground} strokeWidth={2.5} />
        </Pressable>
        <Text style={styles.topTitle}>Detail Barang</Text>
        <View style={styles.topRightGroup}>
          <Pressable
            style={styles.topIconBtn}
            onPress={() => setIsQrOpen(true)}
            hitSlop={10}
          >
            <QrCode size={20} color={theme.colors.foreground} />
          </Pressable>
          <Pressable
            style={styles.topIconBtn}
            onPress={handleDelete}
            hitSlop={10}
          >
            <Trash2 size={20} color={theme.colors.destructive} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Identity Card ── */}
        <View style={styles.card}>
          {/* Name & SKU Row */}
          <View style={styles.nameRow}>
            <View style={styles.nameCol}>
              <Text style={styles.itemName}>{item.name}</Text>
              {item.code ? (
                <Pressable style={styles.codeRow} onPress={handleCopyCode} hitSlop={6}>
                  <View style={styles.codeTag}>
                    <Text style={styles.codeText}>{item.code}</Text>
                  </View>
                  <Copy size={13} color={theme.colors.mutedForeground} style={{ marginLeft: 5 }} />
                </Pressable>
              ) : null}
            </View>
          </View>

          {/* Stock count & status */}
          <View style={styles.stockRow}>
            <View>
              <Text style={styles.stockNumber}>
                <Text
                  style={[
                    styles.stockBigNum,
                    isOutOfStock
                      ? styles.stockDanger
                      : isLowStock
                      ? styles.stockWarning
                      : styles.stockSafe,
                  ]}
                >
                  {item.quantity}
                </Text>
                <Text style={styles.stockUnit}> unit</Text>
              </Text>
              <Text style={styles.stockAvailLabel}>Stok tersedia</Text>
            </View>

            {isOutOfStock ? (
              <View style={styles.badgeDanger}><Text style={styles.badgeDangerText}>Habis</Text></View>
            ) : isLowStock ? (
              <View style={styles.badgeWarning}>
                <AlertTriangle size={12} color={theme.colors.warning} />
                <Text style={styles.badgeWarningText}>Menipis</Text>
              </View>
            ) : (
              <View style={styles.badgeSafe}><Text style={styles.badgeSafeText}>Aman</Text></View>
            )}
          </View>

          {/* Progress bar */}
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${Math.max(Math.round(progressRatio * 100), 4)}%` },
                isOutOfStock
                  ? styles.progressDanger
                  : isLowStock
                  ? styles.progressWarning
                  : styles.progressSafe,
              ]}
            />
          </View>
          <View style={styles.progressLabelRow}>
            <Text style={styles.progressMin}>Minimum: {item.minStock}</Text>
            <Text style={styles.progressAbove}>
              {isOutOfStock
                ? 'Stok habis'
                : isLowStock
                ? `${Math.abs(stockAboveMin)} unit di bawah minimum`
                : `${stockAboveMin} unit di atas minimum`}
            </Text>
          </View>

          {/* Meta info */}
          <View style={styles.metaDivider} />
          <View style={styles.metaRow}>
            <MapPin size={14} color={theme.colors.mutedForeground} style={styles.metaIcon} />
            <Text style={styles.metaLabel}>Lokasi</Text>
            <Text style={styles.metaValue}>{item.location}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel2}>Kategori</Text>
            <Text style={styles.metaValue}>{item.category}</Text>
          </View>
          <View style={styles.metaRow}>
            <Calendar size={14} color={theme.colors.mutedForeground} style={styles.metaIcon} />
            <Text style={styles.metaLabel}>Dibuat</Text>
            <Text style={styles.metaValue}>{formatDate(item.createdAt)}</Text>
          </View>
        </View>

        {/* ── Action Buttons ── */}
        <View style={styles.actionsRow}>
          <Pressable
            style={({ pressed }) => [styles.actionCard, pressed && styles.actionCardPressed]}
            onPress={() => openStockDialog('add')}
          >
            <View style={styles.actionIconWrapGreen}>
              <ArrowDownCircle size={22} color={theme.colors.success} strokeWidth={2} />
            </View>
            <Text style={styles.actionMasukLabel}>Barang Masuk</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.actionCard,
              styles.actionCardOutline,
              pressed && styles.actionCardPressed,
              isOutOfStock && styles.actionCardDisabled,
            ]}
            onPress={() => !isOutOfStock && openStockDialog('remove')}
            disabled={isOutOfStock}
          >
            <View style={styles.actionIconWrapOrange}>
              <ArrowUpCircle size={22} color={isOutOfStock ? theme.colors.mutedForeground : theme.colors.primary} strokeWidth={2} />
            </View>
            <Text style={[styles.actionKeluarLabel, isOutOfStock && styles.actionLabelDisabled]}>
              Barang Keluar
            </Text>
          </Pressable>
        </View>

        {/* ── Transaction History ── */}
        <View style={styles.sectionHeader}>
          <RefreshCw size={16} color={theme.colors.foreground} style={{ marginRight: 8 }} />
          <Text style={styles.sectionTitle}>Riwayat Terakhir</Text>
        </View>

        <View style={styles.card}>
          {transactions.length === 0 ? (
            <View style={styles.emptyHistory}>
              <Text style={styles.emptyHistoryText}>
                Belum ada riwayat transaksi untuk barang ini
              </Text>
            </View>
          ) : (
            transactions.slice(0, 15).map((tx, idx) => (
              <View key={tx.id} style={idx === transactions.slice(0, 15).length - 1 ? styles.txLastRow : undefined}>
                <TransactionRow tx={tx} />
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Stock dialog */}
      <StockDialog
        open={stockDialog.open}
        onOpenChange={open => setStockDialog(prev => ({ ...prev, open }))}
        itemId={item.id}
        itemName={item.name}
        currentStock={item.quantity}
        mode={stockDialog.mode}
      />

      {/* QR dialog */}
      <ItemQrDialog
        open={isQrOpen}
        onOpenChange={setIsQrOpen}
        item={item}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  notFoundCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 32,
  },
  notFoundTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.foreground,
    marginTop: 12,
  },
  notFoundSub: {
    fontSize: 13,
    color: theme.colors.mutedForeground,
    textAlign: 'center',
  },
  backBtn: {
    marginTop: 16,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: theme.radii.md,
  },
  backBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },

  // ── Top Bar ──
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  topIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.foreground,
    letterSpacing: -0.2,
  },
  topRightGroup: {
    flexDirection: 'row',
    gap: 4,
  },

  // ── Scroll ──
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 12,
  },

  // ── Card ──
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radii.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    padding: 16,
  },

  // ── Name / SKU ──
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  nameCol: {
    flex: 1,
  },
  itemName: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.foreground,
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  codeTag: {
    backgroundColor: theme.colors.secondary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  codeText: {
    fontFamily: 'monospace',
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.primary,
  },

  // ── Stock row ──
  stockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  stockNumber: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  stockBigNum: {
    fontSize: 36,
    fontWeight: '800',
    lineHeight: 40,
  },
  stockUnit: {
    fontSize: 16,
    color: theme.colors.mutedForeground,
    fontWeight: '500',
  },
  stockSafe: {
    color: theme.colors.foreground,
  },
  stockWarning: {
    color: theme.colors.warning,
  },
  stockDanger: {
    color: theme.colors.destructive,
  },
  stockAvailLabel: {
    fontSize: 11,
    color: theme.colors.mutedForeground,
    marginTop: 1,
  },

  // Badges
  badgeSafe: {
    backgroundColor: theme.colors.successSoft,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(120, 140, 93, 0.3)',
  },
  badgeSafeText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.success,
  },
  badgeWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.warningSoft,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(212, 162, 76, 0.3)',
  },
  badgeWarningText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.warning,
  },
  badgeDanger: {
    backgroundColor: theme.colors.destructiveSoft,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(181, 72, 58, 0.3)',
  },
  badgeDangerText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.destructive,
  },

  // Progress
  progressTrack: {
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.07)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressSafe: { backgroundColor: theme.colors.success },
  progressWarning: { backgroundColor: theme.colors.warning },
  progressDanger: { backgroundColor: theme.colors.destructive },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  progressMin: {
    fontSize: 11,
    color: theme.colors.mutedForeground,
  },
  progressAbove: {
    fontSize: 11,
    color: theme.colors.mutedForeground,
  },

  // Meta
  metaDivider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginBottom: 14,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  metaIcon: {
    marginRight: 6,
  },
  metaLabel: {
    fontSize: 13,
    color: theme.colors.mutedForeground,
    flex: 1,
  },
  metaLabel2: {
    fontSize: 13,
    color: theme.colors.mutedForeground,
    flex: 1,
    marginLeft: 20,
  },
  metaValue: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.foreground,
    textAlign: 'right',
    flex: 1,
  },

  // Actions
  actionsRow: {
    gap: 10,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radii.lg,
    paddingVertical: 14,
    paddingHorizontal: 18,
    gap: 12,
    elevation: 2,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  actionCardOutline: {
    backgroundColor: theme.colors.card,
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
    elevation: 0,
    shadowOpacity: 0,
  },
  actionCardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  actionCardDisabled: {
    opacity: 0.45,
    borderColor: theme.colors.border,
  },
  actionIconWrapGreen: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIconWrapOrange: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: theme.colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionMasukLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
    flex: 1,
  },
  actionKeluarLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.primary,
    flex: 1,
  },
  actionLabelDisabled: {
    color: theme.colors.mutedForeground,
  },

  // Section header
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: theme.colors.foreground,
    letterSpacing: -0.3,
  },
  txLastRow: {
    borderBottomWidth: 0,
  },

  // Empty history
  emptyHistory: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  emptyHistoryText: {
    fontSize: 13,
    color: theme.colors.mutedForeground,
    textAlign: 'center',
  },
});
