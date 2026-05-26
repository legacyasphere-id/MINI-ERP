import { apiClient } from './api';
import type { User, UserRole } from '@/types/user.types';

export const usersApi = {
  list() {
    return apiClient.get<User[]>('/users');
  },
  create(data: { email: string; name: string; role: UserRole; password: string }) {
    return apiClient.post<User>('/users', data);
  },
  updateRole(id: string, role: UserRole) {
    return apiClient.patch<User>(`/users/${id}/role`, { role });
  },
};
