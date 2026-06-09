import { formatPrice } from '../utils/formatters';
import { isInStock } from '../models/Product';

export function ProductCard({ product, onAddToCart }) {
  const inStock = isInStock(product);

  return (
    <div className="product-card" data-testid="product-card">
      {product.imageUrl && (
        <img
          src={product.imageUrl}
          alt={product.name}
          className="product-card__image"
        />
      )}
      <h3 className="product-card__name">{product.name}</h3>
      <p className="product-card__price">{formatPrice(product.price)}</p>
      {product.rating > 0 && (
        <span className="product-card__rating" data-testid="product-rating">
          {'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}
        </span>
      )}
      <p className="product-card__stock" data-testid="stock-status">
        {inStock ? `${product.stock} in stock` : 'Out of stock'}
      </p>
      <button
        onClick={() => onAddToCart?.(product)}
        disabled={!inStock}
        data-testid="add-to-cart-btn"
      >
        {inStock ? 'Add to Cart' : 'Unavailable'}
      </button>
    </div>
  );
}
