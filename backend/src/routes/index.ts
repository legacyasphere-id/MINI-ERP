import { Router } from 'express';
import { authRouter }      from './auth.routes';
import { productsRouter }  from './products.routes';
import { usersRouter }     from './users.routes';
import { movementsRouter } from './movements.routes';
import { dashboardRouter } from './dashboard.routes';
import { ordersRouter }     from './orders.routes';
import { suppliersRouter }  from './suppliers.routes';
import { authenticate }     from '../middleware/auth.middleware';

export const router = Router();

// Public — no token required
router.use('/auth', authRouter);

// Protected — valid JWT required for everything below
router.use(authenticate as any);
router.use('/products',  productsRouter);
router.use('/users',     usersRouter);
router.use('/movements', movementsRouter);
router.use('/dashboard', dashboardRouter);
router.use('/orders',    ordersRouter);
router.use('/suppliers', suppliersRouter);
