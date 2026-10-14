/**
 * src/components/StockOpnameMassalPage.tsx
 * Halaman sesi aktif Stock Opname Massal
 */

import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ListRenderItemInfo,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  ScanLine,
  SlidersHorizontal,
} from 'lucide-react-native';
import { OpnameEntry, buildSummary, formatRupiah } from '@/types/opname';
import { mockOpnameEntries } from '@/data/mockOpname';
import { OpnameAuditRowItem } from '@/components/OpnameAuditRowItem';
import { OpnameCountSheet } from '@/components/OpnameCountSheet';
import { opnameTheme } from '@/theme/opnameTheme';

interface StockOpnameMassalPageProps {
  onBack?: () => void;
  onScanPress?: () => void;
  onFilterPress?: () => void;
  onFinish?: () => void;
}

export function StockOpnameMassalPage({
  onBack,
  onScanPress,
  onFilterPress,
  onFinish,
}: StockOpnameMassalPageProps) {
  // Data mock sesi aktif (state lokal untuk Fase A)
  const [entries, setEntries] = useState<OpnameEntry[]>(mockOpnameEntries);

  // State untuk Bottom Sheet edit/input hitungan barang
  const [selectedItem, setSelectedItem] = useState<OpnameEntry | null>(null);
  const [isCountSheetVisible, setIsCountSheetVisible] = useState(false);

  // Kalkulasi ringkasan metrik secara reaktif
  const summary = useMemo(() => buildSummary(entries), [entries]);

  // Handler buka edit hitungan ketika item disentuh
  const handleItemPress = useCallback((item: OpnameEntry) => {
    setSelectedItem(item);
    setIsCountSheetVisible(true);
  }, []);

  // Handler simpan hitungan baru dari bottom sheet
  const handleCountSubmit = useCallback((newQty: number) => {
    if (!selectedItem) return;

    // Perbarui entri lokal
    setEntries((prev) =>
      prev.map((e) =>
        e.itemId === selectedItem.itemId ? { ...e, physicalQty: newQty } : e
      )
    );
    setIsCountSheetVisible(false);
    setSelectedItem(null);

    // TODO: Fase B - sinkronkan ke AsyncStorage dan StockOpnameContext
  }, [selectedItem]);

  // Handler tombol pindai
  const handleScanClick = () => {
    if (onScanPress) {
      onScanPress();
    }
    // TODO: Fase B - buka continuous camera scanner
  };

  // Handler tombol filter
  const handleFilterClick = () => {
    if (onFilterPress) {
      onFilterPress();
    }
    // TODO: Fase B - filter berdasarkan lokasi rak / status audit
  };

  // Render item teroptimasi dengan React.memo + useCallback
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<OpnameEntry>) => (
      <OpnameAuditRowItem entry={item} onPress={handleItemPress} />
    ),
    [handleItemPress]
  );

  const keyExtractor = useCallback((item: OpnameEntry) => item.itemId, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        {/* Header Row: Tombol Back, Judul, Badge Sesi Aktif */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Kembali ke halaman sebelumnya"
          >
            <ArrowLeft size={22} color={opnameTheme.colors.textDark} />
          </TouchableOpacity>

          <Text style={styles.pageTitle} numberOfLines={1}>
            Sesi Stock Opname Massal
          </Text>

          <View style={styles.sessionBadge}>
            <Text style={styles.sessionBadgeText}>Sesi Aktif</Text>
          </View>
        </View>

        {/* Summary Card: Metrik Ringkasan Opname */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryColumnsRow}>
            <View style={styles.summaryColumn}>
              <Text style={styles.summaryNumber}>{summary.totalScanned}</Text>
              <Text style={styles.summaryLabel}>Total Dipindai</Text>
            </View>

            <View style={styles.summaryDivider} />

            <View style={styles.summaryColumn}>
              <Text style={[styles.summaryNumber, { color: opnameTheme.colors.success }]}>
                {summary.match}
              </Text>
              <Text style={styles.summaryLabel}>Match</Text>
            </View>

            <View style={styles.summaryDivider} />

            <View style={styles.summaryColumn}>
              <Text style={[styles.summaryNumber, { color: opnameTheme.colors.danger }]}>
                {summary.variance}
              </Text>
              <Text style={styles.summaryLabel}>Variance</Text>
            </View>
          </View>

          {/* Pemisah Tipis & Estimasi Dampak */}
          <View style={styles.summaryImpactDivider} />
          <View style={styles.summaryImpactRow}>
            <Text style={styles.summaryImpactLabel}>Estimasi Dampak</Text>
            <Text
              style={[
                styles.summaryImpactValue,
                {
                  color:
                    summary.impactRupiah >= 0
                      ? opnameTheme.colors.success
                      : opnameTheme.colors.danger,
                },
              ]}
            >
              {formatRupiah(summary.impactRupiah)}
            </Text>
          </View>
        </View>

        {/* Action Bar: Tombol Pindai QR + Tombol Filter */}
        <View style={styles.actionBar}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.scanButton}
            onPress={handleScanClick}
            accessibilityRole="button"
            accessibilityLabel="Pindai Barang dengan QR Code"
          >
            <ScanLine size={20} color={opnameTheme.colors.white} strokeWidth={2.2} />
            <Text style={styles.scanButtonText}>Pindai Barang (QR Code)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.filterButton}
            onPress={handleFilterClick}
            accessibilityRole="button"
            accessibilityLabel="Filter daftar hasil audit"
          >
            <SlidersHorizontal size={20} color={opnameTheme.colors.textDark} />
          </TouchableOpacity>
        </View>

        {/* Section Header */}
        <Text style={styles.sectionHeader}>Daftar Hasil Audit</Text>

        {/* Daftar Barang Hasil Audit */}
        <FlatList
          data={entries}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                Belum ada barang dipindai. Mulai pindai QR di rak.
              </Text>
            </View>
          }
        />

        {/* Sticky Bottom: Tombol Selesaikan & Tinjau Laporan */}
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.finishButton}
          onPress={onFinish}
          accessibilityRole="button"
          accessibilityLabel="Selesaikan dan Tinjau Laporan"
        >
          <Text style={styles.finishButtonText}>
            Selesaikan & Tinjau Laporan
          </Text>
        </TouchableOpacity>
      </View>

      {/* Sheet Input/Koreksi Hitungan Fisik */}
      <OpnameCountSheet
        visible={isCountSheetVisible}
        item={selectedItem}
        initialQty={selectedItem?.physicalQty}
        onClose={() => {
          setIsCountSheetVisible(false);
          setSelectedItem(null);
        }}
        onSubmit={handleCountSubmit}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: opnameTheme.colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: opnameTheme.radii.button,
  },
  pageTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: opnameTheme.colors.textDark,
    marginHorizontal: 8,
  },
  sessionBadge: {
    backgroundColor: opnameTheme.colors.successBg,
    borderRadius: opnameTheme.radii.badge,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  sessionBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: opnameTheme.colors.success,
  },
  summaryCard: {
    backgroundColor: opnameTheme.colors.summaryBg,
    borderRadius: opnameTheme.radii.card,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: opnameTheme.colors.stroke,
  },
  summaryColumnsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryColumn: {
    flex: 1,
    alignItems: 'center',
  },
  summaryNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: opnameTheme.colors.textDark,
    marginBottom: 2,
  },
  summaryLabel: {
    fontSize: 12,
    color: opnameTheme.colors.textMuted,
  },
  summaryDivider: {
    width: 1,
    height: 32,
    backgroundColor: opnameTheme.colors.stroke,
  },
  summaryImpactDivider: {
    height: 1,
    backgroundColor: opnameTheme.colors.stroke,
    marginVertical: 12,
  },
  summaryImpactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryImpactLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: opnameTheme.colors.textMuted,
  },
  summaryImpactValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  scanButton: {
    flex: 1,
    height: 48,
    backgroundColor: opnameTheme.colors.primary,
    borderRadius: opnameTheme.radii.button,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  scanButtonText: {
    color: opnameTheme.colors.white,
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 8,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderWidth: 1,
    borderColor: opnameTheme.colors.stroke,
    borderRadius: opnameTheme.radii.button,
    backgroundColor: opnameTheme.colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: opnameTheme.colors.textDark,
    marginVertical: 12,
  },
  listContent: {
    paddingBottom: 16,
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: opnameTheme.colors.textMuted,
    textAlign: 'center',
  },
  finishButton: {
    backgroundColor: opnameTheme.colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: opnameTheme.radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },
  finishButtonText: {
    color: opnameTheme.colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
