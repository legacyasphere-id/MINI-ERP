-- InventoryOS — Supabase seed
-- Run this in Supabase SQL Editor (paste all, then click Run)

-- ── Categories ──────────────────────────────────────────────────────────────
INSERT INTO categories (id, name, "createdAt") VALUES
  ('cat-storage',     'Storage',     NOW()),
  ('cat-electronics', 'Electronics', NOW()),
  ('cat-peripherals', 'Peripherals', NOW()),
  ('cat-cables',      'Cables',      NOW()),
  ('cat-office',      'Office',      NOW())
ON CONFLICT (name) DO NOTHING;

-- ── Products ────────────────────────────────────────────────────────────────
INSERT INTO products (id, sku, name, status, "costPrice", "sellPrice", "currentQty", "minQty", "maxQty", unit, "locationZone", "locationRack", "locationBin", "categoryId", "createdAt", "updatedAt") VALUES
  ('itm-001', 'ELEC-SSD-001',  '2TB NVMe SSD',                  'ACTIVE', 150.00, 0, 4,   10,  100, 'pcs',  'A', '01', 'B3', (SELECT id FROM categories WHERE name='Storage'),     NOW(), NOW()),
  ('itm-002', 'ELEC-RAM-001',  'DDR5 32GB Module',              'ACTIVE', 120.00, 0, 6,   15,  120, 'pcs',  'A', '02', 'A1', (SELECT id FROM categories WHERE name='Electronics'), NOW(), NOW()),
  ('itm-003', 'PRPH-KBD-001',  'Mechanical Keyboard TKL',       'ACTIVE',  80.00, 0, 18,  20,  80,  'pcs',  'B', '01', 'C2', (SELECT id FROM categories WHERE name='Peripherals'), NOW(), NOW()),
  ('itm-004', 'PRPH-MOU-001',  'Wireless Ergonomic Mouse',      'ACTIVE',  60.00, 0, 22,  20,  100, 'pcs',  'B', '01', 'C4', (SELECT id FROM categories WHERE name='Peripherals'), NOW(), NOW()),
  ('itm-005', 'CABL-USB-001',  'USB-C Cable 2m',                'ACTIVE',   8.00, 0, 210, 50,  200, 'pcs',  'B', '03', 'A2', (SELECT id FROM categories WHERE name='Cables'),      NOW(), NOW()),
  ('itm-006', 'ELEC-MON-001',  '27" 4K IPS Monitor',            'ACTIVE', 320.00, 0, 11,  5,   40,  'pcs',  'A', '04', 'A1', (SELECT id FROM categories WHERE name='Electronics'), NOW(), NOW()),
  ('itm-007', 'STRG-HDD-001',  '8TB HDD Enterprise',            'ACTIVE',  95.00, 0, 19,  8,   60,  'pcs',  'A', '01', 'C1', (SELECT id FROM categories WHERE name='Storage'),     NOW(), NOW()),
  ('itm-008', 'CABL-ETH-001',  'Cat6A Ethernet 5m',             'ACTIVE',  12.00, 0, 87,  30,  150, 'pcs',  'B', '03', 'B1', (SELECT id FROM categories WHERE name='Cables'),      NOW(), NOW()),
  ('itm-009', 'PRPH-CAM-001',  'Webcam 4K 60fps',               'ACTIVE', 110.00, 0, 9,   10,  50,  'pcs',  'B', '02', 'A3', (SELECT id FROM categories WHERE name='Peripherals'), NOW(), NOW()),
  ('itm-010', 'OFFC-PPR-001',  'A4 Copy Paper 80gsm (Ream)',    'ACTIVE',   8.00, 0, 340, 100, 500, 'ream', 'C', '01', 'A1', (SELECT id FROM categories WHERE name='Office'),      NOW(), NOW()),
  ('itm-011', 'ELEC-UPS-001',  'UPS 1500VA Tower',              'ACTIVE', 210.00, 0, 3,   4,   20,  'pcs',  'A', '05', 'B2', (SELECT id FROM categories WHERE name='Electronics'), NOW(), NOW()),
  ('itm-012', 'CABL-HDMI-001', 'HDMI 2.1 Cable 3m',             'ACTIVE',  15.00, 0, 55,  20,  100, 'pcs',  'B', '03', 'C3', (SELECT id FROM categories WHERE name='Cables'),      NOW(), NOW()),
  ('itm-013', 'PRPH-SPK-001',  'USB Desk Speaker Pair',         'ACTIVE',  55.00, 0, 28,  10,  60,  'pcs',  'B', '02', 'C1', (SELECT id FROM categories WHERE name='Peripherals'), NOW(), NOW()),
  ('itm-014', 'STRG-SSD-001',  'SATA SSD 1TB',                  'ACTIVE',  75.00, 0, 32,  15,  80,  'pcs',  'A', '03', 'A4', (SELECT id FROM categories WHERE name='Storage'),     NOW(), NOW()),
  ('itm-015', 'OFFC-INK-001',  'Printer Ink Cartridge Set',     'ACTIVE',  35.00, 0, 12,  15,  60,  'set',  'C', '02', 'B2', (SELECT id FROM categories WHERE name='Office'),      NOW(), NOW()),
  ('itm-016', 'ELEC-RPI-001',  'Raspberry Pi 5 4GB',            'ACTIVE',  80.00, 0, 45,  10,  100, 'pcs',  'A', '02', 'C3', (SELECT id FROM categories WHERE name='Electronics'), NOW(), NOW()),
  ('itm-017', 'PRPH-HUB-001',  'USB-C 10-Port Hub',             'ACTIVE',  45.00, 0, 34,  10,  80,  'pcs',  'B', '04', 'A1', (SELECT id FROM categories WHERE name='Peripherals'), NOW(), NOW()),
  ('itm-018', 'CABL-PWR-001',  'IEC C13 Power Cable 3m',        'ACTIVE',  10.00, 0, 120, 40,  200, 'pcs',  'B', '03', 'D1', (SELECT id FROM categories WHERE name='Cables'),      NOW(), NOW()),
  ('itm-019', 'OFFC-DSK-001',  'Standing Desk Converter',       'ACTIVE', 185.00, 0, 7,   3,   20,  'pcs',  'C', '03', 'A1', (SELECT id FROM categories WHERE name='Office'),      NOW(), NOW()),
  ('itm-020', 'ELEC-SWT-001',  '24-Port Managed Network Switch','ACTIVE', 380.00, 0, 8,   2,   15,  'pcs',  'A', '06', 'A1', (SELECT id FROM categories WHERE name='Electronics'), NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ── Suppliers ───────────────────────────────────────────────────────────────
INSERT INTO suppliers (id, name, "leadTimeDays", "reliabilityScore", "createdAt") VALUES
  ('sup-001', 'TechVault Distributors', 5,  94, NOW()),
  ('sup-002', 'Peripheral Plus',        8,  87, NOW()),
  ('sup-003', 'CableKing Supply',       4,  91, NOW()),
  ('sup-004', 'Office Direct',          3,  96, NOW()),
  ('sup-005', 'NetCore Solutions',      12, 78, NOW())
ON CONFLICT (name) DO NOTHING;

-- ── Purchase Orders ─────────────────────────────────────────────────────────
INSERT INTO purchase_orders (id, "supplierName", status, "expectedDelivery", "createdAt", "updatedAt") VALUES
  ('po-seed-001', 'TechVault Distributors', 'confirmed', '2026-05-29 12:00:00', '2026-05-22 10:00:00', NOW()),
  ('po-seed-002', 'Peripheral Plus',        'confirmed', '2026-06-02 12:00:00', '2026-05-23 09:30:00', NOW()),
  ('po-seed-003', 'CableKing Supply',       'confirmed', '2026-05-28 12:00:00', '2026-05-21 14:00:00', NOW()),
  ('po-seed-004', 'TechVault Distributors', 'partial',   '2026-05-26 12:00:00', '2026-05-17 08:00:00', NOW()),
  ('po-seed-005', 'CableKing Supply',       'partial',   '2026-05-25 10:00:00', '2026-05-19 11:00:00', NOW()),
  ('po-seed-006', 'Office Direct',          'received',  '2026-05-10 12:00:00', '2026-05-05 13:00:00', NOW()),
  ('po-seed-007', 'Peripheral Plus',        'received',  '2026-05-08 10:00:00', '2026-05-01 09:00:00', NOW()),
  ('po-seed-008', 'NetCore Solutions',      'received',  '2026-04-28 12:00:00', '2026-04-20 11:00:00', NOW()),
  ('po-seed-009', 'TechVault Distributors', 'draft',     '2026-06-10 12:00:00', '2026-05-25 16:00:00', NOW()),
  ('po-seed-010', 'Office Direct',          'draft',     '2026-06-15 12:00:00', '2026-05-25 14:00:00', NOW())
ON CONFLICT (id) DO NOTHING;

-- ── PO Lines ────────────────────────────────────────────────────────────────
INSERT INTO po_lines (id, "poId", sku, "productId", "orderedQty", "receivedQty", "unitCost") VALUES
  ('pol-001-1', 'po-seed-001', 'ELEC-SSD-001',  (SELECT id FROM products WHERE sku='ELEC-SSD-001'),  50,  0,   145.00),
  ('pol-001-2', 'po-seed-001', 'ELEC-RAM-001',  (SELECT id FROM products WHERE sku='ELEC-RAM-001'),  30,  0,   118.00),
  ('pol-002-1', 'po-seed-002', 'PRPH-KBD-001',  (SELECT id FROM products WHERE sku='PRPH-KBD-001'),  40,  0,    76.00),
  ('pol-002-2', 'po-seed-002', 'PRPH-HUB-001',  (SELECT id FROM products WHERE sku='PRPH-HUB-001'),  20,  0,    42.00),
  ('pol-002-3', 'po-seed-002', 'PRPH-CAM-001',  (SELECT id FROM products WHERE sku='PRPH-CAM-001'),  15,  0,   105.00),
  ('pol-003-1', 'po-seed-003', 'CABL-ETH-001',  (SELECT id FROM products WHERE sku='CABL-ETH-001'),  80,  0,    11.50),
  ('pol-003-2', 'po-seed-003', 'CABL-HDMI-001', (SELECT id FROM products WHERE sku='CABL-HDMI-001'), 50,  0,    13.50),
  ('pol-004-1', 'po-seed-004', 'ELEC-MON-001',  (SELECT id FROM products WHERE sku='ELEC-MON-001'),  20,  12,  310.00),
  ('pol-004-2', 'po-seed-004', 'ELEC-UPS-001',  (SELECT id FROM products WHERE sku='ELEC-UPS-001'),  10,  10,  200.00),
  ('pol-005-1', 'po-seed-005', 'CABL-USB-001',  (SELECT id FROM products WHERE sku='CABL-USB-001'),  100, 95,    7.50),
  ('pol-005-2', 'po-seed-005', 'CABL-PWR-001',  (SELECT id FROM products WHERE sku='CABL-PWR-001'),  60,  60,    9.50),
  ('pol-006-1', 'po-seed-006', 'OFFC-PPR-001',  (SELECT id FROM products WHERE sku='OFFC-PPR-001'),  200, 200,   7.80),
  ('pol-006-2', 'po-seed-006', 'OFFC-INK-001',  (SELECT id FROM products WHERE sku='OFFC-INK-001'),  30,  30,   33.00),
  ('pol-007-1', 'po-seed-007', 'PRPH-MOU-001',  (SELECT id FROM products WHERE sku='PRPH-MOU-001'),  25,  25,   57.00),
  ('pol-007-2', 'po-seed-007', 'PRPH-SPK-001',  (SELECT id FROM products WHERE sku='PRPH-SPK-001'),  15,  15,   52.00),
  ('pol-008-1', 'po-seed-008', 'ELEC-SWT-001',  (SELECT id FROM products WHERE sku='ELEC-SWT-001'),  5,   5,   365.00),
  ('pol-008-2', 'po-seed-008', 'ELEC-RPI-001',  (SELECT id FROM products WHERE sku='ELEC-RPI-001'),  20,  20,   77.00),
  ('pol-009-1', 'po-seed-009', 'STRG-SSD-001',  (SELECT id FROM products WHERE sku='STRG-SSD-001'),  40,  0,    72.00),
  ('pol-009-2', 'po-seed-009', 'STRG-HDD-001',  (SELECT id FROM products WHERE sku='STRG-HDD-001'),  20,  0,    90.00),
  ('pol-010-1', 'po-seed-010', 'OFFC-DSK-001',  (SELECT id FROM products WHERE sku='OFFC-DSK-001'),  10,  0,   178.00),
  ('pol-010-2', 'po-seed-010', 'OFFC-PPR-001',  (SELECT id FROM products WHERE sku='OFFC-PPR-001'),  150, 0,     7.80)
ON CONFLICT (id) DO NOTHING;

-- ── Settings (singleton) ────────────────────────────────────────────────────
INSERT INTO settings (id, "warehouseName", "warehouseCode", timezone, currency, "lowStockPct", "overstockPct", "movementLogLimit", "updatedAt") VALUES
  ('singleton', 'Main Distribution Centre', 'WH-MAIN-001', 'UTC', 'USD', 30, 110, 20, NOW())
ON CONFLICT (id) DO NOTHING;

-- Done! Verify counts:
-- SELECT 'categories' AS table, COUNT(*) FROM categories
-- UNION ALL SELECT 'products',     COUNT(*) FROM products
-- UNION ALL SELECT 'suppliers',    COUNT(*) FROM suppliers
-- UNION ALL SELECT 'POs',          COUNT(*) FROM purchase_orders
-- UNION ALL SELECT 'PO lines',     COUNT(*) FROM po_lines;
