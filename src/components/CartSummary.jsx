import { formatPrice } from '../utils/formatters';
import { calculateTotal } from '../utils/cart';

export function CartSummary({ items, taxRate = 0.08, shippingMethod = 'standard' }) {
  if (!items || items.length === 0) {
    return <p data-testid="empty-cart">Your cart is empty</p>;
  }

  const { subtotal, tax, shipping, total } = calculateTotal(items, taxRate, shippingMethod);

  return (
    <div data-testid="cart-summary">
      <h2>Order Summary</h2>
      <ul>
        {items.map((item) => (
          <li key={item.id} data-testid="cart-item">
            {item.name} × {item.quantity} — {formatPrice(item.price * item.quantity)}
          </li>
        ))}
      </ul>
      <div data-testid="subtotal">Subtotal: {formatPrice(subtotal)}</div>
      <div data-testid="tax">Tax: {formatPrice(tax)}</div>
      <div data-testid="shipping">
        Shipping: {shipping === 0 ? 'FREE' : formatPrice(shipping)}
      </div>
      <div data-testid="total"><strong>Total: {formatPrice(total)}</strong></div>
    </div>
  );
}
