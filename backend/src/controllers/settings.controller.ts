import { Response, NextFunction } from 'express';
import { settingsService } from '../services/settings.service';
import type { AuthenticatedRequest } from '../middleware/auth.middleware';

export const getSettings = async (
  _req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    res.json(await settingsService.get());
  } catch (err) {
    next(err);
  }
};

export const updateSettings = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const {
      warehouseName, warehouseCode, timezone, currency,
      lowStockPct, overstockPct, movementLogLimit,
    } = req.body;

    const update: Record<string, unknown> = {};
    if (warehouseName    !== undefined) update.warehouseName    = String(warehouseName);
    if (warehouseCode    !== undefined) update.warehouseCode    = String(warehouseCode);
    if (timezone         !== undefined) update.timezone         = String(timezone);
    if (currency         !== undefined) update.currency         = String(currency);
    if (lowStockPct      !== undefined) update.lowStockPct      = Number(lowStockPct);
    if (overstockPct     !== undefined) update.overstockPct     = Number(overstockPct);
    if (movementLogLimit !== undefined) update.movementLogLimit = Number(movementLogLimit);

    res.json(await settingsService.update(update));
  } catch (err) {
    next(err);
  }
};
