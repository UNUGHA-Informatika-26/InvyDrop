/**
 * src/components/ScanOptionsBottomSheet.tsx
 * Bottom sheet untuk memilih mode pemindaian: Barang Masuk, Keluar, atau Stock Opname Massal
 */

import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowDownLeft,
  ArrowUpRight,
  ClipboardList,
  ChevronRight,
} from 'lucide-react-native';
import { opnameTheme } from '@/theme/opnameTheme';

export type ScanMode = 'INBOUND' | 'OUTBOUND' | 'OPNAME';

interface ScanOptionsBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (mode: ScanMode) => void;
}

export function ScanOptionsBottomSheet({
  visible,
  onClose,
  onSelect,
}: ScanOptionsBottomSheetProps) {
  const insets = useSafeAreaInsets();

  const handleSelect = (mode: ScanMode) => {
    onSelect(mode);
  };

  return (
    <Modal
      transparent
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose} accessibilityRole="button" accessibilityLabel="Tutup dialog">
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.sheet,
                { paddingBottom: Math.max(insets.bottom, 20) },
              ]}
            >
              {/* Handle Bar Pill */}
              <View style={styles.pill} />

              {/* Sheet Title */}
              <Text style={styles.title}>Pilih Mode Pemindaian</Text>

              {/* Option 1: Scan Barang Masuk */}
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.card}
                onPress={() => handleSelect('INBOUND')}
                accessibilityRole="button"
                accessibilityLabel="Scan Barang Masuk, Penambahan stok reguler"
              >
                <View style={[styles.iconBox, styles.inboundIconBg]}>
                  <ArrowDownLeft
                    size={22}
                    color={opnameTheme.colors.success}
                    strokeWidth={2.2}
                  />
                </View>
                <View style={styles.cardTextContainer}>
                  <Text style={styles.cardTitle}>Scan Barang Masuk</Text>
                  <Text style={styles.cardSubtitle}>Penambahan stok reguler</Text>
                </View>
                <ChevronRight size={20} color={opnameTheme.colors.textMuted} />
              </TouchableOpacity>

              {/* Option 2: Scan Barang Keluar */}
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.card}
                onPress={() => handleSelect('OUTBOUND')}
                accessibilityRole="button"
                accessibilityLabel="Scan Barang Keluar, Pengurangan stok reguler"
              >
                <View style={[styles.iconBox, styles.outboundIconBg]}>
                  <ArrowUpRight
                    size={22}
                    color={opnameTheme.colors.danger}
                    strokeWidth={2.2}
                  />
                </View>
                <View style={styles.cardTextContainer}>
                  <Text style={styles.cardTitle}>Scan Barang Keluar</Text>
                  <Text style={styles.cardSubtitle}>Pengurangan stok reguler</Text>
                </View>
                <ChevronRight size={20} color={opnameTheme.colors.textMuted} />
              </TouchableOpacity>

              {/* Option 3: Sesi Stock Opname Massal */}
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.card}
                onPress={() => handleSelect('OPNAME')}
                accessibilityRole="button"
                accessibilityLabel="Sesi Stock Opname Massal, Audit dan rekonsiliasi stok fisik seluruh gudang"
              >
                <View style={[styles.iconBox, styles.opnameIconBg]}>
                  <ClipboardList
                    size={22}
                    color={opnameTheme.colors.primary}
                    strokeWidth={2.2}
                  />
                </View>
                <View style={styles.cardTextContainer}>
                  <Text style={styles.cardTitle}>Sesi Stock Opname Massal</Text>
                  <Text style={styles.cardSubtitle}>
                    Audit & rekonsiliasi stok fisik seluruh gudang
                  </Text>
                </View>
                <ChevronRight size={20} color={opnameTheme.colors.textMuted} />
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: opnameTheme.colors.backdrop,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: opnameTheme.colors.card,
    borderTopLeftRadius: opnameTheme.radii.sheet,
    borderTopRightRadius: opnameTheme.radii.sheet,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  pill: {
    width: 40,
    height: 4,
    backgroundColor: opnameTheme.colors.stroke,
    alignSelf: 'center',
    marginBottom: 16,
    borderRadius: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: opnameTheme.colors.textDark,
    textAlign: 'center',
    marginBottom: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: opnameTheme.colors.card,
    borderRadius: opnameTheme.radii.card,
    borderWidth: 1,
    borderColor: opnameTheme.colors.stroke,
    padding: 14,
    marginBottom: 12,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: opnameTheme.radii.button,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inboundIconBg: {
    backgroundColor: 'rgba(118, 142, 101, 0.12)',
  },
  outboundIconBg: {
    backgroundColor: 'rgba(217, 83, 79, 0.12)',
  },
  opnameIconBg: {
    backgroundColor: 'rgba(224, 106, 59, 0.12)',
  },
  cardTextContainer: {
    flex: 1,
    marginLeft: 14,
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: opnameTheme.colors.textDark,
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 12,
    color: opnameTheme.colors.textMuted,
  },
});
