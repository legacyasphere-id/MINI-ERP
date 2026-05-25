import { Request, Response, NextFunction } from 'express';
import { prisma } from '../services/prisma.service';
import { movementsService } from '../services/movements.service';

export const getProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const product = await prisma.product.findUnique({
      where:   { id: req.params.id },
      include: { category: true },
    });
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json(product);
  } catch (err) {
    next(err);
  }
};

export const getProductMovements = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const limit  = Math.min(Number(req.query.limit)  || 50, 200);
    const offset = Number(req.query.offset) || 0;

    const [data, total] = await Promise.all([
      movementsService.findAll({ productId: req.params.id, limit, offset }),
      movementsService.count(req.params.id),
    ]);

    res.json({ data, total, limit, offset });
  } catch (err) {
    next(err);
  }
};
