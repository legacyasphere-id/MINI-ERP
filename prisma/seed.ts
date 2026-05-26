/**
 * Seed script: upserts STOCK_ITEMS and PURCHASE_ORDERS mock data into the DB.
 * Run with: DATABASE_URL=... tsx prisma/seed.ts
 */
import 'dotenv/config';
import path from 'path';
import { config } from 'dotenv';
import { PrismaClient, ProductStatus, POStatus } from '@prisma/client';
import bcrypt from 'bcrypt';

config({ path: path.resolve(__dirname, '../backend/.env') });

const prisma = new PrismaClient();

const STOCK_ITEMS = [
  { id: 'itm-001', sku: 'ELEC-SSD-001',  name: '2TB NVMe SSD',                  category: 'Storage',     zone: 'A', rack: '01', bin: 'B3', currentQty: 4,   minQty: 10,  maxQty: 100, unit: 'pcs',  costPrice: 150.00 },
  { id: 'itm-002', sku: 'ELEC-RAM-001',  name: 'DDR5 32GB Module',               category: 'Electronics', zone: 'A', rack: '02', bin: 'A1', currentQty: 6,   minQty: 15,  maxQty: 120, unit: 'pcs',  costPrice: 120.00 },
  { id: 'itm-003', sku: 'PRPH-KBD-001',  name: 'Mechanical Keyboard TKL',        category: 'Peripherals', zone: 'B', rack: '01', bin: 'C2', currentQty: 18,  minQty: 20,  maxQty: 80,  unit: 'pcs',  costPrice:  80.00 },
  { id: 'itm-004', sku: 'PRPH-MOU-001',  name: 'Wireless Ergonomic Mouse',       category: 'Peripherals', zone: 'B', rack: '01', bin: 'C4', currentQty: 22,  minQty: 20,  maxQty: 100, unit: 'pcs',  costPrice:  60.00 },
  { id: 'itm-005', sku: 'CABL-USB-001',  name: 'USB-C Cable 2m',                 category: 'Cables',      zone: 'B', rack: '03', bin: 'A2', currentQty: 210, minQty: 50,  maxQty: 200, unit: 'pcs',  costPrice:   8.00 },
  { id: 'itm-006', sku: 'ELEC-MON-001',  name: '27" 4K IPS Monitor',             category: 'Electronics', zone: 'A', rack: '04', bin: 'A1', currentQty: 11,  minQty: 5,   maxQty: 40,  unit: 'pcs',  costPrice: 320.00 },
  { id: 'itm-007', sku: 'STRG-HDD-001',  name: '8TB HDD Enterprise',             category: 'Storage',     zone: 'A', rack: '01', bin: 'C1', currentQty: 19,  minQty: 8,   maxQty: 60,  unit: 'pcs',  costPrice:  95.00 },
  { id: 'itm-008', sku: 'CABL-ETH-001',  name: 'Cat6A Ethernet 5m',              category: 'Cables',      zone: 'B', rack: '03', bin: 'B1', currentQty: 87,  minQty: 30,  maxQty: 150, unit: 'pcs',  costPrice:  12.00 },
  { id: 'itm-009', sku: 'PRPH-CAM-001',  name: 'Webcam 4K 60fps',               category: 'Peripherals', zone: 'B', rack: '02', bin: 'A3', currentQty: 9,   minQty: 10,  maxQty: 50,  unit: 'pcs',  costPrice: 110.00 },
  { id: 'itm-010', sku: 'OFFC-PPR-001',  name: 'A4 Copy Paper 80gsm (Ream)',     category: 'Office',      zone: 'C', rack: '01', bin: 'A1', currentQty: 340, minQty: 100, maxQty: 500, unit: 'ream', costPrice:   8.00 },
  { id: 'itm-011', sku: 'ELEC-UPS-001',  name: 'UPS 1500VA Tower',               category: 'Electronics', zone: 'A', rack: '05', bin: 'B2', currentQty: 3,   minQty: 4,   maxQty: 20,  unit: 'pcs',  costPrice: 210.00 },
  { id: 'itm-012', sku: 'CABL-HDMI-001', name: 'HDMI 2.1 Cable 3m',             category: 'Cables',      zone: 'B', rack: '03', bin: 'C3', currentQty: 55,  minQty: 20,  maxQty: 100, unit: 'pcs',  costPrice:  15.00 },
  { id: 'itm-013', sku: 'PRPH-SPK-001',  name: 'USB Desk Speaker Pair',          category: 'Peripherals', zone: 'B', rack: '02', bin: 'C1', currentQty: 28,  minQty: 10,  maxQty: 60,  unit: 'pcs',  costPrice:  55.00 },
  { id: 'itm-014', sku: 'STRG-SSD-001',  name: 'SATA SSD 1TB',                   category: 'Storage',     zone: 'A', rack: '03', bin: 'A4', currentQty: 32,  minQty: 15,  maxQty: 80,  unit: 'pcs',  costPrice:  75.00 },
  { id: 'itm-015', sku: 'OFFC-INK-001',  name: 'Printer Ink Cartridge Set',      category: 'Office',      zone: 'C', rack: '02', bin: 'B2', currentQty: 12,  minQty: 15,  maxQty: 60,  unit: 'set',  costPrice:  35.00 },
  { id: 'itm-016', sku: 'ELEC-RPI-001',  name: 'Raspberry Pi 5 4GB',             category: 'Electronics', zone: 'A', rack: '02', bin: 'C3', currentQty: 45,  minQty: 10,  maxQty: 100, unit: 'pcs',  costPrice:  80.00 },
  { id: 'itm-017', sku: 'PRPH-HUB-001',  name: 'USB-C 10-Port Hub',              category: 'Peripherals', zone: 'B', rack: '04', bin: 'A1', currentQty: 34,  minQty: 10,  maxQty: 80,  unit: 'pcs',  costPrice:  45.00 },
  { id: 'itm-018', sku: 'CABL-PWR-001',  name: 'IEC C13 Power Cable 3m',         category: 'Cables',      zone: 'B', rack: '03', bin: 'D1', currentQty: 120, minQty: 40,  maxQty: 200, unit: 'pcs',  costPrice:  10.00 },
  { id: 'itm-019', sku: 'OFFC-DSK-001',  name: 'Standing Desk Converter',        category: 'Office',      zone: 'C', rack: '03', bin: 'A1', currentQty: 7,   minQty: 3,   maxQty: 20,  unit: 'pcs',  costPrice: 185.00 },
  { id: 'itm-020', sku: 'ELEC-SWT-001',  name: '24-Port Managed Network Switch', category: 'Electronics', zone: 'A', rack: '06', bin: 'A1', currentQty: 8,   minQty: 2,   maxQty: 15,  unit: 'pcs',  costPrice: 380.00 },
];

