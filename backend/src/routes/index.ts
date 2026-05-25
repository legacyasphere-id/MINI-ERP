import { Router } from 'express';
import { authRouter }      from './auth.routes';
import { productsRouter }  from './products.routes';
import { usersRouter }     from './users.routes';
import { movementsRouter } from './movements.routes';
import { dashboardRouter } from './dashboard.routes';

export const router = Router();

router.use('/auth',      authRouter);
router.use('/products',  productsRouter);
router.use('/users',     usersRouter);
router.use('/movements', movementsRouter);
router.use('/dashboard', dashboardRouter);
