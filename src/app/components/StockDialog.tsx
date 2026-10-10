import { useState } from 'react';
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

interface StockDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemId: string;
  itemName: string;
  currentStock: number;
  mode: 'add' | 'remove';
}

export function StockDialog({
  open,
  onOpenChange,
  itemId,
  itemName,
  currentStock,
  mode,
}: StockDialogProps) {
  const { addStock, removeStock } = useInventory();
  const [quantity, setQuantity] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const qty = parseInt(quantity);

    if (isNaN(qty) || qty <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }

    if (mode === 'remove' && qty > currentStock) {
      toast.error(`Cannot remove more than current stock (${currentStock})`);
      return;
    }

    if (mode === 'add') {
      addStock(itemId, qty);
      toast.success(`Added ${qty} units to ${itemName}`);
    } else {
      removeStock(itemId, qty);
      toast.success(`Removed ${qty} units from ${itemName}`);
    }

    setQuantity('');
    onOpenChange(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setQuantity('');
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {mode === 'add' ? 'Add Stock' : 'Remove Stock'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="bg-muted p-4 rounded-xl">
              <p className="text-sm text-muted-foreground mb-2">
                <span className="block mb-1 text-base">{itemName}</span>
                <span className="text-muted-foreground">
                  Current Stock: <span className="font-semibold">{currentStock}</span>
                </span>
              </p>
            </div>

            <div>
              <Label htmlFor="quantity" className="text-base">
                Quantity to {mode === 'add' ? 'Add' : 'Remove'}
              </Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                max={mode === 'remove' ? currentStock : undefined}
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                placeholder="Enter quantity"
                className="mt-2 h-12 text-base"
                autoFocus
              />
            </div>

            {quantity && (
              <div className="bg-primary-soft p-4 rounded-xl">
                <p className="text-sm text-muted-foreground">
                  New stock level:{' '}
                  <span className="font-semibold text-base text-primary">
                    {mode === 'add'
                      ? currentStock + parseInt(quantity)
                      : currentStock - parseInt(quantity)}
                  </span>
                </p>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              className="h-11"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className={
                mode === 'add'
                  ? 'bg-success hover:bg-success/80 text-white h-11'
                  : 'bg-primary hover:bg-primary-hover h-11'
              }
            >
              {mode === 'add' ? 'Add Stock' : 'Remove Stock'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}