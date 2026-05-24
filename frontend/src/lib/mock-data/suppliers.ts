import type { Supplier } from '@/types/inventory.types';

export const SUPPLIERS: Supplier[] = [
  {
    id: 'sup-001',
    name: 'TechBridge Supply Co.',
    leadTimeDays: 5,
    reliabilityScore: 94,
    activeOrders: 3,
    lastDelivery: '2026-05-20T09:30:00Z',
  },
  {
    id: 'sup-002',
    name: 'Nexus Components Ltd.',
    leadTimeDays: 8,
    reliabilityScore: 87,
    activeOrders: 1,
    lastDelivery: '2026-05-18T14:00:00Z',
  },
  {
    id: 'sup-003',
    name: 'DataLink International',
    leadTimeDays: 12,
    reliabilityScore: 78,
    activeOrders: 2,
    lastDelivery: '2026-05-15T11:20:00Z',
  },
  {
    id: 'sup-004',
    name: 'StorePro Logistics',
    leadTimeDays: 3,
    reliabilityScore: 96,
    activeOrders: 0,
    lastDelivery: '2026-05-22T08:45:00Z',
  },
  {
    id: 'sup-005',
    name: 'OfficeLink Direct',
    leadTimeDays: 4,
    reliabilityScore: 91,
    activeOrders: 1,
    lastDelivery: '2026-05-21T16:10:00Z',
  },
];
