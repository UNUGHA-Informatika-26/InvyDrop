import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type TransactionType = 'masuk' | 'keluar' | 'awal';

export interface StockTransaction {
  id: string;
  itemId: string;
  type: TransactionType;
  quantity: number; // always positive; sign determined by type
  note?: string;
  createdAt: string; // ISO string
}

interface StockHistoryContextType {
  transactions: StockTransaction[];
  addTransaction: (
    itemId: string,
    type: TransactionType,
    quantity: number,
    note?: string
  ) => void;
  getItemTransactions: (itemId: string) => StockTransaction[];
}

const StockHistoryContext = createContext<StockHistoryContextType | undefined>(undefined);

const STORAGE_KEY = 'warehouse-stock-history';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

export function StockHistoryProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<StockTransaction[]>([]);

  // Load persisted history on mount
  useEffect(() => {
    let isMounted = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then(raw => {
        if (raw && isMounted) {
          const parsed: StockTransaction[] = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            setTransactions(parsed);
          }
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  // Persist on change
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(transactions)).catch(() => {});
  }, [transactions]);

  const addTransaction = (
    itemId: string,
    type: TransactionType,
    quantity: number,
    note?: string
  ) => {
    const tx: StockTransaction = {
      id: generateId(),
      itemId,
      type,
      quantity,
      note,
      createdAt: new Date().toISOString(),
    };
    setTransactions(prev => [tx, ...prev]);
  };

  const getItemTransactions = (itemId: string): StockTransaction[] => {
    return transactions
      .filter(tx => tx.itemId === itemId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  return (
    <StockHistoryContext.Provider value={{ transactions, addTransaction, getItemTransactions }}>
      {children}
    </StockHistoryContext.Provider>
  );
}

export function useStockHistory() {
  const ctx = useContext(StockHistoryContext);
  if (!ctx) {
    throw new Error('useStockHistory must be used within a StockHistoryProvider');
  }
  return ctx;
}
