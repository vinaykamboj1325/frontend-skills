import { get } from './client';

export type Category = 'all' | 'books' | 'games' | 'music';

export interface Product {
  id: string;
  name: string;
  price: number;
  currency: string;
  imageUrl: string;
  category: Exclude<Category, 'all'>;
}

export interface ProductQuery {
  search: string;
  category: Category;
}

export function fetchProducts({ search, category }: ProductQuery): Promise<Product[]> {
  return get<Product[]>('/products', {
    search: search || undefined,
    category: category === 'all' ? undefined : category,
  });
}
