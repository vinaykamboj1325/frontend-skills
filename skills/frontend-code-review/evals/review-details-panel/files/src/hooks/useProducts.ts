import { useEffect, useState } from 'react';
import { fetchProducts, type Category, type Product } from '@/api/products';

interface UseProductsResult {
  products: Product[];
  loading: boolean;
  error: string | null;
}

export function useProducts(search: string, category: Category): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchProducts({ search, category })
      .then((data) => {
        setProducts(data);
      })
      .catch(() => {
        setError('Could not load products');
      })
      .finally(() => {
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return { products, loading, error };
}
