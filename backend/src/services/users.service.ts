import bcrypt from 'bcrypt';
import { prisma } from './prisma.service';
import type { Role } from '@prisma/client';

export const usersService = {
  async list() {
    return prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true, createdAt: true, updatedAt: true },
      orderBy: { createdAt: 'asc' },
    });
  },

  async create(email: string, name: string, role: Role, password: string) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw Object.assign(new Error('Email already in use'), { statusCode: 409 });
    const passwordHash = await bcrypt.hash(password, 10);
    return prisma.user.create({
      data: { email, name, role, passwordHash },
      select: { id: true, email: true, name: true, role: true, createdAt: true, updatedAt: true },
    });
  },

  async updateRole(id: string, role: Role) {
    return prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, email: true, name: true, role: true, createdAt: true, updatedAt: true },
    });
  },
};
