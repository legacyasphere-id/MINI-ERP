import { Router } from 'express';

export const productsRouter = Router();

productsRouter.get('/', (_req, res) => {
  res.status(501).json({ message: 'Not implemented' });
});

productsRouter.get('/:id', (_req, res) => {
  res.status(501).json({ message: 'Not implemented' });
});

productsRouter.post('/', (_req, res) => {
  res.status(501).json({ message: 'Not implemented' });
});

productsRouter.patch('/:id', (_req, res) => {
  res.status(501).json({ message: 'Not implemented' });
});

productsRouter.delete('/:id', (_req, res) => {
  res.status(501).json({ message: 'Not implemented' });
});
