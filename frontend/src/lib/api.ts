import axios, { AxiosError } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export type ApiResponse<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
  meta?: Record<string, unknown>;
};

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('rdg_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err: AxiosError<ApiResponse>) => {
    const status = err.response?.status;
    if ((status === 401 || status === 403) && typeof window !== 'undefined') {
      localStorage.removeItem('rdg_token');
      localStorage.removeItem('rdg_user');
    }
    return Promise.reject(err);
  }
);

function getErrorMessage(err: AxiosError<ApiResponse>): string {
  const data = err.response?.data;
  if (data && typeof data === 'object' && typeof data.message === 'string') {
    return data.message;
  }
  return err.message || 'Something went wrong';
}

export const healthApi = {
  check: () => api.get<{ status: string; message?: string }>('/health'),
};

export const authApi = {
  register: (name: string, email: string, password: string, phone?: string) =>
    api.post<ApiResponse<{ token: string; user: { id: string; name: string; email: string; role: string } }>>(
      '/auth/register',
      { name, email, password, phone }
    ),

  login: (email: string, password: string) =>
    api.post<ApiResponse<{ token: string; user: { id: string; name: string; email: string; role: string } }>>(
      '/auth/login',
      { email, password }
    ),

  getMe: () =>
    api.get<ApiResponse<{ _id: string; id?: string; name: string; email: string; role?: string }>>('/auth/me'),
  google: (idToken: string) => api.post('/auth/google', { idToken }),
};

export const productsApi = {
  getAll: (params?: { page?: number; limit?: number; category?: string; minPrice?: number; maxPrice?: number; inStock?: boolean; sort?: string }) =>
    api.get<ApiResponse<ApiProduct[]>>('/products', { params }),

  getById: (id: string) =>
    api.get<ApiResponse<ApiProduct>>(`/products/${id}`),

  search: (q: string, params?: { page?: number; limit?: number }) =>
    api.get<ApiResponse<ApiProduct[]>>('/products/search', { params: { q, ...params } }),
};

export const ordersApi = {
  create: (
    items: { product: string; quantity: number }[],
    shippingAddress: ShippingAddress,
    paymentMethod?: 'cod' | 'online',
    paymentScreenshot?: File | null
  ) => {
    // If a screenshot is provided, send as multipart/form-data
    if (paymentScreenshot) {
      const fd = new FormData()
      fd.append('items', JSON.stringify(items))
      fd.append('shippingAddress', JSON.stringify(shippingAddress))
      fd.append('paymentMethod', (paymentMethod || 'cod').toString())
      fd.append('paymentScreenshot', paymentScreenshot)
      return api.post<ApiResponse<Order>>('/orders', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    }
    return api.post<ApiResponse<Order>>('/orders', { items, shippingAddress, paymentMethod: paymentMethod || 'cod' })
  },

  getMy: (params?: { page?: number; limit?: number; status?: string }) =>
    api.get<ApiResponse<Order[]>>('/orders/my', { params }),

  getById: (id: string) =>
    api.get<ApiResponse<Order>>(`/orders/${id}`),
};

export type ApiProduct = {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type ShippingAddress = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
};

export type OrderItem = {
  product: { _id: string; name?: string; price?: number; images?: string[] };
  quantity: number;
  price?: number;
};

export type Order = {
  _id: string;
  user?: { _id: string; name?: string; email?: string };
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: ShippingAddress;
  status: string;
  paymentStatus?: string;
  createdAt?: string;
};

export { api, getErrorMessage };

/** Map API product to display Product format */
export function apiProductToDisplay(p: ApiProduct): {
  id: string;
  name: string;
  weight: string;
  price: number;
  image: string;
  description: string;
  rating: number;
  reviews: number;
  tag?: string;
} {
  return {
    id: p._id,
    name: p.name ?? '',
    weight: p.category ?? '500g',
    price: p.price ?? 0,
    image: Array.isArray(p.images) && p.images[0] ? p.images[0] : '',
    description: p.description ?? '',
    rating: 0,
    reviews: 0,
  };
}
