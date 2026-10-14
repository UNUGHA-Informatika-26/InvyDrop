/**
 * src/components/OpnameReportPage.tsx
 * Halaman ringkasan laporan hasil Stock Opname Massal sebelum rekonsiliasi
 */

import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet,
  ListRenderItemInfo,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import {
  OpnameEntry,
  OpnameStatus,
  buildSummary,
  formatRupiah,
  getVariance,
  getOpnameStatus,
} from '@/types/opname';
import { mockOpnameEntries } from '@/data/mockOpname';
import { OpnameAuditRowItem } from '@/components/OpnameAuditRowItem';
import { opnameTheme } from '@/theme/opnameTheme';

type FilterType = 'ALL' | OpnameStatus;

interface OpnameReportPageProps {
  onBack?: () => void;
  onConfirm?: () => void;
}

export function OpnameReportPage({ onBack, onConfirm }: OpnameReportPageProps) {
  // State data dan filter
  const [entries] = useState<OpnameEntry[]>(mockOpnameEntries);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('ALL');

  // Ringkasan global
  const summary = useMemo(() => buildSummary(entries), [entries]);

  // Filter dan pengurutan (selisih terbesar didahulukan)
  const filteredAndSortedEntries = useMemo(() => {
    let result = entries;

    if (selectedFilter !== 'ALL') {
      result = result.filter((e) => getOpnameStatus(e) === selectedFilter);
    }

    return [...result].sort((a, b) => {
      const varA = Math.abs(getVariance(a));
      const varB = Math.abs(getVariance(b));
      return varB - varA;
    });
  }, [entries, selectedFilter]);

  // Handler tombol "Simpan & Rekonsiliasi"
  const handleReconcile = () => {
    Alert.alert(
      'Konfirmasi Rekonsiliasi',
      'Stok sistem akan disesuaikan dengan hasil hitungan fisik saat ini. Tindakan ini akan mencatat riwayat transaksi opname. Lanjutkan?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Ya, Rekonsiliasi',
          style: 'default',
          onPress: () => {
            // TODO: Fase B - Eksekusi pembaruan stok dan catat riwayat transaksi opname
            if (onConfirm) {
              onConfirm();
            }
          },
        },
      ]
    );
  };

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<OpnameEntry>) => (
      <OpnameAuditRowItem entry={item} />
    ),
    []
  );

  const keyExtractor = useCallback((item: OpnameEntry) => item.itemId, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        {/* Header Row */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Kembali ke sesi opname"
          >
            <ArrowLeft size={22} color={opnameTheme.colors.textDark} />
          </TouchableOpacity>

          <Text style={styles.pageTitle} numberOfLines={1}>
            Ringkasan Laporan Opname
          </Text>
        </View>

        {/* 4 Kartu Ringkasan (Grid 2x2) */}
        <View style={styles.gridContainer}>
          {/* Baris 1: Match & Surplus */}
          <View style={styles.gridRow}>
            {/* Kartu Match */}
            <View style={styles.summaryCardItem}>
              <Text style={styles.cardItemLabel}>Match</Text>
              <Text style={[styles.cardItemValue, { color: opnameTheme.colors.success }]}>
                {summary.match}
              </Text>
              <Text style={styles.cardItemSub}>Stok Sesuai</Text>
            </View>

            {/* Kartu Surplus */}
            <View style={styles.summaryCardItem}>
              <Text style={styles.cardItemLabel}>Surplus</Text>
              <Text style={[styles.cardItemValue, { color: opnameTheme.colors.surplus }]}>
                +{summary.surplus}
              </Text>
              <Text style={styles.cardItemSub}>Fisik Lebih Banyak</Text>
            </View>
          </View>

          {/* Baris 2: Defisit & Total Dampak */}
          <View style={styles.gridRow}>
            {/* Kartu Defisit */}
            <View style={styles.summaryCardItem}>
              <Text style={styles.cardItemLabel}>Defisit</Text>
              <Text style={[styles.cardItemValue, { color: opnameTheme.colors.danger }]}>
                -{summary.defisit}
              </Text>
              <Text style={styles.cardItemSub}>Fisik Kurang</Text>
            </View>

            {/* Kartu Total Dampak */}
            <View style={styles.summaryCardItem}>
              <Text style={styles.cardItemLabel}>
                {summary.impactRupiah >= 0 ? 'Keuntungan' : 'Kerugian'}
              </Text>
              <Text
                style={[
                  styles.cardItemValueImpact,
                  {
                    color:
                      summary.impactRupiah >= 0
                        ? opnameTheme.colors.success
                        : opnameTheme.colors.danger,
                  },
                ]}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {formatRupiah(summary.impactRupiah)}
              </Text>
              <Text style={styles.cardItemSub}>Total Dampak Nilai</Text>
            </View>
          </View>
        </View>

        {/* Segment Filter Chip: Semua | Match | Surplus | Defisit */}
        <View style={styles.filterChipContainer}>
          <TouchableOpacity
            style={[
              styles.filterChip,
              selectedFilter === 'ALL' && styles.filterChipActive,
            ]}
            onPress={() => setSelectedFilter('ALL')}
            accessibilityRole="button"
            accessibilityLabel="Filter Semua Item"
          >
            <Text
              style={[
                styles.filterChipText,
                selectedFilter === 'ALL' && styles.filterChipTextActive,
              ]}
            >
              Semua ({entries.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterChip,
              selectedFilter === 'MATCH' && styles.filterChipActive,
            ]}
            onPress={() => setSelectedFilter('MATCH')}
            accessibilityRole="button"
            accessibilityLabel="Filter Item Match"
          >
            <Text
              style={[
                styles.filterChipText,
                selectedFilter === 'MATCH' && styles.filterChipTextActive,
              ]}
            >
              Match ({summary.match})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterChip,
              selectedFilter === 'SURPLUS' && styles.filterChipActive,
            ]}
            onPress={() => setSelectedFilter('SURPLUS')}
            accessibilityRole="button"
            accessibilityLabel="Filter Item Surplus"
          >
            <Text
              style={[
                styles.filterChipText,
                selectedFilter === 'SURPLUS' && styles.filterChipTextActive,
              ]}
            >
              Surplus ({summary.surplus})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterChip,
              selectedFilter === 'DEFISIT' && styles.filterChipActive,
            ]}
            onPress={() => setSelectedFilter('DEFISIT')}
            accessibilityRole="button"
            accessibilityLabel="Filter Item Defisit"
          >
            <Text
              style={[
                styles.filterChipText,
                selectedFilter === 'DEFISIT' && styles.filterChipTextActive,
              ]}
            >
              Defisit ({summary.defisit})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Daftar Hasil Audit Terfilter & Terurut */}
        <FlatList
          data={filteredAndSortedEntries}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                Tidak ada barang dengan filter ini.
              </Text>
            </View>
          }
        />

        {/* Sticky Bawah: Tombol Simpan & Rekonsiliasi */}
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.reconcileButton}
          onPress={handleReconcile}
          accessibilityRole="button"
          accessibilityLabel="Simpan dan Rekonsiliasi Stok"
        >
          <Text style={styles.reconcileButtonText}>Simpan & Rekonsiliasi</Text>
        </TouchableOpacity>
      </View>
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
  gridContainer: {
    marginBottom: 14,
  },
  gridRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  summaryCardItem: {
    flex: 1,
    backgroundColor: opnameTheme.colors.card,
    borderRadius: opnameTheme.radii.card,
    padding: 14,
    borderWidth: 1,
    borderColor: opnameTheme.colors.stroke,
    marginHorizontal: 4,
    justifyContent: 'center',
  },
  cardItemLabel: {
    fontSize: 12,
    color: opnameTheme.colors.textMuted,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardItemValue: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 2,
  },
  cardItemValueImpact: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 2,
  },
  cardItemSub: {
    fontSize: 11,
    color: opnameTheme.colors.textMuted,
  },
  filterChipContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    justifyContent: 'space-between',
  },
  filterChip: {
    backgroundColor: opnameTheme.colors.card,
    borderWidth: 1,
    borderColor: opnameTheme.colors.stroke,
    borderRadius: opnameTheme.radii.pill,
    paddingVertical: 7,
    paddingHorizontal: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterChipActive: {
    backgroundColor: opnameTheme.colors.primary,
    borderColor: opnameTheme.colors.primary,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: opnameTheme.colors.textMuted,
  },
  filterChipTextActive: {
    color: opnameTheme.colors.white,
    fontWeight: '700',
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
  reconcileButton: {
    backgroundColor: opnameTheme.colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: opnameTheme.radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },
  reconcileButtonText: {
    color: opnameTheme.colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
