import type { StockItem } from '@/types/inventory.types';

export const STOCK_ITEMS: StockItem[] = [
  {
    id: 'itm-001', sku: 'ELEC-SSD-001', name: '2TB NVMe SSD',
    category: 'Storage', location: { zone: 'A', rack: '01', bin: 'B3' },
    currentQty: 4, minQty: 10, maxQty: 100, unit: 'pcs',
    status: 'critical', lastMovement: '2026-05-24T06:12:00Z', supplierId: 'sup-001',
  },
  {
    id: 'itm-002', sku: 'ELEC-RAM-001', name: 'DDR5 32GB Module',
    category: 'Electronics', location: { zone: 'A', rack: '02', bin: 'A1' },
    currentQty: 6, minQty: 15, maxQty: 120, unit: 'pcs',
    status: 'critical', lastMovement: '2026-05-24T04:55:00Z', supplierId: 'sup-001',
  },
  {
    id: 'itm-003', sku: 'PRPH-KBD-001', name: 'Mechanical Keyboard TKL',
    category: 'Peripherals', location: { zone: 'B', rack: '01', bin: 'C2' },
    currentQty: 18, minQty: 20, maxQty: 80, unit: 'pcs',
    status: 'low', lastMovement: '2026-05-23T15:40:00Z', supplierId: 'sup-002',
  },
  {
    id: 'itm-004', sku: 'PRPH-MOU-001', name: 'Wireless Ergonomic Mouse',
    category: 'Peripherals', location: { zone: 'B', rack: '01', bin: 'C4' },
    currentQty: 22, minQty: 20, maxQty: 100, unit: 'pcs',
    status: 'ok', lastMovement: '2026-05-23T11:20:00Z', supplierId: 'sup-002',
  },
  {
    id: 'itm-005', sku: 'CABL-USB-001', name: 'USB-C Cable 2m',
    category: 'Cables', location: { zone: 'B', rack: '03', bin: 'A2' },
    currentQty: 210, minQty: 50, maxQty: 200, unit: 'pcs',
    status: 'overstock', lastMovement: '2026-05-22T09:00:00Z', supplierId: 'sup-003',
  },
  {
    id: 'itm-006', sku: 'ELEC-MON-001', name: '27" 4K IPS Monitor',
    category: 'Electronics', location: { zone: 'A', rack: '04', bin: 'A1' },
    currentQty: 11, minQty: 5, maxQty: 40, unit: 'pcs',
    status: 'ok', lastMovement: '2026-05-21T14:30:00Z', supplierId: 'sup-001',
  },
  {
    id: 'itm-007', sku: 'STRG-HDD-001', name: '8TB HDD Enterprise',
    category: 'Storage', location: { zone: 'A', rack: '01', bin: 'C1' },
    currentQty: 19, minQty: 8, maxQty: 60, unit: 'pcs',
    status: 'low', lastMovement: '2026-05-24T07:05:00Z', supplierId: 'sup-004',
  },
  {
    id: 'itm-008', sku: 'CABL-ETH-001', name: 'Cat6A Ethernet 5m',
    category: 'Cables', location: { zone: 'B', rack: '03', bin: 'B1' },
    currentQty: 87, minQty: 30, maxQty: 150, unit: 'pcs',
    status: 'ok', lastMovement: '2026-05-20T10:15:00Z', supplierId: 'sup-003',
  },
  {
    id: 'itm-009', sku: 'PRPH-CAM-001', name: 'Webcam 4K 60fps',
    category: 'Peripherals', location: { zone: 'B', rack: '02', bin: 'A3' },
    currentQty: 9, minQty: 10, maxQty: 50, unit: 'pcs',
    status: 'low', lastMovement: '2026-05-23T16:00:00Z', supplierId: 'sup-002',
  },
  {
    id: 'itm-010', sku: 'OFFC-PPR-001', name: 'A4 Copy Paper 80gsm (Ream)',
    category: 'Office', location: { zone: 'C', rack: '01', bin: 'A1' },
    currentQty: 340, minQty: 100, maxQty: 500, unit: 'ream',
    status: 'ok', lastMovement: '2026-05-19T08:30:00Z', supplierId: 'sup-005',
  },
  {
    id: 'itm-011', sku: 'ELEC-UPS-001', name: 'UPS 1500VA Tower',
    category: 'Electronics', location: { zone: 'A', rack: '05', bin: 'B2' },
    currentQty: 3, minQty: 4, maxQty: 20, unit: 'pcs',
    status: 'critical', lastMovement: '2026-05-18T13:45:00Z', supplierId: 'sup-001',
  },
  {
    id: 'itm-012', sku: 'CABL-HDMI-001', name: 'HDMI 2.1 Cable 3m',
    category: 'Cables', location: { zone: 'B', rack: '03', bin: 'C3' },
    currentQty: 55, minQty: 20, maxQty: 100, unit: 'pcs',
    status: 'ok', lastMovement: '2026-05-22T11:00:00Z', supplierId: 'sup-003',
  },
  {
    id: 'itm-013', sku: 'PRPH-SPK-001', name: 'USB Desk Speaker Pair',
    category: 'Peripherals', location: { zone: 'B', rack: '02', bin: 'C1' },
    currentQty: 28, minQty: 10, maxQty: 60, unit: 'pcs',
    status: 'ok', lastMovement: '2026-05-20T09:20:00Z', supplierId: 'sup-002',
  },
  {
    id: 'itm-014', sku: 'STRG-NAS-001', name: 'NAS 4-Bay Enclosure',
    category: 'Storage', location: { zone: 'A', rack: '03', bin: 'A4' },
    currentQty: 7, minQty: 5, maxQty: 25, unit: 'pcs',
    status: 'ok', lastMovement: '2026-05-17T15:10:00Z', supplierId: 'sup-004',
  },
  {
    id: 'itm-015', sku: 'OFFC-INK-001', name: 'Printer Ink Set CMYK',
    category: 'Office', location: { zone: 'C', rack: '02', bin: 'B2' },
    currentQty: 12, minQty: 15, maxQty: 80, unit: 'set',
    status: 'low', lastMovement: '2026-05-23T12:35:00Z', supplierId: 'sup-005',
  },
  {
    id: 'itm-016', sku: 'ELEC-DKST-001', name: 'USB-C Docking Station',
    category: 'Electronics', location: { zone: 'A', rack: '04', bin: 'B3' },
    currentQty: 14, minQty: 10, maxQty: 50, unit: 'pcs',
    status: 'ok', lastMovement: '2026-05-21T10:00:00Z', supplierId: 'sup-001',
  },
  {
    id: 'itm-017', sku: 'PRPH-HSET-001', name: 'Noise-Cancel Headset',
    category: 'Peripherals', location: { zone: 'B', rack: '02', bin: 'B4' },
    currentQty: 5, minQty: 8, maxQty: 40, unit: 'pcs',
    status: 'critical', lastMovement: '2026-05-24T05:30:00Z', supplierId: 'sup-002',
  },
  {
    id: 'itm-018', sku: 'CABL-PWR-001', name: 'IEC Power Cable 1.8m',
    category: 'Cables', location: { zone: 'B', rack: '04', bin: 'A1' },
    currentQty: 130, minQty: 40, maxQty: 200, unit: 'pcs',
    status: 'ok', lastMovement: '2026-05-19T14:50:00Z', supplierId: 'sup-003',
  },
  {
    id: 'itm-019', sku: 'STRG-USB-001', name: 'USB Flash 128GB',
    category: 'Storage', location: { zone: 'A', rack: '02', bin: 'C2' },
    currentQty: 63, minQty: 20, maxQty: 150, unit: 'pcs',
    status: 'ok', lastMovement: '2026-05-22T08:00:00Z', supplierId: 'sup-004',
  },
  {
    id: 'itm-020', sku: 'OFFC-CHRG-001', name: 'Wireless Charger Pad',
    category: 'Office', location: { zone: 'C', rack: '03', bin: 'A3' },
    currentQty: 41, minQty: 15, maxQty: 60, unit: 'pcs',
    status: 'ok', lastMovement: '2026-05-20T16:30:00Z', supplierId: 'sup-005',
  },
];
