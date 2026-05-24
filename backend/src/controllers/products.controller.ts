import { Request, Response } from 'express';

export const getProducts = async (_req: Request, res: Response): Promise<void> => {
  res.status(501).json({ message: 'Not implemented' });
};

export const getProduct = async (_req: Request, res: Response): Promise<void> => {
  res.status(501).json({ message: 'Not implemented' });
};

export const createProduct = async (_req: Request, res: Response): Promise<void> => {
  res.status(501).json({ message: 'Not implemented' });
};

export const updateProduct = async (_req: Request, res: Response): Promise<void> => {
  res.status(501).json({ message: 'Not implemented' });
};

export const deleteProduct = async (_req: Request, res: Response): Promise<void> => {
  res.status(501).json({ message: 'Not implemented' });
};
