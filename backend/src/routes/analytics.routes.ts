import { Router } from 'express';
import { getAnalyticsStats } from '../controllers/analytics.controller';

export const analyticsRouter = Router();

analyticsRouter.get('/stats', getAnalyticsStats);