async function main() {
  console.log('Seeding categories…');
  const categoryNames = [...new Set(STOCK_ITEMS.map((i) => i.category))];
  const categories = await Promise.all(
    categoryNames.map((name) =>
      prisma.category.upsert({ where: { name }, update: {}, create: { name } })
    )
  );
  const catMap = Object.fromEntries(categories.map((c) => [c.name, c.id]));

  console.log('Seeding products…');
  for (const item of STOCK_ITEMS) {
    await prisma.product.upsert({
      where:  { id: item.id },
      update: {
        // Never overwrite currentQty on re-seed — movements own that value
        sku: item.sku, name: item.name, costPrice: item.costPrice,
        minQty: item.minQty, maxQty: item.maxQty,
        unit: item.unit, locationZone: item.zone, locationRack: item.rack,
        locationBin: item.bin, categoryId: catMap[item.category],
      },
      create: {
        id: item.id, sku: item.sku, name: item.name,
        costPrice: item.costPrice, sellPrice: 0,
        currentQty: item.currentQty, minQty: item.minQty, maxQty: item.maxQty,
        unit: item.unit, locationZone: item.zone, locationRack: item.rack,
        locationBin: item.bin, status: ProductStatus.ACTIVE,
        categoryId: catMap[item.category],
      },
    });
  }

  const totalValue = STOCK_ITEMS.reduce((s, i) => s + i.currentQty * i.costPrice, 0);
  console.log(`✓ Seeded ${STOCK_ITEMS.length} products. Estimated stock value: $${totalValue.toLocaleString()}`);

  // ── Purchase Orders ──────────────────────────────────────────────────────────
  console.log('Seeding purchase orders…');

  // Build SKU → productId lookup
  const products = await prisma.product.findMany({ select: { id: true, sku: true } });
  const skuMap = Object.fromEntries(products.map((p) => [p.sku, p.id]));

  type POSeed = {
    id: string;
    supplierName: string;
    status: POStatus;
    expectedDelivery: string;
    createdAt: string;
    lines: { id: string; sku: string; orderedQty: number; receivedQty: number; unitCost: number }[];
  };

  const PO_SEEDS: POSeed[] = [
    // Confirmed — receivable
    {
      id: 'po-seed-001', supplierName: 'TechVault Distributors', status: 'confirmed',
      expectedDelivery: '2026-05-29T12:00:00Z', createdAt: '2026-05-22T10:00:00Z',
      lines: [
        { id: 'pol-001-1', sku: 'ELEC-SSD-001', orderedQty: 50, receivedQty: 0, unitCost: 145.00 },
        { id: 'pol-001-2', sku: 'ELEC-RAM-001', orderedQty: 30, receivedQty: 0, unitCost: 118.00 },
      ],
    },
    {
      id: 'po-seed-002', supplierName: 'Peripheral Plus', status: 'confirmed',
      expectedDelivery: '2026-06-02T12:00:00Z', createdAt: '2026-05-23T09:30:00Z',
      lines: [
        { id: 'pol-002-1', sku: 'PRPH-KBD-001', orderedQty: 40, receivedQty: 0, unitCost: 76.00 },
        { id: 'pol-002-2', sku: 'PRPH-HUB-001', orderedQty: 20, receivedQty: 0, unitCost: 42.00 },
        { id: 'pol-002-3', sku: 'PRPH-CAM-001', orderedQty: 15, receivedQty: 0, unitCost: 105.00 },
      ],
    },
    {
      id: 'po-seed-003', supplierName: 'CableKing Supply', status: 'confirmed',
      expectedDelivery: '2026-05-28T12:00:00Z', createdAt: '2026-05-21T14:00:00Z',
      lines: [
        { id: 'pol-003-1', sku: 'CABL-ETH-001', orderedQty: 80, receivedQty: 0, unitCost: 11.50 },
        { id: 'pol-003-2', sku: 'CABL-HDMI-001', orderedQty: 50, receivedQty: 0, unitCost: 13.50 },
      ],
    },
    // Partial — some lines received
    {
      id: 'po-seed-004', supplierName: 'TechVault Distributors', status: 'partial',
      expectedDelivery: '2026-05-26T12:00:00Z', createdAt: '2026-05-17T08:00:00Z',
      lines: [
        { id: 'pol-004-1', sku: 'ELEC-MON-001', orderedQty: 20, receivedQty: 12, unitCost: 310.00 },
        { id: 'pol-004-2', sku: 'ELEC-UPS-001', orderedQty: 10, receivedQty: 10, unitCost: 200.00 },
      ],
    },
    {
      id: 'po-seed-005', supplierName: 'CableKing Supply', status: 'partial',
      expectedDelivery: '2026-05-25T10:00:00Z', createdAt: '2026-05-19T11:00:00Z',
      lines: [
        { id: 'pol-005-1', sku: 'CABL-USB-001', orderedQty: 100, receivedQty: 95, unitCost: 7.50 },
        { id: 'pol-005-2', sku: 'CABL-PWR-001', orderedQty: 60, receivedQty: 60, unitCost: 9.50 },
      ],
    },
    // Received — completed
    {
      id: 'po-seed-006', supplierName: 'Office Direct', status: 'received',
      expectedDelivery: '2026-05-10T12:00:00Z', createdAt: '2026-05-05T13:00:00Z',
      lines: [
        { id: 'pol-006-1', sku: 'OFFC-PPR-001', orderedQty: 200, receivedQty: 200, unitCost: 7.80 },
        { id: 'pol-006-2', sku: 'OFFC-INK-001', orderedQty: 30, receivedQty: 30, unitCost: 33.00 },
      ],
    },
    {
      id: 'po-seed-007', supplierName: 'Peripheral Plus', status: 'received',
      expectedDelivery: '2026-05-08T10:00:00Z', createdAt: '2026-05-01T09:00:00Z',
      lines: [
        { id: 'pol-007-1', sku: 'PRPH-MOU-001', orderedQty: 25, receivedQty: 25, unitCost: 57.00 },
        { id: 'pol-007-2', sku: 'PRPH-SPK-001', orderedQty: 15, receivedQty: 15, unitCost: 52.00 },
      ],
    },
    {
      id: 'po-seed-008', supplierName: 'NetCore Solutions', status: 'received',
      expectedDelivery: '2026-04-28T12:00:00Z', createdAt: '2026-04-20T11:00:00Z',
      lines: [
        { id: 'pol-008-1', sku: 'ELEC-SWT-001', orderedQty: 5, receivedQty: 5, unitCost: 365.00 },
        { id: 'pol-008-2', sku: 'ELEC-RPI-001', orderedQty: 20, receivedQty: 20, unitCost: 77.00 },
      ],
    },
    // Draft — not yet sent
    {
      id: 'po-seed-009', supplierName: 'TechVault Distributors', status: 'draft',
      expectedDelivery: '2026-06-10T12:00:00Z', createdAt: '2026-05-25T16:00:00Z',
      lines: [
        { id: 'pol-009-1', sku: 'STRG-SSD-001', orderedQty: 40, receivedQty: 0, unitCost: 72.00 },
        { id: 'pol-009-2', sku: 'STRG-HDD-001', orderedQty: 20, receivedQty: 0, unitCost: 90.00 },
      ],
    },
    {
      id: 'po-seed-010', supplierName: 'Office Direct', status: 'draft',
      expectedDelivery: '2026-06-15T12:00:00Z', createdAt: '2026-05-25T14:00:00Z',
      lines: [
        { id: 'pol-010-1', sku: 'OFFC-DSK-001', orderedQty: 10, receivedQty: 0, unitCost: 178.00 },
        { id: 'pol-010-2', sku: 'OFFC-PPR-001', orderedQty: 150, receivedQty: 0, unitCost: 7.80 },
      ],
    },
  ];

  for (const po of PO_SEEDS) {
    await prisma.purchaseOrder.upsert({
      where:  { id: po.id },
      update: { supplierName: po.supplierName, status: po.status, expectedDelivery: new Date(po.expectedDelivery) },
      create: {
        id: po.id, supplierName: po.supplierName, status: po.status,
        expectedDelivery: new Date(po.expectedDelivery),
        createdAt: new Date(po.createdAt),
      },
    });

    for (const line of po.lines) {
      const productId = skuMap[line.sku] ?? null;
      await prisma.pOLine.upsert({
        where:  { id: line.id },
        update: { orderedQty: line.orderedQty, receivedQty: line.receivedQty, unitCost: line.unitCost, productId },
        create: {
          id: line.id, poId: po.id, sku: line.sku,
          productId, orderedQty: line.orderedQty,
          receivedQty: line.receivedQty, unitCost: line.unitCost,
        },
      });
    }
  }

  console.log(`✓ Seeded ${PO_SEEDS.length} purchase orders.`);

  // ── Demo User ────────────────────────────────────────────────────────────────
  console.log('Seeding demo user…');
  const passwordHash = await bcrypt.hash('password123', 10);
  await prisma.user.upsert({
    where:  { email: 'admin@inventoryos.com' },
    update: {},
    create: { email: 'admin@inventoryos.com', passwordHash, name: 'Admin User', role: 'ADMIN' },
  });
  console.log('✓ Demo user: admin@inventoryos.com / password123');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
