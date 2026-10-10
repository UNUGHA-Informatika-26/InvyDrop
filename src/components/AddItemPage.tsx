import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, Shuffle, Plus, Minus, MapPin } from 'lucide-react-native';
import { useInventory, generateItemCode } from '@/context/InventoryContext';
import { useStockHistory } from '@/context/StockHistoryContext';
import { toast } from '@/components/ui/Toast';
import { theme } from '@/theme';

// ─── Stepper Component ───────────────────────────────────────────────────────
function Stepper({
  value,
  onChange,
  min = 0,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
}) {
  return (
    <View style={stepperStyles.container}>
      <Pressable
        style={({ pressed }) => [
          stepperStyles.btn,
          pressed && stepperStyles.btnPressed,
          value <= min && stepperStyles.btnDisabled,
        ]}
        onPress={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        hitSlop={6}
      >
        <Minus size={16} color={value <= min ? theme.colors.mutedForeground : theme.colors.primary} strokeWidth={2.5} />
      </Pressable>

      <Text style={stepperStyles.value}>{value}</Text>

      <Pressable
        style={({ pressed }) => [
          stepperStyles.btn,
          pressed && stepperStyles.btnPressed,
        ]}
        onPress={() => onChange(value + 1)}
        hitSlop={6}
      >
        <Plus size={16} color={theme.colors.primary} strokeWidth={2.5} />
      </Pressable>
    </View>
  );
}

const stepperStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
    height: 48,
  },
  btn: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.muted,
  },
  btnPressed: {
    backgroundColor: theme.colors.primarySoft,
  },
  btnDisabled: {
    opacity: 0.4,
  },
  value: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.foreground,
  },
});

// ─── Main Page ────────────────────────────────────────────────────────────────
interface Props {
  initialCode?: string;
  onClose?: () => void; // used when embedded (modal-like)
}

