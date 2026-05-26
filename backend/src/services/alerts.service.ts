import { prisma } from './prisma.service';

function computeStatus(qty: number, min: number, max: number) {
  if (qty * 2 <= min) return 'critical';
  if (qty < min)      return 'low';
  if (qty > max)      return 'overstock';
  return 'ok';
}

export const alertsService = {
  async getActive() {
    const products = await prisma.product.findMany({
      include: { category: { select: { name: true } } },
      orderBy: { sku: 'asc' },
    });

    const now = new Date().toISOString();

    return products
      .map((p) => ({ ...p, status: computeStatus(p.currentQty, p.minQty, p.maxQty) }))
      .filter((p) => p.status === 'critical' || p.status === 'low')
      .map((p) => ({
        id:         `alert-${p.id}`,
        severity:   p.status === 'critical' ? 'critical' : 'warning',
        type:       'low_stock' as const,
        message:
          p.status === 'critical'
            ? `${p.sku} below critical threshold — ${p.currentQty} units remaining (min: ${p.minQty})`
            : `${p.sku} approaching reorder point — ${p.currentQty} units (min: ${p.minQty})`,
        productId:  p.id,
        sku:        p.sku,
        name:       p.name,
        currentQty: p.currentQty,
        minQty:     p.minQty,
        timestamp:  now,
      }));
  },
};
