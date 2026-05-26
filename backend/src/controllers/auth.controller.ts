import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { prisma } from '../services/prisma.service';
import type { AuthenticatedRequest } from '../middleware/auth.middleware';

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password required' });
      return;
    }
    const result = await authService.login(String(email), String(password));
    res.json(result);
  } catch (err) {
    const s = (err as { statusCode?: number }).statusCode;
    if (s) { res.status(s).json({ error: (err as Error).message }); return; }
    next(err);
  }
};

export const logout = (_req: Request, res: Response): void => {
  res.json({ ok: true });
};

export const getMe = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await prisma.user.findUniqueOrThrow({ where: { id: req.user!.id } });
    res.json({ id: user.id, email: user.email, name: user.name, role: user.role });
  } catch (err) {
    next(err);
  }
};
