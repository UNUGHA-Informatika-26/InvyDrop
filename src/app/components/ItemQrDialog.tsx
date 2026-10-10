import { QRCodeSVG } from 'qrcode.react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';
import { Printer } from 'lucide-react';
import { InventoryItem } from '../context/InventoryContext';

interface ItemQrDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: InventoryItem | null;
}

export function ItemQrDialog({ open, onOpenChange, item }: ItemQrDialogProps) {
  if (!item) return null;

  const qrValue = item.code || item.id;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm text-center">
        <DialogHeader>
          <DialogTitle className="text-xl text-center">Kode QR Barang</DialogTitle>
        </DialogHeader>

        {/* Printable QR Container */}
        <div id="qr-print-area" className="flex flex-col items-center justify-center py-4 px-2">
          {/* QR Code Container - Strictly black on white */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-border inline-block">
            <QRCodeSVG
              value={qrValue}
              size={200}
              level="M"
              includeMargin={true}
              bgColor="#FFFFFF"
              fgColor="#000000"
            />
          </div>

          <h3 className="text-lg font-bold text-foreground mt-4 mb-0.5">{item.name}</h3>
          <p className="font-mono text-sm font-semibold tracking-wider text-primary">{qrValue}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {item.category} • {item.location}
          </p>
        </div>

        <DialogFooter className="flex-row gap-2 justify-center sm:justify-center">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 h-11"
          >
            Tutup
          </Button>
          <Button
            type="button"
            onClick={handlePrint}
            className="flex-1 bg-primary hover:bg-primary-hover text-primary-foreground h-11"
          >
            <Printer className="w-4 h-4 mr-2" />
            Cetak
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
