import { Router } from 'express';
import { getMovements, createMovement } from '../controllers/movements.controller';

export const movementsRouter = Router();

movementsRouter.get('/',  getMovements);
movementsRouter.post('/', createMovement);
