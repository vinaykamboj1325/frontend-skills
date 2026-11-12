import { useState } from 'react';
import type { Category } from '@/api/products';
import { useProducts } from '@/hooks/useProducts';
import ProductDetails from '@/components/ProductDetails/ProductDetails';
import styles from './ProductsPage.module.css';

const formatPrice = (price: number, currency: string) =>
  new Intl.NumberFormat('en', { style: 'currency', currency }).format(price);

export function ProductsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<Category>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [saved, setSaved] = useState<string[]>([]);
  const { products, loading, error } = useProducts(search, category);

  const toggleSaved = (id: string) =>
    setSaved((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));

  return (
    <div className={styles.page}>
      <div className={styles.title}>Products</div>

      <div className={styles.filters}>
        <input
          className={styles.search}
          placeholder="Search products"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className={styles.select}
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
        >
          <option value="all">All</option>
          <option value="books">Books</option>
          <option value="games">Games</option>
          <option value="music">Music</option>
        </select>
      </div>

      {loading && <div className={styles.muted}>Loading…</div>}
      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.grid}>
        {products.map((product) => (
          <div
            key={product.id}
            className={product.id === selectedId ? styles.cardSelected : styles.card}
            onClick={() => setSelectedId(product.id)}
          >
            <img className={styles.image} src={product.imageUrl} />
            <div className={styles.name}>{product.name}</div>
            <div className={styles.muted}>{formatPrice(product.price, product.currency)}</div>
            <button
              className={styles.iconButton}
              onClick={(e) => {
                e.stopPropagation();
                toggleSaved(product.id);
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill={saved.includes(product.id) ? '#b91c1c' : 'none'} stroke="currentColor">
                <path d="M8 14s-5.5-3.6-5.5-7.4A3 3 0 0 1 8 5a3 3 0 0 1 5.5 1.6C13.5 10.4 8 14 8 14z" />
              </svg>
            </button>
          </div>
        ))}
      </div>
      {selectedId && <ProductDetails productId={selectedId} onClose={() => setSelectedId(null)} />}
    </div>
  );
}
