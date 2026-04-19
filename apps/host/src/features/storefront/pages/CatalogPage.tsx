import type { Product } from '../../../shared/types/store';
import { ProductCatalog } from '../components/ProductCatalog';

interface CatalogPageProps {
  products: Product[];
  isLoading: boolean;
  selectedCategory: string;
  searchTerm: string;
  categories: string[];
  onCategoryChange: (category: string) => void;
  onSearchTermChange: (value: string) => void;
  onAddToCart: (product: Product) => void;
}

export function CatalogPage(props: CatalogPageProps) {
  return (
    <section className="page-stack">
      <ProductCatalog {...props} />
    </section>
  );
}
