import { prisma } from './prisma.service';

type StockStatus = 'ok' | 'low' | 'critical' | 'overstock';

function computeStatus(currentQty: number, minQty: number, maxQty: number): StockStatus {
  if (currentQty * 2 <= minQty) return 'critical'; // currentQty <= minQty * 0.5
  if (currentQty < minQty)      return 'low';
  if (currentQty > maxQty)      return 'overstock';
  return 'ok';
}

const STATUS_ORDER: Record<StockStatus, number> = { critical: 0, low: 1, ok: 2, overstock: 3 };

export interface FindAllParams {
  page?:     number;
  limit?:    number;
  search?:   string;
  category?: string;
  status?:   string;
  sortKey?:  string;
  sortDir?:  string;
}

export const productsService = {
  async findAll(params: FindAllParams = {}) {
    const {
      page     = 1,
      limit    = 20,
      search,
      category,
      status,
      sortKey  = 'status',
      sortDir  = 'asc',
    } = params;

    // Fetch from DB — apply search + category in Prisma
    const dbRows = await prisma.product.findMany({
      where: {
        AND: [
          search ? {
            OR: [
              { sku:  { contains: search, mode: 'insensitive' } },
              { name: { contains: search, mode: 'insensitive' } },
            ],
          } : {},
          category ? { category: { name: category } } : {},
        ],
      },
      include: { category: { select: { id: true, name: true } } },
    });

    // Attach computed status
    const rows = dbRows.map((p) => ({
      ...p,
      status: computeStatus(p.currentQty, p.minQty, p.maxQty),
    }));

    // Filter by status (in-memory; acceptable at current scale)
    const filtered = status && status !== 'all'
      ? rows.filter((p) => p.status === status)
      : rows;

    // Sort
    filtered.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case 'sku':        cmp = a.sku.localeCompare(b.sku);                                         break;
        case 'name':       cmp = a.name.localeCompare(b.name);                                        break;
        case 'category':   cmp = (a.category?.name ?? '').localeCompare(b.category?.name ?? '');      break;
        case 'currentQty': cmp = a.currentQty - b.currentQty;                                         break;
        default:           cmp = STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
      }
      return sortDir === 'desc' ? -cmp : cmp;
    });

    // Paginate
    const total      = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const data       = filtered.slice((page - 1) * limit, page * limit);

    return { data, total, page, limit, totalPages };
  },
};
