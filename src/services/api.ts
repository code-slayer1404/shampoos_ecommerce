import axios from 'axios'

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || '/api/v1'
const AUTH_STORAGE_KEY = 'admin_auth'

let getAuthToken: (() => string | null) | null = null
let onUnauthorized: (() => void) | null = null

export const registerAuthTokenGetter = (getter: () => string | null) => {
  getAuthToken = getter
}

export const registerUnauthorizedHandler = (handler: () => void) => {
  onUnauthorized = handler
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  let token = getAuthToken?.() || null

  if (!token) {
    const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY)
    if (storedAuth) {
      try {
        token = JSON.parse(storedAuth)?.token || null
      } catch {
        token = null
      }
    }
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status
    if (status === 401 || status === 403) {
      onUnauthorized?.()
    }
    return Promise.reject(error)
  },
)

export default api
