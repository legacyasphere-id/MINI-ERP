import { Request, Response, NextFunction } from 'express';
import { prisma } from '../services/prisma.service';
import { movementsService } from '../services/movements.service';
import { productsService } from '../services/products.service';

export const getProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await productsService.findAll({
      page:     Number(req.query.page)  || 1,
      limit:    Math.min(Number(req.query.limit) || 20, 100),
      search:   typeof req.query.search   === 'string' ? req.query.search   : undefined,
      category: typeof req.query.category === 'string' ? req.query.category : undefined,
      status:   typeof req.query.status   === 'string' ? req.query.status   : undefined,
      sortKey:  typeof req.query.sortKey  === 'string' ? req.query.sortKey  : undefined,
      sortDir:  typeof req.query.sortDir  === 'string' ? req.query.sortDir  : undefined,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
};

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
    type StockStatus = 'ok' | 'low' | 'critical' | 'overstock';
    function computeStatus(qty: number, min: number, max: number): StockStatus {
      if (qty * 2 <= min) return 'critical';
      if (qty < min)      return 'low';
      if (qty > max)      return 'overstock';
      return 'ok';
    }
    res.json({ ...product, stockStatus: computeStatus(product.currentQty, product.minQty, product.maxQty) });
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
