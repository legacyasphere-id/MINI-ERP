import { Router } from 'express';
import { listOrders, getOrder, receiveOrder } from '../controllers/orders.controller';

export const ordersRouter = Router();

ordersRouter.get('/',              listOrders);
ordersRouter.get('/:id',           getOrder);
ordersRouter.patch('/:id/receive', receiveOrder);
