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

    if (lowStockPct !== undefined) {
      const v = Number(lowStockPct);
      if (isNaN(v) || v < 1 || v > 200) {
        res.status(400).json({ error: 'lowStockPct must be a number between 1 and 200' });
        return;
      }
      update.lowStockPct = v;
    }
    if (overstockPct !== undefined) {
      const v = Number(overstockPct);
      if (isNaN(v) || v < 100 || v > 500) {
        res.status(400).json({ error: 'overstockPct must be a number between 100 and 500' });
        return;
      }
      update.overstockPct = v;
    }
    if (movementLogLimit !== undefined) {
      const v = Number(movementLogLimit);
      if (isNaN(v) || v < 5 || v > 200) {
        res.status(400).json({ error: 'movementLogLimit must be a number between 5 and 200' });
        return;
      }
      update.movementLogLimit = v;
    }

    res.json(await settingsService.update(update));
  } catch (err) {
    next(err);
  }
};
