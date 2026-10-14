/**
 * src/data/mockOpname.ts
 * Data mock realistis untuk sesi Stock Opname Massal
 */

import { OpnameEntry } from '@/types/opname';

export const mockOpnameEntries: OpnameEntry[] = [
  {
    itemId: 'opname-item-1',
    code: 'WH-FL8921',
    name: 'Pallet Kayu Standar 120x100',
    location: 'Aisle B - Bay 04',
    systemQty: 120,
    physicalQty: 120,
    unitPrice: 85000,
  },
  {
    itemId: 'opname-item-2',
    code: 'WH-BX4012',
    name: 'Kardus Double Wall Corrugated M',
    location: 'Aisle A - Bay 02',
    systemQty: 450,
    physicalQty: 462,
    unitPrice: 7500,
  },
  {
    itemId: 'opname-item-3',
    code: 'WH-ST9043',
    name: 'Stretch Film 50cm x 300m',
    location: 'Aisle C - Bay 08',
    systemQty: 80,
    physicalQty: 74,
    unitPrice: 65000,
  },
  {
    itemId: 'opname-item-4',
    code: 'WH-HL2311',
    name: 'Safety Helmet V-Gard Kuning',
    location: 'Aisle D - Bay 01',
    systemQty: 35,
    physicalQty: 35,
    unitPrice: 110000,
  },
  {
    itemId: 'opname-item-5',
    code: 'WH-GL6742',
    name: 'Sarung Tangan Nitrile Grip (Pack)',
    location: 'Aisle D - Bay 03',
    systemQty: 200,
    physicalQty: 215,
    unitPrice: 42000,
  },
  {
    itemId: 'opname-item-6',
    code: 'WH-BS1109',
    name: 'Barcode Scanner Handheld 2D',
    location: 'Rack E - Shelf 01',
    systemQty: 14,
    physicalQty: 12,
    unitPrice: 1250000,
  },
  {
    itemId: 'opname-item-7',
    code: 'WH-TP5580',
    name: 'Lakban Bening Heavy Duty 2 Inch',
    location: 'Aisle B - Bay 09',
    systemQty: 310,
    physicalQty: 310,
    unitPrice: 16500,
  },
  {
    itemId: 'opname-item-8',
    code: 'WH-SL7819',
    name: 'Sepatu Safety Boots Steel Toe (42)',
    location: 'Rack E - Shelf 04',
    systemQty: 25,
    physicalQty: 22,
    unitPrice: 380000,
  },
];
