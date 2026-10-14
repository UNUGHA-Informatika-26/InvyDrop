/**
 * src/types/opname.ts
 * Tipe data dan fungsi pembantu (pure functions) untuk Stock Opname Massal
 */

export type OpnameStatus = 'MATCH' | 'SURPLUS' | 'DEFISIT';

export interface OpnameEntry {
  itemId: string;
  code: string;
  name: string;
  location: string;
  systemQty: number;   // Snapshot InventoryItem.quantity saat dipindai
  physicalQty: number; // Hasil hitung fisik operator
  unitPrice: number;   // Rp; 0 bila belum diisi
}

export interface OpnameSummary {
  totalScanned: number;
  match: number;
  surplus: number;
  defisit: number;
  variance: number;     // surplus + defisit (jumlah item berselisih)
  impactRupiah: number; // sum((physical - system) * unitPrice), bisa bernilai negatif
}

/**
 * Menghitung selisih jumlah (fisik - sistem)
 */
export function getVariance(e: OpnameEntry): number {
  return e.physicalQty - e.systemQty;
}

/**
 * Menentukan status opname berdasarkan selisih fisik vs sistem
 */
export function getOpnameStatus(e: OpnameEntry): OpnameStatus {
  const variance = getVariance(e);
  if (variance > 0) return 'SURPLUS';
  if (variance < 0) return 'DEFISIT';
  return 'MATCH';
}

/**
 * Menghitung ringkasan statistik dari kumpulan data opname
 */
export function buildSummary(entries: OpnameEntry[]): OpnameSummary {
  let match = 0;
  let surplus = 0;
  let defisit = 0;
  let impactRupiah = 0;

  for (const entry of entries) {
    const variance = getVariance(entry);
    if (variance === 0) {
      match += 1;
    } else if (variance > 0) {
      surplus += 1;
    } else {
      defisit += 1;
    }
    impactRupiah += variance * (entry.unitPrice || 0);
  }

  return {
    totalScanned: entries.length,
    match,
    surplus,
    defisit,
    variance: surplus + defisit,
    impactRupiah,
  };
}

/**
 * Memformat nominal Rupiah dengan tanda +/- eksplisit dalam locale id-ID
 */
export function formatRupiah(n: number): string {
  const formatted = Math.abs(Math.round(n)).toLocaleString('id-ID');
  if (n > 0) {
    return `+Rp ${formatted}`;
  }
  if (n < 0) {
    return `-Rp ${formatted}`;
  }
  return 'Rp 0';
}
