import { productsApi, type ProductsParams } from '@/services/products.service';
import { useQuery } from '@tanstack/react-query';

export const PRODUCTS_QUERY_KEY = ['products'] as const;

export function useProducts(params?: ProductsParams) {
  return useQuery({
    queryKey: [...PRODUCTS_QUERY_KEY, params],
    queryFn:  () => productsApi.list(params).then((r) => r.data),
  });
}
