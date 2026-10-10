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
import { ChevronLeft, Plus, Minus, MapPin } from 'lucide-react-native';
import { useInventory } from '@/context/InventoryContext';
import { toast } from '@/components/ui/Toast';
import { theme } from '@/theme';

// ─── Stepper Component ────────────────────────────────────────────────────────
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
        <Minus
          size={16}
          color={value <= min ? theme.colors.mutedForeground : theme.colors.primary}
          strokeWidth={2.5}
        />
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
  btnPressed: { backgroundColor: theme.colors.primarySoft },
  btnDisabled: { opacity: 0.4 },
  value: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.foreground,
  },
});

// ─── Main EditItemPage ────────────────────────────────────────────────────────
interface Props {
  itemId: string;
}

export function EditItemPage({ itemId }: Props) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { items, updateItem } = useInventory();

  const item = items.find(i => i.id === itemId);

  // Pre-fill form with existing data
  const [name, setName] = useState(item?.name ?? '');
  const [code, setCode] = useState(item?.code ?? '');
  const [category, setCategory] = useState(item?.category ?? '');
  const [minStock, setMinStock] = useState(item?.minStock ?? 0);
  const [location, setLocation] = useState(item?.location ?? '');
  const [notes, setNotes] = useState(item?.notes ?? '');

  // Validation errors
  const [nameError, setNameError] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [codeError, setCodeError] = useState('');

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
        i => i.id !== itemId && i.code?.toLowerCase() === trimmedCode.toLowerCase()
      );
      if (exists) {
        setCodeError(`Kode "${trimmedCode}" sudah digunakan barang lain`);
        valid = false;
      } else {
        setCodeError('');
      }
    } else {
      setCodeError('');
    }
    return valid;
  };

  const handleSave = useCallback(() => {
    if (!item) return;
    if (!validate()) return;

    updateItem(itemId, {
      name: name.trim(),
      code: code.trim() || undefined,
      category: category.trim(),
      minStock,
      location: location.trim(),
      notes: notes.trim() || undefined,
    });

    toast.success(`${name.trim()} berhasil diperbarui`);
    router.back();
  }, [item, name, code, category, minStock, location, notes, itemId, updateItem, router]);

  if (!item) {
    return (
      <View style={[styles.screen, styles.notFound, { paddingTop: insets.top }]}>
        <Text style={styles.notFoundText}>Barang tidak ditemukan</Text>
        <Pressable style={styles.backFallback} onPress={() => router.back()}>
          <Text style={styles.backFallbackText}>Kembali</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* ── Top Bar ── */}
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()} hitSlop={10}>
          <ChevronLeft size={24} color={theme.colors.foreground} strokeWidth={2.5} />
        </Pressable>
        <Text style={styles.topTitle}>Edit Barang</Text>
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
            autoCapitalize="words"
            returnKeyType="next"
          />
          {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
        </View>

        {/* ── Kode Barang ── */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Kode Barang</Text>
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
          {codeError ? (
            <Text style={styles.errorText}>{codeError}</Text>
          ) : (
            <Text style={styles.hintText}>Bisa dikosongkan untuk kode otomatis</Text>
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
            autoCapitalize="words"
            returnKeyType="next"
          />
          {categoryError ? <Text style={styles.errorText}>{categoryError}</Text> : null}
        </View>

        {/* ── Stok Minimum ── */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Stok Minimum</Text>
          <Stepper value={minStock} onChange={setMinStock} />
          <Text style={styles.hintText}>Peringatan muncul jika stok berada di bawah nilai ini</Text>
        </View>

        {/* ── Lokasi ── */}
        <View style={styles.fieldGroup}>
          <View style={styles.labelRow}>
            <View style={styles.labelWithIcon}>
              <MapPin size={13} color={theme.colors.mutedForeground} style={{ marginRight: 4 }} />
              <Text style={styles.fieldLabel}>Lokasi / Rak</Text>
            </View>
            <Text style={styles.optionalTag}>Opsional</Text>
          </View>
          <TextInput
            style={styles.textInput}
            placeholder="Contoh: Rak A-01, Aisle B - Bay 03"
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
            placeholder="Tambahkan catatan perubahan..."
            placeholderTextColor={theme.colors.mutedForeground}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* ── Info box stok saat ini (read-only) ── */}
        <View style={styles.infoBox}>
          <Text style={styles.infoBoxTitle}>ℹ️ Stok Saat Ini</Text>
          <Text style={styles.infoBoxValue}>{item.quantity} unit</Text>
          <Text style={styles.infoBoxHint}>
            Untuk mengubah jumlah stok, gunakan tombol Barang Masuk / Barang Keluar di halaman detail.
          </Text>
        </View>

        {/* ── Save Button ── */}
        <Pressable
          style={({ pressed }) => [
            styles.saveBtn,
            pressed && styles.saveBtnPressed,
          ]}
          onPress={handleSave}
        >
          <Text style={styles.saveBtnText}>Simpan Perubahan</Text>
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
  notFound: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  notFoundText: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.foreground,
  },
  backFallback: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: theme.radii.md,
  },
  backFallbackText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
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
  topRightPlaceholder: { width: 36 },

  // Scroll
  scroll: { flex: 1 },
  scrollContent: {
    padding: 20,
    gap: 4,
  },

  // Fields
  fieldGroup: { marginBottom: 20 },
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

  // Inputs
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
  codeInput: {
    fontFamily: 'monospace',
    fontWeight: '700',
    letterSpacing: 0.5,
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

  // Info box
  infoBox: {
    backgroundColor: theme.colors.muted,
    borderRadius: theme.radii.md,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  infoBoxTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.mutedForeground,
    marginBottom: 4,
  },
  infoBoxValue: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.foreground,
    marginBottom: 4,
  },
  infoBoxHint: {
    fontSize: 11,
    color: theme.colors.mutedForeground,
    lineHeight: 16,
  },

  // Save button
  saveBtn: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radii.lg,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
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
