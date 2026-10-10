import { useState, useEffect } from 'react';
import { useInventory } from '../context/InventoryContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { toast } from 'sonner';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

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

    const quantity = parseInt(formData.quantity);
    const minStock = parseInt(formData.minStock);

    if (isNaN(quantity) || quantity < 0) {
      toast.error('Masukkan jumlah stok yang valid');
      return;
    }

    if (isNaN(minStock) || minStock < 0) {
      toast.error('Masukkan batas minimum stok yang valid');
      return;
    }

    // Check code uniqueness if provided
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
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Tambah Barang Baru</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-3">
            <div>
              <div className="flex justify-between items-center">
                <Label htmlFor="code" className="text-base">Kode Barang / SKU</Label>
                <span className="text-xs text-muted-foreground">Opsional (Otomatis jika kosong)</span>
              </div>
              <Input
                id="code"
                value={formData.code}
                onChange={e => handleChange('code', e.target.value)}
                placeholder="Contoh: WH-AB1234 (atau kosongkan)"
                className="mt-2 h-12 text-base font-mono uppercase"
              />
            </div>

            <div>
              <Label htmlFor="name" className="text-base">Nama Barang *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={e => handleChange('name', e.target.value)}
                placeholder="Masukkan nama barang"
                className="mt-2 h-12 text-base"
                required
              />
            </div>

            <div>
              <Label htmlFor="category" className="text-base">Kategori *</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={e => handleChange('category', e.target.value)}
                placeholder="Contoh: Elektronik, Logistik, Bahan"
                className="mt-2 h-12 text-base"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="quantity" className="text-base">Stok Awal *</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="0"
                  value={formData.quantity}
                  onChange={e => handleChange('quantity', e.target.value)}
                  placeholder="0"
                  className="mt-2 h-12 text-base"
                  required
                />
              </div>

              <div>
                <Label htmlFor="minStock" className="text-base">Batas Minimum *</Label>
                <Input
                  id="minStock"
                  type="number"
                  min="0"
                  value={formData.minStock}
                  onChange={e => handleChange('minStock', e.target.value)}
                  placeholder="0"
                  className="mt-2 h-12 text-base"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="location" className="text-base">Lokasi Rak / Aisle *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={e => handleChange('location', e.target.value)}
                placeholder="Contoh: Aisle 3 - Bay B"
                className="mt-2 h-12 text-base"
                required
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-11"
            >
              Batal
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary-hover text-primary-foreground h-11">
              Simpan Barang
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}