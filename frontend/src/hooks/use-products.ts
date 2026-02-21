'use client';

import { useState, useEffect, useCallback } from 'react';
import { productsApi, apiProductToDisplay } from '@/lib/api';
import type { Product } from '@/app/context/app-context';

type UseProductsOptions = {
  page?: number;
  limit?: number;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sort?: string;
};

type UseProductsResult = {
  products: Product[];
  loading: boolean;
  error: string | null;
  meta: { total: number; page: number; pages: number; count: number } | null;
  refetch: () => void;
};

export function useProducts(options: UseProductsOptions = {}): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<{ total: number; page: number; pages: number; count: number } | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await productsApi.getAll(options);
      const payload = res.data;
      
      if (!payload?.success) {
        setProducts([]);
        setMeta(null);
        setError(payload?.message ?? 'Failed to load products');
        return;
      }

      // Extract products array - handle both formats:
      // 1. data as array: response.data.data = Product[]
      // 2. data as object with products field: response.data.data = { products: Product[], ... }
      let productsArray: unknown[] = [];
      if (Array.isArray(payload.data)) {
        productsArray = payload.data;
      } else if (payload.data && typeof payload.data === 'object' && Array.isArray((payload.data as any)?.products)) {
        productsArray = (payload.data as any).products;
      } else {
        setProducts([]);
        setMeta(null);
        setError('Invalid product data format');
        return;
      }

      // Map products to display format
      setProducts(productsArray.map(apiProductToDisplay));

      // Extract pagination metadata
      let pagination = { total: 0, page: 1, pages: 1, count: 0 };
      
      // Try to get meta from response.meta first
      if (payload.meta && typeof payload.meta === 'object') {
        const m = payload.meta as { total?: number; page?: number; pages?: number; count?: number };
        pagination = {
          total: m.total ?? 0,
          page: m.page ?? 1,
          pages: m.pages ?? 1,
          count: m.count ?? productsArray.length,
        };
      }
      // If no meta field, try to get from data object (nested format)
      else if (payload.data && typeof payload.data === 'object' && !Array.isArray(payload.data)) {
        const d = payload.data as { total?: number; page?: number; pages?: number; limit?: number; count?: number };
        pagination = {
          total: d.total ?? productsArray.length,
          page: d.page ?? 1,
          pages: d.pages ?? Math.ceil((d.total ?? productsArray.length) / (d.limit ?? 10)),
          count: d.count ?? productsArray.length,
        };
      }
      // Fallback: calculate from array length
      else {
        pagination = {
          total: productsArray.length,
          page: 1,
          pages: 1,
          count: productsArray.length,
        };
      }

      setMeta(pagination);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } }; message?: string };
      const msg =
        axiosErr?.response?.data?.message ??
        axiosErr?.message ??
        'Failed to load products';
      setError(msg);
      setProducts([]);
      setMeta(null);
    } finally {
      setLoading(false);
    }
  }, [
    options.page,
    options.limit,
    options.category,
    options.minPrice,
    options.maxPrice,
    options.inStock,
    options.sort,
  ]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, meta, refetch: fetchProducts };
}
