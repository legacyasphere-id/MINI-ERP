import { Router } from 'express';
import { authRouter } from './auth.routes';
import { productsRouter } from './products.routes';
import { usersRouter } from './users.routes';

export const router = Router();

router.use('/auth', authRouter);
router.use('/products', productsRouter);
router.use('/users', usersRouter);
