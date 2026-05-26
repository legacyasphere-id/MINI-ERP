import { prisma } from './prisma.service';

function dayLabel(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function dayKey(date: Date): string {
  return date.toISOString().split('T')[0];
}

function last30Days(): Date[] {
  const days: Date[] = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    days.push(d);
  }
  return days;
}

const TYPE_COLORS: Record<string, string> = {
  receive:  '#10B981',
  issue:    '#9CA3AF',
  transfer: '#3B82F6',
  adjust:   '#D6BA73',
};

export const analyticsService = {
  async getStats() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
      products,
      categories,
      totalMovements,
      recentMovements,
      openPOs,
      overduePOs,
      topSKUsRaw,
    ] = await Promise.all([
      prisma.product.findMany({
        select: { id: true, currentQty: true, minQty: true, maxQty: true },
      }),
      prisma.category.findMany({
        select: { name: true, _count: { select: { products: true } } },
        orderBy: { name: 'asc' },
      }),
      prisma.stockMovement.count(),
      prisma.stockMovement.findMany({
        where: { timestamp: { gte: thirtyDaysAgo } },
        select: { timestamp: true, type: true },
        orderBy: { timestamp: 'asc' },
      }),
      prisma.purchaseOrder.count({
        where: { status: { in: ['confirmed', 'partial'] } },
      }),
      prisma.purchaseOrder.count({
        where: {
          status: { in: ['confirmed', 'partial'] },
          expectedDelivery: { lt: new Date() },
        },
      }),
      prisma.stockMovement.groupBy({
        by: ['productId'],
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 10,
      }),
    ]);

    // Stock status counts
    let ok = 0, low = 0, critical = 0, overstock = 0;
    for (const p of products) {
      if (p.currentQty > p.maxQty)          overstock++;
      else if (p.currentQty * 2 <= p.minQty) critical++;
      else if (p.currentQty < p.minQty)      low++;
      else                                    ok++;
    }

    // Category breakdown (non-empty categories only)
    const categoryBreakdown = categories
      .filter((c) => c._count.products > 0)
      .map((c) => ({ name: c.name, count: c._count.products }))
      .sort((a, b) => b.count - a.count);

    // Daily movement counts
    const countByDay: Record<string, number> = {};
    for (const mv of recentMovements) {
      const key = dayKey(mv.timestamp);
      countByDay[key] = (countByDay[key] ?? 0) + 1;
    }
    const dailyMovements = last30Days().map((day) => ({
      date:  dayLabel(day),
      count: countByDay[dayKey(day)] ?? 0,
    }));

    // Movement type breakdown
    const typeCounts: Record<string, number> = {};
    for (const mv of recentMovements) {
      typeCounts[mv.type] = (typeCounts[mv.type] ?? 0) + 1;
    }
    const movementTypeBreakdown = Object.entries(typeCounts).map(([name, value]) => ({
      name:  name.charAt(0).toUpperCase() + name.slice(1),
      value,
      fill:  TYPE_COLORS[name] ?? '#6B7280',
    }));

    // Top SKUs by movement volume
    const productIds   = topSKUsRaw.map((r) => r.productId);
    const topProducts  = await prisma.product.findMany({
      where:  { id: { in: productIds } },
      select: { id: true, sku: true, name: true },
    });
    const productMap = Object.fromEntries(topProducts.map((p) => [p.id, p]));
    const topSKUs = topSKUsRaw
      .filter((r) => productMap[r.productId])
      .map((r) => ({
        sku:   productMap[r.productId].sku,
        name:  productMap[r.productId].name,
        count: r._count.id,
      }));

    return {
      totalSKUs:            products.length,
      categoryBreakdown,
      stockStatusCounts:    { ok, low, critical, overstock },
      openPOs,
      overduePOs,
      totalMovements,
      dailyMovements,
      movementTypeBreakdown,
      topSKUs,
    };
  },
};
