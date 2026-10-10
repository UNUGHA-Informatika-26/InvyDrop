import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useInventory } from '@/context/InventoryContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/Dialog';
import { TextField } from '@/components/ui/TextField';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';
import { toast } from '@/components/ui/Toast';
import { theme } from '@/theme';

interface AddItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialCode?: string;
}

export function AddItemDialog({ open, onOpenChange, initialCode }: AddItemDialogProps) {
  const { addItem, items } = useInventory();
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    category: '',
    quantity: '',
    minStock: '',
    location: '',
  });

  useEffect(() => {
    if (open) {
      setFormData(prev => ({
        ...prev,
        code: initialCode || '',
      }));
    }
  }, [open, initialCode]);

  const handleSubmit = () => {
    if (
      !formData.name ||
      !formData.category ||
      !formData.quantity ||
      !formData.minStock ||
      !formData.location
    ) {
      toast.error('Harap isi semua field yang wajib');
      return;
    }

    const quantity = parseInt(formData.quantity, 10);
    const minStock = parseInt(formData.minStock, 10);

    if (isNaN(quantity) || quantity < 0) {
      toast.error('Masukkan jumlah stok yang valid');
      return;
    }

    if (isNaN(minStock) || minStock < 0) {
      toast.error('Masukkan batas minimum stok yang valid');
      return;
    }

    const trimmedCode = formData.code.trim();
    if (trimmedCode) {
      const codeExists = items.some(
        item => item.code?.toLowerCase() === trimmedCode.toLowerCase()
      );
      if (codeExists) {
        toast.error(`Kode barang "${trimmedCode}" sudah digunakan`);
        return;
      }
    }

    addItem({
      code: trimmedCode || undefined,
      name: formData.name.trim(),
      category: formData.category.trim(),
      quantity,
      minStock,
      location: formData.location.trim(),
    });

    toast.success(`${formData.name} berhasil ditambahkan ke inventaris`);
    setFormData({
      code: '',
      name: '',
      category: '',
      quantity: '',
      minStock: '',
      location: '',
    });
    onOpenChange(false);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Barang Baru</DialogTitle>
        </DialogHeader>

        <View style={styles.form}>
          <View style={styles.fieldGroup}>
            <View style={styles.labelRow}>
              <Label>Kode Barang / SKU</Label>
              <Text style={styles.optionalNote}>Opsional (Otomatis)</Text>
            </View>
            <TextField
              value={formData.code}
              onChangeText={val => handleChange('code', val)}
              placeholder="Contoh: WH-AB1234 (atau kosongkan)"
              autoCapitalize="characters"
            />
          </View>

          <View style={styles.fieldGroup}>
            <Label>Nama Barang *</Label>
            <TextField
              value={formData.name}
              onChangeText={val => handleChange('name', val)}
              placeholder="Masukkan nama barang"
            />
          </View>

          <View style={styles.fieldGroup}>
            <Label>Kategori *</Label>
            <TextField
              value={formData.category}
              onChangeText={val => handleChange('category', val)}
              placeholder="Contoh: Elektronik, Logistik, Bahan"
            />
          </View>

          <View style={styles.twoColumnRow}>
            <View style={styles.col}>
              <Label>Stok Awal *</Label>
              <TextField
                keyboardType="numeric"
                value={formData.quantity}
                onChangeText={val => handleChange('quantity', val)}
                placeholder="0"
              />
            </View>
            <View style={styles.col}>
              <Label>Batas Minimum *</Label>
              <TextField
                keyboardType="numeric"
                value={formData.minStock}
                onChangeText={val => handleChange('minStock', val)}
                placeholder="0"
              />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Label>Lokasi Rak / Aisle *</Label>
            <TextField
              value={formData.location}
              onChangeText={val => handleChange('location', val)}
              placeholder="Contoh: Aisle 3 - Bay B"
            />
          </View>
        </View>

        <DialogFooter style={styles.footer}>
          <Button
            variant="outline"
            onPress={() => onOpenChange(false)}
            style={styles.btn}
          >
            Batal
          </Button>
          <Button onPress={handleSubmit} style={styles.btn}>
            Simpan Barang
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const styles = StyleSheet.create({
  form: {
    paddingVertical: theme.spacing.sm,
  },
  fieldGroup: {
    marginBottom: theme.spacing.md,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  optionalNote: {
    fontSize: theme.typography.fontXs,
    color: theme.colors.mutedForeground,
  },
  twoColumnRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  col: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: theme.spacing.sm,
  },
  btn: {
    flex: 1,
  },
});