import { Router } from 'express';
import { listSuppliers } from '../controllers/suppliers.controller';

export const suppliersRouter = Router();

suppliersRouter.get('/', listSuppliers);
