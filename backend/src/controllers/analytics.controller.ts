import { Response, NextFunction } from 'express';
import { analyticsService } from '../services/analytics.service';
import type { AuthenticatedRequest } from '../middleware/auth.middleware';

export const getAnalyticsStats = async (
  _req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    res.json(await analyticsService.getStats());
  } catch (err) {
    next(err);
  }
};
