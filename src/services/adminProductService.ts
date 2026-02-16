import api from './api';

export interface AdminProductPayload {
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  inStock?: boolean;
}

export interface AdminProduct {
  _id?: string;
  id?: string | number;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  inStock?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface ProductListResponse {
  success?: boolean;
  data?: {
    products?: AdminProduct[];
    docs?: AdminProduct[];
    result?: AdminProduct[];
  } | AdminProduct[];
}

interface ProductResponse {
  success?: boolean;
  data?: {
    product?: AdminProduct;
  } | AdminProduct;
}

const getProductsFromResponse = (response: ProductListResponse): AdminProduct[] => {
  if (Array.isArray(response.data)) {
    return response.data;
  }

  if (response.data?.products) {
    return response.data.products;
  }

  if (response.data?.docs) {
    return response.data.docs;
  }

  if (response.data?.result) {
    return response.data.result;
  }

  return [];
};

const getProductFromResponse = (response: ProductResponse): AdminProduct => {
  if (!response.data) {
    throw new Error('Invalid API response: missing data');
  }

  if ('product' in response.data && response.data.product) {
    return response.data.product;
  }

  return response.data as AdminProduct;
};

export const adminProductService = {
  async getAll(): Promise<AdminProduct[]> {
    const response = await api.get<ProductListResponse>('/v1/products');
    return getProductsFromResponse(response.data);
  },

  async create(payload: AdminProductPayload): Promise<AdminProduct> {
    const response = await api.post<ProductResponse>('/v1/products', payload);
    return getProductFromResponse(response.data);
  },

  async update(productId: string, payload: Partial<AdminProductPayload>): Promise<AdminProduct> {
    const response = await api.patch<ProductResponse>(`/v1/products/${productId}`, payload);
    return getProductFromResponse(response.data);
  },

  async remove(productId: string): Promise<void> {
    await api.delete(`/v1/products/${productId}`);
  },
};
