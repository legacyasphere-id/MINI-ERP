import type { StockMovement } from '@/types/inventory.types';

export const MOVEMENTS: StockMovement[] = [
  {
    id: 'mov-001', type: 'receive', skuId: 'itm-008',
    qty: 47, fromLocation: null, toLocation: 'B-03-B1',
    operatorId: 'op-chen', timestamp: '2026-05-24T07:45:00Z',
    referenceId: 'PO-2026-041', note: 'Discrepancy: 3 units short — flagged',
  },
  {
    id: 'mov-002', type: 'issue', skuId: 'itm-001',
    qty: 2, fromLocation: 'A-01-B3', toLocation: null,
    operatorId: 'op-jones', timestamp: '2026-05-24T06:12:00Z',
    referenceId: 'REQ-1823', note: null,
  },
  {
    id: 'mov-003', type: 'issue', skuId: 'itm-002',
    qty: 4, fromLocation: 'A-02-A1', toLocation: null,
    operatorId: 'op-jones', timestamp: '2026-05-24T04:55:00Z',
    referenceId: 'REQ-1822', note: null,
  },
  {
    id: 'mov-004', type: 'transfer', skuId: 'itm-019',
    qty: 20, fromLocation: 'A-02-C2', toLocation: 'A-02-C3',
    operatorId: 'op-nguyen', timestamp: '2026-05-23T17:30:00Z',
    referenceId: 'TRF-0091', note: 'Zone reorganisation — rack C2 reserved for inbound',
  },
  {
    id: 'mov-005', type: 'receive', skuId: 'itm-012',
    qty: 30, fromLocation: null, toLocation: 'B-03-C3',
    operatorId: 'op-chen', timestamp: '2026-05-23T15:00:00Z',
    referenceId: 'PO-2026-039', note: null,
  },
  {
    id: 'mov-006', type: 'issue', skuId: 'itm-010',
    qty: 15, fromLocation: 'C-01-A1', toLocation: null,
    operatorId: 'op-silva', timestamp: '2026-05-23T13:45:00Z',
    referenceId: 'REQ-1821', note: null,
  },
  {
    id: 'mov-007', type: 'adjust', skuId: 'itm-005',
    qty: 10, fromLocation: 'B-03-A2', toLocation: null,
    operatorId: 'op-jones', timestamp: '2026-05-23T11:00:00Z',
    referenceId: 'ADJ-0044', note: 'Cycle count correction — physical count 210, system 200',
  },
  {
    id: 'mov-008', type: 'issue', skuId: 'itm-017',
    qty: 3, fromLocation: 'B-02-B4', toLocation: null,
    operatorId: 'op-nguyen', timestamp: '2026-05-23T09:20:00Z',
    referenceId: 'REQ-1820', note: null,
  },
  {
    id: 'mov-009', type: 'receive', skuId: 'itm-016',
    qty: 8, fromLocation: null, toLocation: 'A-04-B3',
    operatorId: 'op-chen', timestamp: '2026-05-22T14:30:00Z',
    referenceId: 'PO-2026-037', note: null,
  },
  {
    id: 'mov-010', type: 'issue', skuId: 'itm-003',
    qty: 5, fromLocation: 'B-01-C2', toLocation: null,
    operatorId: 'op-silva', timestamp: '2026-05-22T11:15:00Z',
    referenceId: 'REQ-1819', note: null,
  },
  {
    id: 'mov-011', type: 'receive', skuId: 'itm-018',
    qty: 50, fromLocation: null, toLocation: 'B-04-A1',
    operatorId: 'op-jones', timestamp: '2026-05-22T09:00:00Z',
    referenceId: 'PO-2026-035', note: null,
  },
  {
    id: 'mov-012', type: 'transfer', skuId: 'itm-006',
    qty: 3, fromLocation: 'A-04-A2', toLocation: 'A-04-A1',
    operatorId: 'op-nguyen', timestamp: '2026-05-21T16:00:00Z',
    referenceId: 'TRF-0090', note: null,
  },
  {
    id: 'mov-013', type: 'adjust', skuId: 'itm-014',
    qty: -1, fromLocation: 'A-03-A4', toLocation: null,
    operatorId: 'op-silva', timestamp: '2026-05-21T14:45:00Z',
    referenceId: 'ADJ-0043', note: 'Damaged unit written off',
  },
  {
    id: 'mov-014', type: 'issue', skuId: 'itm-009',
    qty: 4, fromLocation: 'B-02-A3', toLocation: null,
    operatorId: 'op-chen', timestamp: '2026-05-21T10:30:00Z',
    referenceId: 'REQ-1818', note: null,
  },
  {
    id: 'mov-015', type: 'receive', skuId: 'itm-020',
    qty: 20, fromLocation: null, toLocation: 'C-03-A3',
    operatorId: 'op-jones', timestamp: '2026-05-20T16:30:00Z',
    referenceId: 'PO-2026-033', note: null,
  },
];
