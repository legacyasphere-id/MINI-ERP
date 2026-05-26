import { Prisma, POStatus } from '@prisma/client';
import { prisma } from './prisma.service';
import { z } from 'zod';

export const ReceiveLinesSchema = z.object({
  lines: z.array(z.object({
    lineId:    z.string().min(1),
    actualQty: z.number().int().min(1),
    note:      z.string().optional(),
  })).min(1),
});

export type ReceiveLinesInput = z.infer<typeof ReceiveLinesSchema>;

const lineInclude = {
  product: { select: { id: true, sku: true, name: true } },
} satisfies Prisma.POLineInclude;

function computeTotalValue(lines: { orderedQty: number; unitCost: Prisma.Decimal | number }[]) {
  return lines.reduce((sum, l) => sum + l.orderedQty * Number(l.unitCost), 0);
}

interface ListOpts {
  status?: POStatus;
  page?:   number;
  limit?:  number;
}

export const ordersService = {
  async list(opts?: ListOpts) {
    const page  = Math.max(1, opts?.page  ?? 1);
    const limit = Math.min(opts?.limit ?? 20, 100);
    const skip  = (page - 1) * limit;

    const where = opts?.status ? { status: opts.status } : {};

    const [raw, total] = await Promise.all([
      prisma.purchaseOrder.findMany({
        where,
        orderBy: { expectedDelivery: 'asc' },
        take:    limit,
        skip,
        include: { lines: { include: lineInclude } },
      }),
      prisma.purchaseOrder.count({ where }),
    ]);

    const data = raw.map((po) => ({
      ...po,
      totalValue:      computeTotalValue(po.lines),
      expectedDelivery: po.expectedDelivery.toISOString(),
      createdAt:        po.createdAt.toISOString(),
      updatedAt:        po.updatedAt.toISOString(),
      lines: po.lines.map((l) => ({
        ...l,
        unitCost:    Number(l.unitCost),
        productName: l.product?.name ?? null,
      })),
    }));

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  async findById(id: string) {
    const po = await prisma.purchaseOrder.findUnique({
      where:   { id },
      include: { lines: { include: lineInclude } },
    });
    if (!po) return null;
    return {
      ...po,
      totalValue:       computeTotalValue(po.lines),
      expectedDelivery: po.expectedDelivery.toISOString(),
      createdAt:        po.createdAt.toISOString(),
      updatedAt:        po.updatedAt.toISOString(),
      lines: po.lines.map((l) => ({
        ...l,
        unitCost:    Number(l.unitCost),
        productName: l.product?.name ?? null,
      })),
    };
  },

  async receive(poId: string, input: ReceiveLinesInput) {
    return prisma.$transaction(async (tx) => {
      const po = await tx.purchaseOrder.findUniqueOrThrow({
        where:   { id: poId },
        include: { lines: true },
      });

      if (po.status !== 'confirmed' && po.status !== 'partial') {
        throw Object.assign(new Error('PO is not in a receivable state'), { statusCode: 422 });
      }

      const lineMap = Object.fromEntries(po.lines.map((l) => [l.id, l]));

      for (const { lineId, actualQty, note } of input.lines) {
        const line = lineMap[lineId];
        if (!line) continue;

        const remaining = line.orderedQty - line.receivedQty;
        const qty = Math.min(actualQty, remaining);
        if (qty <= 0) continue;

        await tx.pOLine.update({
          where: { id: lineId },
          data:  { receivedQty: { increment: qty } },
        });

        const product = await tx.product.findUnique({ where: { sku: line.sku } });
        if (product) {
          await tx.stockMovement.create({
            data: {
              type:        'receive',
              productId:   product.id,
              qty,
              referenceId: poId,
              note:        note ?? null,
            },
          });
          await tx.product.update({
            where: { id: product.id },
            data:  { currentQty: { increment: qty } },
          });
        }
      }

      // Recompute status from updated lines
      const updatedLines = await tx.pOLine.findMany({ where: { poId } });
      const allReceived  = updatedLines.every((l) => l.receivedQty >= l.orderedQty);
      const anyReceived  = updatedLines.some((l)  => l.receivedQty > 0);
      const newStatus: POStatus = allReceived ? 'received' : anyReceived ? 'partial' : 'confirmed';

      const updated = await tx.purchaseOrder.update({
        where:   { id: poId },
        data:    { status: newStatus },
        include: { lines: { include: lineInclude } },
      });

      return {
        ...updated,
        totalValue:       computeTotalValue(updated.lines),
        expectedDelivery: updated.expectedDelivery.toISOString(),
        createdAt:        updated.createdAt.toISOString(),
        updatedAt:        updated.updatedAt.toISOString(),
        lines: updated.lines.map((l) => ({
          ...l,
          unitCost:    Number(l.unitCost),
          productName: l.product?.name ?? null,
        })),
      };
    });
  },
};
