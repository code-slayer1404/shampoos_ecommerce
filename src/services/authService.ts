import api from './api'

interface LoginPayload {
  email: string
  password: string
}

export interface AuthUser {
  _id: string
  name: string
  email: string
  role: string
  isBlocked?: boolean
}

export interface LoginResponse {
  token: string
  user: AuthUser
}

export const authService = {
  async adminLogin(payload: LoginPayload): Promise<LoginResponse> {
    const response = await api.post('/auth/login', payload)
    return response.data.data || response.data
  },
}
