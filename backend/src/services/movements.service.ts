import { Prisma, MovementType } from '@prisma/client';
import { prisma } from './prisma.service';
import { z } from 'zod';

export const CreateMovementSchema = z.object({
  type:         z.enum(['receive', 'issue', 'transfer', 'adjust']),
  productId:    z.string().min(1),
  qty:          z.number().int().refine((n) => n !== 0, 'Quantity must be non-zero'),
  fromLocation: z.string().nullable().optional(),
  toLocation:   z.string().nullable().optional(),
  referenceId:  z.string().optional(),
  note:         z.string().nullable().optional(),
});

export type CreateMovementInput = z.infer<typeof CreateMovementSchema>;

const movementInclude = {
  product:  { select: { id: true, sku: true, name: true } },
  operator: { select: { id: true, name: true } },
} satisfies Prisma.StockMovementInclude;

interface FindAllOpts {
  productId?: string;
  limit?: number;
  offset?: number;
}

export const movementsService = {
  async findAll(opts?: FindAllOpts) {
    return prisma.stockMovement.findMany({
      where:   opts?.productId ? { productId: opts.productId } : undefined,
      orderBy: { timestamp: 'desc' },
      take:    opts?.limit  ?? 50,
      skip:    opts?.offset ?? 0,
      include: movementInclude,
    });
  },

  async count(productId?: string) {
    return prisma.stockMovement.count({
      where: productId ? { productId } : undefined,
    });
  },

  async create(data: CreateMovementInput, operatorId?: string) {
    const type = data.type as MovementType;

    return prisma.$transaction(async (tx) => {
      const product = await tx.product.findUniqueOrThrow({
        where: { id: data.productId },
        select: { currentQty: true },
      });

      const delta =
        type === 'receive'  ?  Math.abs(data.qty) :
        type === 'issue'    ? -Math.abs(data.qty) :
        type === 'adjust'   ?  data.qty :
        0; // transfer: no net change

      const movement = await tx.stockMovement.create({
        data: {
          type,
          productId:    data.productId,
          qty:          data.qty,
          fromLocation: data.fromLocation ?? null,
          toLocation:   data.toLocation   ?? null,
          operatorId:   operatorId        ?? null,
          referenceId:  data.referenceId  ?? '',
          note:         data.note         ?? null,
        },
        include: movementInclude,
      });

      if (delta !== 0) {
        await tx.product.update({
          where: { id: data.productId },
          data:  { currentQty: product.currentQty + delta },
        });
      }

      return movement;
    });
  },
};
