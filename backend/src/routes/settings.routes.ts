import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/settings.controller';
import { authorize } from '../middleware/auth.middleware';

export const settingsRouter = Router();

settingsRouter.get('/',   getSettings);
settingsRouter.patch('/', authorize('ADMIN'), updateSettings);
