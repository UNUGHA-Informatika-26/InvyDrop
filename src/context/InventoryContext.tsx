import { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface InventoryItem {
  id: string;
  name: string;
  code?: string;
  category: string;
  quantity: number;
  minStock: number;
  location: string;
  notes?: string;
  createdAt: string;
}

interface InventoryContextType {
  items: InventoryItem[];
  addItem: (item: Omit<InventoryItem, 'id' | 'createdAt'>) => void;
  removeItem: (id: string) => void;
  addStock: (id: string, quantity: number) => void;
  removeStock: (id: string, quantity: number) => void;
  updateItem: (id: string, updates: Partial<InventoryItem>) => void;
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (open: boolean) => void;
  initialAddCode: string;
  openAddItem: (code?: string) => void;
  isLoading: boolean;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

export function generateItemCode(existingCodes: Set<string>): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  let attempts = 0;
  do {
    let rand = '';
    for (let i = 0; i < 6; i++) {
      rand += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    code = `WH-${rand}`;
    attempts++;
  } while (existingCodes.has(code) && attempts < 100);
  return code;
}

const SEED_ITEMS: InventoryItem[] = [
  {
    id: 'seed-1',
    code: 'WH-FL8921',
    name: 'Industrial Forklift Battery 48V',
    category: 'Heavy Equipment',
    quantity: 14,
    minStock: 5,
    location: 'Aisle B - Bay 04',
    notes: 'Simpan di area berventilasi baik. Cek level cairan elektrolit mingguan.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'seed-2',
    code: 'WH-PL3412',
    name: 'Heavy Duty Wooden Pallet',
    category: 'Packaging',
    quantity: 4,
    minStock: 12,
    location: 'Aisle A - Bay 01',
    notes: 'Standar fumigasi ISPM 15, kapasitas beban maks 1.5 ton.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'seed-3',
    code: 'WH-SC7740',
    name: 'Wireless Barcode Scanner Handheld',
    category: 'Electronics',
    quantity: 9,
    minStock: 3,
    location: 'Tech Hub - Locker 2',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'seed-4',
    code: 'WH-ST9005',
    name: 'Stretch Wrap Film 500mm x 300m',
    category: 'Packaging',
    quantity: 26,
    minStock: 10,
    location: 'Aisle A - Bay 02',
    createdAt: new Date().toISOString(),
  },
];

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<InventoryItem[]>(SEED_ITEMS);
  const [isLoading, setIsLoading] = useState(true);
  const isInitialLoadRef = useRef(true);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [initialAddCode, setInitialAddCode] = useState('');

  const openAddItem = (code?: string) => {
    setInitialAddCode(code || '');
    setIsAddDialogOpen(true);
  };

  useEffect(() => {
    let isMounted = true;
    async function loadInventory() {
      try {
        const stored = await AsyncStorage.getItem('warehouse-inventory');
        if (stored && isMounted) {
          const parsed: InventoryItem[] = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const codes = new Set(parsed.map(i => i.code).filter(Boolean) as string[]);
            const formatted = parsed.map(item => {
              if (!item.code) {
                const newCode = generateItemCode(codes);
                codes.add(newCode);
                return { ...item, code: newCode };
              }
              return item;
            });
            setItems(formatted);
          }
        }
      } catch (e) {
        console.error('Error loading warehouse inventory:', e);
      } finally {
        if (isMounted) {
          setIsLoading(false);
          isInitialLoadRef.current = false;
        }
      }
    }
    loadInventory();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (isInitialLoadRef.current) return;
    AsyncStorage.setItem('warehouse-inventory', JSON.stringify(items)).catch(e =>
      console.error('Error saving inventory:', e)
    );
  }, [items]);

  const addItem = (item: Omit<InventoryItem, 'id' | 'createdAt'>) => {
    const existingCodes = new Set(items.map(i => i.code).filter(Boolean) as string[]);
    const finalCode = item.code?.trim() || generateItemCode(existingCodes);

    const newItem: InventoryItem = {
      ...item,
      code: finalCode,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setItems(prev => [...prev, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const addStock = (id: string, quantity: number) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity: item.quantity + quantity } : item
      )
    );
  };

  const removeStock = (id: string, quantity: number) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(0, item.quantity - quantity) }
          : item
      )
    );
  };

  const updateItem = (id: string, updates: Partial<InventoryItem>) => {
    setItems(prev =>
      prev.map(item => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  return (
    <InventoryContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        addStock,
        removeStock,
        updateItem,
        isAddDialogOpen,
        setIsAddDialogOpen,
        initialAddCode,
        openAddItem,
        isLoading,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
}
