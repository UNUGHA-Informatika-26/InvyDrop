import { useNavigate, useLocation } from 'react-router';
import { Package, BarChart3, Plus, ScanLine, Settings } from 'lucide-react';

interface BottomNavProps {
  onAddClick: () => void;
  onScanClick: () => void;
}

export function BottomNav({ onAddClick, onScanClick }: BottomNavProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const isInventoryActive = location.pathname === '/' || location.pathname === '';
  const isStatsActive = location.pathname === '/statistics';
  const isSettingsActive = location.pathname === '/settings';

  return (
    <nav className="shrink-0 bg-card border-t border-border pb-[env(safe-area-inset-bottom)] select-none">
      <div className="grid grid-cols-5 items-end h-16">
        {/* Slot 1: Inventory */}
        <button
          type="button"
          onClick={() => navigate('/')}
          className="flex flex-col items-center justify-center h-16 min-w-[44px] w-full px-1 focus:outline-none"
        >
          <div
            className={`w-full max-w-[64px] h-13 flex flex-col items-center justify-center gap-1 py-1 rounded-2xl transition-all ${
              isInventoryActive
                ? 'text-primary bg-primary-soft'
                : 'text-muted-foreground hover:text-foreground active:bg-muted'
            }`}
          >
            <Package className="w-6 h-6" strokeWidth={2} />
            <span className="text-xs leading-none">Inventory</span>
          </div>
        </button>

        {/* Slot 2: Statistics */}
        <button
          type="button"
          onClick={() => navigate('/statistics')}
          className="flex flex-col items-center justify-center h-16 min-w-[44px] w-full px-1 focus:outline-none"
        >
          <div
            className={`w-full max-w-[64px] h-13 flex flex-col items-center justify-center gap-1 py-1 rounded-2xl transition-all ${
              isStatsActive
                ? 'text-primary bg-primary-soft'
                : 'text-muted-foreground hover:text-foreground active:bg-muted'
            }`}
          >
            <BarChart3 className="w-6 h-6" strokeWidth={2} />
            <span className="text-xs leading-none">Statistics</span>
          </div>
        </button>

        {/* Slot 3: Tambah (Tengah, aksi) */}
        <div className="flex flex-col items-center justify-end h-16 w-full pb-1">
          <button
            type="button"
            onClick={onAddClick}
            aria-label="Tambah barang"
            className="w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-md active:bg-primary-hover flex items-center justify-center -translate-y-4 ring-4 ring-background transition-transform active:scale-95 focus:outline-none"
          >
            <Plus className="w-7 h-7" strokeWidth={2.5} />
          </button>
          <span className="text-xs text-muted-foreground leading-none -mt-3">Tambah</span>
        </div>

        {/* Slot 4: Scan (Aksi) */}
        <button
          type="button"
          onClick={onScanClick}
          className="flex flex-col items-center justify-center h-16 min-w-[44px] w-full px-1 focus:outline-none"
        >
          <div className="w-full max-w-[64px] h-13 flex flex-col items-center justify-center gap-1 py-1 rounded-2xl transition-all text-muted-foreground hover:text-foreground active:bg-muted">
            <ScanLine className="w-6 h-6" strokeWidth={2} />
            <span className="text-xs leading-none">Scan</span>
          </div>
        </button>

        {/* Slot 5: Settings */}
        <button
          type="button"
          onClick={() => navigate('/settings')}
          className="flex flex-col items-center justify-center h-16 min-w-[44px] w-full px-1 focus:outline-none"
        >
          <div
            className={`w-full max-w-[64px] h-13 flex flex-col items-center justify-center gap-1 py-1 rounded-2xl transition-all ${
              isSettingsActive
                ? 'text-primary bg-primary-soft'
                : 'text-muted-foreground hover:text-foreground active:bg-muted'
            }`}
          >
            <Settings className="w-6 h-6" strokeWidth={2} />
            <span className="text-xs leading-none">Settings</span>
          </div>
        </button>
      </div>
    </nav>
  );
}
