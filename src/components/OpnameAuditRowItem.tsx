/**
 * src/components/OpnameAuditRowItem.tsx
 * Komponen kartu baris hasil audit opname untuk satu barang
 */

import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { OpnameEntry, getVariance, getOpnameStatus, formatRupiah } from '@/types/opname';
import { opnameTheme } from '@/theme/opnameTheme';

interface OpnameAuditRowItemProps {
  entry: OpnameEntry;
  onPress?: (e: OpnameEntry) => void;
}

export const OpnameAuditRowItem = memo(function OpnameAuditRowItem({
  entry,
  onPress,
}: OpnameAuditRowItemProps) {
  const variance = getVariance(entry);
  const status = getOpnameStatus(entry);
  const hasImpact = variance !== 0 && entry.unitPrice > 0;
  const impactRupiah = variance * entry.unitPrice;

  // Konfigurasi badge status
  let badgeText = 'MATCH';
  let badgeTextColor: string = opnameTheme.colors.success;
  let badgeBgColor: string = opnameTheme.colors.successBg;

  if (status === 'SURPLUS') {
    badgeText = 'SURPLUS';
    badgeTextColor = opnameTheme.colors.surplus;
    badgeBgColor = opnameTheme.colors.surplusBg;
  } else if (status === 'DEFISIT') {
    badgeText = 'DEFISIT';
    badgeTextColor = opnameTheme.colors.danger;
    badgeBgColor = opnameTheme.colors.dangerBg;
  }

  // Tanda dan warna selisih
  let varianceDisplay = '0';
  let varianceColor: string = opnameTheme.colors.success;

  if (variance > 0) {
    varianceDisplay = `+${variance}`;
    varianceColor = opnameTheme.colors.surplus;
  } else if (variance < 0) {
    varianceDisplay = `${variance}`;
    varianceColor = opnameTheme.colors.danger;
  }

  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.7 : 1}
      onPress={onPress ? () => onPress(entry) : undefined}
      disabled={!onPress}
      accessibilityRole="button"
      accessibilityLabel={`Barang ${entry.name}, kode ${entry.code}, lokasi ${entry.location}, status ${status}, selisih ${varianceDisplay}`}
      style={styles.card}
    >
      {/* Top Row: Nama & Badge Status */}
      <View style={styles.topRow}>
        <Text style={styles.itemName} numberOfLines={1}>
          {entry.name}
        </Text>
        <View style={[styles.badge, { backgroundColor: badgeBgColor }]}>
          <Text style={[styles.badgeText, { color: badgeTextColor }]}>
            {badgeText}
          </Text>
        </View>
      </View>

      {/* Middle Row: Code & Lokasi */}
      <Text style={styles.metaText}>
        {entry.code} • {entry.location}
      </Text>

      {/* Bottom Box: 3 Kolom Komparasi Stok */}
      <View style={styles.bottomBox}>
        <View style={styles.column}>
          <Text style={styles.columnLabel}>Sistem</Text>
          <Text style={styles.columnValue}>{entry.systemQty}</Text>
        </View>

        <View style={styles.columnDivider} />

        <View style={styles.column}>
          <Text style={styles.columnLabel}>Fisik</Text>
          <Text style={styles.columnValue}>{entry.physicalQty}</Text>
        </View>

        <View style={styles.columnDivider} />

        <View style={styles.column}>
          <Text style={styles.columnLabel}>Selisih</Text>
          <Text style={[styles.columnValue, { color: varianceColor }]}>
            {varianceDisplay}
          </Text>
        </View>
      </View>

      {/* Baris Bawah Kecil: Estimasi Dampak Finansial (jika ada selisih) */}
      {hasImpact && (
        <View style={styles.impactRow}>
          <Text style={[styles.impactText, { color: varianceColor }]}>
            Dampak: {formatRupiah(impactRupiah)}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: opnameTheme.colors.card,
    borderWidth: 1,
    borderColor: opnameTheme.colors.stroke,
    borderRadius: opnameTheme.radii.card,
    padding: 14,
    marginBottom: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: opnameTheme.colors.textDark,
    marginRight: 10,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: opnameTheme.radii.badge,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  metaText: {
    fontSize: 12,
    color: opnameTheme.colors.textMuted,
    marginVertical: 4,
  },
  bottomBox: {
    backgroundColor: opnameTheme.colors.background,
    borderRadius: opnameTheme.radii.button,
    paddingVertical: 10,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  column: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  columnDivider: {
    width: 1,
    height: 28,
    backgroundColor: opnameTheme.colors.stroke,
  },
  columnLabel: {
    fontSize: 11,
    color: opnameTheme.colors.textMuted,
    marginBottom: 2,
  },
  columnValue: {
    fontSize: 15,
    fontWeight: '700',
    color: opnameTheme.colors.textDark,
  },
  impactRow: {
    marginTop: 6,
    alignItems: 'flex-end',
  },
  impactText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