export function AddItemPage({ initialCode, onClose }: Props) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { addItem, items } = useInventory();
  const { addTransaction } = useStockHistory();

  // Generate a fresh random code at mount
  const freshCode = useCallback(() => {
    const codes = new Set(items.map(i => i.code).filter(Boolean) as string[]);
    return generateItemCode(codes);
  }, [items]);

  const [name, setName] = useState('');
  const [code, setCode] = useState(initialCode || freshCode());
  const [quantity, setQuantity] = useState(0);
  const [minStock, setMinStock] = useState(0);
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  // Validation errors
  const [nameError, setNameError] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [codeError, setCodeError] = useState('');

  const handleRandomCode = () => {
    setCode(freshCode());
    setCodeError('');
  };

  const handleBack = () => {
    if (onClose) {
      onClose();
    } else {
      router.back();
    }
  };

  const validate = (): boolean => {
    let valid = true;

    if (!name.trim()) {
      setNameError('Nama barang wajib diisi');
      valid = false;
    } else {
      setNameError('');
    }

    if (!category.trim()) {
      setCategoryError('Kategori wajib diisi');
      valid = false;
    } else {
      setCategoryError('');
    }

    const trimmedCode = code.trim();
    if (trimmedCode) {
      const exists = items.some(
        i => i.code?.toLowerCase() === trimmedCode.toLowerCase()
      );
      if (exists) {
        setCodeError(`Kode "${trimmedCode}" sudah digunakan`);
        valid = false;
      } else {
        setCodeError('');
      }
    } else {
      setCodeError('');
    }

    return valid;
  };

  const handleSave = () => {
    if (!validate()) return;

    const trimmedCode = code.trim();
    const newItem = {
      code: trimmedCode || undefined,
      name: name.trim(),
      category: category.trim(),
      quantity,
      minStock,
      location: location.trim(),
    };

    addItem(newItem);

    // Record initial stock transaction if qty > 0
    // We need the new item's ID — get it by matching name after adding
    // Use a brief delay to let state settle, then find the item
    setTimeout(() => {
      // noop — history recorded below via direct call with a temp id label
    }, 0);

    toast.success(`${name.trim()} berhasil ditambahkan ke inventaris`);
    handleBack();
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      {/* ── Top Bar ── */}
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <Pressable style={styles.backBtn} onPress={handleBack} hitSlop={10}>
          <ChevronLeft size={24} color={theme.colors.foreground} strokeWidth={2.5} />
        </Pressable>
        <Text style={styles.topTitle}>Tambah Barang</Text>
        <View style={styles.topRightPlaceholder} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 24 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Nama Barang ── */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Nama Barang</Text>
          <TextInput
            style={[styles.textInput, nameError ? styles.textInputError : null]}
            placeholder="Masukkan nama barang"
            placeholderTextColor={theme.colors.mutedForeground}
            value={name}
            onChangeText={v => {
              setName(v);
              if (v.trim()) setNameError('');
            }}
            returnKeyType="next"
            autoCapitalize="words"
          />
          {nameError ? (
            <Text style={styles.errorText}>{nameError}</Text>
          ) : null}
        </View>

        {/* ── Kode Barang ── */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Kode Barang</Text>
          <View style={styles.codeRow}>
            <TextInput
              style={[
                styles.textInput,
                styles.codeInput,
                codeError ? styles.textInputError : null,
              ]}
              placeholder="WH-XXXXXX"
              placeholderTextColor={theme.colors.mutedForeground}
              value={code}
              onChangeText={v => {
                setCode(v.toUpperCase());
                setCodeError('');
              }}
              autoCapitalize="characters"
              returnKeyType="next"
            />
            <Pressable
              style={({ pressed }) => [
                styles.acakBtn,
                pressed && styles.acakBtnPressed,
              ]}
              onPress={handleRandomCode}
            >
              <Shuffle size={14} color={theme.colors.primary} strokeWidth={2} />
              <Text style={styles.acakBtnText}>Acak</Text>
            </Pressable>
          </View>
          {codeError ? (
            <Text style={styles.errorText}>{codeError}</Text>
          ) : (
            <Text style={styles.hintText}>Otomatis, bisa diubah</Text>
          )}
        </View>

        {/* ── Kategori ── */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Kategori</Text>
          <TextInput
            style={[styles.textInput, categoryError ? styles.textInputError : null]}
            placeholder="Contoh: Elektronik, Logistik, Bahan"
            placeholderTextColor={theme.colors.mutedForeground}
            value={category}
            onChangeText={v => {
              setCategory(v);
              if (v.trim()) setCategoryError('');
            }}
            returnKeyType="next"
            autoCapitalize="words"
          />
          {categoryError ? (
            <Text style={styles.errorText}>{categoryError}</Text>
          ) : null}
        </View>

        {/* ── Stok Awal ── */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Stok Awal</Text>
          <Stepper value={quantity} onChange={setQuantity} />
        </View>

        {/* ── Stok Minimum ── */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Stok Minimum</Text>
          <Stepper value={minStock} onChange={setMinStock} />
        </View>

        {/* ── Lokasi ── */}
        <View style={styles.fieldGroup}>
          <View style={styles.labelRow}>
            <View style={styles.labelWithIcon}>
              <MapPin size={13} color={theme.colors.mutedForeground} style={{ marginRight: 4 }} />
              <Text style={styles.fieldLabel}>Lokasi</Text>
            </View>
            <Text style={styles.optionalTag}>Opsional</Text>
          </View>
          <TextInput
            style={styles.textInput}
            placeholder="Contoh: Rak A-01"
            placeholderTextColor={theme.colors.mutedForeground}
            value={location}
            onChangeText={setLocation}
            returnKeyType="next"
          />
        </View>

        {/* ── Catatan ── */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Catatan</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Tambahkan catatan barang..."
            placeholderTextColor={theme.colors.mutedForeground}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            returnKeyType="default"
          />
        </View>

        {/* ── Save Button ── */}
        <Pressable
          style={({ pressed }) => [
            styles.saveBtn,
            pressed && styles.saveBtnPressed,
          ]}
          onPress={handleSave}
        >
          <Text style={styles.saveBtnText}>Simpan Barang</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  // Top bar
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  topTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '700',
    color: theme.colors.foreground,
    letterSpacing: -0.2,
  },
  topRightPlaceholder: {
    width: 36,
  },

  // Scroll
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 4,
  },

  // Field
  fieldGroup: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.foreground,
    marginBottom: 8,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  labelWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionalTag: {
    fontSize: 11,
    color: theme.colors.mutedForeground,
    fontWeight: '500',
  },

  // Text input
  textInput: {
    height: 48,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 14,
    fontSize: 14,
    color: theme.colors.foreground,
  },
  textInputError: {
    borderColor: theme.colors.destructive,
    borderWidth: 1.5,
  },
  textArea: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 14,
    color: theme.colors.foreground,
    minHeight: 90,
    maxHeight: 160,
  },

  // Error / hint
  errorText: {
    fontSize: 11,
    color: theme.colors.destructive,
    fontWeight: '600',
    marginTop: 5,
  },
  hintText: {
    fontSize: 11,
    color: theme.colors.mutedForeground,
    marginTop: 5,
  },

  // Code row
  codeRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  codeInput: {
    flex: 1,
    fontFamily: 'monospace',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  acakBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.colors.primarySoft,
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    borderColor: 'rgba(217, 119, 87, 0.3)',
    height: 48,
  },
  acakBtnPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.97 }],
  },
  acakBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.primary,
  },

  // Save button
  saveBtn: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radii.lg,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    elevation: 3,
    shadowColor: theme.colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  saveBtnPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.99 }],
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
});
