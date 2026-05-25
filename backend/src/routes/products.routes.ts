import { Router } from 'express';
import { getProduct, getProductMovements } from '../controllers/products.controller';

export const productsRouter = Router();

productsRouter.get('/:id/movements', getProductMovements);
productsRouter.get('/:id',           getProduct);
