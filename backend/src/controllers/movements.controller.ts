import { Request, Response, NextFunction } from 'express';
import { movementsService, CreateMovementSchema } from '../services/movements.service';
import { ZodError } from 'zod';

export const getMovements = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const productId = typeof req.query.productId === 'string' ? req.query.productId : undefined;
    const limit  = Math.min(Number(req.query.limit)  || 50, 200);
    const offset = Number(req.query.offset) || 0;

    const [data, total] = await Promise.all([
      movementsService.findAll({ productId, limit, offset }),
      movementsService.count(productId),
    ]);

    res.json({ data, total, limit, offset });
  } catch (err) {
    next(err);
  }
};

export const createMovement = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = CreateMovementSchema.parse(req.body);
    const movement = await movementsService.create(parsed);
    res.status(201).json(movement);
  } catch (err) {
    if (err instanceof ZodError) {
      res.status(400).json({ error: 'Validation failed', issues: err.issues });
      return;
    }
    next(err);
  }
};
