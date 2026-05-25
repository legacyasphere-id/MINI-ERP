/**
 * Seed script: upserts STOCK_ITEMS mock data into the products table.
 * Run with: DATABASE_URL=... tsx prisma/seed.ts
 */
import 'dotenv/config';
import path from 'path';
import { config } from 'dotenv';
import { PrismaClient, ProductStatus } from '@prisma/client';

config({ path: path.resolve(__dirname, '../backend/.env') });

const prisma = new PrismaClient();

const STOCK_ITEMS = [
  { id: 'itm-001', sku: 'ELEC-SSD-001', name: '2TB NVMe SSD',                  category: 'Storage',     zone: 'A', rack: '01', bin: 'B3', currentQty: 4,   minQty: 10,  maxQty: 100, unit: 'pcs' },
  { id: 'itm-002', sku: 'ELEC-RAM-001', name: 'DDR5 32GB Module',               category: 'Electronics', zone: 'A', rack: '02', bin: 'A1', currentQty: 6,   minQty: 15,  maxQty: 120, unit: 'pcs' },
  { id: 'itm-003', sku: 'PRPH-KBD-001', name: 'Mechanical Keyboard TKL',        category: 'Peripherals', zone: 'B', rack: '01', bin: 'C2', currentQty: 18,  minQty: 20,  maxQty: 80,  unit: 'pcs' },
  { id: 'itm-004', sku: 'PRPH-MOU-001', name: 'Wireless Ergonomic Mouse',       category: 'Peripherals', zone: 'B', rack: '01', bin: 'C4', currentQty: 22,  minQty: 20,  maxQty: 100, unit: 'pcs' },
  { id: 'itm-005', sku: 'CABL-USB-001', name: 'USB-C Cable 2m',                 category: 'Cables',      zone: 'B', rack: '03', bin: 'A2', currentQty: 210, minQty: 50,  maxQty: 200, unit: 'pcs' },
  { id: 'itm-006', sku: 'ELEC-MON-001', name: '27" 4K IPS Monitor',             category: 'Electronics', zone: 'A', rack: '04', bin: 'A1', currentQty: 11,  minQty: 5,   maxQty: 40,  unit: 'pcs' },
  { id: 'itm-007', sku: 'STRG-HDD-001', name: '8TB HDD Enterprise',             category: 'Storage',     zone: 'A', rack: '01', bin: 'C1', currentQty: 19,  minQty: 8,   maxQty: 60,  unit: 'pcs' },
  { id: 'itm-008', sku: 'CABL-ETH-001', name: 'Cat6A Ethernet 5m',              category: 'Cables',      zone: 'B', rack: '03', bin: 'B1', currentQty: 87,  minQty: 30,  maxQty: 150, unit: 'pcs' },
  { id: 'itm-009', sku: 'PRPH-CAM-001', name: 'Webcam 4K 60fps',               category: 'Peripherals', zone: 'B', rack: '02', bin: 'A3', currentQty: 9,   minQty: 10,  maxQty: 50,  unit: 'pcs' },
  { id: 'itm-010', sku: 'OFFC-PPR-001', name: 'A4 Copy Paper 80gsm (Ream)',     category: 'Office',      zone: 'C', rack: '01', bin: 'A1', currentQty: 340, minQty: 100, maxQty: 500, unit: 'ream' },
  { id: 'itm-011', sku: 'ELEC-UPS-001', name: 'UPS 1500VA Tower',               category: 'Electronics', zone: 'A', rack: '05', bin: 'B2', currentQty: 3,   minQty: 4,   maxQty: 20,  unit: 'pcs' },
  { id: 'itm-012', sku: 'CABL-HDMI-001',name: 'HDMI 2.1 Cable 3m',             category: 'Cables',      zone: 'B', rack: '03', bin: 'C3', currentQty: 55,  minQty: 20,  maxQty: 100, unit: 'pcs' },
  { id: 'itm-013', sku: 'PRPH-SPK-001', name: 'USB Desk Speaker Pair',          category: 'Peripherals', zone: 'B', rack: '02', bin: 'C1', currentQty: 28,  minQty: 10,  maxQty: 60,  unit: 'pcs' },
  { id: 'itm-014', sku: 'STRG-SSD-001', name: 'SATA SSD 1TB',                   category: 'Storage',     zone: 'A', rack: '03', bin: 'A4', currentQty: 32,  minQty: 15,  maxQty: 80,  unit: 'pcs' },
  { id: 'itm-015', sku: 'OFFC-INK-001', name: 'Printer Ink Cartridge Set',      category: 'Office',      zone: 'C', rack: '02', bin: 'B2', currentQty: 12,  minQty: 15,  maxQty: 60,  unit: 'set' },
  { id: 'itm-016', sku: 'ELEC-RPI-001', name: 'Raspberry Pi 5 4GB',             category: 'Electronics', zone: 'A', rack: '02', bin: 'C3', currentQty: 45,  minQty: 10,  maxQty: 100, unit: 'pcs' },
  { id: 'itm-017', sku: 'PRPH-HUB-001', name: 'USB-C 10-Port Hub',              category: 'Peripherals', zone: 'B', rack: '04', bin: 'A1', currentQty: 34,  minQty: 10,  maxQty: 80,  unit: 'pcs' },
  { id: 'itm-018', sku: 'CABL-PWR-001', name: 'IEC C13 Power Cable 3m',         category: 'Cables',      zone: 'B', rack: '03', bin: 'D1', currentQty: 120, minQty: 40,  maxQty: 200, unit: 'pcs' },
  { id: 'itm-019', sku: 'OFFC-DSK-001', name: 'Standing Desk Converter',        category: 'Office',      zone: 'C', rack: '03', bin: 'A1', currentQty: 7,   minQty: 3,   maxQty: 20,  unit: 'pcs' },
  { id: 'itm-020', sku: 'ELEC-SWT-001', name: '24-Port Managed Network Switch', category: 'Electronics', zone: 'A', rack: '06', bin: 'A1', currentQty: 8,   minQty: 2,   maxQty: 15,  unit: 'pcs' },
];

async function main() {
  console.log('Seeding categories…');
  const categoryNames = [...new Set(STOCK_ITEMS.map((i) => i.category))];
  const categories = await Promise.all(
    categoryNames.map((name) =>
      prisma.category.upsert({
        where:  { name },
        update: {},
        create: { name },
      })
    )
  );
  const catMap = Object.fromEntries(categories.map((c) => [c.name, c.id]));

  console.log('Seeding products…');
  for (const item of STOCK_ITEMS) {
    await prisma.product.upsert({
      where:  { id: item.id },
      update: {
        sku:          item.sku,
        name:         item.name,
        currentQty:   item.currentQty,
        minQty:       item.minQty,
        maxQty:       item.maxQty,
        unit:         item.unit,
        locationZone: item.zone,
        locationRack: item.rack,
        locationBin:  item.bin,
        categoryId:   catMap[item.category],
      },
      create: {
        id:           item.id,
        sku:          item.sku,
        name:         item.name,
        costPrice:    0,
        sellPrice:    0,
        currentQty:   item.currentQty,
        minQty:       item.minQty,
        maxQty:       item.maxQty,
        unit:         item.unit,
        locationZone: item.zone,
        locationRack: item.rack,
        locationBin:  item.bin,
        status:       ProductStatus.ACTIVE,
        categoryId:   catMap[item.category],
      },
    });
  }

  console.log(`✓ Seeded ${STOCK_ITEMS.length} products in ${categoryNames.length} categories.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
