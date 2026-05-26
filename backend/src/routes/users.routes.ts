import { Router } from 'express';
import { listUsers, createUser, updateUserRole } from '../controllers/users.controller';
import { authorize } from '../middleware/auth.middleware';

export const usersRouter = Router();

usersRouter.get('/',           listUsers);
usersRouter.post('/',          createUser);
usersRouter.patch('/:id/role', authorize('ADMIN'), updateUserRole);
