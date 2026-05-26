export const APP_NAME = 'InventoryOS';
export const APP_VERSION = '0.1.0';

export const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api';

export const PAGINATION_DEFAULTS = {
  page: 1,
  limit: 20,
} as const;

export const LOW_STOCK_THRESHOLD = 10;

// Derived from seed data — update if categories change
export const INVENTORY_CATEGORIES = [
  'Cables',
  'Electronics',
  'Office',
  'Peripherals',
  'Storage',
] as const;
