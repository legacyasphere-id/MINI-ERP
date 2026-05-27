export const APP_NAME = 'InventoryOS';

export const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api';

// Derived from seed data — update if categories change
export const INVENTORY_CATEGORIES = [
  'Cables',
  'Electronics',
  'Office',
  'Peripherals',
  'Storage',
] as const;
