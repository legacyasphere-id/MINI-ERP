import { Request, Response, NextFunction } from 'express';
import { POStatus } from '@prisma/client';
import { ordersService, ReceiveLinesSchema } from '../services/orders.service';
import { ZodError } from 'zod';

const VALID_STATUSES = new Set<string>(['draft', 'confirmed', 'partial', 'received']);

export const listOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const rawStatus = typeof req.query.status === 'string' ? req.query.status : undefined;
    const status    = rawStatus && VALID_STATUSES.has(rawStatus) ? (rawStatus as POStatus) : undefined;
    const page      = Math.max(1, Number(req.query.page)  || 1);
    const limit     = Math.min(Number(req.query.limit) || 20, 100);

    const result = await ordersService.list({ status, page, limit });
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const getOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const po = await ordersService.findById(req.params.id);
    if (!po) { res.status(404).json({ error: 'Purchase order not found' }); return; }
    res.json(po);
  } catch (err) {
    next(err);
  }
};

export const receiveOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = ReceiveLinesSchema.parse(req.body);
    const po     = await ordersService.receive(req.params.id, parsed);
    res.json(po);
  } catch (err) {
    if (err instanceof ZodError) {
      res.status(400).json({ error: 'Validation failed', issues: err.issues });
      return;
    }
    const status = (err as { statusCode?: number }).statusCode;
    if (status) {
      res.status(status).json({ error: (err as Error).message });
      return;
    }
    next(err);
  }
};
