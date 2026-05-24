import { Router } from 'express';

export const authRouter = Router();

authRouter.post('/login', (_req, res) => {
  res.status(501).json({ message: 'Not implemented' });
});

authRouter.post('/logout', (_req, res) => {
  res.status(501).json({ message: 'Not implemented' });
});

authRouter.get('/me', (_req, res) => {
  res.status(501).json({ message: 'Not implemented' });
});
