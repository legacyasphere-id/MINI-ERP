import { Router } from 'express';
import { getProducts, getProduct, getProductMovements } from '../controllers/products.controller';

export const productsRouter = Router();

productsRouter.get('/',              getProducts);
productsRouter.get('/:id/movements', getProductMovements);
productsRouter.get('/:id',           getProduct);
