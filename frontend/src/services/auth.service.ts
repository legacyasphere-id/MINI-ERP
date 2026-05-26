import { apiClient } from './api';
import type { User } from '@/types/user.types';

interface LoginInput {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

export const authApi = {
  login: (data: LoginInput) =>
    apiClient.post<AuthResponse>('/auth/login', data).then((r) => r.data),

  logout: () =>
    apiClient.post('/auth/logout').then((r) => r.data),

  getMe: () =>
    apiClient.get<User>('/auth/me').then((r) => r.data),
};
