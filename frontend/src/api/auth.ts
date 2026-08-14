import apiClient from './client'
import type { LoginRequest, RegisterRequest, TokenResponse, User } from '@/types'

export const authApi = {
  login: (data: LoginRequest): Promise<TokenResponse> =>
    apiClient.post('/auth/login', data),

  register: (data: RegisterRequest): Promise<TokenResponse> =>
    apiClient.post('/auth/register', data),

  logout: (): Promise<void> =>
    apiClient.post('/auth/logout'),

  refreshToken: (refreshToken: string): Promise<TokenResponse> =>
    apiClient.post('/auth/refresh', { refresh_token: refreshToken }),

  getMe: (): Promise<User> =>
    apiClient.get('/auth/me'),
}
