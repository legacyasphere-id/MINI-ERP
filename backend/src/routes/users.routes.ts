import { Router } from 'express';
import { listUsers, createUser, updateUserRole } from '../controllers/users.controller';

export const usersRouter = Router();

usersRouter.get('/',           listUsers);
usersRouter.post('/',          createUser);
usersRouter.patch('/:id/role', updateUserRole);
