import { useState, useEffect } from 'react';
import { InventoryItem, useInventory } from '../context/InventoryContext';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from './ui/drawer';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Plus, Minus, QrCode, ArrowRight, AlertTriangle, Package } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';

interface ScanDetailDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: InventoryItem | null;
  onShowQr: (item: InventoryItem) => void;
}

export function ScanDetailDrawer({
  open,
  onOpenChange,
  item,
  onShowQr,
}: ScanDetailDrawerProps) {
  const { addStock, removeStock, items } = useInventory();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState('1');

  // Always keep item data fresh from context
  const currentItem = item ? items.find(i => i.id === item.id) || item : null;

  useEffect(() => {
    if (open) {
      setQuantity('1');
    }
  }, [open]);

  if (!currentItem) return null;

  const isLowStock = currentItem.quantity <= currentItem.minStock;
  const isOutOfStock = currentItem.quantity === 0;

  const handleStockIn = () => {
    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty < 1) {
      toast.error('Masukkan jumlah barang masuk minimal 1');
      return;
    }
    addStock(currentItem.id, qty);
    toast.success(`Berhasil menambah +${qty} ${currentItem.name}`);
    setQuantity('1');
  };

  const handleStockOut = () => {
    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty < 1) {
      toast.error('Masukkan jumlah barang keluar minimal 1');
      return;
    }
    if (qty > currentItem.quantity) {
      toast.error(`Jumlah keluar (${qty}) melebihi stok yang ada (${currentItem.quantity})`);
      return;
    }
    removeStock(currentItem.id, qty);
    toast.success(`Berhasil mengeluarkan -${qty} ${currentItem.name}`);
    setQuantity('1');
  };

  const handleViewDetail = () => {
    onOpenChange(false);
    navigate('/');
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-w-md mx-auto">
        <DrawerHeader className="text-left pb-2">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-semibold text-primary bg-primary-soft px-2.5 py-1 rounded-full">
              Detail Cepat
            </span>
            {isLowStock && (
              <span className="flex items-center gap-1 text-xs text-warning bg-warning-soft px-2.5 py-1 rounded-full font-medium">
                <AlertTriangle className="w-3.5 h-3.5" />
                Stok Menipis
              </span>
            )}
          </div>
          <DrawerTitle className="text-xl font-bold mt-2 text-foreground">
            {currentItem.name}
          </DrawerTitle>
          <DrawerDescription className="flex items-center gap-2 mt-1">
            <span className="font-mono text-xs bg-secondary text-foreground font-semibold px-2 py-0.5 rounded border border-border">
              {currentItem.code || currentItem.id}
            </span>
            <span>•</span>
            <span>{currentItem.category}</span>
            <span>•</span>
            <span>{currentItem.location}</span>
          </DrawerDescription>
        </DrawerHeader>

        <div className="p-4 space-y-4">
          {/* Current Stock Banner */}
          <div className="bg-card border border-border rounded-2xl p-4 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary-soft flex items-center justify-center text-primary">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Stok Saat Ini</p>
                <p className="text-3xl font-bold text-foreground">{currentItem.quantity}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Batas Minimum</p>
              <p className="text-base font-semibold text-foreground">{currentItem.minStock} unit</p>
            </div>
          </div>

          {/* Quick Adjustment Inputs */}
          <div>
            <Label htmlFor="scan-qty" className="text-base font-medium">
              Jumlah Perubahan
            </Label>
            <Input
              id="scan-qty"
              type="number"
              min={1}
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
              placeholder="1"
              className="mt-2 h-12 text-base font-semibold"
            />
          </div>

          {/* Actions: Stock In & Stock Out */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              onClick={handleStockIn}
              className="bg-success hover:bg-success/80 text-white h-12 text-base font-medium"
            >
              <Plus className="w-5 h-5 mr-1" />
              Barang Masuk (+)
            </Button>
            <Button
              type="button"
              onClick={handleStockOut}
              disabled={isOutOfStock}
              className="bg-primary hover:bg-primary-hover text-primary-foreground h-12 text-base font-medium disabled:opacity-50"
            >
              <Minus className="w-5 h-5 mr-1" />
              Barang Keluar (−)
            </Button>
          </div>
        </div>

        <DrawerFooter className="pt-0 pb-6 flex flex-row gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onShowQr(currentItem)}
            className="flex-1 h-11 border-border"
          >
            <QrCode className="w-4 h-4 mr-2" />
            Tampilkan QR
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={handleViewDetail}
            className="flex-1 h-11"
          >
            Lihat detail
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
