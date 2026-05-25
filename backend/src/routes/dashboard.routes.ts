import { Router } from 'express';
import { dashboardService } from '../services/dashboard.service';
import { alertsService } from '../services/alerts.service';

export const dashboardRouter = Router();

dashboardRouter.get('/stats', async (_req, res, next) => {
  try { res.json(await dashboardService.getStats()); }
  catch (err) { next(err); }
});

dashboardRouter.get('/alerts', async (_req, res, next) => {
  try { res.json(await alertsService.getActive()); }
  catch (err) { next(err); }
});
