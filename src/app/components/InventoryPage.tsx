import { useState } from 'react';
import { useInventory, InventoryItem } from '../context/InventoryContext';
import { AlertTriangle, Trash2, Plus, Minus, Package, QrCode } from 'lucide-react';
import { Button } from './ui/button';
import { StockDialog } from './StockDialog';
import { ItemQrDialog } from './ItemQrDialog';
import { HeroBanner } from './HeroBanner';
import warehouseImage from '@/assets/bulan-jatuh2.png';
import { toast } from 'sonner';

export function InventoryPage() {
  const { items, removeItem } = useInventory();
  const [selectedQrItem, setSelectedQrItem] = useState<InventoryItem | null>(null);
  const [isQrDialogOpen, setIsQrDialogOpen] = useState(false);

  const [stockDialogState, setStockDialogState] = useState<{
    open: boolean;
    itemId: string;
    itemName: string;
    currentStock: number;
    mode: 'add' | 'remove';
  }>({
    open: false,
    itemId: '',
    itemName: '',
    currentStock: 0,
    mode: 'add',
  });

  const totalItems = items.length;
  const lowStockCount = items.filter(item => item.quantity <= item.minStock).length;

  const handleRemoveItem = (id: string, name: string) => {
    if (window.confirm(`Hapus "${name}" dari inventaris gudang?`)) {
      removeItem(id);
      toast.success(`${name} telah dihapus`);
    }
  };

  const handleOpenStockDialog = (
    itemId: string,
    itemName: string,
    currentStock: number,
    mode: 'add' | 'remove'
  ) => {
    setStockDialogState({
      open: true,
      itemId,
      itemName,
      currentStock,
      mode,
    });
  };

  const handleOpenQrDialog = (item: InventoryItem) => {
    setSelectedQrItem(item);
    setIsQrDialogOpen(true);
  };

  return (
    <div className="min-h-full bg-background pb-4">
      {/* Header Banner */}
      <HeroBanner
        imageSrc={warehouseImage}
        title="InvyDrop"
        subtitle="Sistem Manajemen Gudang & Logistik"
        className="h-48 rounded-b-3xl"
        contentClassName="px-6"
      />

      {/* Stats Cards */}
      <div className="px-5 -mt-6 mb-6">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card rounded-2xl p-4 shadow-sm border border-border">
            <div className="flex justify-center mb-2">
              <div className="w-12 h-12 bg-primary-soft rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="text-2xl font-bold text-primary text-center mb-0.5">{totalItems}</div>
            <div className="text-xs text-muted-foreground text-center">Total Barang</div>
          </div>

          <div className="bg-card rounded-2xl p-4 shadow-sm border border-border">
            <div className="flex justify-center mb-2">
              <div className="w-12 h-12 bg-warning-soft rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-warning" />
              </div>
            </div>
            <div className="text-2xl font-bold text-warning text-center mb-0.5">{lowStockCount}</div>
            <div className="text-xs text-muted-foreground text-center">Stok Menipis</div>
          </div>
        </div>
      </div>

      {/* Inventory List */}
      <div className="px-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold">Daftar Barang</h2>
            <p className="text-xs text-muted-foreground">{totalItems} barang tercatat di sistem</p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="bg-card rounded-2xl p-10 text-center border border-border">
            <Package className="w-16 h-16 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-muted-foreground text-base font-medium">Belum ada barang di inventaris</p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Gunakan tombol Tambah di navbar bawah untuk menambahkan barang
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map(item => {
              const isLowStock = item.quantity <= item.minStock;
              const isOutOfStock = item.quantity === 0;

              return (
                <div
                  key={item.id}
                  className="bg-card rounded-2xl p-4 shadow-xs border border-border"
                >
                  {/* Item Title, Code, & Badge */}
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1 min-w-0 pr-2">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="text-base font-bold truncate">{item.name}</h3>
                        {item.code && (
                          <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-secondary text-primary border border-border">
                            {item.code}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {item.category} • {item.location}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {isLowStock && (
                        <div className="flex items-center gap-1 text-warning bg-warning-soft px-2.5 py-1 rounded-lg">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span className="text-xs font-semibold">Low</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Stock Metrics */}
                  <div className="flex items-center justify-between py-2 px-3 bg-secondary/50 rounded-xl mb-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Stok Saat Ini</p>
                      <p className="text-2xl font-bold text-foreground">{item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Batas Minimum</p>
                      <p className="text-sm font-semibold text-muted-foreground">{item.minStock} unit</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() =>
                        handleOpenStockDialog(item.id, item.name, item.quantity, 'add')
                      }
                      className="flex-1 bg-success hover:bg-success/80 text-white h-10 text-xs font-medium"
                      size="sm"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Masuk
                    </Button>
                    <Button
                      onClick={() =>
                        handleOpenStockDialog(item.id, item.name, item.quantity, 'remove')
                      }
                      className="flex-1 bg-primary hover:bg-primary-hover text-primary-foreground h-10 text-xs font-medium"
                      size="sm"
                      disabled={isOutOfStock}
                    >
                      <Minus className="w-4 h-4 mr-1" />
                      Keluar
                    </Button>
                    <Button
                      onClick={() => handleOpenQrDialog(item)}
                      variant="outline"
                      size="sm"
                      className="h-10 px-3 border-border hover:bg-muted"
                      title="Tampilkan QR"
                    >
                      <QrCode className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleRemoveItem(item.id, item.name)}
                      variant="destructive"
                      size="sm"
                      className="h-10 px-3"
                      title="Hapus Barang"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Stock Adjustment Dialog */}
      <StockDialog
        open={stockDialogState.open}
        onOpenChange={(open) =>
          setStockDialogState(prev => ({ ...prev, open }))
        }
        itemId={stockDialogState.itemId}
        itemName={stockDialogState.itemName}
        currentStock={stockDialogState.currentStock}
        mode={stockDialogState.mode}
      />

      {/* QR Dialog */}
      <ItemQrDialog
        open={isQrDialogOpen}
        onOpenChange={setIsQrDialogOpen}
        item={selectedQrItem}
      />
    </div>
  );
}