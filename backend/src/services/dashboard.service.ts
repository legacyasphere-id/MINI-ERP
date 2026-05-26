import { prisma } from './prisma.service';

function todayStart(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function tomorrowStart(): Date {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(0, 0, 0, 0);
  return d;
}

function dayKey(date: Date): string {
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
}

function dayLabel(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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

export const dashboardService = {
  async getStats() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [products, inboundMovements, inboundToday, outboundToday] = await Promise.all([
      prisma.product.findMany({
        select: { currentQty: true, costPrice: true, minQty: true, maxQty: true },
      }),
      prisma.stockMovement.findMany({
        where: { type: 'receive', timestamp: { gte: thirtyDaysAgo } },
        include: { product: { select: { costPrice: true } } },
        orderBy: { timestamp: 'asc' },
      }),
      // POs due today with actionable status
      prisma.purchaseOrder.count({
        where: {
          expectedDelivery: { gte: todayStart(), lt: tomorrowStart() },
          status: { in: ['confirmed', 'partial'] },
        },
      }),
      // Issue movements recorded today
      prisma.stockMovement.count({
        where: { type: 'issue', timestamp: { gte: todayStart() } },
      }),
    ]);

    // Total stock value today
    const totalStockValue = products.reduce(
      (sum, p) => sum + p.currentQty * Number(p.costPrice),
      0
    );

    // Critical / low counts
    const criticalCount = products.filter((p) => p.currentQty * 2 <= p.minQty).length;
    const lowCount      = products.filter(
      (p) => p.currentQty < p.minQty && p.currentQty * 2 > p.minQty
    ).length;

    // Aggregate inbound value by day
    const valueByDay: Record<string, number> = {};
    for (const mov of inboundMovements) {
      const key = dayKey(mov.timestamp);
      valueByDay[key] = (valueByDay[key] ?? 0) + mov.qty * Number(mov.product.costPrice);
    }

    // Fill all 30 days (zeros for days with no movements)
    const dailyInboundValue = last30Days().map((day) => ({
      date:  dayLabel(day),
      value: Math.round((valueByDay[dayKey(day)] ?? 0) * 100) / 100,
    }));

    return {
      totalStockValue: Math.round(totalStockValue * 100) / 100,
      criticalCount,
      lowCount,
      dailyInboundValue,
      inboundToday,
      outboundToday,
    };
  },
};
