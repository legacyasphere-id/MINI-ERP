import { Request, Response } from 'express';

export const login = async (_req: Request, res: Response): Promise<void> => {
  res.status(501).json({ message: 'Not implemented' });
};

export const logout = async (_req: Request, res: Response): Promise<void> => {
  res.status(501).json({ message: 'Not implemented' });
};

export const getMe = async (_req: Request, res: Response): Promise<void> => {
  res.status(501).json({ message: 'Not implemented' });
};
