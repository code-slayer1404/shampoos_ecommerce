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

const getToken = (primary: any, fallback: any): string | null => {
  return primary?.token || primary?.accessToken || primary?.jwt || fallback?.token || fallback?.accessToken || fallback?.jwt || null
}

const getUser = (primary: any, fallback: any): AuthUser | null => {
  return primary?.user || primary?.admin || primary?.profile || fallback?.user || fallback?.admin || fallback?.profile || null
}

export const authService = {
  async adminLogin(payload: LoginPayload): Promise<LoginResponse> {
    const response = await api.post('/auth/login', payload)
    const rawPayload = response?.data || {}
    const nestedPayload = rawPayload?.data || {}
    const token = getToken(nestedPayload, rawPayload)
    const user = getUser(nestedPayload, rawPayload)

    if (!token || !user) {
      throw new Error('Invalid login response payload')
    }

    return { token, user }
  },
}
