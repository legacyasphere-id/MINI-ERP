# InventoryOS — CLAUDE.md

## Project structure
- Monorepo: `/frontend` (Vite + React + Tailwind) · `/backend` (Express + Prisma + Postgres) · `/prisma`
- Branch: `claude/inventoryos-scaffold-osnc3`
- Backend runs on `:3001`, frontend on `:5173`
- DB: PostgreSQL 16, database `inventoryos`, user `inventoryos`
- Start postgres if down: `pg_ctlcluster 16 main start`
- Prisma CLI: use root `node_modules/.bin/prisma` (not npx — installs v7 which breaks schema)
- Seed: `DATABASE_URL="postgresql://inventoryos:inventoryos@localhost:5432/inventoryos" node_modules/.bin/tsx prisma/seed.ts`

## What's working (end-to-end, real DB)
- `POST /api/movements` — creates StockMovement, atomically updates `product.currentQty`
- `GET /api/movements` — paginated log, filterable by `productId`
- `GET /api/products/:id` — single product with category
- `GET /api/products/:id/movements` — movement history for one SKU
- MovementPage: live form + log, cross-links SKU → `/inventory/:id`
- ProductDetailPage: real movement history from API
- AlertsPage: modal "View SKU" → `/inventory/:id`

## What's still mock data
- InventoryPage (StockTable) — reads `STOCK_ITEMS` array, not DB
- AlertsPage list — reads `ALERTS` array from mock-data
- SuppliersPage — reads `SUPPLIERS` array
- PurchaseOrdersPage — reads `PURCHASE_ORDERS` array
- DashboardPage — all KPIs and panels are static/mock

## Design rules (don't break these)
- Colors: use `text-ink`, `text-ink-muted`, `text-ink-dim`, `text-ink-muted/60` — no raw grays
- Status colors: `text-status-ok/error/warning/info`, `bg-status-*/10` for badges
- Accent: `text-accent-blue`, `bg-accent-blue/15` for active states
- Typography: `label-caps` for table headers/section labels, `heading` for page titles, `sku` for monospace codes
- Spacing: `h-input` for form inputs, `h-row` for table rows, `h-topbar` for top bar
- Sidebar: primary nav (operational) → divider → admin section (dimmer)

## Next build target: Inventory List end-to-end

### Phase 1 — Backend (do this first)
Extend `GET /api/products` with real Prisma query + filters:

```
GET /api/products?page=1&limit=20&category=Storage&status=low&search=SSD
```

Response shape:
```json
{ "data": [...products], "total": 120, "page": 1, "limit": 20, "totalPages": 6 }
```

Query params to support:
- `search` — matches `sku` or `name` (case-insensitive contains)
- `category` — exact category name
- `status` — `low` (currentQty < minQty), `critical` (currentQty ≤ minQty/2), `overstock` (currentQty > maxQty), `ok`
- `page` + `limit` (default 1 / 20, max limit 100)

Status is computed in Prisma via `where` conditions, not stored as a field.

Verification:
```bash
curl "http://localhost:3001/api/products?page=1&limit=20&status=low"
# Returns paginated real data
```

### Phase 2 — Frontend
- Replace `STOCK_ITEMS` import in `InventoryPage.tsx` with `useProducts` hook (or inline fetch)
- Hook: `useProducts({ page, limit, search, category, status })` → fetches `/api/products`
- Keep existing `StockTable` component — just feed it real data instead of mock
- Add pagination: `totalPages` from response → prev/next buttons below table
- Filters already exist in `StockFilters` — wire them to refetch with new params (debounced search already built)
- Row click → `/inventory/:id` already works

### Phase 3 — Verify
1. Load Inventory page → see real products from DB
2. Change page → data changes
3. Filter by low stock → only items where `currentQty < minQty`
4. Search "SSD" → filters by SKU/name
5. Click a row → ProductDetailPage shows real movement history
6. Create a movement on MovementPage → return to Inventory → qty reflects the change
