import type { Product } from '../../../../shared/types/store';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <article className="product-card">
      <img src={product.image} alt={product.name} className="product-image" loading="lazy" />
      <p className="product-badge">{product.badge}</p>
      <h3>{product.name}</h3>
      <p className="product-category">{product.category}</p>
      <p className="product-description">{product.description}</p>
      <div className="product-meta">
        <span>{product.rating.toFixed(1)} rating</span>
        <span>{product.stock} in stock</span>
      </div>
      <div className="product-footer">
        <strong>Rs. {product.price}</strong>
        <button type="button" onClick={() => onAddToCart(product)}>
          Add to cart
        </button>
      </div>
    </article>
  );
}
