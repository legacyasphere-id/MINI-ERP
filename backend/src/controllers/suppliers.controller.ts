import { Request, Response, NextFunction } from 'express';
import { suppliersService } from '../services/suppliers.service';

export const listSuppliers = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await suppliersService.list();
    res.json(data);
  } catch (err) {
    next(err);
  }
};
