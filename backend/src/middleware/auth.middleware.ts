import { Request, Response, NextFunction } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const authenticate = (
  _req: AuthenticatedRequest,
  res: Response,
  _next: NextFunction
): void => {
  // TODO: extract Bearer token from Authorization header, verify with JWT,
  //       populate req.user, then call next()
  res.status(501).json({ message: 'Auth middleware not implemented' });
};

export const authorize = (..._roles: string[]) =>
  (_req: AuthenticatedRequest, res: Response, _next: NextFunction): void => {
    // TODO: check req.user.role against allowed roles
    res.status(501).json({ message: 'Authorization middleware not implemented' });
  };
