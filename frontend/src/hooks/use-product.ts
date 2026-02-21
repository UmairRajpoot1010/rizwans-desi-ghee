'use client';

import { useState, useEffect, useCallback } from 'react';
import { productsApi, apiProductToDisplay } from '@/lib/api';
import type { Product } from '@/app/context/app-context';

type UseProductResult = {
  product: Product | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
};

export function useProduct(id: string | null): UseProductResult {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = useCallback(async () => {
    if (!id) {
      setProduct(null);
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await productsApi.getById(id);
      const payload = res.data;
      
      if (!payload?.success) {
        setProduct(null);
        setError(payload?.message ?? 'Product not found');
        return;
      }

      // Extract product - handle both formats:
      // 1. data as product object directly: response.data.data = Product
      // 2. data as object with product field: response.data.data = { product: Product, ... }
      let productData: unknown = null;
      
      if (payload.data && typeof payload.data === 'object' && !Array.isArray(payload.data)) {
        // Check if it has a product field (nested format)
        if ((payload.data as any)?.product) {
          productData = (payload.data as any).product;
        } else if ((payload.data as any)?._id) {
          // If it has _id field, it's likely a product object directly
          productData = payload.data;
        }
      }

      if (productData) {
        setProduct(apiProductToDisplay(productData as any));
      } else {
        setProduct(null);
        setError('Invalid product data format');
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } }; message?: string };
      const msg =
        axiosErr?.response?.data?.message ??
        axiosErr?.message ??
        'Failed to load product';
      setError(msg);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return { product, loading, error, refetch: fetchProduct };
}
