-- Seed: stock movements spread across the last 30 days
-- Run this in Supabase SQL Editor after seed-supabase.sql

INSERT INTO stock_movements (id, type, "productId", qty, "fromLocation", "toLocation", "operatorId", "referenceId", note, timestamp)
VALUES
  -- Week 1 (28-22 days ago)
  ('mov-001', 'receive', 'itm-006', 5,  NULL, 'A-04-A1', (SELECT id FROM users WHERE email='admin@inventoryos.com'), 'PO-REF-001', 'Initial stock receipt',       NOW() - INTERVAL '28 days'),
  ('mov-002', 'receive', 'itm-001', 10, NULL, 'A-01-B3', (SELECT id FROM users WHERE email='admin@inventoryos.com'), 'PO-REF-002', NULL,                          NOW() - INTERVAL '26 days'),
  ('mov-003', 'receive', 'itm-016', 20, NULL, 'A-02-C3', (SELECT id FROM users WHERE email='admin@inventoryos.com'), 'PO-REF-003', NULL,                          NOW() - INTERVAL '24 days'),
  ('mov-004', 'issue',   'itm-005', 15, 'B-03-A2', NULL, (SELECT id FROM users WHERE email='admin@inventoryos.com'), '',           'Dispatched to floor',         NOW() - INTERVAL '23 days'),
  ('mov-005', 'receive', 'itm-020', 3,  NULL, 'A-06-A1', (SELECT id FROM users WHERE email='admin@inventoryos.com'), 'PO-REF-004', NULL,                          NOW() - INTERVAL '21 days'),

  -- Week 2 (21-15 days ago)
  ('mov-006', 'receive', 'itm-002', 15, NULL, 'A-02-A1', (SELECT id FROM users WHERE email='admin@inventoryos.com'), 'PO-REF-005', 'RAM batch Q2',                NOW() - INTERVAL '19 days'),
  ('mov-007', 'issue',   'itm-012', 8,  'B-03-C3', NULL, (SELECT id FROM users WHERE email='admin@inventoryos.com'), '',           NULL,                          NOW() - INTERVAL '18 days'),
  ('mov-008', 'receive', 'itm-011', 8,  NULL, 'A-05-B2', (SELECT id FROM users WHERE email='admin@inventoryos.com'), 'PO-REF-006', NULL,                          NOW() - INTERVAL '17 days'),
  ('mov-009', 'receive', 'itm-006', 4,  NULL, 'A-04-A1', (SELECT id FROM users WHERE email='admin@inventoryos.com'), 'PO-REF-007', 'Monitor restock',             NOW() - INTERVAL '15 days'),
  ('mov-010', 'issue',   'itm-010', 40, 'C-01-A1', NULL, (SELECT id FROM users WHERE email='admin@inventoryos.com'), '',           'Monthly paper supply',        NOW() - INTERVAL '14 days'),

  -- Week 3 (14-8 days ago)
  ('mov-011', 'receive', 'itm-019', 5,  NULL, 'C-03-A1', (SELECT id FROM users WHERE email='admin@inventoryos.com'), 'PO-REF-008', NULL,                          NOW() - INTERVAL '12 days'),
  ('mov-012', 'receive', 'itm-001', 20, NULL, 'A-01-B3', (SELECT id FROM users WHERE email='admin@inventoryos.com'), 'PO-REF-009', 'SSD bulk order',              NOW() - INTERVAL '10 days'),
  ('mov-013', 'receive', 'itm-020', 5,  NULL, 'A-06-A1', (SELECT id FROM users WHERE email='admin@inventoryos.com'), 'PO-REF-010', NULL,                          NOW() - INTERVAL '8 days'),
  ('mov-014', 'issue',   'itm-016', 5,  'A-02-C3', NULL, (SELECT id FROM users WHERE email='admin@inventoryos.com'), '',           'Dev lab allocation',          NOW() - INTERVAL '8 days'),

  -- Week 4 (7-1 days ago)
  ('mov-015', 'receive', 'itm-002', 25, NULL, 'A-02-A1', (SELECT id FROM users WHERE email='admin@inventoryos.com'), 'PO-REF-011', 'RAM — urgent reorder',        NOW() - INTERVAL '6 days'),
  ('mov-016', 'receive', 'itm-003', 30, NULL, 'B-01-C2', (SELECT id FROM users WHERE email='admin@inventoryos.com'), 'PO-REF-012', NULL,                          NOW() - INTERVAL '4 days'),
  ('mov-017', 'receive', 'itm-006', 6,  NULL, 'A-04-A1', (SELECT id FROM users WHERE email='admin@inventoryos.com'), 'PO-REF-013', NULL,                          NOW() - INTERVAL '3 days'),
  ('mov-018', 'issue',   'itm-003', 12, 'B-01-C2', NULL, (SELECT id FROM users WHERE email='admin@inventoryos.com'), '',           'Shipped to client',           NOW() - INTERVAL '2 days'),
  ('mov-019', 'receive', 'itm-011', 10, NULL, 'A-05-B2', (SELECT id FROM users WHERE email='admin@inventoryos.com'), 'PO-REF-014', NULL,                          NOW() - INTERVAL '1 day'),
  ('mov-020', 'receive', 'itm-016', 40, NULL, 'A-02-C3', (SELECT id FROM users WHERE email='admin@inventoryos.com'), 'PO-REF-015', 'RPi restock — big batch',     NOW() - INTERVAL '12 hours')

ON CONFLICT (id) DO NOTHING;
