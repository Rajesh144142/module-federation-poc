import type { Product } from '../../../shared/types/store';
import { CatalogToolbar } from './catalog/CatalogToolbar';
import { ProductCard } from './catalog/ProductCard';

interface ProductCatalogProps {
  products: Product[];
  isLoading: boolean;
  selectedCategory: string;
  searchTerm: string;
  categories: string[];
  onCategoryChange: (category: string) => void;
  onSearchTermChange: (value: string) => void;
  onAddToCart: (product: Product) => void;
}

export function ProductCatalog({
  products,
  isLoading,
  selectedCategory,
  searchTerm,
  categories,
  onCategoryChange,
  onSearchTermChange,
  onAddToCart,
}: ProductCatalogProps) {
  return (
    <section className="panel">
      <div className="section-heading">
        <div>
          <p className="section-label">Catalog module</p>
          <h2>Browse products</h2>
        </div>
        <span className="section-pill">{isLoading ? 'Updating...' : `${products.length} items`}</span>
      </div>

      <CatalogToolbar
        categories={categories}
        selectedCategory={selectedCategory}
        searchTerm={searchTerm}
        onCategoryChange={onCategoryChange}
        onSearchTermChange={onSearchTermChange}
      />

      {products.length === 0 && !isLoading ? (
        <div className="empty-results">No products match this filter.</div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
          ))}
        </div>
      )}
    </section>
  );
}
