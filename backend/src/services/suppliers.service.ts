import { prisma } from './prisma.service';

export const suppliersService = {
  async list() {
    const [suppliers, orders] = await Promise.all([
      prisma.supplier.findMany({ orderBy: { name: 'asc' } }),
      prisma.purchaseOrder.findMany({
        select: { supplierName: true, status: true, expectedDelivery: true, updatedAt: true },
      }),
    ]);

    return suppliers.map((s) => {
      const supplierOrders = orders.filter((o) => o.supplierName === s.name);
      const activeOrders   = supplierOrders.filter((o) => o.status === 'confirmed' || o.status === 'partial').length;
      const lastReceived   = supplierOrders
        .filter((o) => o.status === 'received')
        .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())[0];

      return {
        id:               s.id,
        name:             s.name,
        leadTimeDays:     s.leadTimeDays,
        reliabilityScore: s.reliabilityScore,
        activeOrders,
        lastDelivery: lastReceived ? lastReceived.updatedAt.toISOString() : null,
      };
    });
  },
};
