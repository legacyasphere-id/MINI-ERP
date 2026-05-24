export type StockStatus = 'ok' | 'low' | 'critical' | 'overstock';
export type MovementType = 'receive' | 'issue' | 'transfer' | 'adjust';
export type POStatus = 'draft' | 'sent' | 'confirmed' | 'partial' | 'received';
export type AlertSeverity = 'critical' | 'warning' | 'info';
export type AlertType = 'low_stock' | 'discrepancy' | 'overdue_po' | 'receiving_pending';

export interface StockItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  location: { zone: string; rack: string; bin: string };
  currentQty: number;
  minQty: number;
  maxQty: number;
  unit: string;
  status: StockStatus;
  lastMovement: string;
  supplierId: string;
}

export interface StockMovement {
  id: string;
  type: MovementType;
  skuId: string;
  qty: number;
  fromLocation: string | null;
  toLocation: string | null;
  operatorId: string;
  timestamp: string;
  referenceId: string;
  note: string | null;
}

export interface POItem {
  skuId: string;
  orderedQty: number;
  receivedQty: number;
  unitCost: number;
}

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  status: POStatus;
  items: POItem[];
  expectedDelivery: string;
  createdAt: string;
  totalValue: number;
}

export interface Alert {
  id: string;
  severity: AlertSeverity;
  type: AlertType;
  message: string;
  skuId: string | null;
  poId: string | null;
  timestamp: string;
  isAcknowledged: boolean;
  acknowledgedBy: string | null;
}

export interface Supplier {
  id: string;
  name: string;
  leadTimeDays: number;
  reliabilityScore: number;
  activeOrders: number;
  lastDelivery: string;
}
