import type { PurchaseOrder } from '@/types/inventory.types';

export const PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    id: 'po-001', supplierId: 'sup-001', status: 'confirmed',
    items: [
      { skuId: 'itm-001', orderedQty: 50, receivedQty: 0, unitCost: 89.99 },
      { skuId: 'itm-002', orderedQty: 30, receivedQty: 0, unitCost: 124.50 },
    ],
    expectedDelivery: '2026-05-27T12:00:00Z',
    createdAt: '2026-05-22T10:00:00Z',
    totalValue: 8220.00,
  },
  {
    id: 'po-002', supplierId: 'sup-002', status: 'sent',
    items: [
      { skuId: 'itm-003', orderedQty: 40, receivedQty: 0, unitCost: 68.00 },
      { skuId: 'itm-017', orderedQty: 20, receivedQty: 0, unitCost: 95.00 },
      { skuId: 'itm-009', orderedQty: 15, receivedQty: 0, unitCost: 149.00 },
    ],
    expectedDelivery: '2026-05-30T12:00:00Z',
    createdAt: '2026-05-23T09:30:00Z',
    totalValue: 7035.00,
  },
  {
    id: 'po-003', supplierId: 'sup-003', status: 'sent',
    items: [
      { skuId: 'itm-008', orderedQty: 80, receivedQty: 0, unitCost: 12.50 },
    ],
    expectedDelivery: '2026-05-21T12:00:00Z',
    createdAt: '2026-05-14T14:00:00Z',
    totalValue: 1000.00,
  },
  {
    id: 'po-004', supplierId: 'sup-001', status: 'partial',
    items: [
      { skuId: 'itm-006', orderedQty: 20, receivedQty: 12, unitCost: 399.00 },
      { skuId: 'itm-011', orderedQty: 10, receivedQty: 10, unitCost: 189.00 },
    ],
    expectedDelivery: '2026-05-24T12:00:00Z',
    createdAt: '2026-05-17T08:00:00Z',
    totalValue: 6870.00,
  },
  {
    id: 'po-005', supplierId: 'sup-003', status: 'partial',
    items: [
      { skuId: 'itm-008', orderedQty: 50, receivedQty: 47, unitCost: 12.50 },
      { skuId: 'itm-012', orderedQty: 30, receivedQty: 30, unitCost: 14.00 },
    ],
    expectedDelivery: '2026-05-23T10:00:00Z',
    createdAt: '2026-05-19T11:00:00Z',
    totalValue: 1045.00,
  },
  {
    id: 'po-006', supplierId: 'sup-004', status: 'confirmed',
    items: [
      { skuId: 'itm-019', orderedQty: 60, receivedQty: 0, unitCost: 9.99 },
      { skuId: 'itm-007', orderedQty: 15, receivedQty: 0, unitCost: 179.00 },
    ],
    expectedDelivery: '2026-05-24T14:00:00Z',
    createdAt: '2026-05-21T13:00:00Z',
    totalValue: 3284.40,
  },
  {
    id: 'po-007', supplierId: 'sup-001', status: 'confirmed',
    items: [
      { skuId: 'itm-016', orderedQty: 12, receivedQty: 0, unitCost: 219.00 },
      { skuId: 'itm-004', orderedQty: 25, receivedQty: 0, unitCost: 54.00 },
      { skuId: 'itm-013', orderedQty: 10, receivedQty: 0, unitCost: 79.00 },
    ],
    expectedDelivery: '2026-05-24T10:00:00Z',
    createdAt: '2026-05-20T09:00:00Z',
    totalValue: 4798.00,
  },
];
