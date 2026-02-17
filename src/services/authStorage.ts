const AUTH_TOKEN_KEY = 'admin_jwt_token'
const AUTH_USER_KEY = 'admin_auth_user'

export const authStorage = {
  getToken(): string | null {
    return localStorage.getItem(AUTH_TOKEN_KEY)
  },

  setToken(token: string) {
    localStorage.setItem(AUTH_TOKEN_KEY, token)
  },

  clearToken() {
    localStorage.removeItem(AUTH_TOKEN_KEY)
  },

  getUser<T>() {
    const raw = localStorage.getItem(AUTH_USER_KEY)
    if (!raw) return null

    try {
      return JSON.parse(raw) as T
    } catch {
      return null
    }
  },

  setUser(user: unknown) {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
  },

  clearUser() {
    localStorage.removeItem(AUTH_USER_KEY)
  },

  clear() {
    this.clearToken()
    this.clearUser()
  },
}

export { AUTH_TOKEN_KEY, AUTH_USER_KEY }
