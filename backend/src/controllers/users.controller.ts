import { Response, NextFunction } from 'express';
import { usersService } from '../services/users.service';
import type { AuthenticatedRequest } from '../middleware/auth.middleware';
import type { Role } from '@prisma/client';

const VALID_ROLES: Role[] = ['ADMIN', 'MANAGER', 'STAFF'];

export const listUsers = async (
  _req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    res.json(await usersService.list());
  } catch (err) {
    next(err);
  }
};

export const createUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email, name, role, password } = req.body;
    if (!email || !name || !password) {
      res.status(400).json({ error: 'email, name, and password are required' });
      return;
    }
    const userRole: Role = VALID_ROLES.includes(role) ? role : 'STAFF';
    const user = await usersService.create(String(email), String(name), userRole, String(password));
    res.status(201).json(user);
  } catch (err) {
    const s = (err as { statusCode?: number }).statusCode;
    if (s) { res.status(s).json({ error: (err as Error).message }); return; }
    next(err);
  }
};

export const updateUserRole = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (!VALID_ROLES.includes(role)) {
      res.status(400).json({ error: 'Invalid role. Must be ADMIN, MANAGER, or STAFF' });
      return;
    }
    res.json(await usersService.updateRole(id, role as Role));
  } catch (err) {
    next(err);
  }
};
