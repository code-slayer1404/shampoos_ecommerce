import api from './api'

export interface DashboardStats {
  totalOrders: number
  totalProducts: number
  totalUsers: number
  revenue: number
}

export interface ProductFormData {
  name: string
  price: number
  stock: number
  category: string
  description: string
}

export interface Product extends ProductFormData {
  _id: string
  createdAt?: string
}

export interface Order {
  _id: string
  user?: { name?: string; email?: string }
  totalPrice: number
  status: string
  trackingId?: string
  createdAt?: string
  items?: Array<{ name?: string; quantity?: number; price?: number }>
}

export interface AppUser {
  _id: string
  name: string
  email: string
  role?: string
  isBlocked?: boolean
}

const unwrap = <T,>(response: any): T => response.data.data || response.data

export const adminService = {
  async getDashboard(): Promise<DashboardStats> {
    try {
      const response = await api.get('/admin/dashboard')
      return unwrap<DashboardStats>(response)
    } catch (error: any) {
      if (error?.response?.status === 404) {
        return {
          totalOrders: 0,
          totalProducts: 0,
          totalUsers: 0,
          revenue: 0,
        }
      }
      throw error
    }
  },

  async getProducts(page = 1, limit = 10): Promise<{ items: Product[]; total: number }> {
    const response = await api.get('/products', { params: { page, limit } })
    const payload = unwrap<any>(response)
    if (Array.isArray(payload)) {
      return { items: payload, total: payload.length }
    }
    return {
      items: payload.products || payload.items || [],
      total: payload.total || payload.count || 0,
    }
  },

  async createProduct(payload: ProductFormData): Promise<Product> {
    const response = await api.post('/products', payload)
    return unwrap<Product>(response)
  },

  async updateProduct(id: string, payload: ProductFormData): Promise<Product> {
    const response = await api.patch(`/products/${id}`, payload)
    return unwrap<Product>(response)
  },

  async deleteProduct(id: string): Promise<void> {
    await api.delete(`/products/${id}`)
  },

  async getOrders(page = 1, limit = 10): Promise<{ items: Order[]; total: number }> {
    const response = await api.get('/orders', { params: { page, limit } })
    const payload = unwrap<any>(response)
    if (Array.isArray(payload)) {
      return { items: payload, total: payload.length }
    }
    return {
      items: payload.orders || payload.items || [],
      total: payload.total || payload.count || 0,
    }
  },

  async getOrderDetails(id: string): Promise<Order> {
    const response = await api.get(`/orders/${id}`)
    return unwrap<Order>(response)
  },

  async updateOrder(id: string, payload: { status: string; trackingId?: string }): Promise<Order> {
    const response = await api.patch(`/orders/${id}`, payload)
    return unwrap<Order>(response)
  },

  async getUsers(page = 1, limit = 10): Promise<{ items: AppUser[]; total: number }> {
    const response = await api.get('/users', { params: { page, limit } })
    const payload = unwrap<any>(response)
    if (Array.isArray(payload)) {
      return { items: payload, total: payload.length }
    }
    return {
      items: payload.users || payload.items || [],
      total: payload.total || payload.count || 0,
    }
  },

  async updateUser(id: string, payload: { isBlocked: boolean }): Promise<AppUser> {
    const response = await api.patch(`/users/${id}`, payload)
    return unwrap<AppUser>(response)
  },
}
