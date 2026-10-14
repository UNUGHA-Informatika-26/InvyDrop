/**
 * src/components/OpnameCountSheet.tsx
 * Bottom sheet untuk input jumlah fisik hasil pemindaian QR saat sesi opname
 */

import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Plus, Minus } from 'lucide-react-native';
import { opnameTheme } from '@/theme/opnameTheme';

interface OpnameCountSheetItem {
  code: string;
  name: string;
  location: string;
  systemQty: number;
}

interface OpnameCountSheetProps {
  visible: boolean;
  item: OpnameCountSheetItem | null;
  initialQty?: number;
  onClose: () => void;
  onSubmit: (physicalQty: number) => void;
}

export function OpnameCountSheet({
  visible,
  item,
  initialQty,
  onClose,
  onSubmit,
}: OpnameCountSheetProps) {
  const insets = useSafeAreaInsets();
  const [qtyText, setQtyText] = useState<string>('');

  // Sinkronisasi state saat modal dibuka atau item berganti
  useEffect(() => {
    if (visible && item) {
      const defaultQty = initialQty !== undefined ? initialQty : item.systemQty;
      setQtyText(defaultQty.toString());
    } else {
      setQtyText('');
    }
  }, [visible, item, initialQty]);

  if (!item) {
    return null;
  }

  const numericQty = parseInt(qtyText, 10);
  const isValid = !isNaN(numericQty) && numericQty >= 0 && qtyText.trim() !== '';

  const handleDecrement = () => {
    const current = isNaN(numericQty) ? 0 : numericQty;
    const nextVal = Math.max(0, current - 1);
    setQtyText(nextVal.toString());
  };

  const handleIncrement = () => {
    const current = isNaN(numericQty) ? 0 : numericQty;
    setQtyText((current + 1).toString());
  };

  const handleTextChange = (text: string) => {
    // Hanya menerima karakter angka (bilangan bulat positif atau nol)
    const cleaned = text.replace(/[^0-9]/g, '');
    setQtyText(cleaned);
  };

  const handleSubmit = () => {
    if (isValid) {
      onSubmit(numericQty);
    }
  };

  // Preview selisih live
  const diff = isValid ? numericQty - item.systemQty : 0;
  let diffText = 'Selisih: Sesuai (0)';
  let diffColor: string = opnameTheme.colors.success;

  if (isValid) {
    if (diff > 0) {
      diffText = `Selisih: +${diff}`;
      diffColor = opnameTheme.colors.surplus;
    } else if (diff < 0) {
      diffText = `Selisih: ${diff}`;
      diffColor = opnameTheme.colors.danger;
    }
  }

  return (
    <Modal
      transparent
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose} accessibilityRole="button" accessibilityLabel="Tutup dialog">
        <View style={styles.backdrop}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.keyboardContainer}
          >
            <TouchableWithoutFeedback>
              <View
                style={[
                  styles.sheet,
                  { paddingBottom: Math.max(insets.bottom, 20) },
                ]}
              >
                {/* Pill Handle Bar */}
                <View style={styles.pill} />

                {/* Detail Barang */}
                <Text style={styles.itemName} numberOfLines={2}>
                  {item.name}
                </Text>
                <Text style={styles.itemMeta}>
                  {item.code} • {item.location}
                </Text>

                {/* Kartu Stok Sistem */}
                <View style={styles.systemQtyCard}>
                  <Text style={styles.systemQtyLabel}>Stok di Sistem</Text>
                  <Text style={styles.systemQtyNumber}>{item.systemQty}</Text>
                </View>

                {/* Stepper Jumlah Fisik */}
                <View style={styles.stepperSection}>
                  <Text style={styles.stepperLabel}>Jumlah Fisik Terhitung</Text>

                  <View style={styles.stepperContainer}>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={[
                        styles.stepperButton,
                        (!isValid || numericQty <= 0) && styles.stepperButtonDisabled,
                      ]}
                      onPress={handleDecrement}
                      disabled={!isValid || numericQty <= 0}
                      accessibilityRole="button"
                      accessibilityLabel="Kurangi jumlah fisik"
                    >
                      <Minus size={22} color={opnameTheme.colors.textDark} strokeWidth={2.5} />
                    </TouchableOpacity>

                    <TextInput
                      style={styles.stepperInput}
                      keyboardType="number-pad"
                      value={qtyText}
                      onChangeText={handleTextChange}
                      placeholder="0"
                      placeholderTextColor={opnameTheme.colors.textMuted}
                      textAlign="center"
                      accessibilityLabel="Input jumlah fisik"
                    />

                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={styles.stepperButton}
                      onPress={handleIncrement}
                      accessibilityRole="button"
                      accessibilityLabel="Tambah jumlah fisik"
                    >
                      <Plus size={22} color={opnameTheme.colors.textDark} strokeWidth={2.5} />
                    </TouchableOpacity>
                  </View>

                  {/* Pratinjau Selisih Live */}
                  <View style={styles.previewContainer}>
                    <Text style={[styles.previewText, { color: diffColor }]}>
                      {isValid ? diffText : 'Masukkan angka valid'}
                    </Text>
                  </View>
                </View>

                {/* Tombol Simpan Hitungan */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[
                    styles.submitButton,
                    !isValid && styles.submitButtonDisabled,
                  ]}
                  onPress={handleSubmit}
                  disabled={!isValid}
                  accessibilityRole="button"
                  accessibilityLabel="Simpan Hitungan"
                >
                  <Text style={styles.submitButtonText}>Simpan Hitungan</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
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
  keyboardContainer: {
    width: '100%',
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
  itemName: {
    fontSize: 18,
    fontWeight: '700',
    color: opnameTheme.colors.textDark,
    textAlign: 'center',
  },
  itemMeta: {
    fontSize: 13,
    color: opnameTheme.colors.textMuted,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  systemQtyCard: {
    backgroundColor: opnameTheme.colors.summaryBg,
    borderRadius: opnameTheme.radii.card,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: opnameTheme.colors.stroke,
  },
  systemQtyLabel: {
    fontSize: 12,
    color: opnameTheme.colors.textMuted,
    marginBottom: 2,
  },
  systemQtyNumber: {
    fontSize: 26,
    fontWeight: '700',
    color: opnameTheme.colors.textDark,
  },
  stepperSection: {
    marginBottom: 20,
  },
  stepperLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: opnameTheme.colors.textDark,
    textAlign: 'center',
    marginBottom: 12,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperButton: {
    width: 48,
    height: 48,
    borderRadius: opnameTheme.radii.button,
    backgroundColor: opnameTheme.colors.background,
    borderWidth: 1,
    borderColor: opnameTheme.colors.stroke,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperButtonDisabled: {
    opacity: 0.4,
  },
  stepperInput: {
    width: 120,
    height: 48,
    borderWidth: 1,
    borderColor: opnameTheme.colors.stroke,
    borderRadius: opnameTheme.radii.button,
    backgroundColor: opnameTheme.colors.card,
    fontSize: 22,
    fontWeight: '700',
    color: opnameTheme.colors.textDark,
    marginHorizontal: 12,
    paddingHorizontal: 8,
  },
  previewContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  previewText: {
    fontSize: 13,
    fontWeight: '700',
  },
  submitButton: {
    backgroundColor: opnameTheme.colors.primary,
    borderRadius: opnameTheme.radii.button,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  submitButtonDisabled: {
    opacity: 0.45,
  },
  submitButtonText: {
    color: opnameTheme.colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
